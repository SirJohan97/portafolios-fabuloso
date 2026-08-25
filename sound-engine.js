/* ================================================================
   VANTA SOUND ENGINE — Spatialized Procedural Web Audio API
   ────────────────────────────────────────────────────────────────
   • 100% Code-Synthesized Audio (0 KB downloads, Zero Latency)
   • Analog Micro-Switch Clicks (15ms Sine + White Noise Burst)
   • Stereo-Panned Harmonic Hover Chirps (35ms with spatial tracking)
   • Neural Sub-Drone (55Hz Dual Detuned Oscillator with Lowpass)
   • Scroll Velocity Doppler Sweep (Linked to Lenis scroll speed)
   • Chrome / Safari Autoplay Compliant (Resumes on first gesture)
   ================================================================ */

(function () {
    "use strict";

    class VantaSoundEngine {
        constructor() {
            this.ctx = null;
            this.isEnabled = false;
            this.masterGain = null;
            this.droneOsc1 = null;
            this.droneOsc2 = null;
            this.droneFilter = null;
            this.droneGain = null;
            this.lastSweepTime = 0;

            // Check localStorage preference
            try {
                const saved = localStorage.getItem('vanta_audio_enabled');
                this.isEnabled = saved === 'true';
            } catch(e) {
                this.isEnabled = false;
            }

            this.initOnFirstGesture = this.initOnFirstGesture.bind(this);
            window.addEventListener('click', this.initOnFirstGesture, { once: true });
            window.addEventListener('keydown', this.initOnFirstGesture, { once: true });
            window.addEventListener('touchstart', this.initOnFirstGesture, { once: true });
        }

        initContext() {
            if (!this.ctx) {
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) {
                        this.ctx = new AudioCtx();
                        this.masterGain = this.ctx.createGain();
                        this.masterGain.gain.setValueAtTime(this.isEnabled ? 1.0 : 0.0, this.ctx.currentTime);
                        this.masterGain.connect(this.ctx.destination);
                    }
                } catch(e) {}
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        initOnFirstGesture() {
            this.initContext();
            this.syncUI();
        }

        toggle(forceState) {
            this.initContext();
            this.isEnabled = typeof forceState === 'boolean' ? forceState : !this.isEnabled;
            try {
                localStorage.setItem('vanta_audio_enabled', this.isEnabled ? 'true' : 'false');
            } catch(e) {}

            if (this.masterGain && this.ctx) {
                const t = this.ctx.currentTime;
                this.masterGain.gain.cancelScheduledValues(t);
                this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
                this.masterGain.gain.linearRampToValueAtTime(this.isEnabled ? 1.0 : 0.0, t + 0.08);
            }

            this.syncUI();

            if (this.isEnabled) {
                this.playSwitch(1.2);
            }
            return this.isEnabled;
        }

        syncUI() {
            const btn = document.getElementById('audio-toggle-btn');
            if (btn) {
                const iconOff = btn.querySelector('.audio-icon-off');
                const iconOn  = btn.querySelector('.audio-icon-on');
                if (this.isEnabled) {
                    if (iconOff) iconOff.style.display = 'none';
                    if (iconOn)  iconOn.style.display = 'inline-block';
                    btn.classList.add('active');
                } else {
                    if (iconOff) iconOff.style.display = 'inline-block';
                    if (iconOn)  iconOn.style.display = 'none';
                    btn.classList.remove('active');
                }
            }
        }

        // ─── 1. Analog Micro-Switch Tactile Click (15ms) ─────────────
        playSwitch(pitch = 1.0) {
            if (!this.isEnabled) return;
            this.initContext();
            if (!this.ctx || !this.masterGain) return;

            try {
                const t = this.ctx.currentTime;

                // Tone impulse
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(750 * pitch, t);
                osc.frequency.exponentialRampToValueAtTime(140 * pitch, t + 0.016);

                gain.gain.setValueAtTime(0.12, t);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start(t);
                osc.stop(t + 0.02);

                // Micro noise burst for crisp mechanical tactile click
                const bufferSize = Math.floor(this.ctx.sampleRate * 0.008);
                const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
                }

                const noise = this.ctx.createBufferSource();
                noise.buffer = noiseBuffer;
                const noiseFilter = this.ctx.createBiquadFilter();
                noiseFilter.type = 'highpass';
                noiseFilter.frequency.setValueAtTime(2400, t);

                const noiseGain = this.ctx.createGain();
                noiseGain.gain.setValueAtTime(0.06, t);
                noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.009);

                noise.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                noiseGain.connect(this.masterGain);

                noise.start(t);
            } catch(e) {}
        }

        // ─── 2. Harmonic Hover Chirp with Stereo Panning (35ms) ──────
        playChirp(panRatio = 0, baseFreq = 540) {
            if (!this.isEnabled) return;
            this.initContext();
            if (!this.ctx || !this.masterGain) return;

            try {
                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(baseFreq, t);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, t + 0.035);

                gain.gain.setValueAtTime(0.035, t);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);

                // Stereo panning if supported
                if (this.ctx.createStereoPanner) {
                    const panner = this.ctx.createStereoPanner();
                    const clampedPan = Math.max(-0.85, Math.min(0.85, panRatio));
                    panner.pan.setValueAtTime(clampedPan, t);
                    osc.connect(gain);
                    gain.connect(panner);
                    panner.connect(this.masterGain);
                } else {
                    osc.connect(gain);
                    gain.connect(this.masterGain);
                }

                osc.start(t);
                osc.stop(t + 0.04);
            } catch(e) {}
        }

        // ─── 3. Cyber Frequency Glitch / Inspect Blip ────────────────
        playGlitch(freq = 880) {
            if (!this.isEnabled) return;
            this.initContext();
            if (!this.ctx || !this.masterGain) return;

            try {
                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.setValueAtTime(freq * 1.5, t + 0.02);
                osc.frequency.setValueAtTime(freq * 2.0, t + 0.04);

                gain.gain.setValueAtTime(0.04, t);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(freq * 1.2, t);
                filter.Q.setValueAtTime(4.0, t);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.masterGain);

                osc.start(t);
                osc.stop(t + 0.065);
            } catch(e) {}
        }

        // ─── 4. Neural Sub-Drone (55Hz Dual Detuned Harmonic) ─────────
        startNeuralDrone(intensity = 0.5) {
            if (!this.isEnabled) return;
            this.initContext();
            if (!this.ctx || this.droneGain) return;

            try {
                const t = this.ctx.currentTime;
                this.droneOsc1 = this.ctx.createOscillator();
                this.droneOsc2 = this.ctx.createOscillator();
                this.droneFilter = this.ctx.createBiquadFilter();
                this.droneGain = this.ctx.createGain();

                this.droneOsc1.type = 'sine';
                this.droneOsc1.frequency.setValueAtTime(55, t); // Note A1

                this.droneOsc2.type = 'triangle';
                this.droneOsc2.frequency.setValueAtTime(110.4, t); // Octave + subtle detune

                this.droneFilter.type = 'lowpass';
                this.droneFilter.frequency.setValueAtTime(140 + intensity * 220, t);

                this.droneGain.gain.setValueAtTime(0.0001, t);
                this.droneGain.gain.linearRampToValueAtTime(0.035, t + 1.2);

                this.droneOsc1.connect(this.droneFilter);
                this.droneOsc2.connect(this.droneFilter);
                this.droneFilter.connect(this.droneGain);
                this.droneGain.connect(this.masterGain);

                this.droneOsc1.start(t);
                this.droneOsc2.start(t);
            } catch(e) {}
        }

        stopNeuralDrone() {
            if (!this.droneGain || !this.ctx) return;
            try {
                const t = this.ctx.currentTime;
                this.droneGain.gain.cancelScheduledValues(t);
                this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, t);
                this.droneGain.gain.linearRampToValueAtTime(0.0001, t + 0.8);
                setTimeout(() => {
                    try {
                        if (this.droneOsc1) { this.droneOsc1.stop(); this.droneOsc1.disconnect(); }
                        if (this.droneOsc2) { this.droneOsc2.stop(); this.droneOsc2.disconnect(); }
                        if (this.droneFilter) { this.droneFilter.disconnect(); }
                        if (this.droneGain) { this.droneGain.disconnect(); }
                    } catch(e) {}
                    this.droneOsc1 = null;
                    this.droneOsc2 = null;
                    this.droneFilter = null;
                    this.droneGain = null;
                }, 850);
            } catch(e) {}
        }

        // ─── 5. Scroll Velocity Doppler Sweep ─────────────────────────
        playScrollSweep(velocity) {
            if (!this.isEnabled || Math.abs(velocity) < 14) return;
            this.initContext();
            if (!this.ctx || !this.masterGain) return;

            const now = performance.now();
            if (now - this.lastSweepTime < 180) return; // Throttle
            this.lastSweepTime = now;

            try {
                const t = this.ctx.currentTime;
                const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }

                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                const freq = Math.min(2200, 320 + Math.abs(velocity) * 50);
                filter.frequency.setValueAtTime(freq, t);
                filter.Q.setValueAtTime(3.5, t);

                const gain = this.ctx.createGain();
                const vol = Math.min(0.035, Math.abs(velocity) * 0.001);
                gain.gain.setValueAtTime(vol, t);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.058);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.masterGain);

                noise.start(t);
            } catch(e) {}
        }
    }

    // Attach global singleton
    window.VANTA_AUDIO = new VantaSoundEngine();

    // Hook audio button when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('audio-toggle-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.VANTA_AUDIO.toggle();
            });
            window.VANTA_AUDIO.syncUI();
        }
    });
})();
