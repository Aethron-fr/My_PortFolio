import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
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
  Sun,
  Moon,
} from 'lucide-react';
import CanvasBackground from './components/CanvasBackground';
import CustomCursor from './components/CustomCursor';
import WelcomeModal from './components/WelcomeModal';
import Typewriter from './components/Typewriter';
import StardustTrail from './components/StardustTrail';
import GitHubGraph from './components/GitHubGraph';
import KonamiCode from './components/KonamiCode';
import TechSphere from './components/TechSphere';
import MagneticWrapper from './components/MagneticWrapper';
import TerminalMode from './components/TerminalMode';
import AmbientBackground from './components/AmbientBackground';
import ResumeViewer from './components/ResumeViewer';
import Preloader from './components/Preloader';
import LiveCursors from './components/LiveCursors';
import ScrollSkewWrapper from './components/ScrollSkewWrapper';
import TechStackBento from './components/TechStackBento';
const GithubProjects = lazy(() => import('./components/GithubProjects'));
const DeveloperJourney = lazy(() => import('./components/DeveloperJourney'));
const FeaturedSpotlight = lazy(() => import('./components/FeaturedSpotlight'));
const CreativeInfluences = lazy(() => import('./components/CreativeInfluences'));
const BeyondTheScreen = lazy(() => import('./components/BeyondTheScreen'));
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
  'rebuilding things.',
  'exploring quieter interfaces.',
  'awake at the wrong hours.',
  'thinking too much.',
  'making something slow.',
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
      display: 'inline-flex', alignItems: 'center', gap: '10px',
      fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
      color: 'var(--text-dim)', letterSpacing: '2px',
      marginBottom: '36px', minHeight: '24px',
      transition: 'opacity 0.4s ease',
      opacity: visible ? 1 : 0,
      textTransform: 'uppercase'
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 12px var(--accent-primary)' }} />
      currently {EXPLORING_PHRASES[idx]}
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
    setIsNight(!isNight);
  };

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}>
      <MagneticWrapper intensity={0.3}>
        <motion.button
          onClick={handleToggle}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}
          style={{
            position: 'relative',
            width: 52, height: 52, borderRadius: '50%',
            border: `1px solid ${isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
            outline: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isNight ? 'rgba(10,12,22,0.60)' : 'rgba(255,255,255,0.8)',
            boxShadow: isHovered
              ? (isNight ? '0 8px 24px rgba(80,120,255,0.3)' : '0 8px 24px rgba(255,180,30,0.3)')
              : '0 4px 12px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        color: isNight ? '#E2E8F0' : '#475569',
        transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Pulsing Aura Effect */}
      <motion.div
        animate={{ scale: isHovered ? 1.5 : [1, 1.2, 1], opacity: isHovered ? 0.6 : [0.2, 0.4, 0.2] }}
        transition={{ duration: isHovered ? 0.3 : 3, repeat: isHovered ? 0 : Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%', zIndex: -1, pointerEvents: 'none',
          background: isNight ? 'radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
          filter: 'blur(4px)'
        }}
      />
      <AnimatePresence mode="wait">
        {isNight ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.3, type: 'spring' }}
          >
            <Moon size={22} strokeWidth={1.5} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.3, type: 'spring' }}
          >
            <Sun size={22} strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>
        </motion.button>
      </MagneticWrapper>
    </div>
  );
}

// ── X-Ray Architecture Mode Toggle ───────────────────────────────────────────
function XRayToggle() {
  const [isXRay, setIsXRay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const [devStats, setDevStats] = useState({ w: 0, h: 0, nodes: 0 });

  // Show intro hint for 6 seconds on mount
  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isXRay) {
      document.body.classList.add('xray-mode');
      const updateStats = () => {
        setDevStats({
          w: window.innerWidth,
          h: window.innerHeight,
          nodes: document.querySelectorAll('*').length
        });
      };
      updateStats();
      window.addEventListener('resize', updateStats);
      return () => {
        window.removeEventListener('resize', updateStats);
        document.body.classList.remove('xray-mode');
      };
    } else {
      document.body.classList.remove('xray-mode');
    }
  }, [isXRay]);

  return (
    <>
      {/* Developer Stats Overlay */}
      <AnimatePresence>
        {isXRay && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              position: 'fixed', top: 32, left: 32, zIndex: 99999,
              background: 'rgba(1, 3, 9, 0.95)',
              border: '1px solid rgba(0, 247, 255, 0.4)',
              padding: '16px 20px', borderRadius: '8px',
              color: '#00f7ff', fontFamily: 'var(--font-mono)', fontSize: '11px',
              boxShadow: '0 0 30px rgba(0,247,255,0.15), inset 0 0 10px rgba(0,247,255,0.1)',
              pointerEvents: 'none'
            }}
          >
            <div style={{ marginBottom: 12, borderBottom: '1px dashed rgba(0,247,255,0.3)', paddingBottom: 6, fontWeight: 'bold', letterSpacing: '1px' }}>
              ► REACT DEVTOOLS :: X-RAY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '6px 24px', opacity: 0.8 }}>
              <span>Viewport:</span> <span>{devStats.w} × {devStats.h}</span>
              <span>DPR:</span> <span>{window.devicePixelRatio}x</span>
              <span>DOM Nodes:</span> <span>{devStats.nodes}</span>
              <span>Render Target:</span> <span>60 FPS</span>
              <span>React Engine:</span> <span>v18.2.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'fixed', bottom: 32, left: 32, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>

      {/* Intro tooltip */}
      <AnimatePresence>
        {(showIntro || isHovered) && (
          <motion.div
            key="xray-tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: 64,
              left: 0,
              whiteSpace: 'nowrap',
              background: 'rgba(1, 3, 9, 0.95)',
              border: '1px solid rgba(0,247,255,0.4)',
              borderRadius: 8,
              padding: '8px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '1px',
              color: '#00f7ff',
              boxShadow: '0 0 20px rgba(0,247,255,0.2)',
              pointerEvents: 'none',
            }}
          >
            {isXRay ? '◆ X-RAY ACTIVE — click to restore' : '◆ X-RAY MODE — see the architecture'}
            <div style={{
              position: 'absolute', bottom: -5, left: 20,
              width: 8, height: 8, background: 'rgba(1,3,9,0.95)',
              border: '1px solid rgba(0,247,255,0.4)',
              borderTop: 'none', borderLeft: 'none',
              transform: 'rotate(45deg)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      <MagneticWrapper intensity={0.3}>
        <div style={{ position: 'relative' }}>
          {/* Animated pulse ring when active */}
          {isXRay && (
            <>
              <motion.div
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                style={{
                  position: 'absolute', inset: -2, borderRadius: '50%',
                  border: '2px solid rgba(0,247,255,0.6)',
                  pointerEvents: 'none',
                }}
              />
              <motion.div
                animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: 'easeOut' }}
                style={{
                  position: 'absolute', inset: -2, borderRadius: '50%',
                  border: '2px solid rgba(0,247,255,0.3)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}

          <motion.button
            onClick={() => setIsXRay(!isXRay)}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: isXRay ? 360 : 0,
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            aria-label="Toggle X-Ray Architecture Mode"
            style={{
              position: 'relative',
              width: 52, height: 52, borderRadius: '50%',
              border: isXRay
                ? '2px solid rgba(0,247,255,0.9)'
                : `1px solid ${isHovered ? 'rgba(0,247,255,0.6)' : 'rgba(0,247,255,0.2)'}`,
              outline: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isXRay
                ? 'linear-gradient(135deg, rgba(0,247,255,0.15), rgba(255,48,108,0.08))'
                : isHovered
                  ? 'rgba(0,247,255,0.06)'
                  : 'rgba(10,12,22,0.80)',
              boxShadow: isXRay
                ? '0 0 30px rgba(0,247,255,0.5), inset 0 0 20px rgba(0,247,255,0.1)'
                : isHovered
                  ? '0 8px 24px rgba(0,247,255,0.25)'
                  : '0 4px 12px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(12px)',
              color: isXRay ? '#00f7ff' : isHovered ? '#00f7ff' : '#475569',
              transition: 'all 0.3s ease',
            }}
          >
            <AnimatePresence mode="wait">
              {isXRay ? (
                <motion.div key="active" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Code size={20} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div key="inactive" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Code size={20} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </MagneticWrapper>

      {/* Label below button */}
      <motion.span
        animate={{ opacity: isHovered || isXRay ? 1 : 0 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.48rem',
          letterSpacing: '2px',
          color: isXRay ? '#00f7ff' : 'var(--text-dim)',
          textTransform: 'uppercase',
          textShadow: isXRay ? '0 0 8px rgba(0,247,255,0.6)' : 'none',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {isXRay ? 'X-RAY ON' : 'X-RAY'}
      </motion.span>
    </div>
    </>
  );
}


export default function App() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Show the welcome modal only on the very first visit — localStorage persists across reloads
  const [hasEntered, setHasEntered] = useState(
    () => localStorage.getItem('_portfolio_visited') === '1'
  );
  const [scrolled, setScrolled] = useState(false);

  // ── Global Mouse Tracker for Spotlight & Glare Effects ──
  useEffect(() => {
    let frameId;
    const handleGlobalMouseMove = (e) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isPreloaderDone, setIsPreloaderDone] = useState(
    () => !!sessionStorage.getItem('preloader_done')
  );
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  // BUG-005: timeGreeting now computed and displayed properly
  const [timeGreeting, setTimeGreeting] = useState(getTimeGreeting);

  useEffect(() => {
    const timer = setInterval(() => setTimeGreeting(getTimeGreeting()), 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  const [showHint, setShowHint] = useState(false);

  const progressBarRef = useRef(null);

  // Tab visibility title changer
  useEffect(() => {
    let originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Don't leave yet! 🚀";
      } else {
        document.title = originalTitle;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // (Removed hostile UX event listeners that blocked Right-Click and F12 per audit)



  useEffect(() => {
    // Hint fades in after 3 seconds, stays for 8, then vanishes forever.
    const t1 = setTimeout(() => setShowHint(true), 3000);
    const t2 = setTimeout(() => setShowHint(false), 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ── Ultra-Premium Buttery Smooth Scrolling (Lenis) ──
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
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
            progressBar.style.height = `${scrollPercent}%`;
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
    
    // AUDIT-FIX: Honeypot check for bots
    if (contactForm.honey) {
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', message: '', honey: '' });
      setTimeout(() => setSubmitSuccess(false), 6000);
      return; // Silently drop bot submission
    }

    if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      setSubmitError('Please enter a valid email address.');
      setTimeout(() => setSubmitError(false), 4000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(false);

    try {
      // BUG-FIX: Replaced unreliable formsubmit with Web3Forms for guaranteed email delivery
      // Note: Get your free key from https://web3forms.com
      const ACCESS_KEY = "04014102-8895-411b-90e3-db279b85eb44";
      
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          subject: `Portfolio Message from ${contactForm.name}`
        })
      });

      const data = await res.json();

      if (data.success) {
        setSubmitSuccess(true);
        setContactForm({ name: '', email: '', message: '', honey: '' });
        setTimeout(() => setSubmitSuccess(false), 6000);
      } else {
        if (ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
          console.warn("Please add your Web3Forms access key.");
        }
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
      {!isPreloaderDone && <Preloader onComplete={() => setIsPreloaderDone(true)} />}
      
      {isPreloaderDone && (
        <>
          <LiveCursors />
          <AmbientBackground />
      <ResumeViewer />
      <CustomCursor />
      <StardustTrail />
      <KonamiCode />
      <CanvasBackground />
      <TerminalMode isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

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
            position: 'fixed', top: 0, right: 0,
            width: '3px', height: '0%',
            background: 'linear-gradient(180deg, var(--accent-primary), var(--accent-cyber))',
            boxShadow: '0 0 10px rgba(0, 247, 255, 0.4), 0 0 4px rgba(225, 48, 108, 0.6)',
            zIndex: 9999,
            transition: 'height 0.08s linear',
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
            <motion.a 
              href="#home" 
              whileHover={{ scale: 1.05, filter: 'brightness(1.2) drop-shadow(0 0 8px rgba(225,48,108,0.4))' }}
              whileTap={{ scale: 0.95 }}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transformOrigin: 'left center' }}
            >
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 400,
                fontFamily: 'var(--font-heading)',
                background: 'var(--insta-gradient)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0px',
                display: 'inline-block'
              }}>
                Swapnadip
              </span>
            </motion.a>

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
                animation: 'statusPulse 2.5s ease-in-out infinite',
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
              <MagneticWrapper key={item} intensity={0.15}>
                <a
                  href={NAV_HREF_MAP[item] || `#${item.toLowerCase()}`}
                  className="nav-link"
                >
                  {item}
                </a>
              </MagneticWrapper>
            ))}
            <MagneticWrapper intensity={0.2}>
              <button
                  onClick={() => setIsTerminalOpen(true)}
                  style={{
                    background: 'rgba(0, 247, 255, 0.05)',
                    border: '1px solid rgba(0, 247, 255, 0.2)',
                    color: 'var(--accent-primary)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                >
                  &gt;_ CLI
                </button>
            </MagneticWrapper>
            <MagneticWrapper intensity={0.2}>
              <a href="#contact" className="btn-neon-outline" style={{ padding: '7px 18px', fontSize: '0.82rem' }}>
                Contact
              </a>
            </MagneticWrapper>
          </nav>

          {/* Mobile Hamburguer Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '48px',
              height: '48px',
              position: 'relative',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-only-block"
            aria-label="Toggle Menu"
          >
            <div style={{ position: 'relative', width: '28px', height: '20px' }}>
              <span style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: '#fff',
                borderRadius: '2px',
                left: 0,
                top: mobileMenuOpen ? '50%' : '10%',
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
                bottom: mobileMenuOpen ? '50%' : '10%',
                transform: mobileMenuOpen ? 'translateY(50%) rotate(-45deg)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
              }} />
            </div>
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
          <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsTerminalOpen(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  &gt;_ CLI MODE
                </button>
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
      <ScrollSkewWrapper>
      <section id="home" className="hero-section" data-component="HeroSection" style={{ background: 'var(--bg-hero)' }}>
        <div className="hero-glow-blob" style={{ background: 'var(--accent-violet)', top: '35%', left: '30%', animationDelay: '0s' }} />
        <div className="hero-glow-blob" style={{ background: 'var(--accent-cyber)', top: '65%', left: '70%', width: 'min(450px, 60vw)', height: 'min(450px, 60vw)', animationDelay: '-5s' }} />
        <div className="hero-glow-blob" style={{ background: 'var(--accent-primary)', top: '50%', left: '50%', width: 'min(650px, 80vw)', height: 'min(650px, 80vw)', opacity: 0.1, animationDelay: '-10s' }} />
        
        <div className="hero-content">
          {/* Time greeting */}
          {timeGreeting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                color: 'var(--text-dim)', letterSpacing: '4px',
                marginBottom: '24px',
                textTransform: 'uppercase'
              }}
            >
              {timeGreeting}
            </motion.div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, type: 'spring', stiffness: 100 }}
            className="hero-title tracking-spotlight"
          >
            Swapnadip Ghosh
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              fontSize: 'calc(1.2rem + 0.4vw)',
              fontWeight: '300',
              color: 'var(--text-muted)',
              marginBottom: '36px',
              minHeight: '44px',
              letterSpacing: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
            I engineer 
            <span className="typewriter-gradient" style={{
              fontWeight: '600',
              marginLeft: '4px'
            }}>
              <Typewriter
                words={['High-Performance UIs', 'Scalable Architecture', 'Immersive Experiences', 'Production Ready Apps']}
                speed={60}
                delay={2200}
              />
            </span>
          </motion.div>

          {/* Currently Exploring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <CurrentlyExploring />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            <a href="#work" className="btn-neon-glow" style={{ padding: '16px 42px', fontSize: '1.05rem', letterSpacing: '1px' }}>View Work</a>
            <a href="#contact" className="btn-neon-outline" style={{ padding: '16px 42px', fontSize: '1.05rem', letterSpacing: '1px' }}>Contact</a>
          </motion.div>

          {/* Social icons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            {[
              { icon: <i className="fa-brands fa-github" style={{ fontSize: '22px' }} aria-hidden="true"></i>, label: 'GitHub', link: 'https://github.com/Aethron-fr' },
              { icon: <i className="fa-brands fa-linkedin-in" style={{ fontSize: '22px' }} aria-hidden="true"></i>, label: 'LinkedIn', link: 'https://www.linkedin.com/in/swapnadip-ghosh-3669b33a1/' },
              { icon: <i className="fa-brands fa-instagram" style={{ fontSize: '22px' }} aria-hidden="true"></i>, label: 'Instagram', link: 'https://www.instagram.com/its_swapnadip108/' },
              { icon: <i className="fa-brands fa-x-twitter" style={{ fontSize: '22px' }} aria-hidden="true"></i>, label: 'X (Twitter)', link: 'https://x.com/swapnadip_108' },
              { icon: <Mail size={22} aria-hidden="true" />, label: 'Email', link: 'mailto:ghoshswapnadip7@gmail.com' }
            ].map((soc) => (
              <MagneticWrapper key={soc.label} intensity={0.3}>
                <a 
                  href={soc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link interactive"
                  aria-label={soc.label}
                  style={{
                    width: '52px',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {soc.icon}
                </a>
              </MagneticWrapper>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            style={{
              position: 'absolute',
              bottom: '5vh',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.65rem', 
              color: 'var(--text-dim)', 
              letterSpacing: '3px', 
              textTransform: 'uppercase',
              opacity: 0.7
            }}>
              Scroll to explore
            </span>
            <motion.a
              href="#about"
              aria-label="Scroll down"
              className="interactive"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{
                width: '26px',
                height: '42px',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '6px',
                textDecoration: 'none',
                transition: 'border-color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
            >
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{
                  width: '4px',
                  height: '6px',
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px var(--accent-primary)'
                }}
              />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* SLEEK ANIMATED NEON DIVIDER to blend sections */}
      <div style={{
        width: '100%', height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--border-glass), transparent)',
        position: 'relative', zIndex: 3,
        opacity: 0.8,
        overflow: 'hidden'
      }}>
        <motion.div 
          animate={{ x: ['-200%', '500%'] }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          style={{
             position: 'absolute', top: '-1px', left: '0', width: '20%', height: '3px',
             background: 'linear-gradient(90deg, transparent, var(--accent-cyber), var(--accent-violet), transparent)',
             filter: 'blur(2px)',
             boxShadow: '0 0 10px var(--accent-cyber)'
          }}
        />
      </div>

      {/* ABOUT SECTION */}
      <section id="about" data-component="AboutSection" style={{
        position: 'relative', zIndex: 2,
        padding: '80px 0 60px',
        background: 'linear-gradient(to bottom, transparent, var(--bg-section) 15%)',
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
      <section id="experience" data-component="FeaturedExperience" style={{
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
          <Suspense fallback={<div style={{ minHeight: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" /></div>}>
            <FeaturedSpotlight />
          </Suspense>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="work" data-component="SelectedWork" style={{
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
          <Suspense fallback={<div style={{ height: '400px' }} />}>
        <GithubProjects />
      </Suspense>
        </div>
      </section>

      {/* CREATIVE INFLUENCES */}
      <Suspense fallback={<div style={{ height: '400px' }} />}>
        <CreativeInfluences />
      </Suspense>

      {/* BEYOND THE SCREEN */}
      <Suspense fallback={<div style={{ height: '400px' }} />}>
        <BeyondTheScreen />
      </Suspense>

      {/* DEVELOPER JOURNEY */}
      <section id="journey" data-component="DeveloperJourney" className="section-padding" style={{ position: 'relative', zIndex: 2, background: 'var(--bg-section-alt)' }}>
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
              className="glass-panel panel-padding"
              style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
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
              {/* Feature 4: GitHub Contribution Graph */}
              <GitHubGraph />
            </div>

            {/* Panel 2: Philosophy */}
            <div
              className="glass-panel panel-padding"
              style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
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
              <div style={{ marginTop: '100px' }}>
                <h3 style={{ 
                  color: 'var(--accent-primary)', 
                  textTransform: 'uppercase', 
                  fontSize: '0.8rem', 
                  letterSpacing: '2px', 
                  marginBottom: '20px' 
                }}>
                  Core Tech Stack
                </h3>

                <TechStackBento />
              </div>
            </div>
          </div>

          {/* 3D Tech Sphere */}
          <TechSphere />

          {/* Timeline */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '4px', color: 'var(--text-dim)',
              textTransform: 'uppercase', marginBottom: 28,
            }}>
              Timeline
            </div>
            <Suspense fallback={<div style={{ height: '400px' }} />}>
        <DeveloperJourney />
      </Suspense>
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
            <li>
              <MagneticWrapper intensity={0.2}>
                <button
                  onClick={() => setIsTerminalOpen(true)}
                  style={{
                    background: 'rgba(0, 247, 255, 0.05)',
                    border: '1px solid rgba(0, 247, 255, 0.2)',
                    color: 'var(--accent-primary)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                >
                  &gt;_ CLI
                </button>
              </MagneticWrapper>
            </li>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" data-component="ContactSection" className="section-padding" style={{
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
            <div className="glass-panel panel-padding">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <img 
                  src="/favicon.jpg" 
                  alt="Swapnadip Ghosh" 
                  loading="lazy"
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
                    {/* Resume: link to LinkedIn until a real PDF is placed in /public/resume.pdf */}
                    <motion.a 
                      href="https://www.linkedin.com/in/swapnadip-ghosh/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, color: 'var(--accent-primary)', x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '4px', transformOrigin: 'left center' }}
                    >
                      <span>Download CV</span>
                      <ArrowUpRight size={13} style={{ opacity: 0.8 }} />
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            {/* BUG-004: Removed fake Google auth gate. BUG-006: Email is now editable. */}
            {/* BUG-017: Labels linked to inputs via htmlFor/id pairs */}
            <div className="glass-panel panel-padding" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* AUDIT-FIX: Hidden honeypot field to trap bots */}
                <input
                  type="text"
                  name="_honey"
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                  value={contactForm.honey || ''}
                  onChange={(e) => setContactForm({ ...contactForm, honey: e.target.value })}
                />
                
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

                <MagneticWrapper intensity={0.2}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-neon-glow"
                    style={{ width: '100%', gap: '8px', marginTop: '10px' }}
                  >
                    <Send size={15} style={{ opacity: 0.7 }} />
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                  </button>
                </MagneticWrapper>

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

      <footer className="main-footer" data-component="Footer" style={{ position: 'relative', zIndex: 2, padding: '120px 0 80px', background: 'var(--bg-footer)' }}>
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
              position: 'fixed', bottom: 100, left: 32, zIndex: 90,
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

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{
        padding: '60px 20px 40px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-glass)',
        marginTop: '100px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '30px' }}>
          <MagneticWrapper intensity={0.1}>
            <a
              href="https://www.linkedin.com/in/swapnadip-ghosh/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 40px',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-violet) 100%)',
                color: '#fff',
                textDecoration: 'none',
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '50px',
                boxShadow: '0 10px 30px rgba(225, 48, 108, 0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(225, 48, 108, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(225, 48, 108, 0.3)';
              }}
            >
              Download Resume
            </a>
          </MagneticWrapper>
        </div>
        <p style={{
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          letterSpacing: '1px'
        }}>
          &copy; {new Date().getFullYear()} Swapnadip Ghosh. All rights reserved.
        </p>
      </footer>
      </ScrollSkewWrapper>

      {/* ── Day / Night Mode Toggle ─────────────────────────────────────────── */}
      <ThemeToggle />
      <XRayToggle />


      {/* BUG-015: Removed inline <style> block — all styles now live in App.css to avoid
           duplication and conflicting breakpoints (was 1024px here vs 768px in App.css) */}
        </>
      )}
    </>
  );
}
