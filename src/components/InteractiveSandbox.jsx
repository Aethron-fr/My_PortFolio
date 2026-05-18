import { useState, useRef, useEffect } from 'react';
import { Play, Terminal, Database, Server, Cpu, CheckCircle2, ChevronRight, CornerDownLeft } from 'lucide-react';

export default function InteractiveSandbox() {
  const [frontend, setFrontend] = useState('React');
  const [backend, setBackend] = useState('Node.js');
  const [database, setDatabase] = useState('MongoDB');
  const [logs, setLogs] = useState([
    'System ready.',
    'Enter terminal commands or use the visual designer above to deploy a virtual project.',
    'Try typing: "help" or "skills" in the command prompt below.'
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [deploymentStats, setDeploymentStats] = useState(null);
  
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (text, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        setLogs(prev => [...prev, text]);
      }, delay);
    } else {
      setLogs(prev => [...prev, text]);
    }
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    addLog(`swapnadip@portfolio:~$ ${inputVal}`);
    setInputVal('');

    switch(cmd) {
      case 'help':
        addLog('Available commands:');
        addLog('  about      - Display Swapnadip\'s background description');
        addLog('  skills     - View Swapnadip\'s expert tech stack');
        addLog('  clear      - Clear the console logs');
        addLog('  stats      - Get current system and FPS specs');
        addLog('  deploy     - Launch the visual stack defined above');
        break;
      case 'about':
        addLog('SWAPNADIP GHOSH - MERN Full Stack Architect from West Bengal, India.');
        addLog('Building cinematic web applications, responsive APIs, and microservice clouds.');
        break;
      case 'skills':
        addLog('CORE SKILLS MATCHED IN CORE PROCESSOR:');
        addLog('  - Languages: JavaScript, HTML5, CSS3, Python');
        addLog('  - Frameworks: React.js, Express, Node.js, Django, Flask');
        addLog('  - DevOps & Tools: Git, GitHub, Docker, RESTful APIs');
        break;
      case 'clear':
        setLogs([]);
        break;
      case 'stats':
        addLog('⚡ REAL-TIME PORTFOLIO DIAGNOSTICS:');
        addLog('  - Viewport Frame Rate: 60.0 FPS [CONSTANT]');
        addLog('  - Animation Acceleration: GPU Thread Enabled');
        addLog('  - Server Latency: 12ms');
        addLog('  - UX State: Extremely Reactive');
        break;
      case 'deploy':
        triggerCompilation();
        break;
      default:
        addLog(`Command not found: "${cmd}". Type "help" for a list of available signals.`);
    }
  };

  const triggerCompilation = () => {
    if (isCompiling) return;
    
    setIsCompiling(true);
    setCompileProgress(0);
    setDeploymentStats(null);
    setLogs(['[SYSTEM ALERT]: INITIALIZING CLOUD COMPILER SEQUENCE...']);
    
    const compilationSteps = [
      { text: `Step [1/5]: Spinning up virtual node instance for ${frontend}...`, delay: 600 },
      { text: `Step [2/5]: Mapping backend routing controllers using ${backend}...`, delay: 1400 },
      { text: `Step [3/5]: Testing secure connection tunnels to ${database} cluster...`, delay: 2200 },
      { text: `Step [4/5]: Minifying bundle streams and injecting 60fps CSS modules...`, delay: 3000 },
      { text: `Step [5/5]: Distributing package to global Edge CDN grids...`, delay: 3800 },
      { text: `[SUCCESS]: DEPLOYMENT OF "${frontend}-${backend}-${database}" COMPLETE! 🚀`, delay: 4500 }
    ];

    compilationSteps.forEach(step => {
      addLog(step.text, step.delay);
    });

    // Update progress bar
    const interval = setInterval(() => {
      setCompileProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 90);

    // Finalize stats
    setTimeout(() => {
      setIsCompiling(false);
      setDeploymentStats({
        name: `${frontend}-${backend}-${database} Core Engine`,
        latency: Math.floor(Math.random() * 8) + 6,
        fps: '60.0 FPS (GPU Locked)',
        weight: '14.2 KB (Compressed)',
        health: '100% (Operational)',
        url: `https://virtual-deploy.swapnadip.dev/${frontend.toLowerCase()}`
      });
    }, 4800);
  };

  return (
    <div className="glass-panel" style={{ padding: '30px', marginTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.8rem', background: 'var(--insta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
          Interactive Tech Stack Architect
        </h3>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
          Assemble Swapnadip's tech systems and compile them live. Run custom shell commands directly in the virtual environment.
        </p>
      </div>

      {/* Visual Design Tier selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Frontend Selector */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-cyber)' }}>
            <Cpu size={18} />
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>FRONTEND CORE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['React', 'Next.js', 'Vue.js'].map(tech => (
              <button
                key={tech}
                onClick={() => !isCompiling && setFrontend(tech)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: frontend === tech ? '1px solid var(--accent-cyber)' : '1px solid rgba(255,255,255,0.05)',
                  background: frontend === tech ? 'rgba(0, 247, 255, 0.08)' : 'transparent',
                  color: frontend === tech ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  transition: '0.2s',
                  textAlign: 'left'
                }}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Backend Selector */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-violet)' }}>
            <Server size={18} />
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>BACKEND ENGINE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Node.js', 'Django/Python', 'Flask'].map(tech => (
              <button
                key={tech}
                onClick={() => !isCompiling && setBackend(tech)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: backend === tech ? '1px solid var(--accent-violet)' : '1px solid rgba(255,255,255,0.05)',
                  background: backend === tech ? 'rgba(143, 0, 255, 0.08)' : 'transparent',
                  color: backend === tech ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  transition: '0.2s',
                  textAlign: 'left'
                }}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* DB Selector */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-secondary)' }}>
            <Database size={18} />
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>DATABASE CLUSTER</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['MongoDB', 'PostgreSQL', 'Redis'].map(tech => (
              <button
                key={tech}
                onClick={() => !isCompiling && setDatabase(tech)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: database === tech ? '1px solid var(--accent-secondary)' : '1px solid rgba(255,255,255,0.05)',
                  background: database === tech ? 'rgba(255, 94, 58, 0.08)' : 'transparent',
                  color: database === tech ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  transition: '0.2s',
                  textAlign: 'left'
                }}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deploy Actions & Compilation Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
        <button
          onClick={triggerCompilation}
          disabled={isCompiling}
          className="btn-neon-glow"
          style={{ width: '100%', maxWidth: '350px', gap: '8px' }}
        >
          <Play size={18} />
          {isCompiling ? 'COMPILING CLUSTER...' : 'DEPLOY INTERACTIVE BUILD'}
        </button>

        {isCompiling && (
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Compiling components...</span>
              <span>{compileProgress}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${compileProgress}%`,
                  background: 'var(--insta-gradient)',
                  transition: 'width 0.1s linear',
                  borderRadius: '50px'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Retro Console Terminal */}
      <div className="sandbox-terminal">
        <div className="terminal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={14} style={{ color: 'var(--accent-cyber)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', letterSpacing: '1px' }}>VIRTUAL_CONTAINER_SHELL.sh</span>
          </div>
          <div className="terminal-buttons">
            <span className="terminal-dot dot-red" />
            <span className="terminal-dot dot-yellow" />
            <span className="terminal-dot dot-green" />
          </div>
        </div>
        <div className="terminal-body">
          {logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: '6px',
                color: log.startsWith('swapnadip@portfolio') ? '#fff' : 
                       log.startsWith('[SUCCESS]') ? '#22c55e' : 
                       log.startsWith('[SYSTEM ALERT]') || log.startsWith('⚡') ? 'var(--accent-cyber)' : 'var(--text-muted)',
                lineHeight: '1.4'
              }}
            >
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
        <form onSubmit={handleCommandSubmit} style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
          <div className="terminal-prompt" style={{ display: 'flex', alignItems: 'center', paddingLeft: '16px', background: 'transparent' }} />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help' and press Enter..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              padding: '12px 6px',
            }}
          />
          <button type="submit" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', padding: '0 16px', cursor: 'pointer' }}>
            <CornerDownLeft size={16} />
          </button>
        </form>
      </div>

      {/* Deployment Statistics Showcase */}
      {deploymentStats && (
        <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', animation: 'fadeIn 0.5s ease-in-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', fontWeight: '700', marginBottom: '12px' }}>
            <CheckCircle2 size={20} />
            <span>CONTAINER CLOUD STATUS: ONLINE</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ACTIVE ENGINE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>{deploymentStats.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>RESPONSE LATENCY</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#22c55e' }}>{deploymentStats.latency}ms</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>RENDER SPEED</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-cyber)' }}>{deploymentStats.fps}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>BUNDLE COMPRESSION</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>{deploymentStats.weight}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
