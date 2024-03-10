const fetch = require('node-fetch');

app.post("/api/search", async (req, res) => {
  const data = req.body;
  
  const url = 'https://api.exa.ai/search';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': process.env.EXA_API_KEY
    },
    body: JSON.stringify({
      query: data.query,
      numResults: 10,
      useAutoprompt: false,
    })
  };

  try {
    const exaRes = await fetch(url, options);
    const exaJson = await exaRes.json();
    res.json(exaJson);
  } catch (err) {
    console.error('error:' + err);
    res.status(500).json({ error: 'Failed to fetch from Exa API' });
  }
});