import OpenAI from 'openai';
import { CoachingPlan } from '../models/index.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const temperature = Number(process.env.OPENAI_TEMPERATURE) || 0.3;

const planFn = {
  name: 'coaching_plan',
  description: 'Concrete coaching plan based on analysis metrics',
  parameters: {
    type: 'object',
    properties: {
      recommendations: {
        type: 'array',
        items: { type: 'string' },
      },
      nextSteps: { type: 'string' },
    },
    required: ['recommendations', 'nextSteps'],
  },
};

export const generatePlan = async (call, analysis) => {
  const res = await openai.chat.completions.create({
    model,
    temperature,
    response_format: { type: 'json_object' },
    tools: [{ type: 'function', function: planFn }],
    // tool_choice: { type: 'function', function: 'coaching_plan' },
    messages: [
      {
        role: 'system',
        content: 'You are a seasoned sales coach. Provide actionable advice in JSON only.',
      },
      {
        role: 'user',
        content: `Here are the conversation metrics: ${JSON.stringify(
          analysis.metrics,
        )}. Give the coachee clear recommendations and next steps.`,
      },
    ],
  });

  const plan = JSON.parse(res.choices[0].message.tool_calls[0].function.arguments);

  return CoachingPlan.create({
    call: call._id,
    ...plan,
  });
};
