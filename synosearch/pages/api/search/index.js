import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { query, useAutoprompt, numResults, page } = req.body;

    const apiUrl = 'https://api.exa.ai/search';
    const apiKey = process.env.EXA_API_KEY; // Ensure your API key is stored in .env.local

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({
            query,
            useAutoprompt,
            numResults,
            page,
        }),
    };

    try {
        const apiResponse = await fetch(apiUrl, options);
        if (!apiResponse.ok) {
            throw new Error(`API responded with status ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Search API error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}