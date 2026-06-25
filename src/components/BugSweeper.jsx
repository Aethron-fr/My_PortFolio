import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 12;
const NUM_BUGS = 15;

const generateEmptyGrid = () => {
  return Array(GRID_SIZE).fill(null).map(() => 
    Array(GRID_SIZE).fill(null).map(() => ({
      isBug: false,
      isRevealed: false,
      isFlagged: false,
      neighborBugs: 0,
      exploded: false,
    }))
  );
};

export default function BugSweeper({ onExit }) {
  const [grid, setGrid] = useState(generateEmptyGrid);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'won', 'lost'
  const [flagsRemaining, setFlagsRemaining] = useState(NUM_BUGS);
  const [time, setTime] = useState(0);

  // Initialize Board
  const initializeBoard = useCallback((firstClickRow, firstClickCol) => {
    let newGrid = generateEmptyGrid();
    let bugsPlaced = 0;

    // Place bugs randomly but avoid the first clicked cell and its immediate neighbors
    while (bugsPlaced < NUM_BUGS) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      
      const isSafeZone = Math.abs(r - firstClickRow) <= 1 && Math.abs(c - firstClickCol) <= 1;

      if (!newGrid[r][c].isBug && !isSafeZone) {
        newGrid[r][c].isBug = true;
        bugsPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c].isBug) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (r + dr >= 0 && r + dr < GRID_SIZE && c + dc >= 0 && c + dc < GRID_SIZE) {
                if (newGrid[r + dr][c + dc].isBug) count++;
              }
            }
          }
          newGrid[r][c].neighborBugs = count;
        }
      }
    }

    return newGrid;
  }, []);

  // Timer
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Restart logic
  const handleRestart = () => {
    setGrid(generateEmptyGrid());
    setGameState('start');
    setFlagsRemaining(NUM_BUGS);
    setTime(0);
  };

  const revealCell = (r, c) => {
    if (gameState === 'won' || gameState === 'lost' || grid[r][c].isRevealed || grid[r][c].isFlagged) {
      return;
    }

    let currentGrid = grid;
    if (gameState === 'start') {
      currentGrid = initializeBoard(r, c);
      setGameState('playing');
    }

    const newGrid = [...currentGrid.map(row => [...row])];

    if (newGrid[r][c].isBug) {
      // Game Over
      newGrid[r][c].exploded = true;
      newGrid[r][c].isRevealed = true;
      // Reveal all bugs
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newGrid[i][j].isBug) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
      setGrid(newGrid);
      setGameState('lost');
      return;
    }

    // Flood fill to reveal adjacent empty cells
    const floodFill = (row, col) => {
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) {
        return;
      }
      
      newGrid[row][col].isRevealed = true;
      
      if (newGrid[row][col].neighborBugs === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            floodFill(row + dr, col + dc);
          }
        }
      }
    };

    floodFill(r, c);
    setGrid(newGrid);

    // Check Win
    let unrevealedSafeCells = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!newGrid[i][j].isBug && !newGrid[i][j].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      setGameState('won');
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost' || grid[r][c].isRevealed) return;

    // If game hasn't started, don't allow flagging yet
    if (gameState === 'start') return;

    const newGrid = [...grid];
    if (!newGrid[r][c].isFlagged && flagsRemaining > 0) {
      newGrid[r][c].isFlagged = true;
      setFlagsRemaining(prev => prev - 1);
    } else if (newGrid[r][c].isFlagged) {
      newGrid[r][c].isFlagged = false;
      setFlagsRemaining(prev => prev + 1);
    }
    setGrid(newGrid);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        onExit();
      }
      if (e.key === 'Enter' && (gameState === 'lost' || gameState === 'won')) {
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, onExit]);

  const getNumberColor = (num) => {
    const colors = [
      '', 
      '#00f7ff', // 1: cyan
      '#39d353', // 2: green
      '#fbbf24', // 3: yellow
      '#8f00ff', // 4: purple
      '#ff5f56', // 5: red
      '#00f7ff', 
      '#00f7ff', 
      '#00f7ff'
    ];
    return colors[num] || '#fff';
  };

  return (
    <div style={{
      width: '100%', height: '100%', 
      display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 7, 14, 0.95)',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Header Info */}
      <div style={{
        width: '100%', maxWidth: '350px',
        display: 'flex', justifyContent: 'space-between',
        marginBottom: '20px',
        padding: '10px 15px',
        background: 'rgba(0, 247, 255, 0.05)',
        border: '1px solid rgba(0, 247, 255, 0.2)',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#fbbf24' }}>FIXES:</span>
          <span style={{ color: '#fff', fontSize: '1.1rem' }}>{String(flagsRemaining).padStart(2, '0')}</span>
        </div>
        
        {gameState === 'playing' || gameState === 'start' ? (
          <div style={{ color: 'var(--text-muted)' }}>BUG SWEEPER</div>
        ) : gameState === 'lost' ? (
          <div style={{ color: '#ff5f56', fontWeight: 'bold' }}>SYSTEM CRASHED</div>
        ) : (
          <div style={{ color: '#39d353', fontWeight: 'bold' }}>CODE REFACTORED</div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#00f7ff' }}>TIME:</span>
          <span style={{ color: '#fff', fontSize: '1.1rem' }}>{String(time).padStart(3, '0')}</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gap: '2px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '2px',
        borderRadius: '6px',
        border: '1px solid rgba(0, 247, 255, 0.1)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
      }}>
        {grid.map((row, r) => 
          row.map((cell, c) => (
            <motion.div
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlag(e, r, c)}
              whileHover={{ scale: cell.isRevealed ? 1 : 1.1, zIndex: 1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '28px', height: '28px',
                background: cell.isRevealed
                  ? (cell.exploded ? 'rgba(255, 95, 86, 0.4)' : 'rgba(10, 15, 25, 0.8)')
                  : 'linear-gradient(135deg, rgba(0, 247, 255, 0.1), rgba(0, 247, 255, 0.02))',
                border: cell.isRevealed 
                  ? '1px solid rgba(0, 247, 255, 0.05)'
                  : '1px outset rgba(0, 247, 255, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: cell.isRevealed ? 'default' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: cell.isRevealed ? getNumberColor(cell.neighborBugs) : 'inherit',
                borderRadius: '2px',
                userSelect: 'none'
              }}
            >
              {cell.isRevealed && cell.isBug ? '🐛' : ''}
              {cell.isRevealed && !cell.isBug && cell.neighborBugs > 0 ? cell.neighborBugs : ''}
              {!cell.isRevealed && cell.isFlagged ? '🚩' : ''}
            </motion.div>
          ))
        )}
      </div>

      {/* Controls Footer */}
      <div style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <span style={{ color: '#00f7ff' }}>L-CLICK:</span> Reveal Code &nbsp;•&nbsp; <span style={{ color: '#fbbf24' }}>R-CLICK:</span> Mark Bug
        </div>
        <div>
          Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>ESC</kbd> to return to terminal
          {(gameState === 'lost' || gameState === 'won') && (
            <>&nbsp;•&nbsp;Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>ENTER</kbd> to restart</>
          )}
        </div>
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              background: 'rgba(5, 7, 14, 0.9)',
              border: `1px solid ${gameState === 'won' ? '#39d353' : '#ff5f56'}`,
              padding: '20px 40px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: `0 0 40px ${gameState === 'won' ? 'rgba(57, 211, 83, 0.2)' : 'rgba(255, 95, 86, 0.2)'}`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ fontSize: '1.8rem', color: gameState === 'won' ? '#39d353' : '#ff5f56', marginBottom: '10px' }}>
              {gameState === 'won' ? 'MISSION ACCOMPLISHED' : 'RUNTIME EXCEPTION'}
            </div>
            <div style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              {gameState === 'won' ? 'Zero bugs remaining in production.' : 'A critical bug slipped into production.'}
            </div>
            <button
              onClick={handleRestart}
              style={{
                background: 'transparent',
                border: `1px solid ${gameState === 'won' ? '#39d353' : '#ff5f56'}`,
                color: gameState === 'won' ? '#39d353' : '#ff5f56',
                padding: '8px 20px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = gameState === 'won' ? 'rgba(57, 211, 83, 0.1)' : 'rgba(255, 95, 86, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              RESTART
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
