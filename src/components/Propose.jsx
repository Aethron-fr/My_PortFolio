import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Propose({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete(), 6000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99992,
        background: '#020002', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 2, delay: 1 }}
        style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', fontWeight: 300, textAlign: 'center' }}
      >
        So... what do we do with this?
      </motion.div>
    </motion.div>
  );
}
