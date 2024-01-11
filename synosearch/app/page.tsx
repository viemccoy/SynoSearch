'use client'

import React, { useState, useEffect } from 'react';
import InputBox from '../components/inputbox';
import { run as runModel } from '../functions/runModel';
import ResponseBox from '../components/responsebox';
import '../styles/styles.css';

const Page = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleResponseChange = (newResponse: string) => {
    setResponse(newResponse);
  };

  // Call runModel when 'prompt' changes
  useEffect(() => {
    if (prompt) {
      runModel({ prompt }) // Pass an object with a 'prompt' property
        .then(handleResponseChange)
        .catch(console.error); // Add error handling
    }
  }, [prompt]); // Only re-run if 'prompt' changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-lg sm:text-2xl font-bold mb-2">SynoSearch</h1>
        <p className="text-md sm:text-xl mx-4">Enter your question and select a search engine</p>
        <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
          <InputBox onPromptChange={handlePromptChange} />
          {/* Removed runModel component and added useEffect hook */}
        </div>
        <ResponseBox response={response} />
      </main>
    </div>
  );
};

export default Page;