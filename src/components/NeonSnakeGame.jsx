import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NeonSnakeGame({ onExit }) {
  const canvasRef = useRef(null);

  // React state ONLY for display — never causes the game loop to restart
  const [displayScore, setDisplayScore]     = useState(0);
  const [displayHighScore, setDisplayHighScore] = useState(
    () => parseInt(localStorage.getItem('neonSnakeHighScore')) || 0
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // ALL mutable game data lives in refs — immune to React re-renders
  const gameRef = useRef({
    snake:        [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }],
    velocity:     { x: 1, y: 0 },
    inputQueue:   [],
    apple:        { x: 15, y: 10 },
    particles:    [],
    score:        0,
    highScore:    parseInt(localStorage.getItem('neonSnakeHighScore')) || 0,
    speed:        110,
    lastTick:     0,
    applePhase:   0,
    dead:         false,
    started:      false,
    rafId:        null,
  });

  const resetGame = useCallback(() => {
    const g = gameRef.current;
    g.snake      = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
    g.velocity   = { x: 1, y: 0 };
    g.inputQueue = [];
    g.apple      = spawnApple(g.snake, 25, 20);
    g.particles  = [];
    g.score      = 0;
    g.speed      = 110;
    g.lastTick   = 0;
    g.applePhase = 0;
    g.dead       = false;
    g.started    = false;
    setDisplayScore(0);
    setIsGameOver(false);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pixelRatio = window.devicePixelRatio || 1;
    const cssWidth   = 500;
    const cssHeight  = 400;

    canvas.width        = cssWidth  * pixelRatio;
    canvas.height       = cssHeight * pixelRatio;
    canvas.style.width  = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);

    const TILE_X  = 25;
    const TILE_Y  = 20;
    const CELL    = cssWidth / TILE_X; // 20px

    const g = gameRef.current;

    // ── Keyboard handler ──────────────────────────────────────────
    const handleKeyDown = (e) => {
      if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.key === 'Escape') { onExit(); return; }

      // Restart on Enter when dead
      if (g.dead && e.key === 'Enter') {
        resetGame();
        return;
      }

      if (g.dead) return;

      const last = g.inputQueue.length > 0 ? g.inputQueue[g.inputQueue.length - 1] : g.velocity;

      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W':
          if (last.y !== 1)  { g.started = true; setGameStarted(true); g.inputQueue.push({ x: 0, y: -1 }); }
          break;
        case 'ArrowDown':  case 's': case 'S':
          if (last.y !== -1) { g.started = true; setGameStarted(true); g.inputQueue.push({ x: 0, y:  1 }); }
          break;
        case 'ArrowLeft':  case 'a': case 'A':
          if (last.x !== 1)  { g.started = true; setGameStarted(true); g.inputQueue.push({ x: -1, y: 0 }); }
          break;
        case 'ArrowRight': case 'd': case 'D':
          if (last.x !== -1) { g.started = true; setGameStarted(true); g.inputQueue.push({ x:  1, y: 0 }); }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });

    // ── Main render loop ──────────────────────────────────────────
    const render = (now) => {
      g.rafId = requestAnimationFrame(render);
      if (g.dead) return;

      g.applePhase += 0.1;

      // Particle updates
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x   += p.vx;
        p.y   += p.vy;
        p.life -= 0.04;
        if (p.life <= 0) g.particles.splice(i, 1);
      }

      // Game tick — only moves when started and when enough time has passed
      if (g.started && now - g.lastTick >= g.speed) {
        g.lastTick = now;

        if (g.inputQueue.length > 0) g.velocity = g.inputQueue.shift();

        let hx = g.snake[0].x + g.velocity.x;
        let hy = g.snake[0].y + g.velocity.y;

        // Wrap walls
        if (hx < 0)     hx = TILE_X - 1;
        if (hx >= TILE_X) hx = 0;
        if (hy < 0)     hy = TILE_Y - 1;
        if (hy >= TILE_Y) hy = 0;

        const newHead = { x: hx, y: hy };

        // Self collision
        if (g.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          g.dead = true;
          setIsGameOver(true);
          setDisplayScore(g.score); // ensure final score is shown
          return;
        }

        g.snake.unshift(newHead);

        // Apple eaten
        if (newHead.x === g.apple.x && newHead.y === g.apple.y) {
          g.score += 10;
          setDisplayScore(g.score);

          if (g.score > g.highScore) {
            g.highScore = g.score;
            setDisplayHighScore(g.score);
            localStorage.setItem('neonSnakeHighScore', String(g.score));
          }

          g.speed = Math.max(50, g.speed - 2);

          // Particles
          for (let i = 0; i < 18; i++) {
            g.particles.push({
              x:    g.apple.x * CELL + CELL / 2,
              y:    g.apple.y * CELL + CELL / 2,
              vx:   (Math.random() - 0.5) * 7,
              vy:   (Math.random() - 0.5) * 7,
              life: 1,
            });
          }

          g.apple = spawnApple(g.snake, TILE_X, TILE_Y);
        } else {
          g.snake.pop();
        }
      }

      // ── Draw ────────────────────────────────────────────────────
      ctx.fillStyle = '#010309';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Grid dots
      ctx.fillStyle = 'rgba(0,247,255,0.04)';
      for (let x = 0; x < TILE_X; x++) {
        for (let y = 0; y < TILE_Y; y++) {
          ctx.fillRect(x * CELL + CELL / 2 - 0.5, y * CELL + CELL / 2 - 0.5, 1, 1);
        }
      }

      // Apple
      const pulse = Math.sin(g.applePhase) * 1.5;
      ctx.fillStyle  = '#ff306c';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ff306c';
      ctx.beginPath();
      ctx.arc(g.apple.x * CELL + CELL / 2, g.apple.y * CELL + CELL / 2, CELL / 2 - 3 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Particles
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#ff306c';
      g.particles.forEach(p => {
        ctx.fillStyle = `rgba(255,48,108,${p.life.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 + p.life * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Snake
      if (g.snake.length > 0) {
        ctx.strokeStyle = '#00f7ff';
        ctx.shadowBlur  = 14;
        ctx.shadowColor = '#00f7ff';
        ctx.lineWidth   = CELL - 6;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        ctx.beginPath();
        for (let i = 0; i < g.snake.length; i++) {
          const seg = g.snake[i];
          const sx  = seg.x * CELL + CELL / 2;
          const sy  = seg.y * CELL + CELL / 2;
          if (i === 0) {
            ctx.moveTo(sx, sy);
          } else {
            const prev = g.snake[i - 1];
            const dist = Math.abs(seg.x - prev.x) + Math.abs(seg.y - prev.y);
            if (dist > 1) {
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(sx, sy);
            } else {
              ctx.lineTo(sx, sy);
            }
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Head highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(g.snake[0].x * CELL + CELL / 2, g.snake[0].y * CELL + CELL / 2, (CELL - 8) / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // "Press arrow to start" prompt
      if (!g.started) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font      = '13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Press any arrow key to start', cssWidth / 2, cssHeight / 2 + 60);
        ctx.textAlign = 'left';
      }
    };

    g.rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (g.rafId) cancelAnimationFrame(g.rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Empty deps: effect runs ONCE and never restarts

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(1,3,9,0.98)',
        backdropFilter: 'blur(20px)',
        zIndex: 100,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: '12px'
      }}
    >
      {/* HUD */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        width: '500px', marginBottom: '16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px'
      }}>
        <span style={{ color: '#94a3b8' }}>Score: <strong style={{ color: '#00f7ff', fontSize: '1.1rem' }}>{displayScore}</strong></span>
        <span style={{ color: '#94a3b8' }}>Best: <strong style={{ color: '#ff71ce', fontSize: '1.1rem' }}>{displayHighScore}</strong></span>
        {!gameStarted && !isGameOver && (
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', alignSelf: 'center' }}>READY</span>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid rgba(0,247,255,0.2)',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,247,255,0.05)',
            background: '#010309',
            display: 'block'
          }}
        />

        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(1,3,9,0.92)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', textAlign: 'center',
                borderRadius: '8px'
              }}
            >
              <h2 style={{ color: '#ff306c', fontSize: '2.5rem', margin: '0 0 12px 0', textShadow: '0 0 20px rgba(255,48,108,0.7)' }}>
                SYSTEM FAILURE
              </h2>
              <p style={{ color: '#94a3b8', margin: '0 0 8px 0', fontSize: '1.2rem' }}>
                Final Score: <span style={{ color: '#00f7ff', fontWeight: 'bold' }}>{displayScore}</span>
              </p>
              {displayScore > 0 && displayScore >= displayHighScore && (
                <p style={{ color: '#ff71ce', margin: '0 0 24px 0', fontSize: '0.85rem', letterSpacing: '2px' }}>
                  ★ NEW HIGH SCORE ★
                </p>
              )}
              {(displayScore === 0 || displayScore < displayHighScore) && <div style={{ marginBottom: '24px' }} />}
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '2.2' }}>
                [ Press <strong style={{ color: '#00f7ff' }}>ENTER</strong> to Restart ]<br />
                [ Press <strong style={{ color: '#ff306c' }}>ESC</strong> to Exit ]
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{
        marginTop: '20px',
        fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.25)',
        fontSize: '0.75rem', letterSpacing: '1px'
      }}>
        W A S D / Arrow Keys to move &nbsp;·&nbsp; ESC to exit
      </div>
    </motion.div>
  );
}

// Pure helper — no React dependency
function spawnApple(snake, tileX, tileY) {
  let a;
  do {
    a = { x: Math.floor(Math.random() * tileX), y: Math.floor(Math.random() * tileY) };
  } while (snake.some(s => s.x === a.x && s.y === a.y));
  return a;
}
