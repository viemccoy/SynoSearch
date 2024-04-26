import styles from '../styles/Home.module.css';
import React from 'react';

export default function UpgradeModal({ isUpgradeOpen, setUpgradeOpen }) {
  if (!isUpgradeOpen) {
    return null;
  }

  return (
    <div className={styles.infoModal}>
      <button className={styles.closeButton} onClick={() => setUpgradeOpen(false)}>Close</button>
      <h1>Upgrade Required</h1>
      <p>Please upgrade to a paid plan in order to keep searching with SynoSearch.</p>
      <a href="https://pro.synosearch.com">Click here to upgrade</a>
    </div>
  );
}