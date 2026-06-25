import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalHackOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleHack = () => {
      setShow(true);
      // Auto-hide after 5 seconds of intense hacking
      setTimeout(() => {
        setShow(false);
      }, 5000);
    };

    window.addEventListener('trigger-hack', handleHack);
    return () => window.removeEventListener('trigger-hack', handleHack);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999, // extremely high to cover everything
            pointerEvents: 'none', // Don't actually block interaction, just visual takeover
            background: 'rgba(255, 0, 0, 0.1)',
            backdropFilter: 'contrast(1.5) saturate(2) hue-rotate(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            fontFamily: 'var(--font-mono)'
          }}
        >
          {/* Glitch Overlay Text */}
          <div style={{
            position: 'relative',
            fontSize: 'clamp(2rem, 8vw, 6rem)',
            fontWeight: '900',
            color: '#ff003c',
            textShadow: '4px 4px 0 #00f7ff, -4px -4px 0 #39d353',
            animation: 'hackGlitch 0.2s infinite',
            whiteSpace: 'nowrap'
          }}>
            SYSTEM COMPROMISED
          </div>
          
          <div style={{
            color: '#fff',
            fontSize: 'clamp(1rem, 3vw, 2rem)',
            marginTop: '20px',
            background: '#ff003c',
            padding: '10px 20px',
            textTransform: 'uppercase',
            letterSpacing: '5px',
            animation: 'pulse 0.5s infinite'
          }}>
            Unauthorized Access Detected
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes hackGlitch {
              0% { transform: translate(0) }
              20% { transform: translate(-5px, 5px) }
              40% { transform: translate(-5px, -5px) }
              60% { transform: translate(5px, 5px) }
              80% { transform: translate(5px, -5px) }
              100% { transform: translate(0) }
            }
            body {
              animation: hackBodyShake 0.1s infinite !important;
            }
            @keyframes hackBodyShake {
              0% { filter: hue-rotate(0deg) contrast(1); }
              50% { filter: hue-rotate(90deg) contrast(1.5) invert(0.1); }
              100% { filter: hue-rotate(0deg) contrast(1); }
            }
          `}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
