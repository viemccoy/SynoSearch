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
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          query: {
            model: "gpt-3.5-turbo-1106",
            messages: [
              {
                role: "system",
                content: "Year=2024. Craft efficient, properly spaced and formatted search queries using advanced techniques such as wildcard attached to the key term (formatted as keyterm*), OR to allow greater search breadth, excluding terms -, and Any Time. Avoid answering directly, listing, or creating a new full sentence. Include each detail from the original query in the improved one. Modify queries based on context and filter low-quality results. Never use AND or quotes. Only filter by location if specified. You MUST identify all key terms in the search, and utilize both wildcards and at minimum one synonym with OR for each key term. Focus on unknown synonyms for depth and breadth of results. Prioritize quality results.",
              },
              {
                role: "user",
                content: req.body.prompt,
              }
            ],
            max_tokens: 30,
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
            version: "fix this, insane pricing",
            input: {
              prompt: "Provide a single, more effective query using advanced search techniques where relevant. Never answer the query directly. Do not list. Adjust query based on context. Utilize wildcard '*', exact phrase quotes, OR functions, exclude terms '-', 'intitle:', 'publication:', 'site:', and Any Time option when doing so will deliver more, higher quality results. Only deliver rephrased query ready for search. Query follows: " + req.body.prompt,
              debug: false,
              top_k: -1,
              top_p: 0.95,
              temperature: 0.5,
              max_new_tokens: 60,
              min_new_tokens: -1,
              repetition_penalty: 1.15,
            },
          },
        },
      ]),
    });
  
    // Check if the response is ok
    if (!response.ok) {
      res.statusCode = response.status;
      let text = await response.text();
      try {
        // Try to parse the response as JSON
        let error = JSON.parse(text);
        res.end(JSON.stringify({ detail: error.detail }));
      } catch {
        // If it's not JSON, return it as a string
        res.end(JSON.stringify({ detail: text }));
      }
      return;
    }
  
    // If the response is ok, parse it as JSON
    const prediction = await response.json();
    console.log(prediction); // Log the response
    res.statusCode = 200;
    res.end(JSON.stringify(prediction));
}