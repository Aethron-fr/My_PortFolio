import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PuzzleContext = createContext(null);
export const usePuzzle = () => useContext(PuzzleContext);

const REQUIRED_FRAGMENTS = 4;

// Audio for fragment discovery - tiny, fragile sound
function playDiscoverySound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // High, delicate frequency
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
    
    setTimeout(() => ctx.close().catch(() => {}), 2000);
  } catch {}
}

export function PuzzleProvider({ children }) {
  const [fragments, setFragments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('_p_fragments') || '[]'); }
    catch { return []; }
  });
  const [solved, setSolved] = useState(() => localStorage.getItem('_p_solved') === '1');
  const [showReveal, setShowReveal] = useState(false);

  // Sync state across tabs
  useEffect(() => {
    const sync = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('_p_fragments') || '[]');
        setFragments(prev => {
          if (JSON.stringify(prev) === JSON.stringify(stored)) return prev;
          return stored;
        });
      } catch (_) {}
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Check for solve condition
  useEffect(() => {
    if (solved) return;
    if (fragments.length >= REQUIRED_FRAGMENTS) {
      const t = setTimeout(() => {
        setSolved(true);
        localStorage.setItem('_p_solved', '1');
        setShowReveal(true);
      }, 1500); // Short delay after the last click
      return () => clearTimeout(t);
    }
  }, [fragments, solved]);

  const discoverFragment = useCallback((id) => {
    setFragments(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('_p_fragments', JSON.stringify(next));
      playDiscoverySound();
      return next;
    });
  }, []);

  const dismissReveal = useCallback(() => setShowReveal(false), []);
  const triggerReveal = useCallback(() => {
    setSolved(false); 
    setShowReveal(true);
  }, []);

  return (
    <PuzzleContext.Provider value={{ fragments, solved, showReveal, dismissReveal, triggerReveal, discoverFragment }}>
      {children}
    </PuzzleContext.Provider>
  );
}

// ─── The Memory Fragment Component ──────────────────────────────────────────
export function MemoryFragment({ id, text, style }) {
  const { fragments, discoverFragment } = usePuzzle();
  const isFound = fragments.includes(id);

  if (isFound) return null; // Disappears quietly once found

  return (
    <motion.div
      initial={{ opacity: 0.15 }}
      whileHover={{ opacity: 0.8, textShadow: '0 0 12px rgba(255,255,255,0.4)' }}
      onClick={() => discoverFragment(id)}
      style={{
        position: 'absolute',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '2px',
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        userSelect: 'none',
        zIndex: 50,
        transition: 'opacity 0.8s ease, text-shadow 0.8s ease',
        ...style
      }}
    >
      {text}
    </motion.div>
  );
}
