// the puzzle is not a game.
// it is a memory.
// A.
// 🤍
// I used to hate the rain.
// winter, 2021.
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const PuzzleContext = createContext(null);
export const usePuzzle = () => useContext(PuzzleContext);

// 5 clues — each discovered through a different kind of attention
const CLUE_KEYS = [
  'puzzle_rain',    // click background 7 times (not buttons)
  'puzzle_hover',   // hover BeyondTheScreen rain panel 8+ seconds
  'puzzle_story',   // reach Chapter 3 of StoryMode
  'puzzle_night',   // visit site between midnight and 5AM
  'puzzle_idle',    // be idle 60s on /onelastsmile
];

const REQUIRED = 4; // need 4 of 5 — one is always forgiven

export function PuzzleProvider({ children }) {
  const [clues, setClues] = useState(() => {
    try { return JSON.parse(localStorage.getItem('_p_clues') || '{}'); }
    catch { return {}; }
  });
  const [solved, setSolved] = useState(() => localStorage.getItem('_p_solved') === '1');
  const [showReveal, setShowReveal] = useState(false);

  // Poll localStorage every 3s — catches clues set by other components
  useEffect(() => {
    const sync = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('_p_clues') || '{}');
        setClues(prev => {
          if (JSON.stringify(prev) === JSON.stringify(stored)) return prev;
          return stored;
        });
      } catch {}
    };
    const interval = setInterval(sync, 3000);
    window.addEventListener('storage', sync);
    return () => { clearInterval(interval); window.removeEventListener('storage', sync); };
  }, []);

  // Night clue — auto if visiting between midnight and 5AM
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 0 && h < 5) {
      try {
        const stored = JSON.parse(localStorage.getItem('_p_clues') || '{}');
        if (!stored['puzzle_night']) {
          stored['puzzle_night'] = Date.now();
          localStorage.setItem('_p_clues', JSON.stringify(stored));
          setClues(stored);
        }
      } catch {}
    }
  }, []);

  // Check for solve condition
  useEffect(() => {
    if (solved) return;
    const found = Object.keys(clues).filter(k => CLUE_KEYS.includes(k)).length;
    if (found >= REQUIRED) {
      const t = setTimeout(() => {
        setSolved(true);
        localStorage.setItem('_p_solved', '1');
        setShowReveal(true);
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [clues, solved]);

  const dismissReveal = useCallback(() => setShowReveal(false), []);

  return (
    <PuzzleContext.Provider value={{ clues, solved, showReveal, dismissReveal }}>
      {children}
    </PuzzleContext.Provider>
  );
}
