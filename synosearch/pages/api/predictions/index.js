import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { prompt, sysprompt, tokens, temperature, model } = req.body;

  // Check if the input is too long
  if (prompt.length > 230) {
    res.statusCode = 400;
    res.end(JSON.stringify({ detail: 'Input is too long' }));
    return;
  }

  try {
    // Ask OpenAI for a streaming chat completion given the prompt
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

    // Respond with the stream
    const prediction = await new StreamingTextResponse(stream).json();
    console.log(prediction); // Log the response
    res.statusCode = 200;
    res.end(JSON.stringify(prediction));
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      res.statusCode = status;
      res.end(JSON.stringify({ detail: { name, status, headers, message } }));
    } else {
      throw error;
    }
  }
}