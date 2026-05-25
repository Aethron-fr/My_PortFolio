import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const INFLUENCES = [
  {
    title: 'Red Dead Redemption 2',
    studio: 'Rockstar Games',
    year: '2018',
    note: 'World-building through restraint. Every environmental detail earns its place. Silence communicates more than dialogue.',
    accent: 'rgba(160, 60, 40, 0.5)',
  },
  {
    title: 'Sekiro: Shadows Die Twice',
    studio: 'FromSoftware',
    year: '2019',
    note: 'Precision. Consequence. Every interaction has weight. Nothing is decorative.',
    accent: 'rgba(140, 40, 40, 0.5)',
  },
  {
    title: 'God of War',
    studio: 'Santa Monica Studio',
    year: '2018',
    note: 'Cinematic continuity without breaking immersion. The entire film in one uncut take. Character through restraint, not exposition.',
    accent: 'rgba(100, 80, 60, 0.5)',
  },
  {
    title: 'Uncharted 4',
    studio: 'Naughty Dog',
    year: '2016',
    note: 'Movement as character expression. Environmental storytelling. The balance between spectacle and quiet.',
    accent: 'rgba(60, 80, 120, 0.45)',
  },
];

function InfluenceCard({ influence, index }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: '-40px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.045)',
        borderRadius: 14,
        padding: '28px 28px 28px 32px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.4s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.045)'}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '2px',
        background: influence.accent,
        borderRadius: '0 2px 2px 0',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 }}>
        <div>
          <h3 style={{
            fontSize: '0.98rem', fontWeight: 500,
            color: 'rgba(255,255,255,0.82)',
            margin: '0 0 4px',
            letterSpacing: '-0.2px',
          }}>
            {influence.title}
          </h3>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.22)', letterSpacing: '2px',
          }}>
            {influence.studio} · {influence.year}
          </div>
        </div>
      </div>

      <p style={{
        fontSize: '0.88rem', color: 'rgba(255,255,255,0.38)',
        lineHeight: 1.75, fontWeight: 300, margin: 0,
        maxWidth: 520,
      }}>
        {influence.note}
      </p>
    </motion.div>
  );
}

export default function CreativeInfluences() {
  const headerRef = useRef(null);
  const [headerInView, setHeaderInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderInView(true); },
      { rootMargin: '-40px' }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{
      position: 'relative', zIndex: 2,
      padding: '72px 0 80px',
      background: '#07070d',
    }}>
      <div className="container">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 40 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            letterSpacing: '5px', color: 'rgba(180,50,75,0.55)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            Creative Influences
          </div>
          <h2 style={{
            fontSize: '1.55rem', fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '-0.5px', margin: '0 0 16px',
          }}>
            Design thinking shaped by storytelling.
          </h2>
          <p style={{
            fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)',
            lineHeight: 1.85, fontWeight: 300, maxWidth: 560, margin: 0,
          }}>
            A lot of how I think about interfaces comes from slow cinematic worlds — experiences where
            environment tells the story, pacing is never rushed, and nothing feels decorative.
          </p>
        </motion.div>

        {/* Influence cards — two column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))',
          gap: 16,
        }}>
          {INFLUENCES.map((inf, i) => (
            <InfluenceCard key={inf.title} influence={inf} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
