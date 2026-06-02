const fs = require('fs');
const path = require('path');

const atmospherePath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'AtmosphereLayer.jsx');
let atmosphere = fs.readFileSync(atmospherePath, 'utf8');

// 1. Fix import
atmosphere = atmosphere.replace(
  /import \{ useState, useRef \} from 'react';/,
  "import { useState, useRef, useEffect } from 'react';"
);

// 2. Fix empty catch block
atmosphere = atmosphere.replace(
  /catch\s*\(_\)\s*\{\s*\}/g,
  "catch(e) { /* ignore */ }"
);

// 3. Fix synchronous state update
atmosphere = atmosphere.replace(
  /setIdlePhrase\(phrase\);\s*setShowIdlePhrase\(true\);/,
  "setTimeout(() => { setIdlePhrase(phrase); setShowIdlePhrase(true); }, 0);"
);

// 4. Attach event handlers for the moon easter egg
atmosphere = atmosphere.replace(
  /display: 'flex', alignItems: 'center', gap: 8,\s*pointerEvents: 'none',\s*\}\}/,
  "display: 'flex', alignItems: 'center', gap: 8,\n              pointerEvents: 'auto', cursor: 'default',\n            }}\n            onMouseEnter={handleMoonInteractStart}\n            onMouseLeave={handleMoonInteractEnd}\n            onTouchStart={handleMoonInteractStart}\n            onTouchEnd={handleMoonInteractEnd}\n            onTouchCancel={handleMoonInteractEnd}"
);

fs.writeFileSync(atmospherePath, atmosphere, 'utf8');
console.log("AtmosphereLayer fixed successfully.");
