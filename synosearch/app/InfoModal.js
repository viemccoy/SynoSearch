import styles from '../styles/Home.module.css';
import React, { useEffect, useState } from 'react';


export default function InfoModal({ isInfoOpen, setInfoOpen, isDarkMode, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!isInfoOpen) {
    return null;
  }

  return (
    <div className={styles.infoModal}>
      <button className={styles.closeButton} onClick={() => setInfoOpen(false)}>X</button>
      <div className={styles.tabs}>
        {['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'].map((tab, index) => (
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
        {activeTab === 0 && <div>SynoSearch is the first AI-powered top-down semantic search designed by Vie McCoy to make search engines useful again.</div>}
        {activeTab === 0 && (
        <button
          className={styles.infoSettingsButton}
          onClick={toggleDarkMode}
          style={{ position: 'absolute', bottom: '10px', left: '10px' }}
        >
          {/* Icon changes based on the current theme */}
          {isDarkMode ? (
            <img src="/sun.svg" alt="Light Mode" className={styles.infoSettingsImage} />
          ) : (
            <img src="/moon.svg" alt="Dark Mode" className={styles.infoSettingsImage} />
          )}
        </button>
      )}
        {activeTab === 1 && <div>Content for Tab 2</div>}
        {activeTab === 2 && <div>Content for Tab 3</div>}
        {activeTab === 3 && <div>Content for Tab 4</div>}
        {activeTab === 4 && <div>Content for Tab 5</div>}
      </div>
    </div>
  );
}