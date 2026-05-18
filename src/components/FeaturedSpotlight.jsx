import { useState } from 'react';
import { Sparkles, Terminal, Activity, ArrowUpRight, Cpu, Heart, CheckCircle2 } from 'lucide-react';

export default function FeaturedSpotlight() {
  const [activeTab, setActiveTab] = useState('overview');

  const projectStats = [
    { label: "Lighthouse Performance", value: "99%", color: "var(--accent-cyber)" },
    { label: "Security Encryption", value: "SSL / JWT", color: "var(--accent-violet)" },
    { label: "System Core", value: "React + Node", color: "var(--accent-primary)" },
    { label: "Docker Status", value: "Operational", color: "#22c55e" }
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
        {/* Left Side: Mock Browser Panel */}
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
          {/* Browser header */}
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
              https://portfoliomaker.swapnadip.dev
            </div>
            <Activity size={12} style={{ color: 'var(--accent-cyber)' }} />
          </div>

          {/* Browser Body Screen */}
          <div style={{
            flex: 1,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-heading)',
            position: 'relative'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyber)', marginBottom: '8px' }}>
                <Cpu size={14} />
                <span style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>COMPILING_MERN_CORE</span>
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', lineHeight: '1.2', marginBottom: '8px' }}>
                PortFolioMaker Engine
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', maxWidth: '90%' }}>
                An automated rendering platform to compile clean portfolios on Docker grids.
              </p>
            </div>

            {/* Dynamic Visual Code block inside browser body */}
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.02)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--accent-cyber)',
              textAlign: 'left'
            }}>
              <span style={{ color: 'var(--accent-violet)' }}>const</span> portfolio = <span style={{ color: 'var(--accent-secondary)' }}>new</span> MernArchitect({`{`}<br />
              &nbsp;&nbsp;owner: <span style={{ color: '#22c55e' }}>"Swapnadip Ghosh"</span>,<br />
              &nbsp;&nbsp;performance: <span style={{ color: '#fbbf24' }}>"60fps"</span>,<br />
              &nbsp;&nbsp;optimized: <span style={{ color: 'var(--accent-cyber)' }}>true</span><br />
              {`})`};
            </div>

            {/* Live active connection ping */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontWeight: 'bold' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'ping 1.5s infinite' }} />
                EDGE_CLUSTER_SECURED
              </span>
              <span style={{ color: 'var(--text-dim)' }}>
                Response time: 14ms
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed specs tab */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '12px' }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                PROJECT SPOTLIGHT
              </span>
            </div>

            <h3 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              PortFolioMaker
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
                      background: 'var(--insta-gradient)',
                      borderRadius: '10px'
                    }} />
                  )}
                </button>
              ))}
            </div>

            {/* Tab contents */}
            {activeTab === 'overview' && (
              <div style={{ animation: 'fadeIn 0.4s' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                  **PortFolioMaker** is a premier cloud developer system engineered to compile, pack, and deploy production-ready full-stack developer profiles in containers automatically. 
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  It solves layout jank by bundling optimized CSS grids, custom 2D visual loops, and dynamic GitHub integrations, packaging them in under 20KB for high-performance indexing.
                </p>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 0.4s' }}>
                {[
                  "React Context global state pipeline for visual components management.",
                  "Express routing controllers validating inputs and parsing schema files.",
                  "MongoDB document collection clusters archiving project coordinates.",
                  "Docker containers spinning container nodes dynamically."
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--accent-cyber)', flexShrink: 0 }} />
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
            <a href="https://github.com/ghoshswapnadip7-coder/PortFolioMaker" target="_blank" rel="noopener noreferrer" className="btn-neon-glow" style={{ padding: '10px 24px', fontSize: '0.85rem', gap: '8px' }}>
              <i className="fa-brands fa-github" style={{ fontSize: '16px' }}></i>
              Inspect Codebase
            </a>
            <a href="#" className="btn-neon-outline" style={{ padding: '10px 24px', fontSize: '0.85rem', gap: '8px' }}>
              <span>Live Deployment</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
