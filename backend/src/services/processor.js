import { Call } from '../models/index.js';
import { analyseTranscript } from './analysis.service.js';
import { generatePlan } from './plan.service.js';
import { createTranscript } from './transcription.service.js';

export const startProcessor = (intervalMs = 5000) => {
  console.log(`📡  Background processor running every ${intervalMs} ms`);

  setInterval(async () => {
    const call = await Call.findOneAndUpdate(
      { status: 'uploaded' },
      { status: 'processing' },
      { sort: { createdAt: 1 }, new: true },
    );

    if (!call) return;

    try {
      const transcript = await createTranscript(call);
      call.transcript = transcript._id;
      await call.save();

      const analysis = await analyseTranscript(call, transcript);
      call.analysis = analysis._id;
      await call.save();

      const plan = await generatePlan(call, analysis);
      call.coachingPlan = plan._id;
      call.status = 'completed';
      await call.save();

      console.log(` Call ${call._id} processed`);
    } catch (err) {
      console.error(`  Processing failed for call ${call?._id}:`, err);
      if (call) {
        call.status = 'failed';
        await call.save();
      }
    }
  }, intervalMs);
};
