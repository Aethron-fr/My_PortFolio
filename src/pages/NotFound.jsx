import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 — Not Found | Swapnadip Ghosh';
    return () => {
      document.title = 'Swapnadip Ghosh — Crafted Slowly';
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#06060a',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-body, sans-serif)',
      }}
    >
      {/* Subtle ambient glow */}
      <div
        style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(225,48,108,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Error code */}
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.6rem',
            letterSpacing: '6px',
            color: 'rgba(225,48,108,0.6)',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          Signal Lost
        </div>

        <h1
          style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.06)',
            letterSpacing: '-4px',
            margin: '0 0 8px',
            lineHeight: 1,
            fontFamily: 'var(--font-heading, sans-serif)',
          }}
        >
          404
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 300,
            margin: '0 0 12px',
            lineHeight: 1.6,
          }}
        >
          This page doesn&apos;t exist.
        </p>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.2)',
            fontWeight: 300,
            margin: '0 0 48px',
            lineHeight: 1.7,
            maxWidth: '360px',
          }}
        >
          The address may have changed, or this path was never meant to be found.
        </p>

        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: '0 10px 25px rgba(225,48,108,0.35)',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            border: 'none',
            borderRadius: '50px',
            padding: '14px 36px',
            color: '#fff',
            fontFamily: 'var(--font-heading, sans-serif)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            letterSpacing: '0.5px',
          }}
        >
          Return Home
        </motion.button>

        {/* Subtle hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          style={{
            marginTop: '48px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.55rem',
            color: 'rgba(255,255,255,0.1)',
            letterSpacing: '2.5px',
          }}
        >
          some paths are not meant to be taken
        </motion.div>
      </motion.div>
    </div>
  );
}
