export default async function handler(req, res) {
  // Check if ID is present
  if (!req.query.id) {
    res.statusCode = 400;
    res.end(JSON.stringify({ detail: "Missing ID in the request" }));
    return;
  }

  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + req.query.id,
    {
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`, // use the token
        "Content-Type": "application/json",
      },
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