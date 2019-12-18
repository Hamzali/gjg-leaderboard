import { Module, forwardRef } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import {
  LeaderboardScoreSubmitedEventHandler,
  LeaderboardUserCreatedEventHandler,
} from './leaderboard.handler';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RedisModule, forwardRef(() => UserModule), ConfigModule],
  controllers: [LeaderboardController],
  providers: [
    LeaderboardService,
    LeaderboardScoreSubmitedEventHandler,
    LeaderboardUserCreatedEventHandler,
  ],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
