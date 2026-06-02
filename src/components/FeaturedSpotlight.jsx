import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import OneLastSmileFeatures from './OneLastSmileFeatures';
import MagneticButton from './MagneticButton';
import { audioController } from '../audio';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

function SegmentedCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: '000', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const updateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference <= 0) {
        setTimeLeft({ days: '000', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      setTimeLeft({
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(3, '0'),
        hours: String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        minutes: String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seconds: String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0')
      });
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      margin: '0 auto 40px', flexWrap: 'wrap'
    }}>
      <Segment label="Days" value={timeLeft.days} />
      <Segment label="Hours" value={timeLeft.hours} />
      <Segment label="Minutes" value={timeLeft.minutes} />
      <Segment label="Seconds" value={timeLeft.seconds} />
    </div>
  );
}

function ExperienceModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(6,6,10,0.85)', backdropFilter: 'blur(20px)',
            padding: 24,
          }}
        >
          {/* subtle background glow */}
          <div style={{
            position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 60%)', pointerEvents: 'none'
          }} />
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'relative',
              background: '#040406',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 24,
              padding: '64px 48px',
              maxWidth: 580,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 24, right: 24,
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', padding: 8, fontSize: '1.2rem',
                transition: 'color 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 300, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>OneLastSmile</h2>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-cyber)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 40 }}>
              Opening on 3 January 2027
            </div>

            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontWeight: 300, marginBottom: 48, maxWidth: 380, margin: '0 auto 48px' }}>
              Some stories are meant to arrive at the right time.<br/><br/>
              This one isn't ready to be opened yet.
            </p>

            <SegmentedCountdown targetDate="2027-01-03T00:00:00" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


const Segment = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      padding: '12px 14px',
      backdropFilter: 'blur(10px)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 300,
        color: 'rgba(255,255,255,0.9)', letterSpacing: '2px',
      }}>{value}</span>
    </div>
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '2px',
      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
    }}>{label}</span>
  </div>
);

export default function FeaturedSpotlight() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [transitioning, setTransitioning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        audioController.setSection('onelastsmile');
      } else {
        audioController.setSection('home');
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleNavigate = (dest) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      navigate(dest);
      setTransitioning(false);
    }, 400);
  };

  return (
    <>
    <ExperienceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        maxWidth: 900,
        margin: '60px auto 100px',
        borderRadius: 24,
        overflow: 'hidden',
        cursor: 'default',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: '#040406',
        zIndex: 0,
      }} />

      <div style={{
        position: 'absolute', inset: 0, backgroundImage: GRAIN,
        opacity: 0.05, mixBlendMode: 'overlay', pointerEvents: 'none',
        zIndex: 1, transform: 'translateZ(0)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(6,182,212,0.4), rgba(139,92,246,0.4))',
        padding: '1px',
        borderRadius: 24,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        style={{
          position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          transform: 'skewX(-20deg)', pointerEvents: 'none', zIndex: 1,
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none', zIndex: 1,
          left: glowX, top: glowY,
          x: '-50%', y: '-50%',
        }}
      />

      <div style={{
        position: 'relative', zIndex: 3,
        padding: 'clamp(60px, 8vw, 100px) clamp(32px, 6vw, 80px)',
        textAlign: 'center',
      }}>
        <motion.div 
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            display: 'inline-block',
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.3)',
            borderRadius: 20,
            padding: '6px 16px',
            fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
            letterSpacing: '4px', color: 'var(--accent-cyber)',
            textTransform: 'uppercase', marginBottom: 40,
            boxShadow: '0 0 20px rgba(6,182,212,0.15)',
          }}
        >
          Flagship Experience
        </motion.div>

        <h2 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 300, color: '#ffffff',
          letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 24,
        }}>
          OneLastSmile
        </h2>

        <p style={{
          fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.8, fontWeight: 300,
          maxWidth: 540, margin: '0 auto 32px',
        }}>
          Built over more than a year. <br/>
          A personal interactive experience exploring memory, storytelling, permanence, and the things we never get to say.
        </p>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: 48,
        }}>
          Opening: 3 January 2027
        </div>

        <SegmentedCountdown targetDate="2027-01-03T00:00:00" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: 640,
          margin: '0 auto',
        }}>
          <MagneticButton
            onClick={() => setModalOpen(true)}
            glowColor="rgba(255,255,255,0.15)"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '16px 24px',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            ✦ Experience
          </MagneticButton>

          <MagneticButton
            onClick={() => handleNavigate('/case-study/onelastsmile')}
            glowColor="rgba(255,255,255,0.08)"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '16px 24px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Case Study
          </MagneticButton>

          <MagneticButton
            onClick={() => handleNavigate('/journey/onelastsmile')}
            glowColor="rgba(255,255,255,0.08)"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '16px 24px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Dev Journey
          </MagneticButton>
        </div>
      </div>
    </div>
    <OneLastSmileFeatures />
    </>
  );
}
