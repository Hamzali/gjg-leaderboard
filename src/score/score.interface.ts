import { Document } from 'mongoose';

export interface Score extends Document {
  readonly _id: string;
  readonly user_id: string;
  readonly score_worth: number;
  readonly timestamp: number;
}
