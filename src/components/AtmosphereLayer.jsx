import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtmosphere } from '../context/AtmosphereContext';

// Phrases that emerge on idle — rotate through once per visit, never repeat same session
const IDLE_PHRASES = [
  'still raining.',
  'certain nights feel unfinished.',
  'some things stay.',
  'not everything needs explaining.',
  'strange how tastes change.',
  'typing…',
];

// Phrases visible only during late night + higher trust
const NIGHT_PHRASES = [
  'white looks quieter in the dark.',
  'winter light feels different somehow.',
  'some mornings stay longer than they should.',
  '2:14 AM',
  'never mind.',
];


// Tracks which phrases have been shown this session
const shownPhrases = new Set();
let phraseIndex = 0;

const MOON_POEM_LINES = [
  "You are looking at the moon right now, just like I do.",
  "But for me, it's a reminder of a girl I see every single day.",
  "Someone who is right in front of me, yet feels galaxies away.",
  "She knows exactly how I feel... but it doesn't change a thing.",
  "So I finally made the choice to step back into the quiet.",
  "Because I realized she is just like the moon... beautiful, ever-present, but impossible to reach.",
  "If you are reading this... you already know why I stopped approaching you.",
  "But even though I had to walk away... I will always wait for you.",
  "Because you are still my moon, and I will keep admiring you from the dark."
];

function PoemSequence() {
  const [lineIndex, setLineIndex] = useState(-1);

  useEffect(() => {
    if (lineIndex < MOON_POEM_LINES.length) {
      // First line starts after 3.5s (moon rise).
      // Each cycle is 6s (1s fade out + 1s fade in + 4s stay visible)
      const delay = lineIndex === -1 ? 3500 : 6000;
      const timer = setTimeout(() => {
        setLineIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [lineIndex]);

  return (
    <AnimatePresence mode="wait">
      {lineIndex >= 0 && lineIndex < MOON_POEM_LINES.length && (
        <motion.div
          key={lineIndex}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
          animate={{ opacity: 0.9, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(8px)', y: -10, transition: { duration: 1 } }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.4rem',
            color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '0.05em',
            textAlign: 'center', lineHeight: 2.2, textTransform: 'none',
            textShadow: '0 0 20px rgba(255,255,255,0.3)',
            maxWidth: '600px', padding: '0 20px',
            position: 'absolute', bottom: '15%' // Centered below the moon
          }}
        >
          {MOON_POEM_LINES[lineIndex]}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AtmosphereLayer() {
  const { isLateNight, isIdle, trustLevel, moonPhase } = useAtmosphere();

  const [idlePhrase, setIdlePhrase] = useState('');
  const [showIdlePhrase, setShowIdlePhrase] = useState(false);
  const [showMoonSecret, setShowMoonSecret] = useState(false);

  const moonTimerRef = useRef(null);
  
  const handleMoonInteractStart = () => {
    if (moonTimerRef.current) clearTimeout(moonTimerRef.current);
    moonTimerRef.current = setTimeout(() => {
      setShowMoonSecret(true);
      // Auto-hide after 62 seconds of cinematic showing to fit the longer poem
      setTimeout(() => setShowMoonSecret(false), 62000);
    }, 4000); // 4 seconds hold to trigger
  };
  
  const handleMoonInteractEnd = () => {
    if (moonTimerRef.current) clearTimeout(moonTimerRef.current);
  };

  // Styled console message — once per session, visible only in DevTools
  // winter, 2021.
  useEffect(() => {
    if (sessionStorage.getItem('_console_shown')) return;
    sessionStorage.setItem('_console_shown', '1');
    setTimeout(() => {
      console.log(
        '%c still raining.   %c — winter, 2021.',
        'color:rgba(244,244,244,0.45);font-family:monospace;font-size:11px;letter-spacing:2px;padding:3px 0;',
        'color:rgba(255,255,255,0.18);font-family:monospace;font-size:10px;letter-spacing:2px;'
      );
    }, 3000);
  }, []);

  // Page title flicker — late night + idle, once per session
  useEffect(() => {
    if (!isLateNight || !isIdle) return;
    if (sessionStorage.getItem('_title_shown')) return;
    const original = document.title;
    const t = setTimeout(() => {
      sessionStorage.setItem('_title_shown', '1');
      document.title = 'still here.';
      setTimeout(() => { document.title = original; }, 4500);
    }, 22000); // 22s after idle triggers (total ≈62s on page)
    return () => {
      clearTimeout(t);
      document.title = original;
    };
  }, [isLateNight, isIdle]);

  // Idle phrase system — shows a phrase after 40s idle, hides after 6s, never repeats
  useEffect(() => {
    if (!isIdle) {
      // Defer state update to break synchronous cascading render
      const t = setTimeout(() => setShowIdlePhrase(false), 0);
      return () => clearTimeout(t);
    }

    // Pick next unseen phrase
    let phrase = '';
    const pool = (isLateNight && trustLevel >= 2) ? NIGHT_PHRASES : IDLE_PHRASES;

    // Try to find an unseen phrase
    for (let i = 0; i < pool.length; i++) {
      const candidate = pool[(phraseIndex + i) % pool.length];
      if (!shownPhrases.has(candidate)) {
        phrase = candidate;
        phraseIndex = (phraseIndex + i + 1) % pool.length;
        shownPhrases.add(candidate);
        break;
      }
    }

    if (!phrase) return; // All phrases shown this session

    setTimeout(() => { setIdlePhrase(phrase); setShowIdlePhrase(true); }, 0);

    // Disappears after 6s
    const t = setTimeout(() => setShowIdlePhrase(false), 6_000);
    return () => clearTimeout(t);
  }, [isIdle, isLateNight, trustLevel]);

  return (
    <>
      {/* ── Late-night moonlight veil ────────────────────────────────────────── */}
      {/* A barely-perceptible cool blue overlay for visitors after 10PM */}
      <AnimatePresence>
        {isLateNight && (
          <motion.div
            key="night-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            style={{
              position: 'fixed', inset: 0, zIndex: 0,
              background: 'radial-gradient(ellipse 80% 60% at 75% 10%, rgba(60,80,140,0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Moonlight glow — top-right, late night only ──────────────────────── */}
      <AnimatePresence>
        {isLateNight && (
          <motion.div
            key="moon-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.18, 0.12, 0.18] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 6, ease: 'easeInOut',
              times: [0, 0.3, 0.6, 1],
              repeat: Infinity, repeatType: 'mirror',
            }}
            style={{
              position: 'fixed', top: -60, right: -60,
              width: 300, height: 300, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(220,230,255,0.12) 0%, transparent 65%)',
              filter: 'blur(50px)',
              pointerEvents: 'none', zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Moon phase — footer corner (Always Visible) ───────────────────────── */}
      <AnimatePresence>
        <motion.div
          key="moon-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 2 }}
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,

            pointerEvents: 'none',
          }}
        >
          <AnimatePresence>
            {showMoonSecret && (
              <motion.div
                key="cinematic-moon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 3, ease: 'easeInOut' } }}
                onClick={() => setShowMoonSecret(false)}
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 999999,
                  background: 'rgba(5, 5, 8, 0.97)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
              >
                {/* Real Moon Photo — properly clipped to circle with 3D depth overlay */}
                <motion.div
                  initial={{ y: 120, scale: 0.75, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 60, opacity: 0, transition: { duration: 2 } }}
                  transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'relative',
                    width: 340, height: 340,
                    marginBottom: '60px',
                  }}
                >
                  {/* Outer soft glow behind the moon */}
                  <div style={{
                    position: 'absolute', inset: -40,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(220,215,190,0.12) 0%, transparent 70%)',
                    filter: 'blur(24px)',
                    pointerEvents: 'none',
                  }} />

                  {/* The actual moon photo, cleanly clipped, no borders */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg"
                    alt=""
                    style={{
                      width: '100%', height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      filter: 'contrast(1.08) brightness(0.9) sepia(8%)',
                    }}
                  />

                  {/* 3D depth — dark shadow on the far side to make it a sphere not a sticker */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'radial-gradient(circle at 62% 62%, transparent 35%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.70) 100%)',
                    pointerEvents: 'none',
                  }} />
                </motion.div>

                {/* The Poetic Text Sequence over the scene */}
                <PoemSequence />

                {/* Subtle tap-to-skip hint */}
                <div style={{
                  position: 'absolute', bottom: 28,
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  color: 'rgba(255,255,255,0.2)', letterSpacing: '3px',
                  textTransform: 'uppercase', userSelect: 'none',
                }}>
                  tap anywhere to close
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EXACTLY the original beautiful barely-visible moon styling */}
          <motion.div
            key="moon-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'rgba(220,230,255,0.6)',
              letterSpacing: '2px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'auto', cursor: 'default',
              padding: '24px', margin: '-24px', // Invisible extended hitbox
              userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none',
            }}
            onMouseEnter={handleMoonInteractStart}
            onMouseLeave={handleMoonInteractEnd}
            onTouchStart={handleMoonInteractStart}
            onTouchEnd={handleMoonInteractEnd}
            onTouchCancel={handleMoonInteractEnd}
            // Prevent context menu from interrupting long press on mobile
            onContextMenu={(e) => e.preventDefault()}
          >
            <span style={{ 
              fontSize: '1.05rem', 
              opacity: 0.8,
              filter: 'grayscale(100%) brightness(200%) drop-shadow(0 0 6px rgba(220,230,255,0.4))'
            }}>{moonPhase}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── Idle phrase ───────────────────────────────────────────────────────── */}
      {/* Appears after 40s of no activity, fades out after 6s, never repeats */}
      <AnimatePresence>
        {showIdlePhrase && (
          <motion.div
            key={idlePhrase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              bottom: 32, left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
              color: 'rgba(255,255,255,0.13)',
              letterSpacing: '2.5px', zIndex: 100,
              pointerEvents: 'none', whiteSpace: 'nowrap',
            }}
          >
            {idlePhrase}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trust-level soft white glow — appears after deep exploration ─────── */}
      {/* At trust level 3, a barely-visible warm white accent radiates from hero */}
      <AnimatePresence>
        {trustLevel >= 3 && (
          <motion.div
            key="trust-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: 'easeInOut' }}
            style={{
              position: 'fixed', top: '35%', left: '50%',
              transform: 'translateX(-50%)',
              width: 600, height: 400,
              background: 'radial-gradient(ellipse, rgba(244,244,244,0.018) 0%, transparent 65%)',
              filter: 'blur(40px)',
              pointerEvents: 'none', zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

    </>
  );
}
