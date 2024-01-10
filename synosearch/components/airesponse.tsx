'use client'

import React, { useEffect } from 'react';

interface AIResponseProps {
  prompt: string;
  onResponseChange: (newResponse: string) => void;
}

const AIResponse: React.FC<AIResponseProps> = ({ prompt, onResponseChange }) => {
  useEffect(() => {
    const fetchAIResponse = async () => {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/259d9cff4d0f27bf78eb3a6300b4f676/ai/run/@cf/meta/llama-2-7b-chat-int8`,
        {
          headers: { Authorization: `Bearer ${process.env.CF_API_KEY}` },
          method: "POST",
          body: JSON.stringify({
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
          }),
        }
      );
      const result = await response.json();
      onResponseChange(JSON.stringify(result));
    };

    fetchAIResponse();
  }, [prompt, onResponseChange]);

  return null;
};

export default AIResponse;