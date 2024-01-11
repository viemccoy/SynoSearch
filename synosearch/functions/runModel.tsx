'use client';

import Replicate from 'replicate';

// Initialize the Replicate client with the API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define the run function to use Replicate for predictions
async function run(prompt: string) {
    try {
      let prediction = await replicate.deployments.predictions.create(
        'viemccoy', // The user who owns the deployment
        'nym',      // The name of the deployment
        {
          input: {
            prompt: prompt // Use the prompt passed to the function
          }
        }
      );
  
      prediction = await replicate.wait(prediction);
  
      return prediction.output; // Ensure this is the resolved value of the promise
    } catch (error) {
      console.error('Prediction error:', error);
      throw error; // Ensure errors are propagated
    }
  }
  
  export { run as runModel };