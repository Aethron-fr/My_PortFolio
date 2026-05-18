import { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  FileText, 
  ChevronRight, 
  Menu, 
  X, 
  Code, 
  Server, 
  Database, 
  Sparkles, 
  Laptop, 
  BookOpen, 
  Phone, 
  ArrowUpRight, 
  Send,
  Cpu,
  Globe,
  Activity,
  Award,
  User,
  Heart
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

  const progressBarRef = useRef(null);

  // Monitor scroll for header styling & progress
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Direct DOM update for 60 FPS scroll progress tracking
      const progressBar = progressBarRef.current;
      if (progressBar) {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      
      // Auto close success notification
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const skillsList = [
    { name: 'HTML5 & CSS3', level: '95%', icon: <Globe size={24} style={{ color: 'var(--accent-cyber)' }} />, desc: 'Semantic layouts & advanced responsive styling' },
    { name: 'JavaScript (ES6+)', level: '90%', icon: <Code size={24} style={{ color: 'var(--accent-primary)' }} />, desc: 'Modern reactive architecture & functional programming' },
    { name: 'React.js', level: '85%', icon: <Laptop size={24} style={{ color: 'var(--accent-cyber)' }} />, desc: 'High-performance UI & modular context logic' },
    { name: 'Node.js & Express', level: '80%', icon: <Server size={24} style={{ color: 'var(--accent-violet)' }} />, desc: 'Scalable REST APIs & token auth systems' },
    { name: 'Python & Django', level: '85%', icon: <Database size={24} style={{ color: 'var(--accent-secondary)' }} />, desc: 'Secure database models & MVC core architecture' },
    { name: 'Git & GitHub', level: '90%', icon: <i className="fa-brands fa-github" style={{ fontSize: '24px', color: '#fff' }}></i>, desc: 'Version pipelines & collaborative team integrations' }
  ];

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
          <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            {['About', 'Journey', 'Skills', 'Architect', 'Projects', 'Contact'].map((item) => (
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
              color: '#fff',
              cursor: 'pointer',
              display: 'none', // Controlled by CSS media queries
            }}
            className="mobile-only-block"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
          {['About', 'Journey', 'Skills', 'Architect', 'Projects', 'Contact'].map((item) => (
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
      <section id="hero" className="hero-section">
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
            fontSize: 'calc(2.2rem + 2.5vw)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '16px',
            letterSpacing: '-1.5px',
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

      {/* ABOUT ME & BENTO GRID SECTION */}
      <section id="about" className="section-padding" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>About Me</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
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
                I am a Full Stack Developer located in West Bengal, India, deeply passionate about sculpting 60 FPS responsive animations, solid APIs, and high-performance React architectures.
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
                  { label: 'React Engine', status: '60 FPS', color: 'var(--accent-cyber)' },
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
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                I believe that programming shouldn't just be about moving data around. It should be a creative craft. Elevating digital profiles and shaping user experiences is what drives me to log in every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHRONOLOGY JOURNEY SECTION */}
      <section id="journey" className="section-padding" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Chronology Journey</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Interactive milestones tracing my full-stack evolution, technical shifts, and engineering upgrades.
            </p>
          </div>
          <DeveloperJourney />
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="section-padding" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Core Competencies</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              A curated snapshot of my operational full-stack engineering tools and technical stack layers.
            </p>
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
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{skill.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>{skill.desc}</p>
                
                {/* Visual level progress indicator */}
                <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ width: skill.level, height: '100%', background: 'var(--insta-gradient)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE TECH BUILDER SANDBOX */}
      <section id="architect" className="section-padding" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Stack Architecture</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
          </div>
          <InteractiveSandbox />
        </div>
      </section>

      {/* PROJECT PORTAL */}
      <section id="projects" className="section-padding" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Featured Systems</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Spotlighting core full-stack creations and dynamic developer applications.
            </p>
          </div>
          
          {/* Core Flagship Application Showcase */}
          <FeaturedSpotlight />

          {/* Dynamically Fetched GitHub Repository Stream */}
          <div style={{ marginTop: '60px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '40px' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>
              Additional Repository Clusters
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '20px' }}>
              Full operational index queried directly from the GitHub API pipeline.
            </p>
            <GithubProjects />
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section-padding" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Get In Touch</h2>
            <div style={{ width: '50px', height: '4px', background: 'var(--insta-gradient)', margin: '12px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Ready to construct a 60 FPS system or a microservices backend cluster? Fire a pipeline signal below.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
            {/* Direct details */}
            <div className="glass-panel" style={{ padding: '36px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px', color: '#fff' }}>Swapnadip Ghosh</h3>
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
            <form onSubmit={handleContactSubmit} className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                  placeholder="e.g. client@agency.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
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
                disabled={isSubmitting}
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
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 2, padding: '60px 0 30px' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="footer-accent" />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>© 2026 Swapnadip Ghosh. Handcrafted in India.</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Constructed with React, Vite & framer-motion. Locked at 60 FPS</span>
            <Heart size={10} style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)' }} />
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
