import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
export default function MagneticButton({
  children,
  onClick,
  style,
  className,
  intensity = 0.1, // Drastically reduced for a subtle, premium feel
  glowColor = 'rgba(255,255,255,0.08)',
  ...props
}) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Softer spring for a more elegant, expensive feel
  const springConfig = { stiffness: 200, damping: 20, mass: 0.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Very slight magnetic pull (max 5-10px)
    x.set((e.clientX - centerX) * intensity);
    y.set((e.clientY - centerY) * intensity);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 8px 24px ${glowColor}`,
      }}
      whileTap={{ scale: 0.97 }}
      style={{
        x: springX,
        y: springY,
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
