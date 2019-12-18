import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Score } from './score.interface';

/**
 * Score service
 * contains bussiness logic for score domain objects.
 */
@Injectable()
export class ScoreService {
  constructor(
    @InjectModel('Score') private readonly scoreModel: Model<Score>,
  ) {}

  /**
   * Create score entry with current timestamp
   * @param userId
   * @param scoreWorth
   * @returns timestamp of the score entry
   */
  async submit(userId: string, scoreWorth: number) {
    const newScore = new this.scoreModel({
      user_id: userId,
      score_worth: scoreWorth,
    });
    await newScore.save();
    return newScore.timestamp;
  }

  /**
   * Finds all score records.
   * @returns array of scores.
   */
  findAll() {
    return this.scoreModel.find({});
  }
}
