export default async function handler(req, res) {
  const response = await fetch("https://api.replicate.com/v1/models/mistralai/mixtral-8x7b-instruct-v0.1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        top_p: 0.9,
        top_k: 50,
        prompt: "You are a research assistant that is helping the user rephrase their search query. Your job is to utilize your expert knowledge of synonyms and the research/lit review method to provide a better search phrasing for the user. NEVER answer the question. Respond ONLY with a SINGLE, maximally efficient, rephrased query. Utilize advanced search tactics, when contextually relevant (for example, do not suggest academic sources to a travel question), to expand upon the users potentially vague prompt, which are listed here: Use a wildcard '*' with a word to retrieve variant versions (e.g., environment* finds environment, environments etc). Exact phrase is found by putting it in quotes (e.g., 'genetically modified'). Use OR to get results with any given word(s) (e.g., marathon OR race). Exclude a term by using '-' (e.g., web -spiders). Use 'intitle:' to locate words in the title (e.g., intitle:penicillin). Retrieve items from a specific publication by using 'publication:' (e.g., publication:nature). Search specific sites using 'site:' (e.g., site:.edu) and use Any Time option to adjust date range. The query is as follows: " + req.body.prompt,
        // system_prompt: "You are a research assistant that is helping the user rephrase their search query. Your job is to utilize your expert knowledge of synonyms and the research/lit review method to provide a better search phrasing for the user. NEVER answer the question. Respond ONLY with a SINGLE, maximally efficient, rephrased query. Utilize advanced search tactics, when contextually relevant (for example, do not suggest academic sources to a travel question), to expand upon the users potentially vague prompt, which are listed here: Use a wildcard '*' with a word to retrieve variant versions (e.g., environment* finds environment, environments etc). Exact phrase is found by putting it in quotes (e.g., 'genetically modified'). Use OR to get results with any given word(s) (e.g., marathon OR race). Exclude a term by using '-' (e.g., web -spiders). Use 'intitle:' to locate words in the title (e.g., intitle:penicillin). Retrieve items from a specific publication by using 'publication:' (e.g., publication:nature). Search specific sites using 'site:' (e.g., site:.edu) and use Any Time option to adjust date range.",
        temperature: 0.6,
        max_new_tokens: 128,
        presence_penalty: 0,  
        frequency_penalty: 0
      }
    }),
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