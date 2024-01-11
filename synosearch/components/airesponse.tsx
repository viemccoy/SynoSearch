'use client'

import React, { useEffect } from 'react';

type AIResponseProps = {
  prompt: string;
  onResponseChange: (response: any) => void;
};

const AIResponse: React.FC<AIResponseProps> = ({ prompt, onResponseChange }) => {
  useEffect(() => {
    async function run() {
      if (prompt) {
        try {
          const response = await fetch('/api/runModel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          onResponseChange(result);
        } catch (error) {
          console.error("Failed to run the model:", error);
          onResponseChange({ error: (error as Error).message });
        }
      }
    }

    run();
  }, [prompt, onResponseChange]);

  return null;
};

export default AIResponse;