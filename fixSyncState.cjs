const fs = require('fs');
const path = require('path');

const idleMessagesPath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'IdleMessages.jsx');
let idleMsg = fs.readFileSync(idleMessagesPath, 'utf8');
idleMsg = idleMsg.replace(
  /\} else \{\s*setVisible\(false\);\s*\}/,
  '} else {\n      setTimeout(() => setVisible(false), 0);\n    }'
);
fs.writeFileSync(idleMessagesPath, idleMsg, 'utf8');

const puzzleRevealPath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'PuzzleReveal.jsx');
let puzzleRev = fs.readFileSync(puzzleRevealPath, 'utf8');
puzzleRev = puzzleRev.replace(
  /    setPhase\('running'\);\n    setShowHeart\(false\);\n    setShowSubtitle\(false\);\n    setShowSecretMessage\(false\);/,
  `    setTimeout(() => {
      setPhase('running');
      setShowHeart(false);
      setShowSubtitle(false);
      setShowSecretMessage(false);
    }, 0);`
);
fs.writeFileSync(puzzleRevealPath, puzzleRev, 'utf8');

const atmospherePath = path.join('C:\\\\Users\\\\ghosh\\\\OneDrive\\\\Desktop\\\\codes\\\\portfolio\\\\src\\\\components', 'AtmosphereLayer.jsx');
let atmosphere = fs.readFileSync(atmospherePath, 'utf8');
atmosphere = atmosphere.replace(
  /setShowIdlePhrase\(false\);/,
  'setTimeout(() => setShowIdlePhrase(false), 0);'
);
fs.writeFileSync(atmospherePath, atmosphere, 'utf8');

console.log("Fixed remaining synchronous state bugs.");
