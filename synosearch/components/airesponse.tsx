'use client'

import React, { useEffect, useState } from 'react';
import { Ai } from '@cloudflare/ai';

type AIResponseProps = {
  prompt: string;
  onResponseChange: (newResponse: string) => void; // Add this line
};

const AIResponse: React.FC<AIResponseProps> = ({ prompt, onResponseChange }) => { // Add onResponseChange here
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchAIResponse = async () => {
      // If you're not using any specific context, you can pass an empty object as ctx
      const ctx = {};
      const ai = new Ai("AI", { sessionOptions: { ctx }});
      const answer = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
        prompt,
        stream: true
      });
      setResponse(answer);
      onResponseChange(answer); // Call the handler here
    };

    fetchAIResponse();
  }, [prompt, onResponseChange]); // Add onResponseChange to the dependency array

  return (
    <div>
      {response && <p>{response}</p>}
    </div>
  );
};

export default AIResponse;