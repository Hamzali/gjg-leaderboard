import { ScoreSubmitedEvent } from '../score/scoreSubmited.event';
import { UserCreatedEvent } from '../user/userCreated.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LeaderboardService } from './leaderboard.service';
import { UserService } from '../user/user.service';

@EventsHandler(ScoreSubmitedEvent)
export class LeaderboardScoreSubmitedEventHandler
  implements IEventHandler<ScoreSubmitedEvent> {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly userService: UserService,
  ) {}

  async handle(event: ScoreSubmitedEvent) {
    // logic
    const user = await this.userService.findProfile(event.userId);
    await this.leaderboardService.updateUserScore(
      event.userId,
      user.display_name,
      user.country,
      event.scoreWorth,
    );
    console.log('score submit updated leaderboard', event);
  }
}

@EventsHandler(UserCreatedEvent)
export class LeaderboardUserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  async handle(event: UserCreatedEvent) {
    try {
      await this.leaderboardService.insertUserToLeaderboard(
        event.userId,
        event.displayName,
        event.country,
        event.points,
      );
      console.log('user created and added to leaderboard', event);
    } catch (error) {
      console.error('leaderboard user create event error', error);
      setTimeout(() => this.handle(event), 5000);
    }
  }
}
