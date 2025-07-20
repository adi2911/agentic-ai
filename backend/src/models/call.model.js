import { Schema, model } from 'mongoose';

const callSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed'],
      default: 'uploaded',
    },
    durationSeconds: Number,

    transcript: { type: Schema.Types.ObjectId, ref: 'Transcript' },
    analysis: { type: Schema.Types.ObjectId, ref: 'Analysis' },
    coachingPlan: { type: Schema.Types.ObjectId, ref: 'CoachingPlan' },
  },
  { timestamps: true },
);

export default model('Call', callSchema);
