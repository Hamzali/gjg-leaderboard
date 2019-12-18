import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  redis: Redis.Redis;
  constructor(readonly configService: ConfigService) {
    //  setup redis connection
    const redisUrl = this.configService.get('redisUrl');
    this.redis = new Redis(redisUrl);
  }

  sortedSetAddElement(key: string, item: string, score: number) {
    return this.redis.zadd(key, String(score), item);
  }

  sortedSetIncElement(key: string, item: string, score: number) {
    return this.redis.zincrby(key, score, item);
  }

  sortedSetGetElementRank(key: string, item: string) {
    return this.redis.zrevrank(key, item);
  }

  sortedSetGetRange(key: string, start: number, end: number) {
    return this.redis.zrevrangebyscore(key, start, end, 'WITHSCORES');
  }

  sortedSetGet(key: string) {
    return this.redis.zrevrange(key, 0, -1, 'WITHSCORES');
  }

  clearAll() {
    return this.redis.flushall();
  }
}
