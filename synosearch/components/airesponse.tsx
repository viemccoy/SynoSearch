'use client'

import React, { useEffect, useState } from 'react';

type AIResponseProps = {
  prompt: string;
  onResponseChange: (newResponse: string) => void;
};

const AIResponse: React.FC<AIResponseProps> = ({ prompt, onResponseChange }) => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchAIResponse = async () => {
      // Check if window object is defined
      if (typeof window !== 'undefined') {
        const response = await fetch('https://nym.synosearch.workers.dev/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: '@cf/meta/llama-2-7b-chat-int8',
            input: {
              prompt,
              stream: true
            }
          })
        });

        const data = await response.json();
        const answer = data.result; // Replace this with the actual path to the answer in the response data

        setResponse(answer);
        onResponseChange(answer);
      }
    };

    fetchAIResponse();
  }, [prompt, onResponseChange]);

  return (
    <div>
      {response && <p>{response}</p>}
    </div>
  );
};

export default AIResponse;