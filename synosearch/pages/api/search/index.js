// Import the necessary modules
import Exa from 'exa-js';

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

    // Get the API key from the environment variables
    const apiKey = process.env.EXA_API_KEY;

    // Initialize the Exa instance
    const exa = new Exa(apiKey);

    // Make the search request
    try {
        const data = await exa.search(query, { numResults });
        res.status(200).json(data);
        return;
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