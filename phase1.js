/* =============================================================
   PHASE 1 — AWWWARDS QUICK WINS
   1. Lenis Smooth Scroll (fundacion)
   2. Magnetic Cursor (botones que atraen el puntero)
   3. Enhanced Text Scramble (mejorado con chars tech)
   4. Tech Marquee Banner (doble banda entre secciones)
   5. Cursor Morph (cambia segun contexto)
   ============================================================= */

(function () {
    'use strict';

    /* ============================================================
       1. LENIS SMOOTH SCROLL
       ============================================================ */
    function initLenis() {
        if (typeof Lenis === 'undefined') return;

        const lenis = new Lenis({
            lerp: 0.08,
            wheelMultiplier: 1.0,
            smoothWheel: true,
            touchMultiplier: 2.0,
            infinite: false,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            normalizeWheel: false,
            syncTouch: false,
        });

        function rafLoop(time) {
            lenis.raf(time);
            requestAnimationFrame(rafLoop);
        }
        requestAnimationFrame(rafLoop);

        window.__vantaLenis = lenis;

        // Pausar durante scrolls horizontales
        const horizontalContainers = document.querySelectorAll('.portfolio-scroll-container, .testimonials-section');
        horizontalContainers.forEach(container => {
            container.addEventListener('mouseenter', () => lenis && lenis.stop());
            container.addEventListener('mouseleave', () => lenis && lenis.start());
        });

        console.log('[VANTA] Lenis smooth scroll OK');
    }

    /* ============================================================
       2. MAGNETIC CURSOR
       ============================================================ */
    function initMagneticCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const magneticEls = document.querySelectorAll(
            '.btn, .btn-outline, .magnetic-btn, .wa-orbital-btn, .nav-links a, .logo, .footer-social a'
        );

        const STRENGTH = 0.38;
        const RADIUS   = 80;

        magneticEls.forEach(el => {
            let isHovered = false;

            function onMove(e) {
                const rect    = el.getBoundingClientRect();
                const centerX = rect.left + rect.width  / 2;
                const centerY = rect.top  + rect.height / 2;
                const deltaX  = e.clientX - centerX;
                const deltaY  = e.clientY - centerY;
                const dist    = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (dist < RADIUS) {
                    const pull  = 1 - dist / RADIUS;
                    const moveX = deltaX * STRENGTH * pull;
                    const moveY = deltaY * STRENGTH * pull;
                    el.style.transition = 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)';
                    el.style.transform  = 'translate(' + moveX + 'px, ' + moveY + 'px)';
                    const inner = el.querySelector('span, i');
                    if (inner) {
                        inner.style.transition = 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)';
                        inner.style.transform  = 'translate(' + (moveX * 0.3) + 'px, ' + (moveY * 0.3) + 'px)';
                    }
                    isHovered = true;
                } else if (isHovered) {
                    snapBack(el);
                    isHovered = false;
                }
            }

            document.addEventListener('mousemove', onMove, { passive: true });
            el.addEventListener('mouseleave', () => { snapBack(el); isHovered = false; });
        });

        function snapBack(el) {
            el.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
            el.style.transform  = 'translate(0px, 0px)';
            const inner = el.querySelector('span, i');
            if (inner) {
                inner.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
                inner.style.transform  = 'translate(0px, 0px)';
            }
        }

        console.log('[VANTA] Magnetic cursor OK - ' + magneticEls.length + ' elementos');
    }

    /* ============================================================
       3. ENHANCED TEXT SCRAMBLE
       ============================================================ */
    function initTextScramble() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>[]{}|/\\^~';

        function scramble(el) {
            const original = el.dataset.scrambleOriginal;
            if (!original) return;

            const len = original.length;
            let frame = 0;
            const totalFrames = Math.max(len * 3, 30);

            function tick() {
                el.textContent = original.split('').map((char, idx) => {
                    if (char === ' ' || char === '.' || char === ',' || char === '!') return char;
                    if (idx < Math.floor(frame / 3)) return char;
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join('');

                frame++;
                if (frame <= totalFrames) {
                    el.__scrambleRaf = requestAnimationFrame(tick);
                } else {
                    el.textContent = original;
                }
            }

            if (el.__scrambleRaf) cancelAnimationFrame(el.__scrambleRaf);
            tick();
        }

        const targets = document.querySelectorAll('.section-title, .hero-badge');
        targets.forEach(el => {
            // Recolectar texto de reveal-words o directamente
            const words = el.querySelectorAll('.reveal-word');
            const text = words.length > 0
                ? Array.from(words).map(w => w.textContent).join(' ')
                : el.textContent.trim();
            el.dataset.scrambleOriginal = text;
        });

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                setTimeout(() => scramble(entry.target), 500);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        targets.forEach(el => obs.observe(el));

        // Hover en el logo
        const logoText = document.querySelector('.logo-text');
        if (logoText) {
            logoText.dataset.scrambleOriginal = 'VANTA';
            let busy = false;
            logoText.addEventListener('mouseenter', () => {
                if (busy) return;
                busy = true;
                scramble(logoText);
                setTimeout(() => { busy = false; }, 2000);
            });
        }

        console.log('[VANTA] Text Scramble Enhanced OK');
    }

    /* ============================================================
       4. TECH MARQUEE BANNER — doble banda
       ============================================================ */
    function initTechMarquee() {
        if (document.querySelector('.vanta-tech-marquee')) return;

        const techItems = [
            'PYTHON', 'FASTAPI', 'POSTGRESQL', 'REACT', 'NODE.JS',
            'INTELIGENCIA ARTIFICIAL', 'GOOGLE GEMINI', 'VERCEL',
            'DOCKER', 'TYPESCRIPT', 'ARQUITECTURA CLOUD', 'SEGURIDAD',
            'THREE.JS', 'WEBSOCKETS', 'FLASK', 'REDIS', 'KUBERNETES'
        ];

        const values = [
            'CODIGO LIMPIO', 'ARQUITECTURA SOLIDA', 'ENTREGA PUNTUAL',
            'SOPORTE CONTINUO', 'ESCALABILIDAD', 'SEGURIDAD FIRST',
            'SIN COMPROMISOS', 'SOFTWARE DE ELITE', 'PRODUCCION REAL',
            'ALTO RENDIMIENTO', 'UX PREMIUM', 'RESULTADOS REALES'
        ];

        function buildTrackHTML(items, sep) {
            const tripled = [...items, ...items, ...items];
            return tripled.map(t => '<span class="vtm-item"><span class="vtm-sep">' + sep + '</span>' + t + '</span>').join('');
        }

        function createMarquee(items, sep, small) {
            const div = document.createElement('div');
            div.className = 'vanta-tech-marquee' + (small ? ' vanta-tech-marquee--sm' : '');
            div.setAttribute('aria-hidden', 'true');
            div.innerHTML =
                '<div class="vtm-fade-left"></div>' +
                '<div class="vtm-fade-right"></div>' +
                '<div class="vtm-track vtm-row-1">' + buildTrackHTML(items, sep) + '</div>' +
                '<div class="vtm-track vtm-row-2 vtm-reverse">' + buildTrackHTML(items.slice().reverse(), sep) + '</div>';
            return div;
        }

        // Insertar marquee principal despues del hero
        const hero = document.getElementById('home') || document.querySelector('.hero');
        const portfolio = document.getElementById('portfolio');

        const mainMarquee = createMarquee(techItems, '◈', false);
        if (hero && hero.parentNode) {
            hero.parentNode.insertBefore(mainMarquee, hero.nextElementSibling);
        }

        // Insertar marquee secundario despues de services
        const services = document.getElementById('services');
        if (services && services.parentNode) {
            const secondMarquee = createMarquee(values, '▸', true);
            services.parentNode.insertBefore(secondMarquee, services.nextElementSibling);
        }

        console.log('[VANTA] Tech Marquee OK');
    }

    /* ============================================================
       5. CURSOR MORPH
       ============================================================ */
    function initCursorMorph() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const cursor = document.querySelector('.cursor');
        if (!cursor) return;

        // Label de texto dentro del cursor
        if (!cursor.querySelector('.cursor-label')) {
            const label = document.createElement('span');
            label.className = 'cursor-label';
            cursor.appendChild(label);
        }
        const label = cursor.querySelector('.cursor-label');

        document.querySelectorAll('.card, .testimonial-card-h').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.classList.add('cursor--view'); label.textContent = 'VER'; });
            el.addEventListener('mouseleave', () => { cursor.classList.remove('cursor--view'); label.textContent = ''; });
        });

        document.querySelectorAll('.btn, .btn-outline, .magnetic-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor--click'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--click'));
        });

        console.log('[VANTA] Cursor Morph OK');
    }

    /* ============================================================
       INIT
       ============================================================ */
    function init() {
        initLenis();
        initMagneticCursor();
        // initTextScramble(); disabled to prevent title glitch corruption
        initTechMarquee();
        initCursorMorph();
        console.log('[VANTA] Phase 1 completo OK');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOMContentLoaded ya paso, ejecutar en el siguiente tick
        setTimeout(init, 0);
    }

    /* ============================================================
       VELOCITY-BASED GLOBAL TEXT SKEW (Awwwards Kinetic Typography)
       El texto de titulares se distorsiona suavemente con la velocidad del scroll
       ============================================================ */
    function initScrollVelocitySkew() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Seleccionamos los titulares principales
        const skewTargets = document.querySelectorAll(
            '.hero-title-main, .section-title, .bento-title, .ph-chapter-title, .poker-card-title'
        );
        if (!skewTargets.length) return;

        const skewSetters = Array.from(skewTargets).map(el => ({
            el,
            setter: gsap.quickTo(el, 'skewY', { duration: 0.6, ease: 'power3.out' })
        }));

        const clamp = gsap.utils.clamp(-4, 4); // max 4 grados (sutil y elegante)

        let lastVelocity = 0;
        ScrollTrigger.create({
            onUpdate: (self) => {
                const vel = clamp(self.getVelocity() / 500);
                if (Math.abs(vel - lastVelocity) > 0.1) {
                    lastVelocity = vel;
                    skewSetters.forEach(({ setter }) => setter(vel));
                }
            }
        });

        // Reseteo cuando el scroll se detiene
        let resetTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                skewSetters.forEach(({ setter }) => setter(0));
                lastVelocity = 0;
            }, 150);
        }, { passive: true });

        console.log('[VANTA] Velocity-based skew OK');
    }

    initScrollVelocitySkew();

})();