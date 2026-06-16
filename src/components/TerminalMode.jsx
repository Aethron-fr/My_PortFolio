import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = {
  help: [
    "Available commands:",
    "  whoami       - View my profile and skills",
    "  projects     - List flagship projects",
    "  contact      - Get my email and social links",
    "  clear        - Clear terminal output",
    "  sudo         - Execute command as superuser",
    "  exit         - Close the terminal mode"
  ],
  whoami: [
    "Swapnadip Ghosh",
    "Role: Full Stack Developer",
    "Location: West Bengal, India",
    "Core Stack: React.js, Node.js, Python, TypeScript, Firebase"
  ],
  projects: [
    "1. My_PortFolio - React 19, Framer Motion, 3D Physics",
    "2. Ochi Clone - Awwwards winning agency site clone",
    "3. FullStack Amazon Clone - E-commerce platform",
    "4. E-learning Hub - Educational platform",
    "Use 'exit' to browse visually."
  ],
  contact: [
    "Email: ghoshswapnadip7@gmail.com",
    "LinkedIn: linkedin.com/in/swapnadip-ghosh",
    "GitHub: github.com/Aethron-fr",
    "X (Twitter): x.com/swapnadip_108"
  ]
};

export default function TerminalMode({ isOpen, onClose }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to Swapnadip OS v1.0.0' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    if (!cmd) return;

    const newHistory = [...history, { type: 'input', text: cmd }];

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (cmd === 'exit') {
      setInput('');
      onClose();
      return;
    }

    if (cmd.startsWith('sudo ')) {
      if (cmd === 'sudo hire swapnadip' || cmd === 'sudo hire') {
        newHistory.push({ type: 'output', text: 'Excellent choice. Initializing offer letter... [Access Granted]' });
      } else {
        newHistory.push({ type: 'output', text: `swapnadip is not in the sudoers file. This incident will be reported.` });
      }
    } else if (COMMANDS[cmd]) {
      COMMANDS[cmd].forEach(line => {
        newHistory.push({ type: 'output', text: line });
      });
    } else {
      newHistory.push({ type: 'output', text: `Command not found: ${cmd}` });
    }

    setHistory(newHistory);
    setInput('');
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
            backgroundColor: 'rgba(5, 5, 8, 0.95)',
            backdropFilter: 'blur(20px)',
            color: '#00ff41',
            fontFamily: '"Fira Code", "Courier New", monospace',
            padding: '2rem',
            overflowY: 'auto',
            fontSize: '1rem',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            {/* Window Controls (Cosmetic) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              <div onClick={onClose} style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f56', cursor: 'pointer' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#27c93f' }} />
            </div>

            {/* History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((entry, i) => (
                <div key={i} style={{ display: 'flex' }}>
                  {entry.type === 'input' && (
                    <span style={{ color: '#00ff41', marginRight: '12px' }}>guest@swapnadip:~$</span>
                  )}
                  <span style={{ color: entry.type === 'input' ? '#fff' : '#00ff41', whiteSpace: 'pre-wrap' }}>
                    {entry.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Line */}
            <form onSubmit={handleCommand} style={{ display: 'flex', marginTop: '8px' }}>
              <span style={{ color: '#00ff41', marginRight: '12px' }}>guest@swapnadip:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  flex: 1,
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                }}
                autoComplete="off"
                spellCheck="false"
                placeholder="Type 'help' to see commands..."
              />
            </form>
            <div ref={bottomRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
