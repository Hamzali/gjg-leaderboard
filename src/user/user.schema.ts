import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  display_name: String,
  points: Number,
  global_rank: Number,
  local_rank: Number,
  country: String,
});
