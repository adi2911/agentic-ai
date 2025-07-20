import { Schema, model } from 'mongoose';

const transcriptSchema = new Schema(
  {
    call: { type: Schema.Types.ObjectId, ref: 'Call', required: true },
    language: { type: String, default: 'en' },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

export default model('Transcript', transcriptSchema);
