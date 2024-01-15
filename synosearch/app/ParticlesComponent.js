import React, { useEffect } from 'react';

const ParticlesComponent = () => {
  useEffect(() => {
    import('particles.js').then(({ default: particlesJS }) => {
      particlesJS.particlesJS.load('particles-js', 'assets/particles.json', function() {
        console.log('callback - particles.js config loaded');
      });
    });
  }, []);

  return <div id="particles-js" className="fullscreen"></div>;
};

export default ParticlesComponent;