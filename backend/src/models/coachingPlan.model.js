import { Schema, model } from 'mongoose';

const coachingPlanSchema = new Schema(
  {
    call: { type: Schema.Types.ObjectId, ref: 'Call', required: true },

    recommendations: [String], // bullet-point suggestions
    nextSteps: String, // free-text action plan
  },
  { timestamps: true },
);

export default model('CoachingPlan', coachingPlanSchema);
