import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';

export default function LiquidImage({ src, alt, style }) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const handleMouseEnter = () => {
    setIsHovered(true);
    controls.start({
      scale: [0, 40, 20],
      transition: { duration: 0.8, times: [0, 0.4, 1], ease: 'easeOut' }
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    controls.start({
      scale: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    });
  };

  const filterId = `liquid-filter-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <motion.feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            xChannelSelector="R" 
            yChannelSelector="G" 
            animate={controls}
            initial={{ scale: 0 }}
          />
        </filter>
      </svg>
      
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        animate={{
          scale: isHovered ? 1.05 : 1,
          filter: isHovered 
            ? `url(#${filterId}) saturate(1.2) brightness(1.1)` 
            : `url(#${filterId}) saturate(0.65) brightness(0.8)`
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          ...style,
          width: '100%',
          display: 'block',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}
