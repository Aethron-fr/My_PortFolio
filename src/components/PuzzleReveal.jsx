import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePuzzle } from '../context/PuzzleContext';

// The sequence — each word surfaces, breathes, fades.
// Then: A.
const SEQUENCE = [
  { word: 'rain.',      delay: 800,   hold: 3000 },
  { word: 'winter.',    delay: 4600,  hold: 3000 },
  { word: 'white.',     delay: 8400,  hold: 3000 },
  { word: 'moonlight.', delay: 12200, hold: 3000 },
  { word: '2021.',      delay: 16200, hold: 3400 },
  // A pause. Then the final word.
  { word: 'A.',         delay: 21800, hold: 6500 },
];

const TOTAL_DURATION = 21800 + 6500 + 2500; // final word end + fade

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export default function PuzzleReveal() {
  const { showReveal, dismissReveal } = usePuzzle();
  const [activeWord, setActiveWord] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | running | ending

  useEffect(() => {
    if (!showReveal) {
      setActiveWord(null);
      setPhase('idle');
      return;
    }

    setPhase('running');
    const timers = [];

    SEQUENCE.forEach(({ word, delay, hold }) => {
      timers.push(setTimeout(() => setActiveWord(word), delay));
      timers.push(setTimeout(() => {
        setActiveWord(w => w === word ? null : w);
      }, delay + hold));
    });

    // After everything fades — begin exit
    timers.push(setTimeout(() => {
      setPhase('ending');
      setTimeout(dismissReveal, 2500);
    }, TOTAL_DURATION));

    return () => timers.forEach(clearTimeout);
  }, [showReveal, dismissReveal]);

  return (
    <AnimatePresence>
      {showReveal && (
        <motion.div
          key="puzzle-reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'ending' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          onClick={dismissReveal}
          style={{
            position: 'fixed', inset: 0, zIndex: 999999,
            background: '#020002',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'default',
          }}
        >
          {/* Film grain */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: GRAIN,
            opacity: 0.04, mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }} />

          {/* Moonlight glow — top right, breathes */}
          <motion.div
            animate={{ opacity: [0.06, 0.16, 0.06] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: -80, right: -80,
              width: 500, height: 500, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(220,230,255,0.14) 0%, transparent 65%)',
              filter: 'blur(80px)', pointerEvents: 'none',
            }}
          />

          {/* Ambient glow behind text */}
          <motion.div
            animate={{ opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(100,100,180,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* The word sequence */}
          <AnimatePresence mode="wait">
            {activeWord && (
              <motion.p
                key={activeWord}
                initial={{ opacity: 0, filter: 'blur(18px)' }}
                animate={{
                  opacity: activeWord === 'A.' ? 0.92 : 0.48,
                  filter: 'blur(0px)',
                }}
                exit={{ opacity: 0, filter: 'blur(18px)' }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: activeWord === 'A.'
                    ? 'clamp(2.2rem, 6vw, 4rem)'
                    : 'clamp(0.95rem, 2.5vw, 1.5rem)',
                  fontWeight: 300,
                  color: activeWord === 'A.'
                    ? 'rgba(244,244,244,0.94)'
                    : 'rgba(255,255,255,0.42)',
                  letterSpacing: activeWord === 'A.' ? '14px' : '5px',
                  margin: 0, textAlign: 'center',
                  userSelect: 'none', pointerEvents: 'none',
                }}
              >
                {activeWord}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Skip hint — barely visible, appears only after 10s */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 10, duration: 3 }}
            style={{
              position: 'absolute', bottom: 28, left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
              color: 'rgba(255,255,255,0.4)', letterSpacing: '3px',
              pointerEvents: 'none', whiteSpace: 'nowrap',
            }}
          >
            click anywhere to leave
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
