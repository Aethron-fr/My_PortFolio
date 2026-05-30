import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GiftIntro({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 3500);
    const t2 = setTimeout(() => setPhase(2), 7000);
    const t3 = setTimeout(() => setPhase(3), 11000);
    const t4 = setTimeout(() => onComplete(), 14000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99998,
        background: '#020002', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="p0"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.5 }}
            style={{ fontSize: '1.2rem', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}
          >
            I didn't know what to give you.
          </motion.div>
        )}
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.5 }}
            style={{ fontSize: '1.2rem', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}
          >
            So I built you a memory.
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 2 }}
            style={{ fontSize: '1.2rem', fontWeight: 300, color: 'rgba(0,247,255,0.7)', fontStyle: 'italic' }}
          >
            One Last Smile.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
