import styles from '../styles/Home.module.css';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes'; // Import the useTheme hook
import { ThemeContext } from './ThemeContext'; // Adjust the path according to your project structure
import UserContext from '../contexts/UserContext';
import { createClient } from '@supabase/supabase-js'



export default function InfoModal({ isInfoOpen, setInfoOpen, redditSearch, setRedditSearch }) {
  
  const supabase = createClient("https://troxpvtrnpdtflghedri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb3hwdnRybnBkdGZsZ2hlZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwOTQ2NzUsImV4cCI6MjAyOTY3MDY3NX0.1YMQdcKlpc9i23ISDVbtKIttZcF_rl-I37dtmCTy32I")
  const { user, setUser, subscriptionLevel, setSubscriptionLevel } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState(0);
  const { theme, setTheme } = useTheme(); // Get the current theme and setTheme function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log(`Theme changed to ${theme}`);
  }, [theme]);

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    const { error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
  
    if (error) {
      console.error('Error signing in:', error);
      return;
    }
  
    // After signing in, update the user's account information
    const { data: userInfo, error: userError } = await supabase.auth.getUserIdentities();
    if (userError) {
      console.error('Error getting user info:', userError);
      return;
    }
  
    setUser(userInfo);
    setSubscriptionLevel(userInfo.subscriptionLevel); // Update the subscription level
  };

  

  if (!isInfoOpen) {
    return null;
  }

  return (
    <ThemeContext.Provider value={theme}>
    <div className={styles.infoModal}>
      <button className={styles.closeButton} onClick={() => setInfoOpen(false)}>Close</button>
      <div className={styles.tabs}>
        {['InfoSettings', 'Account'].map((tab, index) => (
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
        {activeTab === 0 && <div>Designed to make search engines useful again, SynoSearch is the first AI-powered top-down semantic search.
          Most useful when aiding in the creative literature review process, SynoSearch doesn't ask you to change your habits. There's no chat, just a subtle AI-powered search improvement.
          SynoSearch is the ultimate research tool, and helps you to get better results with less searches.</div>}
        {activeTab === 0 && <h1>Model and Engine Information</h1>}
        {activeTab === 0 && <div>SynoSearch:Wide uses the standard SynoSearch model and delivers same-page results from Google.</div>}
        {activeTab === 0 && <div>SynoSearch:Scholar uses the standard SynoSearch model and delivers scholarly results from OpenAlex.</div>}
        {activeTab === 0 && <div>SynoSearch:Exa uses the SynoSearch custom auto-prompter model and delivers scholarly results from Exa AI.</div>}
        {activeTab === 0 && <div>Google, Google Scholar, and Bing all use the standard SynoSearch model and open in new tabs respectively.</div>}
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
      {activeTab === 1 && user && (
      <div>
        <h2>Welcome, {user.username}!</h2>
        <p>Your subscription level: {user.subscriptionLevel}</p>
      </div>
    )}
    {activeTab === 1 && !user && <a href="https://pro.synosearch.com">No account? Get one here!</a>}
    {activeTab === 1 && !user && (
      <form onSubmit={handleSignIn}>
        <label>
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Sign In</button>
      </form>
    )}
        {activeTab === 1 && <h1>Feature Requests</h1>}
        {activeTab === 1 && <a href="https://forms.gle/abvYHwkbpFnuAQQVA">Feature Request Form</a>}
        {activeTab === 1 && <h1>Bug Reports</h1>}
        {activeTab === 1 && <a href="https://forms.gle/TuZaoS2ggWb8kGec8">Bug Report Form</a>}
      </div>
    </div>
    </ThemeContext.Provider>
  );
}