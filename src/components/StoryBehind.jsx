import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// ─── Scroll-reveal wrapper ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
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

// ─── Story content ─────────────────────────────────────────────────────────────
const PARTS = [
  {
    label: '01 — The Idea',
    heading: 'Why it exists',
    accent: 'rgba(200,55,80,0.65)',
    paragraphs: [
      `OneLastSmile didn't start as a portfolio project. It started as something personal — a way to process the kind of distance that doesn't announce itself loudly. You just notice it one day. The conversations get shorter. The replies take longer. And then one night, you're staring at a chat thread that used to feel like home and it just feels like a timestamp.`,
      `I didn't want to write about that feeling. I wanted to build around it. The question was: what does quiet emotional distance actually look like when translated into a browser environment? Not dramatic. Not visual noise. Something understated and sustained.`,
    ],
  },
  {
    label: '02 — The Journey',
    heading: 'Late nights and restarts',
    accent: 'rgba(180,50,75,0.6)',
    paragraphs: [
      `I rebuilt the entire atmosphere at least four times. The first version was too loud — too much animation, too many things trying to say something at once. I scrapped it after two weeks when I realized it was performing emotion instead of communicating it.`,
      `The hardest part wasn't the engineering. It was learning to trust restraint. Every time I added something, I'd sit with it for a few hours and ask whether it was atmosphere or just noise. Most of it was noise. Removing things was the actual work.`,
      `There were nights where I'd spend four hours adjusting the timing on a single text fade — not because it was broken, but because it didn't feel right yet. There's a specific quality to quiet distance that's slow and slightly offbeat. Getting the pacing to reflect that honestly took a long time.`,
    ],
  },
  {
    label: '03 — The Engineering',
    heading: 'Performance as design',
    accent: 'rgba(160,40,65,0.6)',
    paragraphs: [
      `Balancing emotion with clean engineering became the hardest design constraint. Every atmospheric effect — grain, fog, drifting particles, vignette — runs purely through CSS transforms and opacity so the browser never triggers layout recalculations. Even with 200+ DOM elements simultaneously, the render pipeline stays clean.`,
      `The cursor-reactive lighting uses Framer Motion spring physics to add physical weight to a glow that feels like light moving through fog — not a mouse spotlight. The stiffness and damping values took dozens of iterations to find a response heavy enough to feel real but not so delayed it felt broken.`,
      `I learned more about cinematic UI systems building this than anything else I've worked on. The GPU-friendly patterns I developed here became how I think about all motion-heavy interfaces now.`,
    ],
  },
  {
    label: '04 — The Realization',
    heading: 'What it changed',
    accent: 'rgba(140,35,60,0.6)',
    paragraphs: [
      `At some point, working on OneLastSmile stopped feeling like coding. I realized that smoothness itself carries emotion — that the way something moves communicates just as much as what it says. A transition that's too fast feels dismissive. One that's too slow feels melodramatic. The right speed feels like honesty.`,
      `This project changed how I think about frontend development entirely. The interaction is the story. The pacing is the feeling. The atmosphere is the intention. I'm not sure I would have arrived at that through anything else.`,
      `OneLastSmile isn't publicly open yet. Everything that matters about it already exists. It's just not for everyone quite yet.`,
    ],
  },
];

export default function StoryBehind() {
  return (
    <section
      id="story-behind"
      style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, #07070d, #050505)',
        padding: '130px 0 140px',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      {/* Film grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: GRAIN,
        opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 10,
      }} />

      {/* Ambient background glow — barely visible */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(180,40,70,0.25), transparent)',
        zIndex: 8,
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(140,22,50,0.05) 0%, transparent 70%)',
        zIndex: 5,
      }} />

      {/* Drifting background particles — very subtle */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4, overflow: 'hidden' }}>
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -(20 + i % 14), 0],
              opacity: [0.02, 0.09, 0.02],
            }}
            transition={{ duration: 14 + (i % 6), repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            style={{
              position: 'absolute',
              width: 1.5, height: 1.5,
              background: '#fff', borderRadius: '50%',
              left: `${4 + i * 6.5}%`,
              top: `${12 + i * 6}%`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      <div style={{
        maxWidth: 820,
        margin: '0 auto',
        padding: '0 28px',
        position: 'relative',
        zIndex: 15,
      }}>

        {/* ── Section Header ── */}
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '6px', color: 'rgba(180,50,75,0.65)',
              textTransform: 'uppercase', marginBottom: 22,
            }}>
              Personal Archive
            </div>
            <h2 style={{
              fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
              fontWeight: 300, color: '#fff',
              letterSpacing: '-0.8px', lineHeight: 1.25,
              marginBottom: 22,
            }}>
              The Story Behind OneLastSmile
            </h2>
            <p style={{
              fontSize: '1rem', color: 'rgba(255,255,255,0.32)',
              maxWidth: 460, margin: '0 auto', lineHeight: 1.9, fontWeight: 300,
            }}>
              Not every project starts with a spec sheet. Some start with something quieter.
            </p>
          </div>
        </Reveal>

        {/* ── Story Parts ── */}
        {PARTS.map((part, pi) => (
          <div key={pi} style={{ marginBottom: pi < PARTS.length - 1 ? 100 : 0 }}>

            {/* Glass panel */}
            <Reveal delay={0.04}>
              <div style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.045)',
                borderRadius: 20,
                padding: '44px 44px 48px',
                backdropFilter: 'blur(8px)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Panel accent line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                  background: `linear-gradient(90deg, transparent, ${part.accent}, transparent)`,
                }} />

                {/* Subtle inner glow near heading */}
                <div style={{
                  position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
                  width: '60%', height: '80px',
                  background: `radial-gradient(ellipse, ${part.accent.replace('0.6', '0.06')} 0%, transparent 80%)`,
                  filter: 'blur(30px)', pointerEvents: 'none',
                }} />

                {/* Part label + heading */}
                <Reveal delay={0.06}>
                  <div style={{ marginBottom: 32 }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                      letterSpacing: '5px', color: part.accent,
                      textTransform: 'uppercase', marginBottom: 10,
                    }}>
                      {part.label}
                    </div>
                    <h3 style={{
                      fontSize: '1.45rem', fontWeight: 400,
                      color: 'rgba(255,255,255,0.82)',
                      letterSpacing: '-0.3px', margin: 0, lineHeight: 1.3,
                    }}>
                      {part.heading}
                    </h3>
                  </div>
                </Reveal>

                {/* Divider */}
                <div style={{
                  width: 40, height: '1px',
                  background: 'rgba(255,255,255,0.07)',
                  marginBottom: 32,
                }} />

                {/* Paragraphs */}
                {part.paragraphs.map((para, qi) => (
                  <Reveal key={qi} delay={0.05 + qi * 0.07}>
                    <p style={{
                      fontSize: '1rem',
                      color: 'rgba(255,255,255,0.48)',
                      lineHeight: 1.95,
                      fontWeight: 300,
                      margin: 0,
                      marginBottom: qi < part.paragraphs.length - 1 ? 22 : 0,
                      maxWidth: 680,
                    }}>
                      {para}
                    </p>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            {/* Spacer divider between panels — not after last */}
            {pi < PARTS.length - 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                margin: '48px 0 0',
                opacity: 0.15,
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
              </div>
            )}
          </div>
        ))}

        {/* ── Closing ── */}
        <Reveal delay={0.1}>
          <div style={{
            marginTop: 90, paddingTop: 44,
            borderTop: '1px solid rgba(255,255,255,0.04)',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.13)',
              letterSpacing: '3px', fontStyle: 'italic',
              margin: 0,
            }}>
              Public Opening — January 3, 2027
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
