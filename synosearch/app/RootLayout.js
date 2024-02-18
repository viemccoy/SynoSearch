import React, { useEffect, useState } from 'react';
import ParticlesComponent from './ParticlesComponent';
import { Analytics } from '@vercel/analytics/react';

const RootLayout = ({ children, isDarkMode }) => {
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const childrenWithProps = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a typescript error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { isDarkMode: isDarkMode });
    }
    return child;
  });

  return (
    <>
      <Analytics />
      <ParticlesComponent isDarkMode={isDarkMode} />
      {childrenWithProps}
    </>
  );
};

export default RootLayout;