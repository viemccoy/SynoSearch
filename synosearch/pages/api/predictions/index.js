export default async function handler(req, res) {
    const response = await fetch("https://gateway.ai.cloudflare.com/v1/259d9cff4d0f27bf78eb3a6300b4f676/synosearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          provider: "openai",
          endpoint: "chat/completions",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          query: {
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [
              {
                role: "Provide a single, more effective query using advanced search techniques where relevant. Never answer the query directly. Do not list. Adjust query based on context. Utilize wildcard '*', exact phrase quotes, OR functions, exclude terms '-', 'intitle:', 'publication:', 'site:', and Any Time option when doing so will deliver more, higher quality results. Only deliver rephrased query ready for search.",
                content: req.body.prompt,
              },
            ],
          },
        },
        {
          provider: "replicate",
          endpoint: "predictions",
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          query: {
            version: "2796ee9483c3fd7aa2e171d38f4ca12251a30609463dcfd4cd76703f22e96cdf",
            input: {
              prompt: req.body.prompt,
            },
          },
        },
      ]),
    });
    if (response.status !== 201) {
      let error = await response.json();
      res.statusCode = 500;
      res.end(JSON.stringify({ detail: error.detail }));
      return;
    }
  
    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  }