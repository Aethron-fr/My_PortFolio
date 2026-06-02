const fs = require('fs');
const path = require('path');

// 1. Patch AtmosphereLayer.jsx for the Moon Easter Egg
const atmospherePath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'AtmosphereLayer.jsx');
let atmosphereContent = fs.readFileSync(atmospherePath, 'utf8');

if (!atmosphereContent.includes('const [showMoonSecret, setShowMoonSecret] = useState(false);')) {
  atmosphereContent = atmosphereContent.replace(
    'const [showIdlePhrase, setShowIdlePhrase] = useState(false);',
    `const [showIdlePhrase, setShowIdlePhrase] = useState(false);
  const [showMoonSecret, setShowMoonSecret] = useState(false);
  const [moonHovered, setMoonHovered] = useState(false);
  const moonTimerRef = require('react').useRef(null);
  
  const handleMoonInteractStart = () => {
    setMoonHovered(true);
    if (moonTimerRef.current) clearTimeout(moonTimerRef.current);
    moonTimerRef.current = setTimeout(() => {
      setShowMoonSecret(true);
      // Auto-hide after 6 seconds of showing
      setTimeout(() => setShowMoonSecret(false), 6000);
    }, 8000); // 8 seconds hold
  };
  
  const handleMoonInteractEnd = () => {
    setMoonHovered(false);
    if (moonTimerRef.current) clearTimeout(moonTimerRef.current);
  };`
  );
  
  const originalMoonPhase = `      {/* ── Moon phase — footer corner, late night only ───────────────────────── */}
      <AnimatePresence>
        {isLateNight && (
          <motion.div
            key="moon-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, delay: 2 }}
            style={{
              position: 'fixed', bottom: 20, right: 24,
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'rgba(220,230,255,0.5)',
              letterSpacing: '2px', zIndex: 100,
              display: 'flex', alignItems: 'center', gap: 8,
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{moonPhase}</span>
          </motion.div>
        )}
      </AnimatePresence>`;

  const updatedMoonPhase = `      {/* ── Moon phase — footer corner ───────────────────────── */}
      <AnimatePresence>
        {true && (
          <motion.div
            key="moon-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, delay: 2 }}
            onMouseEnter={handleMoonInteractStart}
            onMouseLeave={handleMoonInteractEnd}
            onTouchStart={handleMoonInteractStart}
            onTouchEnd={handleMoonInteractEnd}
            onTouchCancel={handleMoonInteractEnd}
            style={{
              position: 'fixed', bottom: 20, right: 24,
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'rgba(220,230,255,0.5)',
              letterSpacing: '2px', zIndex: 100,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
          >
            <AnimatePresence>
              {showMoonSecret && (
                <motion.div
                  initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{
                    fontSize: '0.55rem',
                    color: 'rgba(220,230,255,0.6)',
                    letterSpacing: '1px',
                    whiteSpace: 'nowrap',
                    marginBottom: '4px',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-serif)',
                    pointerEvents: 'none'
                  }}
                >
                  "Not everything I loved stayed. The moon did."
                </motion.div>
              )}
            </AnimatePresence>
            <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{moonPhase}</span>
          </motion.div>
        )}
      </AnimatePresence>`;

  atmosphereContent = atmosphereContent.replace(originalMoonPhase, updatedMoonPhase);
  fs.writeFileSync(atmospherePath, atmosphereContent, 'utf8');
}


// 2. Patch App.jsx for Contact Section Responsiveness
const appJsxPath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src', 'App.jsx');
let appContent = fs.readFileSync(appJsxPath, 'utf8');

// Update input padding and heights for mobile responsiveness via classes
// First, find the input fields in App.jsx and add a generic class to them.
appContent = appContent.replace(
  `style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.95rem',
                      transition: 'border-color 0.3s'
                    }}`,
  `className="contact-input"
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }}`
);
appContent = appContent.replace(
  `style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.95rem',
                      transition: 'border-color 0.3s'
                    }}`,
  `className="contact-input"
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }}`
);
appContent = appContent.replace(
  `style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      lineHeight: '1.5',
                      resize: 'none',
                      transition: 'border-color 0.3s'
                    }}`,
  `className="contact-input"
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
                    }}`
);

// Email wrap
appContent = appContent.replace(
  `ghoshswapnadip7@gmail.com
                    </a>`,
  `ghoshswapnadip7@gmail.com
                    </a>`
);
appContent = appContent.replace(
  `style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '400' }}>`,
  `style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '400', wordBreak: 'break-word', display: 'block', paddingRight: '10px' }}>`
);

// Add custom class to the grid for mobile spacing
appContent = appContent.replace(
  `          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>`,
  `          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>`
);

// Floating Theme Controls spacing: increasing footer padding on mobile so contact section has breathing room
appContent = appContent.replace(
  `<footer style={{ position: 'relative', zIndex: 2, padding: '120px 0 60px', background: 'var(--bg-footer)' }}>`,
  `<footer className="main-footer" style={{ position: 'relative', zIndex: 2, padding: '120px 0 80px', background: 'var(--bg-footer)' }}>`
);

fs.writeFileSync(appJsxPath, appContent, 'utf8');

// 3. Patch index.css
const indexCssPath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src', 'index.css');
let indexCssContent = fs.readFileSync(indexCssPath, 'utf8');

const cssAdditions = `

/* Mobile Responsiveness & Contact Section */
.contact-input {
  padding: 14px 18px;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .contact-input {
    padding: 12px 14px;
    font-size: 0.9rem;
  }
  
  .glass-panel {
    padding: 24px !important;
  }
  
  .contact-grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }

  .main-footer {
    padding-bottom: 120px !important;
  }
}
`;

if (!indexCssContent.includes('.contact-input')) {
  indexCssContent += cssAdditions;
  fs.writeFileSync(indexCssPath, indexCssContent, 'utf8');
}
