import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#_';

export default function MatrixText({ text, style, className, delay = 0, duration = 1.2 }) {
  const [displayText, setDisplayText] = useState(() => 
    text.replace(/[a-zA-Z0-9]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)])
  );
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    const maxIterations = 30; // Total frames for the animation
    const intervalTime = (duration * 1000) / maxIterations;

    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setDisplayText(() =>
          text
            .split('')
            .map((letter, index) => {
              if (index < (iteration / maxIterations) * text.length) {
                return text[index];
              }
              if (letter === ' ') return ' ';
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );

        if (iteration >= maxIterations) {
          clearInterval(intervalRef.current);
          setDisplayText(text);
        }
        
        iteration += 1;
      }, intervalTime);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isInView, text, delay, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        fontVariantNumeric: 'tabular-nums',
        ...style
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {displayText}
    </motion.span>
  );
}
