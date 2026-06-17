import { motion } from 'framer-motion';
import { useState, useId, useRef, useEffect } from 'react';

export default function LiquidImage({ src, alt, style }) {
  const [isHovered, setIsHovered] = useState(false);
  const [scale, setScale] = useState(0);
  const filterId = useId();
  const requestRef = useRef();

  useEffect(() => {
    let target = isHovered ? 25 : 0;
    
    const animate = () => {
      setScale(prev => {
        // Simple spring easing
        const next = prev + (target - prev) * 0.1;
        if (Math.abs(target - next) < 0.1) return target;
        requestRef.current = requestAnimationFrame(animate);
        return next;
      });
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            xChannelSelector="R" 
            yChannelSelector="G" 
            scale={scale}
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
