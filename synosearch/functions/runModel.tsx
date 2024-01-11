'use client';

import Replicate from 'replicate';

// Initialize the Replicate client with the API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define the run function to use Replicate for predictions
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

    // Fetch the prediction result from the new API route
    const response = await fetch(`/pages/api/getPrediction?id=${prediction.id}`);
    if (!response.ok) {
      // If the response is not OK, throw an error
      const error = await response.json();
      throw new Error(error.detail);
    }

    // Parse the prediction result
    prediction = await response.json();

    // Return the prediction output
    return prediction.output;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error; // Ensure errors are propagated
  }
}

export { run as runModel };