import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = {
  help: [
    { text: "Swapnadip OS CLI - v2.0.0 (Professional Edition)", color: "var(--accent-primary)" },
    { text: "Available commands:", color: "var(--text-dim)" },
    { text: "  whoami       - View my profile and summary", color: "var(--text-primary)" },
    { text: "  skills       - View technical stack and proficiencies", color: "var(--text-primary)" },
    { text: "  experience   - View professional timeline", color: "var(--text-primary)" },
    { text: "  projects     - List flagship projects", color: "var(--text-primary)" },
    { text: "  resume       - View resume link", color: "var(--text-primary)" },
    { text: "  contact      - Get email and social links", color: "var(--text-primary)" },
    { text: "  clear        - Clear terminal output", color: "var(--text-primary)" },
    { text: "  exit         - Close the terminal mode", color: "var(--text-primary)" }
  ],
  whoami: [
    { text: "{", color: "var(--text-dim)" },
    { text: '  "name": "Swapnadip Ghosh",', color: "var(--text-primary)" },
    { text: '  "role": "Full Stack Developer",', color: "var(--text-primary)" },
    { text: '  "location": "West Bengal, India",', color: "var(--text-primary)" },
    { text: '  "bio": "Engineering digital masterpieces with React, Node, and modern UI/UX principles."', color: "var(--accent-cyber)" },
    { text: "}", color: "var(--text-dim)" }
  ],
  skills: [
    { text: "[Frontend]", color: "var(--accent-primary)" },
    { text: "  React.js, Next.js, Framer Motion, HTML5, CSS3/Tailwind", color: "var(--text-primary)" },
    { text: "[Backend]", color: "var(--accent-violet)" },
    { text: "  Node.js, Express, Python, Django, REST APIs", color: "var(--text-primary)" },
    { text: "[Database & Cloud]", color: "var(--accent-cyber)" },
    { text: "  MongoDB, PostgreSQL, Firebase, Docker", color: "var(--text-primary)" }
  ],
  experience: [
    { text: "2024 - Present | Open Source Contributor & Freelancer", color: "var(--accent-primary)" },
    { text: "  - Architecting high-performance web applications", color: "var(--text-dim)" },
    { text: "  - Maintaining actively used GitHub repositories", color: "var(--text-dim)" },
    { text: "2023 - 2024    | Full Stack Learner & Builder", color: "var(--accent-primary)" },
    { text: "  - Mastered modern React and backend integrations", color: "var(--text-dim)" }
  ],
  projects: [
    { text: "1. Portfolio v2.0", color: "var(--accent-primary)" },
    { text: "   Stack: React 19, Framer Motion, Vite", color: "var(--text-dim)" },
    { text: "2. Ochi Clone", color: "var(--accent-primary)" },
    { text: "   Stack: React, GSAP, Tailwind (Awwwards winning clone)", color: "var(--text-dim)" },
    { text: "3. FullStack Amazon Clone", color: "var(--accent-primary)" },
    { text: "   Stack: React, Node.js, Express, MongoDB, Stripe", color: "var(--text-dim)" },
    { text: "4. E-learning Hub", color: "var(--accent-primary)" },
    { text: "   Stack: React, Firebase, Context API", color: "var(--text-dim)" }
  ],
  resume: [
    { text: "Accessing Resume...", color: "var(--text-dim)" },
    { text: "Link: https://www.linkedin.com/in/swapnadip-ghosh/", color: "var(--accent-cyber)" },
    { text: "Status: Available for hire.", color: "var(--accent-primary)" }
  ],
  contact: [
    { text: "Email    -> ghoshswapnadip7@gmail.com", color: "var(--text-primary)" },
    { text: "LinkedIn -> linkedin.com/in/swapnadip-ghosh", color: "var(--text-primary)" },
    { text: "GitHub   -> github.com/Aethron-fr", color: "var(--text-primary)" },
    { text: "X        -> x.com/swapnadip_108", color: "var(--text-primary)" }
  ]
};

const TypewriterLine = ({ line, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const speed = 15; // fast typing speed for professional feel
    const interval = setInterval(() => {
      setDisplayedText(line.text.slice(0, i + 1));
      i++;
      if (i >= line.text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [line.text, onComplete]);

  return <span style={{ color: line.color, whiteSpace: 'pre-wrap' }}>{displayedText}</span>;
};

export default function TerminalMode({ isOpen, onClose }) {
  const [history, setHistory] = useState([
    { type: 'input', text: 'init' },
    { type: 'output', lines: COMMANDS.help }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping, input]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (isTyping) return; // Prevent input while terminal is printing
    const cmd = input.trim().toLowerCase();
    
    if (!cmd) return;

    const newHistory = [...history, { type: 'input', text: cmd }];
    setInput('');

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'exit') {
      onClose();
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
            background: 'rgba(0,0,0,0.5)',
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
              <span style={{ marginLeft: '12px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>swapnadip@dev-env:~</span>
            </div>

            {/* History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {history.map((entry, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  {entry.type === 'input' && entry.text !== 'init' && (
                    <div style={{ display: 'flex' }}>
                      <span style={{ color: 'var(--accent-primary)', marginRight: '12px' }}>~ ❯</span>
                      <span style={{ color: '#fff' }}>{entry.text}</span>
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

            {/* Input Line */}
            <form onSubmit={handleCommand} style={{ display: 'flex', marginTop: '4px' }}>
              <span style={{ color: 'var(--accent-primary)', marginRight: '12px' }}>~ ❯</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
            <div ref={bottomRef} style={{ height: '20px' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
