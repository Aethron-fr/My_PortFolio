import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  useEffect(() => {
    document.title = '404 | SYSTEM FAILURE';
    return () => {
      document.title = 'Swapnadip Ghosh — Crafted Slowly';
    };
  }, []);

  const handleCommand = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === 'reboot') {
      navigate('/');
    } else {
      setInput('');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-mono, monospace)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <style>
        {`
          @keyframes glitch {
            0% { transform: translate(0) }
            20% { transform: translate(-4px, 2px) }
            40% { transform: translate(4px, -2px) }
            60% { transform: translate(-2px, 4px) }
            80% { transform: translate(2px, -4px) }
            100% { transform: translate(0) }
          }
          .glitch-text {
            position: relative;
            animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
          }
          .glitch-text::before, .glitch-text::after {
            content: "404";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
          }
          .glitch-text::before {
            color: #0ff;
            z-index: -1;
            transform: translate(-3px, 2px);
            animation: glitch 0.4s cubic-bezier(.25, .46, .45, .94) both infinite reverse;
          }
          .glitch-text::after {
            color: #f0f;
            z-index: -2;
            transform: translate(3px, -2px);
            animation: glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite;
          }
        `}
      </style>

      {/* Heavy Red Overlay & Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(255, 0, 60, 0.1) 0%, rgba(10, 0, 0, 0.95) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', width: '100%', padding: '0 20px' }}>
        <h1
          className="glitch-text"
          style={{
            fontSize: 'clamp(6rem, 15vw, 12rem)',
            fontWeight: 900,
            color: '#fff',
            margin: '0 0 10px',
            lineHeight: 1,
            letterSpacing: '-8px',
            textShadow: '0 0 20px rgba(255, 0, 60, 0.5)'
          }}
        >
          404
        </h1>

        <div style={{
          background: 'rgba(20, 10, 10, 0.8)',
          border: '1px solid #ff003c',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 0 30px rgba(255, 0, 60, 0.2)',
          textAlign: 'left'
        }}>
          <p style={{ color: '#ff003c', margin: '0 0 10px', fontSize: '1rem', textTransform: 'uppercase' }}>
            [FATAL ERROR] Signal Lost. Route Corrupted.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 30px', fontSize: '0.9rem', lineHeight: 1.5 }}>
            The memory block you are trying to access has been overwritten or destroyed. <br/>
            Please initiate a system reboot.
          </p>
          
          <form onSubmit={handleCommand} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#ff003c', marginRight: '10px' }}>sys_recovery:~#</span>
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type 'reboot'"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '1rem',
                width: '100%'
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
