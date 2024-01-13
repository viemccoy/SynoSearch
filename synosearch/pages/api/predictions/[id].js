export default async function handler(req, res) {
    // Check if ID is present
    if (!req.query.id) {
      res.statusCode = 400;
      res.end(JSON.stringify({ detail: "Missing ID in the request" }));
      return;
    }
  
    const response = await fetch(
      "https://gateway.ai.cloudflare.com/v1/259d9cff4d0f27bf78eb3a6300b4f676/synosearch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            provider: "openai",
            endpoint: `chat/completions/${req.query.id}`,
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
          {
            provider: "replicate",
            endpoint: `predictions/${req.query.id}`,
            headers: {
              Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        ]),
      }
    );
  
    if (response.status !== 200) {
      let error = await response.json();
      res.statusCode = response.status; // Use the status code from the response instead of always using 500
      res.end(JSON.stringify({ detail: error.detail }));
      return;
    }
  
    const prediction = await response.json();
    res.end(JSON.stringify(prediction));
  }