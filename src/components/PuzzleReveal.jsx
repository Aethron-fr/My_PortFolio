import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePuzzle } from '../context/PuzzleContext';

// ─── Ambient rain audio (Web Audio API — no external files) ───────────────────
function createRainAudio() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 4096;

    // Brown noise generator — foundation of rain sound
    const brownNoise = ctx.createScriptProcessor(bufferSize, 1, 1);
    let lastOut = 0.0;
    brownNoise.onaudioprocess = (e) => {
      const out = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        out[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = out[i];
        out[i] *= 3.5;
      }
    };

    // Shape it to sound like distant rain
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1400;
    bandpass.Q.value = 0.25;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 600;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 5); // fade in slowly

    brownNoise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);

    return {
      stop() {
        try {
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
          setTimeout(() => ctx.close().catch(() => {}), 3000);
        } catch {}
      },
    };
  } catch {
    return { stop() {} };
  }
}

// ─── Rain canvas inside the reveal ───────────────────────────────────────────
function RevealRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drops = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 0.8,
      length: 10 + Math.random() * 16,
      opacity: 0.025 + Math.random() * 0.045,
    }));

    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.length * 0.14, d.y + d.length);
        ctx.strokeStyle = `rgba(180,210,255,${d.opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height + 20) { d.y = -20; d.x = Math.random() * canvas.width; }
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

// ─── The sequence — his actual story ─────────────────────────────────────────
// Delay and hold are in milliseconds.
// type: 'before' | 'word' | 'fragment' | 'name'
const SEQUENCE = [
  // How it started — contrast (what he was before)
  { text: 'I never liked rain.',                          delay: 1000,  hold: 3200, type: 'fragment' },

  // The arrival
  { text: 'winter, 2021.',                                delay: 5800,  hold: 3200, type: 'word'     },
  { text: 'a normal morning that didn\'t feel important.', delay: 10400, hold: 3800, type: 'fragment' },

  // Who she was
  { text: 'childish in a way that felt real.',            delay: 16000, hold: 3800, type: 'fragment' },
  { text: 'an overthinker.',                              delay: 21200, hold: 3000, type: 'word'     },
  { text: 'she had pain she never truly showed.',         delay: 26000, hold: 3800, type: 'fragment' },

  // What changed
  { text: 'calls became longer.',                         delay: 31600, hold: 3000, type: 'fragment' },
  { text: 'nights became shorter.',                       delay: 36200, hold: 3000, type: 'fragment' },

  // The transformation
  { text: 'rain started feeling beautiful.',              delay: 41200, hold: 3800, type: 'fragment' },
  { text: 'white.',                                       delay: 46800, hold: 3000, type: 'word'     },
  { text: 'moonlight.',                                   delay: 51400, hold: 3000, type: 'word'     },
  { text: 'she changed what I find beautiful.',           delay: 56200, hold: 3800, type: 'fragment' },

  // Still here
  { text: 'she became part of everything.',               delay: 61800, hold: 3800, type: 'fragment' },
  { text: 'she never truly left.',                        delay: 67200, hold: 4200, type: 'fragment' },

  // The name — after the longest pause
  { text: 'Anushka.',                                     delay: 74400, hold: 10000, type: 'name'   },
];

const TOTAL_MS = 74400 + 10000 + 3500;

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// Per-type visual style
function getStyle(type) {
  switch (type) {
    case 'word':     return { fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',   opacity: 0.85, color: 'rgba(255,255,255,0.85)', letterSpacing: '8px',  fontWeight: 300 };
    case 'fragment': return { fontSize: 'clamp(0.9rem, 2.2vw, 1.15rem)', opacity: 0.65, color: 'rgba(255,255,255,0.65)', letterSpacing: '1px',  fontWeight: 300 };
    case 'name':     return { fontSize: 'clamp(2.6rem, 8vw, 5rem)',      opacity: 1.0,  color: '#f4f4f4',                letterSpacing: '18px', fontWeight: 300 };
    default:         return { fontSize: '1rem', opacity: 0.6, color: '#fff', letterSpacing: '2px', fontWeight: 300 };
  }
}

export default function PuzzleReveal() {
  const { showReveal, dismissReveal } = usePuzzle();
  const [active, setActive] = useState(null); // { text, type }
  const [phase, setPhase] = useState('idle');
  const [showHeart, setShowHeart] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!showReveal) {
      setActive(null);
      setPhase('idle');
      setShowHeart(false);
      return;
    }

    setPhase('running');
    setShowHeart(false);

    // Start ambient rain audio
    audioRef.current = createRainAudio();

    const timers = [];

    SEQUENCE.forEach(({ text, delay, hold, type }) => {
      timers.push(setTimeout(() => {
        setActive({ text, type });
        if (type === 'name') {
          // Show the white heart 1.5s after Anushka arrives
          timers.push(setTimeout(() => setShowHeart(true), 1500));
        }
      }, delay));

      timers.push(setTimeout(() => {
        setActive(prev => prev?.text === text ? null : prev);
        if (type === 'name') setShowHeart(false);
      }, delay + hold));
    });

    // Begin exit
    timers.push(setTimeout(() => {
      setPhase('ending');
      audioRef.current?.stop();
      setTimeout(dismissReveal, 3500);
    }, TOTAL_MS));

    return () => {
      timers.forEach(clearTimeout);
      audioRef.current?.stop();
    };
  }, [showReveal, dismissReveal]);

  const handleDismiss = () => {
    audioRef.current?.stop();
    setPhase('ending');
    setTimeout(dismissReveal, 1500);
  };

  const style = active ? getStyle(active.type) : null;

  return (
    <AnimatePresence>
      {showReveal && (
        <motion.div
          key="puzzle-reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'ending' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          onClick={handleDismiss}
          style={{
            position: 'fixed', inset: 0, zIndex: 999999,
            background: '#010001',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'default',
          }}
        >
          {/* Ambient rain in background */}
          <RevealRain />

          {/* Film grain */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: GRAIN, opacity: 0.04,
            mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 1,
          }} />

          {/* Moonlight — top-right, always there */}
          <motion.div
            animate={{ opacity: [0.12, 0.26, 0.12] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: -80, right: -80,
              width: 560, height: 560, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,220,255,0.16) 0%, transparent 65%)',
              filter: 'blur(90px)', pointerEvents: 'none', zIndex: 1,
            }}
          />

          {/* Warm glow — appears only when Anushka arrives */}
          <AnimatePresence>
            {active?.type === 'name' && (
              <motion.div
                key="name-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,248,245,0.06) 0%, rgba(200,190,255,0.03) 50%, transparent 75%)',
                  pointerEvents: 'none', zIndex: 1,
                }}
              />
            )}
          </AnimatePresence>

          {/* Main text area */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.text}
                  initial={{ opacity: 0, filter: 'blur(18px)', y: active.type === 'name' ? 8 : 0 }}
                  animate={{ opacity: style.opacity, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(18px)' }}
                  transition={{ duration: 2.4, ease: 'easeInOut' }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
                >
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: style.fontSize,
                    fontWeight: style.fontWeight,
                    color: style.color,
                    letterSpacing: style.letterSpacing,
                    margin: 0,
                    textAlign: 'center',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    maxWidth: '78vw',
                    lineHeight: 1.45,
                    textShadow: active.type === 'name'
                      ? '0 0 80px rgba(244,244,244,0.22), 0 0 140px rgba(220,215,255,0.1)'
                      : 'none',
                  }}>
                    {active.text}
                  </p>

                  {/* White heart — appears 1.5s after Anushka */}
                  <AnimatePresence>
                    {showHeart && (
                      <motion.span
                        key="heart"
                        initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)' }}
                        animate={{ opacity: 0.85, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        style={{ fontSize: '1.4rem', userSelect: 'none', pointerEvents: 'none' }}
                      >
                        🤍
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress dots — top center */}
          <div style={{
            position: 'absolute', top: 28, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 5, zIndex: 3, pointerEvents: 'none',
            alignItems: 'center',
          }}>
            {SEQUENCE.map((s, i) => {
              const activeIdx = active ? SEQUENCE.findIndex(x => x.text === active.text) : -1;
              const isCurrent = i === activeIdx;
              const isPast = activeIdx > i;
              return (
                <div key={i} style={{
                  width: s.type === 'name' ? 16 : isCurrent ? 8 : 4,
                  height: 2.5, borderRadius: 2,
                  background: isCurrent
                    ? s.type === 'name' ? 'rgba(244,244,244,0.75)' : 'rgba(255,255,255,0.5)'
                    : isPast ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)',
                  transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                }} />
              );
            })}
          </div>

          {/* Rain audio indicator — tiny, barely visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            transition={{ delay: 5, duration: 3 }}
            style={{
              position: 'absolute', top: 28, right: 28,
              fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
              color: 'rgba(255,255,255,0.35)', letterSpacing: '2px',
              zIndex: 3, pointerEvents: 'none',
            }}
          >
            ♪ rain
          </motion.div>

          {/* Skip — barely there, after 15s */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 15, duration: 3 }}
            style={{
              position: 'absolute', bottom: 28, left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
              color: 'rgba(255,255,255,0.4)', letterSpacing: '3px',
              pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 3,
            }}
          >
            click anywhere to leave
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
