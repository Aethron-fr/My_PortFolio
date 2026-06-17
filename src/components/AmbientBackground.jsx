import { motion, useScroll, useTransform } from 'framer-motion';

export default function AmbientBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, 400]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -300]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -2, // Behind everything
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      <style>
        {`
          @keyframes aurora1 {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(10vw, -10vh) scale(1.2); }
            66% { transform: translate(-5vw, 5vh) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes aurora2 {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-10vw, 10vh) scale(0.9); }
            66% { transform: translate(5vw, -5vh) scale(1.2); }
            100% { transform: translate(0, 0) scale(1); }
          }
        `}
      </style>
      
      {/* Aurora Orbs */}
      <motion.div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '50vw',
        height: '50vw',
        background: 'var(--accent-primary)',
        filter: 'blur(130px)',
        opacity: 0.15,
        borderRadius: '50%',
        animation: 'aurora1 20s ease-in-out infinite',
        mixBlendMode: 'screen',
        y: y1,
      }} />
      <motion.div style={{
        position: 'absolute',
        bottom: '10%',
        right: '20%',
        width: '40vw',
        height: '40vw',
        background: 'var(--accent-violet)',
        filter: 'blur(120px)',
        opacity: 0.15,
        borderRadius: '50%',
        animation: 'aurora2 25s ease-in-out infinite',
        mixBlendMode: 'screen',
        y: y2,
      }} />

      {/* Cinematic Film Grain SVG Overlay */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.04,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      >
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.75" 
            numOctaves="3" 
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
