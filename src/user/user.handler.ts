import { ScoreSubmitedEvent } from '../score/scoreSubmited.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserService } from './user.service';

@EventsHandler(ScoreSubmitedEvent)
export class UserScoreSubmitedEventHandler
  implements IEventHandler<ScoreSubmitedEvent> {
  constructor(private readonly userService: UserService) {}

  async handle(event: ScoreSubmitedEvent) {
    await this.userService.updateScoreById(event.userId, event.scoreWorth);
    console.log('user score updated', event);
  }
}
