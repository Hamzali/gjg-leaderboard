import * as mongoose from 'mongoose';

export const ScoreSchema = new mongoose.Schema({
  timestamp: {
    type: Number,
    default: Date.now,
  },
  score_worth: Number,
  user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
