import React from 'react';
import styles from '../styles/Home.module.css'; // Adjust path as necessary

const SynoSearchModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>Close</button>
        {content}
      </div>
    </div>
  );
};

export default SynoSearchModal;