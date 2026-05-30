class GlobalAudio {
  constructor() {
    this.ctx = null;
    this.rumbleGain = null;
    this.rainGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      const bufferSize = 4096;
      const noise = this.ctx.createScriptProcessor(bufferSize, 1, 1);
      let lastOut = 0.0;
      noise.onaudioprocess = (e) => {
        const out = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          out[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = out[i];
          out[i] *= 3.5; // boost brown noise
        }
      };

      // 1. Rumble Path (Low-end rumble, distant thunder/train tracks)
      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.value = 150;
      
      // Add subtle tremolo to the rumble to make it feel alive
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.2; // very slow wave
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 15;
      lfo.connect(lfoGain);
      lfoGain.connect(rumbleFilter.frequency);
      lfo.start();

      this.rumbleGain = this.ctx.createGain();
      this.rumbleGain.gain.value = 0;

      // 2. Rain Path (Warm filtered brown noise, heavy rain through a window)
      const rainBandpass = this.ctx.createBiquadFilter();
      rainBandpass.type = 'bandpass';
      rainBandpass.frequency.value = 800;
      rainBandpass.Q.value = 0.4;

      const rainHighpass = this.ctx.createBiquadFilter();
      rainHighpass.type = 'highpass';
      rainHighpass.frequency.value = 300;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.value = 0;

      // Connect everything
      noise.connect(rumbleFilter);
      rumbleFilter.connect(this.rumbleGain);
      this.rumbleGain.connect(this.ctx.destination);

      noise.connect(rainBandpass);
      rainBandpass.connect(rainHighpass);
      rainHighpass.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);
      
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

  setRumble(active) {
    if (!this.initialized) this.init();
    this.resume();
    if (!this.rumbleGain) return;
    
    const now = this.ctx.currentTime;
    this.rumbleGain.gain.cancelScheduledValues(now);
    // Smooth, long fade in/out to feel organic, not mechanical
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
}

export const audioController = new GlobalAudio();
