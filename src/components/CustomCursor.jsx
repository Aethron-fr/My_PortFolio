import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let isHovering = false;
    let frameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the center dot
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    // Smoothly interpolate the lagging outer glow position using requestAnimationFrame
    const updateGlow = () => {
      // Linear interpolation (lerp) for buttery inertia
      const speed = isHovering ? 0.2 : 0.15;
      glowX += (mouseX - glowX) * speed;
      glowY += (mouseY - glowY) * speed;

      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;

      frameId = requestAnimationFrame(updateGlow);
    };

    // Listen to hover states on interactive links
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.skill-card') ||
        target.closest('.project-card') ||
        target.classList.contains('interactive');

      if (isInteractive) {
        isHovering = true;
        glow.style.width = '55px';
        glow.style.height = '55px';
        glow.style.borderColor = '#00F7FF'; // cyan on hover
        glow.style.backgroundColor = 'rgba(0, 247, 255, 0.05)';
        dot.style.backgroundColor = '#00F7FF';
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.skill-card') ||
        target.closest('.project-card') ||
        target.classList.contains('interactive');

      if (isInteractive) {
        isHovering = false;
        glow.style.width = '36px';
        glow.style.height = '36px';
        glow.style.borderColor = '#E1306C'; // standard pink
        glow.style.backgroundColor = 'transparent';
        dot.style.backgroundColor = '#E1306C';
      }
    };

    const handleMouseDown = () => {
      glow.style.transform = 'translate(-50%, -50%) scale(0.65)';
      glow.style.borderColor = '#00F7FF';
      dot.style.transform = 'translate(-50%, -50%) scale(1.6)';
    };

    const handleMouseUp = () => {
      glow.style.transform = 'translate(-50%, -50%) scale(1.45)';
      glow.style.borderColor = '#FF5E3A'; // Orange Sunset flash
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      
      setTimeout(() => {
        glow.style.transform = 'translate(-50%, -50%) scale(1)';
        glow.style.borderColor = isHovering ? '#00F7FF' : '#E1306C';
      }, 160);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Start smooth glow rendering loop
    updateGlow();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" />
      <div ref={glowRef} className="custom-cursor-glow" />
    </>
  );
}
