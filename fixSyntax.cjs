const fs = require('fs');
const path = require('path');

const filePath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'AtmosphereLayer.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The chunk we want to eliminate completely:
const badChunk = `
          <motion.div
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'rgba(220,230,255,0.8)', letterSpacing: '2px',
              display: 'flex', alignItems: 'center', gap: 8,
              pointerEvents: 'auto', cursor: 'pointer',
            }}
            onMouseEnter={handleMoonInteractStart}
            onMouseLeave={handleMoonInteractEnd}
            onTouchStart={handleMoonInteractStart}
            onTouchEnd={handleMoonInteractEnd}
            onTouchCancel={handleMoonInteractEnd}
          >
            <span style={{ fontSize: '1.2rem' }}>{moonPhase}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>`;

if (content.includes(badChunk)) {
    content = content.replace(badChunk, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Syntax fixed!");
} else {
    console.log("Could not find the exact chunk!");
}
