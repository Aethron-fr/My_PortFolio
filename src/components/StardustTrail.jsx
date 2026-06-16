import { useEffect, useRef } from 'react';

/**
 * StardustTrail
 * - Canvas-based particle trail on mouse movement
 * - Hardware accelerated via requestAnimationFrame
 * - Particles fade out and fall slightly (gravity effect)
 * - Completely disabled on touch/coarse-pointer devices
 * - Does NOT listen to scroll events — zero scroll performance impact
 */
export default function StardustTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable entirely on touch devices (pointer: coarse = finger / stylus)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let rafId;
    let lastSpawnTime = 0;

    // Resize canvas to match the full viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Track mouse — passive so it never blocks scroll
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Throttle particle spawning to every ~30ms to keep it lightweight
      const now = performance.now();
      if (now - lastSpawnTime < 30) return;
      lastSpawnTime = now;

      // Spawn 2–4 particles per spawn event
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 8,
          y: mouseY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.6,     // slight horizontal drift
          vy: (Math.random() * 0.4) + 0.1,      // always falls downward
          alpha: 0.7 + Math.random() * 0.3,     // start near-opaque
          decay: 0.012 + Math.random() * 0.018, // fade speed
          radius: 1.2 + Math.random() * 1.4,    // particle size
          hue: Math.random() > 0.6 ? 210 : 280, // blue or violet
        });
      }
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Main render loop
    const render = () => {
      // Clear with full transparency — no trail smear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw each particle
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;       // gravity: falls down
        p.vy += 0.015;     // slight acceleration (realistic fall)
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false; // remove dead particles

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Radial gradient for a glowing "stardust" look
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 2.5
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 85%, 1)`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();

        return true;
      });

      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',   // never blocks clicks or scroll
        zIndex: 9999,            // above everything, below cursor
        willChange: 'transform', // GPU compositing hint
      }}
      aria-hidden="true"
    />
  );
}
