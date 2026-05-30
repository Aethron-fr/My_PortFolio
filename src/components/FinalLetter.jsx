import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinalLetter({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 3000);
    const t2 = setTimeout(() => setPhase(2), 9000);
    const t3 = setTimeout(() => setPhase(3), 15000);
    const t4 = setTimeout(() => setPhase(4), 21000);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99995,
        background: '#020002', color: '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 3 }}
            style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 300, textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}
          >
            I built this because some things don't fit into words.
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 3 }}
            style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 300, textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}
          >
            Because memories should have a place to rest.
          </motion.div>
        )}
        {phase === 3 && (
          <motion.div
            key="p3"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 3 }}
            style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 300, textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}
          >
            Thank you for being part of it.
          </motion.div>
        )}
        {phase === 4 && (
          <motion.div
            key="p4"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 3 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ fontSize: '1.2rem', color: 'rgba(0,247,255,0.8)', fontWeight: 300, fontStyle: 'italic', marginBottom: '40px' }}>
              Goodbye.
            </div>
            <button
              onClick={onComplete}
              style={{
                background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.4s ease'
              }}
              onMouseOver={e => e.target.style.color = '#fff'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
