import styles from '../styles/Home.module.css';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes'; // Import the useTheme hook
import { ThemeContext } from './ThemeContext'; // Adjust the path according to your project structure


export default function InfoModal({ isInfoOpen, setInfoOpen, redditSearch, setRedditSearch }) {
  
  const [activeTab, setActiveTab] = useState(0);
  const { theme, setTheme } = useTheme(); // Get the current theme and setTheme function

  useEffect(() => {
    console.log(`Theme changed to ${theme}`);
  }, [theme]);

  

  if (!isInfoOpen) {
    return null;
  }

  return (
    <ThemeContext.Provider value={theme}>
    <div className={styles.infoModal}>
      <button className={styles.closeButton} onClick={() => setInfoOpen(false)}>X</button>
      <div className={styles.tabs}>
        {['About + SynoSettings', 'Advanced Models', 'SynoSearch:Premium', 'Feature Requests', 'Account'].map((tab, index) => (
          <button
            key={index}
            className={styles.tabButton}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {activeTab === 0 && <h1>About SynoSearch</h1>}
        {activeTab === 0 && <div>SynoSearch is the first AI-powered top-down semantic search designed by Vie McCoy to make search engines useful again.</div>}
        {activeTab === 0 && <h1>SynoSettings</h1>}
        {activeTab === 0 && (
        <label>
        Reddit Mode (Only Searches Reddit):
          <input type="checkbox" checked={redditSearch} onChange={() => setRedditSearch(prevState => !prevState)} />
        </label>
        ) }
        {activeTab === 0 && (
          <button
          className={`${styles.infoSettingsButton} ${styles.darkModeButton}`}
          onClick={() => {
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);  // Use setTheme prop instead of useTheme().setTheme
          }}
          style={{ position: 'absolute', bottom: '10px', left: '10px' }}
        >
            {/* Icon changes based on the current theme */}
            {theme === 'dark' ? (
              <img src="/sun.svg" alt="Light Mode" className={styles.infoSettingsImage} />
            ) : (
              <img src="/moon.svg" alt="Dark Mode" className={styles.infoSettingsImage} />
            )}
          </button>
      )}
        {activeTab === 1 && <div>New models coming soon.</div>}
        {activeTab === 2 && <div>Premium features coming soon.</div>}
        {activeTab === 3 && <div>Feature requests + Feedback coming soon.</div>}
        {activeTab === 4 && <div>Persistent accounts coming soon.</div>}
      </div>
    </div>
    </ThemeContext.Provider>
  );
}