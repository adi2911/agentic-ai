import OpenAI from 'openai';
import { Analysis } from '../models/index.js';
import { splitIntoChunks } from '../utils/chunk.util.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const temperature = Number(process.env.OPENAI_TEMPERATURE) || 0.3;

const analysisFn = {
  name: 'analysis_result',
  description: 'Structured analysis for a sales-coaching call',
  parameters: {
    type: 'object',
    properties: {
      talkToListenRatio: { type: 'number' },
      fillerWordCount: { type: 'integer' },
      sentimentScore: { type: 'number' },
      summary: { type: 'string' },
    },
    required: ['talkToListenRatio', 'fillerWordCount', 'sentimentScore', 'summary'],
  },
};

export const analyseTranscript = async (call, transcript) => {
  const chunks = splitIntoChunks(transcript.text);

  // If the transcript is huge we analyse each chunk then average numbers & concat summaries.
  const partials = [];
  for (const chunk of chunks) {
    const res = await openai.chat.completions.create({
      model,
      temperature,
      response_format: { type: 'json_object' },
      tools: [{ type: 'function', function: analysisFn }],
      // tool_choice: { type: 'function', function: 'analysis_result' },
      messages: [
        {
          role: 'system',
          content:
            'You are an expert speech coach. Return ONLY valid JSON matching the provided schema.',
        },
        {
          role: 'user',
          content: `Here is a transcript chunk:\n\n${chunk}`,
        },
      ],
    });

    const data = JSON.parse(res.choices[0].message.tool_calls[0].function.arguments);
    partials.push(data);
  }

  const metrics = {
    talkToListenRatio: partials.reduce((s, p) => s + p.talkToListenRatio, 0) / partials.length,
    fillerWordCount: partials.reduce((s, p) => s + p.fillerWordCount, 0),
    sentimentScore: partials.reduce((s, p) => s + p.sentimentScore, 0) / partials.length,
  };
  const summary = partials.map((p) => p.summary).join(' ');

  return Analysis.create({
    call: call._id,
    metrics,
    summary,
  });
};
