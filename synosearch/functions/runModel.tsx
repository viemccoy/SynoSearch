'use client';

import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

export async function run({ prompt }: { prompt: string }) {
  try {
    // Create a prediction using the Replicate client
    let prediction = await replicate.deployments.predictions.create(
      'viemccoy', // The user who owns the deployment
      'nym',      // The name of the deployment
      {
        input: {
          prompt: prompt // Use the prompt passed to the function
        }
      }
    );

    // Poll the prediction's status until it's complete
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

      // Fetch the prediction status from the Replicate API
      const response = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If the response is not OK, throw an error
        const error = await response.json();
        throw new Error(error.detail);
      }

      // Update the prediction status
      prediction = await response.json();
    }

    // Return the prediction output
    return prediction.output;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error; // Ensure errors are propagated
  }
}

export { run as runModel };