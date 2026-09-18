/* ====================================================================
   PRELOADER-V.JS — Awwwards SOTY Monumental FLIP Reveal
   ────────────────────────────────────────────────────────────────────
   • 100% Void Black screen at boot with scroll locked
   • Monumental VANTA monogram emerges in dead center with specular light
   • Confident authority hold beat
   • Smooth GSAP FLIP morph: glides & scales directly into top-left navbar
   • Dennis Snellenberg elastic Bézier membrane curtain opening
   • Staggered cinematic reveal of the Tripartite Navbar & 3D WebGL core
   ==================================================================== */

(function initMonumentalFLIPPreloader() {
    'use strict';

    function runPreloader() {
        if (typeof gsap === 'undefined') {
            setTimeout(runPreloader, 40);
            return;
        }

        const preloader = document.getElementById('preloader');
        const floatingLogo = document.getElementById('preloader-floating-logo');
        const preloaderMeta = document.getElementById('preloader-meta');
        const targetLogo = document.getElementById('navbar-logo-target');
        const curvePath = document.getElementById('preloader-curve-path');
        const navBrandStatus = document.querySelector('.nav-brand-status');
        const navCenterDeck = document.querySelector('.nav-center-deck');
        const navCommandWing = document.querySelector('.nav-command-wing');

        if (!preloader || !floatingLogo || !targetLogo) return;

        // 1. Lock scroll during preloading
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        if (window.history && window.history.scrollRestoration) {
            window.history.scrollRestoration = 'manual';
        }
        if (window.lenis) {
            window.lenis.stop();
        }

        // Hide navbar logo target initially to avoid collision with incoming glide
        targetLogo.style.visibility = 'hidden';

        // Set initial states for navbar companion elements
        if (navBrandStatus) gsap.set(navBrandStatus, { opacity: 0, x: -15, filter: 'blur(8px)' });
        if (navCenterDeck) gsap.set(navCenterDeck, { opacity: 0, y: -25, filter: 'blur(12px)' });
        if (navCommandWing) gsap.set(navCommandWing, { opacity: 0, x: 15, filter: 'blur(8px)' });

        // Set initial state for central floating logo
        gsap.set(floatingLogo, {
            opacity: 0,
            scale: 0.82,
            y: 28,
            transformOrigin: '50% 50%'
        });

        if (preloaderMeta) {
            gsap.set(preloaderMeta, { opacity: 0, y: 15 });
        }

        // Master Preloader Timeline
        const preloaderTl = gsap.timeline();

        // FASE 1: Emergencia Monumental del Logo en Pantalla Negra (0.2s -> 1.3s)
        preloaderTl.to(floatingLogo, {
            opacity: 1,
            scale: 1.0,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: 0.15
        });

        if (preloaderMeta) {
            preloaderTl.to(preloaderMeta, {
                opacity: 0.85,
                y: 0,
                duration: 0.75,
                ease: 'power2.out'
            }, '-=0.55');
        }

        // FASE 2: Pausa de Autoridad de Marca (Beat Cinemático ~0.55s)
        preloaderTl.to({}, { duration: 0.55 });

        // FASE 3: Desvanecimiento sutil del subtítulo previo al glide
        if (preloaderMeta) {
            preloaderTl.to(preloaderMeta, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: 'power2.in'
            });
        }

        // FASE 4: FLIP GLIDE Cinemático del Logo Central hacia la Navbar
        preloaderTl.add(() => {
            // Calcular rectángulos exactos en pantalla
            const sRect = floatingLogo.getBoundingClientRect();
            const tRect = targetLogo.getBoundingClientRect();

            const sCenterX = sRect.left + sRect.width / 2;
            const sCenterY = sRect.top + sRect.height / 2;

            const tCenterX = tRect.left + tRect.width / 2;
            const tCenterY = tRect.top + tRect.height / 2;

            const deltaX = tCenterX - sCenterX;
            const deltaY = tCenterY - sCenterY;

            // Escala precisa de reducción a tamaño navbar
            const scaleRatio = tRect.height / sRect.height;

            // Animar trayectoria del logo
            gsap.to(floatingLogo, {
                x: deltaX,
                y: deltaY,
                scale: scaleRatio,
                duration: 1.15,
                ease: 'power3.inOut',
                onComplete: () => {
                    // Acople perfecto sin parpadeo
                    targetLogo.style.visibility = 'visible';
                    floatingLogo.style.display = 'none';
                    preloader.style.display = 'none';
                    document.body.style.overflow = '';
                    if (window.lenis) window.lenis.start();
                    const blueprintEl = document.querySelector('.blueprint-container');
                    if (blueprintEl) blueprintEl.classList.remove('blueprint-paused');
                    if (window.play3DVEntranceAnimation) window.play3DVEntranceAnimation();
                }
            });

            // Apertura de membrana elástica Bézier de fondo (Snellenberg Curve Morph)
            if (curvePath) {
                const curveObj = { c: 100 };
                gsap.to(curveObj, {
                    c: 0,
                    duration: 1.05,
                    ease: 'power4.inOut',
                    delay: 0.08,
                    onUpdate: () => {
                        curvePath.setAttribute('d', `M 0 0 L 100 0 L 100 ${curveObj.c} Q 50 0 0 ${curveObj.c} Z`);
                    }
                });
            }

            // Retracción de la cortina negra hacia arriba
            gsap.to(preloader, {
                yPercent: -100,
                duration: 1.05,
                ease: 'power4.inOut',
                delay: 0.18
            });

            // Despliegue sincronizado de las alas de la Navbar
            const navElements = [navBrandStatus, navCenterDeck, navCommandWing].filter(Boolean);
            if (navElements.length) {
                gsap.to(navElements, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.85,
                    stagger: 0.08,
                    ease: 'power3.out',
                    delay: 0.45
                });
            }
        });

        console.log('[VANTA] Monumental FLIP Preloader initialized OK');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runPreloader);
    } else {
        runPreloader();
    }
})();
