import { Controller, Get, Post, Body } from '@nestjs/common';
import { ScoreService } from './score.service';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { UserService } from '../user/user.service';
import { EventBus } from '@nestjs/cqrs';
import { ScoreSubmitedEvent } from './scoreSubmited.event';
import { userNotFound, invalidObjectId, invalidScore } from '../common/errors';
import { isValidObjectId, isValidScore } from '../common/utils';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('score')
@Controller('score')
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
  ) {}

  @Get()
  readAll() {
    return this.scoreService.findAll();
  }

  @Post('submit')
  @ApiResponse({
    status: 200,
    description: 'Creates the score entry and updates user points.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters.',
  })
  async submitScore(@Body() submitScoreDto: SubmitScoreDto) {
    if (!isValidObjectId(submitScoreDto.user_id)) {
      invalidObjectId();
    }
    if (!isValidScore(submitScoreDto.score_worth)) {
      invalidScore();
    }
    const user = await this.userService.findProfile(submitScoreDto.user_id);
    if (user == null) {
      userNotFound(submitScoreDto.user_id);
    }
    const { user_id, score_worth } = submitScoreDto;
    const timestamp = await this.scoreService.submit(user_id, score_worth);
    this.eventBus.publish(
      new ScoreSubmitedEvent(user_id, score_worth, timestamp),
    );
    return { timestamp };
  }
}
