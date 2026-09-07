/* ====================================================================
   HERO-PORTAL.JS — Acto 1: Warp Speed Portal (Awwwards Scrollytelling)
   Pins #home and scrub-drives:
   1. Monumental kinetic typography explosion & 3D text detachment
   2. Three.js camera hyperjump through the quantum particle V
   3. Dual neon portal rings & optical vignette reveal
   ==================================================================== */

(function initHeroWarpPortal() {
    'use strict';

    function setup() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(setup, 100);
            return;
        }

        const hero = document.getElementById('home');
        if (!hero) return;

        // Ensure GSAP plugins are registered
        gsap.registerPlugin(ScrollTrigger);

        const prefix = hero.querySelector('.htm-prefix');
        const highlight = hero.querySelector('.htm-highlight');
        const line2 = hero.querySelector('.htm-line-2');
        const eyebrow = hero.querySelector('.hero-eyebrow-tag');
        const subRow = hero.querySelector('.hero-sub-row');
        const miniBento = hero.querySelector('.hero-mini-bento');
        const btns = hero.querySelector('.hero-btns');
        const hudBottom = hero.querySelector('.hero-hud-bottom');
        const hudDecor = hero.querySelectorAll('.hero-hud-decor');
        const scrollInd = hero.querySelector('.hero-scroll-indicator');

        const portalStage = hero.querySelector('.hero-portal-stage');
        const ringOuter = hero.querySelector('.hero-portal-ring.ring-outer');
        const ringInner = hero.querySelector('.hero-portal-ring.ring-inner');
        const coreGlow = hero.querySelector('.hero-portal-core-glow');
        const vortex = hero.querySelector('.hero-portal-vortex');
        const heroCenter = hero.querySelector('.hero-center-layout');

        // Global progress tracking for Three.js engine coupling
        window.__heroWarpProgress = 0.0;
        window.__heroPinDistance = window.innerHeight * 1.4;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: () => `+=${window.innerHeight * 1.4}`,
                pin: true,
                pinSpacing: true,
                scrub: 0.8,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    window.__heroWarpProgress = self.progress;
                },
                onLeave: () => {
                    window.__heroWarpProgress = 1.0;
                },
                onEnterBack: () => {
                    window.__heroWarpProgress = 1.0;
                },
                onLeaveBack: () => {
                    window.__heroWarpProgress = 0.0;
                }
            }
        });

        // 1. Tactical UI Retreat (0.00 -> 0.22)
        const uiTargets = [eyebrow, subRow, miniBento, btns, hudBottom, scrollInd, ...hudDecor].filter(Boolean);
        if (uiTargets.length) {
            tl.to(uiTargets, {
                y: 35,
                opacity: 0,
                filter: 'blur(8px)',
                stagger: 0.02,
                duration: 0.22,
                ease: 'power2.inOut'
            }, 0);
        }

        // 2. Kinetic Text Detonation (0.04 -> 0.55)
        if (prefix) {
            tl.to(prefix, {
                x: -140,
                y: -70,
                scale: 1.15,
                opacity: 0,
                filter: 'blur(14px)',
                duration: 0.45,
                ease: 'power2.in'
            }, 0.04);
        }

        if (line2) {
            tl.to(line2, {
                x: 140,
                y: 70,
                scale: 1.15,
                opacity: 0,
                filter: 'blur(14px)',
                duration: 0.45,
                ease: 'power2.in'
            }, 0.04);
        }

        if (highlight) {
            // "SOBREVIVEN" detaches as a 3D projectile charging straight into the camera
            tl.to(highlight, {
                scale: 3.6,
                y: -15,
                letterSpacing: '0.14em',
                duration: 0.48,
                ease: 'power2.in'
            }, 0.04);

            tl.to(highlight, {
                opacity: 0,
                filter: 'blur(22px) drop-shadow(0 0 60px #11d483)',
                duration: 0.26,
                ease: 'power2.in'
            }, 0.24);
        }

        // 3. Quantum Portal Rings & Optical Burst (0.18 -> 0.85)
        if (portalStage) {
            tl.to(portalStage, { opacity: 1, duration: 0.1 }, 0.18);
        }

        if (coreGlow) {
            tl.fromTo(coreGlow, 
                { scale: 0.1, opacity: 0 },
                { scale: 3.8, opacity: 0.75, duration: 0.38, ease: 'power2.out' },
                0.20
            );
            tl.to(coreGlow, { opacity: 0, scale: 7.0, duration: 0.24, ease: 'power2.in' }, 0.58);
        }

        if (ringOuter) {
            tl.fromTo(ringOuter,
                { scale: 0.05, opacity: 0 },
                { scale: 4.5, opacity: 1, duration: 0.35, ease: 'power2.out' },
                0.22
            );
            tl.to(ringOuter, { scale: 14.0, opacity: 0, duration: 0.30, ease: 'power2.in' }, 0.57);
        }

        if (ringInner) {
            tl.fromTo(ringInner,
                { scale: 0.05, opacity: 0 },
                { scale: 3.5, opacity: 1, duration: 0.32, ease: 'power2.out' },
                0.24
            );
            tl.to(ringInner, { scale: 10.0, opacity: 0, duration: 0.28, ease: 'power2.in' }, 0.56);
        }

        if (vortex) {
            tl.fromTo(vortex,
                { scale: 0.2, opacity: 0 },
                { scale: 1.5, opacity: 0.95, duration: 0.40, ease: 'power2.out' },
                0.25
            );
            tl.to(vortex, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.78);
        }

        // 4. Hero Content fades cleanly as the dimensional portal transitions (0.65 -> 0.95)
        if (heroCenter) {
            tl.to(heroCenter, { opacity: 0, scale: 0.94, filter: 'blur(10px)', duration: 0.25, ease: 'power2.inOut' }, 0.65);
        }

        // 5. Stage fade out at transition end to hand over to #philosophy (0.85 -> 1.0)
        tl.to(hero, { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0.85);

        console.log('[VANTA] Hero Warp Speed Portal initialized OK');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();
