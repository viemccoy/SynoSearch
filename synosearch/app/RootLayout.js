import React from 'react';
import ParticlesComponent from './ParticlesComponent';
import { Analytics } from '@vercel/analytics/react';

const RootLayout = ({ children }) => {
  return (
    <>
      <Analytics />
      <ParticlesComponent />
      {children}
    </>
  );
};

export default RootLayout;