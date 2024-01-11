'use client';

import Replicate from 'replicate';

// Initialize the Replicate client with the API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define the run function to use Replicate for predictions
async function run(prompt: string) {
  try {
    // Create a new prediction
    let prediction = await replicate.deployments.predictions.create(
      'viemccoy', // The user who owns the deployment
      'nym',      // The name of the deployment
      {
        input: {
          prompt: prompt // Use the prompt passed to the function
        }
      }
    );

    // Wait for the prediction to complete
    prediction = await replicate.wait(prediction);

    // Return the output of the prediction
    return prediction.output;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Export the run function
export { run };