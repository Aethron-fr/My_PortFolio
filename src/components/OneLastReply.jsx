import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { audioController } from '../audio';

export default function OneLastReply({ onComplete }) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [showWarning, setShowWarning] = useState(true);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setStatus('sending');

    try {
      // NOTE: Replace these with your actual EmailJS credentials
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_onelastsmile';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_reply';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_here';

      // We still mock it if keys aren't actually real so the experience doesn't break
      if (publicKey === 'public_key_here') {
        await new Promise(r => setTimeout(r, 2500)); // mock delay
      } else {
        await emailjs.send(serviceId, templateId, {
          message: message,
          date: new Date().toLocaleDateString(),
        }, publicKey);
      }
      
      setStatus('success');
      setTimeout(() => onComplete(), 3000);
    } catch (err) {
      console.error('Email failed:', err);
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99991,
        background: '#020002', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', overflow: 'hidden'
      }}
    >
      {/* Background Glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, rgba(225,48,108,0.03) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      <AnimatePresence mode="wait">
        {showWarning ? (
          <motion.div
            key="warning"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 2 }}
            style={{ textAlign: 'center', maxWidth: '500px', padding: '0 24px' }}
          >
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontWeight: 300, marginBottom: '40px' }}>
              If you could say one last thing... knowing it would never be read.
            </p>
            <button
              onClick={() => {
                setShowWarning(false);
                audioController.setDucking(true);
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(225,48,108,0.3)',
                color: '#fff', padding: '12px 32px',
                borderRadius: '30px', fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.3s ease'
              }}
            >
              Write
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="compose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 2 }}
            style={{ width: '100%', maxWidth: '600px', padding: '0 24px', position: 'relative' }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status !== 'idle' && status !== 'error'}
              placeholder="Start typing..."
              style={{
                width: '100%', height: '300px',
                background: 'transparent',
                border: 'none', outline: 'none',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.2rem', lineHeight: 1.8,
                fontWeight: 300, resize: 'none',
                fontFamily: 'var(--font-body)'
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: status === 'error' ? '#ff4f81' : 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase'
              }}>
                {status === 'sending' && "Sending into the dark..."}
                {status === 'success' && "Sent."}
                {status === 'error' && "Failed to send."}
                {status === 'idle' && "No one will reply."}
              </div>

              {status === 'idle' && message.trim().length > 0 && (
                <button
                  onClick={handleSubmit}
                  style={{
                    background: 'transparent',
                    border: 'none', color: 'rgba(225,48,108,0.8)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
                    transition: 'color 0.3s'
                  }}
                >
                  Let Go
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
