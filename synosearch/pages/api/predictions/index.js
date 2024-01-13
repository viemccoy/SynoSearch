export default async function handler(req, res) {
  const response = await fetch("https://api.replicate.com/v1/deployments/viemccoy/nym/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`, // use the token
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        top_k: 50,
        top_p: 0.9,
        prompt: req.body.prompt,
        temperature: 0.6,
        max_new_tokens: 1024,
        prompt_template: "<s>[INST] {prompt} [/INST] ",
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