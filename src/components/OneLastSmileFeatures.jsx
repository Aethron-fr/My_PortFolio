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

const FeatureCard = ({ title, items, delay, icon, accentColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ 
      y: -8, 
      boxShadow: `0 24px 48px -12px ${accentColor}44`,
      borderColor: `${accentColor}66`,
      background: 'linear-gradient(180deg, rgba(25,25,32,0.8) 0%, rgba(12,12,16,0.9) 100%)'
    }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    style={{
      background: 'linear-gradient(180deg, rgba(20,20,25,0.5) 0%, rgba(10,10,12,0.7) 100%)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '24px',
      padding: '40px',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
    }}
  >
    {/* Deep glowing orb in the background */}
    <div style={{
      position: 'absolute', top: -80, right: -80, width: '250px', height: '250px',
      background: `radial-gradient(circle at center, ${accentColor}33 0%, transparent 70%)`,
      filter: 'blur(40px)',
      pointerEvents: 'none',
      zIndex: 0,
    }} />

    {/* Header Section */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', position: 'relative', zIndex: 2 }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '16px',
        background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}05)`,
        border: `1px solid ${accentColor}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        color: accentColor,
        boxShadow: `inset 0 0 20px ${accentColor}22, 0 8px 16px -4px ${accentColor}33`
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '3px',
        color: '#ffffff', textTransform: 'uppercase', margin: 0,
        textShadow: `0 0 24px ${accentColor}88`
      }}>
        {title}
      </h3>
    </div>

    {/* List Items */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '12px', position: 'relative', zIndex: 2 }}>
      {items.map((item, i) => (
        <motion.div 
          key={i} 
          whileHover={{ x: 6, borderLeftColor: accentColor }}
          transition={{ duration: 0.2 }}
          style={{ 
            borderLeft: `2px solid rgba(255,255,255,0.1)`, 
            paddingLeft: '20px',
          }}
        >
          <div style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.95)', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.5px' }}>
            {item.title}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 300 }}>
            {item.desc}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default function OneLastSmileFeatures() {
  return (
    <div style={{ marginTop: '32px', position: 'relative' }}>
      
      {/* Sleek animated connector line */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        whileInView={{ height: 60, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          width: '2px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
          margin: '0 auto 50px',
          boxShadow: '0 0 10px rgba(255,255,255,0.2)'
        }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '70px' }}
      >
        <h3 style={{
          fontSize: '1.8rem', fontWeight: 300, color: '#fff',
          margin: 0, letterSpacing: '-0.5px', textShadow: '0 4px 20px rgba(255,255,255,0.15)'
        }}>
          Inside the Architecture
        </h3>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '5px',
          color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '16px'
        }}>
          What makes it different
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        width: '100%',
        padding: '0 16px'
      }}>
        <FeatureCard 
          title="Emotional Design" 
          items={features.emotional} 
          delay={0.1}
          accentColor="#f43f5e" // Rose/Crimson
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          }
        />
        <FeatureCard 
          title="Interaction" 
          items={features.interactive} 
          delay={0.2}
          accentColor="#0ea5e9" // Cyan/Sky
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          }
        />
        <FeatureCard 
          title="Architecture" 
          items={features.technical} 
          delay={0.3}
          accentColor="#8b5cf6" // Violet/Purple
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          }
        />
      </div>
    </div>
  );
}
