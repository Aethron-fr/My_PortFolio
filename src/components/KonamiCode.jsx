import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// The classic Konami Code sequence
const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export default function KonamiCode() {
  const [triggered, setTriggered] = useState(false);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key;
      const next = [...progress, key];

      // Check if current sequence matches beginning of Konami code
      const isOnTrack = KONAMI.slice(0, next.length).every(
        (k, i) => k === next[i]
      );

      if (!isOnTrack) {
        // Wrong key — reset, but check if this key starts a new attempt
        setProgress(key === KONAMI[0] ? [key] : []);
        return;
      }

      if (next.length === KONAMI.length) {
        setTriggered(true);
        setProgress([]);
      } else {
        setProgress(next);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [progress]);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          key="konami"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setTriggered(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(12px)',
            cursor: 'pointer',
            padding: '2rem',
          }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ textAlign: 'center', maxWidth: '520px' }}
          >
            {/* Glowing icon */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ fontSize: '4rem', marginBottom: '28px' }}
            >
              🌙
            </motion.div>

            {/* Secret message */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
              letterSpacing: '3px',
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              you found it.
            </p>

            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
              lineHeight: 1.4,
              marginBottom: '24px',
            }}>
              "Still building.
              <br />
              Still waiting.
              <br />
              Still here."
            </h2>

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-cyber)',
              letterSpacing: '2px',
              marginBottom: '32px',
            }}>
              — Swapnadip, 2024
            </p>

            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              click anywhere to close
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
