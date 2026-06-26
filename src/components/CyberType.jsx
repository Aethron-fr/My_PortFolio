import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = [
  'kubernetes', 'docker', 'middleware', 'async', 'await', 'promise', 'callback', 
  'microservices', 'graphql', 'rest', 'api', 'socket', 'websocket', 'cluster', 
  'loadbalancer', 'encryption', 'hash', 'salt', 'token', 'jwt', 'auth', 'node', 
  'express', 'react', 'redux', 'context', 'hook', 'effect', 'memo', 'ref', 
  'typescript', 'interface', 'type', 'enum', 'generic', 'compiler', 'build', 
  'webpack', 'vite', 'rollup', 'babel', 'lint', 'prettier', 'jest', 'cypress', 
  'selenium', 'playwright', 'git', 'commit', 'push', 'pull', 'merge', 'rebase', 
  'conflict', 'stash', 'branch', 'main', 'master', 'origin', 'upstream', 'fork', 
  'clone', 'fetch', 'status', 'log', 'diff', 'checkout', 'reset', 'revert', 
  'cherry-pick', 'tag', 'release', 'deploy', 'pipeline', 'ci', 'cd', 'jenkins', 
  'travis', 'circleci', 'github', 'actions', 'gitlab', 'bitbucket', 'aws', 'gcp', 
  'azure', 'lambda', 'serverless', 'function', 'app', 'service', 'database', 
  'sql', 'nosql', 'mongo', 'postgres', 'mysql', 'redis', 'memcached', 'cache'
];

export default function CyberType({ onExit }) {
  const canvasRef = useRef(null);
  
  // Game state stored in refs for 60fps loop without re-renders
  const gameState = useRef({
    words: [],      // { text, x, y, speed }
    activeWordIndex: -1, // index in words array that is currently being typed
    typedPrefix: '',     // what has been typed so far
    score: 0,
    lives: 5,
    isGameOver: false,
    hasStarted: false,
    lastSpawnTime: 0,
    spawnInterval: 2000,
    speedMultiplier: 1
  });

  // React state just for UI
  const [uiScore, setUiScore] = useState(0);
  const [uiLives, setUiLives] = useState(5);
  const [uiGameOver, setUiGameOver] = useState(false);
  const [uiStarted, setUiStarted] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const state = gameState.current;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Draw words
    ctx.font = 'bold 16px "Fira Code", monospace';
    ctx.textAlign = 'center';

    state.words.forEach((word, index) => {
      // If this is the active word, draw it differently
      if (index === state.activeWordIndex) {
        // Measure text for split coloring
        const typedWidth = ctx.measureText(state.typedPrefix).width;
        const untypedText = word.text.slice(state.typedPrefix.length);
        const fullWidth = ctx.measureText(word.text).width;
        
        const startX = word.x - (fullWidth / 2);
        
        // Draw typed part (green/cyan glow)
        ctx.fillStyle = '#00f7ff';
        ctx.shadowColor = '#00f7ff';
        ctx.shadowBlur = 10;
        ctx.textAlign = 'left';
        ctx.fillText(state.typedPrefix, startX, word.y);
        
        // Draw remaining part (white)
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 0;
        ctx.fillText(untypedText, startX + typedWidth, word.y);
      } else {
        // Inactive word
        ctx.fillStyle = state.activeWordIndex === -1 ? '#fbbf24' : '#475569';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.fillText(word.text, word.x, word.y);
      }
    });

    // Draw bottom defense line
    ctx.beginPath();
    ctx.moveTo(0, h - 30);
    ctx.lineTo(w, h - 30);
    ctx.strokeStyle = state.lives > 2 ? 'rgba(0, 247, 255, 0.4)' : 'rgba(255, 95, 86, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, []);

  const update = useCallback((time) => {
    const state = gameState.current;
    if (state.isGameOver || !state.hasStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const h = canvas.height;

    // Spawn new words
    if (time - state.lastSpawnTime > state.spawnInterval) {
      const text = WORDS[Math.floor(Math.random() * WORDS.length)];
      // Prevent overlapping text on X axis roughly
      const padding = 60;
      const x = padding + Math.random() * (canvas.width - padding * 2);
      
      state.words.push({
        text,
        x,
        y: -20,
        speed: (0.5 + Math.random() * 0.8) * state.speedMultiplier
      });
      state.lastSpawnTime = time;
      
      // Speed up over time
      state.spawnInterval = Math.max(600, state.spawnInterval - 20);
      state.speedMultiplier += 0.01;
    }

    // Move words and check collision with bottom
    let i = state.words.length;
    while (i--) {
      state.words[i].y += state.words[i].speed;
      
      if (state.words[i].y > h - 30) {
        // Word hit the bottom!
        state.lives -= 1;
        setUiLives(state.lives);
        
        // If it was the active word, reset typing
        if (i === state.activeWordIndex) {
          state.activeWordIndex = -1;
          state.typedPrefix = '';
        } else if (state.activeWordIndex > i) {
          state.activeWordIndex -= 1; // shift index because we are splicing before it
        }
        
        state.words.splice(i, 1);
        
        if (state.lives <= 0) {
          state.isGameOver = true;
          setUiGameOver(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    let animationFrameId;

    const loop = (time) => {
      // Calculate delta if needed, but here we just pass time
      update(time);
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [draw, update]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = gameState.current;
      
      if (e.key === 'Escape') {
        onExit();
        return;
      }
      
      if (e.key === 'Enter') {
        if (!state.hasStarted) {
          state.hasStarted = true;
          state.lastSpawnTime = performance.now();
          setUiStarted(true);
        } else if (state.isGameOver) {
          // Reset game
          state.words = [];
          state.activeWordIndex = -1;
          state.typedPrefix = '';
          state.score = 0;
          state.lives = 5;
          state.isGameOver = false;
          state.hasStarted = true;
          state.lastSpawnTime = performance.now();
          state.spawnInterval = 2000;
          state.speedMultiplier = 1;
          setUiScore(0);
          setUiLives(5);
          setUiGameOver(false);
        }
        return;
      }

      if (state.isGameOver || !state.hasStarted) return;
      
      if (e.key === 'Backspace' && state.activeWordIndex !== -1) {
        // Allow backspacing if they made a mistake (though in this game it's usually strict typing)
        state.typedPrefix = state.typedPrefix.slice(0, -1);
        if (state.typedPrefix.length === 0) {
          state.activeWordIndex = -1;
        }
        return;
      }

      // Ignore non-character keys (shift, ctrl, etc)
      if (e.key.length !== 1) return;

      const char = e.key.toLowerCase();

      // If we don't have an active word, try to find one that starts with this char
      if (state.activeWordIndex === -1) {
        // Find lowest word that starts with this char
        let targetIndex = -1;
        let maxY = -1;
        
        for (let i = 0; i < state.words.length; i++) {
          if (state.words[i].text[0] === char) {
            if (state.words[i].y > maxY) {
              maxY = state.words[i].y;
              targetIndex = i;
            }
          }
        }
        
        if (targetIndex !== -1) {
          state.activeWordIndex = targetIndex;
          state.typedPrefix = char;
          
          // Check if it was a 1-letter word (rare but possible)
          if (state.typedPrefix === state.words[targetIndex].text) {
             state.words.splice(targetIndex, 1);
             state.activeWordIndex = -1;
             state.typedPrefix = '';
             state.score += 10;
             setUiScore(state.score);
          }
        }
      } else {
        // We have an active word, check if next char matches
        const targetWord = state.words[state.activeWordIndex].text;
        const nextCharIndex = state.typedPrefix.length;
        
        if (targetWord[nextCharIndex] === char) {
          state.typedPrefix += char;
          
          if (state.typedPrefix === targetWord) {
             // Word fully typed!
             state.words.splice(state.activeWordIndex, 1);
             state.activeWordIndex = -1;
             state.typedPrefix = '';
             
             // Base score + bonus for longer words
             const points = 10 + (targetWord.length * 2);
             state.score += points;
             setUiScore(state.score);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Adjust canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%', 
      display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 7, 14, 0.95)',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Info */}
      <div style={{
        width: '100%', maxWidth: '600px',
        display: 'flex', justifyContent: 'space-between',
        marginBottom: '10px',
        padding: '10px 20px',
        background: 'rgba(0, 247, 255, 0.05)',
        border: '1px solid rgba(0, 247, 255, 0.2)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#00f7ff' }}>SCORE:</span>
          <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>{uiScore}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#ff5f56' }}>INTEGRITY:</span>
          <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {Array(5).fill(0).map((_, i) => (
              <span key={i} style={{ color: i < uiLives ? '#39d353' : '#475569', margin: '0 2px' }}>■</span>
            ))}
          </span>
        </div>
      </div>

      {/* Game Canvas */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '800px',
        background: 'rgba(1, 3, 9, 0.6)',
        border: '1px solid rgba(0, 247, 255, 0.1)',
        borderRadius: '8px',
        position: 'relative',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'
      }}>
        <canvas 
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
        
        {/* Overlays */}
        <AnimatePresence>
          {!uiStarted && !uiGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'rgba(1, 3, 9, 0.8)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <h2 style={{ color: '#00f7ff', letterSpacing: '4px', margin: '0 0 10px', textShadow: '0 0 10px rgba(0,247,255,0.5)' }}>CYBER DEFENSE</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Type words to destroy inbound payloads.</p>
              <div style={{ color: '#fbbf24', animation: 'pulse 2s infinite' }}>[ PRESS ENTER TO START ]</div>
            </motion.div>
          )}

          {uiGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255, 95, 86, 0.15)',
                border: '2px solid rgba(255, 95, 86, 0.5)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <h2 style={{ color: '#ff5f56', letterSpacing: '4px', margin: '0 0 10px', textShadow: '0 0 20px rgba(255,95,86,0.8)' }}>SERVER BREACHED</h2>
              <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '30px' }}>Final Score: <span style={{ color: '#00f7ff', fontWeight: 'bold' }}>{uiScore}</span></p>
              <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Press <span style={{ color: '#fff' }}>ENTER</span> to reboot</div>
              <div style={{ color: 'var(--text-muted)' }}>Press <span style={{ color: '#fff' }}>ESC</span> to exit</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Controls Footer */}
      <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>ESC</kbd> to return to terminal
      </div>
    </div>
  );
}
