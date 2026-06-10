import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtmosphere } from '../context/AtmosphereContext';
import { audioController } from '../audio';

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

const MOON_SECRETS = [
  "Some people become like the moon.\nBeautiful, constant, and always a little out of reach.",
  "A symbol of my love, mesmerizing and far.\nI fall for it every time, knowing I can never hold it.",
  "So intensely beautiful, so impossible to touch.\nI love it so much, yet it remains forever out of reach.",
  "I fell in love with the moon for my love.\nEvery time I look up, I just fall into it."
];

export default function AtmosphereLayer() {
  const { isLateNight, isIdle, trustLevel, moonPhase } = useAtmosphere();

  const [idlePhrase, setIdlePhrase] = useState('');
  const [showIdlePhrase, setShowIdlePhrase] = useState(false);
  const [showMoonSecret, setShowMoonSecret] = useState(false);
  const [moonSecretText, setMoonSecretText] = useState(MOON_SECRETS[0]);

  const moonTimerRef = useRef(null);
  
  const handleMoonInteractStart = () => {
    if (moonTimerRef.current) clearTimeout(moonTimerRef.current);
    moonTimerRef.current = setTimeout(() => {
      setMoonSecretText(MOON_SECRETS[Math.floor(Math.random() * MOON_SECRETS.length)]);
      setShowMoonSecret(true);
      audioController.playMoonSecret();
      // Auto-hide after 12 seconds of cinematic showing
      setTimeout(() => setShowMoonSecret(false), 12000);
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
            position: 'fixed', bottom: 20, left: 24, // MOVED TO LEFT CORNER
            zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, // ALIGN START
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
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 999999,
                  background: 'rgba(5, 5, 8, 0.95)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                {/* The Massive Cinematic Moon */}
                <motion.div
                  initial={{ y: 200, scale: 0.8, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 50, opacity: 0, transition: { duration: 2 } }}
                  transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }} // Super smooth cinematic rise
                  style={{
                    width: 280, height: 280, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e2e8f0 20%, #94a3b8 60%, #334155 100%)',
                    boxShadow: '0 0 100px rgba(191,219,254,0.3), inset -10px -10px 30px rgba(0,0,0,0.6)',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '40px'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at 70% 70%, rgba(0,0,0,0.4) 0%, transparent 60%)',
                    borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute', top: '10%', left: '20%', width: '30%', height: '30%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(8px)'
                  }} />
                </motion.div>

                {/* The Poetic Text over the scene */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 1.5 } }}
                  transition={{ duration: 4, delay: 2.5, ease: 'easeOut' }} // Fades in slowly after moon rises
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                    color: '#ffffff', letterSpacing: '2px',
                    textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 2.2,
                    textTransform: 'uppercase',
                    textShadow: '0 0 20px rgba(255,255,255,0.4)',
                    maxWidth: '600px', padding: '0 20px'
                  }}
                >
                  {moonSecretText}
                </motion.div>
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
