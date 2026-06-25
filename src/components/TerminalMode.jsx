import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhysicsSandbox from './PhysicsSandbox';
import MatrixRain from './MatrixRain';
import NeonSnakeGame from './NeonSnakeGame';
import { sfx } from '../utils/sfx';

const BOOT_SEQUENCE = [
  { text: "Initializing Swapnadip OS...", color: "#94a3b8", delay: 100 },
  { text: "Connection established. Access granted.", color: "var(--accent-primary)", delay: 150 },
];

const COMMANDS = {
  help: [
    { text: "╔═══════════════════════════════════════╗", color: "rgba(255,255,255,0.1)" },
    { text: "  Swapnadip OS  ·  CLI v3.0.0", color: "var(--accent-primary)" },
    { text: "╚═══════════════════════════════════════╝", color: "rgba(255,255,255,0.1)" },
    { text: "", color: "#94a3b8" },
    { text: "── INFO ─────────────────────────────────", color: "rgba(255,255,255,0.15)" },
    { text: "  whoami       View profile & summary", color: "#e2e8f0" },
    { text: "  skills       Technical stack", color: "#e2e8f0" },
    { text: "  experience   Professional timeline", color: "#e2e8f0" },
    { text: "  projects     Flagship projects", color: "#e2e8f0" },
    { text: "  contact      Email & socials", color: "#e2e8f0" },
    { text: "", color: "#94a3b8" },
    { text: "── ACTIONS ──────────────────────────────", color: "rgba(255,255,255,0.15)" },
    { text: "  resume       Open interactive resume", color: "var(--accent-cyber)" },
    { text: "  sendmail     Send me a message", color: "var(--accent-cyber)" },
    { text: "", color: "#94a3b8" },
    { text: "── EFFECTS ──────────────────────────────", color: "rgba(255,255,255,0.15)" },
    { text: "  matrix       Digital rain overlay", color: "#39d353" },
    { text: "  gravity      Physics engine", color: "#fbbf24" },
    { text: "  hack         Cinematic bypass payload", color: "#ff5f56" },
    { text: "  play         Neon Snake Arcade", color: "var(--accent-primary)" },
    { text: "  selfdestruct Terminate instance", color: "#ff5f56" },
    { text: "", color: "#94a3b8" },
    { text: "── THEMES ───────────────────────────────", color: "rgba(255,255,255,0.15)" },
    { text: "  theme hacker  Matrix green", color: "#39d353" },
    { text: "  theme cyber   Neon cyan", color: "#00f7ff" },
    { text: "  theme vapor   Synthwave pink", color: "#ff71ce" },
    { text: "  theme default Restore original", color: "var(--accent-violet)" },
    { text: "", color: "#94a3b8" },
    { text: "── SYSTEM ───────────────────────────────", color: "rgba(255,255,255,0.15)" },
    { text: "  reset / stable  Kill all effects & themes", color: "#94a3b8" },
    { text: "  clear           Clear output", color: "#e2e8f0" },
    { text: "  exit            Close terminal", color: "#e2e8f0" },
    { text: "", color: "#94a3b8" },
    { text: "  Tip: ↑ / ↓ arrow keys for command history", color: "rgba(255,255,255,0.25)" },
  ],
  whoami: [
    { text: "{", color: "#94a3b8" },
    { text: '  "name": "Swapnadip Ghosh",', color: "#e2e8f0" },
    { text: '  "role": "Full Stack Developer",', color: "#e2e8f0" },
    { text: '  "location": "West Bengal, India",', color: "#e2e8f0" },
    { text: '  "bio": "Engineering digital masterpieces with React, Node, and modern UI/UX principles."', color: "var(--accent-cyber)" },
    { text: "}", color: "#94a3b8" }
  ],
  skills: [
    { text: "[Frontend]", color: "var(--accent-primary)" },
    { text: "  React.js, Next.js, Framer Motion, HTML5, CSS3/Tailwind", color: "#e2e8f0" },
    { text: "[Backend]", color: "var(--accent-violet)" },
    { text: "  Node.js, Express, Python, Django, REST APIs", color: "#e2e8f0" },
    { text: "[Database & Cloud]", color: "var(--accent-cyber)" },
    { text: "  MongoDB, PostgreSQL, Firebase, Docker", color: "#e2e8f0" }
  ],
  experience: [
    { text: "2024 - Present | Open Source Contributor & Freelancer", color: "var(--accent-primary)" },
    { text: "  - Architecting high-performance web applications", color: "#94a3b8" },
    { text: "  - Maintaining actively used GitHub repositories", color: "#94a3b8" },
    { 
      text: "2023 - 2024    | Full Stack Learner & Builder", 
      color: "var(--accent-primary)" 
    },
    { text: "  - Mastered modern React and backend integrations", color: "#94a3b8" }
  ],
  projects: [
    { text: "1. Portfolio v2.0", color: "var(--accent-primary)" },
    { text: "   Stack: React 19, Framer Motion, Vite", color: "#94a3b8" },
    { text: "2. Ochi Clone", color: "var(--accent-primary)" },
    { text: "   Stack: React, GSAP, Tailwind (Awwwards winning clone)", color: "#94a3b8" },
    { text: "3. FullStack Amazon Clone", color: "var(--accent-primary)" },
    { text: "   Stack: React, Node.js, Express, MongoDB, Stripe", color: "#94a3b8" },
    { text: "4. E-learning Hub", color: "var(--accent-primary)" },
    { text: "   Stack: React, Firebase, Context API", color: "#94a3b8" }
  ],
  contact: [
    { text: "Email    -> ghoshswapnadip7@gmail.com", color: "#e2e8f0" },
    { text: "LinkedIn -> linkedin.com/in/swapnadip-ghosh", color: "#e2e8f0" },
    { text: "GitHub   -> github.com/Aethron-fr", color: "#e2e8f0" },
    { text: "X        -> x.com/swapnadip_108", color: "#e2e8f0" }
  ]
};

const THEMES = {
  hacker: '#39d353',
  cyber: '#00f7ff',
  vapor: '#ff71ce',
  default: 'var(--accent-primary)'
};

const TypewriterLine = ({ line, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const speed = line.delay ? line.delay / line.text.length : 15;
    const interval = setInterval(() => {
      setDisplayedText(line.text.slice(0, i + 1));
      i++;
      if (i >= line.text.length) {
        clearInterval(interval);
        if (onComplete) setTimeout(onComplete, 50);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [line, onComplete]);

  return <span style={{ color: line.color, whiteSpace: 'pre-wrap', fontWeight: line.bold ? 'bold' : 'normal' }}>{displayedText}</span>;
};

const ProgressBar = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 100);
          return 100;
        }
        return p + Math.floor(Math.random() * 20) + 10;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  const filledLength = Math.floor(progress / 5);
  const emptyLength = 20 - filledLength;
  const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);

  return <span style={{ color: "inherit" }}>[ {bar} ] {Math.min(progress, 100)}%</span>;
};

export default function TerminalMode({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [bootIndex, setBootIndex] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const [isGravityActive, setIsGravityActive] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isSnakeMode, setIsSnakeMode] = useState(false);
  const [isSelfDestructing, setIsSelfDestructing] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState('var(--accent-primary)');
  
  const [commandHistory, setCommandHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('terminalCmdHistory') || '[]');
    } catch { return []; }
  });
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Email State Machine
  const [terminalState, setTerminalState] = useState('IDLE'); // IDLE, AWAITING_SUBJECT, AWAITING_MESSAGE
  const [, setMailDraft] = useState({ subject: '', message: '' });

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const scrollBodyRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (isOpen && isBooted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isBooted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping, input, bootIndex]);

  useEffect(() => {
    if (isOpen && !isBooted) {
      if (bootIndex >= BOOT_SEQUENCE.length) {
        setTimeout(() => {
          setIsBooted(true);
          setIsTyping(false);
          setHistory([{ type: 'output', lines: COMMANDS.help }]);
        }, 300);
      }
    } else if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsBooted(false);
      setBootIndex(0);
      setHistory([]);
      setInput('');
      setHistoryIndex(-1);
      setTerminalState('IDLE');
      setIsGravityActive(false);
      setIsMatrixActive(false);
      setIsSnakeMode(false);
      setIsSelfDestructing(false);
      setTerminalTheme('var(--accent-primary)');
    }
  }, [isOpen, bootIndex, isBooted]);

  const handleKeyDown = (e) => {
    // Don't interfere with snake game arrow keys
    if (isSnakeMode) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInput(commandHistory[commandHistory.length - 1 - prevIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleCommand = (e) => {
    e.preventDefault();
    if (isTyping || !isBooted) return;
    
    const cmd = input.trim();
    if (!cmd && terminalState === 'IDLE') return;

    if (terminalState === 'IDLE') {
      const updated = [...commandHistory, input];
      setCommandHistory(updated);
      // Persist to localStorage
      try { localStorage.setItem('terminalCmdHistory', JSON.stringify(updated.slice(-100))); } catch {}
      setHistoryIndex(-1);
    }
    
    const newHistory = [...history, { type: 'input', text: input, prefix: terminalState === 'IDLE' ? '~ ❯' : '>' }];
    setInput('');

    if (terminalState === 'AWAITING_SUBJECT') {
      setMailDraft(prev => ({ ...prev, subject: cmd }));
      newHistory.push({ type: 'output', lines: [{ text: "Enter message body:", color: "#94a3b8" }] });
      setHistory(newHistory);
      setTerminalState('AWAITING_MESSAGE');
      return;
    }

    if (terminalState === 'AWAITING_MESSAGE') {
      setMailDraft(prev => ({ ...prev, message: cmd }));
      setIsTyping(true);
      newHistory.push({ type: 'output', lines: [{ text: "Encrypting packet and establishing secure SMTP tunnel...", color: "var(--accent-cyber)" }] });
      newHistory.push({ type: 'progress', task: 'sendmail' });
      setHistory(newHistory);
      setTerminalState('IDLE');
      return;
    }

    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === 'clear') {
      setHistory([]);
      return;
    }

    if (lowerCmd === 'exit') {
      onClose();
      return;
    }

    if (lowerCmd === 'sendmail') {
      newHistory.push({ type: 'output', lines: [{ text: "Interactive Mail Protocol Initiated.", color: "var(--accent-primary)" }, { text: "Enter subject:", color: "#94a3b8" }] });
      setHistory(newHistory);
      setTerminalState('AWAITING_SUBJECT');
      return;
    }

    if (lowerCmd === 'resume') {
      setIsTyping(true);
      newHistory.push({ type: 'progress', task: 'resume' });
      setHistory(newHistory);
      return;
    }

    if (lowerCmd === 'gravity') {
      newHistory.push({ type: 'output', lines: [
        { text: "> WARNING: DOM STABILITY COMPROMISED", color: "#fbbf24" },
        { text: "> INITIATING MATTER.JS PHYSICS ENGINE...", color: "#fbbf24" },
        { text: "> GRAVITY ENABLED", color: "#39d353" }
      ]});
      setHistory(newHistory);
      setTimeout(() => setIsGravityActive(true), 800);
      return;
    }

    if (lowerCmd === 'stable' || lowerCmd === 'restore' || lowerCmd === 'reset' || lowerCmd === 'stop') {
      setIsGravityActive(false);
      setIsMatrixActive(false);
      setIsSnakeMode(false);
      setIsSelfDestructing(false);
      setTerminalTheme('var(--accent-primary)');
      // Remove all global theme classes from body
      document.body.classList.remove('theme-hacker', 'theme-cyber', 'theme-vapor');
      newHistory.push({ type: 'output', lines: [
        { text: "[OK] All effects terminated.", color: "#39d353" },
        { text: "[OK] Global theme restored to default.", color: "#39d353" },
      ]});
      setHistory(newHistory);
      return;
    }

    if (lowerCmd === 'sudo') {
      newHistory.push({ type: 'output', lines: [{ text: "Swapnadip is not in the sudoers file. This incident will be reported.", color: "#ff5f56" }] });
      setHistory(newHistory);
      return;
    }

    if (lowerCmd === 'matrix') {
      setIsMatrixActive(true);
      newHistory.push({ type: 'output', lines: [{ text: "Wake up, Neo...", color: "#39d353" }] });
      setHistory(newHistory);
      return;
    }

    if (lowerCmd === 'history') {
      const histLines = commandHistory.length === 0
        ? [{ text: 'No command history yet.', color: '#94a3b8' }]
        : [
            { text: Recalled +""+    if (lowerCmd === 'play') {"{commandHistory.length}"+""+ commands from memory:, color: 'var(--accent-primary)' },
            ...commandHistory.slice(-20).map((cmd, i) => ({
              text:   +""+    if (lowerCmd === 'play') {"{String(i+1).padStart(3,' ')} "+""+ +""+    if (lowerCmd === 'play') {"{cmd}"+"",
              color: '#e2e8f0'
            })),
            { text: '', color: '' },
            { text: "Tip: ?/? to navigate. Type 'clear-history' to wipe memory.", color: 'rgba(255,255,255,0.25)' },
          ];
      setIsTyping(true);
      newHistory.push({ type: 'output', lines: histLines });
      setHistory(newHistory);
      return;
    }
    if (lowerCmd === 'clear-history') {
      localStorage.removeItem('terminalCmdHistory');
      setCommandHistory([]);
      newHistory.push({ type: 'output', lines: [{ text: '[OK] Command history wiped.', color: '#39d353' }] });
      setHistory(newHistory);
      return;
    }
    if (lowerCmd === 'play') {
      setIsSnakeMode(true);
      newHistory.push({ type: 'output', lines: [{ text: "Initializing Neon Snake Arcade...", color: "var(--accent-primary)" }] });
      setHistory(newHistory);
      return;
    }

    if (lowerCmd === 'selfdestruct') {
      setIsTyping(true);
      setIsSelfDestructing(true);
      newHistory.push({ type: 'output', lines: [
        { text: "WARNING: SELF DESTRUCT SEQUENCE INITIATED", color: "#ff5f56", bold: true },
        { text: "T-MINUS 3 SECONDS...", color: "#ff5f56", delay: 800 }
      ]});
      setHistory(newHistory);
      setTimeout(() => {
        onClose();
      }, 3000);
      return;
    }

    if (lowerCmd === 'hack') {
      setIsTyping(true);
      newHistory.push({ type: 'progress', task: 'hack' });
      setHistory(newHistory);
      return;
    }

    if (lowerCmd.startsWith('theme ')) {
      const colorName = lowerCmd.split(' ')[1];
      if (THEMES[colorName]) {
        setTerminalTheme(THEMES[colorName]);
        // Apply to entire site
        document.body.classList.remove('theme-hacker', 'theme-cyber', 'theme-vapor');
        if (colorName !== 'default') {
          document.body.classList.add(`theme-${colorName}`);
        }
        newHistory.push({ type: 'output', lines: [
          { text: `[GLOBAL] Theme override applied: ${colorName.toUpperCase()}`, color: THEMES[colorName] },
          { text: `[INFO]  The entire site has been restyled.`, color: "#94a3b8" },
          { text: `[TIP]   Type 'reset' to restore default theme.`, color: "rgba(255,255,255,0.3)" },
        ]});
      } else {
        newHistory.push({ type: 'output', lines: [{ text: `Unknown theme. Available: hacker, cyber, vapor, default`, color: "#ff5f56" }] });
      }
      setHistory(newHistory);
      return;
    }

    if (COMMANDS[lowerCmd]) {
      setIsTyping(true);
      newHistory.push({ type: 'output', lines: COMMANDS[lowerCmd] });
    } else {
      newHistory.push({ type: 'output', lines: [{ text: `zsh: command not found: ${lowerCmd}`, color: '#ff5f56' }] });
    }

    setHistory(newHistory);
  };

  const finishProgress = () => {
    // Read from the current history state before updating
    const lastProgress = history.slice().reverse().find(entry => entry.type === 'progress');
    const isResume = lastProgress?.task === 'resume';

    setHistory(prev => {
      const updated = [...prev];
      if (lastProgress?.task === 'sendmail') {
        updated.push({ type: 'output', lines: [
          { text: "Message sent successfully.", color: "#27c93f" },
          { text: "Recipient: ghoshswapnadip7@gmail.com", color: "#94a3b8" }
        ]});
      } else if (lastProgress?.task === 'hack') {
        const fakeLogs = [];
        for(let i=0; i<8; i++) {
          fakeLogs.push({ text: `Bypassing proxy node [${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1.1]... SUCCESS`, color: "#94a3b8", delay: 10 });
        }
        fakeLogs.push({ text: "Payload delivered securely to remote server.", color: "#39d353", delay: 50 });
        fakeLogs.push({ text: "ACCESS GRANTED", color: "#39d353", bold: true, delay: 100 });
        updated.push({ type: 'output', lines: fakeLogs });
      } else {
        window.dispatchEvent(new Event('open-resume'));
        updated.push({ type: 'output', lines: [
          { text: "Interactive Resume Protocol Loaded.", color: "#27c93f" }
        ]});
      }
      return updated;
    });

    // Run side effects strictly outside of the state updater
    if (isResume) {
      setTimeout(onClose, 500);
    }
  };

  return (
    <>
      <PhysicsSandbox active={isGravityActive} onClose={() => setIsGravityActive(false)} />
      <MatrixRain active={isMatrixActive} />
      <AnimatePresence>
        {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999999,
            backgroundColor: 'rgba(5, 5, 8, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            drag
            dragMomentum={false}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => inputRef.current?.focus()}
            className={isSelfDestructing ? "terminal-self-destruct" : ""}
            style={{
              width: '100%',
              maxWidth: '900px',
              height: '70vh',
              background: 'rgba(10, 10, 15, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8), 0 0 30px rgba(0,247,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* CRT Scanline Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)',
              backgroundSize: '100% 4px',
              pointerEvents: 'none',
              zIndex: 10,
              opacity: 0.5
            }} />

            {/* Window Handle */}
            <div 
              className="terminal-handle"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px', 
                padding: '12px 20px', 
                background: 'rgba(255,255,255,0.025)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                cursor: 'grab',
                userSelect: 'none'
              }}
            >
              {/* Traffic lights */}
              <div 
                onClick={onClose}
                title="Close"
                style={{ width: 13, height: 13, borderRadius: '50%', background: '#ff5f57', cursor: 'pointer', flexShrink: 0,
                  boxShadow: '0 0 6px rgba(255,95,87,0.5)', transition: 'transform 0.15s', }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.15)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
              <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#febc2e', flexShrink: 0, boxShadow: '0 0 6px rgba(254,188,46,0.4)' }} />
              <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#28c840', flexShrink: 0, boxShadow: '0 0 6px rgba(40,200,64,0.4)' }} />

              {/* Title */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
                  swapnadip@dev-env:~
                </span>
                <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(0,247,255,0.08)', border: '1px solid rgba(0,247,255,0.15)', borderRadius: '4px', color: 'rgba(0,247,255,0.6)', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>
                  DRAGGABLE
                </span>
              </div>
              <div style={{ width: 13, height: 13 }} />{/* spacer for symmetry */}
            </div>

            {isSnakeMode && (
              <NeonSnakeGame onExit={() => setIsSnakeMode(false)} />
            )}

            {/* Terminal Body */}
            <div
              ref={scrollBodyRef}
              onWheel={(e) => {
                // Capture scroll inside terminal — don't let it bubble to the page
                e.stopPropagation();
                const el = scrollBodyRef.current;
                if (!el) return;
                el.scrollTop += e.deltaY;
                setShowScrollTop(el.scrollTop > 100);
              }}
              style={{
                padding: '20px',
                flex: 1,
                overflowY: 'auto',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '0.9rem',
                position: 'relative',
                zIndex: 5,
                scrollBehavior: 'smooth',
              }}
            >
              {/* Boot Sequence */}
              {!isBooted && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {BOOT_SEQUENCE.slice(0, bootIndex + 1).map((line, i) => (
                    <TypewriterLine 
                      key={i} 
                      line={line} 
                      onComplete={i === bootIndex ? () => setBootIndex(bootIndex + 1) : undefined}
                    />
                  ))}
                </div>
              )}

              {/* Terminal History */}
              {isBooted && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {history.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                      {entry.type === 'input' && (
                        <div style={{ display: 'flex' }}>
                          <span style={{ color: terminalTheme, marginRight: '12px' }}>{entry.prefix || '~ ❯'}</span>
                          <span style={{ color: '#fff' }}>{entry.text}</span>
                        </div>
                      )}
                      {entry.type === 'progress' && (
                        <div style={{ paddingLeft: '24px', margin: '4px 0', color: terminalTheme }}>
                          <ProgressBar onComplete={finishProgress} />
                        </div>
                      )}
                      {entry.type === 'output' && (
                        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '24px', margin: '4px 0 12px 0' }}>
                          {entry.lines.map((line, idx) => (
                            i === history.length - 1 ? (
                              <TypewriterLine 
                                key={idx} 
                                line={line} 
                                onComplete={idx === entry.lines.length - 1 ? () => setIsTyping(false) : undefined}
                              />
                            ) : (
                              <span key={idx} style={{ color: line.color, whiteSpace: 'pre-wrap' }}>{line.text}</span>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Input Line */}
              {isBooted && (
                <form onSubmit={handleCommand} style={{ display: 'flex', marginTop: '4px' }}>
                  <span style={{ color: terminalTheme, marginRight: '12px', transition: 'color 0.3s' }}>
                    {terminalState === 'IDLE' ? '~ ❯' : '>'}
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (!isTyping) sfx.playTerminalKeystroke();
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      outline: 'none',
                      flex: 1,
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      caretColor: terminalTheme,
                      transition: 'caret-color 0.3s'
                    }}
                    autoComplete="off"
                    spellCheck="false"
                    placeholder={
                      isTyping ? "" : 
                      terminalState === 'AWAITING_SUBJECT' ? "Type subject..." : 
                      terminalState === 'AWAITING_MESSAGE' ? "Type message..." : 
                      "Type 'help' to see commands..."
                    }
                  />
                </form>
              )}
              <div ref={bottomRef} style={{ height: '20px' }} />
            </div>

            {/* Scroll-to-Top button — appears when scrolled down */}
            {showScrollTop && (
              <button
                onClick={() => {
                  if (scrollBodyRef.current) {
                    scrollBodyRef.current.scrollTop = 0;
                    setShowScrollTop(false);
                  }
                }}
                title="Scroll to top"
                style={{
                  position: 'absolute',
                  bottom: '72px',
                  right: '16px',
                  zIndex: 20,
                  background: 'rgba(0,247,255,0.08)',
                  border: '1px solid rgba(0,247,255,0.25)',
                  borderRadius: '8px',
                  color: 'rgba(0,247,255,0.8)',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,247,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,247,255,0.08)'}
              >
                ↑ TOP
              </button>
            )}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
