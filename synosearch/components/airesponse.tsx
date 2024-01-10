'use client'

import React, { useEffect, useState } from 'react';

import { Ai } from '@cloudflare/ai'

type AIResponseProps = {
  prompt: string;
  onResponseChange: (newResponse: string) => void;
};

const AIResponse: React.FC<AIResponseProps> = ({ prompt, onResponseChange }) => {
  const ai = new Ai(env.AI);

  useEffect(() => {
    const fetchAIResponse = async () => {
      const answer = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
        prompt,
        stream: true
      });

      onResponseChange(answer);
    };

    fetchAIResponse();
  }, [prompt, onResponseChange]);

  return null;
};

export default AIResponse;