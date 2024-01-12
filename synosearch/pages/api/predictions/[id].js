export const runtime = 'edge';

export default async function handler(req, res) {
  const response = await fetch(
    "https://gateway.ai.cloudflare.com/v1/259d9cff4d0f27bf78eb3a6300b4f676/synosearch/replicate/predictions/" + req.query.id,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.end(JSON.stringify(prediction));
}