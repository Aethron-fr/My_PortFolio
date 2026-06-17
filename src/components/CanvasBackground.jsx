import { useEffect, useRef } from 'react';

export default function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d'); 

    // Set size synchronously so particles spawn correctly across the entire screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId;
    let resizeTicking = false;

    // ── Configuration ──
    const STAR_COUNT = Math.floor((window.innerWidth * window.innerHeight) / 2000); // More stars
    const DUST_COUNT = Math.floor((window.innerWidth * window.innerHeight) / 6000); // More dust
    
    const stars = [];
    const dustParticles = [];
    const shootingStars = [];

    const mouse = { x: null, y: null, radius: 150 };

    // ── 1. Twinkling Background Stars ──
    class Star {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.4; // Larger stars
        this.baseAlpha = Math.random() * 0.6 + 0.2; // Brighter
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
      }
      update() {
        this.alpha += this.twinkleSpeed * this.twinkleDir;
        if (this.alpha >= 1) {
          this.alpha = 1;
          this.twinkleDir = -1;
        } else if (this.alpha <= this.baseAlpha) {
          this.alpha = this.baseAlpha;
          this.twinkleDir = 1;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    // ── 2. Drifting Cosmic Dust (Reacts to Mouse) ──
    class CosmicDust {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Larger dust
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.baseAlpha = Math.random() * 0.5 + 0.1; // Brighter
        
        // Vibrant cyan or purple tint
        this.color = Math.random() > 0.5 
          ? `rgba(0, 247, 255, ` // Cyan
          : `rgba(225, 48, 108, `; // Pink/Purple
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Subtle mouse repulsion
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + `${this.baseAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + `1)`;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    // ── 3. Shooting Stars ──
    class ShootingStar {
      constructor() {
        this.reset();
        this.active = false;
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.len = Math.random() * 80 + 30;
        this.speed = Math.random() * 10 + 6;
        this.size = Math.random() * 1.5 + 0.5;
        this.waitTime = Math.random() * 300 + 100; // frames to wait before firing
        this.timer = 0;
        this.active = false;
        // 45 degree angle trajectory
        this.vx = this.speed;
        this.vy = this.speed;
      }
      update() {
        if (!this.active) {
          this.timer++;
          if (this.timer > this.waitTime) {
            this.active = true;
            this.x = Math.random() * canvas.width * 1.5 - canvas.width * 0.5; // Start somewhere off-top-left
            this.y = -this.len;
          }
          return;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x > canvas.width + this.len || this.y > canvas.height + this.len) {
          this.reset();
        }
      }
      draw() {
        if (!this.active) return;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y - this.len);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.len, this.y - this.len);
        ctx.lineWidth = this.size;
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
    }

    // Initialize arrays
    for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
    for (let i = 0; i < DUST_COUNT; i++) dustParticles.push(new CosmicDust());
    // Only 2 or 3 shooting stars at a time
    for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());

    // ── Event Listeners ──
    const handleResize = () => {
      if (!resizeTicking) {
        window.requestAnimationFrame(() => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          resizeTicking = false;
        });
        resizeTicking = true;
      }
    };
    
    let mouseTicking = false;
    const handleMouseMove = (e) => { 
      if (!mouseTicking) {
        window.requestAnimationFrame(() => {
          mouse.x = e.clientX; 
          mouse.y = e.clientY; 
          mouseTicking = false;
        });
        mouseTicking = true;
      }
    };
    const handleMouseLeave = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // ── Render Loop ──
    const animate = () => {
      // Clear the canvas instead of filling it with solid black
      // This allows the CSS body background to show through perfectly on all themes!
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => { s.update(); s.draw(); });
      dustParticles.forEach(d => { d.update(); d.draw(); });
      shootingStars.forEach(ss => { ss.update(); ss.draw(); });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100vh',
        zIndex: -1, pointerEvents: 'none',
        transform: 'translateZ(0)', willChange: 'transform',
      }}
    />
  );
}
