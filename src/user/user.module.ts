import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { UserScoreSubmitedEventHandler } from './user.handler';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => LeaderboardModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserScoreSubmitedEventHandler],
  exports: [UserService],
})
export class UserModule {}
