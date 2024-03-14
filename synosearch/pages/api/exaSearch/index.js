import Exa from 'exa-js';

const handler = async (req, res) => {
  const { query } = req.body;

  const exa = new Exa(process.env.EXASEARCH_API_KEY);
  try {
    const exaData = await exa.search(query, {
      numResults: 20,
      useAutoprompt: false,
    });
    res.json(exaData);
  } catch (err) {
    console.error('Error fetching from Exa API:', err);
    res.status(500).json({ error: 'Failed to fetch from Exa API' });
  }
};

export default handler;