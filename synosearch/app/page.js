'use client'

import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Page() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`, // use the token
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
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
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
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SynoSearch</title>
      </Head>
  
      <p>Enter your question:</p>
  
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="prompt" placeholder="Enter a question" />
        <button type="submit">Search</button>
      </form>
  
      {error && <div>{error}</div>}
  
      {prediction && (
        <div>
          <h2>Prediction Result:</h2>
          <p>Status: {prediction.status}</p>
          <p>Output: {prediction.output}</p>
        </div>
      )}
    </div>
  );
} // This is the missing closing brace