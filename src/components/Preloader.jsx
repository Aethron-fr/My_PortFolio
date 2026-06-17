import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/sfx';

export default function Preloader({ onComplete }) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Only run once per session to avoid annoying the user on refresh
    if (sessionStorage.getItem('preloader_done')) {
      onComplete();
      return;
    }

    const bootSequence = async () => {
      sfx.init();
      sfx.playBassHum();

      const lines = [
        "INITIALIZING SYSTEM...",
        "DECRYPTING NEURAL LINK...",
        "LOADING PORTFOLIO ASSETS...",
        "WELCOME, USER."
      ];

      for (let i = 0; i < lines.length; i++) {
        setText(lines[i]);
        sfx.playTerminalKeystroke();
        await new Promise(r => setTimeout(r, 600));
      }

      setPhase(1);
      setTimeout(() => {
        sessionStorage.setItem('preloader_done', 'true');
        onComplete();
      }, 800);
    };

    bootSequence();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#06060a',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            letterSpacing: '2px',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {text}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              _
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
