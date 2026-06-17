import { useState } from 'react';
import StaggerText from './StaggerText';
import { BookOpen, Terminal, Rocket, Sparkles, Calendar, Award, Code2 } from 'lucide-react';

const JOURNEY_STEPS = [
  {
    year: "2023",
    title: "Foundations",
    subtitle: "West Bengal, India",
    icon: <BookOpen size={20} />,
    color: "var(--accent-cyber)",
    gradient: "linear-gradient(135deg, var(--accent-cyber) 0%, var(--accent-violet) 100%)",
    description: "Learning how logic structures work. Writing my first lines of Python and understanding the web.",
    details: [
      "Semantic HTML and CSS layouts.",
      "Basic CLI applications and control flow.",
      "Version control and repository management."
    ]
  },
  {
    year: "2024",
    title: "Architecture",
    subtitle: "Full Stack",
    icon: <Terminal size={20} />,
    color: "var(--accent-violet)",
    gradient: "linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-primary) 100%)",
    description: "Moving into server-side logic and database architecture. Building systems that communicate.",
    details: [
      "Node.js and Express REST APIs.",
      "MongoDB and Mongoose data modeling.",
      "Authentication and token management."
    ]
  },
  {
    year: "2025",
    title: "Interaction",
    subtitle: "MERN Stack",
    icon: <Code2 size={20} />,
    color: "var(--accent-primary)",
    gradient: "var(--insta-gradient)",
    description: "Focusing on the frontend experience. Managing complex states and fluid animations.",
    details: [
      "React Hooks, Context API, and modular architecture.",
      "Payment and email integrations.",
      "Canvas rendering and performance optimization."
    ]
  },
  {
    year: "2026",
    title: "Continuity",
    subtitle: "Deployment",
    icon: <Rocket size={20} />,
    color: "var(--accent-secondary)",
    gradient: "linear-gradient(135deg, var(--accent-secondary) 0%, #fbbf24 100%)",
    description: "Creating open-source tools and automating the deployment pipeline.",
    details: [
      "Building PortFolioMaker.",
      "Docker, CI/CD, and Edge deployments.",
      "Peer review and scalable architecture."
    ]
  }
];

export default function DeveloperJourney() {
  const [activeStep, setActiveStep] = useState(JOURNEY_STEPS.length - 1);

  return (
    <div style={{ position: 'relative', marginTop: '50px' }}>
      {/* Decorative ambient background highlight */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(0, 247, 255, 0.05)',
        filter: 'blur(100px)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Interactive Journey Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', position: 'relative', zIndex: 1 }}>
        {/* Navigation Step Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {JOURNEY_STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: isActive ? step.color : 'var(--border-glass)',
                  background: isActive ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-panel)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.4s var(--transition-smooth)',
                  boxShadow: isActive ? `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 15px ${step.color}25` : 'none'
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = 'var(--border-hover)';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = 'var(--border-glass)';
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: step.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  boxShadow: isActive ? `0 0 15px ${step.color}` : 'none',
                  transition: 'all 0.3s'
                }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={12} style={{ color: step.color }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: step.color }}>{step.year}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '400', marginTop: '2px' }}>{step.title}</h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Panel */}
        <div 
          className="glass-panel" 
          style={{
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `1px solid ${JOURNEY_STEPS[activeStep].color}30`,
            boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${JOURNEY_STEPS[activeStep].color}10`,
            background: 'var(--bg-card)',
            animation: 'fadeIn 0.5s var(--transition-smooth)',
            borderRadius: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                padding: '4px 12px',
                borderRadius: '50px',
                background: `${JOURNEY_STEPS[activeStep].color}12`,
                color: JOURNEY_STEPS[activeStep].color,
                border: `1px solid ${JOURNEY_STEPS[activeStep].color}25`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Award size={12} />
                MILESTONE ACTIVE
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                {JOURNEY_STEPS[activeStep].subtitle}
              </span>
            </div>

            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '14px', fontWeight: '300' }}>
              {JOURNEY_STEPS[activeStep].title}
            </h3>
            
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
              {JOURNEY_STEPS[activeStep].description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-dim)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                ENGINEERING CONTRIBUTIONS
              </div>
              {JOURNEY_STEPS[activeStep].details.map((detail, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Sparkles size={14} style={{ color: JOURNEY_STEPS[activeStep].color, marginTop: '4px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={12} />
              Chronology Tracker: Step {activeStep + 1} of {JOURNEY_STEPS.length}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {JOURNEY_STEPS.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: i === activeStep ? JOURNEY_STEPS[activeStep].color : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
