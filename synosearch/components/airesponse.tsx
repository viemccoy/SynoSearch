'use server'

import React from 'react';

type AIResponseProps = {
  prompt: string;
  onResponseChange: (response: string) => void;
};

const AIResponse: React.FC<AIResponseProps> = ({ prompt, onResponseChange }) => {
  async function run(model: string, input: any) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/259d9cff4d0f27bf78eb3a6300b4f676/ai/run/${model}`,
      {
        headers: { Authorization: `Bearer ${process.env.CF_API_KEY}` },
        method: "POST",
        body: JSON.stringify(input),
      }
    );
    const result = await response.json();
    onResponseChange(result); // Use the onResponseChange function to update the response
  }

  run("@cf/meta/llama-2-7b-chat-int8", {
    messages: [
      {
        role: "system",
        content: "You are a friendly assistant that helps write stories",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return null; // Return null or some JSX as needed
};

export default AIResponse;