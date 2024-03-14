import Portkey from 'portkey-ai';
import OpenAI from 'openai';

export default async function handler(req, res) {
  const { prompt, sysprompt, tokens, temperature, model } = req.body; // Add 'tokens' and 'temperature' here

  // Check if the input is too long
  if (prompt.length > 230) {
    res.statusCode = 400;
    res.end(JSON.stringify({ detail: 'Input is too long' }));
    return;
  }

  const portkey = new Portkey({
    apiKey: `${process.env.PORTKEY_API_KEY}`, // Replace with your Portkey API key
    virtualKey: `${process.env.SYNO_API_KEY}`
  });
  
  const response = await portkey.completions.create({
    model: model,
    max_tokens: tokens,
    temperature: temperature,
    messages: [{
      role: 'system', content: sysprompt,
      role: 'user', content: prompt,
    }]
  });

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