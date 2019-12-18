import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  readonly display_name: string;
  readonly points: number;
  readonly global_rank: number;
  readonly local_rank: number;
  readonly country: string;
}
