'use client'

import React, { useState } from 'react';

const InputBox = () => {
  const [question, setQuestion] = useState('');
  const [engine, setEngine] = useState('Google');

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleEngineChange = (event) => {
    setEngine(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would add the logic to generate the search using the question and engine
  };

  return (
    <form className="relative my-4" onSubmit={handleSubmit}>
      <input
        name="question"
        aria-label="Question"
        placeholder="Enter your question"
        type="text"
        value={question}
        onChange={handleQuestionChange}
        className="px-3 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <select
        name="engine"
        aria-label="Search engine"
        value={engine}
        onChange={handleEngineChange}
        className="px-3 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="Google">Google</option>
        <option value="Google Scholar">Google Scholar</option>
        <option value="Bing">Bing</option>
        {/* Add more options as needed */}
      </select>
      <button
        className="flex items-center justify-center absolute right-2 top-2 px-4 h-10 border border-gray-200 text-gray-900 rounded-md w-14 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-100"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default InputBox;