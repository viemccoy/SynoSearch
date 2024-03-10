import Exa from "exa-js"


export default async function handler(req, res) {
    const exa = new Exa(process.env.EXA_API_KEY)
    if (req.method === 'POST') {
        const data = req.body;
        const response = await exa.search(data.query, {
            numResults: data.numResults,
            useAutoprompt: data.useAutoprompt,
        });

        return res.status(200).json(response);
    } else {
        // Handle any other HTTP methods
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};