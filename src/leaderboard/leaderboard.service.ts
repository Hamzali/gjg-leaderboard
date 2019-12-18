import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { LeaderboardItem } from './leaderboard-item.interface';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.interface';

const LEADERBOARD_PREFIX = 'leaderboard:';
const GLOBAL_LEADERBOARD_KEY = 'GLOBAL';

/**
 * Leaderboard Service
 * Leaderboard operations and bussiness logic.
 */
@Injectable()
export class LeaderboardService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initialize leaderboards if the setup flag is set to true
   */
  async onModuleInit() {
    if (this.configService.get('redisSetup')) {
      await this.redisService.clearAll();
      await this.userService.findAllStream(
        ({ _id: userId, display_name, country, points }: User) => {
          this.insertUserToLeaderboard(
            userId,
            display_name,
            country,
            points,
          ).catch(error => console.error('redis insert error', error));
        },
      );
    }
  }

  /**
   * Generates redis key of the entry
   * @param userId
   * @param displayName
   * @param country
   */
  private toUserKey(userId: string, displayName: string, country?: string) {
    return `${displayName}:${userId}${country == null ? '' : ':' + country}`;
  }

  /**
   * Insert a user into the global and local leaderboard
   * @param userId
   * @param displayName
   * @param country
   * @param points
   */
  insertUserToLeaderboard(
    userId: string,
    displayName: string,
    country: string,
    points: number,
  ) {
    const userKey = this.toUserKey(userId, displayName, country);
    return Promise.all([
      this.redisService.sortedSetAddElement(
        LEADERBOARD_PREFIX + country,
        userKey,
        points,
      ),
      this.redisService.sortedSetAddElement(
        LEADERBOARD_PREFIX + GLOBAL_LEADERBOARD_KEY,
        userKey,
        points,
      ),
    ]);
  }

  /**
   * Update a user local and global leaderboard score
   * @param userId
   * @param displayName
   * @param country
   * @param score
   */
  updateUserScore(
    userId: string,
    displayName: string,
    country: string,
    score: number,
  ) {
    const userKey = this.toUserKey(userId, displayName, country);
    return Promise.all([
      this.redisService.sortedSetIncElement(
        LEADERBOARD_PREFIX + country,
        userKey,
        score,
      ),
      this.redisService.sortedSetIncElement(
        LEADERBOARD_PREFIX + GLOBAL_LEADERBOARD_KEY,
        userKey,
        score,
      ),
    ]);
  }

  /**
   * Calculate a user rank.
   * @param userId
   * @param displayName
   * @param country
   * @returns local and global rank of the user.
   */
  async getUserRank(userId: string, displayName: string, country: string) {
    const userKey = this.toUserKey(userId, displayName, country);
    const [localRank, globalRank] = await Promise.all([
      this.redisService.sortedSetGetElementRank(
        LEADERBOARD_PREFIX + country,
        userKey,
      ),
      this.redisService.sortedSetGetElementRank(
        LEADERBOARD_PREFIX + GLOBAL_LEADERBOARD_KEY,
        userKey,
      ),
    ]);
    return { localRank, globalRank };
  }

  /**
   * Format the redis result.
   * @param result
   * @returns structred leaderboard list.
   */
  private formatLeaderboardResult(result: string[]): LeaderboardItem[] {
    const formattedResult = [];
    for (let i = 0; i < result.length - 1; i += 2) {
      const [displayName, userId, country] = result[i].split(':');
      const points = Number(result[i + 1]);
      formattedResult.push({
        display_name: displayName,
        user_id: userId,
        points,
        rank: i / 2,
        country,
      });
    }
    return formattedResult;
  }

  /**
   * Find a range of global or local leaderboard by score.
   * @param start
   * @param end
   * @param country
   */
  async getRangeOfLeaderboard(start: number, end: number, country?: string) {
    const result = await this.redisService.sortedSetGetRange(
      LEADERBOARD_PREFIX + (country == null ? GLOBAL_LEADERBOARD_KEY : country),
      start,
      end,
    );
    return this.formatLeaderboardResult(result);
  }

  /**
   * Calculate global or local leaderboard.
   * @param country
   * @returns full formatted leaderboard list.
   */
  async getAllLeaderboard(country?: string) {
    const result = await this.redisService.sortedSetGet(
      LEADERBOARD_PREFIX + (country == null ? GLOBAL_LEADERBOARD_KEY : country),
    );
    return this.formatLeaderboardResult(result);
  }
}
