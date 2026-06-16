import { useEffect, useState } from 'react';

// A stripped-down version of your actual App.jsx code to scroll in the background
const SOURCE_CODE = `
import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      <CustomCursor />
      <StardustTrail />
      <TechSphere />
      
      <main className="main-content">
        <section className="hero-section">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Engineering <span className="highlight">Digital</span> Masterpieces.
          </motion.h1>
          <div className="terminal-prompt">
            <span className="user">swapnadip@portfolio</span>:<span className="path">~/projects</span>$ 
            <span className="cursor" />
          </div>
        </section>
      </main>
    </div>
  );
}
`.trim();

export default function CodeBackground() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Split code and repeat it to make it long enough to scroll infinitely
    const codeLines = SOURCE_CODE.split('\n');
    const repeated = [...codeLines, ...codeLines, ...codeLines, ...codeLines, ...codeLines];
    setLines(repeated);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.04, // Extremely subtle
      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
    }}>
      <style>
        {`
          @keyframes scrollCode {
            0% { transform: translateY(0); }
            100% { transform: translateY(-33.33%); }
          }
        `}
      </style>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        lineHeight: '1.6',
        color: 'var(--accent-primary)', // or white
        padding: '2rem',
        animation: 'scrollCode 60s linear infinite',
        whiteSpace: 'pre',
      }}>
        {lines.map((line, i) => (
          <div key={i}>{line || ' '}</div>
        ))}
      </div>
    </div>
  );
}
