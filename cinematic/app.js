/**
 * ============================================================================
 * SUMUK CRYSTALZ — CINEMATIC FULL-SCREEN VIDEO ENGINE
 * Principal Frontend Engineer & Creative Technologist Specialization Deliverable
 * ============================================================================
 */

/* ============================================================================
   CLEARLY MARKED VIDEO ASSET CONFIGURATION & PLAYLIST ARRAY
   All local video file paths and exact descriptive metadata
   ============================================================================ */
const VIDEO_CONFIG = {
  // Video 1: Preloader / Loading Screen
  intro: {
    id: 'video-1',
    videoNumber: 1,
    title: 'WELCOME TO SUMUK CRYSTALZ',
    subtitle: 'SACRED ENERGY & INTENTIONAL HEALING STONES',
    // Local video asset paths (supports Next.js public & relative file paths):
    sources: [
      '../customer-frontend/public/videos/video1.mp4',
      '../customer-frontend/Videos/Video 1.mp4',
      '/videos/video1.mp4',
      '/videos/Video 1.mp4',
      '/videos/intro.mp4'
    ],
    consecrationFreq: '528 Hz',
  },

  // The Live UI Sequence Begins from Video 2 through Video 6
  playlist: [
    // 1. VIDEO 2: Amethyst
    {
      id: 'video-2',
      videoNumber: 2,
      name: 'Amethyst',
      title: 'AMETHYST',
      specimenCode: 'SPECIMEN // AM-202',
      provenance: 'Rio Grande do Sul, Brazil',
      chakra: 'Crown & Third Eye',
      frequency: '528 Hz Solfeggio',
      freqHz: 528,
      colorAccent: '#c084fc',
      colorGlow: 'rgba(168, 85, 247, 0.55)',
      sources: [
        '../customer-frontend/public/videos/video2.mp4',
        '../customer-frontend/Videos/video 2.mp4',
        '/videos/video2.mp4',
        '/videos/video 2.mp4'
      ],
      description:
        'Known as the stone of peace, it promotes calm, relieves stress, and enhances spiritual intuition.',
    },

    // 2. VIDEO 3: Tiger's Eye
    {
      id: 'video-3',
      videoNumber: 3,
      name: "Tiger's Eye",
      title: "TIGER'S EYE",
      specimenCode: 'SPECIMEN // TE-303',
      provenance: 'Griqualand West, South Africa',
      chakra: 'Solar Plexus & Root',
      frequency: '320 Hz Grounding',
      freqHz: 320,
      colorAccent: '#f5d47a',
      colorGlow: 'rgba(245, 212, 122, 0.55)',
      sources: [
        '../customer-frontend/public/videos/video3.mp4',
        '../customer-frontend/Videos/Video 3.mp4',
        '/videos/video3.mp4',
        '/videos/Video 3.mp4'
      ],
      description:
        'A grounding stone of courage and protection that boosts self-confidence, willpower, and focus.',
    },

    // 3. VIDEO 4: Green Aventurine
    {
      id: 'video-4',
      videoNumber: 4,
      name: 'Green Aventurine',
      title: 'GREEN AVENTURINE',
      specimenCode: 'SPECIMEN // GA-404',
      provenance: 'Tamil Nadu & Karnataka, India',
      chakra: 'Heart & Solar Plexus',
      frequency: '528 Hz Prosperity',
      freqHz: 528,
      colorAccent: '#34d399',
      colorGlow: 'rgba(52, 211, 153, 0.55)',
      sources: [
        '../customer-frontend/public/videos/video4.mp4',
        '../customer-frontend/Videos/video 4.mp4',
        '/videos/video4.mp4',
        '/videos/video 4.mp4'
      ],
      description:
        'Regarded as the stone of opportunity, it attracts good luck, wealth, and abundance.',
    },

    // 4. VIDEO 5: Crystal Bracelet
    {
      id: 'video-5',
      videoNumber: 5,
      name: 'Crystal Bracelet',
      title: 'CRYSTAL BRACELET',
      specimenCode: 'SPECIMEN // CB-505',
      provenance: 'Vedic Consecrated Artisan Studio',
      chakra: 'Aura & All Energy Centers',
      frequency: '639 Hz Harmonic',
      freqHz: 639,
      colorAccent: '#38bdf8',
      colorGlow: 'rgba(56, 189, 248, 0.55)',
      sources: [
        '../customer-frontend/public/videos/video5.mp4',
        '../customer-frontend/Videos/video 5.mp4',
        '/videos/video5.mp4',
        '/videos/video 5.mp4'
      ],
      description:
        "Remember, you don't simply choose the crystal—the crystal chooses you. Every piece is cleansed, blessed, and infused with sacred Reiki energy before it begins its journey to the soul it was destined to meet.",
    },

    // 5. VIDEO 6: Rose Quartz
    {
      id: 'video-6',
      videoNumber: 6,
      name: 'Rose Quartz',
      title: 'ROSE QUARTZ',
      specimenCode: 'SPECIMEN // RQ-606',
      provenance: 'Minas Gerais, Brazil',
      chakra: 'Heart (Anahata)',
      frequency: '639 Hz Unconditional Love',
      freqHz: 639,
      colorAccent: '#f472b6',
      colorGlow: 'rgba(244, 114, 182, 0.55)',
      sources: [
        '../customer-frontend/public/videos/video6.mp4',
        '../customer-frontend/Videos/video 6.mp4',
        '/videos/video6.mp4',
        '/videos/video 6.mp4'
      ],
      description:
        'The stone of universal love, it fosters emotional healing, compassion, and deeper relationship harmony.',
    },
  ],
};

/* ============================================================================
   CINEMATIC APPLICATION CONTROLLER CLASS
   ============================================================================ */
class CinematicVideoEngine {
  constructor() {
    this.currentIndex = 0;
    this.activeLayer = 'A'; // 'A' or 'B'
    this.isTransitioning = false;
    this.crossFadeDurationMs = 1500;
    this.isAudioActive = false;
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;

    // DOM Elements
    this.preloaderCurtain = document.getElementById('preloader-curtain');
    this.preloaderVideo = document.getElementById('preloader-video');
    this.preloaderTitleBox = document.getElementById('preloader-title-box');
    this.skipBtn = document.getElementById('skip-preloader-btn');

    this.videoLayerA = document.getElementById('video-layer-a');
    this.videoLayerB = document.getElementById('video-layer-b');
    this.ambientAura = document.getElementById('ambient-aura');

    this.hudSpecimenCode = document.getElementById('hud-specimen-code');
    this.hudProvenance = document.getElementById('hud-provenance');
    this.hudFrequency = document.getElementById('hud-frequency');
    this.hudChakraLabel = document.getElementById('hud-chakra-label');
    this.chakraDot = document.getElementById('chakra-dot');
    this.hudTitle = document.getElementById('hud-crystal-title');
    this.hudDesc = document.getElementById('hud-crystal-desc');

    // Modal Elements
    this.specimenModal = document.getElementById('specimen-modal');
    this.examineBtn = document.getElementById('examine-specimen-btn');
    this.closeModalBtn = document.getElementById('close-modal-btn');
    this.modalSpecimenCode = document.getElementById('modal-specimen-code');
    this.modalCrystalName = document.getElementById('modal-crystal-name');
    this.modalChakraVal = document.getElementById('modal-chakra-val');
    this.modalFreqVal = document.getElementById('modal-freq-val');
    this.modalProvVal = document.getElementById('modal-prov-val');
    this.modalDescFull = document.getElementById('modal-desc-full');

    // Audio & Fullscreen Buttons
    this.audioToggleBtn = document.getElementById('audio-toggle-btn');
    this.audioIconMuted = document.getElementById('audio-icon-muted');
    this.audioIconUnmuted = document.getElementById('audio-icon-unmuted');
    this.fullscreenToggleBtn = document.getElementById('fullscreen-toggle-btn');

    this.init();
  }

  init() {
    // 1. Prevent context menus & inspect overlays everywhere
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 2. Setup Preloader Video 1 flow
    this.setupPreloader();

    // 3. Setup Dual-Layer Event Listeners for seamless looping
    this.setupVideoLayers();

    // 4. Setup Interactive Specimen Modal
    this.setupModal();

    // 5. Setup Audio and Fullscreen Controls
    this.setupControls();

    // 6. Specular Aura tracking with mouse move
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--pointer-x', `${x}%`);
      document.documentElement.style.setProperty('--pointer-y', `${y}%`);
    });
  }

  /* ==========================================================================
     PRELOADER FLOW: VIDEO 1 -> "WELCOME TO SUMUK CRYSTALZ" -> LIVE UI
     ========================================================================== */
  setupPreloader() {
    const video = this.preloaderVideo;
    let isRevealed = false;

    // Load first available source for Preloader Video 1
    this.applyCandidateSource(video, VIDEO_CONFIG.intro.sources);

    const triggerWelcomeReveal = () => {
      if (isRevealed) return;
      isRevealed = true;

      // Blur video and show majestic title overlay
      video.classList.add('title-mode');
      if (this.preloaderTitleBox) {
        this.preloaderTitleBox.classList.add('visible');
      }

      // Hold title for 2.2 seconds, then transition seamlessly to Live UI (Video 2)
      setTimeout(() => {
        this.dismissPreloader();
      }, 2200);
    };

    video.addEventListener('ended', triggerWelcomeReveal);
    video.addEventListener('error', () => {
      triggerWelcomeReveal();
    });

    // Fallback safety timer: auto-trigger after 6s
    setTimeout(() => {
      triggerWelcomeReveal();
    }, 6000);

    // Skip button click
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => {
        this.dismissPreloader();
      });
    }
  }

  dismissPreloader() {
    if (this.preloaderCurtain) {
      this.preloaderCurtain.classList.add('fade-out');
    }
    
    // Start main video sequence on Layer A (Video 2: Amethyst)
    this.loadVideo(0, true);

    setTimeout(() => {
      if (this.preloaderCurtain) {
        this.preloaderCurtain.style.display = 'none';
      }
    }, 1400);
  }

  /* ==========================================================================
     DUAL-LAYER SEAMLESS CROSS-FADE ARCHITECTURE
     ========================================================================== */
  setupVideoLayers() {
    const attachListeners = (video, layerName) => {
      // 1.5 seconds before video ends, cross-fade smoothly to next video
      video.addEventListener('timeupdate', () => {
        if (this.activeLayer === layerName && !this.isTransitioning) {
          if (video.duration && !isNaN(video.duration)) {
            const timeLeft = video.duration - video.currentTime;
            if (timeLeft <= 1.5 && timeLeft > 0) {
              this.nextVideo();
            }
          }
        }
      });

      // Video ended fallback
      video.addEventListener('ended', () => {
        if (this.activeLayer === layerName && !this.isTransitioning) {
          this.nextVideo();
        }
      });
    };

    attachListeners(this.videoLayerA, 'A');
    attachListeners(this.videoLayerB, 'B');
  }

  nextVideo() {
    const nextIdx = (this.currentIndex + 1) % VIDEO_CONFIG.playlist.length;
    this.loadVideo(nextIdx, false);
  }

  applyCandidateSource(videoElem, sources) {
    if (!sources || sources.length === 0) return;
    let index = 0;
    videoElem.src = sources[index];
    videoElem.onerror = () => {
      index++;
      if (index < sources.length) {
        videoElem.src = sources[index];
        videoElem.load();
        videoElem.play().catch(() => {});
      }
    };
  }

  loadVideo(index, isInitial = false) {
    if (this.isTransitioning && !isInitial) return;
    this.isTransitioning = true;
    this.currentIndex = index;

    const data = VIDEO_CONFIG.playlist[index];
    const incomingLayer = this.activeLayer === 'A' ? this.videoLayerB : this.videoLayerA;
    const outgoingLayer = this.activeLayer === 'A' ? this.videoLayerA : this.videoLayerB;
    const incomingLayerName = this.activeLayer === 'A' ? 'B' : 'A';

    // Update HUD typography, accent styles and harmonic sound
    this.updateHUD(data);

    if (isInitial) {
      // Direct first load
      this.applyCandidateSource(this.videoLayerA, data.sources);
      this.videoLayerA.load();
      this.videoLayerA.play().catch(() => {});
      this.videoLayerA.classList.add('active');
      this.videoLayerA.classList.remove('inactive');
      this.activeLayer = 'A';
      this.isTransitioning = false;
      return;
    }

    // Load next video onto the inactive layer
    this.applyCandidateSource(incomingLayer, data.sources);
    incomingLayer.load();

    const executeTransition = () => {
      incomingLayer.play().then(() => {
        // Cross-fade: incoming layer active (opacity 1), outgoing layer inactive (opacity 0)
        incomingLayer.classList.add('active');
        incomingLayer.classList.remove('inactive');
        outgoingLayer.classList.add('inactive');
        outgoingLayer.classList.remove('active');

        this.activeLayer = incomingLayerName;

        setTimeout(() => {
          this.isTransitioning = false;
        }, this.crossFadeDurationMs);
      }).catch(() => {
        this.isTransitioning = false;
      });
    };

    if (incomingLayer.readyState >= 3) {
      executeTransition();
    } else {
      incomingLayer.addEventListener('canplay', executeTransition, { once: true });
      // Fallback in case canplay doesn't fire immediately
      setTimeout(() => {
        if (this.isTransitioning && this.activeLayer !== incomingLayerName) {
          executeTransition();
        }
      }, 1200);
    }
  }

  /* ==========================================================================
     HUD & TYPOGRAPHY STATE SYNCHRONIZATION
     ========================================================================== */
  updateHUD(data) {
    // Dynamic CSS root variables
    document.documentElement.style.setProperty('--color-accent', data.colorAccent);
    document.documentElement.style.setProperty('--color-glow', data.colorGlow);

    // Text content
    if (this.hudSpecimenCode) this.hudSpecimenCode.textContent = data.specimenCode;
    if (this.hudProvenance) this.hudProvenance.textContent = data.provenance;
    if (this.hudFrequency) this.hudFrequency.textContent = data.frequency;
    if (this.hudChakraLabel) this.hudChakraLabel.textContent = data.chakra.toUpperCase();
    if (this.hudTitle) this.hudTitle.textContent = data.title;
    if (this.hudDesc) this.hudDesc.textContent = data.description;

    // Modal text updates
    if (this.modalSpecimenCode) this.modalSpecimenCode.textContent = data.specimenCode;
    if (this.modalCrystalName) this.modalCrystalName.textContent = data.title;
    if (this.modalChakraVal) this.modalChakraVal.textContent = data.chakra;
    if (this.modalFreqVal) this.modalFreqVal.textContent = data.frequency;
    if (this.modalProvVal) this.modalProvVal.textContent = data.provenance;
    if (this.modalDescFull) this.modalDescFull.textContent = data.description;

    // Update harmonic tone frequency if audio is playing
    if (this.isAudioActive && this.oscillator) {
      this.oscillator.frequency.setTargetAtTime(data.freqHz || 528, this.audioCtx.currentTime, 0.5);
    }
  }

  /* ==========================================================================
     SPECIMEN METAPHYSICAL MODAL
     ========================================================================== */
  setupModal() {
    if (this.examineBtn && this.specimenModal) {
      this.examineBtn.addEventListener('click', () => {
        this.specimenModal.classList.add('open');
      });
    }

    if (this.closeModalBtn && this.specimenModal) {
      this.closeModalBtn.addEventListener('click', () => {
        this.specimenModal.classList.remove('open');
      });
    }

    if (this.specimenModal) {
      this.specimenModal.addEventListener('click', (e) => {
        if (e.target === this.specimenModal) {
          this.specimenModal.classList.remove('open');
        }
      });
    }
  }

  /* ==========================================================================
     AUDIO & FULLSCREEN CONTROLS
     ========================================================================== */
  setupControls() {
    // 528Hz Harmonic Web Audio Resonance Synthesizer
    if (this.audioToggleBtn) {
      this.audioToggleBtn.addEventListener('click', () => {
        this.toggleAudioResonance();
      });
    }

    // Fullscreen Toggle
    if (this.fullscreenToggleBtn) {
      this.fullscreenToggleBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  toggleAudioResonance() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (!this.isAudioActive) {
      // Start ethereal sine wave tone tuned to current crystal frequency
      const curData = VIDEO_CONFIG.playlist[this.currentIndex];
      const freq = curData ? curData.freqHz : 528;

      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Smooth fade in to avoid clicking
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.06, this.audioCtx.currentTime + 1.5);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.oscillator.start();

      this.isAudioActive = true;
      this.audioToggleBtn.classList.add('active');
      if (this.audioIconMuted) this.audioIconMuted.style.display = 'none';
      if (this.audioIconUnmuted) this.audioIconUnmuted.style.display = 'block';
    } else {
      // Fade out and stop
      if (this.gainNode) {
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.8);
        setTimeout(() => {
          if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
          }
        }, 900);
      }
      this.isAudioActive = false;
      this.audioToggleBtn.classList.remove('active');
      if (this.audioIconMuted) this.audioIconMuted.style.display = 'block';
      if (this.audioIconUnmuted) this.audioIconUnmuted.style.display = 'none';
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.cinematicEngine = new CinematicVideoEngine();
});
