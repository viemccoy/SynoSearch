export default async (req, res) => {
    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });

    const openai = new OpenAIApi(configuration);

    try {
    const response = await openai.createChatCompletion({
        model: req.body.model,
        max_tokens: req.body.tokens,
        temperature: req.body.temperature,
        messages: [{role: "system", content: req.body.sysprompt}, {role: "user", content: req.body.prompt}],
    });
    const completion = response.data.choices[0].message.content.trim();
    console.log(completion);
    res.json({ completion: completion });
    } catch (err) {
    console.error('Error fetching from OpenAI API:', err);
    res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
    }
};