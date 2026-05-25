import { useEffect, useRef } from 'react';

export default function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    let animId;

    // ── Particles (restrained — warm grey, very dim) ────────────────────────
    const particleCount = Math.min(35, Math.floor((window.innerWidth * window.innerHeight) / 38000));
    const particles = [];

    const mouse = { x: null, y: null, radius: 140 };

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : -4;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.size = Math.random() * 1.5 + 0.5;
        // Muted warm-grey palette — no neon
        this.alpha = 0.08 + Math.random() * 0.12;
        this.color = Math.random() > 0.6
          ? `hsla(220, 20%, 70%, ${this.alpha})`
          : `hsla(340, 25%, 55%, ${this.alpha})`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < mouse.radius) {
            const f = (mouse.radius - d) / mouse.radius;
            this.x -= dx * f * 0.015;
            this.y -= dy * f * 0.015;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const connectParticles = () => {
      if (window.innerWidth < 768) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            // Muted warm-grey threads — no cyan
            const alpha = (90 - d) / 90 * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(180, 160, 180, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    // ── Rain drops (subtle, always present, very dim) ───────────────────────
    const rainDrops = window.innerWidth >= 768
      ? Array.from({ length: 45 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 0.5 + Math.random() * 0.8,
          length: 7 + Math.random() * 12,
          opacity: 0.02 + Math.random() * 0.04, // Very dim — barely there
        }))
      : [];

    const drawRain = () => {
      rainDrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.12, drop.y + drop.length);
        ctx.strokeStyle = `rgba(160, 190, 220, ${drop.opacity})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height + 20) {
          drop.y = -15;
          drop.x = Math.random() * canvas.width;
        }
      });
    };

    // ── Resize ──────────────────────────────────────────────────────────────
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseLeave = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    handleResize();

    // ── 7-click background clue ───────────────────────────────────────────────
    // "I used to hate the rain. I don't anymore."
    let bgClickCount = 0;
    const handleBgClick = (e) => {
      const isInteractive = e.target.closest('button, a, input, textarea, select, [role="button"], nav, label');
      if (isInteractive) return;
      bgClickCount++;
      if (bgClickCount === 7) {
        bgClickCount = 0;
        const el = document.createElement('div');
        el.textContent = "this wasn't always here.";
        Object.assign(el.style, {
          position: 'fixed', bottom: '44px', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'monospace', fontSize: '0.61rem',
          color: 'rgba(255,255,255,0.13)', letterSpacing: '2.5px',
          pointerEvents: 'none', zIndex: '9998',
          whiteSpace: 'nowrap', opacity: '1',
          transition: 'opacity 2.5s ease',
        });
        document.body.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; }, 4000);
        setTimeout(() => el.remove(), 7000);
        try {
          const stored = JSON.parse(localStorage.getItem('_p_clues') || '{}');
          if (!stored['puzzle_rain']) {
            stored['puzzle_rain'] = Date.now();
            localStorage.setItem('_p_clues', JSON.stringify(stored));
          }
        } catch {}
      }
    };
    window.addEventListener('click', handleBgClick);

    // ── Render loop ──────────────────────────────────────────────────────────
    const animate = () => {
      ctx.fillStyle = '#06060a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawRain();        // Rain first — behind particles
      connectParticles();
      particles.forEach(p => { p.update(); p.draw(); });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleBgClick);
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
