import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quote = "Some things are built only to be remembered.";

const CinematicLoader = ({ onComplete }) => {
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    // Show quote after a short delay
    const quoteTimer = setTimeout(() => setShowQuote(true), 500);
    
    // Typing takes about 0.05s * 44 chars = 2.2s
    // Hold for 1.5s after typing = 3.7s
    // Then start fade out
    const hideTimer = setTimeout(() => {
      setShowQuote(false);
    }, 4200);

    // Fade out takes 1.2s, so complete at 5.5s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5400);

    return () => {
      clearTimeout(quoteTimer);
      clearTimeout(hideTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000', // Full black as requested
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              color: '#ffffff',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
              letterSpacing: '3px',
              fontWeight: 300,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {quote.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{
                  duration: 0.1,
                  delay: index * 0.05,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CinematicLoader;
