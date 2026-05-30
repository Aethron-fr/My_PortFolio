import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OneLastThing({ onComplete }) {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Only reveal the hidden trigger after a long delay of silence
    const t = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => onComplete(), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99994,
        background: '#020002', display: 'flex',
        alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '3vh'
      }}
    >
      <AnimatePresence>
        {visible && !clicked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 0.4 }}
            transition={{ duration: 3 }}
            onClick={handleClick}
            style={{
              cursor: 'pointer', fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem', color: '#fff', padding: '10px'
            }}
          >
            .
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
