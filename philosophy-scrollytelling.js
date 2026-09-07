/* ====================================================================
   PHILOSOPHY-SCROLLYTELLING.JS — Acto 2: Los Tres Capítulos del Manifiesto
   Awwwards Pinned Scrollytelling with:
   1. Clean GSAP pin with zero-jitter pinSpacing
   2. Three kinetic chapter transitions (Caos, Hierro, Escala)
   3. Reactive diagnostic HUD & chapter stepper
   4. Automatic Three.js / Canvas2D visualizer morphing
   ==================================================================== */

(function initPhilosophyScrollytelling() {
    'use strict';

    function setup() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(setup, 100);
            return;
        }

        const section = document.getElementById('philosophy');
        if (!section) return;

        gsap.registerPlugin(ScrollTrigger);

        const c1 = section.querySelector('.ph-chapter-1');
        const c2 = section.querySelector('.ph-chapter-2');
        const c3 = section.querySelector('.ph-chapter-3');
        const steps = section.querySelectorAll('.ph-step');
        const hudLed = section.querySelector('.ph-hud-status .hud-led');
        const hudText = section.querySelector('.ph-hud-status .hud-status-text');
        const progressFill = section.querySelector('.philosophy-progress-fill');

        if (!c1 || !c2 || !c3) return;

        // Base states: stacked in place, vertical center with yPercent: -50
        gsap.set(c1, { opacity: 1, yPercent: -50, y: 0, filter: 'blur(0px)' });
        gsap.set(c2, { opacity: 0, yPercent: -50, y: 40, filter: 'blur(10px)' });
        gsap.set(c3, { opacity: 0, yPercent: -50, y: 40, filter: 'blur(10px)' });

        const pinDistance = window.innerHeight * 2.2;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${window.innerHeight * 2.2}`,
                pin: true,
                pinSpacing: true,
                scrub: 0.8,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const p = self.progress;
                    if (progressFill) progressFill.style.width = `${p * 100}%`;

                    let activeStep = 1;
                    if (p < 0.35) {
                        activeStep = 1;
                        if (hudLed) {
                            hudLed.style.background = '#FF3344';
                            hudLed.style.boxShadow = '0 0 10px #FF3344';
                        }
                        if (hudText) hudText.textContent = 'SYS_DIAGNOSTIC: CAOS_DIGITAL';
                    } else if (p < 0.70) {
                        activeStep = 2;
                        if (hudLed) {
                            hudLed.style.background = '#F39C12';
                            hudLed.style.boxShadow = '0 0 10px #F39C12';
                        }
                        if (hudText) hudText.textContent = 'SYS_DIAGNOSTIC: OBSESIÓN_TÉCNICA';
                    } else {
                        activeStep = 3;
                        if (hudLed) {
                            hudLed.style.background = '#11D483';
                            hudLed.style.boxShadow = '0 0 10px #11D483';
                        }
                        if (hudText) hudText.textContent = 'SYS_DIAGNOSTIC: ESCALABILIDAD_PURA';
                    }

                    if (typeof window.switchPhCanvas === 'function') {
                        window.switchPhCanvas(activeStep);
                    }

                    steps.forEach((btn, idx) => {
                        btn.classList.toggle('active', (idx + 1) === activeStep);
                    });
                }
            }
        });

        // Scrub sequence across timeline (0.0 to 1.0)
        // 1. Chapter 01 is active from 0.00 to 0.28
        // 2. Transition 1 -> 2:
        tl.to(c1, { opacity: 0, yPercent: -50, y: -45, filter: 'blur(12px)', duration: 0.12, ease: 'power2.inOut' }, 0.26);
        tl.to(c2, { opacity: 1, yPercent: -50, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.inOut' }, 0.34);

        // 3. Chapter 02 is active from 0.35 to 0.62
        // 4. Transition 2 -> 3:
        tl.to(c2, { opacity: 0, yPercent: -50, y: -45, filter: 'blur(12px)', duration: 0.12, ease: 'power2.inOut' }, 0.60);
        tl.to(c3, { opacity: 1, yPercent: -50, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.inOut' }, 0.68);

        // 5. Chapter 03 remains pinned until 0.94 then cleanly transitions into #portfolio
        tl.to(c3, { opacity: 1, yPercent: -50, y: 0, duration: 0.25 }, 0.70);

        // Interactive Stepper Clicks
        steps.forEach((stepBtn) => {
            stepBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const stepNum = parseInt(stepBtn.getAttribute('data-step'), 10);
                const st = tl.scrollTrigger;
                if (!st) return;

                let targetProgress = 0.05;
                if (stepNum === 2) targetProgress = 0.48;
                if (stepNum === 3) targetProgress = 0.82;

                const targetScroll = st.start + targetProgress * (st.end - st.start);
                if (window.lenis) {
                    window.lenis.scrollTo(targetScroll, { duration: 1.2, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
            });
        });

        console.log('[VANTA] Philosophy Scrollytelling Acto 2 initialized OK');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();
