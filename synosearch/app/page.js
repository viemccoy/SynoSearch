'use client'

import React, { useEffect, useState } from 'react';
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadLinksPreset } from "@tsparticles/preset-links";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Page() {
  const [init, setInit] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSearchEngine, setSelectedSearchEngine] = useState("google");

  const calculateParticleDensity = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 480) {
      return 800; // More particles for small screens
    } else if (windowWidth <= 768) {
      return 1200; // Fewer particles for medium screens
    } else {
      return 1500; // Even fewer particles for large screens
    }
  };

  useEffect(() => {
    if (init) {
      return;
    }
    initParticlesEngine(async (engine) => {
      await loadLinksPreset(engine);
    }).then(() => {
      setInit(true);
    });

    // Add event listener for window resize
    window.addEventListener('resize', () => {
      setInit(false); // Reset particles
    });
  }, [init]);

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
      {init && (
        <Particles
          className={styles.particles}
          id="tsparticles"
          options={{
            background: {
              color: {
                value: "#ffffff", // Set the background color to white
              },
            },
            particles: {
              number: {
                density: {
                  enable: true,
                  value_area: calculateParticleDensity(), // Adjust this value to increase or decrease the particle density
                },
              },
              color: {
                value: "#000000", // Set the particles color to black
              },
              links: {
                color: "#000000", // Set the links color to black
              },
              shape: {
                type: "circle",
              },
            },
            preset: "links",
          }}
        />
      )}
      <Head>
        <title>SynoSearch</title>
      </Head>
  
      <h1 className={styles.title}>SynoSearch</h1>
      <form className={`${styles.form} ${styles.formContainer}`} onSubmit={handleSubmit}>      
      <div className={styles.inputGroup}>
        <input type="text" name="prompt" placeholder="Enter a question" className={styles.promptInput} />
        <div className={styles.btnContainer}>
          <button type="submit" className={styles.btn}>Go</button>
        </div>
      </div>
      <div className={styles.formControls}>
      <select name="searchEngine" className={styles.customSelector}>
        <option value="google">Google</option>
        <option value="googleScholar">Google Scholar</option>
        <option value="bing">Bing</option>
      </select>
      </div>
      </form>
    </div>
  );
}