import { useRef } from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: 'React.js',      desc: 'Component Architecture', level: '95%', color: '#61DAFB' },
  { name: 'Node.js',       desc: 'Backend Services',       level: '85%', color: '#339933' },
  { name: 'TypeScript',    desc: 'Type-Safe Logic',        level: '90%', color: '#3178C6' },
  { name: 'MongoDB',       desc: 'NoSQL Databases',        level: '80%', color: '#47A248' },
  { name: 'GSAP',          desc: 'Advanced Animations',    level: '85%', color: '#88CE02' },
  { name: 'Three.js',      desc: 'WebGL 3D Rendering',     level: '70%', color: '#ffffff' },
  { name: 'Tailwind CSS',  desc: 'Utility Styling',        level: '95%', color: '#06B6D4' },
  { name: 'Framer Motion', desc: 'React Physics',          level: '90%', color: '#FF0055' },
  { name: 'Vite',          desc: 'Build Tooling',          level: '85%', color: '#646CFF' },
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
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px 24px;
          overflow: hidden;
          cursor: crosshair;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 150px;
        }

        /* Glowing border that tracks the mouse */
        .bento-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1px;
          background: radial-gradient(
            500px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
            var(--accent-cyber),
            transparent 40%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        /* Soft inner glow that tracks the mouse */
        .bento-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(
            500px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
            rgba(0, 247, 255, 0.06),
            transparent 40%
          );
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .bento-card:hover::before { opacity: 1; }
        .bento-card:hover::after  { opacity: 1; }

        .bento-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: var(--border-hover);
        }

        .bento-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .bento-skill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .bento-progress-track {
          width: 100%;
          height: 2px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }

        .bento-level-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 1px;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          background: var(--bg-surface);
          transition: border-color 0.3s, color 0.3s;
        }

        .bento-card:hover .bento-level-badge {
          border-color: var(--accent-cyber);
          color: var(--accent-cyber);
        }
      `}</style>

      {skills.map((skill, index) => (
        <motion.div
          key={index}
          className="bento-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
        >
          <div className="bento-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span className="bento-skill-dot" style={{ background: skill.color, boxShadow: `0 0 8px ${skill.color}55` }} />
                <div>
                  <h4 style={{
                    margin: 0,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    lineHeight: 1.2
                  }}>
                    {skill.name}
                  </h4>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.5px'
                  }}>
                    {skill.desc}
                  </p>
                </div>
              </div>
              <span className="bento-level-badge">{skill.level}</span>
            </div>

            {/* Progress bar */}
            <div className="bento-progress-track">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: skill.level }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.06, duration: 0.9, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
                  boxShadow: `0 0 8px ${skill.color}66`,
                  borderRadius: '2px'
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
