class GlobalAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.droneGain = null;
    this.textureGain = null;
    this.pianoGain = null;
    this.globalFilter = null;
    
    // Nodes
    this.oscillators = [];
    this.lfoNodes = [];
    
    // State
    this.initialized = false;
    this.isEnabled = false; // OFF by default
    this.isDucked = false;
    this.isIdle = false;
    this.isNight = true;
    this.scrollDepth = 0;
    this.currentSection = 'home';
    
    // Loop timings
    this.pianoInterval = null;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // OFF by default. User must explicitly enable.
      this.isEnabled = localStorage.getItem('ols_audio_enabled') === '1';

      // 1. Master Chain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isEnabled ? 1 : 0;
      
      this.globalFilter = this.ctx.createBiquadFilter();
      this.globalFilter.type = 'lowpass';
      this.globalFilter.frequency.value = 1200; // Drops during idle
      this.globalFilter.Q.value = 0.5;

      this.masterGain.connect(this.globalFilter);
      this.globalFilter.connect(this.ctx.destination);

      // 2. Sweet Calm Rain Engine (Streaming actual rain audio)
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0.8; // Base volume
      this.droneGain.connect(this.masterGain);

      // We stream a high-quality, royalty-free calming rain sound directly
      const rainAudio = new Audio('https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg');
      rainAudio.loop = true;
      rainAudio.crossOrigin = 'anonymous';
      
      const rainSource = this.ctx.createMediaElementSource(rainAudio);

      // Filter 1: Lowpass to remove harsh hiss, keep it deep and calm
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1500;
      lowpass.Q.value = 0.1;

      // Filter 2: Highpass to remove excessive rumble
      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 200;
      highpass.Q.value = 0.1;

      const rainVolumeControl = this.ctx.createGain();
      rainVolumeControl.gain.value = 0.9; // Boosted base volume

      rainSource.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(rainVolumeControl);
      rainVolumeControl.connect(this.droneGain);

      rainAudio.play().catch(e => console.warn("Rain audio blocked:", e));

      this.rainAudioElement = rainAudio;
      this.oscillators = []; // reset array since we removed synthetic nodes

      // 3. Texture Layer (Replaced with higher harmonic sine for scroll depth)
      this.textureGain = this.ctx.createGain();
      this.textureGain.gain.value = 0; 
      this.textureGain.connect(this.masterGain);

      const highOsc = this.ctx.createOscillator();
      highOsc.type = 'sine';
      highOsc.frequency.value = 523.25; // C5 (Calm bright harmonic)
      highOsc.connect(this.textureGain);
      highOsc.start();
      this.oscillators.push(highOsc);

      // 4. OneLastSmile Piano Textures
      this.pianoGain = this.ctx.createGain();
      this.pianoGain.gain.value = 0;
      this.pianoGain.connect(this.masterGain);
      
      this.startPianoGenerativeLoop();

      // Tab visibility observer
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.ctx.state === 'running') this.ctx.suspend();
        } else {
          if (this.ctx.state === 'suspended' && this.isEnabled) this.ctx.resume();
        }
      });

      this.initialized = true;
    } catch(err) {
      console.warn("Web Audio API not supported", err);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended' && this.isEnabled) {
      this.ctx.resume();
    }
  }

  toggleAudio() {
    if (!this.initialized) this.init();
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('ols_audio_enabled', this.isEnabled ? '1' : '0');
    
    if (this.isEnabled && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.isEnabled ? (this.isDucked ? 0.3 : 1.0) : 0, now + 1.5);
  }

  // --- BEHAVIOR STATE METHODS ---

  setIdle(isIdle) {
    if (!this.initialized || !this.isEnabled) return;
    this.isIdle = isIdle;
    const now = this.ctx.currentTime;
    
    this.globalFilter.frequency.cancelScheduledValues(now);
    this.masterGain.gain.cancelScheduledValues(now);

    if (isIdle) {
      // Warm, soft, meditative state
      this.globalFilter.frequency.linearRampToValueAtTime(400, now + 5.0);
      this.masterGain.gain.linearRampToValueAtTime(0.6, now + 5.0);
    } else {
      // Alert, active state
      this.globalFilter.frequency.linearRampToValueAtTime(1200, now + 2.0);
      this.masterGain.gain.linearRampToValueAtTime(1.0, now + 2.0);
    }
  }

  setScrollDepth(depth) {
    if (!this.initialized || !this.isEnabled) return;
    this.scrollDepth = depth;
    const now = this.ctx.currentTime;
    
    // Bring in a soft higher harmonic as they scroll deeper
    this.textureGain.gain.cancelScheduledValues(now);
    const targetTexture = depth * 0.08; // Max 0.08, very subtle
    this.textureGain.gain.linearRampToValueAtTime(targetTexture, now + 1.0);
  }

  setSection(section) {
    if (!this.initialized || !this.isEnabled) return;
    this.currentSection = section;
    const now = this.ctx.currentTime;
    
    this.pianoGain.gain.cancelScheduledValues(now);
    if (section === 'onelastsmile') {
      // Bring up emotional piano textures
      this.pianoGain.gain.linearRampToValueAtTime(1.0, now + 4.0);
    } else {
      this.pianoGain.gain.linearRampToValueAtTime(0.0, now + 3.0);
    }
  }

  setTheme(isNight) {
    if (!this.initialized || !this.isEnabled) return;
    this.isNight = isNight;
    // We could shift the fundamental drone frequencies here for day/night
    // For now, keeping it extremely subtle to avoid jarring transitions.
  }

  setDucking(active) {
    if (!this.initialized || !this.isEnabled) return;
    this.isDucked = active;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(active ? 0.25 : (this.isIdle ? 0.6 : 1.0), now + 1.5);
  }

  // --- GENERATORS ---

  startPianoGenerativeLoop() {
    // Generates a soft, sporadic FM synthesis ping (like a distant piano)
    const scale = [261.63, 329.63, 392.00, 523.25, 659.25]; // C Major Pentatonic (Calm, angelic)
    
    const playNote = () => {
      if (!this.isEnabled || this.currentSection !== 'onelastsmile') return;
      
      const now = this.ctx.currentTime;
      const freq = scale[Math.floor(Math.random() * scale.length)];
      
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const env = this.ctx.createGain();
      env.gain.value = 0;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.15, now + 1.0); // Soft attack
      env.gain.exponentialRampToValueAtTime(0.001, now + 5.0); // Long decay
      
      osc.connect(env);
      env.connect(this.pianoGain);
      
      osc.start(now);
      osc.stop(now + 6.0);
    };

    // Play a note every 4 to 8 seconds randomly
    const loop = () => {
      playNote();
      this.pianoInterval = setTimeout(loop, 4000 + (Math.random() * 4000));
    };
    loop();
  }

  playMoonSecret() {
    if (!this.initialized) this.init();
    if (!this.isEnabled) return; // Respect user preference even for secrets
    this.resume();

    const now = this.ctx.currentTime;
    
    // Very soft ethereal chime
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 880; // High A
    
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.2, now + 0.1);
    env.gain.exponentialRampToValueAtTime(0.001, now + 4.0);
    
    osc.connect(env);
    env.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 4.5);
  }

  playClick() {
    if (!this.initialized) this.init();
    if (!this.isEnabled || !this.ctx) return;
    this.resume();

    try {
      const now = this.ctx.currentTime;
      // Crisp ui click
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
      
      const env = this.ctx.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.3, now + 0.01);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      osc.connect(env);
      env.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Audio click failed', e);
    }
  }

  // Backwards compatibility for old methods if they were used
  setRumble(active) { this.setSection(active ? 'onelastsmile' : 'home'); }
  setRain(active) { this.setSection(active ? 'onelastsmile' : 'home'); }

  destroy() {
    try {
      if (this.pianoInterval) clearTimeout(this.pianoInterval);
      this.oscillators.forEach(o => { o.stop(); o.disconnect(); });
      this.lfoNodes.forEach(l => { l.stop(); l.disconnect(); });
      if (this.noiseNode) {
        this.noiseNode.disconnect();
        this.noiseNode.onaudioprocess = null;
      }
      if (this.ctx) this.ctx.close();
    } catch (e) { console.warn("Audio cleanup error:", e); }
    this.initialized = false;
  }
}

export const audioController = new GlobalAudio();
