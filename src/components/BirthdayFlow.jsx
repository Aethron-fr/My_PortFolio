import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTES = [
  "Keep smiling — it suits you the best.",
  "Never stop being curious and creative.",
  "May this year surprise you in good ways.",
  "Always believe in yourself — you're capable."
];

const FINAL_MESSAGES = [
  "Hope your day is as cheerful as you are.",
  "May you achieve everything you're working towards.",
  "Never forget how strong and amazing you are.",
  "Wishing you a year full of smiles and growth."
];

export default function BirthdayFlow({ onComplete }) {
  const [step, setStep] = useState(0); // 0: Intro, 1: Notes, 2: Final Note
  const [randomMessage] = useState(() => FINAL_MESSAGES[Math.floor(Math.random() * FINAL_MESSAGES.length)]);

  useEffect(() => {
    // Auto-advance intro after 5 seconds
    if (step === 0) {
      const t = setTimeout(() => setStep(1), 5000);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#020002', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      {/* Cinematic Grain & Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 30%, #020002 90%)',
        pointerEvents: 'none'
      }} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="screen1"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            style={{ textAlign: 'center', maxWidth: '500px', padding: '0 24px' }}
          >
            <div style={{ 
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', 
              letterSpacing: '4px', color: 'rgba(225,48,108,0.7)', 
              textTransform: 'uppercase', marginBottom: '24px' 
            }}>
              Happy Birthday
            </div>
            <h1 style={{ 
              fontSize: '2.5rem', fontWeight: 300, 
              letterSpacing: '-1px', marginBottom: '32px' 
            }}>
              Anushka.
            </h1>
            <p style={{ 
              fontSize: '1rem', color: 'rgba(255,255,255,0.6)', 
              lineHeight: 1.8, fontWeight: 300 
            }}>
              Today is all about celebrating you — your kindness, your energy, and the positivity you bring around.
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="screen2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 2 }}
            style={{ maxWidth: '500px', padding: '0 24px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {NOTES.map((note, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: i * 1.5, ease: 'easeOut' }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '24px', borderRadius: '12px',
                  fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)',
                  fontWeight: 300
                }}
              >
                {note}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: NOTES.length * 1.5 + 1, duration: 1 }}
              style={{ textAlign: 'center', marginTop: '40px' }}
            >
              <button
                onClick={() => setStep(2)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(225,48,108,0.5)',
                  color: '#fff', padding: '12px 32px',
                  borderRadius: '30px', fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.3s ease'
                }}
                onMouseOver={e => e.target.style.background = 'rgba(225,48,108,0.1)'}
                onMouseOut={e => e.target.style.background = 'transparent'}
              >
                One Last Note
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="screen3"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}
          >
            <div style={{ 
              fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', 
              lineHeight: 1.8, fontWeight: 300, marginBottom: '60px',
              fontStyle: 'italic'
            }}>
              "{randomMessage}"
            </div>

            <button
              onClick={onComplete}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.4s ease'
              }}
              onMouseOver={e => e.target.style.color = '#fff'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
            >
              Enter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
