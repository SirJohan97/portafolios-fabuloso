/* ====================================================================
   HERO-PORTAL.JS — Acto 1: Luxury Minimalist Scrollytelling
   Aristide Benoist / Lusion continuous editorial transition.
   Smoothly lifts headline and translates the 3D Liquid Obsidian
   sculpture into the background pedestal for Act 2 (Flagship Works).
   ==================================================================== */

(function initHeroEditorialScrolly() {
    'use strict';

    function setup() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(setup, 80);
            return;
        }

        const hero = document.getElementById('home');
        if (!hero) return;

        gsap.registerPlugin(ScrollTrigger);

        const container = hero.querySelector('.hero-editorial-container');
        const eyebrow = hero.querySelector('.hero-eyebrow-container');
        const title = hero.querySelector('.hero-title-editorial');
        const titleLines = hero.querySelectorAll('.hte-line');
        const description = hero.querySelector('.hero-description-editorial');
        const actions = hero.querySelector('.hero-actions-editorial');
        const scrollIndicator = hero.querySelector('.hero-scroll-indicator');

        // Global progress tracking for Three.js engine coupling
        window.__heroWarpProgress = 0.0;
        window.__heroPinDistance = window.innerHeight * 0.9;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: () => `+=${window.innerHeight * 0.9}`,
                pin: true,
                pinSpacing: true,
                scrub: 0.6,
                anticipatePin: 1,
                refreshPriority: 10,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    window.__heroWarpProgress = self.progress;
                    if (self.progress > 0.95) {
                        hero.style.pointerEvents = 'none';
                    } else {
                        hero.style.pointerEvents = 'auto';
                    }
                },
                onLeave: () => {
                    window.__heroWarpProgress = 1.0;
                    hero.style.pointerEvents = 'none';
                },
                onEnterBack: () => {
                    window.__heroWarpProgress = 1.0;
                    hero.style.pointerEvents = 'auto';
                },
                onLeaveBack: () => {
                    window.__heroWarpProgress = 0.0;
                    hero.style.pointerEvents = 'auto';
                }
            }
        });

        // 1. Minimal UI Retreat (0.00 -> 0.35)
        if (scrollIndicator) {
            tl.to(scrollIndicator, {
                y: 15,
                opacity: 0,
                duration: 0.15,
                ease: 'power2.in'
            }, 0);
        }

        if (actions) {
            tl.to(actions, {
                y: -25,
                opacity: 0,
                filter: 'blur(6px)',
                duration: 0.25,
                ease: 'power2.in'
            }, 0.05);
        }

        if (description) {
            tl.to(description, {
                y: -30,
                opacity: 0,
                filter: 'blur(8px)',
                duration: 0.28,
                ease: 'power2.in'
            }, 0.08);
        }

        if (eyebrow) {
            tl.to(eyebrow, {
                y: -20,
                opacity: 0,
                duration: 0.20,
                ease: 'power2.in'
            }, 0.10);
        }

        // 2. Authoritative Headline Cinematic Float (0.12 -> 0.65)
        if (titleLines && titleLines.length) {
            tl.to(titleLines, {
                y: -55,
                opacity: 0,
                filter: 'blur(16px)',
                stagger: 0.05,
                duration: 0.45,
                ease: 'power2.inOut'
            }, 0.12);
        } else if (title) {
            tl.to(title, {
                y: -55,
                opacity: 0,
                filter: 'blur(16px)',
                duration: 0.45,
                ease: 'power2.inOut'
            }, 0.12);
        }

        // 3. Stage Container Seamless Docking into Act 2 (0.70 -> 1.0)
        if (container) {
            tl.to(container, {
                opacity: 0,
                scale: 0.96,
                duration: 0.25,
                ease: 'power1.in'
            }, 0.70);
        }

        tl.to(hero, {
            opacity: 0,
            duration: 0.15,
            ease: 'power1.in'
        }, 0.85);

        console.log('[VANTA] Luxury Editorial Hero Scrollytelling initialized OK');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();
