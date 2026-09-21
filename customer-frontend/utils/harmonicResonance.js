// Web Audio API Harmonic Resonance Engine for Crystal Sound Therapy & Interactive Micro-acoustics

class CrystalAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playChime(frequency = 528, duration = 1.8) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playSingingBowl(frequency = 432, duration = 3.5) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Fundamental + 2 shimmer harmonics
      const freqs = [frequency, frequency * 2.01, frequency * 3.03];
      const gains = [0.15, 0.06, 0.03];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(gains[idx], now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playFrequency(frequency = 528, duration = 2.0) {
    this.playSingingBowl(frequency, duration);
  }
}

export const crystalAudio = new CrystalAudioEngine();
export default crystalAudio;
