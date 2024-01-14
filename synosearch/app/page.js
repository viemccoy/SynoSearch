'use client'

import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Page() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSearchEngine, setSelectedSearchEngine] = useState("google");


  const generateSearchLink = (engine, query) => {
    let base_url;
    
    // Ensure query is a string and is not null or undefined
    query = typeof query === 'string' ? query.replaceAll(" ", "+") : "";
  
    switch (engine) {
      case "google":
        base_url = "https://www.google.com/search?q=";
        break;
      case "googleScholar":
        base_url = "https://scholar.google.com/scholar?q=";
        break;
      case "bing":
        base_url = "https://www.bing.com/search?q=";
        break;
      default:
        base_url = "https://www.google.com/search?q=";
    }
  
    return base_url + query;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedEngine = e.target.searchEngine.value;
  
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
  
    const data = await response.json();
    console.log(data); // Log the response
  
    if (!response.ok) {
      setError('Error making prediction');
      return;
    }
  
    // Use data directly instead of prediction state
    if (data && data.choices && data.choices.length > 0) {
      const outputString = data.choices[0].message.content;
      if (outputString) {
        const searchString = Array.isArray(outputString) ? outputString.join("") : outputString;
        const searchLink = generateSearchLink(
          selectedEngine,
          searchString
        );
  
        // Prompt the user to allow pop-ups
        if (!localStorage.getItem('popUpPromptShown')) {
          const allowPopUps = window.confirm("SynoSearch needs to open new tabs to display search results. Please allow pop-ups for this site in your browser settings. Click OK to continue.");
          if (allowPopUps) {
            localStorage.setItem('popUpPromptShown', 'true');
          } else {
            return;
          }
        }
  
        window.open(searchLink, "_blank");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SynoSearch</title>
      </Head>

      <h1 className={styles.title}>SynoSearch</h1>
      <p className={styles.tagline}>Better results in less time.</p>

      <p>Enter your question:</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="prompt" placeholder="Enter a question" />
        <div className={styles.formControls}>
          <select name="searchEngine">
            <option value="google">Google</option>
            <option value="googleScholar">Google Scholar</option>
            <option value="bing">Bing</option>
          </select>
          <button type="submit">Go</button>
        </div>
      </form>
    </div>
  );
}