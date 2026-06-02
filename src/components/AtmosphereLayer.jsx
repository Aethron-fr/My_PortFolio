import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtmosphere } from '../context/AtmosphereContext';
import { usePuzzle } from '../context/PuzzleContext';

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

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// Tracks which phrases have been shown this session
const shownPhrases = new Set();
let phraseIndex = 0;
let nightPhraseIndex = 0;

export default function AtmosphereLayer() {
  const { isLateNight, isIdle, trustLevel, moonPhase } = useAtmosphere();
  const { triggerReveal } = usePuzzle();
  const [idlePhrase, setIdlePhrase] = useState('');
  const [showIdlePhrase, setShowIdlePhrase] = useState(false);
  const [showMoonSecret, setShowMoonSecret] = useState(false);
  const [moonHovered, setMoonHovered] = useState(false);
  const moonTimerRef = useRef(null);
  
  const handleMoonInteractStart = () => {
    setMoonHovered(true);
    if (moonTimerRef.current) clearTimeout(moonTimerRef.current);
    moonTimerRef.current = setTimeout(() => {
      setShowMoonSecret(true);
      // Auto-hide after 6 seconds of showing
      setTimeout(() => setShowMoonSecret(false), 6000);
    }, 8000); // 8 seconds hold
  };
  
  const handleMoonInteractEnd = () => {
    setMoonHovered(false);
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
      setShowIdlePhrase(false);
      return;
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
            position: 'fixed', bottom: 20, right: 24,
            zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12,
            pointerEvents: 'none',
          }}
        >
          <AnimatePresence>
            {showMoonSecret && (
              <motion.div
                key="moon-secret"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: -5, transition: { duration: 4 } }}
                transition={{ duration: 3, ease: 'easeOut' }}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  color: 'rgba(255,255,255,0.7)', letterSpacing: '1px',
                  textAlign: 'right', whiteSpace: 'pre-line', lineHeight: 1.6,
                  textTransform: 'none', // Sentence case per request
                }}
              >
                {"Some people become like the moon.\nBeautiful, constant, and always a little out of reach."}
              </motion.div>
            )}
          </AnimatePresence>

          {/* EXACTLY the original beautiful barely-visible moon styling */}
          <motion.div
            key="moon-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'rgba(220,230,255,0.5)',
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
            <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{moonPhase}</span>
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
