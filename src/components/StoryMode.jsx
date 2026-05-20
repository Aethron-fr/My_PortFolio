import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoryMode({ onClose }) {
  const [chapter, setChapter] = useState(0); // 0: Start, 1: The Silence, 2: Unread, 3: Almost, 4: Smile
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [fragmentsFound, setFragmentsFound] = useState(new Set());
  
  const handleMouseMove = (e) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY,
      nx: (e.clientX / window.innerWidth - 0.5) * 20,
      ny: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };

  const advanceChapter = () => {
    if (chapter < 4) setChapter(c => c + 1);
  };

  // Keyboard escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#020002', overflow: 'hidden',
        cursor: chapter === 2 ? 'none' : 'default', // Hide cursor in ch2 for flashlight
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)'
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Global Atmospherics */}
      <Atmospherics chapter={chapter} mousePos={mousePos} secretUnlocked={secretUnlocked} />

      {/* Chapters */}
      <AnimatePresence mode="wait">
        {chapter === 0 && <Intro key="intro" onNext={advanceChapter} />}
        {chapter === 1 && <ChapterSilence key="ch1" onNext={advanceChapter} />}
        {chapter === 2 && (
          <ChapterUnread 
            key="ch2" 
            mousePos={mousePos} 
            onNext={advanceChapter} 
            secretUnlocked={secretUnlocked}
            onUnlockSecret={() => setSecretUnlocked(true)}
            fragmentsFound={fragmentsFound}
            setFragmentsFound={setFragmentsFound}
          />
        )}
        {chapter === 3 && <ChapterAlmost key="ch3" onNext={advanceChapter} secretUnlocked={secretUnlocked} />}
        {chapter === 4 && <ChapterFinal key="ch4" onClose={onClose} secretUnlocked={secretUnlocked} />}
      </AnimatePresence>

      {/* Subtle Close Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        whileHover={{ opacity: 0.8, textShadow: '0 0 10px rgba(255,255,255,0.4)' }}
        transition={{ duration: 1 }}
        onClick={onClose}
        style={{
          position: 'absolute', bottom: 40, right: 40,
          background: 'none', border: 'none', color: '#fff',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '2px', cursor: 'pointer', zIndex: 100
        }}
      >
        [ exit memory ]
      </motion.button>
    </motion.div>
  );
}

// ─── Atmospherics ────────────────────────────────────────────────────────
function Atmospherics({ chapter, mousePos, secretUnlocked }) {
  // Lighting warms if secret is unlocked, and deeply warms in ch3
  const getLighting = () => {
    if (chapter === 3 || chapter === 4) return 'rgba(255, 60, 100, 0.12)';
    if (secretUnlocked) return 'rgba(180, 50, 90, 0.08)';
    return 'rgba(255, 255, 255, 0.03)';
  };

  const isPaused = secretUnlocked && chapter === 2;

  return (
    <>
      {/* Film Grain */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.06, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 50
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.95) 100%)',
        pointerEvents: 'none', zIndex: 45
      }} />

      {/* Floating ambient glow */}
      <motion.div
        animate={{
          background: `radial-gradient(circle at 50% 50%, ${getLighting()} 0%, transparent 60%)`,
          transform: `translate(${mousePos.nx * -1}px, ${mousePos.ny * -1}px)`,
        }}
        transition={{ duration: 4, ease: 'easeOut' }}
        style={{
          position: 'absolute', width: '120vw', height: '120vh',
          left: '-10vw', top: '-10vh', filter: 'blur(80px)',
          pointerEvents: 'none', zIndex: 1
        }}
      />

      {/* Drifting Dust */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={isPaused ? { y: 0, opacity: 0.05 } : { y: [0, -40, 0], opacity: [0.05, 0.3, 0.05] }}
          transition={{ duration: 8 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          style={{
            position: 'absolute', width: i % 4 === 0 ? 3 : 1, height: i % 4 === 0 ? 3 : 1,
            background: 'rgba(255,255,255,0.6)', borderRadius: '50%',
            left: `${5 + (i * 4.5)}%`, top: `${15 + (i * 4)}%`,
            transform: `translate(${mousePos.nx * (i * 0.2)}px, ${mousePos.ny * (i * 0.2)}px)`,
            pointerEvents: 'none', filter: 'blur(1.5px)', zIndex: 2
          }}
        />
      ))}
    </>
  );
}

// ─── Chapter 0: Intro ──────────────────────────────────────────────────
function Intro({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 4, ease: 'easeInOut' }}
      style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}
    >
      <motion.button
        onClick={onNext}
        whileHover={{ opacity: 1, filter: 'blur(0px)', scale: 1.05 }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          opacity: 0.3, filter: 'blur(2px)', transition: 'all 2s ease',
          width: 60, height: 60, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', boxShadow: '0 0 15px #fff' }} />
      </motion.button>
    </motion.div>
  );
}

// ─── Chapter 1: The Silence ────────────────────────────────────────────
function ChapterSilence({ onNext }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 3000);
    const t2 = setTimeout(() => setStep(2), 6500);
    const t3 = setTimeout(() => setStep(3), 11000);
    const t4 = setTimeout(() => onNext(), 16000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(15px)', y: -20 }}
      transition={{ duration: 3 }}
      style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: 600 }}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.p
            key="p1"
            initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
            animate={{ opacity: 0.8, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 2 } }}
            transition={{ duration: 3, ease: 'easeOut' }}
            style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 300, letterSpacing: '1px' }}
          >
            I remember the quiet.
          </motion.p>
        )}
        {step === 2 && (
          <motion.p
            key="p2"
            initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
            animate={{ opacity: 0.6, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 2 } }}
            transition={{ duration: 3, ease: 'easeOut' }}
            style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 300, letterSpacing: '1px' }}
          >
            Not just the silence.
          </motion.p>
        )}
        {step === 3 && (
          <motion.p
            key="p3"
            initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
            animate={{ opacity: 0.9, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 2 } }}
            transition={{ duration: 4, ease: 'easeOut' }}
            style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 300, letterSpacing: '1px' }}
          >
            But the space left behind.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Audio Room-Tone Visualizer (Visual only) */}
      <div style={{ position: 'absolute', bottom: -100, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, opacity: 0.15 }}>
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [4, 12, 4] }}
            transition={{ duration: 2 + (i * 0.1), repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, background: '#fff' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Chapter 2: Unread Things ──────────────────────────────────────────
function ChapterUnread({ mousePos, onNext, secretUnlocked, onUnlockSecret, setFragmentsFound }) {
  const [showCoreText, setShowCoreText] = useState(false);
  const [timeInChapter, setTimeInChapter] = useState(0);

  const fragments = [
    { id: 'f1', text: 'you were online.', x: '20%', y: '30%', isKey: false },
    { id: 'f2', text: 'never mind.', x: '75%', y: '40%', isKey: true },
    { id: 'f3', text: 'i almost sent this.', x: '40%', y: '70%', isKey: false },
    { id: 'f4', text: '2:14 AM', x: '85%', y: '80%', isKey: true },
    { id: 'f5', text: 'you probably forgot already.', x: '15%', y: '60%', isKey: false },
    { id: 'f6', text: 'typing...', x: '35%', y: '20%', isKey: true },
    { id: 'f7', text: 'it didn\'t feel right anymore.', x: '65%', y: '65%', isKey: false },
    { id: 'f8', text: 'you sounded tired.', x: '50%', y: '45%', isKey: false },
  ];

  useEffect(() => {
    const t = setInterval(() => setTimeInChapter(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let t1, t2;
    if (timeInChapter > 10 && !secretUnlocked) {
      t1 = setTimeout(() => setShowCoreText(true), 0);
    }
    if (timeInChapter > 18) {
      t2 = setTimeout(() => onNext(), 0);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [timeInChapter, secretUnlocked, onNext]);

  const handleFragmentHover = (id) => {
    setFragmentsFound(prev => {
      const next = new Set(prev).add(id);
      // Check if all key fragments are found
      const keysFound = fragments.filter(f => f.isKey).every(f => next.has(f.id));
      if (keysFound && !secretUnlocked) {
        onUnlockSecret();
        setShowCoreText(false); // Hide normal core text
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(15px)' }}
      transition={{ duration: 3 }}
      style={{ position: 'absolute', inset: 0, zIndex: 10, overflow: 'hidden' }}
    >
      {/* The Flashlight Mask */}
      <motion.div
        animate={{
          WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 10%, transparent 80%)`,
          maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 10%, transparent 80%)`
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
        style={{
          position: 'absolute', inset: 0,
          pointerEvents: 'auto', zIndex: 15
        }}
      >
        {fragments.map(f => (
          <motion.div
            key={f.id}
            onMouseEnter={() => handleFragmentHover(f.id)}
            style={{
              position: 'absolute', left: f.x, top: f.y,
              fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)', fontStyle: 'italic',
              cursor: 'none', padding: 20
            }}
          >
            {f.text}
          </motion.div>
        ))}
      </motion.div>

      {/* Secret Resolution */}
      <AnimatePresence>
        {secretUnlocked && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 0.9, filter: 'blur(0px)' }}
            transition={{ duration: 4, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 20, pointerEvents: 'none'
            }}
          >
            <p style={{ fontSize: '1.4rem', color: '#E1306C', fontWeight: 300, fontStyle: 'italic', textShadow: '0 0 20px rgba(225,48,108,0.3)' }}>
              "I still check."
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal Resolution */}
      <AnimatePresence>
        {showCoreText && !secretUnlocked && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 0.7, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 20, pointerEvents: 'none'
            }}
          >
            <p style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 300, maxWidth: 400, textAlign: 'center', lineHeight: 1.8 }}>
              We leave so many things unsaid, hoping silence will say them for us.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Chapter 3: Almost Stayed ──────────────────────────────────────────
function ChapterAlmost({ onNext, secretUnlocked }) {
  useEffect(() => {
    const t = setTimeout(() => onNext(), 12000);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(15px)' }}
      transition={{ duration: 4 }}
      style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}
    >
      <motion.p
        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
        animate={{ opacity: 0.8, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 4, delay: 1 }}
        style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 300, marginBottom: 16 }}
      >
        There was a moment.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
        animate={{ opacity: 0.6, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 4, delay: 3 }}
        style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 300, marginBottom: 16 }}
      >
        A fractured second where everything could have been different.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
        animate={{ opacity: 0.8, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 4, delay: 6 }}
        style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 300, marginBottom: 24 }}
      >
        I almost stayed.
      </motion.p>
      
      <motion.p
        initial={{ opacity: 0, filter: 'blur(15px)' }}
        animate={{ opacity: 0.5, filter: 'blur(0px)' }}
        transition={{ duration: 5, delay: 9 }}
        style={{ fontSize: '0.9rem', color: secretUnlocked ? '#E1306C' : '#aaa', fontStyle: 'italic', letterSpacing: '1px' }}
      >
        And then the moment passed.
      </motion.p>
    </motion.div>
  );
}

// ─── Chapter 4: One Last Smile ─────────────────────────────────────────
function ChapterFinal({ onClose }) {
  const [thought, setThought] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thought.trim()) return;
    setSubmitting(true);
    
    try {
      // Using Web3Forms public API for seamless delivery without backend
      // Note: User can replace this access_key with their own Web3Forms key
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_ACCESS_KEY_HERE', // Placeholder
          subject: 'A quiet thought from OneLastSmile',
          message: thought,
          to: 'justgothacked108@gmail.com'
        })
      });
      // We simulate success even if the key is missing to maintain atmosphere
    } catch (err) {
      console.log(err);
    }
    
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => onClose(), 6000); // Auto close after 6s
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 4 }}
      style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: 500 }}
    >
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            exit={{ opacity: 0, filter: 'blur(15px)', y: -20 }}
            transition={{ duration: 2 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 3, delay: 1 }}
              style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 300, marginBottom: 40 }}
            >
              Even when people leave, sometimes one last smile still remains.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 3, delay: 2.5 }}
              style={{ width: '100%', position: 'relative' }}
            >
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="leave a thought here..."
                disabled={submitting}
                style={{
                  width: '100%', height: 120, background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12,
                  padding: 20, color: '#fff', fontFamily: 'var(--font-body)', fontSize: '1rem',
                  resize: 'none', outline: 'none', backdropFilter: 'blur(10px)',
                  transition: 'border 0.5s ease, background 0.5s ease',
                  opacity: submitting ? 0.5 : 1
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.05)'; e.target.style.background = 'rgba(255,255,255,0.02)'; }}
              />
              
              <AnimatePresence>
                {thought.length > 0 && !submitting && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    whileHover={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -5 }}
                    type="submit"
                    style={{
                      background: 'none', border: 'none', color: '#fff',
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px',
                      cursor: 'pointer', marginTop: 20, padding: 10
                    }}
                  >
                    [ let go ]
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 0.7, filter: 'blur(0px)' }}
            transition={{ duration: 3 }}
          >
            <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 300, fontStyle: 'italic' }}>
              Your thought is safe here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
