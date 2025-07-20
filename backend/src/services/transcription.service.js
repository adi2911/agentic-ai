import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { Transcript } from '../models/index.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createTranscript = async (call) => {
  const audioPath = path.join(__dirname, '../../uploads', call.filename);

  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: 'whisper-1',
    response_format: 'json',
  }); /* :contentReference[oaicite:0]{index=0} */

  return Transcript.create({
    call: call._id,
    language: response.language ?? 'en',
    text: response.text,
  });
};
