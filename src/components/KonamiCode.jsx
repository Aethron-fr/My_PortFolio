import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/sfx';

// The classic Konami Code sequence
const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+{}[]|:;"<>,.?/~\\'.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; 
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

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
        setProgress(key === KONAMI[0] ? [key] : []);
        return;
      }

      if (next.length === KONAMI.length) {
        setTriggered(true);
        sfx.playBassHum(); // Dramatic sound on activation
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
          transition={{ duration: 1.5 }}
          onClick={() => setTriggered(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999998,
            background: 'black',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <MatrixRain />
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.85)',
            padding: '2rem 4rem',
            border: '1px solid #0F0',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(0, 255, 0, 0.2)',
            backdropFilter: 'blur(10px)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '2rem',
              color: '#0F0',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              margin: '0 0 1rem 0'
            }}>
              System Override
            </h2>
            <p style={{ color: '#0A0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              Welcome to the construct. Click to exit.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
