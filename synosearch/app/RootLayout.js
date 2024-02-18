import React, { useEffect, useState } from 'react';
import ParticlesComponent from './ParticlesComponent';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from './providers';
import { useTheme } from 'next-themes'; // Import useTheme
import { ThemeContext } from './ThemeContext'; // Adjust the path according to your project structure

function RootLayout({ children }) {
  const { theme } = useTheme();

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child);
    }
    return child;
  });

  return (
    <>
    <Providers>
    <ThemeContext.Provider value={theme}>
      <Analytics />
      <ParticlesComponent/>
        {childrenWithProps}
    </ThemeContext.Provider>
    </Providers>
    </>
  );
};

export default RootLayout;