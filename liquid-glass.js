/* ================================================================
   LIQUID GLASS & SENSORIAL ENGINE (HIGH PERFORMANCE)
   ────────────────────────────────────────────────────────────────
   • Zero Layout Thrashing / Zero DOM Reflows
   • Sound Engine Integration on Hover & Click
   • Automatic Neural Sub-Drone Trigger in AI & Engineering Sections
   • Scroll Velocity Doppler Trigger via Lenis integration
   ================================================================ */

(function () {
    "use strict";

    function initSensorialEngine() {
        // Audio hover feedback for interactive cards without layout thrashing
        const interactiveCards = document.querySelectorAll(
            '.horizontal-track .card, .liquid-glass-card, .poker-modal-content, .service-visual-card .visual-wrapper, .team-card'
        );

        interactiveCards.forEach((el) => {
            el.addEventListener('mouseenter', (e) => {
                if (window.VANTA_AUDIO) {
                    const pan = (e.clientX / (window.innerWidth || 1920)) * 2 - 1; // -1 to 1
                    window.VANTA_AUDIO.playChirp(pan, 580);
                }
            }, { passive: true });

            el.addEventListener('click', () => {
                if (window.VANTA_AUDIO) {
                    window.VANTA_AUDIO.playSwitch(1.1);
                }
            });
        });

        // ─── Neural Drone Section Observers ───────────────────────────
        const aiSections = document.querySelectorAll('#tech-matrix, #philosophy, #services, #bento');
        if ('IntersectionObserver' in window && aiSections.length) {
            const aiObserver = new IntersectionObserver((entries) => {
                let anyActive = false;
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
                        anyActive = true;
                    }
                });

                if (window.VANTA_AUDIO) {
                    if (anyActive) {
                        window.VANTA_AUDIO.startNeuralDrone(0.6);
                    } else {
                        window.VANTA_AUDIO.stopNeuralDrone();
                    }
                }
            }, { threshold: [0.1, 0.35, 0.7] });

            aiSections.forEach(sec => aiObserver.observe(sec));
        }

        // ─── Lenis Scroll Velocity Audio Connection ───────────────────
        if (typeof window.lenis !== 'undefined' && window.lenis) {
            window.lenis.on('scroll', (e) => {
                if (window.VANTA_AUDIO && e.velocity) {
                    window.VANTA_AUDIO.playScrollSweep(e.velocity);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSensorialEngine);
    } else {
        initSensorialEngine();
    }
})();
