import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function OneLastSmileShowcase() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2027-01-03T00:00:00').getTime();

    const updateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#020002', color: '#fff',
      fontFamily: 'var(--font-body)', overflowX: 'hidden'
    }}>
      {/* Background Atmosphere */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at center top, rgba(225,48,108,0.05) 0%, transparent 60%)',
      }} />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px', position: 'relative', zIndex: 1 }}>
        
        {/* HERO SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}
          style={{ textAlign: 'center', marginBottom: '120px' }}
        >
          <div style={{
            display: 'inline-block', border: '1px solid rgba(0,247,255,0.3)',
            color: 'rgba(0,247,255,0.8)', padding: '6px 16px', borderRadius: '30px',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '40px'
          }}>
            Opening January 3, 2027
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 300, letterSpacing: '-2px', marginBottom: '24px' }}>
            OneLastSmile
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>
            An Experimental Digital Experience About Memory, Time, and Things Left Unsaid.
          </p>
        </motion.section>

        {/* COUNTDOWN */}
        <motion.section 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }}
          style={{ 
            display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 60px)', 
            marginBottom: '160px', borderTop: '1px solid rgba(255,255,255,0.05)', 
            borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '60px 0' 
          }}
        >
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                {item.value.toString().padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                {item.label}
              </div>
            </div>
          ))}
        </motion.section>

        {/* WHY THIS PROJECT MATTERS */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ marginBottom: '160px', textAlign: 'center', padding: '0 24px' }}
        >
          <h2 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '60px' }}>
            More Than A Project
          </h2>
          
          <div style={{ fontSize: '1.4rem', fontWeight: 300, lineHeight: 2, color: 'rgba(255,255,255,0.7)', maxWidth: '720px', margin: '0 auto', textAlign: 'left' }}>
            <p style={{ marginBottom: '30px' }}>
              OneLastSmile is not just another project in my portfolio.
            </p>
            <p style={{ marginBottom: '30px' }}>
              It is the <span style={{ color: '#fff', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>most personal thing I have ever created</span>.
            </p>
            <p style={{ marginBottom: '30px' }}>
              More than a year of planning, learning, designing, rebuilding, and growing went into it. Every section, every animation, every line of text exists for a reason.
            </p>
            <p style={{ marginBottom: '30px' }}>
              This project became a place where I poured countless hours, ideas, mistakes, lessons, memories, and emotions into a single experience.
            </p>
            <p style={{ marginBottom: '50px' }}>
              It represents not only what I can build as a developer, but also what I wanted to express as a person.
            </p>

            <p style={{ marginBottom: '30px' }}>
              The date is not random.
            </p>
            <p style={{ marginBottom: '30px' }}>
              <span style={{ color: 'rgba(0,247,255,0.9)', textShadow: '0 0 15px rgba(0,247,255,0.4)' }}>January 3, 2027</span> holds an unforgettable place in my life.
            </p>
            <p style={{ marginBottom: '30px' }}>
              OneLastSmile was created for that day.
            </p>

            <p style={{ marginBottom: '30px', fontStyle: 'italic' }}>
              <span style={{ color: '#fff', textShadow: '0 0 15px rgba(255,255,255,0.5)', fontStyle: 'normal' }}>A final smile.</span><br/>
              A final story.<br/>
              A final expression of everything I never managed to say properly.
            </p>

            <p style={{ marginBottom: '30px' }}>
              Whether it is ever fully read or not, that was never the point.
            </p>
            <p style={{ marginBottom: '30px' }}>
              The point was creating something honest.
            </p>
            <p>
              And that is why this project will always remain one of the most important things I have ever built.
            </p>
          </div>
        </motion.section>

        {/* OVERVIEW */}
        <section style={{ marginBottom: '160px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto 40px' }}>
            Most websites are designed to deliver information.<br/><br/>
            OneLastSmile was designed to deliver a feeling.
          </p>
          <p style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto' }}>
            This project explores memory, permanence, emotional storytelling, and interactive narrative design.
          </p>
        </section>

        {/* BUTTONS */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '24px', 
          maxWidth: '850px', 
          margin: '0 auto 160px',
          padding: '0 24px'
        }}>
          {['View Architecture', 'Development Timeline', 'Technical Breakdown'].map((label, i) => (
            <motion.button 
              key={i} 
              whileHover={{ 
                background: 'rgba(255,255,255,0.04)', 
                borderColor: 'rgba(225,48,108,0.4)', 
                color: '#fff',
                boxShadow: '0 0 25px rgba(225,48,108,0.15)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/case-study/onelastsmile')}
              style={{
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)', 
                padding: '20px 24px', 
                borderRadius: '16px',
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.65rem', 
                letterSpacing: '2px', 
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                backdropFilter: 'blur(10px)',
                width: '100%'
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* SPECIAL MESSAGE */}
        <footer style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '100px', paddingBottom: '40px' }}>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', lineHeight: 2, fontWeight: 300, fontStyle: 'italic' }}>
            This project carries more than code.<br/>
            It carries a year of thought, effort, mistakes, growth, and memories.<br/><br/>
            It will open on January 3, 2027.
          </p>
        </footer>

      </main>
    </div>
  );
}
