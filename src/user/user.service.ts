import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.interface';
import { UserRankUpdateOperation } from './user-rank-update-operation.interface';

/**
 * User service
 * contains bussiness logic for user domain objects.
 */
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  /**
   * Creates a user with given display name and initial points
   * @param displayName - display name of the user
   * @param country - 2 character iso country code
   * @param points - initial points of user
   * @returns - created user's user id
   */
  async create(
    displayName: string,
    country: string,
    points: number = 0,
  ): Promise<User> {
    const newUser = new this.userModel({
      display_name: displayName,
      points,
      country,
    });
    const result = await newUser.save();
    return result;
  }

  /**
   * Find a user profile
   * @param userId string
   */
  findProfile(userId: string) {
    return this.userModel
      .findById(userId)
      .select({ __v: false })
      .lean();
  }

  /**
   * Update score of a user.
   * @param userId
   * @param score
   */
  updateScoreById(userId: string, score: number) {
    return this.userModel
      .updateOne(
        {
          _id: userId,
        },
        {
          $inc: {
            points: score,
          },
        },
      )
      .exec();
  }

  /**
   * Updates the rank of a user.
   * @param rankOp rank update object with user id
   */
  updateRankById(rankOp: UserRankUpdateOperation) {
    const updateObject: any = {};
    if (rankOp.globalRank != null) {
      updateObject.global_rank = rankOp.globalRank;
    }
    if (rankOp.localRank != null) {
      updateObject.local_rank = rankOp.localRank;
    }
    return this.userModel
      .updateOne(
        {
          _id: rankOp.userId,
        },
        updateObject,
      )
      .exec();
  }

  /**
   * Bulk updates user ranks.
   * @param opeartions list of rank update object with user id
   */
  bulkUpdateRankByIds(opeartions: UserRankUpdateOperation[]) {
    const bulkOperation = this.userModel.collection.initializeUnorderedBulkOp();
    opeartions.forEach(op => {
      const updateObject: any = {};
      if (op.globalRank != null) {
        updateObject.global_rank = op.globalRank;
      }
      if (op.localRank != null) {
        updateObject.local_rank = op.localRank;
      }
      bulkOperation.find({ _id: op.userId }).updateOne(updateObject);
    });
    return bulkOperation.execute();
  }

  /**
   * Find all users in the database.
   * @return array of users
   */
  findAll() {
    return this.userModel.find({});
  }

  /**
   * Find all user and stream the result.
   * @param onUserFound callback for each found user
   */
  findAllStream(onUserFound: (user: User) => void) {
    return new Promise((resolve, reject) => {
      const cursor = this.userModel.find().cursor();
      cursor.on('data', onUserFound);
      cursor.on('end', resolve);
      cursor.on('error', reject);
    });
  }
}
