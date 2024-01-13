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
  
    if (!response.ok) {
      setError('Error making prediction');
      return;
    }
  
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);
  
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`
        }
      });
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({prediction})
      setPrediction(prediction);
    }
  
    // Check if prediction status is "succeeded" and open the new tab
    if (prediction && prediction.status === "succeeded" && prediction.output) {
      // Join the array of strings into a single string with spaces between each element
      const outputString = prediction.output.join("");
      const searchLink = generateSearchLink(
        selectedEngine,
        outputString
      );
      window.open(searchLink, "_blank");
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