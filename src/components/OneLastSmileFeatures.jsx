import { motion } from 'framer-motion';

const features = {
  emotional: [
    { title: 'Cinematic Narrative', desc: 'A multi-phase storytelling structure.' },
    { title: 'One-Time Concept', desc: 'An experience designed to be felt, not repeated.' },
    { title: 'Emotional Progression', desc: 'Pacing that breathes with the user.' },
    { title: 'Interactive Choices', desc: 'Decisions carrying permanent weight.' },
  ],
  interactive: [
    { title: 'Discoverable Secrets', desc: 'Quiet moments waiting to be found.' },
    { title: 'Contextual Immersion', desc: 'Responses tuned to your environment.' },
    { title: 'Hidden Fragments', desc: 'Pieces of memory scattered across the UI.' },
    { title: 'Dynamic Ecosystem', desc: 'A lunar system tied to real-world time.' },
  ],
  technical: [
    { title: 'Custom Audio Engine', desc: 'Web Audio API procedural synthesis.' },
    { title: 'Advanced State', desc: 'Context-driven React architecture.' },
    { title: 'CSS 3D Physics', desc: 'High-tension Framer Motion mechanics.' },
    { title: 'Lunar Algorithms', desc: 'Real-time ephemeris calculations.' },
  ]
};

const FeatureCard = ({ title, items, delay, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
    style={{
      background: 'rgba(20,20,25,0.4)',
      border: '1px solid rgba(255,255,255,0.03)',
      borderRadius: '24px',
      padding: '40px',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* Subtle gradient glow */}
    <div style={{
      position: 'absolute', top: 0, right: 0, width: '150px', height: '150px',
      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />

    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)'
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px',
        color: 'var(--text-secondary)', textTransform: 'uppercase', margin: 0
      }}>
        {title}
      </h3>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400, marginBottom: '6px' }}>
            {item.title}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            {item.desc}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function OneLastSmileFeatures() {
  return (
    <div style={{ marginTop: '24px', position: 'relative' }}>
      
      {/* Connector line from the spotlight */}
      <div style={{
        width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
        margin: '0 auto 40px'
      }} />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <h3 style={{
          fontSize: '1.4rem', fontWeight: 300, color: 'var(--text-muted)',
          margin: 0, letterSpacing: '-0.5px'
        }}>
          Inside the Architecture
        </h3>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '4px',
          color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '16px'
        }}>
          What makes it different
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        width: '100%'
      }}>
        <FeatureCard 
          title="Emotional Design" 
          items={features.emotional} 
          delay={0.1}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          }
        />
        <FeatureCard 
          title="Interactive Experience" 
          items={features.interactive} 
          delay={0.2}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          }
        />
        <FeatureCard 
          title="Technical Architecture" 
          items={features.technical} 
          delay={0.3}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          }
        />
      </div>
    </div>
  );
}
