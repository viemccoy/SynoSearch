'use client'

import React, { useEffect, useState } from 'react';

import { Ai } from '@cloudflare/ai'

interface Env {
  AI: any;
}

interface AIResponseProps {
  prompt: string;
  onResponseChange: (newResponse: string) => void;
}

const AIResponse: React.FC<AIResponseProps> = ({ prompt, onResponseChange }) => {
  useEffect(() => {
    const fetchAIResponse = async () => {
      const context = { env: { AI: env.AI } }; // Replace env.AI with your actual AI binding
      const ai = new Ai(context.env.AI);

      const input = { prompt };

      const answer = await ai.run('@cf/meta/llama-2-7b-chat-int8', input);

      onResponseChange(JSON.stringify(answer));
    };

    fetchAIResponse();
  }, [prompt, onResponseChange]);

  return null;
};

export default AIResponse;