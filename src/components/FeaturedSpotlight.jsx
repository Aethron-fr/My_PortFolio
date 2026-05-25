import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export default function FeaturedSpotlight() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [transitioning, setTransitioning] = useState(false);

  // Subtle cursor-aware glow — restrained
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glowX = useSpring(rawX, { stiffness: 40, damping: 25 });
  const glowY = useSpring(rawY, { stiffness: 40, damping: 25 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  const handleEnter = (dest = '/onelastsmile') => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => navigate(dest), 900);
  };

  return (
    <>
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        maxWidth: 680,
        margin: '0 auto',
        borderRadius: 24,
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Card background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #09030a 0%, #020002 60%, #06030a 100%)',
        zIndex: 0,
      }} />

      {/* Film grain */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: GRAIN,
        opacity: 0.05, mixBlendMode: 'overlay', pointerEvents: 'none',
        zIndex: 1, transform: 'translateZ(0)',
      }} />

      {/* Ambient crimson glow — breathing */}
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: -40, left: '50%',
          transform: 'translateX(-50%)',
          width: '70%', height: '180px',
          background: 'radial-gradient(ellipse, rgba(180,38,68,0.18) 0%, transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none', zIndex: 1,
        }}
      />

      {/* Cursor-reactive glow — subtle */}
      <motion.div
        style={{
          position: 'absolute',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,38,68,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none', zIndex: 1,
          left: glowX,
          top: glowY,
          x: '-50%', y: '-50%',
        }}
      />

      {/* Top border accent */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(180,38,68,0.4), transparent)',
        zIndex: 2,
      }} />

      {/* Card border */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: 24, zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3,
        padding: 'clamp(40px, 6vw, 72px) clamp(28px, 6vw, 64px)',
        textAlign: 'center',
      }}>

        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
          letterSpacing: '6px', color: 'rgba(180,48,72,0.55)',
          textTransform: 'uppercase', marginBottom: 28,
        }}>
          Featured Experience
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 300, color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 20,
        }}>
          OneLastSmile
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '0.95rem', color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.85, fontWeight: 300,
          maxWidth: 380, margin: '0 auto 12px',
        }}>
          A cinematic experience built around quiet emotional distance.
          Restrained. Intentional. Deeply engineered.
        </p>

        {/* Status */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          color: 'rgba(255,255,255,0.14)', letterSpacing: '3px',
          marginBottom: 40,
        }}>
          Sealed — Opening January 2027
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{
              opacity: 1,
              boxShadow: '0 0 24px rgba(180,38,68,0.25)',
              borderColor: 'rgba(180,38,68,0.45)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleEnter('/onelastsmile')}
            disabled={transitioning}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 30, padding: '12px 28px',
              color: '#fff', fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', letterSpacing: '2px',
              textTransform: 'uppercase', cursor: transitioning ? 'default' : 'pointer',
              transition: 'all 0.4s ease',
            }}
          >
            {transitioning ? 'Entering…' : 'Enter Experience'}
          </motion.button>

          <motion.button
            whileHover={{ opacity: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleEnter('/onelastsmile')}
            disabled={transitioning}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 30, padding: '12px 28px',
              color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', letterSpacing: '2px',
              textTransform: 'uppercase', cursor: transitioning ? 'default' : 'pointer',
              transition: 'all 0.4s ease',
            }}
          >
            About The Project
          </motion.button>
        </div>
      </div>
    </div>

    {/* Cinematic transition overlay */}
    <AnimatePresence>
      {transitioning && (
        <motion.div
          key="transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#020002',
            pointerEvents: 'all',
          }}
        >
          {/* Grain on overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: GRAIN, opacity: 0.05,
            mixBlendMode: 'overlay',
          }} />
          {/* Subtle crimson glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300, height: 300, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(180,38,68,0.2) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
