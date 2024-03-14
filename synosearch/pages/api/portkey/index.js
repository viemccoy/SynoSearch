import Portkey from 'portkey-ai';
import OpenAI from 'openai'; // We're using the v4 SDK
import { PORTKEY_GATEWAY_URL, createHeaders } from 'portkey-ai'

export default async (req, res) => {
    const { prompt, sysprompt, model, temperature, tokens } = req.body; // Add 'tokens' and 'temperature' here
    
    if (prompt.length > 230) {
        res.statusCode = 400;
        res.end(JSON.stringify({ detail: 'Input is too long' }));
        return;
      }

    const openai = new OpenAI({
        apiKey: `${process.env.OPENAI_API_KEY}`, // Replace with your Portkey API key
        baseURL: PORTKEY_GATEWAY_URL,
        defaultHeaders: createHeaders({
            provider: "openai",
            apiKey: `${process.env.PORTKEY_API_KEY}`
        })
    });

    try {
      const response = await openai.chat.completions.create({
        model: model,
        max_tokens: tokens,
        temperature: temperature,
        messages: [{
            role: 'system', content: sysprompt},
            {role: 'user', content: prompt
        }]
    });
    const response_text = response.data.choices[0].message.content.trim();
    res.json(response_text);
    console.log(response_text);
    } catch (err) {
      console.error('Error fetching from OpenAI API:', err);
      res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
    }
  };