import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quote = "Some things are built only to be remembered.";

const CinematicLoader = ({ onComplete }) => {
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    // Show quote after a short delay
    const quoteTimer = setTimeout(() => setShowQuote(true), 500);
    
    // Hide quote and unmount the entire loader
    const hideTimer = setTimeout(() => {
      setShowQuote(false);
    }, 4000);

    // Call onComplete to trigger the main app fade-in
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

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
        backgroundColor: '#020204',
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
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
                animate={{ opacity: 0.6 }}
                transition={{
                  duration: 0.5,
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
