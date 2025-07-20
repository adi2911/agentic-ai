import { Schema, model } from 'mongoose';

const analysisSchema = new Schema(
  {
    call: { type: Schema.Types.ObjectId, ref: 'Call', required: true },

    metrics: {
      talkToListenRatio: Number,
      fillerWordCount: Number,
      sentimentScore: Number,
      customScores: Schema.Types.Mixed, // any other dynamic scores
    },

    summary: String,
  },
  { timestamps: true },
);

export default model('Analysis', analysisSchema);
