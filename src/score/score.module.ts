import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { ScoreSchema } from './score.schema';
import { UserModule } from '../user/user.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    UserModule,
    MongooseModule.forFeature([{ name: 'Score', schema: ScoreSchema }]),
  ],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
