import { useEffect, useRef } from 'react';

const TAGS = [
  'React.js', 'Node.js', 'Python', 'TypeScript', 'JavaScript',
  'Firebase', 'Vite', 'Framer Motion', 'Git', 'HTML5',
  'CSS3', 'Express', 'MongoDB', 'Django', 'REST APIs',
  'Figma', 'PostgreSQL', 'Redux', 'Docker', 'Linux',
];

/**
 * TechSphere — Pure CSS/JS 3D rotating sphere of tech tags.
 * No external dependencies. Hardware accelerated via CSS transforms.
 * Auto-rotates on all devices. Mouse-draggable on desktop.
 */
export default function TechSphere() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const RADIUS = Math.min(window.innerWidth * 0.22, 190);
    const items = Array.from(container.querySelectorAll('.tech-tag-3d'));
    const total = items.length;

    let angleX = 0.3;  // current tilt (radians)
    let angleY = 0;
    let velX = 0;
    let velY = 0.004;  // auto-spin speed
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let rafId;

    // Place each tag at a point on the sphere surface using spherical coordinates
    function positionTags() {
      items.forEach((el, i) => {
        // Fibonacci sphere distribution for even spacing
        const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        // Rotate by current angles
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);

        // Original 3D point on sphere
        let x0 = RADIUS * Math.sin(phi) * Math.cos(theta);
        let y0 = RADIUS * Math.cos(phi);
        let z0 = RADIUS * Math.sin(phi) * Math.sin(theta);

        // Rotate around Y axis (angleY)
        let x1 = x0 * cosY - z0 * sinY;
        let z1 = x0 * sinY + z0 * cosY;

        // Rotate around X axis (angleX)
        let y1 = y0 * cosX - z1 * sinX;
        let z2 = y0 * sinX + z1 * cosX;

        // Perspective projection
        const scale = (RADIUS + z2) / (2 * RADIUS);
        const opacity = scale * 0.9 + 0.1;

        el.style.transform = `translate(-50%, -50%) translate(${x1}px, ${y1}px) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = Math.round(z2 + RADIUS);
        el.style.color = z2 > 0
          ? `rgba(255,255,255,${(opacity).toFixed(2)})`
          : `rgba(180,160,220,${(opacity * 0.7).toFixed(2)})`;
      });
    }

    function loop() {
      if (!isDragging) {
        // Apply inertia
        angleY += velY;
        angleX += velX;
        velX *= 0.97;
        velY = velY * 0.99 + 0.004 * 0.01; // drift back to auto-spin
      }
      positionTags();
      rafId = requestAnimationFrame(loop);
    }

    // Mouse drag
    const onMouseDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = 0;
      velY = 0;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      angleY += dx * 0.006;
      angleX += dy * 0.006;
      velX = dy * 0.006;
      velY = dx * 0.006;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    loop();

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '52px',
    }}>
      {/* Section label */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.58rem',
        letterSpacing: '4px',
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        marginBottom: 8,
        alignSelf: 'flex-start',
      }}>
        Tech Stack
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.5rem',
        letterSpacing: '2px',
        color: 'rgba(255,255,255,0.15)',
        textTransform: 'uppercase',
        marginBottom: 36,
        alignSelf: 'flex-start',
      }}>
        drag to rotate
      </div>

      {/* The sphere container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          height: '380px',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="tech-tag-3d"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
              letterSpacing: '1.5px',
              whiteSpace: 'nowrap',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(4px)',
              willChange: 'transform, opacity',
              transition: 'color 0.3s',
              pointerEvents: 'none',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
