'use client'
import styles from '../styles/Home.module.css';
import React, { useEffect, useState, useContext } from 'react';
import { useTheme } from 'next-themes'; // Import the useTheme hook
import { ThemeContext } from './ThemeContext'; // Adjust the path according to your project structure
import UserContext from '../contexts/UserContext';
import { createClient } from '@supabase/supabase-js'



export default function InfoModal({ isInfoOpen, setInfoOpen, redditSearch, setRedditSearch }) {
  const supabase = createClient("https://troxpvtrnpdtflghedri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb3hwdnRybnBkdGZsZ2hlZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwOTQ2NzUsImV4cCI6MjAyOTY3MDY3NX0.1YMQdcKlpc9i23ISDVbtKIttZcF_rl-I37dtmCTy32I", {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
  
  useEffect(() => {
    const fetchSubscriptionLevel = async () => {
      const { data: { session } } = await supabase.auth.getSession();
  
      if (session) {
        setUser(session.user.email);
  
        const userId = session.user.id;
  
        // Check if the user ID is in the subscriptions table
        const { data: subscriptions, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId);
  
        if (subscriptionError) {
          console.error('Error getting subscriptions:', subscriptionError);
          return;
        }
  
        if (subscriptions.length > 0) {
          // The user has a subscription
          const subscription = subscriptions[0]; // Assuming each user has only one subscription
          const priceId = subscription.price_id;
  
          // Get the product ID for the given price
          const { data: prices, error: priceError } = await supabase
            .from('prices')
            .select('product_id')
            .eq('id', priceId);
  
          if (priceError) {
            console.error('Error getting prices:', priceError);
            return;
          }
  
          const productId = prices[0].product_id; // Assuming each price has only one product
  
          // Set the subscription level based on the product ID
          if (productId === 'prod_PzfszBC86YXlU6') {
            setSubscriptionLevel('unlimited');
          } else if (productId === 'prod_PzfrETtGWe73UX') {
            setSubscriptionLevel('pro');
          }
        } else {
          // The user does not have a subscription
          setSubscriptionLevel(null);
        }
      }
    };
  
    fetchSubscriptionLevel();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setUser(null);
      setSubscriptionLevel(null);
    }
  };
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
    
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
    
      if (error) {
        console.error('Error signing in:', error);
        return;
      }    
      // Set the user ID and email
      const userId = data.user.id;
      const userEmail = data.user.email;
    
      // Check if the user ID is in the subscriptions table
      const { data: subscriptions, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);
    
      if (subscriptionError) {
        console.error('Error getting subscriptions:', subscriptionError);
        return;
      }
    
      if (subscriptions.length > 0) {
        // The user has a subscription
        const subscription = subscriptions[0]; // Assuming each user has only one subscription
        const priceId = subscription.price_id;
    
        // Get the product ID for the given price
        const { data: prices, error: priceError } = await supabase
          .from('prices')
          .select('product_id')
          .eq('id', priceId);
    
        if (priceError) {
          console.error('Error getting prices:', priceError);
          return;
        }
    
        const productId = prices[0].product_id; // Assuming each price has only one product
        // Set the subscription level based on the product ID
        let subscriptionLevel;
        if (productId === 'prod_PzfszBC86YXlU6') {
          subscriptionLevel = 'unlimited';
        } else if (productId === 'prod_PzfrETtGWe73UX') {
          subscriptionLevel = 'pro';
        }
    
        setUser(userEmail);
        setSubscriptionLevel(subscriptionLevel);
      } else {
        // The user does not have a subscription
        setUser(userEmail);
        setSubscriptionLevel(null);
      }
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
        {activeTab === 0 && <div>SynoSearch:Wide uses the standard SynoSearch model and delivers results from Google.</div>}
        {activeTab === 0 && <div>SynoSearch:Scholar uses the standard SynoSearch model and delivers scholarly results from OpenAlex.</div>}
        {activeTab === 0 && <div>SynoSearch:Exa uses the SynoSearch custom auto-prompter model and delivers scholarly results from Exa AI.</div>}
        {activeTab === 0 && <h1>SynoSettings</h1>}
        {activeTab === 0 && (
          <div>
            <label>
              Reddit Mode (Only Searches Reddit):
              <input type="checkbox" checked={redditSearch} onChange={() => setRedditSearch(prevState => !prevState)} />
            </label>
          </div>
        )}
        {activeTab === 0 && (
          <div>
            <button
              className={`${styles.infoSettingsButton} ${styles.darkModeButton}`}
              onClick={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
              }}
              style={{ position: 'relative', bottom: '0px', left: '0px', top: '20px' }}
            >
              {theme === 'dark' ? (
                <img src="/sun.svg" alt="Light Mode" className={styles.infoSettingsImage} />
              ) : (
                <img src="/moon.svg" alt="Dark Mode" className={styles.infoSettingsImage} />
              )}
            </button>
          </div>
        )}
      {activeTab === 1 && <h1>Account Settings</h1>}
      {activeTab === 1 && user && (
        <div>
          <h2>Welcome, {user}!</h2>
          <p>Your subscription level: {subscriptionLevel === 'unlimited' ? 'SynoSearch Pro Unlimited' : 'SynoSearch Pro'}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    {activeTab === 1 && !user && <a href="https://pro.synosearch.com">No account? Get one here!</a>}
    {activeTab === 1 && <a></a>}
    {activeTab === 1 && !user && (
      <form onSubmit={handleSignIn}>
        <div>
          <label>
            Email:
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
        </div>
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