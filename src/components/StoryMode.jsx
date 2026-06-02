import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// ─── Lines ─────────────────────────────────────────────────────────────────────
const QUIET_LINES = [
  "It started in winter.",
  "Not the silence.",
  "The space left behind.",
  "Some conversations never really end.",
  "I still remember the timing of your replies.",
  "Even now, certain nights feel unfinished.",
  "They probably meant nothing to you.",
  "But somehow they stayed with me.",
];

const ALMOST_LINES = [
  "There was a moment.",
  "A fractured second where everything could have been different.",
  "I almost stayed.",
  "A name that still feels like home.",
  "And then the moment passed.",
  "Some moments don't break loudly.",
  "They simply fade.",
];

const FRAGMENTS = [
  { text: '2:14 AM',                    x: '10%', y: '20%', isKey: false },
  { text: 'typing...',                   x: '74%', y: '14%', isKey: true  },
  { text: 'never mind.',                 x: '52%', y: '33%', isKey: false },
  { text: 'you were online.',            x: '16%', y: '52%', isKey: false },
  { text: 'I almost sent it.',           x: '76%', y: '46%', isKey: false },
  { text: 'seen',                        x: '38%', y: '70%', isKey: true  },
  { text: 'maybe later.',                x: '62%', y: '63%', isKey: false },
  { text: "it didn't feel the same.",    x: '26%', y: '80%', isKey: false },
  { text: 'draft saved',                 x: '83%', y: '77%', isKey: false },
  { text: 'I still check sometimes.',    x: '6%',  y: '38%', isKey: true  },
  { text: 'aesthetic.',                  x: '44%', y: '87%', isKey: false },
  { text: 'childish.',                   x: '8%',  y: '64%', isKey: false },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function StoryMode({ onClose, userEmail }) {
  const [chapter, setChapter] = useState(1);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Discover puzzle_story clue when chapter 3 is reached
  useEffect(() => {
    if (chapter >= 3) {
      try {
        const stored = JSON.parse(localStorage.getItem('_p_clues') || '{}');
        if (!stored['puzzle_story']) {
          stored['puzzle_story'] = Date.now();
          localStorage.setItem('_p_clues', JSON.stringify(stored));
        }
      } catch (e) { console.warn("StoryMode audio error:", e); }
    }
  }, [chapter]);

  // Lock body scroll while StoryMode is open to prevent layout/viewport bugs
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Stable advance
  const advanceChapter = useCallback(() => {
    setChapter(c => Math.min(c + 1, 4));
  }, []);

  // Cursor tracking
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);
  const fogX = useSpring(mouseX, { stiffness: 28, damping: 20 });
  const fogY = useSpring(mouseY, { stiffness: 28, damping: 20 });

  // Throttled mouse tracking — no need to update faster than 60fps
  const lastMouse = useRef(0);
  const handleMouseMove = (e) => {
    const now = Date.now();
    if (now - lastMouse.current < 16) return;
    lastMouse.current = now;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Esc close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const bgColors = {
    1: 'rgba(255,255,255,0.025)',
    2: 'rgba(50,50,80,0.07)',
    3: 'rgba(160,30,60,0.1)',
    4: 'rgba(55,75,130,0.1)',
  };
  const particleCount = isMobile ? 10 : 18;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        minHeight: '100dvh',
        background: '#020002', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Film grain */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: GRAIN,
        opacity: 0.05, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 60,
        transform: 'translateZ(0)', willChange: 'transform',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.98) 100%)',
        pointerEvents: 'none', zIndex: 55, transform: 'translateZ(0)',
      }} />

      {/* Breathing ambient glow (changes per chapter) */}
      <motion.div
        key={chapter}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 42%, ${bgColors[chapter] || bgColors[1]} 0%, transparent 65%)`,
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 2,
        }}
      />

      {/* Cursor fog */}
      <motion.div
        style={{
          position: 'absolute',
          width: 700, height: 700, borderRadius: '50%',
          background: chapter === 3
            ? 'radial-gradient(circle, rgba(200,30,60,0.09) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)',
          left: fogX, top: fogY,
          x: '-50%', y: '-50%',
          filter: 'blur(90px)', pointerEvents: 'none', zIndex: 3,
        }}
      />

      {/* Dust particles — reduced on mobile */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4, overflow: 'hidden' }}>
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -(25 + i % 18), 0],
              x: [0, (i % 2 === 0 ? 14 : -14), 0],
              opacity: [0.03, 0.15, 0.03],
            }}
            transition={{ duration: 10 + (i % 7), repeat: Infinity, ease: 'easeInOut', delay: i * 0.38 }}
            style={{
              position: 'absolute',
              width: i % 4 === 0 ? 2.5 : 1.5,
              height: i % 4 === 0 ? 2.5 : 1.5,
              background: chapter === 4 ? 'rgba(140,160,220,0.9)' : '#fff',
              borderRadius: '50%',
              left: `${4 + i * 5}%`,
              top: `${7 + i * 4.8}%`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Chapters — AnimatePresence mode="wait" only handles chapter-level transitions */}
      <AnimatePresence mode="wait">
        {chapter === 1 && <Chapter01 key="ch1" onDone={advanceChapter} />}
        {chapter === 2 && <Chapter02 key="ch2" onDone={advanceChapter} />}
        {chapter === 3 && <Chapter03 key="ch3" onDone={advanceChapter} />}
        {chapter === 4 && <Chapter04 key="ch4" userEmail={userEmail} onClose={onClose} />}
      </AnimatePresence>

      {/* ── LEFT: Exit Story Mode ── */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.85, y: 0 }}
        whileHover={{
          opacity: 1, y: -4,
          boxShadow: '0 0 25px rgba(180,28,62,0.3)',
          borderColor: 'rgba(180,28,62,0.6)',
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
        transition={{ 
          default: { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 1.5 },
          y: { type: 'spring', stiffness: 250, damping: 20 },
        }}
        onClick={onClose}
        style={{
          position: 'fixed', 
          top: 'max(28px, env(safe-area-inset-top))', 
          left: 'max(28px, env(safe-area-inset-left))',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 30, padding: '10px 20px',
          color: '#fff', fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem', letterSpacing: '2px',
          cursor: 'pointer', zIndex: 999999,
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease',
        }}
      >
        ← Return to Home
      </motion.button>

      {/* ── RIGHT: Skip Story ── */}
      <AnimatePresence>
        {chapter < 4 && (
          <motion.button
            key="skip"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.35, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            whileHover={{ opacity: 0.85, textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 1.8 }}
            onClick={() => setChapter(4)}
            style={{
              position: 'fixed', 
              top: 'max(34px, env(safe-area-inset-top))', 
              right: 'max(32px, env(safe-area-inset-right))',
              background: 'transparent', border: 'none',
              color: '#fff', fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem', letterSpacing: '2px',
              cursor: 'pointer', zIndex: 999999,
              transition: 'text-shadow 0.4s ease',
            }}
          >
            Skip Story →
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chapter progress dots */}
      <div style={{
        position: 'fixed',
        bottom: 'max(28px, env(safe-area-inset-bottom))',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 999999,
        pointerEvents: 'none',
      }}>
        {[1,2,3,4].map(n => (
          <div key={n} style={{
            width: n === chapter ? 20 : 5,
            height: 3, borderRadius: 2,
            background: n === chapter
              ? 'rgba(255,255,255,0.4)'
              : n < chapter
                ? 'rgba(255,255,255,0.14)'
                : 'rgba(255,255,255,0.05)',
            transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1), background 0.7s ease',
          }} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Chapter 01: The Quiet ─────────────────────────────────────────────────────
// Engine: setInterval every LINE_MS. doneRef captures onDone stably so the
// effect has an EMPTY dependency array — zero re-runs, zero timer cancellations.
const LINE_MS = 4200; // Slightly slower — more breathing room, less mechanical

function Chapter01({ onDone }) {
  const [idx, setIdx] = useState(0);
  const doneRef = useRef(onDone);
  // Keep ref current without re-running the effect
  useEffect(() => { doneRef.current = onDone; });

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < QUIET_LINES.length) {
        setIdx(current);
      } else {
        clearInterval(interval);
        // Let last line breathe then advance
        setTimeout(() => doneRef.current(), 2200);
      }
    }, LINE_MS);
    return () => clearInterval(interval);
  }, []); // ← empty — deliberately stable. doneRef handles currency.

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(22px)' }}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
      style={{
        position: 'relative', zIndex: 20,
        textAlign: 'center',
        padding: '0 clamp(20px, 6vw, 40px)',
        maxWidth: 620, width: '100%',
      }}
    >
      {/* Chapter label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.4, duration: 2.5 }}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          letterSpacing: '6px', color: '#fff',
          textTransform: 'uppercase', marginBottom: 60,
        }}
      >
        01 — The Quiet
      </motion.div>

      {/* Cycling lines — crossfade, position:absolute so enter+exit overlap cleanly */}
      <div style={{
        position: 'relative', height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%',
      }}>
        <AnimatePresence>
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 24, filter: 'blur(16px)' }}
            animate={{ opacity: 0.88, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(16px)' }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', left: 0, right: 0,
              margin: 0, padding: '0 8px',
              fontSize: idx === 0 || idx === 7 ? '1.35rem' : '1.05rem',
              fontWeight: 300,
              color: '#fff',
              letterSpacing: '0.4px',
              lineHeight: 1.65,
              textAlign: 'center',
            }}
          >
            {QUIET_LINES[idx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Ambient audio visualizer */}
      <div style={{
        position: 'absolute', bottom: -110, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 5, alignItems: 'flex-end', opacity: 0.1,
      }}>
        {[...Array(13)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [3, 6 + (i % 4) * 4, 3] }}
            transition={{ duration: 2.1 + i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1.5, background: '#fff', borderRadius: 2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Chapter 02: Unread Things ─────────────────────────────────────────────────
function Chapter02({ onDone }) {
  const [showCenter, setShowCenter] = useState(false);
  const [warm, setWarm] = useState(false);
  const [hovering, setHovering] = useState(false);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; });

  useEffect(() => {
    const t1 = setTimeout(() => setShowCenter(true), 10000);
    const t2 = setTimeout(() => doneRef.current(), 24000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // ← empty — stable

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(22px)' }}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, zIndex: 20, overflow: 'hidden', touchAction: 'none' }}
    >
      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        opacity: 0.7,
      }} />

      {/* Warm tint on key hover */}
      <motion.div
        animate={{ opacity: warm ? 0.12 : 0 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(200,80,40,0.4) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Chapter label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.3, duration: 2.5 }}
        style={{
          position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          letterSpacing: '6px', color: '#fff', textTransform: 'uppercase', zIndex: 30,
          whiteSpace: 'nowrap',
        }}
      >
        02 — Unread Things
      </motion.div>

      {/* Floating fragments */}
      {FRAGMENTS.map((f, i) => (
        <motion.div
          key={f.text}
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 0.2, filter: 'blur(3px)', y: [0, -8, 0] }}
          transition={{
            opacity: { delay: i * 0.35 + 0.8, duration: 2.5 },
            filter: { delay: i * 0.35 + 0.8, duration: 2.5 },
            y: { duration: 9 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 },
          }}
          onMouseEnter={() => { if (f.isKey) { setWarm(true); setHovering(true); } }}
          onMouseLeave={() => setHovering(false)}
          whileHover={{ opacity: 0.85, filter: 'blur(0px)' }}
          style={{
            position: 'absolute', left: f.x, top: f.y,
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
            color: f.isKey ? 'rgba(220,140,110,0.9)' : 'rgba(255,255,255,0.75)',
            fontStyle: 'italic', cursor: 'default',
            userSelect: 'none', zIndex: 25,
          }}
        >
          {f.text}
        </motion.div>
      ))}

      {/* Hidden message on key hover */}
      <AnimatePresence>
        {hovering && (
          <motion.p
            key="hope"
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 0.4, filter: 'blur(4px)' }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 2 }}
            style={{
              position: 'absolute', bottom: 120, left: '50%',
              transform: 'translateX(-50%)',
              margin: 0,
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              color: 'rgba(220,150,110,0.9)', fontStyle: 'italic',
              letterSpacing: '2px', zIndex: 35, pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            I hope you're okay.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Central message */}
      <AnimatePresence>
        {showCenter && (
          <motion.div
            key="center"
            initial={{ opacity: 0, filter: 'blur(22px)', y: 18 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(22px)' }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', inset: 0, zIndex: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <p style={{
              fontSize: '1.1rem', color: '#fff', fontWeight: 300,
              maxWidth: 440, textAlign: 'center', lineHeight: 1.9,
              textShadow: '0 0 40px rgba(255,255,255,0.06)',
            }}>
              We leave too many things unsaid,<br />hoping silence will say them for us.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Chapter 03: Almost Stayed ─────────────────────────────────────────────────
function Chapter03({ onDone }) {
  const [idx, setIdx] = useState(0);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; });

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < ALMOST_LINES.length) {
        setIdx(current);
      } else {
        clearInterval(interval);
        setTimeout(() => doneRef.current(), 2200);
      }
    }, LINE_MS);
    return () => clearInterval(interval);
  }, []); // ← empty

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(25px)' }}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
      style={{
        position: 'relative', zIndex: 20,
        textAlign: 'center',
        maxWidth: 580,
        padding: '0 clamp(20px, 6vw, 40px)',
        width: '100%',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.3, duration: 2 }}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          letterSpacing: '6px', color: '#fff',
          textTransform: 'uppercase', marginBottom: 60,
        }}
      >
        03 — Almost Stayed
      </motion.div>

      {/* Cycling lines — same pattern as ch01 */}
      <div style={{
        position: 'relative', height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%',
      }}>
        <AnimatePresence>
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 24, filter: 'blur(16px)' }}
            animate={{ opacity: idx === 2 ? 0.95 : 0.78, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(16px)' }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', left: 0, right: 0,
              margin: 0, padding: '0 8px',
              fontSize: idx === 2 ? '1.45rem' : '1.05rem',
              fontWeight: idx === 2 ? 400 : 300,
              color: idx === 5 ? 'rgba(200,70,90,0.85)' : '#fff',
              letterSpacing: idx === 2 ? '1px' : '0.4px',
              lineHeight: 1.65,
              textAlign: 'center',
            }}
          >
            {ALMOST_LINES[idx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Crimson fog bloom */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.05, 0.18, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: '-120px',
          background: 'radial-gradient(circle at 50% 55%, rgba(190,30,55,0.2) 0%, transparent 60%)',
          filter: 'blur(70px)', pointerEvents: 'none', zIndex: -1,
        }}
      />
    </motion.div>
  );
}

// ─── Chapter 04: One Last Smile ────────────────────────────────────────────────
const SUCCESS_LINES = [
  'Your thought is safe here.',
  'Some things deserve to stay.',
  'Stored quietly.',
  'Certain words remain.',
  'Some people stay as rain.',
];

function Chapter04({ onClose, userEmail }) {
  const [thought, setThought] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);
  // Pick once on mount — useState initializer runs only once
  const [successLine] = useState(() => SUCCESS_LINES[Math.floor(Math.random() * SUCCESS_LINES.length)]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thought.trim() || submitting) return;
    setSubmitting(true);
    try {
      const key = import.meta.env.VITE_WEB3FORMS_KEY;
      if (key) {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: key,
            subject: 'A quiet thought from OneLastSmile',
            from_name: userEmail || 'Anonymous',
            email: userEmail || 'anonymous@onelastsmile.com',
            message: thought,
            timestamp: new Date().toISOString(),
          }),
        });
      }
    } catch (err) { void err; }
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => onClose(), 6500);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 3, ease: 'easeInOut' }}
      style={{
        position: 'relative', zIndex: 20,
        textAlign: 'center', width: '100%', maxWidth: 480,
        padding: '0 28px',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 2 }}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          letterSpacing: '6px', color: '#fff',
          textTransform: 'uppercase', marginBottom: 44,
        }}
      >
        04 — One Last Smile
      </motion.div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0, filter: 'blur(20px)', y: -16 }}
            transition={{ duration: 2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
              animate={{ opacity: 0.82, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 3, delay: 0.7 }}
              style={{
                fontSize: '1.15rem', color: '#fff', fontWeight: 300,
                marginBottom: 40, lineHeight: 1.85,
              }}
            >
              Even when people leave,<br />sometimes one last smile still remains.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.5, delay: 2 }}
              style={{ width: '100%', position: 'relative' }}
            >
              <textarea
                value={thought}
                onChange={e => setThought(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Leave a thought..."
                disabled={submitting}
                style={{
                  width: '100%', height: 110,
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${focused ? 'rgba(200,70,100,0.38)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14, padding: '18px 20px',
                  color: 'rgba(255,255,255,0.88)',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  resize: 'none', outline: 'none', backdropFilter: 'blur(20px)',
                  transition: 'border 0.7s ease, box-shadow 0.7s ease',
                  boxShadow: focused ? '0 0 35px rgba(200,55,90,0.07)' : 'none',
                  lineHeight: 1.7,
                }}
              />
              {/* Focused glow ring */}
              <motion.div
                animate={{ opacity: focused ? 0.5 : 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute', inset: -1,
                  borderRadius: 15, pointerEvents: 'none',
                  boxShadow: '0 0 45px rgba(200,55,90,0.1)',
                }}
              />

              <AnimatePresence>
                {thought.length > 0 && !submitting && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    whileHover={{ opacity: 1, letterSpacing: '3px' }}
                    exit={{ opacity: 0 }}
                    type="submit"
                    style={{
                      display: 'block', margin: '22px auto 0',
                      background: 'none', border: 'none',
                      color: '#fff', fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem', letterSpacing: '2px',
                      cursor: 'pointer',
                      transition: 'letter-spacing 0.5s ease',
                    }}
                  >
                    Leave it here
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Identity line */}
            <AnimatePresence>
              {userEmail && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ delay: 3, duration: 2 }}
                  style={{
                    marginTop: 28,
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: '#fff', letterSpacing: '1px',
                  }}
                >
                  Signed in as {userEmail}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 0.75, filter: 'blur(0px)' }}
            transition={{ duration: 3 }}
          >
            <p style={{
              fontSize: '1.2rem', color: '#fff', fontWeight: 300,
              fontStyle: 'italic', letterSpacing: '0.5px', lineHeight: 1.8,
            }}>
              {successLine}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Twilight bloom */}
      <motion.div
        animate={{ opacity: [0.05, 0.14, 0.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: '-120px',
          background: 'radial-gradient(circle at 50% 55%, rgba(55,75,160,0.2) 0%, transparent 60%)',
          filter: 'blur(70px)', pointerEvents: 'none', zIndex: -1,
        }}
      />
    </motion.div>
  );
}

