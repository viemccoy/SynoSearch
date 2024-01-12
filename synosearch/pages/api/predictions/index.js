import Replicate from "replicate";

export default async function handler(req, res) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  let prediction = await replicate.deployments.predictions.create(
    "viemccoy",
    "nym",
    {
      input: {
        prompt: req.body.prompt,
      },
    }
  );
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}