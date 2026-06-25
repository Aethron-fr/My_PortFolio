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
    const ctx = canvas.getContext('2d');
    
    // Grid settings
    const gridSize = 20;
    const tileCount = 20; // 400x400 total
    
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    let snake = [{ x: 10, y: 10 }];
    let velocity = { x: 0, y: 0 };
    let nextVelocity = { x: 0, y: 0 };
    
    let apple = { x: 15, y: 10 };
    let currentScore = 0;
    
    let gameLoop;
    let speed = 100; // ms per frame

    // Spawn apple in empty spot
    const spawnApple = () => {
      let newApple;
      while (true) {
        newApple = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
        // Ensure apple doesn't spawn on snake
        if (!snake.some(segment => segment.x === newApple.x && segment.y === newApple.y)) {
          break;
        }
      }
      apple = newApple;
    };

    // Keyboard controls
    const handleKeyDown = (e) => {
      // Prevent default scrolling for arrow keys and space
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
      }
      
      if (e.key === 'Escape') {
        onExit();
        return;
      }

      if (gameOver && e.key === 'Enter') {
        // Reset game
        snake = [{ x: 10, y: 10 }];
        velocity = { x: 0, y: 0 };
        nextVelocity = { x: 0, y: 0 };
        currentScore = 0;
        speed = 100;
        setScore(0);
        setGameOver(false);
        spawnApple();
        return;
      }

      // Movement logic
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (velocity.y !== 1) nextVelocity = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (velocity.y !== -1) nextVelocity = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (velocity.x !== 1) nextVelocity = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (velocity.x !== -1) nextVelocity = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });

    let lastRenderTime = 0;

    const render = (currentTime) => {
      gameLoop = requestAnimationFrame(render);
      
      if (gameOver) return;
      
      if (currentTime - lastRenderTime < speed) return;
      lastRenderTime = currentTime;

      // Update velocity
      velocity = { ...nextVelocity };

      // Move snake
      let headX = snake[0].x + velocity.x;
      let headY = snake[0].y + velocity.y;

      // Wrap around walls (Toroidal)
      if (headX < 0) headX = tileCount - 1;
      if (headX >= tileCount) headX = 0;
      if (headY < 0) headY = tileCount - 1;
      if (headY >= tileCount) headY = 0;

      const newHead = { x: headX, y: headY };

      // Check collision with self
      // Only check if velocity is not 0 to avoid dying before starting
      if (velocity.x !== 0 || velocity.y !== 0) {
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return;
        }
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
        speed = Math.max(50, speed - 2); // Increase speed
        spawnApple();
      } else {
        // Remove tail if didn't eat
        if (velocity.x !== 0 || velocity.y !== 0) {
           snake.pop();
        } else {
           // wait if hasn't started moving
           snake.pop();
           snake.unshift({x: 10, y: 10}); // reset
           snake.pop();
        }
      }

      // Draw Everything
      ctx.fillStyle = '#010309'; // deep background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(0, 247, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Draw Apple
      ctx.fillStyle = '#ff306c';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff306c';
      ctx.beginPath();
      ctx.arc(apple.x * gridSize + gridSize/2, apple.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw Snake
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f7ff';
      snake.forEach((segment, index) => {
        // Gradient color for snake body
        ctx.fillStyle = index === 0 ? '#00f7ff' : `rgba(0, 247, 255, ${Math.max(0.2, 1 - index/snake.length)})`;
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
      });
      ctx.shadowBlur = 0; // reset
    };

    gameLoop = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(gameLoop);
    };
  }, [highScore, onExit, gameOver]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(1, 3, 9, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px'
      }}
    >
      {/* HUD */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '400px',
        marginBottom: '16px',
        fontFamily: 'var(--font-mono)',
        color: '#00f7ff',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        <span>Score: {score}</span>
        <span>High: {highScore}</span>
      </div>

      {/* Game Canvas container */}
      <div style={{ position: 'relative' }}>
        <canvas 
          ref={canvasRef}
          style={{
            border: '2px solid rgba(0, 247, 255, 0.3)',
            borderRadius: '4px',
            boxShadow: '0 0 30px rgba(0, 247, 255, 0.1)',
            background: '#010309',
            display: 'block'
          }}
        />

        {/* Game Over Screen */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(1, 3, 9, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                textAlign: 'center'
              }}
            >
              <h2 style={{ color: '#ff306c', fontSize: '2.5rem', margin: '0 0 8px 0', textShadow: '0 0 20px rgba(255, 48, 108, 0.6)' }}>
                SYSTEM FAILURE
              </h2>
              <p style={{ color: '#94a3b8', margin: '0 0 24px 0', fontSize: '1.2rem' }}>Final Score: <span style={{ color: '#00f7ff' }}>{score}</span></p>
              
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: '1.8' }}>
                [ Press <strong style={{ color: '#00f7ff' }}>ENTER</strong> to Restart ]<br/>
                [ Press <strong style={{ color: '#ff306c' }}>ESC</strong> to Exit ]
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{
        marginTop: '20px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-dim)',
        fontSize: '0.75rem',
        opacity: 0.8,
        letterSpacing: '1px'
      }}>
        Use W A S D or Arrow Keys. Press ESC to exit.
      </div>
    </motion.div>
  );
}
