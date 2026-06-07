import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// The Chrome "Sad File" icon SVG
const SadFileIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM10.5 14H8.5V16H10.5V14ZM15.5 14H13.5V16H15.5V14ZM12 12C10.9 12 10 11.1 10 10H14C14 11.1 13.1 12 12 12Z" fill="#8AB4F8"/>
    <path d="M8.5 18H15.5V19H8.5V18Z" fill="#8AB4F8"/>
  </svg>
);

export default function NotFound() {
  const navigate = useNavigate();
  const [stage, setStage] = useState('error'); // 'error', 'glitch', 'proposal'
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    document.title = 'localhost refused to connect';
    return () => {
      document.title = 'Swapnadip Ghosh — Crafted Slowly';
    };
  }, []);

  const handleReloadClick = () => {
    setStage('glitch');
    // Glitch lasts for 2 seconds
    setTimeout(() => {
      setStage('proposal');
      document.title = 'Happy Birthday';
    }, 2500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#202124',
      color: '#E8EAED',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '48px 24px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        
        {/* --- STAGE 1 & 2: The Fake Chrome Error --- */}
        <AnimatePresence>
          {(stage === 'error' || stage === 'glitch') && (
            <motion.div 
              key="error-screen"
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
              animate={stage === 'glitch' ? { 
                x: [0, -10, 10, -10, 10, 0], 
                filter: ['blur(0px)', 'blur(4px)', 'blur(0px)'],
                opacity: [1, 0.5, 1, 0.5, 1]
              } : {}}
            >
              <div style={{ marginBottom: '24px' }}>
                <SadFileIcon />
              </div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: '400', 
                margin: '0 0 16px',
                color: '#E8EAED'
              }}>
                This site can't be reached
              </h1>
              <p style={{ margin: '0 0 24px', fontSize: '15px' }}>
                <strong style={{ fontWeight: 'bold' }}>localhost</strong> refused to connect.
              </p>
              
              <div style={{ marginBottom: '32px', fontSize: '14px', color: '#9AA0A6' }}>
                <p style={{ margin: '0 0 8px' }}>Try:</p>
                <ul style={{ margin: '0', paddingLeft: '24px', lineHeight: '1.6' }}>
                  <li>Checking the connection</li>
                  <li>Checking the proxy and the firewall</li>
                </ul>
              </div>

              <div style={{ fontSize: '12px', color: '#9AA0A6', marginBottom: '40px' }}>
                ERR_CONNECTION_REFUSED
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={handleReloadClick}
                  style={{
                    backgroundColor: '#8AB4F8',
                    color: '#202124',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Reload
                </button>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#8AB4F8',
                    border: '1px solid #5F6368',
                    borderRadius: '4px',
                    padding: '7px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Details
                </button>
              </div>

              {showDetails && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: '24px', fontSize: '13px', color: '#9AA0A6', lineHeight: '1.5' }}
                >
                  Check your internet connection. Check any cables and reboot any routers, modems, or other network devices you may be using.<br/><br/>
                  Allow Chrome to access the network in your firewall or antivirus settings.
                  If it is already listed as a program allowed to access the network, try removing it from the list and adding it again.
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- STAGE 3: The Reveal (Birthday & Proposal) --- */}
        <AnimatePresence>
          {stage === 'proposal' && (
            <motion.div 
              key="proposal-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 2.0, ease: 'easeOut' }}
              style={{
                textAlign: 'center',
                paddingTop: '60px'
              }}
            >
              <h1 style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                color: '#fff',
                marginBottom: '16px',
                fontWeight: 300,
                letterSpacing: '-1px'
              }}>
                Happy Birthday.
              </h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 2 }}
              >
                <p style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.8,
                  marginBottom: '40px',
                  maxWidth: '500px',
                  margin: '0 auto 40px'
                }}>
                  I could have just bought a card. But I wanted to build a place just for us. 
                  A place where I could finally ask you the most important question of my life.
                </p>

                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  color: '#E1306C',
                  marginBottom: '40px',
                  fontWeight: 400
                }}>
                  Will you marry me?
                </h2>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button 
                    style={{
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={() => alert("She said yes! (You can customize this alert)")}
                  >
                    Yes
                  </button>
                  <button 
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '12px 32px',
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      // Classic fake-out: The "No" button moves away when hovered
                      e.target.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
                    }}
                  >
                    No
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
