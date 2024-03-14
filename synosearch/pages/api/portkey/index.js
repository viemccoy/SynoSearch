export default async (req, res) => {
    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });

    const { prompt, sysprompt, model, temperature, tokens } = req.body;

    const openai = new OpenAIApi(configuration);

    try {
    const completion = await openai.createChatCompletion({
        model: model,
        max_tokens: tokens,
        temperature: temperature,
        messages: [{role: "system", content: sysprompt}, {role: "user", content: prompt}],
    });
    res.json(completion);
    } catch (err) {
    console.error('Error fetching from OpenAI API:', err);
    res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
    }
};