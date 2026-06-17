
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function SpotlightCard({ children, className = '', style = {} }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: style.borderRadius || '16px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
      }}
    >
      <div style={{ transform: 'translateZ(40px)', height: '100%' }}>
        {children}
      </div>

      {/* Holographic Glare Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.18) 0%, transparent 60%)',
          left: glareX,
          top: glareY,
          transform: 'translate(-50%, -50%)',
          width: '200%',
          height: '200%',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          zIndex: 10,
          opacity: useTransform(mouseXSpring, [-0.5, 0, 0.5], [1, 0, 1]), // Glare fades out slightly in center
        }}
      />
    </motion.div>
  );
}
