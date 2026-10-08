/* ================================================================
   VANTA STUDIO — AWWWARDS ORGANIC PROJECT TRANSITION ENGINE
   ─────────────────────────────────────────────────────────────────
   • Liquid Radial Origin Veil Expansion (clip-path circle from touch/click coords)
   • Chromatic Atmospheric Bloom matching each project's bespoke palette
   • Tactile Web Audio Organic Micro-Impulse (55Hz sub-bass + 680Hz crystal harmonic)
   • 60fps Native Hardware-Accelerated Performance (Mobile & PC)
   • Instant perceived speed (< 380ms) without fake loaders or blocking screens
   • Seamless Staggered Orchestration into the Full Technical Dossier Modal
   ================================================================ */

(function () {
    "use strict";

    const PROJECT_PALETTES = {
        sviva:       { hex: "#11d483", name: "SVIVA" },
        ventastrack: { hex: "#00f0ff", name: "VENTASTRACK" },
        kioskoazul:  { hex: "#38bdf8", name: "KIOSKO AZUL" },
        iuta:        { hex: "#f59e0b", name: "IUTA ERP" },
        inventario:  { hex: "#a855f7", name: "INVENTARIO" },
        aura:        { hex: "#00f0ff", name: "AURACHECK" },
        svivaweb:    { hex: "#11d483", name: "SVIVA WEB" },
        cuerpo:      { hex: "#ec4899", name: "QUÉ LE PASA A TU CUERPO" },
        behban:      { hex: "#11d483", name: "BEHBAN" },
        wifisense:   { hex: "#00e5ff", name: "GHOSTSENSE" }
    };

    // Micro-Audio Synthesizer (Web Audio API)
    class OrganicAudio {
        constructor() {
            this.ctx = null;
        }

        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === "suspended") {
                this.ctx.resume().catch(() => {});
            }
        }

        playChime(accentColor) {
            try {
                this.init();
                if (!this.ctx) return;

                const now = this.ctx.currentTime;

                // 1. Warm Sub Bass Swell (55Hz -> 75Hz)
                const subOsc = this.ctx.createOscillator();
                const subGain = this.ctx.createGain();
                subOsc.type = "sine";
                subOsc.frequency.setValueAtTime(55, now);
                subOsc.frequency.exponentialRampToValueAtTime(75, now + 0.18);
                subGain.gain.setValueAtTime(0.22, now);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                subOsc.connect(subGain);
                subGain.connect(this.ctx.destination);
                subOsc.start(now);
                subOsc.stop(now + 0.25);

                // 2. Crystal Harmonic Chime (680Hz -> 920Hz)
                const chimeOsc = this.ctx.createOscillator();
                const chimeGain = this.ctx.createGain();
                chimeOsc.type = "sine";
                chimeOsc.frequency.setValueAtTime(680, now);
                chimeOsc.frequency.exponentialRampToValueAtTime(920, now + 0.14);
                chimeGain.gain.setValueAtTime(0.08, now);
                chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                chimeOsc.connect(chimeGain);
                chimeGain.connect(this.ctx.destination);
                chimeOsc.start(now);
                chimeOsc.stop(now + 0.2);
            } catch (e) {
                // Audio gracefully ignored if policy restricts
            }
        }
    }

    const audio = new OrganicAudio();

    const VantaTransition = {
        veil: null,
        flare: null,
        isTransitioning: false,

        _ensureDOM() {
            if (this.veil) return;

            let veilEl = document.getElementById("vanta-organic-veil");
            if (!veilEl) {
                veilEl = document.createElement("div");
                veilEl.id = "vanta-organic-veil";
                veilEl.innerHTML = '<div class="veil-chroma-flare"></div>';
                document.body.appendChild(veilEl);
            }
            this.veil = veilEl;
            this.flare = veilEl.querySelector(".veil-chroma-flare");
        },

        launch(projectId, eventOrCoords, onComplete) {
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            this._ensureDOM();

            // Support signature launch(projectId, onComplete) where 2nd arg is callback
            let callback = onComplete;
            let triggerEvent = eventOrCoords;
            if (typeof eventOrCoords === "function") {
                callback = eventOrCoords;
                triggerEvent = null;
            }

            // Extract click origin coordinates
            let originX = window.innerWidth / 2;
            let originY = window.innerHeight / 2;

            if (triggerEvent) {
                if (triggerEvent.touches && triggerEvent.touches.length > 0) {
                    originX = triggerEvent.touches[0].clientX;
                    originY = triggerEvent.touches[0].clientY;
                } else if (typeof triggerEvent.clientX === "number" && typeof triggerEvent.clientY === "number") {
                    originX = triggerEvent.clientX;
                    originY = triggerEvent.clientY;
                } else if (triggerEvent.target && triggerEvent.target.getBoundingClientRect) {
                    const rect = triggerEvent.target.getBoundingClientRect();
                    originX = rect.left + rect.width / 2;
                    originY = rect.top + rect.height / 2;
                }
            }

            const proj = PROJECT_PALETTES[projectId] || { hex: "#11d483", name: "VANTA" };

            // Update CSS origin and chromatic flare
            this.veil.style.setProperty("--veil-origin-x", `${originX}px`);
            this.veil.style.setProperty("--veil-origin-y", `${originY}px`);
            this.veil.style.setProperty("--veil-accent", proj.hex);

            // Play tactile organic micro-chime
            audio.playChime(proj.hex);

            // 1. Activate & trigger liquid expansion
            this.veil.classList.remove("fade-out");
            this.veil.classList.add("active");

            // Force reflow
            void this.veil.offsetWidth;

            this.veil.classList.add("revealing");

            // 2. Open project modal at apex of veil (180ms)
            setTimeout(() => {
                if (typeof callback === "function") {
                    callback(projectId);
                } else if (typeof window.openProjectModal === "function") {
                    window.openProjectModal(projectId);
                }
            }, 180);

            // 3. Gracefully dissolve veil (360ms)
            setTimeout(() => {
                this.veil.classList.add("fade-out");
            }, 360);

            // 4. Reset veil state
            setTimeout(() => {
                this.veil.classList.remove("active", "revealing", "fade-out");
                this.isTransitioning = false;
            }, 640);
        }
    };

    // Public exports for modern and backward compatibility
    window.VantaTransition = VantaTransition;
    window.WarpRunner = VantaTransition;

    // Close on ESC
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (typeof window.closeProjectModal === "function") {
                window.closeProjectModal();
            }
        }
    });
})();
