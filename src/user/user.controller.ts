import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from './userCreated.event';
import { isValidCountryCode, isValidDisplayName } from '../common/utils';
import {
  userNotFound,
  invalidCountryCode,
  invalidDisplayName,
} from '../common/errors';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  @Get('profile/:userId')
  @ApiParam({
    name: 'userId',
    description: 'User unique id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The founded user record is returned.',
  })
  @ApiResponse({ status: 404, description: 'User id does not exist.' })
  async readProfile(@Param('userId') userId) {
    const profile = await this.userService.findProfile(userId);
    if (profile == null) {
      userNotFound(userId);
    }
    const { localRank, globalRank } = await this.leaderboardService.getUserRank(
      userId,
      profile.display_name,
      profile.country,
    );
    const { _id, ...userData } = profile;
    await this.userService.updateRankById({ userId, localRank, globalRank });
    return {
      user_id: _id,
      ...userData,
      local_rank: localRank,
      global_rank: globalRank,
    };
  }

  @Post('create')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input provided.' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    if (!isValidCountryCode(createUserDto.country)) {
      invalidCountryCode(createUserDto.country);
    }
    if (!isValidDisplayName(createUserDto.display_name)) {
      invalidDisplayName(createUserDto.display_name);
    }
    const {
      _id,
      display_name,
      points,
      country,
    } = await this.userService.create(
      createUserDto.display_name,
      createUserDto.country.toLowerCase(),
      createUserDto.points,
    );
    this.eventBus.publish(
      new UserCreatedEvent(_id, display_name, points, country),
    );
    return { user_id: _id };
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The founded user records are returned.',
  })
  readAll() {
    return this.userService.findAll();
  }
}
