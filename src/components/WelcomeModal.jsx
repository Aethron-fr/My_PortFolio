import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeModal({ onEnter }) {
  const [step, setStep] = useState(1);
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2, 0, 2, 0.75)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 24,
            padding: '48px 40px',
            maxWidth: 520,
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle ambient glow behind text */}
          <div style={{
            position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
            width: '80%', height: '100px',
            background: 'radial-gradient(ellipse at top, rgba(180,40,70,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  letterSpacing: '5px', color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase', marginBottom: 24,
                }}>
                  Initialization
                </div>

                <h2 style={{
                  fontSize: '1.8rem', fontWeight: 300, color: '#fff',
                  letterSpacing: '-0.5px', marginBottom: 20,
                  lineHeight: 1.3,
                }}>
                  Welcome to my <br/> digital memory.
                </h2>

                <p style={{
                  fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.8, fontWeight: 300, marginBottom: 40,
                  maxWidth: 400, margin: '0 auto 40px',
                }}>
                  Take your time. Drift through the sections. Let the atmosphere settle before you interact. 
                </p>

                <motion.button
                  whileHover={{ 
                    opacity: 1, 
                    boxShadow: '0 0 25px rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff', fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase',
                    padding: '14px 32px', borderRadius: 30, cursor: 'pointer',
                    transition: 'all 0.4s ease',
                  }}
                >
                  Acknowledge →
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  letterSpacing: '5px', color: 'rgba(180,40,70,0.8)',
                  textTransform: 'uppercase', marginBottom: 24,
                }}>
                  System Status
                </div>

                <h2 style={{
                  fontSize: '1.8rem', fontWeight: 300, color: '#fff',
                  letterSpacing: '-0.5px', marginBottom: 20,
                  lineHeight: 1.3,
                }}>
                  This digital space is <br/> still taking shape.
                </h2>

                <p style={{
                  fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.8, fontWeight: 300, marginBottom: 40,
                  maxWidth: 400, margin: '0 auto 40px',
                }}>
                  You've arrived while the foundations are still being built. Sections may shift, stories may evolve, and the silence is intentional.
                </p>

                <motion.button
                  whileHover={{ 
                    opacity: 1, 
                    boxShadow: '0 0 25px rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEnter}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff', fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase',
                    padding: '14px 32px', borderRadius: 30, cursor: 'pointer',
                    transition: 'all 0.4s ease',
                  }}
                >
                  Enter Site
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
