import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  FileText,
  Code,
  Server,
  Database,
  Laptop,
  Send,
  Globe,
  Award,
  User,
  ArrowUpRight,
} from 'lucide-react';
import CanvasBackground from './components/CanvasBackground';
import CustomCursor from './components/CustomCursor';
import WelcomeModal from './components/WelcomeModal';
import Typewriter from './components/Typewriter';
import GithubProjects from './components/GithubProjects';
import DeveloperJourney from './components/DeveloperJourney';
import FeaturedSpotlight from './components/FeaturedSpotlight';
import CreativeInfluences from './components/CreativeInfluences';
import BeyondTheScreen from './components/BeyondTheScreen';
import { usePuzzle } from './context/PuzzleContext';
import './App.css';

// BUG-010: Single source of truth for nav hrefs — used by both desktop and mobile navs
const NAV_HREF_MAP = {
  'Home': '#home',
  'About': '#about',
  'Experience': '#experience',
  'Work': '#work',
  'Journey': '#journey',
  'Contact': '#contact',
};

const EXPLORING_PHRASES = [
  'currently rebuilding things.',
  'currently exploring quieter interfaces.',
  'currently awake at the wrong hours.',
  'currently thinking too much.',
  'currently making something slow.',
];

function CurrentlyExploring() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % EXPLORING_PHRASES.length);
        setVisible(true);
      }, 400);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
      color: 'var(--text-dim)', letterSpacing: '1.5px',
      marginBottom: '28px', minHeight: '18px',
      transition: 'opacity 0.4s ease',
      opacity: visible ? 1 : 0,
    }}>
      Currently exploring: {EXPLORING_PHRASES[idx]}
    </div>
  );
}

// BUG-005: Compute time-based greeting at module level (pure function, no side effects)
function getTimeGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)  return `good morning. it's ${h}:${String(new Date().getMinutes()).padStart(2,'0')}.`;
  if (h >= 12 && h < 17) return `good afternoon. it's ${h}:${String(new Date().getMinutes()).padStart(2,'0')}.`;
  if (h >= 17 && h < 22) return `good evening. it's ${h}:${String(new Date().getMinutes()).padStart(2,'0')}.`;
  return `late night. it's ${h}:${String(new Date().getMinutes()).padStart(2,'0')}.`;
}

// ── Premium Theme Toggle ─────────────────────────────────────────────────────
function ThemeToggle() {
  const [isNight, setIsNight] = useState(() => {
    return localStorage.getItem('_theme') !== 'light';
  });

  const [isHovered, setIsHovered] = useState(false);

  // High-tech UI mechanical click sound for tactile feedback
  const playTechClick = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // A sharp, high-tech 'snapping' frequency drop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isNight ? 900 : 1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch(e) {
      // Ignore audio errors silently
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    if (isNight) {
      root.removeAttribute('data-theme');
      root.style.removeProperty('background-color');
    } else {
      root.setAttribute('data-theme', 'light');
      root.style.removeProperty('background-color');
    }
    localStorage.setItem('_theme', isNight ? 'night' : 'light');
    const t = setTimeout(() => root.classList.remove('theme-transitioning'), 600);
    return () => clearTimeout(t);
  }, [isNight]);

  const handleToggle = () => {
    playTechClick();
    setIsNight(!isNight);
  };

  return (
    <motion.button
      onClick={handleToggle}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ 
        scale: 1.08, 
        y: -5,
      }}
      // Extreme mechanical spring compression on tap
      whileTap={{ scale: 0.7, rotate: 180, transition: { type: 'spring', stiffness: 500, damping: 15 } }} 
      aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 9998,
        width: 56, // Slightly larger for better touch target
        height: 56,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: isHovered 
          ? 'rgba(255,255,255,0.4)' 
          : 'rgba(255,255,255,0.08)',
        outline: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isNight
          ? 'rgba(10, 12, 22, 0.55)'
          : 'rgba(255, 255, 255, 0.1)', // Brighter, clearer glass in day mode
        boxShadow: isHovered
          ? (isNight ? '0 20px 40px rgba(80,120,255,0.5), inset 0 2px 0 rgba(255,255,255,0.2)' : '0 20px 40px rgba(255,180,30,0.5), inset 0 2px 0 rgba(255,255,255,0.4)')
          : (isNight ? '0 8px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'),
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 3D Gyroscope Container */}
      <div style={{
        position: 'absolute', inset: -32, 
        perspective: '600px', 
        pointerEvents: 'none', 
        zIndex: -1,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        
        {/* Outer 3D Orbit - Sweeping Comet Trail */}
        <motion.div
          animate={{ 
            rotateX: isHovered ? 0 : 65, 
            rotateY: isHovered ? 0 : 25, 
            rotateZ: 360 
          }}
          transition={{ 
            rotateZ: { duration: isHovered ? 3 : 10, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: 0.5, type: 'spring', stiffness: 300, damping: 20 },
            rotateY: { duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }
          }}
          style={{
            position: 'absolute', inset: 4,
            borderRadius: '50%',
            border: '1px solid',
            borderColor: isNight ? 'rgba(100,160,255,0.1)' : 'rgba(255,180,50,0.1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Sweeping Neon Trail */}
          <div style={{
            position: 'absolute', inset: -2, borderRadius: '50%',
            background: isNight ? 'conic-gradient(from 0deg, transparent 60%, rgba(100,160,255,0.3) 85%, rgba(160,210,255,1) 100%)' : 'conic-gradient(from 0deg, transparent 60%, rgba(255,180,50,0.3) 85%, rgba(255,230,100,1) 100%)',
            WebkitMaskImage: 'radial-gradient(transparent 66%, black 67%)',
            maskImage: 'radial-gradient(transparent 66%, black 67%)',
            filter: isNight ? 'drop-shadow(0 0 8px rgba(100,150,255,0.8))' : 'drop-shadow(0 0 8px rgba(255,180,50,0.8))'
          }} />
          
          {/* Tactical Crosshairs (appear only on hover) */}
          <motion.div animate={{ opacity: isHovered ? 1 : 0 }} style={{ position: 'absolute', top: -3, left: '50%', marginLeft: -1, width: 2, height: 6, background: isNight ? '#8cb4ff' : '#ffb432' }} />
          <motion.div animate={{ opacity: isHovered ? 1 : 0 }} style={{ position: 'absolute', bottom: -3, left: '50%', marginLeft: -1, width: 2, height: 6, background: isNight ? '#8cb4ff' : '#ffb432' }} />
          <motion.div animate={{ opacity: isHovered ? 1 : 0 }} style={{ position: 'absolute', left: -3, top: '50%', marginTop: -1, height: 2, width: 6, background: isNight ? '#8cb4ff' : '#ffb432' }} />
          <motion.div animate={{ opacity: isHovered ? 1 : 0 }} style={{ position: 'absolute', right: -3, top: '50%', marginTop: -1, height: 2, width: 6, background: isNight ? '#8cb4ff' : '#ffb432' }} />
        </motion.div>

        {/* Inner 3D Orbit - Counter-spinning Dashed Trail */}
        <motion.div
          animate={{ 
            rotateX: isHovered ? 0 : -55, 
            rotateY: isHovered ? 0 : -30, 
            rotateZ: -360 
          }}
          transition={{ 
            rotateZ: { duration: isHovered ? 2 : 7, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: 0.5, type: 'spring', stiffness: 300, damping: 20 },
            rotateY: { duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }
          }}
          style={{
            position: 'absolute', inset: 12,
            borderRadius: '50%',
            border: '1.5px dashed',
            borderColor: isNight ? 'rgba(140,180,255,0.15)' : 'rgba(255,200,80,0.15)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Inner White Comet Tail */}
          <div style={{
            position: 'absolute', inset: -2, borderRadius: '50%',
            background: 'conic-gradient(from 180deg, transparent 70%, rgba(255,255,255,0.3) 95%, rgba(255,255,255,1) 100%)',
            WebkitMaskImage: 'radial-gradient(transparent 65%, black 66%)',
            maskImage: 'radial-gradient(transparent 65%, black 66%)',
            filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.9))'
          }} />
        </motion.div>
      </div>
      {/* Dynamic ambient backdrop that blooms on hover */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.9 : 0.15,
          scale: isHovered ? 1.6 : 1,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: isNight
            ? 'radial-gradient(circle, rgba(100,150,255,0.35) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(255,200,50,0.35) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <AnimatePresence mode="wait">
        {isNight ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5, filter: 'blur(4px)' }}
            animate={{ opacity: 1, rotate: isHovered ? -15 : 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 400, damping: 25 }}
            style={{ zIndex: 1 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z"
                fill={isHovered ? "#fff" : "rgba(220,230,255,0.9)"}
                filter={isHovered ? "drop-shadow(0 0 10px rgba(160,200,255,1))" : "none"}
                style={{ transition: 'all 0.3s ease' }}
              />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5, filter: 'blur(4px)' }}
            animate={{ opacity: 1, rotate: isHovered ? 45 : 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 400, damping: 25 }}
            style={{ zIndex: 1 }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" fill={isHovered ? "#fff" : "rgba(255,210,40,1)"} style={{ transition: 'all 0.3s ease' }} />
              {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={12 + 7.5 * Math.cos(rad)} y1={12 + 7.5 * Math.sin(rad)}
                    x2={12 + 9.5 * Math.cos(rad)} y2={12 + 9.5 * Math.sin(rad)}
                    stroke={isHovered ? "#fff" : "rgba(255,200,40,0.9)"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                );
              })}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}



export default function App() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Show the welcome modal only on the very first visit — localStorage persists across reloads
  const [hasEntered, setHasEntered] = useState(
    () => localStorage.getItem('_portfolio_visited') === '1'
  );
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  // BUG-005: timeGreeting now computed and displayed properly
  const [timeGreeting] = useState(getTimeGreeting);
  const [showHint, setShowHint] = useState(false);

  const progressBarRef = useRef(null);

  useEffect(() => {
    // Hint fades in after 3 seconds, stays for 8, then vanishes forever.
    const t1 = setTimeout(() => setShowHint(true), 3000);
    const t2 = setTimeout(() => setShowHint(false), 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Disable automatic scroll restoration, reset scroll to top on reload, and clear URL hash
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Clear URL hash to make sure the site opens at Home on reload
    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  // Monitor scroll for header styling & progress
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          
          const progressBar = progressBarRef.current;
          if (progressBar) {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
            progressBar.style.width = `${scrollPercent}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // BUG-004: Removed fake Google Sign-In — it was a simulation that never called Firebase.
  // The email field is now editable so users can type their email directly.

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    // BUG-003: Proper validation including email format check
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return;
    if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      setSubmitError('Please enter a valid email address.');
      setTimeout(() => setSubmitError(false), 4000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch("https://formsubmit.co/ajax/ghoshswapnadip7@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          _subject: `New Portfolio Message from ${contactForm.name}`,
          _captcha: "false"
        })
      });

      const data = await res.json();

      if (data.success === "true" || data.success === true) {
        setSubmitSuccess(true);
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 6000);
      } else {
        throw new Error(data.message || "failed");
      }
    } catch {
      // Fallback: open pre-filled mailto so message is never lost
      const subject = encodeURIComponent(`Portfolio message from ${contactForm.name}`);
      const body = encodeURIComponent(`Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`);
      window.open(`mailto:ghoshswapnadip7@gmail.com?subject=${subject}&body=${body}`);
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };


  const skillsList = [
    { name: 'HTML5 & CSS3', level: '95%', icon: <Globe size={24} style={{ color: 'var(--accent-cyber)' }} />, desc: 'Semantic layouts & advanced responsive styling' },
    { name: 'JavaScript (ES6+)', level: '90%', icon: <Code size={24} style={{ color: 'var(--accent-primary)' }} />, desc: 'Modern reactive architecture & functional programming' },
    { name: 'React.js', level: '85%', icon: <Laptop size={24} style={{ color: 'var(--accent-cyber)' }} />, desc: 'High-performance UI & modular context logic' },
    { name: 'Node.js & Express', level: '80%', icon: <Server size={24} style={{ color: 'var(--accent-violet)' }} />, desc: 'Scalable REST APIs & token auth systems' },
    { name: 'Python & Django', level: '85%', icon: <Database size={24} style={{ color: 'var(--accent-secondary)' }} />, desc: 'Secure database models & MVC core architecture' },
    { name: 'Git & GitHub', level: '90%', icon: <i className="fa-brands fa-github" style={{ fontSize: '24px', color: 'var(--text-primary)' }}></i>, desc: 'Version pipelines & collaborative team integrations' }
  ];
  const navItems = ['Home', 'About', 'Experience', 'Work', 'Journey'];

  return (
    <>
      <CustomCursor />
      <CanvasBackground />

      <AnimatePresence>
        {!hasEntered && (
          <WelcomeModal
            key="welcome"
            onEnter={() => {
              // Mark as visited so the modal never shows again on this device
              localStorage.setItem('_portfolio_visited', '1');
              setHasEntered(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* BUG-019: Scroll Progress Indicator — only visible after entering the site */}
      {hasEntered && (
        <div 
          ref={progressBarRef} 
          style={{
            position: 'fixed', top: 0, left: 0,
            height: '2px', width: '0%',
            background: 'linear-gradient(90deg, rgba(180,40,70,0.8), rgba(200,60,90,0.6))',
            boxShadow: '0 0 8px rgba(180,40,70,0.55), 0 0 2px rgba(180,40,70,0.9)',
            zIndex: 9999,
            transition: 'width 0.08s linear',
          }}
        />
      )}

      {/* NAVBAR */}
      <header 
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%',
          zIndex: 1000,
          transition: 'all 0.4s var(--transition-smooth)',
          background: scrolled ? 'rgba(6, 6, 10, 0.8)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          padding: scrolled ? '14px 0' : '22px 0',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 400,
                fontFamily: 'var(--font-heading)',
                background: 'var(--insta-gradient)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0px'
              }}>
                Swapnadip
              </span>
            </a>

            {/* Build Status */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, padding: '4px 10px',
            }} className="desktop-only-flex">
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'rgba(80, 200, 120, 0.8)',
                boxShadow: '0 0 6px rgba(80, 200, 120, 0.6)',
                animation: 'pulse 2.5s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                color: 'var(--text-dim)', letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}>
                Build Active
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          {/* BUG-018: Using CSS class for hover instead of fragile onMouseOver/onMouseOut */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-only-flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={NAV_HREF_MAP[item] || `#${item.toLowerCase()}`}
                className="nav-link"
              >
                {item}
              </a>
            ))}
            <a href="#contact" className="btn-neon-outline" style={{ padding: '7px 18px', fontSize: '0.82rem' }}>
              Contact
            </a>
          </nav>

          {/* Mobile Hamburguer Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '28px',
              height: '20px',
              position: 'relative',
              zIndex: 10000,
            }}
            className="mobile-only-block"
            aria-label="Toggle Menu"
          >
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              background: '#fff',
              borderRadius: '2px',
              left: 0,
              top: mobileMenuOpen ? '50%' : '20%',
              transform: mobileMenuOpen ? 'translateY(-50%) rotate(45deg)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
            }} />
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              background: '#fff',
              borderRadius: '2px',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: mobileMenuOpen ? 0 : 1,
              transition: 'all 0.2s'
            }} />
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              background: '#fff',
              borderRadius: '2px',
              left: 0,
              bottom: mobileMenuOpen ? '50%' : '20%',
              transform: mobileMenuOpen ? 'translateY(50%) rotate(-45deg)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
            }} />
          </button>
        </div>
      </header>

      {/* MOBILE TRANSITORY NAV OVERLAY */}
      {/* BUG-010: Mobile nav now uses same NAV_HREF_MAP as desktop for consistency */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(6, 6, 10, 0.95)',
            backdropFilter: 'blur(30px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px',
            animation: 'fadeIn 0.3s var(--transition-smooth)'
          }}
          data-overlay="true"
        >
          {navItems.map((item) => (
            <a 
              key={item}
              href={NAV_HREF_MAP[item] || `#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '1.6rem',
                fontWeight: '400',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '1px'
              }}
            >
              {item}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="btn-neon-glow" 
            style={{ width: '80%', maxWidth: '280px' }}
          >
            Connect Now
          </a>
        </div>
      )}

      {/* HERO SECTION */}
      <section id="home" className="hero-section" style={{ background: 'var(--bg-hero)' }}>
        <div className="hero-glow-blob" />
        <div className="hero-content">
          {/* Time greeting */}
          {timeGreeting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: 'var(--text-dim)', letterSpacing: '2px',
                marginBottom: '20px',
              }}
            >
              {timeGreeting}
            </motion.div>
          )}

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw + 1rem, 3.8rem)',
            fontWeight: 300,
            lineHeight: 1.3,
            marginBottom: '16px',
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)'
          }}>
            Swapnadip Ghosh
          </h1>

          <div style={{
            fontSize: 'calc(0.9rem + 0.4vw)',
            fontWeight: '300',
            color: 'var(--text-muted)',
            marginBottom: '24px',
            minHeight: '36px',
            letterSpacing: '0px'
          }}>
            I am a <Typewriter
              words={['Full Stack Developer', 'MERN Stack Engineer', 'Python Specialist', 'UI Animator']}
              speed={80}
              delay={2200}
            />
          </div>

          {/* Currently Exploring */}
          <CurrentlyExploring />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <a href="#work" className="btn-neon-glow">View Work</a>
            <a href="#contact" className="btn-neon-outline">Contact</a>
          </div>

          {/* Social icons */}
          {/* BUG-016: Added aria-label to all social icon links for screen reader accessibility */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            {[
              { icon: <i className="fa-brands fa-github" style={{ fontSize: '20px' }} aria-hidden="true"></i>, label: 'GitHub', link: 'https://github.com/Aethron-fr' },
              { icon: <i className="fa-brands fa-linkedin-in" style={{ fontSize: '20px' }} aria-hidden="true"></i>, label: 'LinkedIn', link: 'https://www.linkedin.com/in/swapnadip-ghosh-3669b33a1/' },
              { icon: <i className="fa-brands fa-instagram" style={{ fontSize: '20px' }} aria-hidden="true"></i>, label: 'Instagram', link: 'https://www.instagram.com/its_swapnadip108/' },
              { icon: <i className="fa-brands fa-x-twitter" style={{ fontSize: '20px' }} aria-hidden="true"></i>, label: 'X (Twitter)', link: 'https://x.com/swapnadip_108' },
              { icon: <Mail size={20} aria-hidden="true" />, label: 'Email', link: 'mailto:ghoshswapnadip7@gmail.com' }
            ].map((soc) => (
              <a 
                key={soc.label}
                href={soc.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={soc.label}
                className="social-icon-link"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={{
        position: 'relative', zIndex: 2,
        padding: '80px 0 60px',
        background: 'var(--bg-section)',
      }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            letterSpacing: '5px', color: 'var(--text-dim)',
            textTransform: 'uppercase', marginBottom: 28,
          }}>
            About
          </div>
          <p style={{
            fontSize: '1.05rem', color: 'var(--text-muted)',
            lineHeight: 1.9, fontWeight: 300, marginBottom: 20,
            maxWidth: 640,
          }}>
            Full Stack Developer based in West Bengal, India. I work across React, Node, and Python —
            building interfaces that feel considered. Fast, intentional, and honest in how they move.
          </p>
          <p style={{
            fontSize: '0.95rem', color: 'var(--text-dim)',
            lineHeight: 1.9, fontWeight: 300, maxWidth: 600,
          }}>
            Currently focused on cinematic UI systems, motion design, and the quiet engineering
            that makes both possible.
          </p>
        </div>
      </section>

      {/* FEATURED EXPERIENCE — OneLastSmile */}
      <section id="experience" style={{
        position: 'relative', zIndex: 2,
        padding: '60px 0 80px',
        background: 'var(--bg-section-alt)',
      }}>
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'rgba(180,50,75,0.6)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Featured Experience
            </div>
            <h2 style={{
              fontSize: '1.6rem', fontWeight: 400,
              color: 'var(--text-secondary)',
              letterSpacing: '-0.5px', margin: 0,
            }}>
              A project built outside the ordinary.
            </h2>
          </div>
          <FeaturedSpotlight />
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="work" style={{
        position: 'relative', zIndex: 2,
        padding: '60px 0 80px',
        background: 'var(--bg-section)',
      }}>
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'var(--text-dim)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Selected Work
            </div>
            <h2 style={{
              fontSize: '1.6rem', fontWeight: 400,
              color: 'var(--text-muted)',
              letterSpacing: '-0.5px', margin: 0,
            }}>
              Open source and shipped work from the GitHub archive.
            </h2>
          </div>
          <GithubProjects />
        </div>
      </section>

      {/* CREATIVE INFLUENCES */}
      <CreativeInfluences />

      {/* BEYOND THE SCREEN */}
      <BeyondTheScreen />

      {/* DEVELOPER JOURNEY */}
      <section id="journey" className="section-padding" style={{ position: 'relative', zIndex: 2, background: 'var(--bg-section-alt)' }}>
        <div className="container">
          {/* Section header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'var(--text-dim)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Background
            </div>
            <h2 style={{
              fontSize: '1.6rem', fontWeight: 400,
              color: 'var(--text-muted)',
              letterSpacing: '-0.5px', margin: 0,
            }}>
              Who I am and how I got here.
            </h2>
          </div>

          {/* Bio + Philosophy grid */}
          <div className="bento-grid" style={{ marginBottom: '52px' }}>
            {/* Panel 1: Bio */}
            <div
              className="glass-panel"
              style={{ gridColumn: 'span 8', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyber)', marginBottom: '14px' }}>
                <User size={18} />
                <span style={{ fontWeight: '600', letterSpacing: '1px', fontSize: '0.78rem', textTransform: 'uppercase', opacity: 0.7 }}>Profile</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '16px', color: 'var(--text-primary)' }}>Swapnadip Ghosh</h3>
              <p style={{ lineHeight: '1.8', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Full Stack Developer based in West Bengal, India. I work across React, Node, and Python —
                writing interfaces that load fast, animate cleanly, and hold up under real conditions.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--text-dim)', fontSize: '0.92rem' }}>
                I'm most interested in the intersection of engineering quality and interaction design —
                where the code is invisible and only the experience remains.
              </p>
            </div>

            {/* Panel 2: Philosophy */}
            <div
              className="glass-panel"
              style={{ gridColumn: 'span 4', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-secondary)', marginBottom: '14px' }}>
                <Award size={18} />
                <span style={{ fontWeight: '600', letterSpacing: '1px', fontSize: '0.78rem', textTransform: 'uppercase', opacity: 0.7 }}>Philosophy</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                "Serious about the craft. Not about the performance of it."
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.7' }}>
                Good interfaces feel obvious in hindsight. Getting there takes obsessive iteration.
              </p>
            </div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '52px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '4px', color: 'var(--text-dim)',
              textTransform: 'uppercase', marginBottom: 28,
            }}>
              Core Stack
            </div>
            <div className="skills-grid">
              {skillsList.map((skill, idx) => (
                <div key={idx} className="skill-card">
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '10px',
                    background: 'var(--bg-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-glass)', marginBottom: '10px'
                  }}>
                    {skill.icon}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{skill.name}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.4', margin: '4px 0 0 0' }}>{skill.desc}</p>
                  <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ width: skill.level, height: '100%', background: 'var(--insta-gradient)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '4px', color: 'var(--text-dim)',
              textTransform: 'uppercase', marginBottom: 28,
            }}>
              Timeline
            </div>
            <DeveloperJourney />
          </div>

        </div>
      </section>


      {/* NOW SECTION */}
      <section style={{
        position: 'relative', zIndex: 2,
        padding: '52px 0 48px',
        background: 'var(--bg-section-alt)',
        borderTop: '1px solid var(--border-glass)',
      }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'var(--text-dim)',
              textTransform: 'uppercase',
            }}>
              Now
            </div>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'rgba(80, 200, 120, 0.7)',
              boxShadow: '0 0 8px rgba(80, 200, 120, 0.5)',
              animation: 'pulse 2.5s ease-in-out infinite',
              flexShrink: 0,
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Building', value: 'OneLastSmile — cinematic interaction experience' },
              { label: 'Exploring', value: 'Environmental storytelling and motion design systems' },
              { label: 'Learning', value: 'WebGL fundamentals, advanced Framer Motion patterns' },
              { label: 'Status', value: 'Open to internships and collaboration' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  color: 'var(--text-dim)', letterSpacing: '2px',
                  minWidth: 72, textTransform: 'uppercase',
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: '0.88rem', color: 'var(--text-muted)',
                  fontWeight: 300, lineHeight: 1.6,
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section-padding" style={{
        position: 'relative', zIndex: 2,
        background: 'var(--bg-section)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'var(--text-dim)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Contact
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, letterSpacing: '-0.5px', marginBottom: 12 }}>Get in touch.</h2>
            <p style={{ maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.8 }}>
              Open to work, collaboration, or just a conversation about building things well.
            </p>
          </div>

          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
            {/* Direct details */}
            <div className="glass-panel" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <img 
                  src="/favicon.jpg" 
                  alt="Swapnadip Ghosh" 
                  className="avatar-glow"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid var(--accent-primary)',
                    boxShadow: '0 0 15px rgba(225, 48, 108, 0.45)',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px' }}>Swapnadip Ghosh</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '400', letterSpacing: '0.5px', fontFamily: 'var(--font-mono)' }}>Full Stack Developer</span>
                </div>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.8', marginBottom: '28px', color: 'var(--text-muted)', fontWeight: '300' }}>
                Open to work, collaboration, or just a conversation about building things well. Email is always the best channel.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: 3 }}>email</div>
                    <a href="mailto:ghoshswapnadip7@gmail.com" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '400', wordBreak: 'break-word', display: 'block', paddingRight: '10px' }}>
                      ghoshswapnadip7@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <Globe size={15} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: 3 }}>based in</div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '400' }}>
                      West Bengal, India
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <FileText size={15} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: 3 }}>resume</div>
                    {/* BUG-014: Fixed Download CV link — now points to actual PDF */}
                    <a href="/resume.pdf" download="Swapnadip_Ghosh_Resume.pdf" className="interactive" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Download CV</span>
                      <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            {/* BUG-004: Removed fake Google auth gate. BUG-006: Email is now editable. */}
            {/* BUG-017: Labels linked to inputs via htmlFor/id pairs */}
            <div className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.72rem', fontWeight: '500', color: 'var(--text-dim)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Swarnadip Mitra"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="contact-input"
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.72rem', fontWeight: '500', color: 'var(--text-dim)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Email
                  </label>
                  {/* BUG-003/006: Email field is now editable — removed readOnly */}
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="contact-input"
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.72rem', fontWeight: '500', color: 'var(--text-dim)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="What's on your mind?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="contact-input"
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      lineHeight: '1.5',
                      resize: 'none',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-neon-glow"
                  style={{ width: '100%', gap: '8px', marginTop: '10px' }}
                >
                  <Send size={15} style={{ opacity: 0.7 }} />
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>

                {submitSuccess && (
                  <div role="status" style={{ padding: '12px 16px', background: 'rgba(80,200,120,0.06)', border: '1px solid rgba(80,200,120,0.18)', color: 'rgba(140,220,160,0.85)', borderRadius: '10px', fontSize: '0.85rem', textAlign: 'center' }}>
                    Sent. I&apos;ll get back to you soon.
                  </div>
                )}
                {submitError && (
                  <div role="alert" style={{ padding: '12px 16px', background: 'rgba(225,48,108,0.06)', border: '1px solid rgba(225,48,108,0.2)', color: 'rgba(225,130,150,0.9)', borderRadius: '10px', fontSize: '0.85rem', textAlign: 'center' }}>
                    {submitError}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="main-footer" style={{ position: 'relative', zIndex: 2, padding: '120px 0 80px', background: 'var(--bg-footer)' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--text-dim)', letterSpacing: '3px',
            margin: 0, fontWeight: 300, textTransform: 'lowercase',
          }}>
            quietly becoming something.
          </p>
        </div>
      </footer>

      {/* ── SUBTLE HINT (Ghost Popup) ── */}
      <AnimatePresence>
        {showHint && (
          <motion.div 
            className="desktop-only-flex"
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 3, ease: 'easeInOut' }}
            style={{
              position: 'fixed', bottom: 32, left: 32, zIndex: 90,
              pointerEvents: 'none',
            }}
          >
            <span style={{ 
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem', 
              color: 'var(--text-dim)', letterSpacing: '2px',
              textTransform: 'lowercase', lineHeight: 1.6
            }}>
              there is a memory hidden in the architecture.<br/>
              pay attention to the quiet parts.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Day / Night Mode Toggle ─────────────────────────────────────────── */}
      <ThemeToggle />


      {/* BUG-015: Removed inline <style> block — all styles now live in App.css to avoid
           duplication and conflicting breakpoints (was 1024px here vs 768px in App.css) */}
    </>
  );
}
