import { useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

export default function ScrollSkewWrapper({ children }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth the velocity to prevent erratic jumping
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Map velocity range to a subtle skew degree (limit to max +/- 3 degrees for elegance)
  const skew = useTransform(smoothVelocity, [-1500, 1500], [2, -2]);

  return (
    <motion.div 
      style={{ 
        skewY: skew,
        transformOrigin: 'center center'
      }}
    >
      {children}
    </motion.div>
  );
}
