import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioController } from '../audio';

export default function MemoryArchive({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Duck the volume during this heavy reading section
    audioController.setDucking(true);
    return () => audioController.setDucking(false);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2000);
    return () => clearTimeout(t1);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99990,
        background: '#020002', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,247,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 2 }}
            style={{ textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 300, letterSpacing: '-0.5px', marginBottom: '32px' }}>
              Memory Archive
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontWeight: 300, marginBottom: '40px' }}>
              We keep the things that we are afraid to lose. But keeping them doesn't mean they are still alive. Some things are just echoes.
            </p>

            <button
              onClick={onComplete}
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,247,255,0.3)',
                color: '#fff', padding: '12px 32px',
                borderRadius: '30px', fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(0,247,255,0.1)'}
              onMouseOut={e => e.target.style.background = 'transparent'}
            >
              Things I Never Said
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
