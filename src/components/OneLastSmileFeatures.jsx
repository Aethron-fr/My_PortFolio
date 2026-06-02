import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';
import { useRef } from 'react';

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
  
  // Mouse tracking for the spotlight and 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth 3D tilting
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!boundingRef.current) return;
    const rect = boundingRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
    
    // Calculate tilt angles (max 5 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rotateX.set(((y - centerY) / centerY) * -5);
    rotateY.set(((x - centerX) / centerX) * 5);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // The glowing spotlight follows the mouse
  const spotlightStyle = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      ${accentColor}1A,
      transparent 40%
    )
  `;

  return (
    <motion.div
      ref={boundingRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className="feature-card-wrapper"
    >
      <motion.div
        whileHover={{ 
          y: -12, 
          boxShadow: `0 30px 60px -15px ${accentColor}40`,
          borderColor: `${accentColor}70`,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(180deg, rgba(16,16,20,0.6) 0%, rgba(8,8,10,0.9) 100%)',
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
          height: '100%',
        }}
      >
        {/* Dynamic Interactive Spotlight */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: spotlightStyle,
            opacity: 0, transition: 'opacity 0.3s'
          }}
          whileHover={{ opacity: 1 }}
        />

        {/* Static Background Glow */}
        <div style={{
          position: 'absolute', top: -100, right: -100, width: '300px', height: '300px',
          background: `radial-gradient(circle at center, ${accentColor}25 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 2, transform: 'translateZ(20px)' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}05)`,
            border: `1px solid ${accentColor}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: accentColor,
            boxShadow: `inset 0 0 24px ${accentColor}22, 0 8px 24px -4px ${accentColor}44`
          }}>
            {icon}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '4px',
            color: '#ffffff', textTransform: 'uppercase', margin: 0,
            textShadow: `0 0 30px ${accentColor}AA`
          }}>
            {title}
          </h3>
        </div>

        {/* List Items with Staggered Entrance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px', position: 'relative', zIndex: 2 }}>
          {items.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: delay + 0.2 + (i * 0.1) }}
              whileHover={{ x: 8, borderLeftColor: accentColor }}
              style={{ 
                borderLeft: `2px solid rgba(255,255,255,0.08)`, 
                paddingLeft: '24px',
                transform: 'translateZ(10px)'
              }}
            >
              <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.95)', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.5px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontWeight: 300 }}>
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function OneLastSmileFeatures() {
  return (
    <div style={{ marginTop: '40px', position: 'relative', zIndex: 10 }}>
      
      {/* Background Architectural Grid */}
      <div style={{
        position: 'absolute', inset: -100, zIndex: -1, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at 50% 30%, black 0%, transparent 60%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 0%, transparent 60%)',
      }} />

      {/* Sleek animated connector line */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        whileInView={{ height: 80, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          width: '2px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.05), transparent)',
          margin: '0 auto 60px',
          boxShadow: '0 0 15px rgba(255,255,255,0.3)'
        }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', marginBottom: '80px' }}
      >
        <h3 style={{
          fontSize: '2.2rem', fontWeight: 300, color: '#fff',
          margin: 0, letterSpacing: '-0.5px', textShadow: '0 8px 30px rgba(255,255,255,0.2)'
        }}>
          Inside the Architecture
        </h3>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '6px',
          color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '20px'
        }}>
          What makes it different
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        width: '100%',
        padding: '0 16px'
      }}>
        <FeatureCard 
          title="Emotional Design" 
          items={features.emotional} 
          delay={0.1}
          accentColor="#f43f5e" 
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          }
        />
        <FeatureCard 
          title="Interaction" 
          items={features.interactive} 
          delay={0.3}
          accentColor="#0ea5e9" 
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          }
        />
        <FeatureCard 
          title="Architecture" 
          items={features.technical} 
          delay={0.5}
          accentColor="#8b5cf6" 
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          }
        />
      </div>
    </div>
  );
}
