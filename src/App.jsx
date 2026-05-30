import { useState, useEffect, useRef } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import emailjs from '@emailjs/browser';
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
  Heart,
  ArrowUpRight,
  Lock,
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
import './App.css';

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
      color: 'rgba(255,255,255,0.22)', letterSpacing: '1.5px',
      marginBottom: '28px', minHeight: '18px',
      transition: 'opacity 0.4s ease',
      opacity: visible ? 1 : 0,
    }}>
      Currently exploring: {EXPLORING_PHRASES[idx]}
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Hint fades in after 3 seconds, stays for 8, then vanishes forever.
    const t1 = setTimeout(() => setShowHint(true), 3000);
    const t2 = setTimeout(() => setShowHint(false), 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const progressBarRef = useRef(null);

  // Time-based greeting
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 0  && h < 5)  setTimeGreeting('Still up?');
    else if (h < 12) setTimeGreeting('Good morning.');
    else if (h < 17) setTimeGreeting('Good afternoon.');
    else if (h < 21) setTimeGreeting('Good evening.');
    else             setTimeGreeting('Working late again?');
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

  const handleGoogleSignIn = async () => {
    if (!auth) {
      alert("Firebase configuration is missing in environment variables.");
      return;
    }
    setIsAuthenticating(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && result.user.email) {
        setIsVerified(true);
        setContactForm(prev => ({ ...prev, email: result.user.email }));
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Verification failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setIsSubmitting(true);
    
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: contactForm.name,
          reply_to: contactForm.email,
          message: contactForm.message,
        },
        publicKey
      );
      
      setSubmitSuccess(true);
      setContactForm({ name: '', email: contactForm.email, message: '' });
      // Auto close success notification
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert('Something went wrong. Please email me directly at ghoshswapnadip7@gmail.com');
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
    { name: 'Git & GitHub', level: '90%', icon: <i className="fa-brands fa-github" style={{ fontSize: '24px', color: '#fff' }}></i>, desc: 'Version pipelines & collaborative team integrations' }
  ];

  const navItems = ['Home', 'About', 'Experience', 'Work', 'Journey', 'Contact'];

  return (
    <>
      <CustomCursor />
      <CanvasBackground />

      <AnimatePresence>
        {!hasEntered && <WelcomeModal key="welcome" onEnter={() => setHasEntered(true)} />}
      </AnimatePresence>

      {/* Scroll Progress Indicator */}
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
                color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}>
                Build Active
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-only-flex">
            {navItems.map((item) => {
              const hrefMap = {
                'Home': '#home',
                'About': '#about',
                'Experience': '#experience',
                'Work': '#work',
                'Journey': '#journey',
                'Contact': '#contact',
              };
              return (
                <a
                  key={item}
                  href={hrefMap[item] || `#${item.toLowerCase()}`}
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: '500',
                    transition: 'color 0.3s',
                    letterSpacing: '0.2px',
                  }}
                  onMouseOver={(e) => e.target.style.color = '#fff'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  {item}
                </a>
              );
            })}
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
        >
          {navItems.map((item) => (
            <a 
              key={item}
              href={item === 'Upcoming Projects' ? '#upcoming' : `#${item.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#fff',
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
      <section id="home" className="hero-section">
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
                color: 'rgba(255,255,255,0.28)', letterSpacing: '2px',
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
            color: '#ffffff'
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
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            {[
              { icon: <i className="fa-brands fa-github" style={{ fontSize: '20px' }}></i>, link: 'https://github.com/Aethron-fr' },
              { icon: <i className="fa-brands fa-linkedin-in" style={{ fontSize: '20px' }}></i>, link: 'https://www.linkedin.com/in/swapnadip-ghosh-3669b33a1/' },
              { icon: <i className="fa-brands fa-instagram" style={{ fontSize: '20px' }}></i>, link: 'https://www.instagram.com/its_swapnadip108/' },
              { icon: <i className="fa-brands fa-x-twitter" style={{ fontSize: '20px' }}></i>, link: 'https://x.com/swapnadip_108' },
              { icon: <Mail size={20} />, link: 'mailto:ghoshswapnadip7@gmail.com' }
            ].map((soc, idx) => (
              <a 
                key={idx}
                href={soc.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-muted)',
                  transition: 'all 0.3s var(--transition-elastic)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'var(--insta-gradient)';
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(225, 48, 108, 0.35)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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
        background: 'linear-gradient(to bottom, #06060a, #09090f)',
      }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            letterSpacing: '5px', color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase', marginBottom: 28,
          }}>
            About
          </div>
          <p style={{
            fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.9, fontWeight: 300, marginBottom: 20,
            maxWidth: 640,
          }}>
            Full Stack Developer based in West Bengal, India. I work across React, Node, and Python —
            building interfaces that feel considered. Fast, intentional, and honest in how they move.
          </p>
          <p style={{
            fontSize: '0.95rem', color: 'rgba(255,255,255,0.32)',
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
        background: '#09090f',
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
              color: 'rgba(255,255,255,0.75)',
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
        background: 'linear-gradient(to bottom, #09090f, #06060a)',
      }}>
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Selected Work
            </div>
            <h2 style={{
              fontSize: '1.6rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
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
      <section id="journey" className="section-padding" style={{ position: 'relative', zIndex: 2, background: '#06060a' }}>
        <div className="container">
          {/* Section header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Background
            </div>
            <h2 style={{
              fontSize: '1.6rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
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
              <h3 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>Swapnadip Ghosh</h3>
              <p style={{ lineHeight: '1.8', marginBottom: '16px', color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>
                Full Stack Developer based in West Bengal, India. I work across React, Node, and Python —
                writing interfaces that load fast, animate cleanly, and hold up under real conditions.
              </p>
              <p style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.38)', fontSize: '0.92rem' }}>
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: 'rgba(255,255,255,0.82)', marginBottom: '12px', lineHeight: 1.5 }}>
                "Serious about the craft. Not about the performance of it."
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.38)', lineHeight: '1.7' }}>
                Good interfaces feel obvious in hindsight. Getting there takes obsessive iteration.
              </p>
            </div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '52px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '4px', color: 'rgba(255,255,255,0.15)',
              textTransform: 'uppercase', marginBottom: 28,
            }}>
              Core Stack
            </div>
            <div className="skills-grid">
              {skillsList.map((skill, idx) => (
                <div key={idx} className="skill-card">
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-glass)', marginBottom: '10px'
                  }}>
                    {skill.icon}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', margin: 0 }}>{skill.name}</h4>
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
              letterSpacing: '4px', color: 'rgba(255,255,255,0.15)',
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
        background: 'linear-gradient(to bottom, #05050b, #06060a)',
        borderTop: '1px solid rgba(255,255,255,0.03)',
      }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'rgba(255,255,255,0.16)',
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
                  color: 'rgba(255,255,255,0.2)', letterSpacing: '2px',
                  minWidth: 72, textTransform: 'uppercase',
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: '0.88rem', color: 'rgba(255,255,255,0.48)',
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
      <section id="contact" className="section-padding" style={{ position: 'relative', zIndex: 2, background: 'linear-gradient(to bottom, #06060a, #040407)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '5px', color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Contact
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, letterSpacing: '-0.5px', marginBottom: 12 }}>Get in touch.</h2>
            <p style={{ maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.8 }}>
              Open to work, collaboration, or just a conversation about building things well.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
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
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '600', color: '#fff', margin: '0 0 4px' }}>Swapnadip Ghosh</h3>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: '400', letterSpacing: '0.5px', fontFamily: 'var(--font-mono)' }}>Full Stack Developer</span>
                </div>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.8', marginBottom: '28px', color: 'rgba(255,255,255,0.45)', fontWeight: '300' }}>
                Open to work, collaboration, or just a conversation about building things well. Email is always the best channel.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <Mail size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: 3 }}>email</div>
                    <a href="mailto:ghoshswapnadip7@gmail.com" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: '400' }}>
                      ghoshswapnadip7@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <Globe size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: 3 }}>based in</div>
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', fontWeight: '400' }}>
                      West Bengal, India
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <FileText size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: 3 }}>resume</div>
                    <a href="#" className="interactive" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Download CV</span>
                      <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              
              {!isVerified && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(6, 6, 10, 0.85)', backdropFilter: 'blur(8px)', zIndex: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '20px', textAlign: 'center', padding: '20px'
                }}>
                  <Lock size={32} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>Verification Required</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '300px' }}>
                    To prevent spam, please verify your identity using Google before transmitting a message.
                  </p>
                  <button 
                    onClick={handleGoogleSignIn}
                    disabled={isAuthenticating}
                    className="btn-neon-outline"
                    style={{ background: '#fff', color: '#000', border: 'none' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                      <path fill="#4285F4" d="M23.74 12.27c0-.85-.08-1.66-.21-2.45H12v4.63h6.58c-.29 1.49-1.12 2.76-2.38 3.61v3h3.86c2.26-2.09 3.68-5.17 3.68-8.79z"/>
                      <path fill="#34A853" d="M12 24c3.31 0 6.08-1.09 8.11-2.94l-3.86-3c-1.1.74-2.51 1.18-4.25 1.18-3.27 0-6.04-2.21-7.03-5.18H1.02v3.12C3.04 21.2 7.18 24 12 24z"/>
                      <path fill="#FBBC05" d="M4.97 14.06c-.25-.74-.39-1.54-.39-2.36s.14-1.62.39-2.36V6.22H1.02C.37 7.7 0 9.32 0 11.7s.37 4 .98 5.48l3.99-3.12z"/>
                      <path fill="#EA4335" d="M12 4.75c1.8 0 3.42.62 4.69 1.83l3.52-3.52C18.07 1.09 15.3 0 12 0 7.18 0 3.04 2.8 1.02 6.22l3.99 3.12c1-2.97 3.77-5.18 7.03-5.18z"/>
                    </svg>
                    {isAuthenticating ? 'VERIFYING...' : 'Sign in with Google'}
                  </button>
                </div>
              )}

              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: isVerified ? 1 : 0.4, pointerEvents: isVerified ? 'auto' : 'none', transition: 'opacity 0.4s' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '500', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swarnadip Mitra"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.95rem',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '500', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    readOnly
                    placeholder="Verified Google Email"
                    value={contactForm.email}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#a3a3a3',
                      outline: 'none',
                      fontSize: '0.95rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '500', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What's on your mind?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.95rem',
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
                  disabled={isSubmitting || !isVerified}
                  className="btn-neon-glow"
                  style={{ width: '100%', gap: '8px', marginTop: '10px' }}
                >
                  <Send size={15} style={{ opacity: 0.7 }} />
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>

                {submitSuccess && (
                  <div style={{ padding: '12px 16px', background: 'rgba(80,200,120,0.06)', border: '1px solid rgba(80,200,120,0.18)', color: 'rgba(140,220,160,0.85)', borderRadius: '10px', fontSize: '0.85rem', textAlign: 'center' }}>
                    Sent. I'll get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ position: 'relative', zIndex: 2, padding: '120px 0 60px', background: '#040406' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.15)', letterSpacing: '3px',
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
              color: 'rgba(255,255,255,0.15)', letterSpacing: '2px',
              textTransform: 'lowercase', lineHeight: 1.6
            }}>
              there is a memory hidden in the architecture.<br/>
              pay attention to the quiet parts.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded CSS for responsive elements and dynamic fades */}
      <style>{`
        .desktop-only-flex {
          display: flex !important;
        }
        .mobile-only-block {
          display: none !important;
        }
        
        @media (max-width: 1024px) {
          .desktop-only-flex {
            display: none !important;
          }
          .mobile-only-block {
            display: block !important;
          }
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-grid > div {
            grid-column: span 1 !important;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
