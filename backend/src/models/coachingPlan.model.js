import { Schema, model } from 'mongoose';

const coachingPlanSchema = new Schema(
  {
    call: { type: Schema.Types.ObjectId, ref: 'Call', required: true },

    recommendations: [String],
    nextSteps: String,
  },
  { timestamps: true },
);

export default model('CoachingPlan', coachingPlanSchema);
