import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtmosphere } from '../context/AtmosphereContext';

const IDLE_MESSAGES = [
  "You came back...",
  "Still here...",
  "Some things stay with us...",
  "Silence is heavy tonight."
];

export default function IdleMessages() {
  const { isIdle } = useAtmosphere();
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isIdle) {
      const randomMsg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
      setMessage(randomMsg);
      setVisible(true);

      // The message fades out on its own after 6 seconds even if still idle
      const t = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isIdle]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          style={{
            position: 'fixed', bottom: '15%', left: 0, right: 0,
            textAlign: 'center', pointerEvents: 'none', zIndex: 9999,
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.4)', letterSpacing: '4px',
            textTransform: 'uppercase'
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
