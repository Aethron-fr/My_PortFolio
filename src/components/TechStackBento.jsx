import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: 'React.js', desc: 'Component Architecture', level: '95%' },
  { name: 'Node.js', desc: 'Backend Services', level: '85%' },
  { name: 'TypeScript', desc: 'Type-Safe Logic', level: '90%' },
  { name: 'MongoDB', desc: 'NoSQL Databases', level: '80%' },
  { name: 'GSAP', desc: 'Advanced Animations', level: '85%' },
  { name: 'Three.js', desc: 'WebGL 3D Rendering', level: '70%' },
  { name: 'Tailwind CSS', desc: 'Utility Styling', level: '95%' },
  { name: 'Framer Motion', desc: 'React Physics', level: '90%' },
  { name: 'Vite', desc: 'Build Tooling', level: '85%' },
];

export default function TechStackBento() {
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    for (const card of containerRef.current.getElementsByClassName('bento-card')) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '20px 0'
      }}
    >
      <style>{`
        .bento-card {
          position: relative;
          background: rgba(10, 12, 22, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 28px 24px;
          overflow: hidden;
          cursor: crosshair;
          transition: transform 0.2s ease, background 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 140px;
        }

        /* The glowing border effect tracking the mouse */
        .bento-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1px; /* border width */
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(0, 247, 255, 0.4),
            transparent 40%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* The soft inner background glow tracking the mouse */
        .bento-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(0, 247, 255, 0.05),
            transparent 40%
          );
          border-radius: 16px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .bento-card:hover::after {
          opacity: 1;
        }

        .bento-card:hover {
          background: rgba(15, 18, 30, 0.7);
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .bento-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      `}</style>

      {skills.map((skill, index) => (
        <motion.div 
          key={index}
          className="bento-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05, duration: 0.5, ease: 'easeOut' }}
        >
          <div className="bento-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h4 style={{ 
                  margin: 0, 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '1.25rem', 
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}>
                  {skill.name}
                </h4>
                <p style={{ 
                  margin: '6px 0 0 0', 
                  fontFamily: 'var(--font-sans)', 
                  fontSize: '0.85rem', 
                  color: 'var(--text-dim)' 
                }}>
                  {skill.desc}
                </p>
              </div>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.75rem', 
                color: 'rgba(0, 247, 255, 0.9)',
                background: 'rgba(0, 247, 255, 0.08)',
                border: '1px solid rgba(0, 247, 255, 0.2)',
                padding: '4px 8px',
                borderRadius: '6px',
                letterSpacing: '1px'
              }}>
                {skill.level}
              </span>
            </div>

            {/* Micro progress bar tracking */}
            <div style={{ width: '100%', height: '2px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: skill.level }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (index * 0.05), duration: 0.8, ease: "easeOut" }}
                style={{ 
                  height: '100%', 
                  background: 'linear-gradient(90deg, rgba(0,247,255,0.4), rgba(255,48,108,0.8))',
                  boxShadow: '0 0 10px rgba(0, 247, 255, 0.5)'
                }} 
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
