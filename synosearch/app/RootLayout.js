import React from 'react';
import ParticlesComponent from './ParticlesComponent';

const RootLayout = ({ children }) => {
  return (
    <>
      <ParticlesComponent />
      {children}
    </>
  );
};

export default RootLayout;