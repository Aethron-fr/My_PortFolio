import { useEffect, useState, useRef } from 'react';
import { ref, onValue, set, onDisconnect } from 'firebase/database';
import { database } from '../utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';

// Generate a random cursor color for each unique visitor
const COLORS = ['#00f7ff', '#e1306c', '#fbbf24', '#7b2cbf', '#39d353'];
const MY_COLOR = COLORS[Math.floor(Math.random() * COLORS.length)];
const MY_ID = `user_${Math.random().toString(36).substr(2, 9)}`;

export default function LiveCursors() {
  const [cursors, setCursors] = useState({});
  const myCursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isFirebaseConfigured] = useState(() => !database.app.options.apiKey.includes("MOCK_API_KEY"));

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const cursorsRef = ref(database, 'cursors');
    const myCursorDbRef = ref(database, `cursors/${MY_ID}`);

    // Remove cursor on disconnect
    onDisconnect(myCursorDbRef).remove();

    // Listen to other cursors
    const unsubscribe = onValue(cursorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Remove self from the render map
        delete data[MY_ID];
        setCursors(data);
      } else {
        setCursors({});
      }
    });

    let lastUpdate = 0;
    const handleMouseMove = (e) => {
      myCursorRef.current = { x: e.clientX, y: e.clientY };
      
      const now = Date.now();
      if (now - lastUpdate > 66) { // Throttle to ~15fps (1000ms / 15)
        lastUpdate = now;
        set(myCursorDbRef, {
          x: e.clientX,
          y: e.clientY,
          color: MY_COLOR,
          timestamp: now
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribe();
      set(myCursorDbRef, null); // cleanup on unmount
    };
  }, [isFirebaseConfigured]);

  if (!isFirebaseConfigured) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      <AnimatePresence>
        {Object.entries(cursors).map(([id, cursor]) => {
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: cursor.x, y: cursor.y }}
              exit={{ opacity: 0 }}
              transition={{
                x: { type: 'spring', damping: 25, stiffness: 200, mass: 0.5 },
                y: { type: 'spring', damping: 25, stiffness: 200, mass: 0.5 },
                opacity: { duration: 0.2 }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {/* SVG Cursor Pointer */}
              <svg width="24" height="36" viewBox="0 0 24 36" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                <path d="M5.65376 2.15376L22.6322 19.1322C23.5159 20.016 22.8906 21.525 21.6423 21.525H13.8407L11.7588 28.5146C11.3995 29.7214 9.68413 29.8344 9.16738 28.683L1.57966 11.7828C0.916733 10.306 1.70889 8.60803 3.25052 8.19692L11.0264 6.12338L3.17863 3.63853C1.96868 3.25539 2.02324 1.48831 3.26442 1.18349C4.12061 0.973167 5.01166 1.34117 5.51866 2.05199L5.65376 2.15376Z" fill={cursor.color} stroke="white" strokeWidth="2"/>
              </svg>
              {/* User Label */}
              <div style={{
                background: cursor.color,
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 'bold',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap'
              }}>
                GUEST
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
