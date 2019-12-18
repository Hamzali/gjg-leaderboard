import { ApiProperty } from '@nestjs/swagger';

export class SubmitScoreDto {
  @ApiProperty({
    description: 'Score value',
    type: Number,
    minimum: 0,
  })
  readonly score_worth: number;
  @ApiProperty({
    description: 'Unique id of the user',
    type: String,
  })
  readonly user_id: string;
}
