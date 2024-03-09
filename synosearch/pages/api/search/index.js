// Import the necessary modules
import fetch from 'node-fetch';

// Define the handler for your API route
export default async function handler(req, res) {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        // If not, set the 'Allow' header to 'POST' and return a 405 status code
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    // Extract the necessary parameters from the request body
    const { query, numResults } = req.body; // Removed 'page'

    // Define the URL for the external API
    const apiUrl = 'https://api.exa.ai/search';

    // Get the API key from the environment variables
    const apiKey = process.env.EXA_API_KEY;

    // Define the options for the fetch request
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({
            query,
            useAutoprompt: false, // Hardcoded to always be false
            numResults,
        }),
    };

    // Make the fetch request
    try {
        const apiResponse = await fetch(apiUrl, options);
        if (!apiResponse.ok) {
            throw new Error(`API responded with status ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Search API error:', error);
        if (error.response) {
            console.error('Response from API:', error.response);
            res.status(500).json({ message: error.message }); // Return the actual error message
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}