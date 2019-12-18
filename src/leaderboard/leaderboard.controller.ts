import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('/:country')
  @ApiParam({
    name: 'country',
    description: 'two character long ISO country code.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns leaderboard of given country code.',
  })
  getByCountry(@Param('country') country) {
    return this.leaderboardService.getAllLeaderboard(country);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns global leaderboard.',
  })
  getGlobal() {
    return this.leaderboardService.getAllLeaderboard();
  }
}
