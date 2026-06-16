import { useEffect, useRef, useState } from 'react';

const TAGS = [
  'React.js', 'Node.js', 'Python', 'TypeScript', 'JavaScript',
  'Firebase', 'Vite', 'Framer Motion', 'Git', 'HTML5',
  'CSS3', 'Express', 'MongoDB', 'Django', 'REST APIs',
  'Figma', 'PostgreSQL', 'Redux', 'Docker', 'Linux',
];

export default function TechSphere() {
  const containerRef = useRef(null);
  const [hoveredTag, setHoveredTag] = useState(null);

  const hoveredTagRef = useRef(null);
  useEffect(() => {
    hoveredTagRef.current = hoveredTag;
  }, [hoveredTag]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const RADIUS = Math.min(window.innerWidth * 0.22, 190);
    const items = Array.from(container.querySelectorAll('.tech-tag-3d'));
    const total = items.length;

    let angleX = 0.3;  
    let angleY = 0;
    let velX = 0;
    let velY = 0.004;  
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let rafId;

    function positionTags() {
      items.forEach((el, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);

        let x0 = RADIUS * Math.sin(phi) * Math.cos(theta);
        let y0 = RADIUS * Math.cos(phi);
        let z0 = RADIUS * Math.sin(phi) * Math.sin(theta);

        let x1 = x0 * cosY - z0 * sinY;
        let z1 = x0 * sinY + z0 * cosY;

        let y1 = y0 * cosX - z1 * sinX;
        let z2 = y0 * sinX + z1 * cosX;

        let scale = (RADIUS + z2) / (2 * RADIUS);
        const opacity = scale * 0.7 + 0.3; // Increased base opacity so back tags are visible
        const zIndex = Math.round(z2 + RADIUS);

        const isHovered = hoveredTagRef.current === TAGS[i];
        if (isHovered) {
          scale *= 1.4; 
          el.style.background = 'var(--accent-cyber)'; // Vibrant solid cyan
          el.style.color = '#000'; // Dark text for high contrast readability
          el.style.borderColor = 'transparent';
          el.style.boxShadow = '0 0 30px rgba(0, 247, 255, 0.6)';
          el.style.zIndex = 999;
        } else {
          el.style.background = 'var(--bg-card)';
          el.style.color = 'var(--text-primary)';
          el.style.borderColor = 'var(--border-glass)';
          el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          el.style.zIndex = zIndex;
        }

        el.style.transform = `translate(-50%, -50%) translate(${x1}px, ${y1}px) scale(${scale.toFixed(3)})`;
        el.style.opacity = isHovered ? '1' : opacity.toFixed(3);
      });
    }

    function loop() {
      if (!isDragging && !hoveredTagRef.current) {
        angleY += velY;
        angleX += velX;
        velX *= 0.97;
        velY = velY * 0.99 + 0.004 * 0.01; 
      } else if (hoveredTagRef.current && !isDragging) {
        // Just pause gracefully
        velX *= 0.90;
        velY *= 0.90;
        angleY += velY;
        angleX += velX;
      }
      positionTags();
      rafId = requestAnimationFrame(loop);
    }

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
      marginBottom: '80px',
      position: 'relative',
    }}>
      <style>
        {`
          @keyframes corePulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          }
        `}
      </style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '5px',
          color: 'var(--accent-primary)',
          textTransform: 'uppercase',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ width: '30px', height: '1px', background: 'var(--accent-primary)', opacity: 0.5 }}></span>
          Tech Stack
          <span style={{ width: '30px', height: '1px', background: 'var(--accent-primary)', opacity: 0.5 }}></span>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '2px',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}>
          Interactive 3D Map — Drag to Rotate
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          height: '450px',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotateX(70deg)',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '1px dashed var(--border-glass)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotateX(70deg) rotateY(45deg)',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px dashed var(--border-glass)',
          pointerEvents: 'none',
        }} />



        {TAGS.map((tag) => (
          <span
            key={tag}
            className="tech-tag-3d"
            onMouseEnter={() => setHoveredTag(tag)}
            onMouseLeave={() => setHoveredTag(null)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.65rem, 1.4vw, 0.85rem)',
              letterSpacing: '1px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(12px)',
              willChange: 'transform, opacity, background, color',
              transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
              pointerEvents: 'auto',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
