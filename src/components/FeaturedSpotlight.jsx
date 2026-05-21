import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import StoryMode from './StoryMode';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

const MEMORY_PHRASES = [
  '2:14 AM', 'typing...', 'never mind', 'seen',
  'draft unsaved', 'still here', 'maybe later', 'i almost sent this',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FeaturedSpotlight() {
  const [showStory, setShowStory]             = useState(false);
  const [showAbout, setShowAbout]             = useState(false);
  const [showCapture, setShowCapture]         = useState(false);
  const [userEmail, setUserEmail]             = useState('');
  const [emailInput, setEmailInput]           = useState('');
  const [emailError, setEmailError]           = useState('');
  const [captureSubmitting, setCaptureSubmitting] = useState(false);
  const [artifacts, setArtifacts]             = useState([]);
  const inputRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const fogX = useSpring(rawX, { stiffness: 28, damping: 20 });
  const fogY = useSpring(rawY, { stiffness: 28, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  // Memory fragment spawner
  useEffect(() => {
    let timeout;
    const spawn = () => {
      const id = Date.now();
      const artifact = {
        id,
        text: MEMORY_PHRASES[Math.floor(Math.random() * MEMORY_PHRASES.length)],
        x: 10 + Math.random() * 72,
        y: 10 + Math.random() * 72,
        duration: 3500 + Math.random() * 3000,
      };
      setArtifacts(prev => [...prev.slice(-4), artifact]);
      setTimeout(() => setArtifacts(prev => prev.filter(a => a.id !== id)), artifact.duration);
      timeout = setTimeout(spawn, 2800 + Math.random() * 3500);
    };
    spawn();
    return () => clearTimeout(timeout);
  }, []);

  // Auto-focus email input when capture modal opens
  useEffect(() => {
    if (showCapture) {
      const t = setTimeout(() => inputRef.current?.focus(), 600);
      return () => clearTimeout(t);
    }
  }, [showCapture]);

  const handleEnterStory = useCallback(() => {
    setEmailError('');
    setEmailInput('');
    setShowCapture(true);
  }, []);

  const handleEmailSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError('That doesn\'t look like a valid email.');
      return;
    }
    setCaptureSubmitting(true);
    setUserEmail(trimmed);
    setTimeout(() => {
      setCaptureSubmitting(false);
      setShowCapture(false);
      setTimeout(() => setShowStory(true), 350);
    }, 700);
  }, [emailInput]);

  const handleSkipCapture = useCallback(() => {
    setShowCapture(false);
    setTimeout(() => setShowStory(true), 200);
  }, []);

  return (
    <>
      {/* ── Story Mode overlay ── */}
      <AnimatePresence>
        {showStory && (
          <StoryMode key="story" userEmail={userEmail} onClose={() => setShowStory(false)} />
        )}
      </AnimatePresence>

      {/* ── Email Capture Modal ── */}
      <AnimatePresence>
        {showCapture && (
          <motion.div
            key="capture-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            onClick={e => { if (e.target === e.currentTarget) setShowCapture(false); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99998,
              background: 'rgba(2,0,2,0.92)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            {/* Ambient crimson glow */}
            <motion.div
              animate={{ opacity: [0.06, 0.13, 0.06] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(circle at 50% 45%, rgba(150,25,55,0.18) 0%, transparent 65%)',
                filter: 'blur(60px)',
              }}
            />

            {/* Dust particles */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -(14 + i % 6), 0], opacity: [0.03, 0.1, 0.03] }}
                  transition={{ duration: 9 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.55 }}
                  style={{
                    position: 'absolute', width: 1.5, height: 1.5,
                    background: '#fff', borderRadius: '50%',
                    left: `${8 + i * 8}%`, top: `${18 + i * 7}%`,
                    filter: 'blur(0.8px)',
                  }}
                />
              ))}
            </div>

            {/* Glass card */}
            <motion.div
              initial={{ opacity: 0, y: 28, filter: 'blur(16px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(16px)' }}
              transition={{ duration: 1.1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: 420, width: '100%',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.055)',
                borderRadius: 22, padding: '52px 40px 44px',
                textAlign: 'center', position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Top crimson accent */}
              <div style={{
                position: 'absolute', top: 0, left: '18%', right: '18%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(180,38,68,0.55), transparent)',
              }} />

              {/* Grain */}
              <div style={{
                position: 'absolute', inset: 0, backgroundImage: GRAIN,
                opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none',
              }} />

              {/* Label */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
                letterSpacing: '5px', color: 'rgba(180,48,72,0.6)',
                textTransform: 'uppercase', marginBottom: 28,
                position: 'relative',
              }}>
                Story Mode
              </div>

              {/* Headline */}
              <p style={{
                fontSize: '1.05rem', color: 'rgba(255,255,255,0.82)',
                fontWeight: 300, lineHeight: 1.8, marginBottom: 10,
                position: 'relative',
              }}>
                Before entering,<br />
                leave behind a name<br />
                the silence can remember.
              </p>

              {/* Subtext */}
              <p style={{
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.27)',
                fontWeight: 300, lineHeight: 1.8, marginBottom: 36,
                position: 'relative',
              }}>
                Your email connects your thought to the experience.
              </p>

              {/* Form */}
              <form onSubmit={handleEmailSubmit} style={{ position: 'relative' }}>
                <div style={{ position: 'relative', marginBottom: 14 }}>
                  <input
                    ref={inputRef}
                    type="email"
                    value={emailInput}
                    onChange={e => { setEmailInput(e.target.value); setEmailError(''); }}
                    placeholder="your@email.com"
                    autoComplete="email"
                    style={{
                      width: '100%', padding: '13px 18px',
                      background: 'rgba(255,255,255,0.035)',
                      border: `1px solid ${emailError ? 'rgba(200,60,60,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 12, color: 'rgba(255,255,255,0.88)',
                      fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                      outline: 'none', backdropFilter: 'blur(12px)',
                      transition: 'border-color 0.5s ease',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 0.75, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        fontSize: '0.78rem', color: 'rgba(210,70,70,0.9)',
                        marginBottom: 14, position: 'relative', textAlign: 'left',
                      }}
                    >
                      {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Continue button */}
                <motion.button
                  type="submit"
                  disabled={captureSubmitting}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(200,50,80,0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%', padding: '13px 20px',
                    background: captureSubmitting ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 12,
                    color: captureSubmitting ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '3px',
                    cursor: captureSubmitting ? 'not-allowed' : 'pointer',
                    backdropFilter: 'blur(14px)',
                    marginBottom: 20,
                    transition: 'border-color 0.5s, color 0.3s',
                    position: 'relative',
                  }}
                >
                  {captureSubmitting ? '...' : '[ Continue ]'}
                </motion.button>
              </form>

              {/* Skip option */}
              <motion.button
                onClick={handleSkipCapture}
                whileHover={{ opacity: 0.6 }}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.2)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  letterSpacing: '1.5px', cursor: 'pointer',
                  position: 'relative',
                }}
              >
                enter without a name →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── About Overlay ── */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99997,
              background: 'rgba(2,0,2,0.92)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24, overflowY: 'auto',
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowAbout(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -18, filter: 'blur(12px)' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: 680, width: '100%',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 20, padding: '48px 40px',
                backdropFilter: 'blur(30px)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowAbout(false)}
                style={{
                  position: 'absolute', top: 24, right: 28,
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.28)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                  letterSpacing: '3px', cursor: 'pointer',
                }}
              >
                [ close ]
              </button>

              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
                letterSpacing: '5px', color: 'rgba(180,48,72,0.65)',
                textTransform: 'uppercase', marginBottom: 24,
              }}>
                About The Project
              </div>

              <h3 style={{
                fontSize: '1.75rem', fontWeight: 300, color: '#fff',
                marginBottom: 36, letterSpacing: '-0.5px', lineHeight: 1.3,
              }}>
                The Story Behind OneLastSmile
              </h3>

              {[
                {
                  label: '01 — The Idea',
                  body: `OneLastSmile didn't start as a portfolio project. It started as something personal — a way to process the kind of distance that doesn't announce itself loudly. You just notice it one day. The conversations get shorter. The replies take longer. And then one night, you're staring at a chat thread that used to feel like home and it just feels like a timestamp.\n\nI didn't want to write about that feeling. I wanted to build around it.`,
                },
                {
                  label: '02 — The Journey',
                  body: `I rebuilt the entire atmosphere at least four times. The first version was too loud — too much animation, too many things trying to say something at once. I scrapped it when I realized it was performing emotion instead of communicating it.\n\nThe hardest part wasn't the engineering. It was learning to trust restraint. Removing things was the actual work.`,
                },
                {
                  label: '03 — The Engineering',
                  body: `Every atmospheric effect runs purely through transforms and opacity — no layout recalculations, no paint thrashing. The cursor-reactive lighting uses spring physics to feel like light moving through fog, not a mouse spotlight.\n\nI learned more about cinematic UI systems building this than anything else I've worked on.`,
                },
                {
                  label: '04 — The Realization',
                  body: `Smoothness itself carries emotion. The way something moves communicates just as much as what it says. A transition that's too fast feels dismissive. One that's too slow feels melodramatic. The right speed feels like honesty.\n\nThis project isn't publicly open yet. Everything that matters already exists.`,
                },
              ].map((section, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 32 : 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
                    letterSpacing: '4px', color: 'rgba(170,48,68,0.55)',
                    textTransform: 'uppercase', marginBottom: 10,
                  }}>
                    {section.label}
                  </div>
                  {section.body.split('\n\n').map((para, j) => (
                    <p key={j} style={{
                      fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.9, fontWeight: 300,
                      marginBottom: j < section.body.split('\n\n').length - 1 ? 14 : 0,
                    }}>
                      {para}
                    </p>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── The Artifact Card ── */}
      <motion.div
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative', width: '100%', minHeight: 680,
          background: '#050505', borderRadius: 24, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.022), 0 30px 70px rgba(0,0,0,0.6)',
        }}
      >
        {/* Grain */}
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: GRAIN,
          opacity: 0.045, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 10,
        }} />

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(5,5,5,0.97) 100%)',
          pointerEvents: 'none', zIndex: 9,
        }} />

        {/* Breathing ambient glow */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.04, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 40%, rgba(170,28,62,0.07) 0%, transparent 65%)',
            filter: 'blur(50px)', pointerEvents: 'none', zIndex: 2,
          }}
        />

        {/* Cursor fog */}
        <motion.div
          style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(155,22,55,0.1) 0%, transparent 65%)',
            left: fogX, top: fogY, x: '-50%', y: '-50%',
            filter: 'blur(95px)', pointerEvents: 'none', zIndex: 3,
          }}
        />

        {/* Dust */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4, overflow: 'hidden' }}>
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -(25 + i % 16), 0],
                x: [0, (i % 2 === 0 ? 16 : -16), 0],
                opacity: [0.03, 0.14, 0.03],
              }}
              transition={{ duration: 12 + (i % 6), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              style={{
                position: 'absolute',
                width: i % 3 === 0 ? 2.5 : 1.5, height: i % 3 === 0 ? 2.5 : 1.5,
                background: '#fff', borderRadius: '50%',
                left: `${5 + i * 5.2}%`, top: `${8 + i * 4.8}%`,
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>

        {/* Memory fragments */}
        <AnimatePresence>
          {artifacts.map(a => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, filter: 'blur(18px)' }}
              animate={{ opacity: 0.08, filter: 'blur(5px)' }}
              exit={{ opacity: 0, filter: 'blur(18px)' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              style={{
                position: 'absolute', left: `${a.x}%`, top: `${a.y}%`,
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                color: '#fff', fontStyle: 'italic',
                pointerEvents: 'none', zIndex: 5, userSelect: 'none',
              }}
            >
              {a.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Main content */}
        <div style={{
          position: 'relative', zIndex: 20, textAlign: 'center',
          padding: 'clamp(32px, 5vw, 64px) clamp(24px, 4vw, 48px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 2 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.5rem, 1.5vw, 0.6rem)',
              letterSpacing: '8px', color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase', marginBottom: 32,
            }}
          >
            sealed until public opening
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.7, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              fontWeight: 200, fontFamily: 'var(--font-heading)',
              color: '#fff', letterSpacing: '-2px',
              marginBottom: 24, lineHeight: 1,
            }}
          >
            OneLastSmile
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 1.2, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              color: 'rgba(255,255,255,0.37)',
              maxWidth: 480, margin: '0 auto 50px',
              lineHeight: 1.85, fontWeight: 300,
            }}
          >
            A quiet interactive experience built from memory, atmosphere,
            unfinished conversations, and emotional UX.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 2 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <motion.button
              onClick={handleEnterStory}
              whileHover={{ scale: 1.02, borderColor: 'rgba(200,55,90,0.4)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 30,
                padding: 'clamp(12px, 2vw, 15px) clamp(24px, 3vw, 34px)',
                color: '#fff', fontSize: 'clamp(0.78rem, 2vw, 0.88rem)',
                fontFamily: 'var(--font-mono)', letterSpacing: '2px',
                cursor: 'pointer', backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.6s ease',
              }}
            >
              <motion.div
                animate={{ x: ['-120%', '220%'] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                style={{
                  position: 'absolute', top: 0, bottom: 0, width: '35%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)',
                  transform: 'skewX(-20deg)', pointerEvents: 'none',
                }}
              />
              [ Enter Story Mode ]
            </motion.button>

            <motion.button
              onClick={() => setShowAbout(true)}
              whileHover={{ scale: 1.02, color: 'rgba(255,255,255,0.85)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 30,
                padding: 'clamp(12px, 2vw, 15px) clamp(24px, 3vw, 34px)',
                color: 'rgba(255,255,255,0.38)',
                fontSize: 'clamp(0.78rem, 2vw, 0.88rem)',
                fontFamily: 'var(--font-mono)', letterSpacing: '2px',
                cursor: 'pointer', backdropFilter: 'blur(10px)',
                transition: 'color 0.5s ease, border-color 0.5s ease',
              }}
            >
              [ About The Project ]
            </motion.button>
          </motion.div>

          {/* Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 2 }}
            style={{
              marginTop: 48,
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.58rem, 1.5vw, 0.68rem)',
              color: 'rgba(255,255,255,0.12)', letterSpacing: '3px',
            }}
          >
            Public Opening — January 3, 2027
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
