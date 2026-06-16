import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_SEQUENCE = [
  { text: "Initializing Swapnadip OS kernel...", color: "#94a3b8", delay: 300 },
  { text: "Loading core modules [OK]", color: "#27c93f", delay: 500 },
  { text: "Mounting file systems [OK]", color: "#27c93f", delay: 200 },
  { text: "Establishing secure connection to mainframe...", color: "#94a3b8", delay: 800 },
  { text: "Connection established. Access granted.", color: "var(--accent-primary)", delay: 400 },
];

const COMMANDS = {
  help: [
    { text: "Swapnadip OS CLI - v2.0.0 (Professional Edition)", color: "var(--accent-primary)" },
    { text: "Available commands:", color: "#94a3b8" },
    { text: "  whoami       - View my profile and summary", color: "#e2e8f0" },
    { text: "  skills       - View technical stack and proficiencies", color: "#e2e8f0" },
    { text: "  experience   - View professional timeline", color: "#e2e8f0" },
    { text: "  projects     - List flagship projects", color: "#e2e8f0" },
    { text: "  resume       - View resume link", color: "#e2e8f0" },
    { text: "  contact      - Get email and social links", color: "#e2e8f0" },
    { text: "  clear        - Clear terminal output", color: "#e2e8f0" },
    { text: "  exit         - Close the terminal mode", color: "#e2e8f0" }
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
    { text: "2023 - 2024    | Full Stack Learner & Builder", color: "var(--accent-primary)" },
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
        if (onComplete) setTimeout(onComplete, 50); // slight pause after line finishes
      }
    }, speed);
    return () => clearInterval(interval);
  }, [line, onComplete]);

  return <span style={{ color: line.color, whiteSpace: 'pre-wrap' }}>{displayedText}</span>;
};

// Interactive progress bar for commands like 'resume'
const ProgressBar = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 200);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  const filledLength = Math.floor(progress / 5);
  const emptyLength = 20 - filledLength;
  const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);

  return <span style={{ color: "var(--accent-primary)" }}>[ {bar} ] {Math.min(progress, 100)}%</span>;
};

export default function TerminalMode({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [bootIndex, setBootIndex] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  
  // Command history for up/down arrows
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input
  useEffect(() => {
    if (isOpen && isBooted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isBooted]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping, input, bootIndex]);

  // Run boot sequence when opened
  useEffect(() => {
    if (isOpen && !isBooted) {
      if (bootIndex < BOOT_SEQUENCE.length) {
        // Handled by TypewriterLine onComplete
      } else {
        setTimeout(() => {
          setIsBooted(true);
          setIsTyping(false);
          setHistory([{ type: 'output', lines: COMMANDS.help }]);
        }, 500);
      }
    } else if (!isOpen) {
      // Reset when closed
      setIsBooted(false);
      setBootIndex(0);
      setHistory([]);
      setInput('');
      setHistoryIndex(-1);
    }
  }, [isOpen, bootIndex, isBooted]);

  const handleKeyDown = (e) => {
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
    
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    const newHistory = [...history, { type: 'input', text: input }];
    setInput('');

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'exit') {
      onClose();
      return;
    }

    if (cmd === 'resume') {
      setIsTyping(true);
      newHistory.push({ type: 'progress' });
      setHistory(newHistory);
      return;
    }

    if (COMMANDS[cmd]) {
      setIsTyping(true);
      newHistory.push({ type: 'output', lines: COMMANDS[cmd] });
    } else {
      newHistory.push({ type: 'output', lines: [{ text: `zsh: command not found: ${cmd}`, color: '#ff5f56' }] });
    }

    setHistory(newHistory);
  };

  const finishProgress = () => {
    setHistory(prev => {
      const updated = [...prev];
      updated.push({ type: 'output', lines: [
        { text: "Fetch Complete. Link:", color: "#94a3b8" },
        { text: "https://www.linkedin.com/in/swapnadip-ghosh/", color: "var(--accent-cyber)" }
      ]});
      return updated;
    });
    // typing is false now but the new output lines will start typing?
    // Actually we just set it false because the new lines will type and then set false again.
    // Wait, setting typing to true, the new lines will handle it.
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => inputRef.current?.focus()}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999999,
            backgroundColor: 'rgba(5, 5, 8, 0.85)',
            backdropFilter: 'blur(24px)',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            padding: '2rem',
            overflowY: 'auto',
            fontSize: '0.9rem',
          }}
        >
          <div style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            width: '100%',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            minHeight: '60vh',
            padding: '20px'
          }}>
            {/* Window Controls (MacOS Style) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56', cursor: 'pointer' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ marginLeft: '12px', color: '#94a3b8', fontSize: '0.75rem' }}>swapnadip@dev-env:~</span>
            </div>

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
                        <span style={{ color: 'var(--accent-primary)', marginRight: '12px' }}>~ ❯</span>
                        <span style={{ color: '#fff' }}>{entry.text}</span>
                      </div>
                    )}
                    {entry.type === 'progress' && (
                      <div style={{ paddingLeft: '24px', margin: '4px 0' }}>
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
                <span style={{ color: 'var(--accent-primary)', marginRight: '12px' }}>~ ❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
                    caretColor: 'var(--accent-primary)'
                  }}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder={isTyping ? "Processing..." : "Type 'help' to see commands..."}
                />
              </form>
            )}
            <div ref={bottomRef} style={{ height: '20px' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
