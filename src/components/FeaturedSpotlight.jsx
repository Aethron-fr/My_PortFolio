import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Sparkles,
  Activity,
  ArrowUpRight,
  Cpu,
  CheckCircle2,
  Volume2,
  VolumeX,
  Heart,
  Send,
  BookOpen,
  Calendar,
  Lock,
  ExternalLink,
  Code2,
} from 'lucide-react';

// ─── Spring Config Presets ───────────────────────────────────────────────────
const SPRING_GENTLE = { type: 'spring', stiffness: 80, damping: 20 };
const SPRING_SNAPPY = { type: 'spring', stiffness: 200, damping: 24 };
const SPRING_FLOAT  = { type: 'spring', stiffness: 40, damping: 14 };

// ─── Ambient Synthesizer ─────────────────────────────────────────────────────
class AmbientSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNode = null;
    this.filterNode = null;
    this.delayNode = null;
    this.chordTimeout = null;
  }

  start() {
    if (this.isPlaying) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.055, this.ctx.currentTime + 3);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(380, this.ctx.currentTime);

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.72, this.ctx.currentTime);
      const fb = this.ctx.createGain();
      fb.gain.setValueAtTime(0.64, this.ctx.currentTime);
      this.delayNode.connect(fb);
      fb.connect(this.delayNode);

      this.filterNode.connect(this.gainNode);
      this.filterNode.connect(this.delayNode);
      this.delayNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.isPlaying = true;
      this._playChordLoop();
    } catch (e) {
      console.warn('Web Audio blocked:', e);
    }
  }

  _playChordLoop() {
    if (!this.isPlaying) return;
    const chords = [
      [196.0, 246.94, 293.66, 369.99, 440.0],
      [130.81, 164.81, 196.0, 293.66, 392.0],
    ];
    let idx = 0;
    const play = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime;
      this.oscillators.forEach((o) => {
        try {
          o.gain.gain.setValueAtTime(o.gain.gain.value, now);
          o.gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
          setTimeout(() => { try { o.stop(); } catch (_) {} }, 4500);
        } catch (_) {}
      });
      this.oscillators = [];
      chords[idx].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.11, now + 2.5);
        osc.connect(g);
        g.connect(this.filterNode);
        osc.start(now);
        osc.gain = g;
        this.oscillators.push(osc);
      });
      idx = (idx + 1) % chords.length;
      this.chordTimeout = setTimeout(play, 9000);
    };
    play();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    clearTimeout(this.chordTimeout);
    if (this.gainNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2);
    }
    setTimeout(() => {
      this.oscillators.forEach((o) => { try { o.stop(); } catch (_) {} });
      this.oscillators = [];
      if (this.ctx && this.ctx.state !== 'closed') this.ctx.close();
    }, 2200);
  }
}

// ─── Cinematic Tilt Card (mouse-follow 3D tilt) ─────────────────────────────
function TiltCard({ children, style, className, onClick, disabled = false }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), SPRING_FLOAT);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), SPRING_FLOAT);

  const handleMove = useCallback((e) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [disabled, x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// ─── Cinematic Memory Chapter Data ───────────────────────────────────────────
const MEMORY_CHAPTERS = [
  {
    id: 'midnight',
    title: 'Midnight Spark',
    subtitle: 'Why It Was Born',
    date: 'OCT 2025',
    story: 'Born in the quiet, sleepless hours when the world goes dark and the mind finally speaks. A tribute to thoughts left unspoken — too complex for words but perfectly legible in code.',
    secret: '✨ Tap the heart inside the preview to release synthesized light particles.',
    // Deep indigo → black atmosphere
    bg: 'radial-gradient(ellipse at 30% 20%, #2a1a4e 0%, #0e0518 40%, #080210 100%)',
    image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    accentColor: '#a78bfa',
    scanColor: 'rgba(139, 92, 246, 0.06)',
    icon: '🕯️',
    label: '01',
  },
  {
    id: 'craft',
    title: 'The Craftsmanship',
    subtitle: 'Code & Obsession',
    date: 'DEC 2025',
    story: 'Every pixel placed with intent. GPU-accelerated canvases, hand-tuned spring curves, and obsessive micro-detail — engineered not for a deadline, but for a person.',
    secret: '🎵 The ambient soundscape plays Gmaj9 → Cadd9 progressions synthesized live in your browser.',
    // Deep crimson terminal aesthetic
    bg: 'radial-gradient(ellipse at 70% 80%, #4a0a0a 0%, #1a0505 45%, #080202 100%)',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    glowColor: 'rgba(225, 48, 108, 0.4)',
    accentColor: '#f87171',
    scanColor: 'rgba(225, 48, 108, 0.05)',
    icon: '⌨️',
    label: '02',
  },
  {
    id: 'gift',
    title: 'A Gift Unopened',
    subtitle: 'The Final Release',
    date: 'MAY 2026',
    story: 'Preserved forever on the open web. Not a product. Not a portfolio piece. A quiet monument built for one person — coded with the patience only real emotion can produce.',
    secret: '💌 Cast a message into the cosmos above to watch it float away as a shooting star.',
    // Warm amber / deep purple cinematic ending
    bg: 'radial-gradient(ellipse at 50% 100%, #3d1f00 0%, #1a0d1a 50%, #060208 100%)',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    accentColor: '#fcd34d',
    scanColor: 'rgba(245, 158, 11, 0.04)',
    icon: '🎁',
    label: '03',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FeaturedSpotlight() {
  const [activeProject, setActiveProject]       = useState('onelastsmile');
  const [activeTab, setActiveTab]               = useState('overview');
  const [soundActive, setSoundActive]           = useState(false);
  const [secretText, setSecretText]             = useState('');
  const [castStars, setCastStars]               = useState([]);
  const [expandedChapter, setExpandedChapter]   = useState(null);
  const [secretEcho, setSecretEcho]             = useState(false);

  const synthRef = useRef(null);

  // ── Sound toggle ──────────────────────────────────────────────────────────
  const toggleSound = () => {
    if (!synthRef.current) synthRef.current = new AmbientSynth();
    if (soundActive) { synthRef.current.stop(); setSoundActive(false); }
    else             { synthRef.current.start(); setSoundActive(true); }
  };

  // Autoplay logic: Try on mount, fallback to first user interaction
  useEffect(() => {
    let interactionListenerAdded = false;

    const startAudio = async () => {
      if (!synthRef.current) synthRef.current = new AmbientSynth();
      if (!soundActive && !synthRef.current.isPlaying) {
        // Try starting the synth
        synthRef.current.start();
        
        // Check if the AudioContext is actually running (not suspended by browser policy)
        if (synthRef.current.ctx && synthRef.current.ctx.state === 'running') {
          setSoundActive(true);
          // Remove listeners if successfully started
          if (interactionListenerAdded) {
            window.removeEventListener('click', startAudio);
            window.removeEventListener('keydown', startAudio);
            window.removeEventListener('touchstart', startAudio);
            window.removeEventListener('scroll', startAudio);
          }
        }
      }
    };

    // Attempt immediately (might work if user has high Media Engagement Index)
    startAudio();

    // Fallback: wait for the very first interaction anywhere on the page
    if (!soundActive) {
      interactionListenerAdded = true;
      window.addEventListener('click', startAudio, { once: true });
      window.addEventListener('keydown', startAudio, { once: true });
      window.addEventListener('touchstart', startAudio, { once: true });
      window.addEventListener('scroll', startAudio, { once: true });
    }

    return () => {
      synthRef.current?.stop();
      if (interactionListenerAdded) {
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
        window.removeEventListener('touchstart', startAudio);
        window.removeEventListener('scroll', startAudio);
      }
    };
  }, []);

  // ── Cosmos caster ─────────────────────────────────────────────────────────
  const handleCast = (e) => {
    e.preventDefault();
    if (!secretText.trim()) return;

    // Arpeggio chime
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [329.63, 415.3, 493.88, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + i * 0.1 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.1 + 0.7);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.9);
      });
    } catch (_) {}

    const stars = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      left: 8 + Math.random() * 84,
      size: 7 + Math.random() * 10,
      delay: Math.random() * 0.5,
      dur: 2 + Math.random() * 1.5,
      type: Math.random() > 0.45 ? '⭐' : '❤️',
    }));
    setCastStars(stars);
    setSecretText('');
    setTimeout(() => setCastStars([]), 3500);
  };

  // ── Echo dot click ────────────────────────────────────────────────────────
  const handleEchoClick = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(440, ctx.currentTime);
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.8);
    } catch (_) {}
    setSecretEcho(!secretEcho);
  };

  // ── Project stats ─────────────────────────────────────────────────────────
  const stats = activeProject === 'onelastsmile'
    ? [
        { label: 'Framerate',   value: 'Fluid Render',    color: '#f472b6' },
        { label: 'Encryption',  value: 'AES-256',         color: '#a78bfa' },
        { label: 'Audio',       value: '320kbps Synth',   color: '#22d3ee' },
        { label: 'Relay',       value: 'SMTP / TLS',      color: '#4ade80' },
      ]
    : [
        { label: 'Architecture', value: 'React 19 + Vite', color: '#22d3ee' },
        { label: 'Render',       value: 'Hardware Accel',  color: '#a78bfa' },
        { label: 'Bundle',       value: '<280KB Gzip',     color: '#f472b6' },
        { label: 'Base Path',    value: "'./'",            color: '#4ade80' },
      ];

  const architecturePoints = activeProject === 'onelastsmile'
    ? [
        'Interactive HTML5 Canvas constellation space tracking cursor vectors',
        'Reactive Polaroid snapshot grids supporting dynamic touch matrices',
        'Secure client feedback middleware sanitizing input sequences',
        'SMTP server gateway routing private replies safely with TLS',
      ]
    : [
        'Vite build config with relative base path for zero-jank serving',
        'Constellation visual particles rendering GPU-accelerated structures',
        'Scroll Progress listener executing via direct DOM tracking references',
        'Chronological Milestone Roadmap with responsive container toggles',
      ];

  // ── Project selector data ─────────────────────────────────────────────────
  const projects = [
    { id: 'onelastsmile', label: 'OneLastSmile',  icon: '❤️', accent: '#E1306C', glow: 'rgba(225,48,108,0.35)' },
    { id: 'myportfolio',  label: 'My_PortFolio',  icon: '📂', accent: '#00F7FF', glow: 'rgba(0,247,255,0.35)'  },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...SPRING_GENTLE, duration: 0.8 }}
      style={{
        marginTop: 40,
        padding: '44px 40px',
        background: 'linear-gradient(160deg, rgba(14,10,25,0.95) 0%, rgba(6,6,10,0.98) 100%)',
        border: '1px solid rgba(225,48,108,0.12)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.75), inset 0 0 60px rgba(225,48,108,0.025)',
        borderRadius: 28,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient background orb ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 500, height: 500,
        background: 'var(--insta-gradient)',
        filter: 'blur(180px)', opacity: 0.08,
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'pulseBlob 12s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-10%',
        width: 380, height: 380,
        background: 'radial-gradient(#8F00FF, #E1306C)',
        filter: 'blur(160px)', opacity: 0.05,
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'pulseBlob 16s ease-in-out infinite alternate-reverse',
      }} />

      {/* ── Header: project selector + soundscape ─────────────────────── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: 22, flexWrap: 'wrap', gap: 14,
      }}>
        {/* Project selector pills */}
        <div style={{ display: 'flex', gap: 10 }}>
          {projects.map((proj) => (
            <motion.button
              key={proj.id}
              onClick={() => { setActiveProject(proj.id); setActiveTab('overview'); }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING_SNAPPY}
              style={{
                background: activeProject === proj.id ? 'rgba(255,255,255,0.045)' : 'transparent',
                border: `1px solid ${activeProject === proj.id ? proj.accent : 'rgba(255,255,255,0.06)'}`,
                padding: '9px 22px', borderRadius: 50,
                color: '#fff', fontSize: '0.87rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: activeProject === proj.id ? `0 0 18px ${proj.glow}` : 'none',
                transition: 'background 0.35s, border-color 0.35s, box-shadow 0.35s',
                fontFamily: 'var(--font-heading)',
              }}
            >
              <span>{proj.icon}</span>
              <span>{proj.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Soundscape toggle */}
        <AnimatePresence>
          {activeProject === 'onelastsmile' && (
            <motion.button
              key="sound-btn"
              initial={{ opacity: 0, scale: 0.85, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 20 }}
              transition={SPRING_SNAPPY}
              onClick={toggleSound}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              style={{
                background: soundActive ? 'rgba(225,48,108,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${soundActive ? 'rgba(225,48,108,0.35)' : 'rgba(255,255,255,0.07)'}`,
                padding: '9px 20px', borderRadius: 50,
                color: soundActive ? '#E1306C' : 'var(--text-muted)',
                fontSize: '0.8rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: soundActive ? '0 0 20px rgba(225,48,108,0.22)' : 'none',
                transition: 'background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {soundActive
                ? <><Volume2 size={14} style={{ animation: 'heartPulse 1.2s infinite' }} /><span>SOUNDSCAPE ON</span></>
                : <><VolumeX size={14} /><span>PLAY SOUNDSCAPE</span></>
              }
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main 2-column layout ───────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 48, alignItems: 'center',
      }}>
        {/* LEFT: Preview Theater */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -12 }}
              transition={{ ...SPRING_GENTLE, duration: 0.55 }}
              style={{
                background: '#07070d',
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.9)',
                overflow: 'hidden',
                aspectRatio: '16 / 11',
                position: 'relative',
              }}
            >
              {activeProject === 'onelastsmile'
                ? <OLSPreview
                    castStars={castStars}
                    secretEcho={secretEcho}
                    onEchoClick={handleEchoClick}
                    secretText={secretText}
                    setSecretText={setSecretText}
                    onCast={handleCast}
                  />
                : <PortfolioPreview />
              }
            </motion.div>
          </AnimatePresence>

          {/* Ambient glow beneath theater */}
          <div style={{
            position: 'absolute', bottom: -20, left: '15%', right: '15%', height: 40,
            background: activeProject === 'onelastsmile'
              ? 'radial-gradient(ellipse, rgba(225,48,108,0.3) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(0,247,255,0.18) 0%, transparent 70%)',
            filter: 'blur(12px)',
            pointerEvents: 'none',
            transition: 'background 0.6s',
          }} />
        </div>

        {/* RIGHT: Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Label + title */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING_GENTLE, delay: 0.1 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: activeProject === 'onelastsmile' ? '#E1306C' : '#00F7FF',
              marginBottom: 10,
            }}>
              <Sparkles size={14} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {activeProject === 'onelastsmile' ? 'CINEMATIC CENTERPIECE' : 'SYSTEM ARCHITECTURE'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.h3
                key={activeProject + '-title'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ ...SPRING_SNAPPY, duration: 0.35 }}
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.7rem)',
                  fontWeight: 800, color: '#fff',
                  letterSpacing: '-0.5px', margin: '0 0 20px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {activeProject === 'onelastsmile' ? 'OneLastSmile' : 'My_PortFolio'}
              </motion.h3>
            </AnimatePresence>
          </motion.div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 22, position: 'relative',
          }}>
            {['overview', 'architecture', 'metrics'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent', border: 'none',
                  color: activeTab === tab ? '#fff' : 'var(--text-dim)',
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize: '0.88rem', cursor: 'pointer',
                  padding: '6px 14px 10px',
                  textTransform: 'capitalize',
                  position: 'relative',
                  fontFamily: 'var(--font-heading)',
                  transition: 'color 0.25s',
                }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-underline"
                    style={{
                      position: 'absolute', bottom: -1, left: 0, right: 0,
                      height: 2,
                      background: activeProject === 'onelastsmile'
                        ? 'linear-gradient(90deg, #E1306C, #FF5E3A)'
                        : 'linear-gradient(90deg, #00F7FF, #8F00FF)',
                      borderRadius: 2,
                    }}
                    transition={{ ...SPRING_SNAPPY, duration: 0.4 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject + '-' + activeTab}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
              transition={{ ...SPRING_GENTLE, duration: 0.4 }}
              style={{ minHeight: 130 }}
            >
              {activeTab === 'overview' && (
                <div>
                  {activeProject === 'onelastsmile' ? (
                    <>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 14, color: 'var(--text-muted)' }}>
                        <strong style={{ color: '#fff' }}>OneLastSmile</strong> is an immersive digital memorial — a quiet, permanent sanctuary built to archive emotional memories, polaroid snapshots, and secrets cast into the cosmos.
                      </p>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                        It merges raw emotion with modern craftsmanship: Web Audio synthesis, GPU-accelerated canvas, secure cryptographic channels, and hand-tuned micro-animations.
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 14, color: 'var(--text-muted)' }}>
                        <strong style={{ color: '#fff' }}>My_PortFolio</strong> is a fully responsive developer portal built on React 19, operating on a hardware-accelerated <strong style={{ color: '#00F7FF' }}>fluid rendering loop</strong>.
                      </p>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                        Dynamic constellation particles, elastic custom cursor, direct DOM scroll progress tracking, and lazy-loaded modular components.
                      </p>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'architecture' && (
                <motion.div
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  initial="hidden" animate="visible"
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {architecturePoints.map((point, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, x: -16 },
                        visible: { opacity: 1, x: 0, transition: SPRING_SNAPPY },
                      }}
                      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                    >
                      <CheckCircle2
                        size={15}
                        style={{
                          color: activeProject === 'onelastsmile' ? '#E1306C' : '#00F7FF',
                          flexShrink: 0, marginTop: 2,
                        }}
                      />
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'metrics' && (
                <motion.div
                  className="metrics-grid"
                  variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                  initial="hidden" animate="visible"
                >
                  {stats.map((s, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1, transition: SPRING_SNAPPY },
                      }}
                      whileHover={{ scale: 1.03, transition: SPRING_SNAPPY }}
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.018)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 12,
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              display: 'flex', gap: 14, flexWrap: 'wrap',
              marginTop: 28, paddingTop: 22,
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <motion.a
              href="https://github.com/Aethron-fr/My_PortFolio"
              target="_blank" rel="noopener noreferrer"
              className="btn-neon-glow"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SNAPPY}
              style={{
                padding: '10px 24px', fontSize: '0.85rem', gap: 8,
                background: activeProject === 'onelastsmile'
                  ? 'linear-gradient(135deg, #E1306C, #FF5E3A)'
                  : 'linear-gradient(135deg, #00F7FF, #0088FF)',
              }}
            >
              <Code2 size={15} />
              <span>Inspect Source</span>
            </motion.a>
            <motion.a
              href={activeProject === 'onelastsmile' ? 'https://one-last-smile.vercel.app/' : 'https://swapnadip-ghosh.vercel.app/'}
              target="_blank" rel="noopener noreferrer"
              className="btn-neon-outline"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SNAPPY}
              style={{ padding: '10px 24px', fontSize: '0.85rem', gap: 8 }}
            >
              <span>Live Demo</span>
              <ExternalLink size={15} />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* ── Behind The Project: Cinematic Memory Cards ─────────────────── */}
      <AnimatePresence>
        {activeProject === 'onelastsmile' && (
          <motion.div
            key="memory-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ ...SPRING_GENTLE, delay: 0.1 }}
            style={{ marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 44 }}
          >
            {/* Section heading */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 10 }}>
                <BookOpen size={16} style={{ color: '#E1306C' }} />
                <span style={{
                  fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px',
                  textTransform: 'uppercase', color: '#E1306C',
                }}>
                  BEHIND THE PROJECT
                </span>
              </div>
              <h4 style={{
                fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 800,
                color: '#fff', margin: 0, fontFamily: 'var(--font-heading)',
              }}>
                The Memory Archive
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: 8 }}>
                Click any polaroid to reveal the story behind it.
              </p>
            </div>

            {/* Cards row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20, marginBottom: 32,
            }}>
              {MEMORY_CHAPTERS.map((ch, i) => (
                <MemoryCard
                  key={ch.id}
                  chapter={ch}
                  index={i}
                  isExpanded={expandedChapter === ch.id}
                  onToggle={() => setExpandedChapter(expandedChapter === ch.id ? null : ch.id)}
                />
              ))}
            </div>

            {/* Expanded story panel */}
            <AnimatePresence mode="wait">
              {expandedChapter && (() => {
                const ch = MEMORY_CHAPTERS.find((c) => c.id === expandedChapter);
                return (
                  <motion.div
                    key={expandedChapter}
                    initial={{ opacity: 0, height: 0, scale: 0.97 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.97 }}
                    transition={{ ...SPRING_GENTLE, duration: 0.45 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      maxWidth: 680, margin: '0 auto',
                      padding: '28px 32px',
                      background: `linear-gradient(135deg, ${ch.glowColor.replace('0.4', '0.06')} 0%, rgba(6,6,10,0.8) 100%)`,
                      border: `1px solid ${ch.glowColor.replace('0.4', '0.18')}`,
                      borderRadius: 18,
                      boxShadow: `0 0 40px ${ch.glowColor.replace('0.4', '0.08')}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <Calendar size={13} style={{ color: ch.accentColor }} />
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 800,
                          color: ch.accentColor, letterSpacing: '0.8px',
                          textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
                        }}>
                          {ch.date} — {ch.subtitle.toUpperCase()}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.98rem', color: '#e2e8f0',
                        lineHeight: 1.75, margin: 0, fontWeight: 400,
                      }}>
                        {ch.story}
                      </p>
                      <div style={{
                        borderTop: '1px dashed rgba(255,255,255,0.07)',
                        marginTop: 20, paddingTop: 14,
                        display: 'flex', alignItems: 'center', gap: 7,
                      }}>
                        <Lock size={11} style={{ color: 'var(--text-dim)' }} />
                        <span style={{
                          fontSize: '0.74rem', color: 'var(--text-dim)',
                          fontStyle: 'italic', fontFamily: 'var(--font-mono)',
                        }}>
                          {ch.secret}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {!expandedChapter && (
              <p style={{
                textAlign: 'center', fontSize: '0.76rem',
                color: 'var(--text-dim)', fontFamily: 'var(--font-mono)',
                marginTop: 8, opacity: 0.7,
              }}>
                [ Select a memory snapshot to reveal emotional context ]
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Memory Card Sub-component ────────────────────────────────────────────────
function MemoryCard({ chapter: ch, index, isExpanded, onToggle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <TiltCard
      disabled={isExpanded}
      onClick={onToggle}
      style={{
        cursor: 'pointer',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '3/4',
        border: `1px solid ${isExpanded ? ch.accentColor + '55' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isExpanded
          ? `0 0 35px ${ch.glowColor}, 0 20px 50px rgba(0,0,0,0.6)`
          : hovered
            ? `0 0 25px ${ch.glowColor.replace('0.4', '0.2')}, 0 12px 30px rgba(0,0,0,0.5)`
            : '0 8px 24px rgba(0,0,0,0.4)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Cinematic atmospheric background ── */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `${ch.bg}, url(${ch.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          transition: 'opacity 0.5s',
        }}
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ ...SPRING_FLOAT, duration: 0.7 }}
      />

      {/* ── Grain/noise overlay for cinematic film feel ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
        opacity: 0.06,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }} />

      {/* ── Scanline effect ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${ch.scanColor} 2px, ${ch.scanColor} 4px)`,
        pointerEvents: 'none', opacity: 0.6,
      }} />

      {/* ── Hover glow bloom ── */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 100%, ${ch.glowColor.replace('0.4', '0.25')} 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* ── Content layer ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '20px 18px',
      }}>
        {/* Top: label + emoji */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            fontSize: '0.62rem', fontWeight: 800,
            color: ch.accentColor, letterSpacing: '1.5px',
            textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
            background: `${ch.glowColor.replace('0.4', '0.15')}`,
            padding: '3px 8px', borderRadius: 4,
            border: `1px solid ${ch.accentColor}33`,
          }}>
            {ch.label}
          </span>
          <motion.span
            style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}
            animate={{ y: hovered ? -4 : 0 }}
            transition={SPRING_FLOAT}
          >
            {ch.icon}
          </motion.span>
        </div>

        {/* Bottom: title + subtitle */}
        <div>
          <motion.div
            style={{
              fontSize: '0.62rem', color: ch.accentColor,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.8px',
              marginBottom: 6, opacity: 0.8,
            }}
            animate={{ opacity: hovered ? 1 : 0.7 }}
          >
            {ch.date}
          </motion.div>
          <h5 style={{
            fontSize: '1.1rem', fontWeight: 800, color: '#fff',
            margin: '0 0 5px', fontFamily: 'var(--font-heading)',
            textShadow: `0 0 20px ${ch.glowColor}`,
          }}>
            {ch.title}
          </h5>
          <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            {ch.subtitle}
          </p>

          {/* Expand indicator */}
          <motion.div
            style={{
              marginTop: 14, display: 'flex', alignItems: 'center', gap: 5,
              fontSize: '0.7rem', color: ch.accentColor,
              fontFamily: 'var(--font-mono)', fontWeight: 700,
            }}
            animate={{ x: hovered ? 4 : 0 }}
            transition={SPRING_SNAPPY}
          >
            <span>{isExpanded ? '— close' : '+ reveal'}</span>
            <ArrowUpRight size={11} />
          </motion.div>
        </div>
      </div>
    </TiltCard>
  );
}

// ─── OneLastSmile Preview Sub-component ─────────────────────────────────────
function OLSPreview({ castStars, secretEcho, onEchoClick, secretText, setSecretText, onCast }) {
  const [heartPopped, setHeartPopped] = useState(false);

  const popHeart = () => {
    setHeartPopped(true);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch (_) {}
    setTimeout(() => setHeartPopped(false), 600);
  };

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at 40% 35%, #140b28 0%, #08040e 100%)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      overflow: 'hidden', padding: 24,
    }}>
      {/* Star field backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 0)',
        backgroundSize: '22px 22px', opacity: 0.18, pointerEvents: 'none',
      }} />

      {/* Rotating orbit ring */}
      <div style={{
        position: 'absolute', width: 200, height: 200,
        borderRadius: '50%',
        border: '1px dashed rgba(225,48,108,0.18)',
        animation: 'spin 35s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow beneath polaroid */}
      <div style={{
        position: 'absolute',
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(225,48,108,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'pulseBlob 5s ease-in-out infinite alternate',
      }} />

      {/* Hidden star echo coordinate — glowing blinking dot */}
      <motion.div
        onClick={onEchoClick}
        whileHover={{ scale: 1.8 }}
        whileTap={{ scale: 0.7 }}
        transition={SPRING_SNAPPY}
        style={{
          position: 'absolute', top: 14, right: 14,
          width: 8, height: 8, borderRadius: '50%',
          background: 'rgba(255,255,255,0.4)',
          boxShadow: '0 0 8px #fff, 0 0 18px rgba(255,255,255,0.55)',
          cursor: 'pointer', zIndex: 15,
          animation: 'heartPulse 2.4s infinite',
        }}
        title="A quiet echo..."
      />

      {/* Secret echo overlay */}
      <AnimatePresence>
        {secretEcho && (
          <motion.div
            key="echo-overlay"
            initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
            transition={{ ...SPRING_SNAPPY, duration: 0.4 }}
            style={{
              position: 'absolute', inset: 10, zIndex: 20,
              background: 'rgba(5,5,12,0.96)',
              backdropFilter: 'blur(18px)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.07)',
              padding: 24,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <Heart size={20} style={{ color: '#E1306C', fill: '#E1306C', filter: 'drop-shadow(0 0 8px #E1306C)' }} />
            </motion.div>
            <h5 style={{
              fontSize: '0.9rem', fontWeight: 800, color: '#fff',
              margin: '12px 0 8px', fontFamily: 'var(--font-heading)',
            }}>
              A Quiet Echo
            </h5>
            <p style={{
              fontSize: '0.77rem', color: 'var(--text-muted)',
              lineHeight: 1.65, maxWidth: 260, margin: 0, fontStyle: 'italic',
            }}>
              "Perhaps some smiles are not meant to be held forever. But they can be preserved in stars, sculpted in code, and kept safe in the quiet expanse of the digital sky."
            </p>
            <motion.button
              onClick={onEchoClick}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              transition={SPRING_SNAPPY}
              style={{
                marginTop: 16,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '5px 14px', borderRadius: 50,
                color: '#fff', fontSize: '0.67rem',
                cursor: 'pointer', fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              close echo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Polaroid card */}
      <motion.div
        onClick={popHeart}
        whileHover={{ rotate: 0, scale: 1.07, y: -8 }}
        transition={{ ...SPRING_FLOAT, duration: 0.6 }}
        animate={{
          rotate: [-3, -1.5],
          y: [0, -6],
          scale: [1.04, 1.06],
        }}
        style={{
          width: 155,
          background: '#fff',
          padding: '9px 9px 22px',
          borderRadius: 7,
          boxShadow: '0 18px 45px rgba(0,0,0,0.65), 0 0 22px rgba(225,48,108,0.14)',
          cursor: 'pointer', zIndex: 5,
          position: 'relative',
        }}
      >
        {/* Polaroid image area */}
        <div style={{
          width: '100%', aspectRatio: '1',
          background: 'linear-gradient(135deg, #E1306C 0%, #FF5E3A 55%, #dc2743 100%)',
          borderRadius: 4,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '2rem',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Polaroid shine effect */}
          <div style={{
            position: 'absolute', top: -30, left: -30,
            width: 80, height: 80,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%', filter: 'blur(10px)',
          }} />
          <motion.span
            animate={{ scale: heartPopped ? 1.5 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.3))' }}
          >
            ❤️
          </motion.span>
        </div>

        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.65rem', color: '#111',
          textAlign: 'center', fontWeight: 800,
          marginTop: 4, letterSpacing: '-0.2px',
        }}>
          One Last Smile
        </div>
      </motion.div>

      {/* Cosmos casting input */}
      <form onSubmit={onCast} style={{
        width: '100%', maxWidth: 270,
        marginTop: 22, display: 'flex', gap: 8, zIndex: 5, position: 'relative',
      }}>
        <input
          type="text"
          value={secretText}
          onChange={(e) => setSecretText(e.target.value)}
          placeholder="Cast a secret into the sky..."
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 50, padding: '7px 15px',
            color: '#fff', fontSize: '0.72rem',
            outline: 'none', fontFamily: 'var(--font-body)',
            transition: 'border-color 0.3s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'rgba(225,48,108,0.38)')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          transition={SPRING_SNAPPY}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E1306C, #FF5E3A)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(225,48,108,0.4)', flexShrink: 0,
            color: '#fff',
          }}
        >
          <Send size={12} />
        </motion.button>
      </form>

      {/* Floating cast particles */}
      <AnimatePresence>
        {castStars.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 0, scale: 0.4, rotate: 0 }}
            animate={{ opacity: [0, 0.9, 0], y: -160, scale: [0.4, 1.2, 0.8], rotate: 360 }}
            transition={{ duration: s.dur, delay: s.delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `${s.left}%`,
              bottom: '30%',
              fontSize: s.size,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {s.type}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Status indicator */}
      <div style={{
        position: 'absolute', bottom: 10, left: 12,
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: '0.58rem', color: '#E1306C',
        fontWeight: 800, letterSpacing: '1px',
        fontFamily: 'var(--font-mono)',
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#E1306C', display: 'inline-block',
          boxShadow: '0 0 6px #E1306C',
          animation: 'heartPulse 1.6s infinite',
        }} />
        ATMOSPHERE_ACTIVE
      </div>
    </div>
  );
}

// ─── Portfolio Preview Sub-component ─────────────────────────────────────────
function PortfolioPreview() {
  const files = [
    { name: 'CanvasBackground.jsx', color: '#22d3ee', note: 'constellations' },
    { name: 'CustomCursor.jsx',     color: '#fbbf24', note: 'click_physics'  },
    { name: 'FeaturedSpotlight.jsx',color: '#f472b6', note: 'centerpiece'    },
    { name: 'DeveloperJourney.jsx', color: '#a78bfa', note: 'timeline'       },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Terminal chrome */}
      <div style={{
        background: 'rgba(255,255,255,0.025)',
        padding: '11px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ef4444','#eab308','#22c55e'].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.4)', borderRadius: 50,
          padding: '3px 18px', fontSize: '0.65rem',
          color: 'var(--text-dim)', fontFamily: 'var(--font-mono)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}>
          github.com/Aethron-fr/My_PortFolio
        </div>
        <Activity size={12} style={{ color: '#00F7FF' }} />
      </div>

      {/* File listing */}
      <div style={{
        flex: 1, padding: '18px 22px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        color: 'var(--text-dim)',
      }}>
        <div>
          <div style={{ color: '#00F7FF', marginBottom: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Cpu size={12} />
            <span style={{ fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', fontSize: '0.62rem' }}>
              WORKSPACE_INDEXED
            </span>
          </div>
          <div style={{ color: '#fff', fontSize: '0.68rem', lineHeight: 2 }}>
            <span style={{ color: '#f472b6' }}>📁 src/</span><br />
            <span style={{ paddingLeft: 12, color: '#a78bfa' }}>📁 components/</span><br />
            {files.map((f) => (
              <div key={f.name} style={{ paddingLeft: 24 }}>
                📄 {f.name} <span style={{ color: f.color }}>( {f.note} )</span>
              </div>
            ))}
            <span style={{ paddingLeft: 12 }}>📄 App.jsx <span style={{ color: '#a78bfa' }}>( orchestrator )</span></span><br />
            <span style={{ paddingLeft: 12 }}>📄 index.css <span style={{ color: 'var(--text-dim)' }}>( tokens )</span></span>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          paddingTop: 10,
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.65rem', color: '#22c55e',
        }}>
          <span>● VITE_COMPILER_READY</span>
          <span style={{ color: 'var(--text-dim)' }}>build: 1.12s</span>
        </div>
      </div>
    </div>
  );
}
