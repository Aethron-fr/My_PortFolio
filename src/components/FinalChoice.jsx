import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinalChoice({ onComplete }) {
  const [chosen, setChosen] = useState(false);

  const handleChoice = (choice) => {
    // "keep" or "fade"
    localStorage.setItem('final_decision_locked', choice);
    localStorage.setItem('ols_session_end', Date.now().toString());
    setChosen(true);
    setTimeout(() => onComplete(choice), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99993,
        background: '#020002', color: '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        {!chosen ? (
          <motion.div
            key="choices"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
            transition={{ duration: 2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}
          >
            <button
              onClick={() => handleChoice('keep')}
              style={{
                background: 'transparent', border: '1px solid rgba(0,247,255,0.4)',
                color: 'rgba(255,255,255,0.9)', padding: '16px 48px',
                borderRadius: '30px', fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.4s ease',
                boxShadow: '0 0 20px rgba(0,247,255,0.05)'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(0,247,255,0.05)'}
              onMouseOut={e => e.target.style.background = 'transparent'}
            >
              Keep This Story
            </button>

            <button
              onClick={() => handleChoice('fade')}
              style={{
                background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,0.3)', padding: '16px 48px',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', 
                letterSpacing: '4px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.4s ease'
              }}
              onMouseOver={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >
              Let It Fade Away
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.2)', letterSpacing: '4px', textTransform: 'uppercase'
            }}
          >
            Locked.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
