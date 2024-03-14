const handler = async (req, res) => {

    const OpenAIApi = require("openai");

    const openai = new OpenAIApi({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Log the request body
    console.log('Request body:', req.body);

    try {
        const response = await openai.createChatCompletion({
            model: req.body.model,
            max_tokens: req.body.tokens,
            temperature: req.body.temperature,
            messages: [{role: "system", content: req.body.sysprompt}, {role: "user", content: req.body.prompt}],
        });

        // Log the response from the OpenAI API call
        console.log('OpenAI API response:', response);

        const completion = response.data.choices[0].message.content.trim();
        console.log(completion);
        res.json(completion);
    } catch (err) {
        console.error('Error fetching from OpenAI API:', err);
        res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
    }
};

export default handler;