import Portkey from 'portkey-ai';

export default async (req, res) => {
    const { prompt, sysprompt, model, temperature, tokens } = req.body; // Add 'tokens' and 'temperature' here
    
    if (prompt.length > 230) {
        res.statusCode = 400;
        res.end(JSON.stringify({ detail: 'Input is too long' }));
        return;
      }

    const portkey = new Portkey({
        apiKey: `${process.env.PORTKEY_API_KEY}`, // Replace with your Portkey API key
        virtualKey: `${process.env.SYNO_API_KEY}`
    });

    try {
      const response = await portkey.completions.create({
        model: model,
        max_tokens: tokens,
        temperature: temperature,
        messages: [{
        role: 'system', content: sysprompt,
        role: 'user', content: prompt,
        }]
    });
      res.json(response);
    } catch (err) {
      console.error('Error fetching from Portkey API:', err);
      res.status(500).json({ error: 'Failed to fetch from Portkey API' });
    }
  };