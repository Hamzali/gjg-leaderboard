import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Display name of the user',
    type: String,
    maxLength: 10,
    minLength: 2,
  })
  readonly display_name: string;
  @ApiProperty({
    description: 'Two character ISO country code',
    type: String,
    maxLength: 2,
  })
  readonly country: string;
  @ApiProperty({
    description: 'Initial points of the user',
    type: Number,
    minimum: 0,
  })
  readonly points?: number;
}
