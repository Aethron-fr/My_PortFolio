import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import emailjs from '@emailjs/browser';

let auth = null;
let googleProvider = null;
try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }
} catch (error) {
  console.warn("Firebase initialization skipped:", error);
}

import { 
  Mail, 
  FileText, 
  Code, 
  Server, 
  Database, 
  Sparkles, 
  Laptop, 
  ArrowUpRight, 
  Send,
  Cpu,
  Globe,
  Activity,
  Award,
  User,
  Heart,
  Lock
} from 'lucide-react';
import CanvasBackground from './components/CanvasBackground';
import CustomCursor from './components/CustomCursor';
import Typewriter from './components/Typewriter';
import InteractiveSandbox from './components/InteractiveSandbox';
import GithubProjects from './components/GithubProjects';
import DeveloperJourney from './components/DeveloperJourney';
import FeaturedSpotlight from './components/FeaturedSpotlight';
import './App.css';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const progressBarRef = useRef(null);

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
      alert("Transmission pipeline interrupted. Please verify your connection or email me directly.");
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

  const navItems = ['Home', 'Centerpiece', 'Projects', 'Journey', 'Contact'];

  return (
    <>
      {/* 60 FPS Particle Canvas and custom cursor */}
      <CanvasBackground />
      <CustomCursor />

      {/* 60 FPS Dynamic Scroll Progress Indicator */}
      <div 
        ref={progressBarRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3.5px',
          width: '0%',
          background: 'var(--insta-gradient)',
          zIndex: 9999,
          transition: 'width 0.08s linear'
        }}
      />

      {/* FLOATING TRANSLUCENT NAVBAR */}
      <header 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          transition: 'all 0.4s var(--transition-smooth)',
          background: scrolled ? 'rgba(6, 6, 10, 0.75)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border-glass)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          padding: scrolled ? '14px 0' : '24px 0'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              background: 'var(--insta-gradient)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Swapnadip
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="desktop-only-flex">
            {navItems.map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  transition: 'color 0.3s',
                  letterSpacing: '0.3px'
                }}
                onMouseOver={(e) => e.target.style.color = '#fff'}
                onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                {item}
              </a>
            ))}
            <a href="#contact" className="btn-neon-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Let's Connect
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
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '1.8rem',
                fontWeight: '700',
                fontFamily: 'var(--font-heading)',
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
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(225, 48, 108, 0.08)',
            border: '1px solid rgba(225, 48, 108, 0.25)',
            padding: '8px 16px',
            borderRadius: '50px',
            marginBottom: '24px',
          }}>
            <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Interactive Developer Ecosystem
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '16px',
            letterSpacing: '-1px',
            color: '#ffffff'
          }}>
            Hi, I'm Swapnadip Ghosh
          </h1>

          <div style={{
            fontSize: 'calc(1.1rem + 0.8vw)',
            fontWeight: '600',
            color: 'var(--text-muted)',
            marginBottom: '32px',
            minHeight: '40px',
            letterSpacing: '-0.3px'
          }}>
            I am a <Typewriter 
              words={['Full Stack Developer', 'MERN Stack Engineer', 'Python Specialist', 'UI Animator']} 
              speed={80} 
              delay={2200} 
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '45px' }}>
            <a href="#projects" className="btn-neon-glow">
              Explore Projects
            </a>
            <a href="#contact" className="btn-neon-outline">
              Get in Touch
            </a>
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

      {/* CINEMATIC EMOTIONAL TRANSITION */}
      <section style={{ 
        position: 'relative', 
        zIndex: 2, 
        padding: '120px 0 80px', 
        background: 'linear-gradient(to bottom, #06060a, #09090f)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: '800',
              color: 'var(--accent-primary)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              animation: 'pulse 2s infinite alternate'
            }}>
              A Cinematic Shift
            </span>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <h2 style={{ 
              fontSize: '2.2rem', 
              fontWeight: '300', 
              color: '#f8fafc', 
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.5',
              letterSpacing: '-0.5px',
              textShadow: '0 0 40px rgba(255,255,255,0.05)'
            }}>
              "Some projects are built with keyboard clicks. <br/>
              Others are written with <span style={{ background: 'var(--insta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>sleepless nights</span> and quiet memories."
            </h2>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)', marginTop: '10px' }} />
            <p style={{ 
              fontSize: '0.98rem', 
              color: 'var(--text-muted)', 
              lineHeight: '1.8',
              maxWidth: '620px',
              margin: '10px auto 0',
              fontStyle: 'italic'
            }}>
              The digital memorial ahead is my creative identity crafted in light and code—a sanctuary to preserve a smile indefinitely.
            </p>
          </div>
        </div>
      </section>

      {/* ONE LAST SMILE CENTERPIECE EXPERIENCE */}
      <section id="centerpiece" className="section-padding" style={{ position: 'relative', zIndex: 2, background: '#09090f' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(225, 48, 108, 0.08)', border: '1px solid rgba(225, 48, 108, 0.2)', padding: '6px 16px', borderRadius: '50px', marginBottom: '12px' }}>
              <Heart size={12} style={{ color: 'var(--accent-primary)', animation: 'heartPulse 1.2s infinite' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>THE HERO PROJECT</span>
            </div>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Flagship Showcase</h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Explore the live interactive theater of OneLastSmile, featuring Web Audio ambient synthesizers and secret casting channels.
            </p>
          </div>
          <FeaturedSpotlight />
        </div>
      </section>

      {/* OTHER PROJECTS & GIT CLUSTERS */}
      <section id="projects" className="section-padding" style={{ position: 'relative', zIndex: 2, background: 'linear-gradient(to bottom, #09090f, #06060a)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Additional Projects</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Full operational indexing queried directly from the live GitHub repository stream.
            </p>
          </div>
          <GithubProjects />
        </div>
      </section>

      {/* DEVELOPER JOURNEY & CREDENTIALS TOOLKIT */}
      <section id="journey" className="section-padding" style={{ position: 'relative', zIndex: 2, background: '#06060a' }}>
        <div className="container">
          
          {/* About Biography Bento */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Developer Journey</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Biography matrix and full-stack architecture stats. Hardware accelerated.
            </p>
          </div>

          <div className="bento-grid" style={{ marginBottom: '60px' }}>
            {/* Panel 1: Profile bio */}
            <div 
              className="glass-panel" 
              style={{
                gridColumn: 'span 8',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyber)', marginBottom: '14px' }}>
                <User size={20} />
                <span style={{ fontWeight: '700', letterSpacing: '1px', fontSize: '0.85rem', textTransform: 'uppercase' }}>THE PROFILE CORE</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', color: '#fff' }}>Swapnadip Ghosh</h3>
              <p style={{ lineHeight: '1.7', marginBottom: '18px' }}>
                I am a Full Stack Developer located in West Bengal, India, deeply passionate about sculpting silky-smooth responsive animations, solid APIs, and high-performance React architectures.
              </p>
              <p style={{ lineHeight: '1.7' }}>
                My development core centers around writing clean, highly scalable codebase infrastructure. Whether orchestrating Node services or designing premium browser interactions, I aim to weave complex engineering logic into smooth human experiences.
              </p>
            </div>

            {/* Panel 2: Rapid facts / stats */}
            <div 
              className="glass-panel" 
              style={{
                gridColumn: 'span 4',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '20px' }}>
                <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontWeight: '700', letterSpacing: '1px', fontSize: '0.85rem' }}>GRID TELEMETRY</span>
              </div>
              
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)', lineHeight: '1', marginBottom: '6px' }}>
                60.0
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyber)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px' }}>
                TARGET FPS LOCKED
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                System render pipeline utilizes GPU acceleration to sustain battery-optimized frames.
              </p>
            </div>

            {/* Panel 3: Terminal Console Telemetry */}
            <div 
              className="glass-panel" 
              style={{
                gridColumn: 'span 5',
                padding: '36px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-violet)', marginBottom: '18px' }}>
                <Cpu size={20} />
                <span style={{ fontWeight: '700', letterSpacing: '1px', fontSize: '0.85rem' }}>NODE TELEMETRY</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                {[
                  { label: 'React Engine', status: 'Silky Smooth', color: 'var(--accent-cyber)' },
                  { label: 'Express Engine', status: 'STABLE', color: 'var(--accent-violet)' },
                  { label: 'Django Clusters', status: 'SECURED', color: 'var(--accent-secondary)' },
                  { label: 'Docker Services', status: 'ONLINE', color: '#22c55e' }
                ].map((stat, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{stat.label}:</span>
                    <span style={{ color: stat.color, fontWeight: 'bold' }}>{stat.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 4: Quick quotes & factoids */}
            <div 
              className="glass-panel" 
              style={{
                gridColumn: 'span 7',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-secondary)', marginBottom: '14px' }}>
                <Award size={20} />
                <span style={{ fontWeight: '700', letterSpacing: '1px', fontSize: '0.85rem' }}>PHILOSOPHY</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                "Not too serious in life, very serious in coding."
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                I believe that programming shouldn't just be about moving data around. It should be a creative craft. Elevating digital profiles and shaping user experiences is what drives me to log in every day.
              </p>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyber)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-cyber)', marginBottom: '4px', textTransform: 'uppercase' }}>Current Learning Focus</span>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>Exploring WebGL shaders and advanced Framer Motion choreography for next-gen interactive storytelling.</span>
              </div>
            </div>
          </div>

          {/* Competency Skills list */}
          <div style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>Core Competencies</h3>
              <div style={{ width: '40px', height: '3px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            </div>
            
            <div className="skills-grid">
              {skillsList.map((skill, idx) => (
                <div key={idx} className="skill-card">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-glass)',
                    marginBottom: '10px'
                  }}>
                    {skill.icon}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', margin: 0 }}>{skill.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4', margin: '4px 0 0 0' }}>{skill.desc}</p>
                  
                  <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ width: skill.level, height: '100%', background: 'var(--insta-gradient)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Developer Roadmap Timeline */}
          <div style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>Interactive Milestones</h3>
              <div style={{ width: '40px', height: '3px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            </div>
            <DeveloperJourney />
          </div>

          {/* Stack sandbox architect */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>Stack Sandbox</h3>
              <div style={{ width: '40px', height: '3px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            </div>
            <InteractiveSandbox />
          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section-padding" style={{ position: 'relative', zIndex: 2, background: 'linear-gradient(to bottom, #06060a, #040407)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Get In Touch</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Ready to construct a high-performance system or a microservices backend cluster? Fire a pipeline signal below.
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
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', margin: 0 }}>Swapnadip Ghosh</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyber)', fontWeight: '700', letterSpacing: '0.5px' }}>FULL STACK ARCHITECT</span>
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '30px' }}>
                Feel free to email me directly or launch a connect ping. I am always open to exploring cutting-edge product structures, open source systems, or MERN cloud integrations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(0, 247, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 247, 255, 0.2)' }}>
                    <Mail size={16} style={{ color: 'var(--accent-cyber)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>SECURE MAIL CHANNEL</div>
                    <a href="mailto:ghoshswapnadip7@gmail.com" style={{ fontSize: '0.9rem', color: '#fff', textDecoration: 'none', fontWeight: '600' }}>
                      ghoshswapnadip7@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(143, 0, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(143, 0, 255, 0.2)' }}>
                    <Globe size={16} style={{ color: 'var(--accent-violet)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DEVELOPER GEOMETRY</div>
                    <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '600' }}>
                      West Bengal, India
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255, 94, 58, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 94, 58, 0.2)' }}>
                    <FileText size={16} style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>SYSTEM BRIEFING</div>
                    <a href="#" className="interactive" style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Download Developer CV</span>
                      <ArrowUpRight size={14} />
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
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Your Identifier Name
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
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Secure Return Email
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
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Project Core Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your MERN architecture or 60fps design system needs..."
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
                  <Send size={16} />
                  {isSubmitting ? 'TRANSMITTING SIGNAL...' : 'TRANSMIT CONTACT SIGNAL'}
                </button>

                {submitSuccess && (
                  <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                    Signal successfully sent! Swapnadip will return contact soon. 🚀
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 2, padding: '60px 0 30px', background: '#040407' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="footer-accent" />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>© 2026 Swapnadip Ghosh. Handcrafted in India.</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Constructed with React, Vite & framer-motion. Silky smooth rendering.</span>
            <Heart size={10} className="pulse-heart" />
          </p>
        </div>
      </footer>

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
