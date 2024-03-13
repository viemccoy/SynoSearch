import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { prompt, sysprompt, tokens, temperature, model } = req.body;

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: model,
    stream: true,
    messages: [
      {
        role: "system",
        content: sysprompt,
      },
      {
        role: "user",
        content: prompt,
      }
    ],
    temperature: temperature,
    max_tokens: tokens,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Check if the response is ok
  if (!response.ok) {
    res.statusCode = response.status;
    let text = await response.text();
    try {
      // Try to parse the response as JSON
      let error = JSON.parse(text);
      res.end(JSON.stringify({ detail: error.detail }));
    } catch {
      // If it's not JSON, return it as a string
      res.end(JSON.stringify({ detail: text }));
    }
    return;
  }

  // If the response is ok, parse it as JSON
  const prediction = await response.json();
  console.log(prediction); // Log the response
  res.statusCode = 200;
  res.end(JSON.stringify(prediction));
}