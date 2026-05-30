import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuietAftermath({ onComplete }) {
  useEffect(() => {
    // Acknowledge the memory, then let them back in.
    const t = setTimeout(() => onComplete(), 7000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99997,
        background: '#010001', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 2, delay: 1 }}
        style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300, textAlign: 'center', fontStyle: 'italic' }}
      >
        You've been here before.<br/><br/>
        The story remembers.
      </motion.div>
    </motion.div>
  );
}
