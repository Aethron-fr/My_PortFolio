const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src');

// Utility to replace in file
function replaceInFile(filePath, searchRegex, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(searchRegex, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. App.jsx
const appPath = path.join(srcDir, 'App.jsx');
replaceInFile(appPath, /const EMAIL_RE = \/\[\^@\\]\+@\\[\^@\\]\+\\.\\[\^@\\]\+\/;\n/g, '');
replaceInFile(appPath, /const validateEmail = \(email\) => \{[^}]+\};\n/g, '');
replaceInFile(appPath, /catch\s*\([^)]*\)\s*\{\s*\}/g, 'catch(e) { /* ignore */ }');

// 2. AtmosphereLayer.jsx
const atmosphereLayerPath = path.join(srcDir, 'components', 'AtmosphereLayer.jsx');
replaceInFile(atmosphereLayerPath, /import \{ useEffect, useState, useRef \} from 'react';/, "import { useState, useRef } from 'react';");
replaceInFile(atmosphereLayerPath, /catch\s*\(_\)\s*\{\s*\}/g, 'catch(e) { /* ignore */ }');

// 3. CinematicIntro.jsx
const cinematicIntroPath = path.join(srcDir, 'components', 'CinematicIntro.jsx');
replaceInFile(cinematicIntroPath, /catch\s*\(_\)\s*\{\s*\}/g, 'catch(e) { /* ignore */ }');

// 4. OneLastSmileCaseStudy.jsx
const caseStudyPath = path.join(srcDir, 'pages', 'OneLastSmileCaseStudy.jsx');
replaceInFile(caseStudyPath, /import \{ motion, AnimatePresence \} from 'framer-motion';/, "import { motion } from 'framer-motion';");

// 5. OneLastSmilePage.jsx
const olsPagePath = path.join(srcDir, 'pages', 'OneLastSmilePage.jsx');
replaceInFile(olsPagePath, /import \{ useState, useEffect, useRef, useCallback \} from 'react';/, "import { useState, useEffect, useRef } from 'react';");
replaceInFile(olsPagePath, /const EMAIL_RE = \/\[\^@\\]\+@\\[\^@\\]\+\\.\\[\^@\\]\+\/;\n/g, '');
replaceInFile(olsPagePath, /catch\s*\([^)]*\)\s*\{\s*\}/g, 'catch(e) { /* ignore */ }');

// 6. QuietAftermath.jsx
const quietAftermathPath = path.join(srcDir, 'components', 'QuietAftermath.jsx');
replaceInFile(quietAftermathPath, /import \{ motion, AnimatePresence \} from 'framer-motion';/, "import { motion } from 'framer-motion';");

// 7. StoryMode.jsx
const storyModePath = path.join(srcDir, 'components', 'StoryMode.jsx');
replaceInFile(storyModePath, /catch\s*\([^)]*\)\s*\{\s*\}/g, 'catch(e) { /* ignore */ }');

// 8. PuzzleContext.jsx
const puzzleContextPath = path.join(srcDir, 'context', 'PuzzleContext.jsx');
replaceInFile(puzzleContextPath, /import \{ motion, AnimatePresence \} from 'framer-motion';/, "import { motion } from 'framer-motion';");
replaceInFile(puzzleContextPath, /catch\s*\(_\)\s*\{\s*\}/g, 'catch(e) { /* ignore */ }');
replaceInFile(puzzleContextPath, /catch\s*\([^)]*\)\s*\{\s*\}/g, 'catch(e) { /* ignore */ }');

// 9. AtmosphereContext.jsx (Impure Dates)
const atmosphereContextPath = path.join(srcDir, 'context', 'AtmosphereContext.jsx');
let atmosphereContext = fs.readFileSync(atmosphereContextPath, 'utf8');
atmosphereContext = atmosphereContext.replace(/const sessionStart = useRef\(Date\.now\(\)\);/, 'const sessionStart = useRef(null);');
atmosphereContext = atmosphereContext.replace(/const lastMoveTime = useRef\(Date\.now\(\)\);/, 'const lastMoveTime = useRef(null);');
// Inside the slow hover detection useEffect:
atmosphereContext = atmosphereContext.replace(
  /const dt = now - lastMoveTime\.current;/,
  'if (!lastMoveTime.current) lastMoveTime.current = now;\n          const dt = now - lastMoveTime.current;'
);
// Inside the Trust level useEffect:
atmosphereContext = atmosphereContext.replace(
  /const elapsed = \(Date\.now\(\) - sessionStart\.current\) \/ 1000;/,
  'if (!sessionStart.current) sessionStart.current = Date.now();\n      const elapsed = (Date.now() - sessionStart.current) / 1000;'
);
fs.writeFileSync(atmosphereContextPath, atmosphereContext, 'utf8');

// 10. FeaturedSpotlight.jsx (Segment inline component)
const featuredSpotlightPath = path.join(srcDir, 'components', 'FeaturedSpotlight.jsx');
let featuredSpotlight = fs.readFileSync(featuredSpotlightPath, 'utf8');
if (featuredSpotlight.includes('const Segment = ({ label, value }) => (')) {
  // Extract Segment
  const segmentCode = `
const Segment = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      padding: '12px 14px',
      backdropFilter: 'blur(10px)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 300,
        color: 'rgba(255,255,255,0.9)', letterSpacing: '2px',
      }}>{value}</span>
    </div>
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '2px',
      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
    }}>{label}</span>
  </div>
);
`;
  // Remove it from inside the component
  featuredSpotlight = featuredSpotlight.replace(
    /const Segment = \(\{ label, value \}\) => \(\s*<div style=\{\{ display: 'flex'[\s\S]*?\n  \);\n/m,
    ''
  );
  // Add it outside
  featuredSpotlight = featuredSpotlight.replace(
    /export default function FeaturedSpotlight\(\) \{/,
    segmentCode + '\nexport default function FeaturedSpotlight() {'
  );
  fs.writeFileSync(featuredSpotlightPath, featuredSpotlight, 'utf8');
}

console.log("Bug fixes applied successfully.");
