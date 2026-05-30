import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ─── Rain Lines Effect ────────────────────────────────────────────────────────
function RainCanvas({ opacity = 0.12 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drops = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.6 + Math.random() * 0.9,
      length: 8 + Math.random() * 14,
      opacity: 0.03 + Math.random() * 0.07,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.15, drop.y + drop.length);
        ctx.strokeStyle = `rgba(180, 200, 230, ${drop.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height + 20) {
          drop.y = -20;
          drop.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity, pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

// ─── Atmospheric Panels ───────────────────────────────────────────────────────
const ATMOSPHERES = [
  {
    id: 'rain',
    mood: 'Rain-soaked streets.',
    note: 'The kind of quiet you only find when the world outside is wet and grey.',
    gradient: 'linear-gradient(160deg, #060810 0%, #090c14 60%, #07080f 100%)',
    accent: 'rgba(100, 140, 200, 0.12)',
    glowColor: 'rgba(80, 120, 200, 0.15)',
    showRain: true,
  },
  {
    id: 'transit',
    mood: 'Neon midnight transit.',
    note: 'Movement without destination. The in-between that feels strangely clarifying.',
    gradient: 'linear-gradient(160deg, #08060c 0%, #0c0910 60%, #080608 100%)',
    accent: 'rgba(200, 160, 80, 0.08)',
    glowColor: 'rgba(200, 160, 80, 0.1)',
    showRain: false,
  },
  {
    id: 'city',
    mood: 'Empty late-night cities.',
    note: 'Places that don\'t know your name. Some environments change how you think.',
    gradient: 'linear-gradient(160deg, #07070d 0%, #090910 60%, #060607 100%)',
    accent: 'rgba(160, 80, 120, 0.08)',
    glowColor: 'rgba(140, 70, 100, 0.1)',
    showRain: false,
  },
  {
    id: 'cold',
    mood: 'Winter morning air.',
    note: 'Dim cafés. Warm windows from outside. The contrast that makes both more real.',
    gradient: 'linear-gradient(160deg, #060a0f 0%, #080c12 60%, #060810 100%)',
    accent: 'rgba(80, 160, 200, 0.08)',
    glowColor: 'rgba(80, 140, 200, 0.12)',
    showRain: false,
  },
  {
    id: 'silence',
    mood: 'Cold mountain silence.',
    note: 'Three in the morning. Every stranger temporarily suspended between lives.',
    gradient: 'linear-gradient(160deg, #080808 0%, #0c0c0e 60%, #080808 100%)',
    accent: 'rgba(200, 200, 200, 0.05)',
    glowColor: 'rgba(200, 200, 220, 0.07)',
    showRain: false,
  },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

function AtmosphereCard({ atm, index }) {
  const [hovered, setHovered] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const hoverTimer = useRef(null);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { rootMargin: '-20px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleEnter = () => {
    setHovered(true);
    if (atm.id === 'rain') {
      hoverTimer.current = setTimeout(() => {
        setShowSecret(true);
        try {
          const stored = JSON.parse(localStorage.getItem('_p_clues') || '{}');
          if (!stored['puzzle_hover']) {
            stored['puzzle_hover'] = Date.now();
            localStorage.setItem('_p_clues', JSON.stringify(stored));
          }
        } catch {}
      }, 8000);
    }
  };

  const handleLeave = () => {
    setHovered(false);
    clearTimeout(hoverTimer.current);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        minWidth: 220, width: 240, height: 180,
        borderRadius: 16,
        position: 'relative', overflow: 'hidden',
        flexShrink: 0,
        transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 16px 40px -12px rgba(0,0,0,0.7), 0 0 0 1px ${atm.accent}`
          : '0 4px 16px -6px rgba(0,0,0,0.5)',
      }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: atm.gradient }} />

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: GRAIN, opacity: 0.055,
        mixBlendMode: 'overlay', pointerEvents: 'none',
      }} />

      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.7 }}
        style={{
          position: 'absolute', top: -30, left: '50%',
          transform: 'translateX(-50%)',
          width: '120%', height: '100px',
          background: `radial-gradient(ellipse, ${atm.glowColor} 0%, transparent 70%)`,
          filter: 'blur(24px)', pointerEvents: 'none',
        }}
      />

      {/* Rain canvas — only for rain panel */}
      {atm.showRain && <RainCanvas opacity={hovered ? 0.25 : 0.1} />}

      {/* Window condensation effect — subtle gradient lines */}
      {atm.showRain && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: `repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 18px,
            rgba(100, 140, 200, 0.015) 18px,
            rgba(100, 140, 200, 0.015) 19px
          )`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Card border */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: 16, zIndex: 4, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 5,
        padding: '24px 22px',
        height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <p style={{
          fontSize: '0.88rem', fontWeight: 300,
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.4, margin: 0,
          fontStyle: 'normal',
          letterSpacing: '-0.2px',
        }}>
          {atm.mood}
        </p>

        <p style={{
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.22)',
          lineHeight: 1.65, fontWeight: 300, margin: 0,
        }}>
          {atm.note}
        </p>

        {/* Rain secret — appears after 8s hover on rain card only */}
        {atm.id === 'rain' && showSecret && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.38 }}
            transition={{ duration: 2.5 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.38)', letterSpacing: '2px',
              margin: '10px 0 0', pointerEvents: 'none',
            }}
          >
            I used to hate this.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Custom hook ──────────────────────────────────────────────────────────────
function useInView(margin = '-40px') {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { rootMargin: margin }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [margin]);
  return [ref, inView];
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BeyondTheScreen() {
  const [headerRef, headerInView] = useInView();
  const [visionRef, visionInView] = useInView('-20px');
  const [workspaceRef, workspaceInView] = useInView('-20px');

  return (
    <section style={{
      position: 'relative', zIndex: 2,
      padding: '72px 0 80px',
      background: 'linear-gradient(to bottom, #07070d, #05050b)',
    }}>
      <div className="container">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 48 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            letterSpacing: '5px', color: 'rgba(255,255,255,0.16)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            Beyond The Screen
          </div>
          <h2 style={{
            fontSize: '1.55rem', fontWeight: 400,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '-0.5px', margin: '0 0 14px',
          }}>
            Drawn toward unfamiliar environments.
          </h2>
          <p style={{
            fontSize: '0.88rem', color: 'rgba(255,255,255,0.25)',
            lineHeight: 1.85, fontWeight: 300, maxWidth: 480, margin: 0,
          }}>
            Some places change the way you think. Drawn toward rain, cold air, quiet streets, and movement.
          </p>
        </motion.div>

        {/* ── Atmospheric Panels ── */}
        <div style={{ marginBottom: 64 }}>
          <div style={{
            display: 'flex', gap: 14,
            overflowX: 'auto', paddingBottom: 12,
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {ATMOSPHERES.map((atm, i) => (
              <AtmosphereCard key={atm.id} atm={atm} index={i} />
            ))}
          </div>
        </div>

        {/* ── Life Vision ── */}
        <motion.div
          ref={visionRef}
          initial={{ opacity: 0, y: 16 }}
          animate={visionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64, maxWidth: 560 }}
        >
          <div style={{ width: 28, height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />

          <p style={{
            fontSize: '1rem', color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.95, fontWeight: 300, margin: '0 0 16px',
          }}>
            Still exploring what kind of places feel like home.
          </p>
          <p style={{
            fontSize: '0.9rem', color: 'rgba(255,255,255,0.2)',
            lineHeight: 1.9, fontWeight: 300, margin: 0,
          }}>
            Not in a rush. Just building toward it.
          </p>
        </motion.div>

        {/* ── Workspace Visual ── */}
        <motion.div
          ref={workspaceRef}
          initial={{ opacity: 0, y: 20 }}
          animate={workspaceInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            letterSpacing: '4px', color: 'rgba(255,255,255,0.1)',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            The kind of space where the right things get made
          </div>

          <div style={{
            position: 'relative', borderRadius: 18, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.04)',
            maxWidth: 820,
          }}>
            <img
              src="/workspace.png"
              alt="Cinematic workspace"
              loading="lazy"
              style={{
                width: '100%', display: 'block',
                objectFit: 'cover', maxHeight: 400,
                filter: 'saturate(0.65) brightness(0.8)',
              }}
            />
            {/* Bottom fade */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, rgba(5,5,11,0.75) 100%)',
              pointerEvents: 'none',
            }} />
            {/* Grain overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: GRAIN, opacity: 0.04,
              mixBlendMode: 'overlay', pointerEvents: 'none',
            }} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
