import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useRef, useState } from 'react';

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

const FeatureCard = ({ title, items, delay, icon, accentColor }) => {
  const boundingRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Mouse tracking for the subtle spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!boundingRef.current) return;
    const rect = boundingRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Extremely subtle, clean spotlight
  const spotlightStyle = useMotionTemplate`
    radial-gradient(
      400px circle at ${mouseX}px ${mouseY}px,
      rgba(255,255,255,0.03),
      transparent 80%
    )
  `;

  return (
    <motion.div
      ref={boundingRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      style={{
        background: 'rgba(10, 10, 12, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '36px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
      }}
    >
      {/* Clean hover border & spotlight */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: spotlightStyle,
          opacity: isHovering ? 1 : 0, transition: 'opacity 0.4s ease'
        }}
      />
      
      {/* Minimalist Top Glow */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}44, transparent)`,
        opacity: isHovering ? 1 : 0.3,
        transition: 'opacity 0.5s ease',
        zIndex: 2
      }} />

      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 2 }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: accentColor,
        }}>
          {icon}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '2px',
          color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', margin: 0,
          fontWeight: 400
        }}>
          {title}
        </h3>
      </div>

      {/* List Items - Clean Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px', position: 'relative', zIndex: 2 }}>
        {items.map((item, i) => (
          <div 
            key={i} 
            style={{ 
              borderLeft: `1px solid rgba(255, 255, 255, 0.1)`, 
              paddingLeft: '16px',
            }}
          >
            <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 400, marginBottom: '6px', letterSpacing: '0.3px' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.4)', lineHeight: 1.6, fontWeight: 300 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function OneLastSmileFeatures() {
  return (
    <div style={{ marginTop: '32px', position: 'relative', zIndex: 10 }}>
      
      {/* Clean elegant connector line */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        whileInView={{ height: 60, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '1px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
          margin: '0 auto 60px',
        }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', marginBottom: '80px' }}
      >
        <h3 style={{
          fontSize: '2rem', fontWeight: 300, color: 'rgba(255, 255, 255, 0.9)',
          margin: 0, letterSpacing: '-0.5px'
        }}>
          Inside the Architecture
        </h3>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '4px',
          color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', marginTop: '16px'
        }}>
          What makes it different
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        width: '100%',
        padding: '0 16px'
      }}>
        <FeatureCard 
          title="Emotional Design" 
          items={features.emotional} 
          delay={0.1}
          accentColor="#e11d48" // Classic muted rose
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          }
        />
        <FeatureCard 
          title="Interaction" 
          items={features.interactive} 
          delay={0.2}
          accentColor="#0284c7" // Classic muted azure
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          }
        />
        <FeatureCard 
          title="Architecture" 
          items={features.technical} 
          delay={0.3}
          accentColor="#7c3aed" // Classic muted violet
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          }
        />
      </div>
    </div>
  );
}
