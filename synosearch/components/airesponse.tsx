'use client'

import React, { useEffect, useState } from 'react';
import { Ai } from '@cloudflare/ai';

const AIResponse = ({ prompt }) => {
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
    };

    fetchAIResponse();
  }, [prompt]);

  return (
    <div>
      {response && <p>{response}</p>}
    </div>
  );
};

export default AIResponse;