import { Call } from '../models/index.js';
import { analyseTranscript } from './analysis.service.js';
import { generatePlan } from './plan.service.js';
import { createTranscript } from './transcription.service.js';

/**
 * Polls Mongo every `intervalMs` and processes one queued Call at a time.
 */
export const startProcessor = (intervalMs = 5000) => {
  console.log(`📡  Background processor running every ${intervalMs} ms`);

  setInterval(async () => {
    // Atomically move the oldest "uploaded" call to "processing"
    const call = await Call.findOneAndUpdate(
      { status: 'uploaded' },
      { status: 'processing' },
      { sort: { createdAt: 1 }, new: true },
    );

    if (!call) return; // nothing to do

    try {
      /* 1️⃣ Transcription */
      const transcript = await createTranscript(call);
      call.transcript = transcript._id;
      await call.save();

      /* 2️⃣ Analysis */
      const analysis = await analyseTranscript(call, transcript);
      call.analysis = analysis._id;
      await call.save();

      /* 3️⃣ Coaching plan */
      const plan = await generatePlan(call, analysis);
      call.coachingPlan = plan._id;
      call.status = 'completed';
      await call.save();

      console.log(`✅  Call ${call._id} processed`);
    } catch (err) {
      console.error(`❌  Processing failed for call ${call?._id}:`, err);
      if (call) {
        call.status = 'failed';
        await call.save();
      }
    }
  }, intervalMs);
};
