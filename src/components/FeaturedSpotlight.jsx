import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export default function FeaturedSpotlight() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [transitioning, setTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2027-01-03T00:00:00').getTime();
    const updateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

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
          fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)',
          lineHeight: 1.85, fontWeight: 300,
          maxWidth: 380, margin: '0 auto 12px',
        }}>
          An atmosphere built from memory and silence.
        </p>

        {/* Status */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
          color: 'rgba(255,255,255,0.1)', letterSpacing: '3px',
          marginBottom: 40,
        }}>
          Winter 2021
        </div>

        {/* Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '16px', 
          width: '100%',
          maxWidth: '580px',
          margin: '0 auto'
        }}>
          <motion.button
            whileHover={{ opacity: 1, borderColor: 'rgba(255,255,255,0.15)' }}
            disabled={true}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px', padding: '16px 20px',
              color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem', letterSpacing: '3px',
              textTransform: 'uppercase', cursor: 'not-allowed',
              transition: 'all 0.4s ease',
              backdropFilter: 'blur(10px)',
              width: '100%'
            }}
          >
            Locked
          </motion.button>

          <motion.button
            whileHover={{ 
              background: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.2)', 
              color: '#fff',
              boxShadow: '0 0 20px rgba(255,255,255,0.05)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleEnter('/case-study/onelastsmile')}
            disabled={transitioning}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '16px 20px',
              color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem', letterSpacing: '3px',
              textTransform: 'uppercase', cursor: transitioning ? 'default' : 'pointer',
              transition: 'all 0.4s ease',
              backdropFilter: 'blur(10px)',
              width: '100%'
            }}
          >
            Case Study
          </motion.button>

          <motion.button
            whileHover={{
              background: 'rgba(225,48,108,0.1)',
              boxShadow: '0 0 24px rgba(225,48,108,0.3)',
              borderColor: 'rgba(225,48,108,0.6)',
              color: '#fff'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleEnter('/showcase/onelastsmile')}
            disabled={transitioning}
            style={{
              background: 'rgba(225,48,108,0.05)',
              border: '1px solid rgba(225,48,108,0.25)',
              borderRadius: '12px', padding: '16px 20px',
              color: 'rgba(225,48,108,0.9)', fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem', letterSpacing: '3px',
              textTransform: 'uppercase', cursor: transitioning ? 'default' : 'pointer',
              transition: 'all 0.4s ease',
              backdropFilter: 'blur(10px)',
              width: '100%'
            }}
          >
            Special Access
          </motion.button>
        </div>

        {/* Atmosphere & Timer */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 2 }}
          style={{ marginTop: '48px', textAlign: 'center' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.4)', fontStyle: 'italic',
            marginBottom: '16px', fontWeight: 300
          }}>
            "Some memories wait for the right day."
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            letterSpacing: '4px', color: 'rgba(225,48,108,0.7)',
            display: 'flex', gap: '24px', justifyContent: 'center',
            textTransform: 'uppercase', textShadow: '0 0 12px rgba(225,48,108,0.2)'
          }}>
            <span>{timeLeft.days.toString().padStart(2, '0')} Days</span>
            <span>{timeLeft.hours.toString().padStart(2, '0')} Hrs</span>
            <span>{timeLeft.minutes.toString().padStart(2, '0')} Min</span>
            <span>{timeLeft.seconds.toString().padStart(2, '0')} Sec</span>
          </div>
          
          <div style={{
            marginTop: '16px', fontFamily: 'var(--font-mono)', 
            fontSize: '0.55rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase'
          }}>
            Until January 3, 2027
          </div>
        </motion.div>
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
