import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicIntro({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // A long, slow breath before the experience starts.
    const t1 = setTimeout(() => setPhase(1), 2000);
    const t2 = setTimeout(() => setPhase(2), 6000);
    const t3 = setTimeout(() => onComplete(), 10000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99996,
        background: '#020002', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
            transition={{ duration: 3 }}
            style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}
          >
            Loading Memory...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
