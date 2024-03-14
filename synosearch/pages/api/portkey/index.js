import OpenAI from 'openai';

const handler = async (req, res) => {

    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    console.log('Request body:', req.body);

    try {
        const response = await openai.chat.completions.create({
            model: req.body.model,
            max_tokens: req.body.tokens,
            temperature: req.body.temperature,
            messages: [{role: "system", content: req.body.sysprompt}, {role: "user", content: req.body.prompt}],
        });
        console.log(response);
        res.json(response);
    } catch (err) {
        console.error('Error fetching from OpenAI API:', err);
        res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
    }
};
