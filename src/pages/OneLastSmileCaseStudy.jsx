import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const METRICS = [
  { label: 'Narrative Arcs', value: '7 Phases' },
  { label: 'Interactive Elements', value: '20+ Components' },
  { label: 'State Retention', value: 'Persistent Memory' },
  { label: 'Experience Design', value: 'Choice-Driven' },
  { label: 'Environment', value: 'Atmospheric Systems' },
  { label: 'Accessibility', value: 'Fully Responsive' },
];

const TIMELINE = [
  'Threshold', 'Invitation', 'Warning', 'Immersion', 'Depth', 'Culmination', 'Aftermath'
];

const ARCHITECTURE = [
  {
    title: 'Experience Layer',
    purpose: 'Manages the interactive frontend journey and scroll-based narrative reveals.',
    implementation: 'Framer Motion spring physics and intersection observers.',
    technical: 'Avoids layout thrashing by using pure CSS transforms and GPU-accelerated opacity changes.'
  },
  {
    title: 'Memory Layer',
    purpose: 'Persists user decisions to create a genuine one-time experience.',
    implementation: 'Custom React hooks interfacing with window.localStorage.',
    technical: 'Tracks visitor state (first-time vs returning) to dynamically alter the starting point and ending availability.'
  },
  {
    title: 'Audio Layer',
    purpose: 'Drives emotional immersion through synchronized ambient soundscapes.',
    implementation: 'HTML5 Web Audio API wrapped in a global context provider.',
    technical: 'Seamless cross-fading between tracks based on scroll depth and narrative phase transitions.'
  },
  {
    title: 'Atmosphere Layer',
    purpose: 'Creates the tangible environment (rain, fog, particle drift).',
    implementation: 'Canvas API and complex CSS radial gradients.',
    technical: 'Cursor-reactive lighting mapped via useMotionValue to ensure 60fps performance without React re-renders.'
  },
  {
    title: 'Interaction Layer',
    purpose: 'Handles deliberate pacing and hidden puzzle mechanics.',
    implementation: 'Debounced event listeners and time-based state triggers.',
    technical: 'Ensures that reading speed and idle time influence the UI, rewarding patient observation.'
  }
];

export default function OneLastSmileCaseStudy() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const handleLaunchClick = () => {
    setShowMessage(true);
    // Smooth scroll to bottom so they see the full message if they clicked the top button
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040406',
      color: '#fff',
      paddingBottom: '120px',
      overflowX: 'hidden'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '50vh',
        background: 'radial-gradient(ellipse at top, rgba(0,247,255,0.03) 0%, transparent 80%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Navigation */}
      <nav style={{
        padding: '32px 40px',
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '2px',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.3s'
          }}
          onMouseOver={e => e.target.style.color = '#fff'}
          onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
        >
          ← Back to Portfolio
        </button>
        {showMessage ? (
          <div style={{ fontSize: '0.7rem', color: 'rgba(225,48,108,0.9)', fontStyle: 'italic', letterSpacing: '1px' }}>
            Wait for the countdown.
          </div>
        ) : (
          <button 
            onClick={handleLaunchClick}
            className="btn-neon-outline"
            style={{ padding: '8px 20px', fontSize: '0.65rem' }}
          >
            Launch Experience
          </button>
        )}
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        
        {/* HERO SECTION */}
        <motion.section 
          initial="hidden" animate="visible" variants={fadeUp}
          style={{ paddingTop: '80px', paddingBottom: '60px', textAlign: 'center' }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'rgba(0,247,255,0.8)', letterSpacing: '4px',
            textTransform: 'uppercase', marginBottom: '24px'
          }}>
            Premium Case Study
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 300, letterSpacing: '-1.5px',
            lineHeight: 1.1, marginBottom: '32px',
            textShadow: '0 0 40px rgba(0,247,255,0.15)'
          }}>
            OneLastSmile
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6, fontWeight: 300, maxWidth: '700px', margin: '0 auto 60px'
          }}>
            An immersive digital experience exploring memory, permanence, atmosphere, and human connection through interactive storytelling.
          </p>

          {/* Metadata Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px', borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '32px 0',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Role</div>
              <div style={{ fontSize: '0.9rem', color: '#fff' }}>Designer & Developer</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Stack</div>
              <div style={{ fontSize: '0.9rem', color: '#fff' }}>React, Framer Motion, Canvas</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Category</div>
              <div style={{ fontSize: '0.9rem', color: '#fff' }}>Interactive Storytelling</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Duration</div>
              <div style={{ fontSize: '0.9rem', color: '#fff' }}>Winter 2021</div>
            </div>
          </div>
        </motion.section>

        {/* FEATURED METRICS STRIP */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          style={{ marginBottom: '120px' }}
        >
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            {METRICS.map((m, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '12px', padding: '24px', textAlign: 'center'
              }}>
                <div style={{ color: 'rgba(225,48,108,0.9)', fontSize: '1.4rem', fontWeight: 300, marginBottom: '8px' }}>{m.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* EXPERIENCE FLOW TIMELINE */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          style={{ marginBottom: '140px' }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '40px', letterSpacing: '-0.5px' }}>Experience Flow</h2>
          <div style={{
            position: 'relative', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '40px 0', overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
            
            {TIMELINE.map((phase, i) => (
              <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%', background: '#040406',
                  border: `2px solid ${i === TIMELINE.length - 1 ? 'rgba(225,48,108,0.8)' : 'rgba(0,247,255,0.5)'}`,
                  marginBottom: '16px', boxShadow: `0 0 15px ${i === TIMELINE.length - 1 ? 'rgba(225,48,108,0.3)' : 'rgba(0,247,255,0.1)'}`
                }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {phase}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* SYSTEMS BEHIND THE EXPERIENCE */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          style={{ marginBottom: '140px' }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '40px', letterSpacing: '-0.5px' }}>Systems Behind The Experience</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {ARCHITECTURE.map((card, i) => (
              <div key={i} style={{
                background: 'rgba(20,20,20,0.3)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 400, color: '#fff', margin: 0 }}>{card.title}</h3>
                
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(225,48,108,0.7)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Purpose</div>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{card.purpose}</p>
                </div>
                
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(0,247,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Implementation</div>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{card.implementation}</p>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Technical Decisions</div>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{card.technical}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CHALLENGES & IMPACT GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          {/* CHALLENGES SOLVED */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '32px', letterSpacing: '-0.5px' }}>Challenges Solved</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Maintaining emotional pacing through deliberate UI friction.',
                'Building deep state persistence entirely client-side without backend services.',
                'Engineering one-time experience mechanics that resist simple page refreshes.',
                'Balancing intense atmospheric animations (blur, grain, particles) with strict 60fps performance budgets.',
                'Designing complex narrative-driven interactions that feel natural on mobile devices.',
              ].map((challenge, i) => (
                <li key={i} style={{
                  position: 'relative', paddingLeft: '24px', fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.7)', lineHeight: 1.6
                }}>
                  <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(225,48,108,0.5)' }} />
                  {challenge}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* PROJECT IMPACT */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '32px', letterSpacing: '-0.5px' }}>What This Taught Me</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Narrative Architecture requires treating state changes as emotional beats.',
                'Emotional UX is often about what you don\'t show—utilizing whitespace and silence.',
                'Frontend Performance isn\'t just about load times; it\'s about the perceived weight of interactions.',
                'Interactive Storytelling breaks when the user feels like they are using software instead of inhabiting a world.',
                'Human-Centered Design means respecting the user\'s time and attention above flashy technical gimmicks.',
              ].map((impact, i) => (
                <li key={i} style={{
                  position: 'relative', paddingLeft: '24px', fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.7)', lineHeight: 1.6
                }}>
                  <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(0,247,255,0.5)' }} />
                  {impact}
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        {/* BOTTOM CTA */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
          style={{ marginTop: '120px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '60px' }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '24px', color: '#fff' }}>Experience the Architecture</h2>
          {showMessage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(225,48,108,0.05)', border: '1px solid rgba(225,48,108,0.2)',
                borderRadius: '16px', padding: '32px', maxWidth: '600px', margin: '0 auto',
                backdropFilter: 'blur(10px)'
              }}
            >
              <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
                Why the rush? Some stories require patience.<br/><br/>
                When the countdown finally ends, the doors will open—revealing my greatest effort, my deepest emotions, and the most beautiful creation I have ever built for the one I love.
              </p>
            </motion.div>
          ) : (
            <button 
              onClick={handleLaunchClick}
              className="btn-neon-glow"
              style={{ padding: '16px 40px', fontSize: '0.8rem' }}
            >
              Enter OneLastSmile
            </button>
          )}
        </motion.div>

      </main>
    </div>
  );
}
