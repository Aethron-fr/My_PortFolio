import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Sparkles, Heart, MousePointer2, Layers, Cpu, Volume2, KeySquare } from 'lucide-react';

const FeatureCard = ({ 
  title, 
  subtitle,
  items, 
  icon, 
  delay, 
  accentColor, 
  className = "",
  style = {},
  isHero = false,
  isFooter = false
}) => {
  const boundingRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!boundingRef.current) return;
    const rect = boundingRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightStyle = useMotionTemplate`
    radial-gradient(
      450px circle at ${mouseX}px ${mouseY}px,
      rgba(255,255,255,0.04),
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
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      className={`bento-card ${className}`}
      style={{
        background: 'rgba(10, 10, 14, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        padding: isHero ? '48px' : '32px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        ...style
      }}
    >
      <motion.div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: spotlightStyle,
          opacity: isHovering ? 1 : 0, transition: 'opacity 0.4s ease'
        }}
      />
      
      {/* Dynamic Top Glow matching accent color */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}66, transparent)`,
        opacity: isHovering ? 1 : 0.15,
        transition: 'opacity 0.5s ease',
        zIndex: 2
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 2, height: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: isHero ? '56px' : '40px', 
            height: isHero ? '56px' : '40px', 
            borderRadius: '12px',
            background: `linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
            border: `1px solid rgba(255,255,255,0.06)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: accentColor,
            boxShadow: `inset 0 0 20px ${accentColor}15`
          }}>
            {icon}
          </div>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-mono)', 
              fontSize: isHero ? '1rem' : '0.8rem', 
              letterSpacing: '3px',
              color: 'rgba(255,255,255,0.95)', 
              textTransform: 'uppercase', 
              margin: 0,
            }}>
              {title}
            </h3>
          </div>
        </div>

        {/* Optional Subtitle for Hero */}
        {subtitle && (
          <p style={{ 
            fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)', 
            lineHeight: 1.6, fontWeight: 300, margin: '8px 0 16px 0',
            maxWidth: '90%'
          }}>
            {subtitle}
          </p>
        )}

        {/* List Content */}
        {items && (
          <div style={{ 
            display: 'flex', 
            flexDirection: isFooter ? 'row' : 'column', 
            flexWrap: 'wrap',
            gap: isHero ? '16px' : '12px', 
            marginTop: 'auto',
            paddingTop: '16px'
          }}>
            {items.map((item, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: isFooter ? 'calc(25% - 12px)' : '100%',
                  minWidth: isFooter ? '200px' : 'auto'
                }}
              >
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: accentColor, opacity: 0.8 }} />
                <span style={{ 
                  fontSize: isHero ? '1.05rem' : '0.9rem', 
                  color: 'rgba(255,255,255,0.6)', 
                  fontWeight: 300, 
                  letterSpacing: '0.3px' 
                }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer special text */}
        {isFooter && !items && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '16px',
            fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.8, fontWeight: 300, marginTop: '8px'
          }}>
            <p style={{ margin: 0 }}>This website contains secrets.</p>
            <p style={{ margin: 0 }}>Some appear after waiting. Some require exploration.</p>
            <p style={{ margin: 0 }}>Some are intentionally difficult to discover.</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginTop: '16px' }}>
              Not everything is shown immediately.
            </p>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default function OneLastSmileFeatures() {
  
  // Custom CSS for the Bento Grid layout to handle responsiveness cleanly
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .bento-grid-container {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 24px;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
      }
      
      @media (min-width: 768px) {
        .bento-grid-container {
          grid-template-columns: repeat(2, 1fr);
        }
        .bento-card-hero { grid-column: span 2; }
        .bento-card-footer { grid-column: span 2; }
      }
      
      @media (min-width: 1024px) {
        .bento-grid-container {
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: minmax(220px, auto);
        }
        .bento-card-hero {
          grid-column: span 2;
          grid-row: span 2;
        }
        .bento-card-emotional { grid-column: 3; grid-row: 1; }
        .bento-card-interaction { grid-column: 3; grid-row: 2; }
        .bento-card-tech { grid-column: 1; grid-row: 3; }
        .bento-card-effects { grid-column: 2; grid-row: 3; }
        .bento-card-audio { grid-column: 3; grid-row: 3; }
        .bento-card-footer {
          grid-column: span 3;
          grid-row: 4;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ marginTop: '80px', position: 'relative', zIndex: 10, paddingBottom: '80px' }}>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', marginBottom: '80px' }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '4px',
          color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '24px'
        }}>
          Behind The Experience
        </div>
        <h3 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, color: 'rgba(255, 255, 255, 0.95)',
          margin: '0 auto', letterSpacing: '-0.5px', maxWidth: '800px', lineHeight: 1.4
        }}>
          This portfolio is not a collection of pages. <br />
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>
            It is a living system built around emotion, interaction, atmosphere and storytelling.
          </span>
        </h3>
      </motion.div>

      <div className="bento-grid-container">
        
        {/* CARD 1: HERO (Span 2x2) */}
        <FeatureCard 
          className="bento-card-hero"
          title="OneLastSmile" 
          subtitle="The most ambitious project I have ever built. A cinematic web experience created as a personal gift, exploring memory, permanence, emotion and digital storytelling."
          items={[
            "Multi-phase narrative journey",
            "Emotional decision system",
            "Permanent endings",
            "Offline Keepsake Generator",
            "Hidden discoveries",
            "Return visitor memory",
            "Atmospheric audio design"
          ]}
          delay={0.1}
          accentColor="#0ea5e9" // Cyan
          isHero={true}
          icon={<Sparkles size={28} strokeWidth={1.5} />}
        />

        {/* CARD 2: EMOTIONAL DESIGN (Top Right) */}
        <FeatureCard 
          className="bento-card-emotional"
          title="Emotional Design" 
          items={[
            "Cinematic storytelling",
            "Music-driven immersion",
            "Emotional progression",
            "One-time philosophy",
            "Memory interactions",
            "Narrative pacing"
          ]}
          delay={0.2}
          accentColor="#f43f5e" // Purple/Pink
          icon={<Heart size={20} strokeWidth={1.5} />}
        />

        {/* CARD 3: INTERACTION SYSTEM (Mid Right) */}
        <FeatureCard 
          className="bento-card-interaction"
          title="Interaction System" 
          items={[
            "Hidden puzzles",
            "Memory fragments",
            "Secret discoveries",
            "Interactive reveals",
            "Context-aware responses",
            "Progressive exploration"
          ]}
          delay={0.3}
          accentColor="#8b5cf6" // Violet
          icon={<MousePointer2 size={20} strokeWidth={1.5} />}
        />

        {/* CARD 4: TECHNICAL ARCHITECTURE (Bottom Left) */}
        <FeatureCard 
          className="bento-card-tech"
          title="Architecture" 
          items={[
            "React",
            "Framer Motion",
            "Context API",
            "Local Storage",
            "Dynamic State",
            "Custom Logic"
          ]}
          delay={0.4}
          accentColor="#10b981" // Emerald
          icon={<Cpu size={20} strokeWidth={1.5} />}
        />

        {/* CARD 5: ADVANCED EFFECTS (Bottom Mid) */}
        <FeatureCard 
          className="bento-card-effects"
          title="Advanced Effects" 
          items={[
            "Real-time lunar system",
            "Cinematic grain",
            "Glassmorphism layers",
            "Dynamic atmosphere",
            "Advanced motion",
            "Responsive visual arch"
          ]}
          delay={0.5}
          accentColor="#f59e0b" // Amber
          icon={<Layers size={20} strokeWidth={1.5} />}
        />

        {/* CARD 6: AUDIO ENGINE (Bottom Right) */}
        <FeatureCard 
          className="bento-card-audio"
          title="Audio Engine" 
          items={[
            "Web Audio API",
            "Procedural ambient sound",
            "UI click synthesis",
            "Environmental layers"
          ]}
          delay={0.6}
          accentColor="#3b82f6" // Blue
          icon={<Volume2 size={20} strokeWidth={1.5} />}
        />

        {/* CARD 7: HIDDEN DETAILS (Full Width Footer) */}
        <FeatureCard 
          className="bento-card-footer"
          title="Hidden Details" 
          delay={0.7}
          accentColor="#a855f7" // Purple
          isFooter={true}
          icon={<KeySquare size={24} strokeWidth={1.5} />}
        />

      </div>
    </div>
  );
}
