import { useState } from 'react';
import { Sparkles, Activity, ArrowUpRight, Cpu, CheckCircle2 } from 'lucide-react';

export default function FeaturedSpotlight() {
  const [selectedProject, setSelectedProject] = useState('onelastsmile'); // Default set to OneLastSmile to highlight it immediately!
  const [activeTab, setActiveTab] = useState('overview');

  const projectStats = selectedProject === 'onelastsmile' ? [
    { label: "Interactive Framerate", value: "60 FPS locked", color: "var(--accent-primary)" },
    { label: "Secrets Encryption", value: "AES-256 / JWT", color: "var(--accent-violet)" },
    { label: "Audio Stream", value: "320kbps Granular", color: "var(--accent-cyber)" },
    { label: "Relay Protocol", value: "Secure SMTP/TLS", color: "#22c55e" }
  ] : [
    { label: "Core Architecture", value: "React + Vite", color: "var(--accent-cyber)" },
    { label: "Render Engine", value: "60 FPS GPU", color: "var(--accent-violet)" },
    { label: "Assets Base Link", value: "Relative './'", color: "var(--accent-primary)" },
    { label: "Bundle Weight", value: "<270KB Gzip", color: "#22c55e" }
  ];

  return (
    <div className="glass-panel" style={{
      marginTop: '40px',
      padding: '40px',
      background: 'linear-gradient(135deg, rgba(18, 18, 32, 0.65) 0%, rgba(8, 8, 12, 0.85) 100%)',
      border: '1px solid rgba(225, 48, 108, 0.15)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(225, 48, 108, 0.03)',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic gradient mesh background */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '350px',
        height: '350px',
        background: 'var(--insta-gradient)',
        filter: 'blur(150px)',
        opacity: 0.15,
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Top Project Selector - High-end visual toggle */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        marginBottom: '35px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'onelastsmile', label: 'OneLastSmile Memorial', icon: '❤️', activeColor: 'var(--accent-primary)', accentBorder: 'rgba(225, 48, 108, 0.5)' },
          { id: 'myportfolio', label: 'My_PortFolio Repo', icon: '📁', activeColor: 'var(--accent-cyber)', accentBorder: 'rgba(0, 247, 255, 0.5)' }
        ].map(proj => (
          <button
            key={proj.id}
            onClick={() => {
              setSelectedProject(proj.id);
              setActiveTab('overview');
            }}
            style={{
              background: selectedProject === proj.id ? 'rgba(255,255,255,0.04)' : 'transparent',
              border: '1px solid',
              borderColor: selectedProject === proj.id ? proj.activeColor : 'rgba(255,255,255,0.05)',
              padding: '10px 24px',
              borderRadius: '50px',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: selectedProject === proj.id ? `0 0 15px ${proj.accentBorder}` : 'none',
              transition: 'all 0.3s var(--transition-smooth)'
            }}
          >
            <span>{proj.icon}</span>
            <span>{proj.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
        
        {/* Left Side: Mock Panel Container */}
        <div style={{
          background: '#09090f',
          borderRadius: '16px',
          border: '1px solid var(--border-glass)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          aspectRatio: '16/10',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {selectedProject === 'onelastsmile' ? (
            /* Custom Polaroid Memory Screen for OneLastSmile */
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, #140d24 0%, #06040d 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}>
              {/* Subtle ambient stars in backdrop */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(white 1px, transparent 0)',
                backgroundSize: '24px 24px',
                opacity: 0.15,
                pointerEvents: 'none'
              }} />

              {/* Glowing Heart Ring */}
              <div style={{
                position: 'absolute',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                border: '1px dashed rgba(225, 48, 108, 0.3)',
                animation: 'spin 20s linear infinite',
                pointerEvents: 'none'
              }} />

              {/* Polaroid Frame */}
              <div 
                className="polaroid-frame"
                style={{
                  width: '170px',
                  background: '#fff',
                  padding: '12px 12px 24px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.6), 0 0 20px rgba(225, 48, 108, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                }}>
                {/* Polaroid content space */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: 'linear-gradient(45deg, #E1306C 0%, #FF5E3A 100%)',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  fontSize: '2rem',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)'
                }}>
                  ❤️
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.75rem',
                  color: '#1a1a1a',
                  textAlign: 'center',
                  fontWeight: '800',
                  marginTop: '4px',
                  letterSpacing: '-0.3px'
                }}>
                  One Last Smile
                </div>
              </div>

              {/* Atmosphere overlay status */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.65rem',
                color: '#E1306C',
                fontWeight: 'bold',
                letterSpacing: '1px',
                fontFamily: 'var(--font-mono)'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E1306C', animation: 'ping 1.5s infinite' }} />
                AMBIENT_ATMOSPHERE_ACTIVE
              </div>
            </div>
          ) : (
            /* Custom Source Directory Console for My_PortFolio */
            <>
              {/* Directory Browser Header */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '50px',
                  padding: '4px 20px',
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                  width: '60%',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.03)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  https://github.com/Aethron-fr/My_PortFolio
                </div>
                <Activity size={12} style={{ color: 'var(--accent-cyber)' }} />
              </div>

              {/* Terminal Directory listing */}
              <div style={{
                flex: 1,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.73rem',
                color: 'var(--text-dim)',
                textAlign: 'left',
                lineHeight: '1.45',
                overflow: 'hidden'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyber)', marginBottom: '8px' }}>
                    <Cpu size={14} />
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>INDEXING_WORKSPACE_CORE</span>
                  </div>
                  
                  {/* File tree */}
                  <div style={{ color: '#fff', fontSize: '0.7rem' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>📁 src/</span><br />
                    &nbsp;&nbsp;<span style={{ color: 'var(--accent-violet)' }}>📁 components/</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;📄 CanvasBackground.jsx <span style={{ color: '#22c55e' }}>( constellations )</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;📄 CustomCursor.jsx <span style={{ color: '#eab308' }}>( click_physics )</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;📄 DeveloperJourney.jsx <span style={{ color: 'var(--accent-cyber)' }}>( timeline )</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;📄 FeaturedSpotlight.jsx <span style={{ color: 'var(--accent-primary)' }}>( spotlight_tabs )</span><br />
                    &nbsp;&nbsp;📄 App.jsx <span style={{ color: 'var(--accent-violet)' }}>( orchestrator )</span><br />
                    &nbsp;&nbsp;📄 index.css <span style={{ color: 'var(--text-dim)' }}>( tokens )</span><br />
                    📄 vite.config.js <span style={{ color: '#22c55e' }}>( base: './' )</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#22c55e' }}>
                  <span>● VITE_COMPILER_READY</span>
                  <span style={{ color: 'var(--text-dim)' }}>Asset check: Complete</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Detailed specs tab */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: selectedProject === 'onelastsmile' ? 'var(--accent-primary)' : 'var(--accent-cyber)', 
              marginBottom: '12px' 
            }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {selectedProject === 'onelastsmile' ? "CINEMATIC MASTERPIECE" : "SYSTEM ARCHITECTURE"}
              </span>
            </div>

            <h3 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              {selectedProject === 'onelastsmile' ? "OneLastSmile" : "My_PortFolio"}
            </h3>

            {/* Selector tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '20px' }}>
              {['overview', 'architecture', 'metrics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: activeTab === tab ? '#fff' : 'var(--text-dim)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    padding: '4px 12px',
                    position: 'relative',
                    transition: '0.3s'
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-13px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: selectedProject === 'onelastsmile' ? 'linear-gradient(90deg, #E1306C, #FF5E3A)' : 'linear-gradient(90deg, #00F7FF, #7000FF)',
                      borderRadius: '10px'
                    }} />
                  )}
                </button>
              ))}
            </div>

            {/* Tab contents */}
            {activeTab === 'overview' && (
              <div style={{ animation: 'fadeIn 0.4s' }}>
                {selectedProject === 'onelastsmile' ? (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                      **OneLastSmile** is an immersive digital memorial designed to capture and archive emotional memories, polaroid moments, and quiet secrets. Built with high-fidelity canvas loops, it preserves memory tracks dynamically.
                    </p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      It integrates custom constellation background threads, polaroid fragment containers, secure client input logs, and automated SMTP notifications that deliver private entries securely.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                      **My_PortFolio** is an elite, fully responsive Vite-based developer portal built on React, operating on a hardware-accelerated **60 FPS visual rendering loop**.
                    </p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      It integrates sleek CSS cyberpunk grid meshes, direct DOM-referenced scroll progress trackers, dynamic timeline toggle roadmaps, and an elastic custom cursor with click physics.
                    </p>
                  </>
                )}
              </div>
            )}

            {activeTab === 'architecture' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 0.4s' }}>
                {(selectedProject === 'onelastsmile' ? [
                  "Interactive HTML5 Canvas constellation space tracking cursor vectors.",
                  "Reactive Polaroid snapshot grids supporting dynamic touch matrices.",
                  "Secure client feedback middleware sanitizing input sequences.",
                  "SMTP server gateway routing private replies safely with TLS encryption."
                ] : [
                  "Vite build config with relative base path mappings for zero-jank serving.",
                  "Constellation visual particles rendering constellation structures dynamically.",
                  "Scroll Progress listener executing dynamically via direct DOM tracking references.",
                  "Chronological Milestone Roadmap built on responsive container toggles."
                ]).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <CheckCircle2 size={14} style={{ color: selectedProject === 'onelastsmile' ? 'var(--accent-primary)' : 'var(--accent-cyber)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', animation: 'fadeIn 0.4s' }}>
                {projectStats.map((stat, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{stat.label}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: stat.color, marginTop: '4px' }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <a 
              href={selectedProject === 'onelastsmile' ? "https://github.com/Aethron-fr/My_PortFolio" : "https://github.com/Aethron-fr/My_PortFolio"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-neon-glow" 
              style={{ 
                padding: '10px 24px', 
                fontSize: '0.85rem', 
                gap: '8px',
                background: selectedProject === 'onelastsmile' ? 'var(--insta-gradient)' : 'linear-gradient(90deg, #00F7FF 0%, #0088FF 100%)',
                boxShadow: selectedProject === 'onelastsmile' ? '0 0 15px rgba(225, 48, 108, 0.4)' : '0 0 15px rgba(0, 247, 255, 0.4)'
              }}
            >
              <i className="fa-brands fa-github" style={{ fontSize: '16px' }}></i>
              Inspect Codebase
            </a>
            <a 
              href={selectedProject === 'onelastsmile' ? "#" : "https://aethron-fr.github.io/My_PortFolio/"} 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon-outline" 
              style={{ 
                padding: '10px 24px', 
                fontSize: '0.85rem', 
                gap: '8px',
                borderColor: selectedProject === 'onelastsmile' ? '#E1306C' : '#00F7FF',
              }}
            >
              <span>Live Deployment</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
