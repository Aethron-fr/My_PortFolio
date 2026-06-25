import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NeonSnakeGame({ onExit }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem('neonSnakeHighScore')) || 0
  );
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Handle high DPI for crisp rendering
    const pixelRatio = window.devicePixelRatio || 1;
    const cssWidth = 500;
    const cssHeight = 400;
    
    canvas.width = cssWidth * pixelRatio;
    canvas.height = cssHeight * pixelRatio;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    
    // Grid settings
    const tileCountX = 25;
    const tileCountY = 20;
    const gridSize = cssWidth / tileCountX; // 20px

    let snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 }
    ];
    let velocity = { x: 1, y: 0 };
    let inputQueue = []; // Fixes the "double-turn suicide" bug
    
    let apple = { x: 15, y: 10 };
    let particles = [];
    
    let currentScore = 0;
    let gameLoop;
    let speed = 110; // ms per frame
    let lastRenderTime = 0;

    // Spawn apple in empty spot
    const spawnApple = () => {
      let newApple;
      while (true) {
        newApple = {
          x: Math.floor(Math.random() * tileCountX),
          y: Math.floor(Math.random() * tileCountY)
        };
        if (!snake.some(segment => segment.x === newApple.x && segment.y === newApple.y)) {
          break;
        }
      }
      apple = newApple;
    };

    // Keyboard controls
    const handleKeyDown = (e) => {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
      }
      
      if (e.key === 'Escape') {
        onExit();
        return;
      }

      if (gameOver && e.key === 'Enter') {
        snake = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
        velocity = { x: 1, y: 0 };
        inputQueue = [];
        currentScore = 0;
        speed = 110;
        setScore(0);
        setGameOver(false);
        particles = [];
        spawnApple();
        return;
      }

      const lastInput = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : velocity;

      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastInput.y !== 1) inputQueue.push({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastInput.y !== -1) inputQueue.push({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastInput.x !== 1) inputQueue.push({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastInput.x !== -1) inputQueue.push({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });

    // Apple animation properties
    let applePhase = 0;

    const render = (currentTime) => {
      gameLoop = requestAnimationFrame(render);
      if (gameOver) return;
      
      // Update animations every frame
      applePhase += 0.1;
      
      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Game tick (movement)
      if (currentTime - lastRenderTime >= speed) {
        lastRenderTime = currentTime;

        if (inputQueue.length > 0) {
          velocity = inputQueue.shift();
        }

        let headX = snake[0].x + velocity.x;
        let headY = snake[0].y + velocity.y;

        // Wrap around walls (Toroidal)
        if (headX < 0) headX = tileCountX - 1;
        if (headX >= tileCountX) headX = 0;
        if (headY < 0) headY = tileCountY - 1;
        if (headY >= tileCountY) headY = 0;

        const newHead = { x: headX, y: headY };

        // Check collision with self
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return;
        }

        snake.unshift(newHead);

        // Check apple collision
        if (newHead.x === apple.x && newHead.y === apple.y) {
          currentScore += 10;
          setScore(currentScore);
          if (currentScore > highScore) {
            setHighScore(currentScore);
            localStorage.setItem('neonSnakeHighScore', currentScore.toString());
          }
          speed = Math.max(50, speed - 2);
          
          // Spawn particles
          for(let i=0; i<15; i++) {
            particles.push({
              x: apple.x * gridSize + gridSize/2,
              y: apple.y * gridSize + gridSize/2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 1
            });
          }
          spawnApple();
        } else {
           snake.pop();
        }
      }

      // --- RENDER ---
      
      // Clear background
      ctx.fillStyle = '#010309';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Draw Apple
      const pulse = Math.sin(applePhase) * 2;
      ctx.fillStyle = '#ff306c';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff306c';
      ctx.beginPath();
      ctx.arc(apple.x * gridSize + gridSize/2, apple.y * gridSize + gridSize/2, (gridSize/2 - 4) + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Particles
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff306c';
      particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 48, 108, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + p.life * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Draw Snake as a continuous sleek glowing line
      ctx.strokeStyle = '#00f7ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f7ff';
      ctx.lineWidth = gridSize - 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      for (let i = 0; i < snake.length; i++) {
        const seg = snake[i];
        const x = seg.x * gridSize + gridSize / 2;
        const y = seg.y * gridSize + gridSize / 2;
        
        // Handle screen wrapping breaks in the drawing path
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prev = snake[i-1];
          const dist = Math.abs(seg.x - prev.x) + Math.abs(seg.y - prev.y);
          if (dist > 1) {
            // It wrapped around the screen, break the continuous line
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw snake head highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(snake[0].x * gridSize + gridSize/2, snake[0].y * gridSize + gridSize/2, (gridSize-6)/2 - 1, 0, Math.PI * 2);
      ctx.fill();
    };

    gameLoop = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(gameLoop);
    };
  }, [highScore, onExit, gameOver]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(1, 3, 9, 0.98)',
        backdropFilter: 'blur(20px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '500px',
        marginBottom: '20px',
        fontFamily: 'var(--font-mono)',
        color: '#00f7ff',
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        <span>Score: <strong style={{ color: '#fff'}}>{score}</strong></span>
        <span>High: <strong style={{ color: '#fff'}}>{highScore}</strong></span>
      </div>

      <div style={{ position: 'relative' }}>
        <canvas 
          ref={canvasRef}
          style={{
            border: '1px solid rgba(0, 247, 255, 0.2)',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0, 247, 255, 0.05)',
            background: '#010309',
            display: 'block'
          }}
        />

        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(1, 3, 9, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                textAlign: 'center',
                borderRadius: '8px'
              }}
            >
              <h2 style={{ color: '#ff306c', fontSize: '2.5rem', margin: '0 0 12px 0', textShadow: '0 0 20px rgba(255, 48, 108, 0.6)' }}>
                SYSTEM FAILURE
              </h2>
              <p style={{ color: '#94a3b8', margin: '0 0 32px 0', fontSize: '1.2rem' }}>Final Score: <span style={{ color: '#00f7ff', fontWeight: 'bold' }}>{score}</span></p>
              
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '2' }}>
                [ Press <strong style={{ color: '#00f7ff' }}>ENTER</strong> to Restart ]<br/>
                [ Press <strong style={{ color: '#ff306c' }}>ESC</strong> to Exit ]
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{
        marginTop: '24px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        opacity: 0.6,
        letterSpacing: '1px'
      }}>
        Use W A S D or Arrow Keys. Press ESC to exit.
      </div>
    </motion.div>
  );
}
