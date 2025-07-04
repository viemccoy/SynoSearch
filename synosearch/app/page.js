'use client'

import React, { useEffect, useState, useContext } from 'react';
import Head from "next/head";
import styles from "../styles/Home.module.css";
import RootLayout from './RootLayout'; // Adjust the path according to your project structure
import Cookies from 'js-cookie';
import InfoModal from './InfoModal';
import ThemeSwitch from './ThemeSwitch';
import { useTheme } from 'next-themes';
import UserContext from '../contexts/UserContext';
import { Providers } from './providers';
import { ThemeContext } from './ThemeContext'; // Adjust the path according to your project structure
import Exa from 'exa-js';
import SynoSearchModal from './SynoSearchModal'; // Adjust path as necessary
import { createClient } from '@supabase/supabase-js'
import UpgradeModal from './UpgradeModal';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Page() {
  const [init, setInit] = useState(false);
  const [autoOpenSearch, setAutoOpenSearch] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSearches = localStorage.getItem('remainingSearches');
      return savedSearches !== null ? Number(savedSearches) : 50;
    }
    return 50;
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSearchEngine, setSelectedSearchEngine] = useState("SynoSearchWide");
  const [synoSearchStatus, setSynoSearchStatus] = useState('idle');
  const [synoSearchOpen , setSynoSearchOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [isInfoOpen, setInfoOpen] = useState(false);
  const [isWideView, setIsWideView] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [sameSearchCount, setSameSearchCount] = useState(0);
  const { theme, setTheme } = useTheme(); // Get the current theme and setTheme function
  const [redditSearch, setRedditSearch] = useState(false);
  const [exaResults, setExaResults] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isSynoSearchModalOpen, setIsSynoSearchModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [subscriptionLevel, setSubscriptionLevel] = useState(null);
  const [isUpgradeOpen, setUpgradeOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem('remainingSearches', remainingSearches);
  }, [remainingSearches]);

  useEffect(() => {
    if (user === null) {
      setSubscriptionLevel('free');
    }
  }, [user]);

  useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateWidth);
    updateWidth(); // Initial setting

    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  useEffect(() => {
    // Set the initial value based on the window's width
    setIsMobileView(window.innerWidth <= 600);

    // Define a function to update the state on window resize
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 600);
    };

    // Add the event listener for resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []); // The empty array ensures this effect runs only once after the initial render

  useEffect(() => {
    const reddit = Cookies.get('redditSearch');
    if (reddit !== undefined) {
      setRedditSearch(reddit === 'true');
    }
  }, []);
  // This useEffect hook runs when the component mounts
  useEffect(() => {
    const autoOpen = Cookies.get('autoOpenSearch');
    if (autoOpen !== undefined) {
      setAutoOpenSearch(autoOpen === 'true');
    }
  }, []);

  useEffect(() => {
    if (isWideView) {
      // Load SynoSearch in an <object> tag
      const objectElement = document.getElementById('synoSearchObject');
      if (objectElement) {
        objectElement.data = generateSearchLink(selectedSearchEngine, searchString);
      }
    }
  }, [isWideView, selectedSearchEngine, searchString]);

  useEffect(() => {
    if (remainingSearches === 0 && subscriptionLevel === 'free') {
      setUpgradeOpen(true);
    }
  }, [remainingSearches, subscriptionLevel]);

  // This useEffect hook runs when autoOpenSearch state changes
  useEffect(() => {
    Cookies.set('autoOpenSearch', autoOpenSearch.toString(), { expires: 365 }); // Cookie will expire after 1 year
  }, [autoOpenSearch]);

  const handleViewChange = (e) => {
    setIsWideView(e.target.searchEngine.value === "SynoSearchWide");
  };

  const handleInputChange = (e) => {
    if (e.target.value !== lastSearchQuery) {
      setSameSearchCount(0);
    }
  };

    const generateSearchLink = (engine, query) => {
    let base_url;
    
    // Ensure query is a string and is not null or undefined
    query = typeof query === 'string' ? query.replaceAll(" ", "+") : "";
  
    switch (engine) {
      case "SynoSearchWide":
        base_url = theme === 'dark' ? "https://www.synosearch.com/wideresults_dark.html?q=" : "https://www.synosearch.com/wideresults.html?q=";
        break;
      case "SynoSearchScholar":
        base_url = theme === 'dark' ? "https://www.synosearch.com/scholarresults_dark.html?q=" : "https://www.synosearch.com/scholarresults.html?q=";
        break;
        case "SynoSearchExa":
          base_url = theme === 'dark' ? "https://www.synosearch.com/exaresults_dark.html?q=" : "https://www.synosearch.com/exaresults.html?q=";
          base_url += "&exaResults=" + encodeURIComponent(JSON.stringify(exaResults));
          break;
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
    if (redditSearch) {
      query += " insite:reddit";
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
    if (subscriptionLevel === 'free' && remainingSearches === 0) {
      setUpgradeOpen(true);
      return;
    }
    const selectedEngine = e.target.searchEngine.value;
    setSelectedSearchEngine(selectedEngine); // Store the selected engine in state
    const exa_prompt = "Rephrase user search query into an efficient, properly formatted, higher information search query using advanced techniques. The search query should be phrased as though you are pointing the user in the right direction followed by an unknown link. You MUST intelligently identify all key terms in the search, and at minimum one synonym for each key term. ONLY return a single sentence beginning with what the user should do and ALWAYS ending with a colon. You should generate a series of key terms, synonyms, and related terms linked by advanced methods and phrase as though you are pointing out the existing location of a link. The link will be added automatically, so do not include a placeholder or any information about the link - you should only end with a colon. Focus on rare or unknown synonyms for depth and breadth of results. Only filter by location if specified.";
    const default_prompt = "Year=2024. Rephrase user search query into an efficient, properly formatted, higher information search query using advanced techniques. You MUST intelligently identify all key terms in the search, and utilize both * wildcards (formatted as “keyterm*” and at minimum one synonym with OR (formatted as “keyterm OR synonym”) for each key term. Never return a full sentence, only a series of key terms, synonyms, and related terms linked by advanced methods in order to generate the most efficient search. Focus on rare or unknown synonyms for depth and breadth of results. Only filter by location if specified.";
  
    const exa_model = "ft:gpt-3.5-turbo-1106:violet-castles:exa:90ojUzRa";
    const default_model = "ft:gpt-3.5-turbo-1106:violet-castles::8iwHTFef";
    // Set SynoSearch status to 'generating'
    setSynoSearchStatus('generating');
  
    const currentSearchQuery = e.target.prompt.value;
    if (currentSearchQuery === lastSearchQuery) {
      setSameSearchCount(prevCount => prevCount < 5 ? prevCount + 1 : prevCount);
    } else {
      setSameSearchCount(1); // Set to 1 for a new search
      setLastSearchQuery(currentSearchQuery);
    } 
    const sysprompt = selectedEngine === "SynoSearchExa" ? exa_prompt : default_prompt;
    const model = selectedEngine === "SynoSearchExa" ? exa_model : default_model;
    const tokens = 200;
    const response = await fetch("/api/portkey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: currentSearchQuery,
        sysprompt: sysprompt,
        model: model, // Use the SynoSearch model
        temperature: 0.7 + 0.1 * Math.min(sameSearchCount, 5), // Adjust temperature based on sameSearchCount, capped at 5
        tokens: tokens,
      }),
    });

    const data = await response.json();
    console.log(data);
  
    if (!response.ok) {
      setError('Error making prediction');
      return;
    }

    if (response.ok && subscriptionLevel === 'free') {
      setRemainingSearches(prevSearches => prevSearches > 0 ? prevSearches - 1 : 0);
    }
    
    // Use data directly instead of prediction state
    if (data && data.choices && data.choices.length > 0) {
      const outputString = data.choices[0].message.content;
      if (outputString) {
        const newSearchString = Array.isArray(outputString) ? outputString.join("") : outputString;
        setSearchString(newSearchString);
        console.log(newSearchString);
        if (selectedEngine === "SynoSearchExa") {
          try {
            const response = await fetch('/api/exaSearch', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: newSearchString }),
            });
            const exaData = await response.json();
            setExaResults(exaData);
            console.log(exaData);
        
            // Send exaData to the getExaResults endpoint
            const responseExa = await fetch('/api/getExaResults', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(exaData),
            });
            const exaResults = await responseExa.json();
            console.log(exaResults);
          } catch (err) {
            console.error('Error fetching from Exa API:', err);
          }
        };
  
        // Set SynoSearch status to 'generated' after the search is completed
        setSynoSearchStatus('generated');
  
        // Set isWideView state here, after the SynoSearch generation is complete
        if (selectedEngine === "SynoSearchWide" || selectedEngine === "SynoSearchScholar" || selectedEngine === "SynoSearchExa") {
          setIsWideView(true);
        } else {
          setIsWideView(false);
      }
  
      if (selectedEngine === "SynoSearchWide" || selectedEngine === "SynoSearchScholar" || selectedEngine === "SynoSearchExa") {
        // Load SynoSearch in an <object> tag
        const objectElement = document.getElementById('synoSearchObject');
        if (objectElement) {
          objectElement.data = generateSearchLink(selectedSearchEngine, newSearchString);
        }
      } else if (autoOpenSearch) {
        // Prompt the user to allow pop-ups
        if (!localStorage.getItem('popUpPromptShown')) {
          const allowPopUps = window.confirm("SynoSearch needs to open new tabs to display search results. Please allow pop-ups for this site in your browser settings. Click OK to continue.");
          if (allowPopUps) {
            localStorage.setItem('popUpPromptShown', 'true');
          } else {
            return;
          }
        }
  
          // Check if searchLink is not empty before opening the new tab
          const searchLink = generateSearchLink(selectedSearchEngine, newSearchString);
          if (searchLink) {
            window.open(searchLink, "_blank");
          } else {
            console.error('No search query provided');
          }
        }
      }
    }
  };

  return (
    <Providers>
        <RootLayout>
        <div className={`${isWideView ? (windowWidth < 1200 ? styles.mobileContainer : styles.wideViewContainer) : styles.container}`}>
        <a href="/" className={styles.titleLink}>
          <h1 className={`${isWideView && windowWidth < 1200 ? styles.mobileTitle : (isWideView ? styles.wideViewTitle : styles.title)}`}>
          </h1>
        </a>
      <form className={`${styles.form} ${isWideView ? styles.wideViewForm : styles.formContainer} `} onSubmit={(e) => handleSubmit(e)}>        
      <div className={`${isWideView ? styles.inputGroupWide : styles.inputGroup} `}>
      <input 
        type="text" 
        name="prompt" 
        placeholder={subscriptionLevel === 'free' ? `Enter a question - ${remainingSearches}/50 free searches remaining` : 'Enter a question'} 
        className={`${styles.promptInput} `} 
        maxLength="200"
        onChange={handleInputChange} // Reset sameSearchCount when user starts editing
        autoFocus 
      />
          <div className={`${styles.btnContainer} `}>
            <button type="submit" className={`${styles.btn} `}>
              Go
            </button>
            {sameSearchCount >= 1 && (
              <div className={`${styles.remixIconContainer} `}>
                {sameSearchCount > 1 && <span className={`${styles.remixCount} `}>{Math.min(sameSearchCount, 5)}</span>}
              </div>
            )}
          </div>
        </div>
        <div className={`${isWideView ? styles.wideViewToolsForm : styles.toolsForm} `}>
        {selectedSearchEngine !== "SynoSearchWide" && selectedSearchEngine !== "SynoSearchScholar" && selectedSearchEngine !== "SynoSearchExa" && (
            <label className={`${styles.autoOpenSearchLabel} `} style={{ display: 'flex', alignItems: 'right', marginRight: '10px' }}>
              Auto-Open Search:
              <input 
                type="checkbox" 
                checked={autoOpenSearch} 
                onChange={() => setAutoOpenSearch(prevState => !prevState)}
                style={{ marginRight: '10px', marginLeft: '10px' }}
                className={`${styles.checkboxHover} `}
              />
            </label>
          )}
        <div className={styles.selectorAndButtonContainer}>
          <select name="searchEngine" className={`${styles.customSelector} `} onChange={handleSearchEngineChange}>
            <option value="SynoSearchWide">SynoSearch:Wide</option>
            <option value="SynoSearchScholar">SynoSearch:Scholar</option>
          </select>
          {searchString && (
            <button onClick={(e) => {
              e.preventDefault();
              setIsSynoSearchModalOpen(true);
            }} className={styles.synoSearchButton}>
              Show SynoSearch
            </button>
          )}
        </div>
        {!isWideView && synoSearchStatus === 'generated' && !autoOpenSearch && (
            <a 
              href="#" 
              onClick={handleOpenInNewTab}
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.openInNewTabLink}`}
            >
              Open In New Tab
            </a>
          )}
          </div>
          <button 
            className={`${styles.infoSettingsButton} `} 
            onClick={(e) => {
              e.preventDefault();
              setInfoOpen(true);
            }}
          >
          </button>
        </form>
        <ThemeSwitch/>
      </div>
      {isWideView && <object id="synoSearchObject" type="text/html" className={`${styles.synoSearchObject} `}></object>}
      <SynoSearchModal
        isOpen={isSynoSearchModalOpen}
        onClose={() => setIsSynoSearchModalOpen(false)}
        content={searchString} // Ensure this variable holds the generated SynoSearch content
      />
    <UserContext.Provider value={{ user, setUser, subscriptionLevel, setSubscriptionLevel }}>
      <InfoModal isInfoOpen={isInfoOpen} setInfoOpen={setInfoOpen} redditSearch={redditSearch} setRedditSearch={setRedditSearch} />
      <UpgradeModal isUpgradeOpen={isUpgradeOpen} setUpgradeOpen={setUpgradeOpen} />
      </UserContext.Provider>
    </RootLayout>
  </Providers>
  );
}