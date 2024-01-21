export default async function handler(req, res) {
  const prompt = req.body.prompt;

  // Check if the input is too long
  if (prompt.length > 230) {
    res.statusCode = 400;
    res.end(JSON.stringify({ detail: 'Input is too long' }));
    return;
  }
  
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
          model: "ft:gpt-3.5-turbo-1106:violet-castles::8iwHTFef",
          messages: [
            {
              role: "system",
              content: "Year=2024. Rephrase user search query into an efficient, properly formatted, higher information search query using advanced techniques. You MUST intelligently identify all key terms in the search, and utilize both * wildcards (formatted as “keyterm*” and at minimum one synonym with OR (formatted as “keyterm OR synonym”) for each key term. Never return a full sentence, only a series of key terms, synonyms, and related terms linked by advanced methods in order to generate the most efficient search. Focus on rare or unknown synonyms for depth and breadth of results. Only filter by location if specified.",
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
        "provider": "huggingface",
        "endpoint": "meta-llama/Llama-2-70b-chat-hf",
        "headers": {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
         },
        "query": {
          "input": "Year=2024. Rephrase user search query into an efficient, properly formatted, higher information search query using advanced techniques. You MUST intelligently identify all key terms in the search, and utilize both * wildcards (formatted as “keyterm*” and at minimum one synonym with OR (formatted as “keyterm OR synonym”) for each key term. Never return a full sentence, only a series of key terms, synonyms, and related terms linked by advanced methods in order to generate the most efficient search. Focus on rare or unknown synonyms for depth and breadth of results. Only filter by location if specified. Query follows:" + req.body.prompt,
        }
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