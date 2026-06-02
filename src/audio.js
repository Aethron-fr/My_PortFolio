class GlobalAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.rumbleGain = null;
    this.rainGain = null;
    // BUG-023: Store ScriptProcessor node reference for proper cleanup
    this.noiseNode = null;
    this.lfoNode = null;
    this.initialized = false;
    this.isMuted = false;
    this.isDucked = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Mute persistence check
      this.isMuted = localStorage.getItem('ols_muted') === '1';

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);
      
      // NOTE: ScriptProcessorNode is deprecated but used for broad browser support.
      // TODO: Migrate to AudioWorkletProcessor when browser support is sufficient.
      const bufferSize = 4096;
      // BUG-023: Store as instance property so it can be disconnected in destroy()
      this.noiseNode = this.ctx.createScriptProcessor(bufferSize, 1, 1);
      let lastOut = 0.0;
      this.noiseNode.onaudioprocess = (e) => {
        const out = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          out[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = out[i];
          out[i] *= 3.5;
        }
      };

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.value = 150;
      
      // BUG-023: Store LFO oscillator for cleanup
      this.lfoNode = this.ctx.createOscillator();
      this.lfoNode.type = 'sine';
      this.lfoNode.frequency.value = 0.2; 
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 15;
      this.lfoNode.connect(lfoGain);
      lfoGain.connect(rumbleFilter.frequency);
      this.lfoNode.start();

      this.rumbleGain = this.ctx.createGain();
      this.rumbleGain.gain.value = 0;

      const rainBandpass = this.ctx.createBiquadFilter();
      rainBandpass.type = 'bandpass';
      rainBandpass.frequency.value = 800;
      rainBandpass.Q.value = 0.4;

      const rainHighpass = this.ctx.createBiquadFilter();
      rainHighpass.type = 'highpass';
      rainHighpass.frequency.value = 300;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.value = 0;

      this.noiseNode.connect(rumbleFilter);
      rumbleFilter.connect(this.rumbleGain);
      this.rumbleGain.connect(this.masterGain);

      this.noiseNode.connect(rainBandpass);
      rainBandpass.connect(rainHighpass);
      rainHighpass.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);
      
      this.initialized = true;
    } catch(err) {
      console.warn("Web Audio API not supported", err);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    if (!this.initialized) this.init();
    this.isMuted = !this.isMuted;
    localStorage.setItem('ols_muted', this.isMuted ? '1' : '0');
    
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : (this.isDucked ? 0.3 : 1), now + 1);
  }

  setDucking(active) {
    if (!this.initialized) this.init();
    if (this.isMuted) return;
    this.isDucked = active;

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    // Smooth volume drop for deep reading moments
    this.masterGain.gain.linearRampToValueAtTime(active ? 0.3 : 1, now + 2);
  }

  setRumble(active) {
    if (!this.initialized) this.init();
    this.resume();
    if (!this.rumbleGain) return;
    
    const now = this.ctx.currentTime;
    this.rumbleGain.gain.cancelScheduledValues(now);
    if (active) {
      this.rumbleGain.gain.setValueAtTime(this.rumbleGain.gain.value, now);
      this.rumbleGain.gain.linearRampToValueAtTime(0.6, now + 4);
    } else {
      this.rumbleGain.gain.setValueAtTime(this.rumbleGain.gain.value, now);
      this.rumbleGain.gain.linearRampToValueAtTime(0, now + 2);
    }
  }

  setRain(active) {
    if (!this.initialized) this.init();
    this.resume();
    if (!this.rainGain) return;

    const now = this.ctx.currentTime;
    this.rainGain.gain.cancelScheduledValues(now);
    if (active) {
      this.rainGain.gain.setValueAtTime(this.rainGain.gain.value, now);
      this.rainGain.gain.linearRampToValueAtTime(0.08, now + 3);
    } else {
      this.rainGain.gain.setValueAtTime(this.rainGain.gain.value, now);
      this.rainGain.gain.linearRampToValueAtTime(0, now + 3);
    }
  }

  // BUG-023: Proper cleanup method — disconnects ScriptProcessor to prevent memory leak
  destroy() {
    try {
      if (this.lfoNode) {
        this.lfoNode.stop();
        this.lfoNode.disconnect();
      }
      if (this.noiseNode) {
        this.noiseNode.disconnect();
        this.noiseNode.onaudioprocess = null;
      }
      if (this.ctx) {
        this.ctx.close();
      }
    } catch (e) { console.warn("Audio cleanup error:", e); }
    this.initialized = false;
  }
}

export const audioController = new GlobalAudio();
