import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeViewer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-resume', handleOpen);
    return () => window.removeEventListener('open-resume', handleOpen);
  }, []);

  const data = {
    experience: [
      { role: "Full Stack Developer", company: "Freelance", period: "2024 - Present", desc: "Architecting MERN stack web applications with framer-motion UI." },
      { role: "Frontend Developer", company: "Open Source", period: "2023 - 2024", desc: "Built highly-starred clones including an Awwwards-winning Ochi design clone." },
    ],
    skills: ["React.js", "Node.js", "MongoDB", "Framer Motion", "Tailwind", "GSAP", "Vite"],
    education: [
      { degree: "Computer Science", place: "Self-Taught", period: "Ongoing", desc: "Mastering web architecture, performance optimization, and creative design." }
    ]
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            padding: '2rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              width: '100%',
              maxWidth: '800px',
              height: '85vh',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              borderRadius: '24px 24px 0 0',
              padding: '40px',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 -20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>Resume</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a 
                  href="https://www.linkedin.com/in/swapnadip-ghosh/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '50px',
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  Download PDF
                </a>
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '50px',
                    background: 'transparent',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '40px' }}>
              <section>
                <h3 style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '20px' }}>Experience</h3>
                {data.experience.map((item, i) => (
                  <div key={i} style={{ marginBottom: '20px', paddingLeft: '20px', borderLeft: '2px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{item.role} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>@ {item.company}</span></h4>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{item.period}</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </section>

              <section>
                <h3 style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '20px' }}>Education</h3>
                {data.education.map((item, i) => (
                  <div key={i} style={{ marginBottom: '20px', paddingLeft: '20px', borderLeft: '2px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{item.degree} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>@ {item.place}</span></h4>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{item.period}</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </section>

              <section>
                <h3 style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '20px' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {data.skills.map((skill, i) => (
                    <span key={i} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
