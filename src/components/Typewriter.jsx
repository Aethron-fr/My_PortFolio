import { useState, useEffect } from 'react';

export default function Typewriter({ words = [], speed = 100, delay = 2000 }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    let timer;
    const currentWord = words[currentWordIndex];

    if (!isDeleting && currentText === currentWord) {
      // Pause on the full word before deleting it.
      timer = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && currentText === '') {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, 0);
    } else if (isDeleting) {
      // Deleting speed is twice as fast
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, speed / 2);
    } else {
      // Typing speed
      timer = setTimeout(() => {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed, delay]);

  return (
    <span style={{ position: 'relative' }}>
      <span style={{
        background: 'var(--insta-gradient)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {currentText}
      </span>
      <span
        style={{
          marginLeft: '4px',
          borderRight: '2px solid var(--accent-cyber)',
          animation: 'blink 0.8s step-end infinite',
          opacity: 0.8,
        }}
      />
      <style>{`
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: var(--accent-cyber) }
        }
      `}</style>
    </span>
  );
}
