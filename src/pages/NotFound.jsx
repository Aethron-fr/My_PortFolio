import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  // Generate deterministic random values for particles so they are pure across renders
  const particles = useMemo(() => {
    return [...Array(15)].map(() => ({
      x: Math.random() * 200 - 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 1 + 'px',
      left: `${Math.random() * 100}%`
    }));
  }, []);

  useEffect(() => {
    document.title = '404 | SIGNAL LOST';
    return () => {
      document.title = 'Swapnadip Ghosh ?" Crafted Slowly';
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030712', // Deep space dark blue/black
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
      padding: '20px',
      textAlign: 'center'
    }}>
      {/* Background Cyber Grid */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0, 247, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 247, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.6,
        pointerEvents: 'none',
        transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
        transformOrigin: 'top center'
      }} />

      {/* Floating Hologram / Broken Server Component */}
      <motion.div
        animate={{ 
          y: [-20, 20, -20],
          rotateZ: [-5, 5, -5],
          opacity: [0.7, 1, 0.7],
          filter: ['drop-shadow(0px 0px 20px rgba(0,247,255,0.3))', 'drop-shadow(0px 0px 50px rgba(0,247,255,0.7))', 'drop-shadow(0px 0px 20px rgba(0,247,255,0.3))']
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ position: 'relative', zIndex: 2, marginBottom: '50px' }}
      >
        <motion.div
          animate={{ x: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 0.2, repeatType: 'mirror' }}
          style={{ display: 'inline-block' }}
        >
          <Cpu size={140} style={{ color: 'var(--accent-primary)', filter: 'drop-shadow(0 0 10px var(--accent-primary))' }} />
        </motion.div>
        <ShieldAlert 
          size={50} 
          style={{ 
            color: '#ff5f56', 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 0 15px #ff5f56)'
          }} 
        />
      </motion.div>

      {/* 404 Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 900,
          margin: '0 0 10px 0',
          letterSpacing: '8px',
          position: 'relative',
          zIndex: 2,
          color: 'transparent',
          WebkitTextStroke: '2px rgba(255,255,255,0.9)',
          textShadow: '0 0 30px rgba(0,247,255,0.5)'
        }}
      >
        404
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-primary)',
          fontSize: '1.2rem',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          marginBottom: '15px'
        }}>
          Signal Lost in the Void
        </p>
        
        <p style={{
          color: 'var(--text-dim)',
          fontSize: '1.1rem',
          maxWidth: '500px',
          margin: '0 auto 50px auto',
          lineHeight: '1.7',
          opacity: 0.8
        }}>
          The architectural coordinates you are seeking have collapsed or never existed in this timeline.
        </p>

        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,247,255,0.6)' }}
          whileTap={{ scale: 0.95 }}
          className="btn-neon-glow interactive"
          style={{
            padding: '18px 46px',
            fontSize: '1.15rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            border: '1px solid var(--accent-primary)',
            background: 'rgba(0,247,255,0.05)',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}
        >
          <Terminal size={22} color="var(--accent-primary)" />
          ESTABLISH UPLINK
        </motion.button>
      </motion.div>

      {/* Floating Dust Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['-100vh', '100vh'],
            x: p.x
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: 'rgba(0, 247, 255, 0.4)',
            borderRadius: '50%',
            left: p.left,
            top: '-10vh',
            boxShadow: '0 0 10px rgba(0,247,255,0.8)'
          }}
        />
      ))}
    </div>
  );
}
