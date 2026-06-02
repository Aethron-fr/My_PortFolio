const fs = require('fs');
const path = require('path');

const filePath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'AtmosphereLayer.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /\{\/\* ── Moon phase — footer corner, late night only ───────────────────────── \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/m;

const replacement = `{/* ── Moon phase — footer corner (Always Visible) ───────────────────────── */}
      <AnimatePresence>
        <motion.div
          key="moon-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLateNight ? 0.4 : 0.15 }}
          transition={{ duration: 3, delay: 2 }}
          style={{
            position: 'fixed', bottom: 20, right: 24,
            zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12,
            pointerEvents: 'none',
          }}
        >
          <AnimatePresence>
            {showMoonSecret && (
              <motion.div
                key="moon-secret"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: -5, transition: { duration: 4 } }}
                transition={{ duration: 3, ease: 'easeOut' }}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  color: 'rgba(255,255,255,0.7)', letterSpacing: '1px',
                  textAlign: 'right', whiteSpace: 'pre-line', lineHeight: 1.6,
                  textTransform: 'none', // Sentence case per request
                }}
              >
                {"Some people become like the moon.\\nBeautiful, constant, and always a little out of reach."}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'rgba(220,230,255,0.5)', letterSpacing: '2px',
              display: 'flex', alignItems: 'center', gap: 8,
              pointerEvents: 'auto', cursor: 'default',
            }}
            onMouseEnter={handleMoonInteractStart}
            onMouseLeave={handleMoonInteractEnd}
            onTouchStart={handleMoonInteractStart}
            onTouchEnd={handleMoonInteractEnd}
            onTouchCancel={handleMoonInteractEnd}
          >
            <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{moonPhase}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Moon restoration applied.");
