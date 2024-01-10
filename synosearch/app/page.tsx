'use client'

import React, { useState } from 'react';
import InputBox from '../components/inputbox';
import AIResponse from '../components/airesponse';
import ResponseBox from '../components/responsebox'; // Import the new component
import '../styles/styles.css';

const Page = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleResponseChange = (newResponse: string) => {
    setResponse(newResponse); // New handler for the response
  };

    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-lg sm:text-2xl font-bold mb-2">SynoSearch</h1>
        <p className="text-md sm:text-xl mx-4">Enter your question and select a search engine</p>
        <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
            <InputBox onPromptChange={handlePromptChange} />
            <AIResponse prompt={prompt} onResponseChange={handleResponseChange} />
        </div>
        <ResponseBox response={response} /> {/* Move the ResponseBox component here */}
        </main>
    </div>
    );
};

export default Page;