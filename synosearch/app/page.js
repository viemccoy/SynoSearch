'use client'

import React, { useEffect, useState } from 'react';
import Head from "next/head";
import styles from "../styles/Home.module.css";
import RootLayout from './RootLayout'; // Adjust the path according to your project structure
import Cookies from 'js-cookie';
import InfoModal from './InfoModal';


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Page() {
  const [init, setInit] = useState(false);
  const [autoOpenSearch, setAutoOpenSearch] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSearchEngine, setSelectedSearchEngine] = useState("google");
  const [synoSearchStatus, setSynoSearchStatus] = useState('idle');
  const [synoSearchOpen , setSynoSearchOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [isInfoOpen, setInfoOpen] = useState(false);

  // This useEffect hook runs when the component mounts
  useEffect(() => {
    const autoOpen = Cookies.get('autoOpenSearch');
    if (autoOpen !== undefined) {
      setAutoOpenSearch(autoOpen === 'true');
    }
  }, []);

  // This useEffect hook runs when autoOpenSearch state changes
  useEffect(() => {
    Cookies.set('autoOpenSearch', autoOpenSearch.toString(), { expires: 365 }); // Cookie will expire after 1 year
  }, [autoOpenSearch]);

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

  const handleOpenInNewTab = (e) => {
    e.preventDefault();
    const searchLink = generateSearchLink(selectedSearchEngine, searchString);
    window.open(searchLink, "_blank");
  };

  const handleSearchEngineChange = (e) => {
    setSelectedSearchEngine(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedEngine = e.target.searchEngine.value;
    setSelectedSearchEngine(selectedEngine); // Store the selected engine in state
  
    // Set SynoSearch status to 'generating'
    setSynoSearchStatus('generating');
  
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
        const newSearchString = Array.isArray(outputString) ? outputString.join("") : outputString;
        setSearchString(newSearchString);
        const searchLink = generateSearchLink(
          selectedEngine,
          newSearchString
        );
  
        // Only open the popup if autoOpenSearch is true
        if (autoOpenSearch) {
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
  
        // Set SynoSearch status to 'generated' after the search is completed
        setSynoSearchStatus('generated');
      }
    }
  };

  return (
    <RootLayout>
      <div className={styles.container}>
        <Head>
          <title>SynoSearch</title>
        </Head>
    
        <h1 className={styles.title}>SynoSearch</h1>
        <form className={`${styles.form} ${styles.formContainer}`} onSubmit={handleSubmit}>      
        <div className={styles.inputGroup}>
        <input 
          type="text" 
          name="prompt" 
          placeholder="Enter a question" 
          className={styles.promptInput} 
          maxLength="200"
        />
          <div className={styles.btnContainer}>
            <button type="submit" className={styles.btn}>Go</button>
          </div>
        </div>
        <div className={styles.synoSearchBox}>
          {synoSearchStatus === 'idle' && 'Input query above'}
          {synoSearchStatus === 'generating' && 'Generating SynoSearch...'}
          {synoSearchStatus === 'generated' && (
            <div onClick={() => setSynoSearchOpen(prevState => !prevState)}>
              {synoSearchOpen ? '▼' : '►'} Show SynoSearch
            </div>
          )}
          {synoSearchStatus === 'generated' && synoSearchOpen && (
            <div>{searchString}</div>
          )}
        </div>
        <div className={styles.toolsForm}>
          <label className={styles.autoOpenSearchLabel} style={{ display: 'flex', alignItems: 'right', marginRight: '10px' }}>
              Auto-Open Search:
              <input 
                type="checkbox" 
                checked={autoOpenSearch} 
                onChange={() => setAutoOpenSearch(prevState => !prevState)}
                style={{ marginRight: '10px', marginLeft: '10px' }}
                className={styles.checkboxHover}
              />
            </label>
            <select name="searchEngine" className={styles.customSelector} onChange={handleSearchEngineChange}>
              <option value="google">Google</option>
              <option value="googleScholar">Google Scholar</option>
              <option value="bing">Bing</option>
            </select>
            {synoSearchStatus === 'generated' && !autoOpenSearch && (
              <a 
                href="#" 
                onClick={handleOpenInNewTab}
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.openInNewTabLink}
              >
                Open In New Tab
              </a>
            )}
          </div>
          <button 
            className={styles.infoSettingsButton} 
            onClick={(e) => {
              e.preventDefault();
              setInfoOpen(true);
            }}
          >
            <img src="/infosettings.png" alt="Info Settings" className={styles.infoSettingsImage} />
          </button>
      </form>
    </div>
    <InfoModal isInfoOpen={isInfoOpen} setInfoOpen={setInfoOpen} />
  </RootLayout>
  );
}