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
        } catch (e) { console.warn("Audio stop error:", e); }
      },
    };
  } catch (e) {
    console.warn("Brown noise generation error:", e);
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

// ─── The story ───────────────────────────────────────────────────────────────
//
// Five acts. One memory.
// His journey — not her description.
//
// type:
//   'word'     — single atmospheric words. large. spaced. breathe.
//   'echo'     — tiny reflective lines. quiet. almost a whisper.
//   'fragment' — full sentences. the story itself.
//   'name'     — the final word. the whole point.
//
const SEQUENCE = [

  // ── Act I: Before ────────────────────────────────────────────────────────────
  // Who he was. The contrast that makes everything else matter.
  { text: 'I used to hate the rain.',                            delay: 800,   hold: 3600, type: 'fragment' },
  { text: 'genuinely.',                                          delay: 6200,  hold: 2600, type: 'echo'     },

  // ── Act II: It began ─────────────────────────────────────────────────────────
  // A morning that didn't announce itself.
  { text: 'winter, 2021.',                                       delay: 11000, hold: 3800, type: 'word'     },
  { text: 'a completely ordinary morning.',                      delay: 16600, hold: 3400, type: 'fragment' },
  { text: 'nothing about it felt important at the time.',        delay: 21800, hold: 3800, type: 'fragment' },
  { text: 'but after my results — we started talking more.',     delay: 27400, hold: 4000, type: 'fragment' },
  { text: 'the calls started going longer.',                     delay: 33200, hold: 3400, type: 'fragment' },
  { text: 'the nights got shorter.',                             delay: 38400, hold: 3200, type: 'fragment' },
  { text: 'random conversations became part of my routine.',     delay: 43400, hold: 4000, type: 'fragment' },
  { text: 'without me even realizing it.',                       delay: 49200, hold: 3000, type: 'echo'     },

  // ── Act III: What she changed ────────────────────────────────────────────────
  // He didn't notice until it was already done.
  { text: 'and somewhere in between — I changed.',               delay: 54400, hold: 3800, type: 'fragment' },
  { text: 'things I never cared about started mattering.',       delay: 60000, hold: 3800, type: 'fragment' },
  { text: 'rain started feeling different.',                     delay: 65600, hold: 3400, type: 'fragment' },
  { text: 'not like something to avoid.',                        delay: 70800, hold: 3000, type: 'echo'     },
  { text: 'like something that meant something.',                delay: 75600, hold: 3800, type: 'fragment' },
  { text: 'white.',                                              delay: 81400, hold: 3200, type: 'word'     },
  { text: 'moonlight.',                                          delay: 86400, hold: 3200, type: 'word'     },
  { text: 'she changed what I notice.',                          delay: 91400, hold: 3600, type: 'fragment' },
  { text: 'what I feel.',                                        delay: 96800, hold: 2800, type: 'echo'     },
  { text: 'what I find beautiful.',                              delay: 101400, hold: 3000, type: 'echo'    },

  // ── Act IV: The misunderstanding ─────────────────────────────────────────────
  // Not a fight. Not dramatic. Just — something shifted.
  { text: 'and then — something shifted.',                       delay: 106800, hold: 3800, type: 'fragment' },
  { text: 'conversations grew quieter.',                         delay: 112400, hold: 3400, type: 'fragment' },
  { text: 'not suddenly.',                                       delay: 117600, hold: 2600, type: 'echo'     },
  { text: 'slowly.',                                             delay: 122000, hold: 2800, type: 'echo'     },
  { text: 'the kind of slow you only notice later.',             delay: 126600, hold: 3800, type: 'fragment' },
  { text: 'some things just — stop.',                            delay: 132200, hold: 3800, type: 'fragment' },
  { text: 'and you never fully understand why.',                 delay: 137800, hold: 3400, type: 'echo'     },

  // ── Act V: What remains ──────────────────────────────────────────────────────
  // She left. But she's still everywhere.
  { text: 'but the rain was already hers.',                      delay: 143600, hold: 3800, type: 'fragment' },
  { text: 'and so was everything else.',                         delay: 149200, hold: 3400, type: 'echo'     },
  { text: 'every time it rains — I remember.',                   delay: 154600, hold: 3800, type: 'fragment' },
  { text: 'automatically.',                                      delay: 160200, hold: 3000, type: 'echo'     },
  { text: 'she never truly left.',                               delay: 165400, hold: 4500, type: 'fragment' },
  { text: 'she\'s in every detail.',                             delay: 171800, hold: 3600, type: 'echo'     },

  // ── Act VI: Forever ──────────────────────────────────────────────────────────
  // The absolute truth.
  { text: 'I loved her then.',                                   delay: 178400, hold: 3800, type: 'fragment' },
  { text: 'I love her now.',                                     delay: 184000, hold: 3800, type: 'fragment' },
  { text: 'and I will love her until the very end.',             delay: 189600, hold: 4600, type: 'fragment' },
  { text: 'that will never change.',                             delay: 196000, hold: 3000, type: 'echo'     },

  // ── The final memory ─────────────────────────────────────────────────────────
  // A quiet realization. Not a dramatic reveal.
  { text: 'some people stay as rain.',                           delay: 202400, hold: 22000, type: 'final'  },
];

const TOTAL_MS = 202400 + 22000 + 6000;

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// Per-type visual style
function getStyle(type) {
  switch (type) {
    case 'word':     return { fontSize: 'clamp(1.6rem, 4.5vw, 2.6rem)',  opacity: 0.88, color: 'rgba(255,255,255,0.88)', letterSpacing: '10px', fontWeight: 300, italic: false };
    case 'echo':     return { fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)', opacity: 0.42, color: 'rgba(255,255,255,0.42)', letterSpacing: '1px',  fontWeight: 300, italic: true  };
    case 'fragment': return { fontSize: 'clamp(0.92rem, 2.2vw, 1.18rem)', opacity: 0.72, color: 'rgba(255,255,255,0.72)', letterSpacing: '0.5px',fontWeight: 300, italic: false };
    case 'final':    return { fontSize: 'clamp(1.4rem, 3.5vw, 2.0rem)',   opacity: 0.9,  color: '#f4f4f4',                letterSpacing: '5px',   fontWeight: 300, italic: true  };
    default:         return { fontSize: '1rem', opacity: 0.6, color: '#fff', letterSpacing: '2px', fontWeight: 300, italic: false };
  }
}

export default function PuzzleReveal() {
  const { showReveal, dismissReveal } = usePuzzle();
  const [active, setActive] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [showHeart, setShowHeart] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!showReveal) {
      const tReset = setTimeout(() => {
        setActive(null);
        setPhase('idle');
        setShowHeart(false);
      }, 50);
      return () => clearTimeout(tReset);
    }

    setTimeout(() => {
      setPhase('running');
      setShowHeart(false);
      setShowSubtitle(false);
      setShowSecretMessage(false);
    }, 0);

    // Start ambient rain audio
    audioRef.current = createRainAudio();

    const timers = [];

    SEQUENCE.forEach(({ text, delay, hold, type }) => {
      timers.push(setTimeout(() => {
        setActive({ text, type });
      }, delay));

      timers.push(setTimeout(() => {
        setActive(prev => prev?.text === text ? null : prev);
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

          {/* Warm glow — appears only for the final quote */}
          <AnimatePresence>
            {active?.type === 'final' && (
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
                  initial={{ opacity: 0, filter: 'blur(18px)', y: active.type === 'name' ? 10 : 0 }}
                  animate={{ opacity: style.opacity, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(18px)' }}
                  transition={{
                    duration: active.type === 'name' ? 3.5 : 2.4,
                    ease: 'easeInOut',
                  }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}
                >
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: style.fontSize,
                    fontWeight: style.fontWeight,
                    fontStyle: style.italic ? 'italic' : 'normal',
                    color: style.color,
                    letterSpacing: style.letterSpacing,
                    margin: 0,
                    textAlign: 'center',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    maxWidth: '78vw',
                    lineHeight: 1.55,
                    textShadow: active.type === 'name'
                      ? '0 0 80px rgba(244,244,244,0.22), 0 0 140px rgba(220,215,255,0.1)'
                      : 'none',
                  }}>
                    {active.text}
                  </p>

                  {/* White heart — 2s after Anushka */}
                  <AnimatePresence>
                    {showHeart && (
                      <motion.span
                        key="heart"
                        initial={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
                        animate={{ opacity: 0.9, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.5, ease: 'easeOut' }}
                        style={{ fontSize: '1.5rem', userSelect: 'none', pointerEvents: 'none' }}
                      >
                        🤍
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* 'she was always here.' — 3.5s after Anushka, below the heart */}
                  <AnimatePresence>
                    {showSubtitle && (
                      <motion.p
                        key="subtitle"
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 0.38 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: 'easeInOut' }}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                          fontStyle: 'italic',
                          color: 'rgba(255,255,255,0.38)',
                          letterSpacing: '3px',
                          margin: 0, marginTop: 8,
                          userSelect: 'none', pointerEvents: 'none',
                        }}
                      >
                        she was always here.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* The Secret Message — appears 10s after the name, at the very bottom */}
          <AnimatePresence>
            {showSecretMessage && (
              <motion.div
                key="secret-message"
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 0.5, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4, ease: 'easeOut' }}
                style={{
                  position: 'absolute', bottom: '15vh', left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '1.5px',
                  textAlign: 'center', width: '90%',
                  pointerEvents: 'none', zIndex: 10,
                }}
              >
                if you ever find this... I just want you to know you were the most beautiful part of my story.
              </motion.div>
            )}
          </AnimatePresence>

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
