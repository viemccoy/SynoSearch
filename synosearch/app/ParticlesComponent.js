import React, { useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadLinksPreset } from "@tsparticles/preset-links";
import styles from "../styles/Home.module.css";
import { useTheme } from 'next-themes';


const ParticlesComponent = () => {
  const [init, setInit] = useState(false);
  const { theme } = useTheme();

  const calculateParticleDensity = () => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 480) {
        return 800; // More particles for small screens
      } else if (windowWidth <= 768) {
        return 1200; // Fewer particles for medium screens
      } else {
        return 1500; // Even fewer particles for large screens
      }
    }
    return 1500; // Default value for server-side rendering
  };

  useEffect(() => {
    if (init) {
      return;
    }
    initParticlesEngine(async (engine) => {
      await loadLinksPreset(engine);
    }).then(() => {
      setInit(true);
    });
  
    // Add event listener for window resize
    window.addEventListener('resize', () => {
      setInit(false); // Reset particles
    });
  }, [init]); // Add dependency array here

  return (
    <Particles
      className={styles.particles}
      id="tsparticles"
      options={{
        background: {
          color: {
            value: theme === 'dark' ? "#000000" : "#ffffff",
          },
        },
        particles: {
          number: {
            density: {
              enable: true,
              value_area: calculateParticleDensity(),
            },
          },
          color: {
            value: theme === 'dark' ? "#ffffff" : "#000000",
          },
          links: {
            color: theme === 'dark' ? "#ffffff" : "#000000",
          },
          shape: {
            type: "circle",
          },
        },
        preset: "links",
      }}
    />
  );
}

export default React.memo(ParticlesComponent);