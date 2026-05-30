import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasBackground from '../components/CanvasBackground';
import StoryMode from '../components/StoryMode';
import ThresholdScreen from '../components/ThresholdScreen';
import BirthdayFlow from '../components/BirthdayFlow';
import GiftIntro from '../components/GiftIntro';
import CinematicIntro from '../components/CinematicIntro';
import IdleMessages from '../components/IdleMessages';
import MemoryArchive from '../components/MemoryArchive';
import OneLastReply from '../components/OneLastReply';
import Propose from '../components/Propose';
import FinalChoice from '../components/FinalChoice';
import OneLastThing from '../components/OneLastThing';
import FinalLetter from '../components/FinalLetter';
import Epilogue from '../components/Epilogue';
import QuietAftermath from '../components/QuietAftermath';
import { useAtmosphere } from '../context/AtmosphereContext';
import { audioController } from '../audio';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Scroll-reveal wrapper ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: '-60px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Story Behind content (toned-down copy) ────────────────────────────────────
const PARTS = [
  {
    label: '01 — The Idea',
    heading: 'Why it exists',
    accent: 'rgba(200,55,80,0.65)',
    paragraphs: [
      `OneLastSmile didn't start as a portfolio project. It started with something personal — the kind of distance that doesn't announce itself. You notice it gradually. Conversations get shorter. Then one night, you're looking at a thread that used to feel significant and it just doesn't anymore.`,
      `I didn't want to write about that. I wanted to build around it. The question became: what does quiet emotional distance actually look like in a browser? Not dramatic. Not decorated with sound effects. Something slow and sustained.`,
    ],
  },
  {
    label: '02 — The Process',
    heading: 'Rebuilding until it felt right',
    accent: 'rgba(0,247,255,0.65)',
    paragraphs: [
      `I rebuilt the atmosphere at least four times. The first version was too much — too many things moving, too many elements trying to say something at once. I scrapped it after two weeks when I realised it was decorating emotion instead of communicating it.`,
      `The hardest part wasn't the engineering. It was learning to trust restraint. Every time I added something, I'd sit with it and ask whether it was atmosphere or just noise. Most of it was noise. The actual work was removing things.`,
      `There were nights where I'd spend hours adjusting a single text fade — not because it was broken, but because it didn't feel right yet. Quiet distance has a specific quality. Getting the timing to reflect that honestly took longer than I expected.`,
    ],
  },
  {
    label: '03 — The Engineering',
    heading: 'Performance as a design constraint',
    accent: 'rgba(200,55,80,0.65)',
    paragraphs: [
      `Every atmospheric effect — grain, fog, drifting particles, vignette — runs through CSS transforms and opacity changes so the browser never triggers layout recalculations. With 200+ DOM elements active simultaneously, the render pipeline stays clean.`,
      `The cursor-reactive lighting uses Framer Motion spring physics to give physical weight to a glow moving through fog. The stiffness and damping values took dozens of iterations — heavy enough to feel real, responsive enough not to feel broken.`,
      `Building this changed how I think about motion-heavy interfaces. The GPU-friendly patterns I developed here are now how I approach all animation-heavy work.`,
    ],
  },
  {
    label: '04 — The Conclusion',
    heading: 'What it changed',
    accent: 'rgba(228,228,231,0.3)',
    paragraphs: [
      `At some point, working on OneLastSmile stopped feeling like engineering. I realised that smoothness itself carries meaning — that the way something moves says as much as what it says. A transition that's too fast feels dismissive. One that's too slow feels performative. The right speed feels honest.`,
      `OneLastSmile isn't publicly open yet. When it opens, it will be exactly what it needs to be — nothing more.`,
    ],
  },
];

export default function OneLastSmilePage() {
  const navigate = useNavigate();
  const { isLateNight, isIdle } = useAtmosphere();
  const [entryStage, setEntryStage] = useState(() => {
    const decision = localStorage.getItem('final_decision_locked');
    if (decision) {
      const endTime = parseInt(localStorage.getItem('ols_session_end') || '0', 10);
      const hoursPassed = (Date.now() - endTime) / (1000 * 60 * 60);
      const seenEpilogue = localStorage.getItem('ols_seen_epilogue') === '1';

      if (hoursPassed > 12 && !seenEpilogue && decision === 'keep') {
        return 'EPILOGUE';
      }
      return 'QUIET_AFTERMATH';
    }

    if (sessionStorage.getItem('__ols_threshold_cleared')) return 'MAIN';
    return 'BIRTHDAY';
  });
  const [showStory, setShowStory] = useState(false);

  // The one special hidden moment
  const [showHiddenMoment, setShowHiddenMoment] = useState(false);
  const hiddenMomentShown = useRef(
    sessionStorage.getItem('__hm_shown') === '1'
  );

  // Track StoryMode visits
  useEffect(() => {
    const visits = parseInt(sessionStorage.getItem('ols_visits') || '0') + 1;
    sessionStorage.setItem('ols_visits', String(visits));
  }, []);

  // Hidden moment — only at night, only when idle, only once per session
  useEffect(() => {
    if (!isLateNight || hiddenMomentShown.current) return;
    if (!isIdle) return;

    // Extra 18s delay from when idle triggers — feels accidental
    const t = setTimeout(() => {
      if (hiddenMomentShown.current) return;
      hiddenMomentShown.current = true;
      sessionStorage.setItem('__hm_shown', '1');
      setShowHiddenMoment(true);
      setTimeout(() => setShowHiddenMoment(false), 7_000);
    }, 18_000);

    return () => clearTimeout(t);
  }, [isLateNight, isIdle]);

  // puzzle_idle — discover clue when idle here (any time, not just night)
  useEffect(() => {
    if (!isIdle) return;
    const t = setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('_p_clues') || '{}');
        if (!stored['puzzle_idle']) {
          stored['puzzle_idle'] = Date.now();
          localStorage.setItem('_p_clues', JSON.stringify(stored));
        }
      } catch {}
    }, 6000); // 6s after idle triggers (idle itself = 40s, so ~46s total here)
    return () => clearTimeout(t);
  }, [isIdle]);

  // Lock body scroll when story or threshold or other fullscreens are active
  useEffect(() => {
    if (showStory || entryStage !== 'MAIN') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showStory, entryStage]);

  // Audio manager
  useEffect(() => {
    if (entryStage !== 'MAIN') {
      // Before main experience, absolute silence except cinematic
      audioController.setRumble(false);
      audioController.setRain(false);
    } else if (showStory) {
      // In Story Mode: Heavy window rain, no rumble
      audioController.setRumble(false);
      audioController.setRain(true);
    } else {
      // In Atmosphere (Landing): Distant rumble, no rain
      audioController.setRain(false);
      audioController.setRumble(true);
    }
  }, [entryStage, showStory]);

  // Clean up all audio if they leave the page entirely
  useEffect(() => {
    return () => {
      audioController.setRumble(false);
      audioController.setRain(false);
    };
  }, []);

  if (entryStage === 'EPILOGUE') {
    return <Epilogue onComplete={() => {
      localStorage.setItem('ols_seen_epilogue', '1');
      setEntryStage('QUIET_AFTERMATH');
    }} />;
  }

  if (entryStage === 'QUIET_AFTERMATH') {
    return <QuietAftermath onComplete={() => setEntryStage('MAIN')} />;
  }

  if (entryStage === 'BIRTHDAY') return <BirthdayFlow onComplete={() => setEntryStage('GIFT')} />;
  if (entryStage === 'GIFT') return <GiftIntro onComplete={() => setEntryStage('WARNING')} />;
  if (entryStage === 'WARNING') {
    return (
      <ThresholdScreen 
        onAccept={() => {
          sessionStorage.setItem('__ols_threshold_cleared', '1');
          setEntryStage('CINEMATIC');
          audioController.setRumble(true);
        }} 
        onDecline={() => navigate('/')} 
      />
    );
  }

  if (entryStage === 'CINEMATIC') {
    return <CinematicIntro onComplete={() => {
      setEntryStage('MAIN');
      setShowStory(true);
    }} />;
  }

  if (entryStage === 'ARCHIVE') return <MemoryArchive onComplete={() => setEntryStage('THINGS_I_NEVER_SAID')} />;
  if (entryStage === 'THINGS_I_NEVER_SAID') return <OneLastReply onComplete={() => setEntryStage('PROPOSE')} />;
  if (entryStage === 'PROPOSE') return <Propose onComplete={() => setEntryStage('FINAL_CHOICE')} />;
  
  if (entryStage === 'FINAL_CHOICE') {
    return <FinalChoice onComplete={(choice) => {
      window.userFinalChoice = choice;
      setEntryStage('ONE_LAST_THING');
    }} />;
  }

  if (entryStage === 'ONE_LAST_THING') return <OneLastThing onComplete={() => setEntryStage('FINAL_LETTER')} />;
  
  if (entryStage === 'FINAL_LETTER') {
    return <FinalLetter onComplete={() => {
      import('../utils/KeepsakeGenerator.js').then(m => m.generateKeepsakeHTML(window.userFinalChoice || 'keep'));
      setEntryStage('QUIET_AFTERMATH');
    }} />;
  }

  return (
    <>
      <CanvasBackground />
      <IdleMessages />


      {/* The One Hidden Moment — late night, idle, once per session. No replay. */}
      {/* "Funny how some people quietly become part of everything." */}
      <AnimatePresence mode="wait">
        {showHiddenMoment && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            onClick={() => setShowHiddenMoment(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: 'rgba(2,0,2,0.95)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textAlign: 'center'
            }}>
              Funny how some people quietly become part of everything.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Mode Overlay */}
      <AnimatePresence>
        {showStory && (
          <StoryMode
            key="story"
            onClose={() => {
              setShowStory(false);
              setEntryStage('ARCHIVE');
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Page */}
      <div style={{
        minHeight: '100dvh', position: 'relative', zIndex: 1,
        background: 'linear-gradient(to bottom, #040406, #050505)',
      }}>
        {/* Film grain */}
        <div style={{
          position: 'fixed', inset: 0, backgroundImage: GRAIN,
          opacity: 0.035, mixBlendMode: 'overlay', pointerEvents: 'none',
          zIndex: 0, transform: 'translateZ(0)',
        }} />

        {/* ← Back button */}
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.6, y: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          onClick={() => navigate('/')}
          style={{
            position: 'fixed',
            top: 'max(24px, env(safe-area-inset-top))',
            left: 'max(24px, env(safe-area-inset-left))',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 30, padding: '9px 18px',
            color: '#fff', fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem', letterSpacing: '2px',
            cursor: 'pointer', zIndex: 1000,
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            transition: 'border-color 0.3s, opacity 0.3s',
          }}
        >
          ← Portfolio
        </motion.button>

        <div style={{ maxWidth: 820, margin: '0 auto', padding: '100px 28px 120px' }}>

          {/* Header */}
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                letterSpacing: '6px', color: 'rgba(225,48,108,0.65)',
                textTransform: 'uppercase', marginBottom: 24,
              }}>
                Featured Experience
              </div>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300, color: '#fff',
                letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 20,
              }}>
                OneLastSmile
              </h1>
              <p style={{
                fontSize: '0.95rem', color: 'rgba(255,255,255,0.32)',
                maxWidth: 420, margin: '0 auto', lineHeight: 1.9, fontWeight: 300,
              }}>
                A sealed cinematic experience. Built around something quiet.
              </p>

              <div style={{ marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ opacity: 1, boxShadow: '0 0 20px rgba(225,48,108,0.2)', borderColor: 'rgba(225,48,108,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowStory(true)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 30, padding: '12px 28px',
                    color: '#fff', fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem', letterSpacing: '2px',
                    textTransform: 'uppercase', cursor: 'pointer',
                    transition: 'all 0.4s ease',
                  }}
                >
                  Enter Experience
                </motion.button>
              </div>

              <div style={{
                marginTop: 28,
                fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                color: 'rgba(255,255,255,0.15)', letterSpacing: '3px',
              }}>
                Sealed — Opening January 2027
              </div>
            </div>
          </Reveal>

          {/* Divider */}
          <div style={{
            width: '100%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            marginBottom: 80,
          }} />

          {/* Story Behind sections */}
          {PARTS.map((part, pi) => (
            <div key={pi} style={{ marginBottom: pi < PARTS.length - 1 ? 80 : 0 }}>
              <Reveal delay={0.04}>
                <div style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 18, padding: '40px 40px 44px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Top accent line */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                    background: `linear-gradient(90deg, transparent, ${part.accent}, transparent)`,
                  }} />

                  <Reveal delay={0.06}>
                    <div style={{ marginBottom: 28 }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                        letterSpacing: '5px', color: part.accent,
                        textTransform: 'uppercase', marginBottom: 8,
                      }}>
                        {part.label}
                      </div>
                      <h3 style={{
                        fontSize: '1.3rem', fontWeight: 400,
                        color: 'rgba(255,255,255,0.82)',
                        letterSpacing: '-0.3px', margin: 0,
                      }}>
                        {part.heading}
                      </h3>
                    </div>
                  </Reveal>

                  <div style={{
                    width: 36, height: '1px',
                    background: 'rgba(255,255,255,0.06)', marginBottom: 28,
                  }} />

                  {part.paragraphs.map((para, qi) => (
                    <Reveal key={qi} delay={0.05 + qi * 0.06}>
                      <p style={{
                        fontSize: '0.95rem',
                        color: 'rgba(255,255,255,0.46)',
                        lineHeight: 1.9, fontWeight: 300, margin: 0,
                        marginBottom: qi < part.paragraphs.length - 1 ? 20 : 0,
                        maxWidth: 680,
                      }}>
                        {para}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </Reveal>

              {pi < PARTS.length - 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  margin: '40px 0 0', opacity: 0.12,
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                </div>
              )}
            </div>
          ))}

          {/* Footer note */}
          <Reveal delay={0.1}>
            <div style={{
              marginTop: 80, paddingTop: 40,
              borderTop: '1px solid rgba(255,255,255,0.04)',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.1)',
                letterSpacing: '3px', margin: 0,
              }}>
                Public Opening — January 3, 2027
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
