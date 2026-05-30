import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioController } from '../audio';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export default function ThresholdScreen({ onEnter, onSkip }) {
  const [visible, setVisible] = useState(true);

  // Lock scroll while Threshold is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleAction = (action) => {
    audioController.init();
    audioController.resume();
    setVisible(false);
    setTimeout(() => {
      if (action === 'enter') onEnter();
      else onSkip();
    }, 2800); // Wait for the heavy blur transition to finish before unmounting
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="threshold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: 2.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 999990,
            background: '#010001',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}
        >
          {/* Film Grain */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: GRAIN, opacity: 0.05,
            mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 2,
          }} />

          {/* Crimson Fog / Glow */}
          <motion.div
            animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80vw', height: '80vh',
              background: 'radial-gradient(ellipse, rgba(225,48,108,0.15) 0%, transparent 60%)',
              filter: 'blur(120px)', pointerEvents: 'none', zIndex: 1,
            }}
          />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 300, letterSpacing: '4px',
                margin: '0 0 16px 0',
              }}
            >
              OneLastSmile
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 2, delay: 1.5, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                fontWeight: 300, letterSpacing: '2px',
                margin: '0 0 48px 0',
                fontStyle: 'italic',
              }}
            >
              Some experiences are better explored slowly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 2.5, ease: 'easeOut' }}
              style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}
            >
              <button
                onClick={() => handleAction('enter')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.8)',
                  padding: '12px 32px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  transition: 'background 0.3s, color 0.3s, border-color 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                Enter
              </button>
              
              <button
                onClick={() => handleAction('skip')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  padding: '12px 16px',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                Skip Atmosphere
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
