import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { audioController } from '../audio';

export default function MagneticButton({
  children,
  onClick,
  style,
  className,
  intensity = 0.4,
  withAudio = true,
  glowColor = 'rgba(255,255,255,0.15)'
}) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * intensity);
    y.set((e.clientY - centerY) * intensity);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e) => {
    if (withAudio) audioController.playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.03,
        boxShadow: `0 10px 30px ${glowColor}`,
        borderColor: glowColor.replace('0.15', '0.4').replace('0.1', '0.3'), // bump opacity
      }}
      whileTap={{ scale: 0.97 }}
      style={{
        x: springX,
        y: springY,
        ...style
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
