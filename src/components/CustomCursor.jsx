import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const blobRef = useRef(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blobX = mouseX;
    let blobY = mouseY;
    let isHovering = false;
    let frameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateBlob = () => {
      // Buttery inertia
      const speed = isHovering ? 0.2 : 0.1;
      blobX += (mouseX - blobX) * speed;
      blobY += (mouseY - blobY) * speed;

      blob.style.left = `${blobX}px`;
      blob.style.top = `${blobY}px`;

      frameId = requestAnimationFrame(updateBlob);
    };

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
        blob.style.transform = 'translate(-50%, -50%) scale(2.5)';
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
        blob.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    };

    const handleMouseDown = () => {
      blob.style.transform = 'translate(-50%, -50%) scale(0.5)';
    };

    const handleMouseUp = () => {
      blob.style.transform = `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    updateBlob();

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
      <style>
        {`
          .fluid-cursor-blob {
            position: fixed;
            top: 0;
            left: 0;
            width: 32px;
            height: 32px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
            transform: translate(-50%, -50%) scale(1);
            transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            /* Soft blur edge */
            filter: blur(2px);
          }
          
          /* Hide default cursors on desktop to fully sell the fluid effect */
          @media (pointer: fine) {
            body, a, button {
              cursor: none !important;
            }
          }
        `}
      </style>
      <div ref={blobRef} className="fluid-cursor-blob" />
    </>
  );
}
