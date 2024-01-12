import Replicate from "replicate";

export default async function handler(req, res) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  let prediction = await replicate.deployments.predictions.get(
    "viemccoy",
    "nym",
    req.query.id
  );
  res.end(JSON.stringify(prediction));
}