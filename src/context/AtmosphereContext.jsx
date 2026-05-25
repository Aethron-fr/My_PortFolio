// atmosphere — the layer underneath everything.
// "strange how tastes change."
// "maybe we heard each other differently."
// A.
// 🤍
// I used to hate the rain.
import { useState, useEffect, useRef, createContext, useContext } from 'react';

// ─── Context ──────────────────────────────────────────────────────────────────
const AtmosphereContext = createContext({
  isLateNight: false,
  isIdle: false,
  trustLevel: 0,
  moonPhase: '',
});

export function useAtmosphere() {
  return useContext(AtmosphereContext);
}

// ─── Moon phase helper ────────────────────────────────────────────────────────
function getMoonPhase() {
  // Simple 29.5-day lunar cycle approximation
  const known = new Date('2000-01-06').getTime(); // known new moon
  const now = Date.now();
  const cycle = 29.530588853 * 24 * 60 * 60 * 1000;
  const phase = ((now - known) % cycle) / cycle;
  if (phase < 0.03 || phase > 0.97) return '🌑';
  if (phase < 0.22) return '🌒';
  if (phase < 0.28) return '🌓';
  if (phase < 0.47) return '🌔';
  if (phase < 0.53) return '🌕';
  if (phase < 0.72) return '🌖';
  if (phase < 0.78) return '🌗';
  return '🌘';
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AtmosphereProvider({ children }) {
  const [isLateNight, setIsLateNight] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [trustLevel, setTrustLevel] = useState(0);
  const [moonPhase] = useState(getMoonPhase);

  const idleTimer = useRef(null);
  const sessionStart = useRef(Date.now());
  const slowHoverCount = useRef(0);
  const lastMoveTime = useRef(Date.now());

  // Late-night detection (22:00 – 05:00)
  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setIsLateNight(h >= 22 || h < 5);
    };
    check();
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, []);

  // Idle detection — 40 seconds of no activity
  useEffect(() => {
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), 40_000);
    };
    const events = ['mousemove', 'scroll', 'keydown', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetIdle, { passive: true }));
    resetIdle();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdle));
      clearTimeout(idleTimer.current);
    };
  }, []);

  // Slow hover detection — counts when mouse moves slowly
  useEffect(() => {
    let lastX = 0, lastY = 0;
    const onMove = (e) => {
      const now = Date.now();
      const dt = now - lastMoveTime.current;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(dt, 1);
      if (speed < 0.15 && dt > 200) {
        slowHoverCount.current += 1;
      }
      lastX = e.clientX; lastY = e.clientY;
      lastMoveTime.current = now;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Trust level — increases with time and exploration depth
  useEffect(() => {
    const compute = () => {
      const elapsed = (Date.now() - sessionStart.current) / 1000;
      const storyVisits = parseInt(sessionStorage.getItem('ols_visits') || '0');
      const slowHovers = slowHoverCount.current;
      let level = 0;
      if (elapsed > 45) level = 1;
      if (elapsed > 120 || storyVisits >= 1 || slowHovers > 30) level = 2;
      if (elapsed > 300 && (storyVisits >= 1 || slowHovers > 60)) level = 3;
      setTrustLevel(level);
    };
    const t = setInterval(compute, 8_000);
    compute();
    return () => clearInterval(t);
  }, []);

  return (
    <AtmosphereContext.Provider value={{ isLateNight, isIdle, trustLevel, moonPhase }}>
      {children}
    </AtmosphereContext.Provider>
  );
}
