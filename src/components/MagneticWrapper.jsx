import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { sfx } from '../utils/sfx';

export default function MagneticWrapper({
  children,
  className,
  intensity = 0.2, // slightly stronger pull for icons
  style,
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

  const handleMouseEnter = () => {
    sfx.playHoverTick();
  };

  const handleClick = () => {
    sfx.playTerminalKeystroke();
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={className}
      style={{
        display: 'inline-flex',
        x: springX,
        y: springY,
        ...style
      }}
    >
      {children}
    </motion.div>
  );
}
