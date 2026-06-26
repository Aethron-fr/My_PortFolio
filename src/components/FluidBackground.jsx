import { useEffect, useRef } from 'react';

class Particle {
  constructor(x, y, vx, vy) {
    // Random scatter around the mouse
    this.x = x + (Math.random() - 0.5) * 30;
    this.y = y + (Math.random() - 0.5) * 30;
    // Inherit some mouse velocity + random drift
    this.vx = vx * 0.05 + (Math.random() - 0.5) * 3;
    this.vy = vy * 0.05 + (Math.random() - 0.5) * 3;
    this.life = 1;
    this.size = Math.random() * 60 + 20; // Large, soft glowing orbs
    
    // Cyberpunk colors: Cyan, Magenta, or Deep Blue
    const rand = Math.random();
    if (rand > 0.6) this.color = 'rgba(0, 247, 255,';     // Cyan
    else if (rand > 0.3) this.color = 'rgba(255, 48, 108,'; // Magenta
    else this.color = 'rgba(112, 0, 255,';                 // Violet/Blue
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    // Add slight upward drift (like smoke)
    this.vy -= 0.05;
    // Fade out
    this.life -= 0.015;
    // Shrink slightly
    this.size *= 0.98;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, `${this.color} ${this.life * 0.4})`);
    gradient.addColorStop(1, `${this.color} 0)`);
    
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function FluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    let lastMouse = { x: -1000, y: -1000 };

    const onMouseMove = (e) => {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Calculate velocity
      mouse.vx = mouse.x - lastMouse.x;
      mouse.vy = mouse.y - lastMouse.y;
      
      // Spawn particles based on movement speed
      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      const spawnCount = Math.min(Math.floor(speed * 0.2) + 1, 8); // Cap spawns to prevent lag

      for (let i = 0; i < spawnCount; i++) {
        particles.push(new Particle(mouse.x, mouse.y, mouse.vx, mouse.vy));
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      // Use screen blending for bright neon light overlap
      ctx.globalCompositeOperation = 'screen';
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      
      particles = particles.filter(p => p.life > 0 && p.size > 0.5);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // Behind content
        pointerEvents: 'none', // Critical: do not block clicks!
        opacity: 0.8 // Opacity of the effect
      }}
    />
  );
}
