/* =============================================================
   EFFECTS.JS — Consolidated Elite Animations (Fases 1, 2, 3)
   - Active Nav Link & 3D Tilt Cards
   - Magnetic Cursor (with GPU will-change & elastic snap)
   - Cursor Morph (States: VER, CLICK, LINK)
   - Tech Marquee (Dual-band continuous loops)
   - Stats Counters & CSS Scroll-Driven Fallbacks
   - Philosophy Canvas (Glitch, Grid, active data pulses)
   - IntersectionObserver Active Pauses (ThreeJS & Philosophy Canvas)
   ============================================================= */

function initEffectsScript() {
    /* ============================================================
       0. HERO KINETIC VARIABLE TYPOGRAPHY ENGINE (AWWWARDS 2026)
       ============================================================ */
    (function initHeroKineticTypography() {
        const titleGroup = document.querySelector('.hero-title-group');
        if (!titleGroup || window.matchMedia('(pointer: coarse)').matches) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isHovered = false;

        const titles = titleGroup.querySelectorAll('.hero-title-main');

        let kineticRafId = null;
        let isKineticActive = false;
        let isHomeVisible = true;

        function startKinetic() {
            if (!isKineticActive && isHomeVisible && !document.hidden) {
                isKineticActive = true;
                kineticLoop();
            }
        }

        titleGroup.addEventListener('mouseenter', () => { isHovered = true; startKinetic(); });
        titleGroup.addEventListener('mousemove', (e) => {
            const rect = titleGroup.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            startKinetic();
        });
        titleGroup.addEventListener('mouseleave', () => {
            isHovered = false;
            mouseX = 0;
            mouseY = 0;
        });

        function kineticLoop() {
            if (!isHomeVisible || document.hidden) {
                isKineticActive = false;
                kineticRafId = null;
                return;
            }

            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;

            if (Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001 || isHovered) {
                titles.forEach((t, i) => {
                    const depth = (i + 1) * 6;
                    const rotY = currentX * 7;
                    const rotX = -currentY * 5;
                    t.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translate3d(${currentX * depth}px, ${currentY * (depth * 0.5)}px, 0)`;
                });
                kineticRafId = requestAnimationFrame(kineticLoop);
            } else {
                titles.forEach(t => {
                    t.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translate3d(0, 0, 0)';
                });
                isKineticActive = false;
                kineticRafId = null;
            }
        }

        const heroEl = document.getElementById('home');
        if (heroEl && 'IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                isHomeVisible = entries[0].isIntersecting;
                if (!isHomeVisible && kineticRafId) {
                    cancelAnimationFrame(kineticRafId);
                    kineticRafId = null;
                    isKineticActive = false;
                }
            }, { threshold: 0.05 }).observe(heroEl);
        }
    })();



    /* ============================================================
       1. ACTIVE NAV LINK & SECTION OBSERVER
       ============================================================ */
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active-section', link.getAttribute('href') === `#${id}`);
            });
        });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(s => sectionObserver.observe(s));


    /* ============================================================
       2. TILT 3D ON CARDS
       ============================================================ */
    const TILT_MAX = 12;

    function applyTilt(cards) {
        cards.forEach(card => {
            card.classList.add('tilt-card');
            let rect = null;

            card.addEventListener('mouseenter', () => {
                rect = card.getBoundingClientRect();
            }, { passive: true });

            card.addEventListener('mousemove', (e) => {
                if (!rect) rect = card.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const dx   = (e.clientX - cx) / (rect.width  / 2);
                const dy   = (e.clientY - cy) / (rect.height / 2);

                const rotY =  dx * TILT_MAX;
                const rotX = -dy * TILT_MAX;

                card.style.setProperty('--rotX', rotX.toFixed(2) + 'deg');
                card.style.setProperty('--rotY', rotY.toFixed(2) + 'deg');
                card.classList.remove('tilt-reset');
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                rect = null;
                card.classList.add('tilt-reset');
                card.style.setProperty('--rotX', '0deg');
                card.style.setProperty('--rotY', '0deg');
            }, { passive: true });
        });
    }

    applyTilt(document.querySelectorAll('.service-card, .pricing-card-inner, .team-card, .testimonial-card'));


    /* ============================================================
       3. REVEAL SYSTEM ON SCROLL (Unified Fallback)
       ============================================================ */
    (function initUnifiedReveal() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function revealElement(el) {
            let revealedAny = false;
            if (el.classList.contains('hidden') && !el.classList.contains('show')) {
                el.classList.add('show');
                revealedAny = true;
            }
            if ((el.classList.contains('card') || el.classList.contains('service-card') || 
                 el.classList.contains('pricing-card') || el.classList.contains('team-card') || 
                 el.classList.contains('method-step') || el.classList.contains('stat-item')) && 
                !el.classList.contains('visible')) {
                el.classList.add('visible');
                revealedAny = true;
            }
            if (el.classList.contains('pricing-clip-wrapper') && !el.classList.contains('revealed')) {
                el.classList.add('revealed');
                el.querySelectorAll('.pricing-card').forEach(card => card.classList.add('visible'));
                revealedAny = true;
            }
            if (el.classList.contains('clip-reveal') && !el.classList.contains('clip-revealed')) {
                el.classList.add('clip-revealed');
                revealedAny = true;
            }
            if (el.classList.contains('reveal-text') && !el.classList.contains('active')) {
                el.classList.add('active');
                revealedAny = true;
            }
            return revealedAny;
        }

        if (reducedMotion) {
            document.querySelectorAll('.hidden, .card, .service-card, .pricing-card, .team-card, .method-step, .stat-item, .pricing-clip-wrapper, .clip-reveal, .reveal-text').forEach(revealElement);
            return;
        }

        const globalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    globalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.01, rootMargin: '120px 50px 120px 50px' });

        document.querySelectorAll('.hidden, .card, .service-card, .pricing-card, .team-card, .method-step, .stat-item, .pricing-clip-wrapper, .clip-reveal, .reveal-text').forEach(el => globalObserver.observe(el));

        // Check viewport immediately on load
        setTimeout(() => {
            const vpH = window.innerHeight;
            const vpW = window.innerWidth;
            document.querySelectorAll('.hidden:not(.show), .card:not(.visible), .clip-reveal:not(.clip-revealed), .reveal-text:not(.active)').forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.top < vpH && r.bottom > 0 && r.left < vpW && r.right > 0) {
                    revealElement(el);
                    globalObserver.unobserve(el);
                }
            });
        }, 300);
    })();


    /* ============================================================
       4. ADAPTIVE MORPHING CURSOR ENGINE (AWWWARDS MULTI-MODE 2026)
       ============================================================ */
    (function initConsolidatedCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const cursor = document.querySelector('.cursor');
        const cursor2 = document.querySelector('.cursor2');
        if (!cursor) return;

        // Crear etiqueta de texto del cursor
        let label = cursor.querySelector('.cursor-label');
        if (!label) {
            label = document.createElement('span');
            label.className = 'cursor-label';
            cursor.appendChild(label);
        }

        function resetCursorModes() {
            cursor.classList.remove('cursor--project', 'cursor--code', 'cursor--orbit', 'cursor--click', 'cursor--link', 'cursor--view');
            label.textContent = '';
        }

        // Modo 1: Project Cards (Explorar ↗)
        document.querySelectorAll('.horizontal-track .card, .testimonial-card-h').forEach(el => {
            el.addEventListener('mouseenter', () => {
                resetCursorModes();
                cursor.classList.add('cursor--project');
                label.textContent = 'EXPLORAR ↗';
                if (window.VANTA_AUDIO) window.VANTA_AUDIO.playChirp(0, 620);
            });
            el.addEventListener('mouseleave', resetCursorModes);
        });

        // Modo 2: Code & Terminals ([INSPECT])
        document.querySelectorAll('.cyber-terminal, #teamTerminalBody, .code-diagram, .hud-label, .console-screen').forEach(el => {
            el.addEventListener('mouseenter', () => {
                resetCursorModes();
                cursor.classList.add('cursor--code');
                label.textContent = '[INSPECT]';
                if (window.VANTA_AUDIO) window.VANTA_AUDIO.playGlitch(840);
            });
            el.addEventListener('mouseleave', resetCursorModes);
        });

        // Modo 3: 3D Orbit Compass (Poker Table & Bento Canvas)
        document.querySelectorAll('.poker-table-container, #poker-felt-stage, #bento-universe-canvas-wrap').forEach(el => {
            el.addEventListener('mouseenter', () => {
                resetCursorModes();
                cursor.classList.add('cursor--orbit');
                label.textContent = '3D_ORBIT';
                if (window.VANTA_AUDIO) window.VANTA_AUDIO.playChirp(0, 720);
            });
            el.addEventListener('mouseleave', resetCursorModes);
        });

        // Modo 4: Buttons & Action Links (Micro-Switch Click)
        document.querySelectorAll('.btn, .btn-outline, .magnetic-btn, .poker-inspect-btn, .nav-links a, .audio-toggle-btn').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                cursor.classList.add('cursor--click');
                if (window.VANTA_AUDIO) {
                    const pan = (e.clientX / window.innerWidth) * 2 - 1;
                    window.VANTA_AUDIO.playChirp(pan, 660);
                }
            });
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--click'));
            el.addEventListener('click', () => {
                if (window.VANTA_AUDIO) window.VANTA_AUDIO.playSwitch(1.0);
            });
        });
    })();


    /* ============================================================
       5. ELECTRIC CANVAS (Team Section)
       ============================================================ */
    const elCanvas = document.getElementById('electric-canvas');

    if (elCanvas) {
        const elCtx = elCanvas.getContext('2d');
        const teamSection = document.querySelector('.team-section');
        const bolts = [];

        function resizeElCanvas() {
            elCanvas.width  = teamSection.offsetWidth;
            elCanvas.height = teamSection.offsetHeight;
        }
        resizeElCanvas();
        window.addEventListener('resize', resizeElCanvas, { passive: true });

        function drawBolt(ctx, x1, y1, x2, y2, roughness, depth) {
            if (depth === 0) {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                return;
            }
            const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
            const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness;
            drawBolt(ctx, x1, y1, mx, my, roughness / 2, depth - 1);
            drawBolt(ctx, mx, my, x2, y2, roughness / 2, depth - 1);
            if (depth === 2 && Math.random() > 0.55) {
                const branchX = mx + (Math.random() - 0.5) * roughness * 1.5;
                const branchY = my + (Math.random() - 0.5) * roughness * 1.5;
                drawBolt(ctx, mx, my, branchX, branchY, roughness / 3, depth - 1);
            }
        }

        function spawnBolt() {
            const w = elCanvas.width;
            const h = elCanvas.height;
            const x1 = Math.random() * w;
            const y1 = Math.random() * h * 0.3;
            const x2 = x1 + (Math.random() - 0.5) * 200;
            const y2 = y1 + Math.random() * 180 + 60;

            bolts.push({
                x1, y1, x2, y2,
                roughness: 30 + Math.random() * 40,
                alpha: 0.8 + Math.random() * 0.2,
                life: 0,
                maxLife: 12 + Math.floor(Math.random() * 10),
                width: 0.5 + Math.random() * 1,
                hue: 155 + Math.floor(Math.random() * 20)
            });
        }

        let elFrame = 0;
        let electricActive = false;
        let electricRafId = null;

        function animateElectric() {
            if (!electricActive) return;
            elFrame++;
            elCtx.clearRect(0, 0, elCanvas.width, elCanvas.height);

            if (elFrame % 22 === 0) spawnBolt();
            if (elFrame % 55 === 0) spawnBolt();

            for (let i = bolts.length - 1; i >= 0; i--) {
                const b = bolts[i];
                b.life++;

                let opacity = b.life < 4 ? b.alpha * (b.life / 4) : (b.life < b.maxLife - 4 ? b.alpha : b.alpha * ((b.maxLife - b.life) / 4));
                if (opacity <= 0) { bolts.splice(i, 1); continue; }

                elCtx.save();
                elCtx.beginPath();
                elCtx.strokeStyle = `hsla(${b.hue}, 100%, 60%, ${opacity})`;
                elCtx.shadowColor = `hsla(${b.hue}, 100%, 60%, ${opacity * 0.8})`;
                elCtx.shadowBlur = 8;
                elCtx.lineWidth = b.width;
                drawBolt(elCtx, b.x1, b.y1, b.x2, b.y2, b.roughness, 4);
                elCtx.stroke();
                elCtx.restore();

                if (b.life >= b.maxLife) bolts.splice(i, 1);
            }

            electricRafId = requestAnimationFrame(animateElectric);
        }

        const teamVisObs = new IntersectionObserver((entries) => {
            const isVisible = entries[0].isIntersecting;
            if (isVisible) {
                if (!electricActive) {
                    electricActive = true;
                    animateElectric();
                }
            } else {
                electricActive = false;
                if (electricRafId) {
                    cancelAnimationFrame(electricRafId);
                    electricRafId = null;
                }
            }
        }, { threshold: 0.1 });
        teamVisObs.observe(teamSection);
    }


    /* ============================================================
       6. TEXT SCRAMBLE ON HEADERS (Enhanced Hacker Style)
       ============================================================ */
    const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>[]{}|/\\^~';

    function scrambleText(el) {
        const original = el.dataset.scrambleOriginal || el.textContent;
        el.dataset.scrambleOriginal = original;
        const len = original.length;
        let frame = 0;
        const totalFrames = Math.max(len * 3, 30);

        function tick() {
            el.textContent = original.split('').map((char, idx) => {
                if (char === ' ' || char === '.' || char === ',' || char === '!') return char;
                if (idx < Math.floor(frame / 3)) return char;
                return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
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

    // Scramble targets observer disabled to preserve pristine typography
    // scrambleTargets.forEach(el => scrambleObs.observe(el));

    // Logo hover scramble
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        logoText.dataset.scrambleOriginal = 'VANTA';
        let busy = false;
        logoText.addEventListener('mouseenter', () => {
            if (busy) return;
            busy = true;
            scrambleText(logoText);
            setTimeout(() => { busy = false; }, 2000);
        });
    }


    /* ============================================================
       7. TECH MARQUEE DUAL-BAND BANNER INITS
       ============================================================ */
    (function initTechMarquees() {
        if (document.querySelector('.vanta-tech-marquee')) return;

        const techItems = ['PYTHON', 'FASTAPI', 'POSTGRESQL', 'REACT', 'NODE.JS', 'INTELIGENCIA ARTIFICIAL', 'GOOGLE GEMINI', 'VERCEL', 'DOCKER', 'TYPESCRIPT', 'ARQUITECTURA CLOUD', 'SEGURIDAD', 'THREE.JS', 'WEBSOCKETS', 'REDIS', 'KUBERNETES'];
        const values = ['CODIGO LIMPIO', 'ARQUITECTURA SOLIDA', 'ENTREGA PUNTUAL', 'SOPORTE CONTINUO', 'ESCALABILIDAD', 'SEGURIDAD FIRST', 'SIN COMPROMISOS', 'SOFTWARE DE ELITE', 'PRODUCCION REAL', 'ALTO RENDIMIENTO', 'UX PREMIUM'];

        function buildTrackHTML(items, sep) {
            const tripled = [...items, ...items, ...items];
            return tripled.map(t => `<span class="vtm-item"><span class="vtm-sep">${sep}</span>${t}</span>`).join('');
        }

        function createMarquee(items, sep, small) {
            const div = document.createElement('div');
            div.className = `vanta-tech-marquee${small ? ' vanta-tech-marquee--sm' : ''}`;
            div.setAttribute('aria-hidden', 'true');
            div.innerHTML = `
                <div class="vtm-fade-left"></div>
                <div class="vtm-fade-right"></div>
                <div class="vtm-track vtm-row-1">${buildTrackHTML(items, sep)}</div>
                <div class="vtm-track vtm-row-2 vtm-reverse">${buildTrackHTML(items.slice().reverse(), sep)}</div>
            `;
            return div;
        }

        const hero = document.getElementById('home') || document.querySelector('.hero');
        const services = document.getElementById('services');

        if (hero && hero.parentNode) {
            hero.parentNode.insertBefore(createMarquee(techItems, '◈', false), hero.nextElementSibling);
        }
        if (services && services.parentNode) {
            services.parentNode.insertBefore(createMarquee(values, '▸', true), services.nextElementSibling);
        }
    })();


    /* ============================================================
       8. STATS NARRATIVE COUNTERS
       ============================================================ */
    (function initStatsCounters() {
        const section = document.querySelector('.vanta-stats-section');
        if (!section) return;

        const headlineWrap = document.querySelector('.stats-headline-wrap');
        const statCards = document.querySelectorAll('.stat-card');
        const statStatement = document.querySelector('.stats-statement');

        function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

        function animateCounter(el) {
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            if (isNaN(target)) return;
            const duration = 2000;
            const startTime = performance.now();

            function tick(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutExpo(progress);
                const value = Math.floor(eased * target);
                el.textContent = value + suffix;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + suffix;
                    el.classList.add('count-complete');
                    setTimeout(() => el.classList.remove('count-complete'), 600);
                }
            }
            requestAnimationFrame(tick);
        }

        const statsObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                if (headlineWrap) headlineWrap.classList.add('is-visible');
                statCards.forEach(card => {
                    const delay = parseInt(card.dataset.delay || 0, 10);
                    setTimeout(() => {
                        card.classList.add('is-visible');
                        const numEl = card.querySelector('.stat-number');
                        if (numEl && !numEl.dataset.animated) {
                            numEl.dataset.animated = 'true';
                            animateCounter(numEl);
                        }
                    }, delay);
                });
                if (statStatement) setTimeout(() => statStatement.classList.add('is-visible'), 800);
                statsObs.unobserve(entry.target);
            });
        }, { threshold: 0.2 });

        statsObs.observe(section);
    })();


        /* ============================================================
       10. NARRATIVE PHILOSOPHY STORIES (Scroll Trigger)
       ============================================================ */
    (function initPhilosophyTimeline() {
        const section = document.querySelector('.vanta-philosophy-section');
        const container = document.querySelector('.philosophy-sticky-container');
        if (!section || !container) return;

        const chapters = gsap.utils.toArray('.ph-chapter');
        const progressFill = document.querySelector('.philosophy-progress-fill');
        const statusText = document.querySelector('.hud-status-text');
        const led = document.querySelector('.hud-led');
        const scrollState = window.__vantaPhilosophyScroll || { progress: 0 };

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                pin: container,
                pinSpacing: false,
                onUpdate: (self) => {
                    if (progressFill) progressFill.style.width = `${self.progress * 100}%`;
                    scrollState.progress = self.progress;

                    // Switch canvas activo — el engine centralizado en script.js maneja el resto
                    let targetCanvas = 1;
                    if (self.progress >= 0.35 && self.progress < 0.70) targetCanvas = 2;
                    else if (self.progress >= 0.70) targetCanvas = 3;

                    if (typeof window.switchPhCanvas === 'function') {
                        window.switchPhCanvas(targetCanvas);
                    }

                    // Alimentar el canvas 3D global de fondo
                    if (window.vanta3D) {
                        window.vanta3D.progress = self.progress;
                        window.vanta3D.glitch = (self.progress < 0.35)
                            ? Math.sin((self.progress / 0.35) * Math.PI) * 0.95
                            : 0;
                    }

                    if (statusText && led) {
                        if (self.progress < 0.35) {
                            statusText.textContent = 'VISUALIZER: CAOS_DIGITAL';
                            statusText.style.color = '#e74c3c';
                            led.style.background = '#e74c3c';
                            led.style.boxShadow = '0 0 8px #e74c3c';
                        } else if (self.progress < 0.70) {
                            statusText.textContent = 'VISUALIZER: ARCHITECTURE_CRYSTAL';
                            statusText.style.color = '#f1c40f';
                            led.style.background = '#f1c40f';
                            led.style.boxShadow = '0 0 8px #f1c40f';
                        } else {
                            statusText.textContent = 'VISUALIZER: NEURAL_NETWORK';
                            statusText.style.color = '#11d483';
                            led.style.background = '#11d483';
                            led.style.boxShadow = '0 0 8px #11d483';
                        }
                    }
                }
            }
        });

        gsap.set(chapters[0], { opacity: 1, y: 0, scale: 1 });
        gsap.set(chapters[1], { opacity: 0, y: 40, scale: 0.95 });
        gsap.set(chapters[2], { opacity: 0, y: 40, scale: 0.95 });

        tl.to(chapters[0], { opacity: 0, y: -40, scale: 0.96, duration: 0.8, ease: 'power2.inOut' }, 0.5);
        tl.to(chapters[1], { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.inOut' }, 1.0);
        tl.to(chapters[1], { opacity: 0, y: -40, scale: 0.96, duration: 0.8, ease: 'power2.inOut' }, 1.8);
        tl.to(chapters[2], { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.inOut' }, 2.3);
    })();


    /* ============================================================
       11. THREE.JS CONTROLLER PARALLAX & ALIGNMENT
       ============================================================ */
    // Diagnostic: Temporarily disabled scrollytelling translations to keep constellation fullscreen on all sections
    (function initThreeChoreography() {
        // Keep background canvas fixed and let script.js animate loop handle scroll scaling/rotation fullscreen
    })();

    /* ============================================================
       12. PROJECT CARD MORPHING TRANSITION (Delegated to WarpRunner Tunnel)
       ============================================================ */
    (function initModalMorphing() {
        // Disabled to prevent double-modal conflict with WarpRunner 3D tunnel transition
    })();

    /* ============================================================
       13. TESTIMONIALS HORIZONTAL PINNED SCROLL (Ultra-Optimized)
       ============================================================ */
    (function initTestimonialsHorizontalScroll() {
        const testimonialsSection = document.querySelector('.testimonials-section');
        const testimonialsTrack   = document.getElementById('testimonialsTrack');
        const testimonialsProgress = document.getElementById('testimonialsProgress');
        const testimonialCards    = document.querySelectorAll('.testimonial-card-h');
        
        if (testimonialsSection && testimonialsTrack && window.innerWidth >= 768) {
            let sectionTop = 0;
            let sectionH = 0;
            function cacheLayout() {
                let top = 0;
                let obj = testimonialsSection;
                while (obj) {
                    top += obj.offsetTop;
                    obj = obj.offsetParent;
                }
                sectionTop = top;
                sectionH = testimonialsSection.offsetHeight;
            }
            cacheLayout();
            window.addEventListener('resize', cacheLayout, { passive: true });

            let lastActiveIndex = -1;
            function updateTestimonialsScroll() {
                const scrollY = window.scrollY || window.pageYOffset || 0;
                const vpH = window.innerHeight;

                // Viewport Culling
                if (scrollY < sectionTop - vpH || scrollY > sectionTop + sectionH) return;

                const scrolled = scrollY - sectionTop; 
                const scrollable = sectionH - vpH; 
                if (scrollable <= 0) return;

                let progress = scrolled / scrollable; 
                progress = Math.max(0, Math.min(1, progress));

                const totalTranslate = (testimonialCards.length - 1) * window.innerWidth;
                const translateX = progress * totalTranslate;

                testimonialsTrack.style.transform = `translate3d(-${translateX.toFixed(1)}px, 0, 0)`;

                if (testimonialsProgress) {
                    testimonialsProgress.style.width = (progress * 100).toFixed(1) + '%';
                }

                const activeIndex = Math.round(progress * (testimonialCards.length - 1));
                if (activeIndex !== lastActiveIndex) {
                    lastActiveIndex = activeIndex;
                    testimonialCards.forEach((card, i) => {
                        if (i === activeIndex) card.classList.add('in-view');
                        else card.classList.remove('in-view');
                    });
                }
            }

            if (window.lenis) {
                window.lenis.on('scroll', updateTestimonialsScroll);
            } else {
                window.addEventListener('scroll', updateTestimonialsScroll, { passive: true });
            }

            updateTestimonialsScroll();
            if (testimonialCards[0]) testimonialCards[0].classList.add('in-view');
        } else if (testimonialCards.length > 0) {
            testimonialCards.forEach(c => c.classList.add('in-view'));
        }
    })();


    /* ============================================================
       14. CONTACT SECTION CIRCLE-REVEAL & REVEAL CLASS
       ============================================================ */
    (function initContactReveal() {
        const contactSection = document.getElementById('contact');
        const contactReveal  = document.querySelector('.contact-reveal-container');
        if (contactSection && contactReveal) {
            contactReveal.style.clipPath = 'circle(0% at 50% 50%)';

            const contactObs = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    contactReveal.style.clipPath = 'circle(150% at 50% 50%)';
                    contactReveal.classList.add('revealed');

                    // contactHeadline scramble removed to maintain clean typography

                    obs.unobserve(entry.target);
                });
            }, { threshold: 0.05 });

            contactObs.observe(contactSection);

            // Red de seguridad: si no se activa en 2 segundos, forzar revelado
            setTimeout(() => {
                if (!contactReveal.classList.contains('revealed')) {
                    contactReveal.style.clipPath = 'circle(150% at 50% 50%)';
                    contactReveal.classList.add('revealed');
                }
            }, 2000);
        }
    })();

    /* ============================================================
       15. TEAM INTERACTIVE DIAGNOSTIC TERMINAL (VA-OS)
       ============================================================ */
    (function initTeamTerminal() {
        const teamCards = document.querySelectorAll('.team-card');
        const terminalBody = document.getElementById('vantaTermScreen') || document.getElementById('teamTerminalBody');
        let terminalInterval = null;

        const teamData = {
            andres: [
                "> INICIALIZANDO PERFIL: ANDRÉS MORALES",
                "> ROL: SYSTEMS ARCHITECT & BACKEND LEADER",
                "> HABILIDADES DETECTADAS:",
                "  - Python / FastAPI / Flask: 98%",
                "  - PostgreSQL / ACID Transactions: 95%",
                "  - Docker / AWS Deployments: 90%",
                "> ESTADO DEL AGENTE:",
                "  - Consumo de café: Crítico (Reabastecer)",
                "  - Horas de insomnio: 14h",
                "  - Tolerancia a bugs: 0.02%",
                "> DIAGNÓSTICO: Listo para desplegar microservicios redundantes a las 3:00 AM."
            ],
            johan: [
                "> INICIALIZANDO PERFIL: JOHAN FERNÁNDEZ",
                "> ROL: UI/UX DESIGNER & FRONTEND ARCHITECT",
                "> HABILIDADES DETECTADAS:",
                "  - UI/UX & Figma Systematization: 99%",
                "  - CSS Inmersivo (Awwwards Grade): 96%",
                "  - Branding & Visual Storytelling: 94%",
                "> ESTADO DEL AGENTE:",
                "  - Obsesión por alineación: Máxima (0.5px de margen)",
                "  - Color favorito: #11D483",
                "  - Figma open tabs: 47",
                "> DIAGNÓSTICO: Refinando micro-interacciones de scroll para provocar el efecto 'Wow'."
            ],
            pana: [
                "> INICIALIZANDO PERFIL: PANA FRESCO",
                "> ROL: DIRECTOR DE SERENIDAD Y SOPORTE EMOCIONAL",
                "> HABILIDADES DETECTADAS:",
                "  - Purr Controlling & Zen Flow: 100%",
                "  - Sleeping on Keyboard: 97%",
                "  - Bug Distraction: 92%",
                "> ESTADO DEL AGENTE:",
                "  - Nivel de estrés: 0%",
                "  - Posición favorita: Encima del cargador de laptop caliente",
                "  - Comida favorita: Atún premium",
                "> DIAGNÓSTICO: Monitoreando vibraciones del sistema. Estatus: Todo bajo control."
            ],
            isaac: [
                "> INICIALIZANDO PERFIL: ISAAC ORTIZ",
                "> ROL: SECRETARIO GENERAL DE LA CAFETERÍA (COFFEE SUPPLY)",
                "> HABILIDADES DETECTADAS:",
                "  - Coffee Brewing (V60 / Espresso): 100%",
                "  - Scrum Coffee Standups: 95%",
                "  - Diplomacia Organizacional: 90%",
                "> ESTADO DEL AGENTE:",
                "  - Método de desarrollo: 'Tómese un tinto y piénselo bien'",
                "  - Puntualidad*: Relativa al primer sorbo",
                "  - Granos tostados: 12,450g en stock",
                "> DIAGNÓSTICO: Suministro de cafeína estable. El motor creativo sigue en marcha."
            ]
        };

        function startTerminalDiagnostic(key) {
            if (terminalInterval) clearInterval(terminalInterval);
            if (!terminalBody) return;

            const lines = teamData[key];
            if (!lines) return;

            terminalBody.innerHTML = '';
            let lineIdx = 0;
            let charIdx = 0;
            let currentLineText = '';
            
            const terminalContainer = document.querySelector('.team-terminal-container');
            if (terminalContainer) {
                terminalContainer.classList.add('diagnostic-running');
            }

            let currentLineEl = document.createElement('div');
            currentLineEl.className = 'terminal-line';
            terminalBody.appendChild(currentLineEl);

            terminalInterval = setInterval(() => {
                if (lineIdx >= lines.length) {
                    clearInterval(terminalInterval);
                    terminalInterval = null;
                    if (terminalContainer) {
                        terminalContainer.classList.remove('diagnostic-running');
                    }
                    return;
                }

                const targetLineText = lines[lineIdx];
                if (charIdx < targetLineText.length) {
                    const char = targetLineText[charIdx];
                    currentLineText += char;
                    
                    let coloredText = currentLineText;
                    if (currentLineText.startsWith('>')) {
                        coloredText = `<span class="term-prompt">&gt;</span> ${currentLineText.slice(1)}`;
                    } else if (currentLineText.includes(':')) {
                        const splitIdx = currentLineText.indexOf(':');
                        const label = currentLineText.slice(0, splitIdx);
                        const val = currentLineText.slice(splitIdx);
                        coloredText = `<span class="term-highlight">${label}</span>${val}`;
                    }
                    
                    currentLineEl.innerHTML = coloredText;
                    charIdx++;
                    
                    // Auto-scroll a la última línea en terminal
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                } else {
                    lineIdx++;
                    charIdx = 0;
                    currentLineText = '';
                    if (lineIdx < lines.length) {
                        currentLineEl = document.createElement('div');
                        currentLineEl.className = 'terminal-line';
                        terminalBody.appendChild(currentLineEl);
                    }
                }
            }, 10);
        }

        teamCards.forEach(card => {
            const projectKey = card.getAttribute('data-project');
            if (!projectKey || !teamData[projectKey]) return;

            card.addEventListener('mouseenter', () => {
                startTerminalDiagnostic(projectKey);
                
                const cursor = document.querySelector('.cursor');
                if (cursor) {
                    cursor.classList.add('diag-hover');
                    const cursor2 = document.querySelector('.cursor2');
                    if (cursor2) cursor2.style.opacity = '0';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const cursor = document.querySelector('.cursor');
                if (cursor) {
                    cursor.classList.remove('diag-hover');
                    const cursor2 = document.querySelector('.cursor2');
                    if (cursor2) cursor2.style.opacity = '1';
                }
            });
        });
    })();


    /* ============================================================
       16. HUD INTERACTIVE BACKGROUND GRID
       ============================================================ */
    (function initHUDGridInteractive() {
        const bg = document.createElement('div');
        bg.id = 'hud-grid-background';
        
        const cellCount = 24;
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'hud-grid-cell';
            bg.appendChild(cell);
        }
        document.body.prepend(bg);

        const cells = bg.querySelectorAll('.hud-grid-cell');
        
        let lastScroll = 0;
        let isAnimating = false;

        window.addEventListener('scroll', () => {
            const curr = window.scrollY;
            const diff = Math.abs(curr - lastScroll);
            if (diff > 15 && !isAnimating) {
                isAnimating = true;
                lastScroll = curr;

                for (let k = 0; k < 2; k++) {
                    const rnd = Math.floor(Math.random() * cellCount);
                    const cell = cells[rnd];
                    if (cell) {
                        cell.classList.add('active-pulse');
                        setTimeout(() => {
                            cell.classList.remove('active-pulse');
                        }, 900);
                    }
                }

                setTimeout(() => {
                    isAnimating = false;
                }, 150);
            }
        }, { passive: true });
    })();

    /* ============================================================
       14. BUS DE DATOS SVG (Scroll-Drawing Fiber Path — Pre-Sampled O(1))
       ============================================================ */
    (function initVantaFiberPath() {
        const path = document.getElementById('vanta-fiber-path');
        const pointer = document.getElementById('vanta-hud-pointer');
        const svg = document.getElementById('vanta-fiber-svg');
        if (!path || !pointer || !svg || typeof ScrollTrigger === 'undefined') return;

        const pathLength = path.getTotalLength();
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        // Pre-muestrear 100 puntos en el inicio para evitar path.getPointAtLength() en scroll
        const SAMPLE_COUNT = 100;
        const precomputedPoints = [];
        for (let i = 0; i <= SAMPLE_COUNT; i++) {
            const pt = path.getPointAtLength((i / SAMPLE_COUNT) * pathLength);
            precomputedPoints.push({ x: pt.x, y: pt.y });
        }

        let svgRect = svg.getBoundingClientRect();
        window.addEventListener('resize', () => {
            svgRect = svg.getBoundingClientRect();
        }, { passive: true });

        ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.set(path, { strokeDashoffset: pathLength * (1 - progress) });

                const index = Math.min(SAMPLE_COUNT, Math.max(0, Math.round(progress * SAMPLE_COUNT)));
                const point = precomputedPoints[index];
                if (!point) return;

                const globalX = svgRect.left + (point.x / 100) * svgRect.width;
                const globalY = (window.scrollY || window.pageYOffset || 0) + svgRect.top + (point.y / 1000) * svgRect.height;

                gsap.set(pointer, {
                    x: globalX,
                    y: globalY,
                    opacity: progress > 0.005 && progress < 0.995 ? 1 : 0
                });
            }
        });
    })();


    /* ============================================================
       14. CONTACT SECTION CIRCLE-REVEAL & REVEAL CLASS
       ============================================================ */
    (function initContactReveal() {
        const contactSection = document.getElementById('contact');
        const contactReveal  = document.querySelector('.contact-reveal-container');
        if (contactSection && contactReveal) {
            contactReveal.style.clipPath = 'circle(0% at 50% 50%)';

            const contactObs = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    contactReveal.style.clipPath = 'circle(150% at 50% 50%)';
                    contactReveal.classList.add('revealed');

                    // contactHeadline scramble removed to maintain clean typography

                    obs.unobserve(entry.target);
                });
            }, { threshold: 0.05 });

            contactObs.observe(contactSection);

            // Red de seguridad: si no se activa en 2 segundos, forzar revelado
            setTimeout(() => {
                if (!contactReveal.classList.contains('revealed')) {
                    contactReveal.style.clipPath = 'circle(150% at 50% 50%)';
                    contactReveal.classList.add('revealed');
                }
            }, 2000);
        }
    })();

    /* ============================================================
       15. PARTICLE SCROLL WARP SPEED CONTROL
       ============================================================ */
    (function initParticleScrollWarp() {
        let lastScrollY = window.scrollY;
        let currentWarp = 0;
        let isLoopRunning = false;
        let warpRafId = null;

        function updateWarpLoop() {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY;
            lastScrollY = currentY;

            // Target warp speed basado en delta
            const targetWarp = delta * 0.04;

            // Lerp inercial continuo
            currentWarp += (targetWarp - currentWarp) * 0.08;

            if (Math.abs(currentWarp) < 0.01) {
                window.bgParticleScrollWarp = 0;
                isLoopRunning = false;
                warpRafId = null;
            } else {
                window.bgParticleScrollWarp = currentWarp;
                warpRafId = requestAnimationFrame(updateWarpLoop);
            }
        }

        function wakeUp() {
            if (!isLoopRunning) {
                isLoopRunning = true;
                updateWarpLoop();
            }
        }

        // Listen to scroll to wake it up
        window.addEventListener('scroll', wakeUp, { passive: true });

        // Integración directa con Lenis si está activo
        setTimeout(() => {
            if (window.lenis) {
                window.lenis.on('scroll', (e) => {
                    const target = e.velocity * 0.04;
                    currentWarp += (target - currentWarp) * 0.12;
                    window.bgParticleScrollWarp = currentWarp;
                    wakeUp();
                });
            }
        }, 500);

        wakeUp();
    })();


    /* ============================================================
       16. FILM GRAIN CANVAS — Versión ultraligera (tiny canvas + CSS scale)
       ============================================================ */
    (function initFilmGrain() {
        const canvas = document.getElementById('film-grain-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const GRAIN_RES = 256;
        canvas.width  = GRAIN_RES;
        canvas.height = GRAIN_RES;
        canvas.style.imageRendering = 'pixelated';

        const imageData = ctx.createImageData(GRAIN_RES, GRAIN_RES);
        const data = imageData.data;

        // Generate static noise once
        for (let i = 0; i < data.length; i += 4) {
            const v = (Math.random() * 50 + 100) | 0;
            data[i] = data[i+1] = data[i+2] = v;
            data[i+3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);

        // Activamos la animación por CSS añadiendo la clase
        canvas.parentElement.classList.add('grain-active');
    })();

    /* ============================================================
       17. KINETIC SPLIT TEXT — Hero y headings
       ============================================================ */
    (function initSplitText() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        // Wrap each word in a span.split-word inside .split-line-wrap
        function splitAndAnimate(el, delay = 0) {
            if (!el) return;

            // If this element has child spans (brand-green etc.), handle carefully
            const rawHtml = el.innerHTML;
            // Extract words while preserving inner HTML tags
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawHtml;

            // Walk text nodes and wrap words
            let wordIndex = 0;
            function wrapWords(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const words = node.textContent.split(/(\s+)/);
                    const frag = document.createDocumentFragment();
                    words.forEach(w => {
                        if (/^\s+$/.test(w) || w === '') {
                            frag.appendChild(document.createTextNode(w));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'split-word';
                            span.textContent = w;
                            span.style.transitionDelay = (delay + wordIndex * 55) + 'ms';
                            span.style.transitionDuration = '0.75s';
                            span.style.transitionProperty = 'transform, opacity';
                            span.style.transitionTimingFunction = 'cubic-bezier(0.22,1,0.36,1)';
                            frag.appendChild(span);
                            wordIndex++;
                        }
                    });
                    node.parentNode.replaceChild(frag, node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    Array.from(node.childNodes).forEach(wrapWords);
                }
            }
            Array.from(tempDiv.childNodes).forEach(wrapWords);
            el.innerHTML = '';
            while (tempDiv.firstChild) el.appendChild(tempDiv.firstChild);
        }

        // Apply to hero titles (animate immediately on page load, triggered by curtain)
        document.querySelectorAll('.split-target').forEach((el, i) => {
            splitAndAnimate(el, i * 80);
        });

        // Trigger the hero split-words when hero becomes visible using premium GSAP staggered sliding + rotation
        function revealSplitWords(container) {
            const words = container.querySelectorAll('.split-word');
            if (words.length && typeof gsap !== 'undefined') {
                gsap.fromTo(words,
                    { y: '115%', rotate: 5, opacity: 0 },
                    { y: '0%', rotate: 0, opacity: 1, duration: 1.4, stagger: 0.035, ease: 'power4.out' }
                );
            } else {
                words.forEach(w => {
                    w.style.transform = 'translateY(0)';
                    w.style.opacity = '1';
                });
            }
        }

        // Hero: trigger after curtain opens (listen for class or just delay)
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) revealSplitWords(heroContent);
        }, 1200);

        // Section headings: kept clean and intact without breaking nested spans
        // splitAndAnimate disabled for section-title to preserve pristine typography layout
    })();

    /* ============================================================
       18. TEXT SCRAMBLE — Glitch reveal en section headings
       ============================================================ */
    (function initTextScramble() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

        function scramble(el) {
            const original = el.dataset.originalText || el.textContent.trim();
            el.dataset.originalText = original;
            let frame = 0;
            const totalFrames = original.length * 2.2;

            const iv = setInterval(() => {
                let output = '';
                for (let i = 0; i < original.length; i++) {
                    if (original[i] === ' ') { output += ' '; continue; }
                    if (frame / totalFrames > i / original.length) {
                        output += original[i];
                    } else {
                        output += CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                }
                el.textContent = output;
                frame++;
                if (frame >= totalFrames) {
                    clearInterval(iv);
                    el.textContent = original;
                }
            }, 30);
        }

        // Apply to section eyebrows and small labels
        const scrambleTargets = document.querySelectorAll(
            '.bento-eyebrow, .stats-eyebrow, .service-num-tag, .ph-chapter-num, .bento-card-tag'
        );

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => scramble(entry.target), 200);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });

        scrambleTargets.forEach(el => obs.observe(el));
    })();

    /* ============================================================
       19. SCROLL COLOR THEMING — El acento cambia por sección
           + actualización total de todos los renderers
       ============================================================ */
    (function initColorTheming() {
        const themes = [
            { id: 'home',        primary: '#11d483', r:17,  g:212, b:131 },
            { id: 'philosophy',  primary: '#00e5ff', r:0,   g:229, b:255 },
            { id: 'portfolio',   primary: '#11d483', r:17,  g:212, b:131 },
            { id: 'stats',       primary: '#b9ff4b', r:185, g:255, b:75  },
            { id: 'services',    primary: '#11d483', r:17,  g:212, b:131 },
            { id: 'bento',       primary: '#00cfff', r:0,   g:207, b:255 },
            { id: 'team',        primary: '#a78bfa', r:167, g:139, b:250 },
            { id: 'pricing',     primary: '#11d483', r:17,  g:212, b:131 },
            { id: 'contact',     primary: '#fbbf24', r:251, g:191, b:36  },
        ];

        const root = document.documentElement;
        let currentId = 'home';

        // ---- Global theme updater: drives ALL renderers ----
        window.setVantaTheme = function(theme) {
            if (theme.id === currentId) return;
            currentId = theme.id;

            const hex = theme.primary;
            window.currentPrimaryColor = hex;
            const { r, g, b } = theme;

            // 1. CSS variables — drive all CSS-based elements
            root.style.setProperty('--primary-rgb',   `${r}, ${g}, ${b}`);
            root.style.setProperty('--primary',       hex);
            root.style.setProperty('--theme-primary', hex);
            root.style.setProperty('--theme-glow',    `rgba(${r},${g},${b},0.18)`);

            // 2. Constellation canvas colors (script.js exposes window.constellationColors)
            if (window.constellationColors) {
                window.constellationColors.node      = `rgba(${r},${g},${b},0.9)`;
                window.constellationColors.line      = `rgba(${r},${g},${b},0.25)`;
                window.constellationColors.mouseLine = `rgba(${r},${g},${b},0.6)`;
            }

            // 3. Particle confetti colors (particles.js exposes window.particleConfig)
            if (window.particleConfig) {
                // Generate harmonious palette from the theme color
                const alpha = (a) => `rgba(${r},${g},${b},${a})`;
                window.particleConfig.COLORS = [
                    hex,
                    alpha(0.8),
                    alpha(0.6),
                    alpha(0.5),
                    '#ffffff',
                    alpha(0.9),
                ];
            }

            // 4. SVG Data Bus fiber color
            const fiberPath = document.getElementById('vanta-fiber-path');
            if (fiberPath) fiberPath.style.stroke = hex;

            // 5. Three.js background and modal materials
            if (window.bg3DNodeMaterial) {
                window.bg3DNodeMaterial.color.setStyle(hex);
            }
            if (window.bg3DLineMaterial) {
                window.bg3DLineMaterial.color.setStyle(hex);
            }
            if (window.modal3DMaterial) {
                window.modal3DMaterial.color.setStyle(hex);
            }

            // 6. HUD sidebar dots + nav active link
            document.querySelectorAll('.hud-dots li.active, .nav-links a.active-section').forEach(el => {
                el.style.setProperty('--dot-active-color', hex);
            });
        };

        const sectionObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const t = themes.find(th => th.id === entry.target.id);
                    if (t) window.setVantaTheme(t);
                }
            });
        }, { threshold: 0.35 });

        themes.forEach(t => {
            const el = document.getElementById(t.id);
            if (el) sectionObs.observe(el);
        });

        // Init with default
        window.setVantaTheme(themes[0]);
    })();

    /* ============================================================
       20. HERO CURTAIN REVEAL — Iris opening after preloader
       ============================================================ */
    (function initHeroCurtain() {
        const curtainA = document.querySelector('.hero-curtain.curtain-a');
        const curtainB = document.querySelector('.hero-curtain.curtain-b');
        if (!curtainA || !curtainB) return;

        function openCurtains() {
            // Wait a tick for preloader to have finished
            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            curtainA.classList.add('opened');
                            curtainB.classList.add('opened');
                        }
                    });
                    
                    // Curtains open with dramatic Expo curve
                    tl.to(curtainA, {
                        clipPath: 'inset(0 0 100% 0)',
                        duration: 1.4,
                        ease: 'expo.inOut'
                    }, 0);
                    tl.to(curtainB, {
                        clipPath: 'inset(100% 0 0 0)',
                        duration: 1.4,
                        ease: 'expo.inOut'
                    }, 0);

                    // Trigger 3D V Entrance Animation in sync with curtain opening
                    if (window.play3DVEntranceAnimation) {
                        window.play3DVEntranceAnimation();
                    }

                    // Hero content reveal choreography
                    const heroContent = document.querySelector('.hero-content');
                    const btns = document.querySelectorAll('.hero-btns .btn, .hero-btns .btn-outline');
                    const hudBottom = document.querySelector('.hero-hud-bottom');
                    const subtitleWidget = document.querySelector('.hero-typing-subtitle-wrap');
                    
                    if (heroContent) {
                        heroContent.classList.remove('hidden');
                        heroContent.classList.add('show');
                        gsap.set(heroContent, { opacity: 1, scale: 1 });
                    }
                    
                    // Stagger subtitle and buttons together
                    const revealTargets = [];
                    if (subtitleWidget) revealTargets.push(subtitleWidget);
                    if (btns.length) revealTargets.push(...btns);
                    
                    if (revealTargets.length) {
                        tl.fromTo(revealTargets,
                            { y: 30, opacity: 0 },
                            { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power3.out' },
                            0.4
                        );
                    }
                    
                    // Fade in HUD bottom details
                    if (hudBottom) {
                        tl.fromTo(hudBottom,
                            { opacity: 0, y: 15 },
                            { opacity: 0.5, y: 0, duration: 0.8, ease: 'power2.out' },
                            0.65
                        );
                    }
                } else {
                    // Fallback: just remove curtains
                    curtainA.style.opacity = '0';
                    curtainB.style.opacity = '0';
                    setTimeout(() => {
                        curtainA.classList.add('opened');
                        curtainB.classList.add('opened');
                    }, 600);
                }
            }, 200);
        }

        // Trigger after preloader exits (listen to preloader transition)
        const preloader = document.getElementById('preloader');
        if (preloader) {
            const preloaderObs = new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    if (m.type === 'attributes' && preloader.style.display === 'none') {
                        openCurtains();
                        preloaderObs.disconnect();
                    }
                });
            });
            preloaderObs.observe(preloader, { attributes: true, attributeFilter: ['style'] });
            // Safety: open after 4 seconds regardless
            setTimeout(openCurtains, 4000);
        } else {
            openCurtains();
        }
    })();

    /* ============================================================
       21. BENTO GRID — IntersectionObserver Stagger Reveal
       ============================================================ */
    (function initBentoReveal() {
        const cards = document.querySelectorAll('.bento-reveal');
        if (!cards.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || 0);
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        cards.forEach(card => obs.observe(card));
    })();

    /* ============================================================
       22. PROJECT COUNTER FLIP — Número editorial en scroll horizontal
       ============================================================ */
    (function initProjectCounter() {
        const portfolioSection = document.querySelector('.portfolio-scroll-container');
        const cards = document.querySelectorAll('.horizontal-track .card');
        if (!portfolioSection || !cards.length) return;

        // Create the counter element
        const counter = document.createElement('div');
        counter.className = 'portfolio-counter-flip';
        counter.innerHTML = `<div class="flip-num"><span class="current-n">01</span> / 0${cards.length}</div>`;
        document.body.appendChild(counter);

        const currentN = counter.querySelector('.current-n');

        let portTop = 0;
        let portH = 0;
        function cachePort() {
            let top = 0;
            let obj = portfolioSection;
            while (obj) {
                top += obj.offsetTop;
                obj = obj.offsetParent;
            }
            portTop = top;
            portH = portfolioSection.offsetHeight;
        }
        cachePort();
        window.addEventListener('resize', cachePort, { passive: true });

        function getActiveCard() {
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const maxScroll = portH - window.innerHeight;
            if (maxScroll <= 0) return 0;
            const progress = Math.max(0, Math.min(1, (scrollY - portTop) / maxScroll));
            const index = Math.round(progress * (cards.length - 1));
            return Math.max(0, Math.min(cards.length - 1, index));
        }

        let lastIndex = -1;
        function updateCounterOnScroll() {
            if (!counter.classList.contains('visible')) return;
            const idx = getActiveCard();
            if (idx !== lastIndex) {
                lastIndex = idx;
                const numStr = String(idx + 1).padStart(2, '0');

                // Flip animation
                currentN.style.transform = 'translateY(-100%)';
                currentN.style.opacity = '0';
                setTimeout(() => {
                    currentN.textContent = numStr;
                    currentN.style.transition = 'none';
                    currentN.style.transform = 'translateY(100%)';
                    currentN.style.opacity = '0';
                    requestAnimationFrame(() => {
                        currentN.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s';
                        currentN.style.transform = 'translateY(0)';
                        currentN.style.opacity = '1';
                    });
                }, 150);
            }
        }

        // Show/hide counter based on portfolio section visibility
        const sectionObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isVisible = entry.isIntersecting;
                counter.classList.toggle('visible', isVisible);
                if (isVisible) {
                    updateCounterOnScroll();
                }
            });
        }, { threshold: 0.1 });
        sectionObs.observe(portfolioSection);

        // Bind scroll event to update counter
        setTimeout(() => {
            if (window.lenis) {
                window.lenis.on('scroll', updateCounterOnScroll);
            } else {
                window.addEventListener('scroll', updateCounterOnScroll, { passive: true });
            }
        }, 500);
    })();

    /* ============================================================
       10. HERO 3D MOUSE TILT EFFECT
       ============================================================ */
    (function initHeroTilt() {
        const hero = document.getElementById('home') || document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        if (!hero || !heroContent) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isTiltRunning = false;
        let tiltRafId = null;

        function startTiltLoop() {
            if (!isTiltRunning && !document.hidden) {
                isTiltRunning = true;
                updateTilt();
            }
        }

        function stopTiltLoop() {
            isTiltRunning = false;
            if (tiltRafId) {
                cancelAnimationFrame(tiltRafId);
                tiltRafId = null;
            }
        }

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            // normalized coordinates from center of the hero (-1 to 1)
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            mouseX = (e.clientX - cx) / (rect.width / 2);
            mouseY = (e.clientY - cy) / (rect.height / 2);
            startTiltLoop();
        }, { passive: true });

        hero.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
            startTiltLoop();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopTiltLoop();
            } else {
                startTiltLoop();
            }
        });

        // Smooth interpolation loop using requestAnimationFrame
        function updateTilt() {
            if (document.hidden || !isTiltRunning) return;

            // Lerp values for smooth movement
            const diffX = mouseX - currentX;
            const diffY = mouseY - currentY;

            currentX += diffX * 0.08;
            currentY += diffY * 0.08;

            const tiltY = currentX * 6; // Max 6 deg rotateY
            const tiltX = -currentY * 6; // Max 6 deg rotateX

            heroContent.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            if (Math.abs(diffX) < 0.001 && Math.abs(diffY) < 0.001) {
                isTiltRunning = false;
                tiltRafId = null;
            } else {
                tiltRafId = requestAnimationFrame(updateTilt);
            }
        }
        startTiltLoop();
    })();

    /* ============================================================
       14. VANTA INTERACTIVE PRICING ENGINE & NUMBER ODOMETER
       ============================================================ */
    (function initVantaPricingEngine() {
        const featuresList = document.getElementById('pricingFeaturesList');
        const planTabsGroup = document.getElementById('planTabsGroup');
        const cycleToggleBar = document.querySelector('.pricing-cycle-toggle-bar');
        const offerBadge = document.getElementById('planOfferBadge');
        const amountEl = document.getElementById('pricingAmount');
        const currencyEl = document.getElementById('pricingCurrency');
        const periodEl = document.getElementById('pricingPeriod');
        const slashedPriceWrap = document.getElementById('slashedPriceWrap');
        const slashedEl = document.getElementById('pricingSlashed');
        const descText = document.getElementById('planDescriptionText');
        const ctaBtn = document.getElementById('pricingCtaBtn');

        if (!featuresList || !planTabsGroup) return;

        // Matriz de Datos de los 3 Planes con Descuento Estratégico en el Plan Básico
        const PLANS_DATA = {
            basico: {
                name: "Básico",
                desc: "Ideal para despegar rápido con una landing page de alto impacto.",
                offerBadge: "🔥 OFERTA ÚNICA - 31% DESCUENTO",
                monthly: { price: 199, original: 290, period: "USD" },
                annual: { price: 159, original: 230, period: "USD / mes" },
                ctaText: "Adquirir Plan Básico",
                waMsg: "Hola,%20quiero%20aprovechar%20la%20Oferta%20del%20Plan%20B%C3%A1sico",
                features: [
                    { name: "Landing page profesional de alta conversión", included: true },
                    { name: "Diseño responsive adaptado a móvil y web", included: true },
                    { name: "Formulario directo de contacto a WhatsApp", included: true },
                    { name: "Dominio y despliegue rápido en la nube", included: true },
                    { name: "Panel de administración CMS", included: false },
                    { name: "Base de datos y API Backend", included: false },
                    { name: "Integraciones de IA autónomas", included: false }
                ]
            },
            pro: {
                name: "Profesional",
                desc: "Solución completa para negocios que requieren gestión de datos y panel admin.",
                offerBadge: "⚡ PLAN MÁS POPULAR ENTRE STARTUPS",
                monthly: { price: 499, original: 650, period: "USD" },
                annual: { price: 399, original: 520, period: "USD / mes" },
                ctaText: "Seleccionar Plan Profesional",
                waMsg: "Hola,%20estoy%20interesado%20en%20el%20Plan%20Profesional",
                features: [
                    { name: "Web completa multi-página con micro-animaciones", included: true },
                    { name: "Diseño responsive adaptado a móvil y web", included: true },
                    { name: "Formulario directo de contacto a WhatsApp", included: true },
                    { name: "Dominio y despliegue rápido en la nube", included: true },
                    { name: "Panel de administración CMS completo", included: true },
                    { name: "Base de datos escalable + API Backend", included: true },
                    { name: "Integraciones de IA autónomas", included: false }
                ]
            },
            enterprise: {
                name: "Empresarial",
                desc: "Infraestructura a medida de alta escala con integración de Inteligencia Artificial.",
                offerBadge: "🚀 INFRAESTRUCTURA DE ÉLITE A MEDIDA",
                monthly: { price: "Custom", original: null, period: "" },
                annual: { price: "Custom", original: null, period: "" },
                ctaText: "Solicitar Cotización Personalizada",
                waMsg: "Hola,%20necesito%20una%20cotizaci%C3%B3n%20para%20un%20proyecto%20Empresarial",
                features: [
                    { name: "Sistema a medida multi-módulo completo", included: true },
                    { name: "Diseño responsive adaptado a móvil y web", included: true },
                    { name: "Formulario directo de contacto a WhatsApp", included: true },
                    { name: "Dominio y despliegue rápido en la nube", included: true },
                    { name: "Panel de administración CMS completo", included: true },
                    { name: "Base de datos escalable + API Backend", included: true },
                    { name: "Integraciones de IA autónomas y Agentes", included: true }
                ]
            }
        };

        let activePlanKey = 'basico';
        let activeCycleKey = 'monthly';

        // Animación suave de cambio numérico (Odometer / NumberFlow)
        function animateValue(obj, start, end, duration) {
            if (isNaN(start) || isNaN(end)) {
                obj.textContent = end;
                return;
            }
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentVal = Math.floor(progress * (end - start) + start);
                obj.textContent = currentVal;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        function renderPricingUI() {
            const plan = PLANS_DATA[activePlanKey];
            const cycleData = plan[activeCycleKey];

            // 1. Renderizar Features List
            featuresList.innerHTML = plan.features.map(f => `
                <li class="${f.included ? 'included' : 'excluded'}">
                    <i class="fas ${f.included ? 'fa-check' : 'fa-times'}"></i>
                    <span>${f.name}</span>
                </li>
            `).join('');

            // 2. Badge & Descrip
            offerBadge.textContent = plan.offerBadge;
            descText.textContent = plan.desc;

            // 3. Precios y animación de números
            if (typeof cycleData.price === 'number') {
                currencyEl.style.display = 'inline';
                periodEl.textContent = cycleData.period;
                
                const currentVal = parseInt(amountEl.textContent) || 0;
                animateValue(amountEl, currentVal, cycleData.price, 400);

                if (cycleData.original) {
                    slashedPriceWrap.style.display = 'flex';
                    const currentSlashed = parseInt(slashedEl.textContent) || 0;
                    animateValue(slashedEl, currentSlashed, cycleData.original, 400);
                } else {
                    slashedPriceWrap.style.display = 'none';
                }
            } else {
                // Caso Empresarial (Cotización Custom)
                currencyEl.style.display = 'none';
                amountEl.textContent = "Cotización";
                periodEl.textContent = "a medida";
                slashedPriceWrap.style.display = 'none';
            }

            // 4. Actualizar CTA WhatsApp Button
            ctaBtn.setAttribute('href', `https://wa.me/584127121162?text=${plan.waMsg}%20(${activeCycleKey === 'annual' ? 'Facturaci%C3%B3n%20Anual' : 'Facturaci%C3%B3n%20Mensual'})`);
            const btnSpan = ctaBtn.querySelector('span');
            if (btnSpan) btnSpan.textContent = plan.ctaText;
        }

        // Handlers para Tabs de Planes
        planTabsGroup.querySelectorAll('.plan-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                planTabsGroup.querySelectorAll('.plan-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activePlanKey = btn.getAttribute('data-plan');
                renderPricingUI();
            });
        });

        // Handlers para Toggle de Ciclos
        if (cycleToggleBar) {
            cycleToggleBar.querySelectorAll('.cycle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    cycleToggleBar.querySelectorAll('.cycle-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeCycleKey = btn.getAttribute('data-cycle');
                    renderPricingUI();
                });
            });
        }

        // Feedback HUD al hacer click en adquirir plan
        ctaBtn.addEventListener('click', () => {
            if (window.showHudToast) {
                const planName = activePlanKey === 'basico' ? 'PLAN BÁSICO' : (activePlanKey === 'pro' ? 'PLAN PROFESIONAL' : 'PLAN EMPRESARIAL');
                window.showHudToast(`[COTIZACIÓN SELECCIONADA // ${planName}]`);
            }
        });

        // Render Inicial
        renderPricingUI();
    })();


    /* ============================================================
       PHASE 1 PREMIUM — AUDIO UI ENGINE (Web Audio API)
       ============================================================ */
    (function initAudioUI() {
        const btn = document.getElementById('audio-toggle-btn');
        if (!btn) return;

        let audioCtx = null;
        let enabled = false;

        function getCtx() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            return audioCtx;
        }

        function playTone(freq, duration, type = 'sine', gain = 0.05) {
            if (!enabled) return;
            try {
                const ctx = getCtx();
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                osc.type = type;
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.82, ctx.currentTime + duration);
                gainNode.gain.setValueAtTime(0, ctx.currentTime);
                gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + duration + 0.05);
            } catch(e) {}
        }

        function playClick()   { playTone(880, 0.12, 'sine', 0.045); }
        function playHover()   { playTone(660, 0.07, 'sine', 0.025); }
        function playSection() {
            playTone(440, 0.14, 'sine', 0.038);
            setTimeout(() => playTone(554, 0.14, 'sine', 0.038), 80);
            setTimeout(() => playTone(660, 0.18, 'sine', 0.038), 160);
        }

        btn.addEventListener('click', () => {
            enabled = !enabled;
            btn.classList.toggle('active', enabled);
            const offIcon = btn.querySelector('.audio-icon-off');
            const onIcon  = btn.querySelector('.audio-icon-on');
            if (offIcon) offIcon.style.display = enabled ? 'none' : '';
            if (onIcon)  onIcon.style.display  = enabled ? '' : 'none';

            if (enabled) {
                playTone(440, 0.15, 'sine', 0.07);
                setTimeout(() => playTone(554, 0.15, 'sine', 0.07), 100);
                setTimeout(() => playTone(880, 0.25, 'sine', 0.06), 200);
            } else {
                playTone(880, 0.12, 'sine', 0.06);
                setTimeout(() => playTone(440, 0.2, 'sine', 0.05), 100);
            }
        });

        document.addEventListener('click', e => {
            if (!enabled) return;
            if (e.target.closest('.btn, .btn-outline, .plan-tab-btn, .cycle-btn, .modal-tab-btn')) {
                playClick();
            }
        });

        document.querySelectorAll('.nav-links a, .footer-nav-mini a').forEach(a => {
            a.addEventListener('mouseenter', () => playHover());
        });

        document.querySelectorAll('.hud-dots li').forEach(dot => {
            dot.addEventListener('click', () => playSection());
        });

        window._vantaAudio = { playClick, playHover, playSection, isEnabled: () => enabled };
    })();


    /* ============================================================
       PHASE 1 PREMIUM — TEXT SCRAMBLE EN TÍTULOS DE SECCIÓN
       ============================================================ */
    (function initSectionTitleScramble() {
        const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!';
        const SCRAMBLE_DURATION = 800;
        const SETTLE_DELAY = 28;

        function scrambleText(el) {
            if (el._scrambling) return;
            // Skip elements with child elements (reveal-word spans etc)
            const hasChildElements = el.children.length > 0;
            if (hasChildElements) return;

            el._scrambling = true;
            const original = el.getAttribute('data-soriginal') || el.textContent.trim();
            if (!el.getAttribute('data-soriginal')) el.setAttribute('data-soriginal', original);

            const chars = original.split('');
            const settled = new Array(chars.length).fill(false);
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                let display = '';
                chars.forEach((ch, i) => {
                    if (ch === ' ' || settled[i]) {
                        settled[i] = true;
                        display += ch;
                    } else if (elapsed > i * SETTLE_DELAY + SCRAMBLE_DURATION * 0.55) {
                        settled[i] = true;
                        display += ch;
                    } else {
                        display += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    }
                });
                el.textContent = display;
                if (!settled.every(Boolean)) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = original;
                    el._scrambling = false;
                }
            }
            requestAnimationFrame(tick);
        }

        const targets = document.querySelectorAll('.footer-big-word, .stats-headline .sh-line, .bento-title');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => scrambleText(entry.target), 100);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.45 });

        targets.forEach(el => obs.observe(el));
    })();


    /* ============================================================
       PHASE 1 PREMIUM — PORTFOLIO CARD MAGNETIC HOVER + SPOTLIGHT
       ============================================================ */
    (function initPortfolioCardMagneticHover() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const h3 = card.querySelector('h3');

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // CSS custom properties for the radial spotlight (::after pseudo)
                card.style.setProperty('--mx', `${x}px`);
                card.style.setProperty('--my', `${y}px`);

                // Spotlight radial update (h3 estático para respuesta limpia)
            });

            card.addEventListener('mouseleave', () => {
                card.style.removeProperty('--mx');
                card.style.removeProperty('--my');
                if (h3) h3.style.transform = '';
            });
        });
    })();

    /* ============================================================
       FASE 2 #4: CURSOR PREMIUM — THUMBNAIL + CLICK RIPPLE
       ============================================================ */
    (function initCursorPremium() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const cursor = document.querySelector('.cursor');
        if (!cursor) return;

        // Pre-load thumbnail images
        const thumbCache = new Map();
        document.querySelectorAll('[data-cursor-thumb]').forEach(img => {
            const src = img.dataset.cursorThumb;
            if (!src || thumbCache.has(src)) return;
            const image = new Image();
            image.src = src;
            thumbCache.set(src, image);
        });

        // Thumb canvas inside cursor
        let thumbCanvas = cursor.querySelector('.cursor-thumb-canvas');
        if (!thumbCanvas) {
            thumbCanvas = document.createElement('canvas');
            thumbCanvas.className = 'cursor-thumb-canvas';
            thumbCanvas.width  = 110;
            thumbCanvas.height = 110;
            thumbCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border-radius:50%;opacity:0;transition:opacity 0.3s;';
            cursor.appendChild(thumbCanvas);
        }
        const tCtx = thumbCanvas.getContext('2d');

        function drawThumb(src) {
            const img = thumbCache.get(src);
            if (!img) return;
            function render() {
                tCtx.clearRect(0, 0, 110, 110);
                tCtx.save();
                tCtx.beginPath();
                tCtx.arc(55, 55, 55, 0, Math.PI * 2);
                tCtx.clip();
                const aspect = img.naturalWidth / img.naturalHeight;
                let sw = 110, sh = 110;
                if (aspect > 1) { sh = 110 / aspect; } else { sw = 110 * aspect; }
                tCtx.drawImage(img, (110 - sw) / 2, (110 - sh) / 2, sw, sh);
                tCtx.restore();
                thumbCanvas.style.opacity = '1';
            }
            if (img.complete) render();
            else img.onload = render;
        }

        function hideThumb() {
            thumbCanvas.style.opacity = '0';
            cursor.classList.remove('cursor--thumb');
        }

        // Attach to portfolio cards
        document.querySelectorAll('.card').forEach(card => {
            const img = card.querySelector('[data-cursor-thumb]');
            if (!img) return;
            card.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--thumb');
                drawThumb(img.dataset.cursorThumb);
            });
            card.addEventListener('mouseleave', hideThumb);
        });

        // Click ripple effect
        document.addEventListener('click', e => {
            const ripple = document.createElement('div');
            ripple.className = 'cursor-click-ripple';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top  = e.clientY + 'px';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    })();


    /* ============================================================
       FASE 2 #5: SPA EXPAND TRANSITION (proyecto pantalla completa)
       ============================================================ */
    (function initProjectExpand() {
        const overlay   = document.getElementById('project-expand-overlay');
        const closeBtn  = document.getElementById('peo-close-btn');
        const peoTag    = document.getElementById('peo-tag');
        const peoTitle  = document.getElementById('peo-title');
        const peoDesc   = document.getElementById('peo-desc');
        const peoImg    = document.getElementById('peo-img');
        const peoBg     = overlay ? overlay.querySelector('.peo-bg') : null;
        if (!overlay || !closeBtn || !peoBg) return;

        // Project data map (from data-info)
        const DATA = {
            sviva:       { tag: 'TESIS · IA · EDGE', title: 'SVIVA', desc: 'Sistema de Videovigilancia Inteligente. IA operando íntegramente en hardware local. Detección, rastreo y analíticas avanzadas sin internet ni nube.', img: 'img/sviva/svivalogo.png', stack: ['Python','OpenCV','YOLO','FastAPI','Edge Computing'] },
            svivaweb:    { tag: 'Vite · TypeScript · React', title: 'SVIVA Web', desc: 'Landing page de alta inmersión diseñada para promocionar y distribuir el ejecutable de nuestra obra maestra de visión artificial.', img: 'img/sviva/svivaindex.jpeg', stack: ['Vite','TypeScript','React','Three.js','GSAP'] },
            kioskoazul:  { tag: 'Python · Flask · SQLite', title: 'Kiosko Azul', desc: 'Menú digital, reservaciones en tiempo real y pedidos con un completo dashboard administrativo de estadísticas de órdenes.', img: 'img/auracheck/auralogin.jpeg', stack: ['Python','Flask','SQLite','HTML','CSS','JavaScript'] },
            iuta:        { tag: 'Python · Flask · PostgreSQL', title: 'Sistema Bibliotecario IUTA', desc: 'Herramienta robusta que moderniza el control bibliotecario del IUTA, transformando procesos manuales en un ecosistema digital eficiente.', img: 'img/cerdiv/cerdivweb.jpeg', stack: ['Python','Flask','PostgreSQL','Bootstrap'] },
            aura:        { tag: 'FastAPI · Biometría · Seguridad', title: 'Aura Check', desc: 'Panel de auditoría de seguridad biométrica que opera 100% en local — ningún dato sensible abandona el dispositivo del usuario.', img: 'img/auracheck/auralogin.jpeg', stack: ['FastAPI','Python','Biometría','LocalFirst'] },
            cuerpo:      { tag: 'IA · FastAPI · Inmersivo', title: '¿Qué le pasa a mi cuerpo?', desc: 'Plataforma médica impulsada por IA que responde consultas de anatomía con la voz de un doctor victoriano de 1885.', img: 'img/quelepasacuerpo/cuerpologin.jpeg', stack: ['FastAPI','Gemini AI','TTS','Python'] },
            ventastrack: { tag: 'Node.js · TS · PostgreSQL', title: 'VentasTrack B2B', desc: 'Plataforma de ventas con roles y jerarquías, carrito de compras y módulo de facturación, sincronizada a diario con bases de datos del cliente.', img: 'img/sviva/svivaconfig.jpeg', stack: ['Node.js','TypeScript','Vite','PostgreSQL'] },
            inventario:  { tag: 'Sistema · Personalizable', title: 'Inventario Pro', desc: 'Software robusto y 100% personalizable. Optimiza tu control de stock con una interfaz intuitiva y reportes avanzados.', img: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM.jpeg', stack: ['Python','FastAPI','React','PostgreSQL'] },
        };

        function openProject(key, originCard) {
            const d = DATA[key];
            if (!d) return;
            peoTag.textContent   = d.tag;
            peoTitle.textContent = d.title;
            peoDesc.textContent  = d.desc;
            peoImg.src = d.img;
            peoImg.alt = d.title;

            const metaEl = document.getElementById('peo-meta');
            if (metaEl && d.stack) {
                metaEl.innerHTML = d.stack.map(s => `<span>${s}</span>`).join('');
            }

            // Calculate clip-path origin from card's image
            let cx = 50, cy = 50;
            if (originCard) {
                const r = originCard.getBoundingClientRect();
                cx = ((r.left + r.width  / 2) / window.innerWidth)  * 100;
                cy = ((r.top  + r.height / 2) / window.innerHeight) * 100;
            }
            peoBg.style.transition = 'none';
            peoBg.style.clipPath   = `circle(0% at ${cx}% ${cy}%)`;
            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(() => {
                peoBg.style.transition = 'clip-path 0.65s cubic-bezier(0.77,0,0.175,1)';
                peoBg.style.clipPath   = `circle(150% at ${cx}% ${cy}%)`;
            });
        }

        function closeOverlay() {
            overlay.classList.remove('open');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => {
                peoBg.style.clipPath = 'circle(0% at 50% 50%)';
            }, 100);
        }

        // Hook all info-btn buttons to 3D Warp Tunnel Experience → Rich Project Modal
        document.querySelectorAll('.info-btn[data-info]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const key  = btn.dataset.info;
                const card = btn.closest('.card');
                
                const openRichModal = (projKey) => {
                    if (typeof window.openProjectModal === 'function') {
                        window.openProjectModal(projKey);
                    } else if (typeof openProject === 'function') {
                        openProject(projKey, card);
                    }
                };

                if (window.WarpRunner && typeof window.WarpRunner.launch === 'function') {
                    window.WarpRunner.launch(key, (projKey) => {
                        openRichModal(projKey);
                    });
                } else {
                    openRichModal(key);
                }
            });
        });

        // Hook V-SIMULATOR navbar button to launch free 3D Warp Flight
        const simBtn = document.getElementById('v-simulator-btn');
        if (simBtn) {
            simBtn.addEventListener('click', e => {
                e.preventDefault();
                if (window.WarpRunner && typeof window.WarpRunner.launch === 'function') {
                    window.WarpRunner.launch('sviva', null);
                }
            });
        }

        closeBtn.addEventListener('click', closeOverlay);

        overlay.addEventListener('click', e => {
            if (e.target === overlay || e.target.classList.contains('peo-bg')) closeOverlay();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
        });
    })();

    /* ============================================================
       SCROLLYTELLING BACKGROUND CONTROLLER (WATER / SPARKLES / NEURAL)
       ============================================================ */
    (function initScrollytellingBgController() {
        const waterCanvas = document.getElementById('water-canvas') || document.getElementById('waves-canvas');
        const sparklesCanvas = document.getElementById('sparkles-canvas');
        const neuralCanvas = document.getElementById('neural-canvas');

        const techSection = document.getElementById('tech-matrix');
        const contactSection = document.getElementById('contact');

        if (!techSection && !contactSection) return;

        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetId = entry.target.id;
                const isVisible = entry.isIntersecting;

                if (targetId === 'tech-matrix') {
                    if (isVisible) {
                        if (waterCanvas) waterCanvas.style.opacity = '0.12';
                        if (sparklesCanvas) sparklesCanvas.style.opacity = '1.0';
                    } else {
                        if (sparklesCanvas) sparklesCanvas.style.opacity = '0.0';
                        if (waterCanvas) waterCanvas.style.opacity = '1.0';
                    }
                }

                if (targetId === 'contact') {
                    if (isVisible) {
                        if (waterCanvas) waterCanvas.style.opacity = '0.05';
                        if (sparklesCanvas) sparklesCanvas.style.opacity = '0.0';
                        if (neuralCanvas) neuralCanvas.style.opacity = '1.0';
                    } else {
                        if (neuralCanvas) neuralCanvas.style.opacity = '0.0';
                        if (waterCanvas) waterCanvas.style.opacity = '1.0';
                    }
                }
            });
        }, { threshold: 0.15 });

        if (techSection) bgObserver.observe(techSection);
        if (contactSection) bgObserver.observe(contactSection);
    })();

    /* ============================================================
       3D CYBER FELT CANVAS — Grid + VANTA Oval Ring (No shockwaves, pure background)
       ============================================================ */
    (function initPokerFeltCanvas() {
        const canvas = document.getElementById('poker-felt-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            const section = document.getElementById('tech-matrix');
            if (section) {
                canvas.width  = section.offsetWidth  || window.innerWidth;
                canvas.height = section.offsetHeight || window.innerHeight;
            } else {
                canvas.width  = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        }
        resize();
        window.addEventListener('resize', resize);

        let time = 0;
        let isFeltVisible = false;
        let feltRafId = null;

        function renderFelt() {
            if (!isFeltVisible || document.hidden) {
                feltRafId = null;
                return;
            }
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            time += 0.012;

            // Vanishing point: upper-center of the visible viewport
            const cx = W * 0.5;
            // The felt grid sits in the bottom 45% of the section height
            const tableTop    = H * 0.55;
            const tableBottom = H;

            ctx.save();
            ctx.strokeStyle = 'rgba(17, 212, 131, 0.06)';
            ctx.lineWidth = 1;

            // Vertical perspective lines
            const cols = 20;
            for (let i = -cols; i <= cols; i++) {
                const bx = cx + i * (W / cols) * 0.5;
                ctx.beginPath();
                ctx.moveTo(cx + i * 3, tableTop);
                ctx.lineTo(bx, tableBottom);
                ctx.stroke();
            }

            // Horizontal lines (perspective-spaced)
            const rows = 10;
            for (let j = 0; j <= rows; j++) {
                const t  = j / rows;
                const py = tableTop + Math.pow(t, 1.6) * (tableBottom - tableTop);
                ctx.beginPath();
                ctx.moveTo(0, py);
                ctx.lineTo(W, py);
                ctx.stroke();
            }
            ctx.restore();

            // VANTA Oval Table Contour (centered on the felt)
            const ovalCX = cx;
            const ovalCY = tableTop + (tableBottom - tableTop) * 0.28;
            const ovalRX = Math.min(cx * 0.72, 500);
            const ovalRY = ovalRX * 0.26;

            ctx.save();
            ctx.beginPath();
            ctx.ellipse(ovalCX, ovalCY, ovalRX, ovalRY, 0, 0, Math.PI * 2);
            const glowAlpha = 0.28 + Math.sin(time) * 0.08;
            ctx.strokeStyle = `rgba(17, 212, 131, ${glowAlpha})`;
            ctx.lineWidth = 2;
            ctx.shadowColor = '#11d483';
            ctx.shadowBlur  = 12;
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(ovalCX, ovalCY, ovalRX * 0.92, ovalRY * 0.92, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.09)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            ctx.stroke();
            ctx.restore();

            feltRafId = requestAnimationFrame(renderFelt);
        }

        const pokerSec = document.getElementById('poker-dealer') || document.getElementById('tech-matrix');
        if (pokerSec && 'IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                isFeltVisible = entries[0].isIntersecting;
                if (isFeltVisible && !feltRafId) {
                    renderFelt();
                } else if (!isFeltVisible && feltRafId) {
                    cancelAnimationFrame(feltRafId);
                    feltRafId = null;
                }
            }, { threshold: 0.05 }).observe(pokerSec);
        } else {
            isFeltVisible = true;
            renderFelt();
        }
    })();

                    /* ============================================================
       AWWWARDS CYBERPUNK POKER TECH DECK — Real Heads-Up Game Sequence
       Top Player: ANDRÉS ♠ (Full-Stack & Cloud)
       Bottom Player: JOHAN ♦ (AI Vision & 3D Graphics)
       Center Pot: THE WINNING RIVER CARD (VANTA Master Slam)
       ============================================================ */
        /* ============================================================
       AWWWARDS CYBERPUNK POKER TECH DECK — Real Heads-Up Game Sequence
       Top Player: ANDRÉS ♠ (Full-Stack & Cloud)
       Bottom Player: JOHAN ♦ (AI Vision & 3D Graphics)
       Center Pot: THE WINNING RIVER CARD (VANTA Master Slam)
       ============================================================ */
        /* ============================================================
       AWWWARDS CYBERPUNK POKER TECH DECK — Real Heads-Up Dealer Sequence
       Dealer: Central deck → alternating arc-slide deal (A J A J A J...)
       Top Player: ANDRÉS ♠  |  Bottom Player: JOHAN ♦
       River: THE WINNING SLAM (VANTA Master)
       ============================================================ */
    (function initCyberpunkPokerDeckScrollytelling() {
        const section   = document.getElementById('tech-matrix');
        const tableFelt = document.getElementById('poker-table-felt');
        const cards     = document.querySelectorAll('.poker-card');
        const modal     = document.getElementById('poker-card-modal');
        const stage     = document.getElementById('poker-felt-stage');
        if (!section || !cards.length) return;

        // ─── Complete Tech Specs Dataset for Modal ───────────────────────
        const techSpecsData = {
            fastapi: {
                badge: "BACKEND ENGINE", title: "FastAPI Async",
                rank: "AS DE CORAZONES ♥", accent: "#059669", icon: "fas fa-bolt",
                desc: "Arquitectura backend REST asíncrona de alta velocidad con tipado Pydantic v2 y OpenAPI v3.",
                projects: [
                    { icon: "fas fa-server", name: "Core API Gateway VANTA", desc: "Malla de microservicios procesando 10,000 req/sec." },
                    { icon: "fas fa-shield-alt", name: "OAuth2 & JWT RS256", desc: "Validación criptográfica asimétrica sub-milisegundo." }
                ],
                metrics: [ { val: "10k Req/s", lbl: "Concurrencia" }, { val: "< 1.5ms", lbl: "Latencia" }, { val: "Pydantic v2", lbl: "Esquema Estricto" }, { val: "Uvicorn", lbl: "ASGI Core" } ]
            },
            supabase: {
                badge: "CLOUD & BAAS", title: "Supabase Cloud",
                rank: "REY DE PICAS ♠", accent: "#3ECF8E", icon: "fas fa-cloud-upload-alt",
                desc: "Bases de datos relacionales Postgres en tiempo real con políticas RLS, Storage CDN y Edge Functions.",
                projects: [
                    { icon: "fas fa-database", name: "Base de Datos Multi-Tenant", desc: "Streaming WebSocket en vivo y triggers automáticos." },
                    { icon: "fas fa-lock", name: "Row Level Security (RLS)", desc: "Aislamiento granular de datos por cliente." }
                ],
                metrics: [ { val: "Realtime", lbl: "WebSockets" }, { val: "100% RLS", lbl: "Seguridad Granular" }, { val: "Edge CDN", lbl: "Global Cache" }, { val: "Postgres", lbl: "ACID Engine" } ]
            },
            react: {
                badge: "UI FRONTEND", title: "React 19, TS & Core Web",
                rank: "REINA DE DIAMANTES ♦", accent: "#61DAFB", icon: "fab fa-react",
                desc: "Plataformas frontend modulares con React 19, Server Components, TypeScript estricto, HTML5, CSS3 y JS.",
                projects: [
                    { icon: "fas fa-desktop", name: "Plataforma Web Studio", desc: "Renderizado reactivo a 60 FPS con animaciones cinéticas." },
                    { icon: "fas fa-code", name: "HTML5/CSS3/JS Moderno", desc: "Sin dependencias pesadas, optimización CSS atómica." }
                ],
                metrics: [ { val: "100/100", lbl: "Lighthouse" }, { val: "0.0s", lbl: "CLS Layout Shift" }, { val: "Strict TS", lbl: "Tipado Estricto" }, { val: "React 19", lbl: "Server Actions" } ]
            },
            nodejs: {
                badge: "SERVERLESS ENGINE", title: "Node.js & Vercel Edge",
                rank: "JOTA DE TRÉBOLES ♣", accent: "#68A063", icon: "fab fa-node-js",
                desc: "Microservicios en Node.js asíncronos y canalización de despliegue serverless continuo en Vercel Edge Network.",
                projects: [
                    { icon: "fas fa-network-wired", name: "Edge Microservices Network", desc: "Despliegues globales instantáneos con latencia cero." },
                    { icon: "fas fa-rocket", name: "Vercel CI/CD Pipeline", desc: "Compilación atomizada y vistas previas de ramas de Git." }
                ],
                metrics: [ { val: "< 5ms", lbl: "Edge Response" }, { val: "Serverless", lbl: "Escalado Elástico" }, { val: "Node.js 20", lbl: "Runtime LTH" }, { val: "Vercel CDN", lbl: "Cobertura Mundial" } ]
            },
            python: {
                badge: "CORE COMPUTING", title: "Python 3.11 & Flask",
                rank: "AS DE ESPADAS ♠", accent: "#3776AB", icon: "fab fa-python",
                desc: "Motor computacional en Python 3.11 para backend síncrono/asíncrono, micro-APIs en Flask y scripts de datos.",
                projects: [
                    { icon: "fas fa-microchip", name: "Microservicios Flask", desc: "APIs ligeras de alto rendimiento para procesamiento paralelo." },
                    { icon: "fas fa-cogs", name: "Orquestación de Datos", desc: "Pipelines de transformación y computación numérica." }
                ],
                metrics: [ { val: "Python 3.11", lbl: "CPython Async" }, { val: "Flask REST", lbl: "Micro-APIs" }, { val: "Zero-GIL", lbl: "Parallel Workers" }, { val: "100%", lbl: "Estabilidad Backend" } ]
            },
            andres_infra: {
                badge: "INFRASTRUCTURE", title: "C++, Docker & Git",
                rank: "DIEZ DE ESPADAS ♠", accent: "#00599C", icon: "fab fa-docker",
                desc: "Contenedores Docker aislados, control de versiones colaborativo con Git y módulos de bajo nivel en C++.",
                projects: [
                    { icon: "fas fa-box", name: "Dockerized Microservices", desc: "Contenedores multi-stage optimizados para producción." },
                    { icon: "fas fa-code-branch", name: "Git Workflow Master", desc: "Pipelines CI/CD automatizados y control estricto de ramas." }
                ],
                metrics: [ { val: "Dockerized", lbl: "Aislamiento Total" }, { val: "C++ Native", lbl: "Cómputo Nativo" }, { val: "Git CI/CD", lbl: "Control Versiones" }, { val: "Multi-Cloud", lbl: "Compatibilidad" } ]
            },
            yolo: {
                badge: "COMPUTER VISION", title: "YOLOv8 AI Vision",
                rank: "REY DE DIAMANTES ♦", accent: "#11d483", icon: "fas fa-eye",
                desc: "Redes convolucionales YOLOv8 para segmentación y detección de objetos en tiempo real 100% locales.",
                projects: [
                    { icon: "fas fa-video", name: "Control de Calidad Industrial", desc: "Inspección automatizada con 99.4% de precisión." },
                    { icon: "fas fa-camera", name: "Tracking Multicámara", desc: "32 objetos simultáneos sin latencia en la nube." }
                ],
                metrics: [ { val: "99.4%", lbl: "Precisión mAP" }, { val: "60 FPS", lbl: "Inferencia Local" }, { val: "TensorRT", lbl: "Aceleración GPU" }, { val: "0 Cloud", lbl: "Privacidad Total" } ]
            },
            ml: {
                badge: "ARTIFICIAL INTELLIGENCE", title: "Machine Learning & Neural Nets",
                rank: "AS DE TRÉBOLES ♣", accent: "#a855f7", icon: "fas fa-brain",
                desc: "Entrenamiento de modelos de aprendizaje profundo, redes neuronales personalizadas y algoritmos predictivos.",
                projects: [
                    { icon: "fas fa-project-diagram", name: "Redes Neuronales Profundas", desc: "Clasificación multivariada y modelos predictivos." },
                    { icon: "fas fa-chart-line", name: "Optimización de Hiperparámetros", desc: "Ajuste fino de modelos para máxima precisión." }
                ],
                metrics: [ { val: "Deep Learning", lbl: "Redes Neuronales" }, { val: "PyTorch Core", lbl: "Framework AI" }, { val: "Real-time", lbl: "Predicciones" }, { val: "Local AI", lbl: "Sin Intermediarios" } ]
            },
            three: {
                badge: "3D GRAPHICS", title: "3D Models & Three.js",
                rank: "REINA DE TRÉBOLES ♣", accent: "#00ffff", icon: "fas fa-cube",
                desc: "Visualización 3D interactiva en tiempo real WebGL, modelos 3D PBR, shaders GLSL y animaciones físicas.",
                projects: [
                    { icon: "fas fa-globe", name: "Universo 3D Portafolio VANTA", desc: "Partículas fluidas, cristal interactivo y refracción." },
                    { icon: "fas fa-cube", name: "Modelos 3D PBR", desc: "Carga optimizada de archivos GLTF/GLB con mapas HDRI." }
                ],
                metrics: [ { val: "120 FPS", lbl: "Render WebGL" }, { val: "GLSL 3.0", lbl: "Custom Shaders" }, { val: "PBR Materials", lbl: "Física de Luz" }, { val: "< 1.2MB", lbl: "Bundle Opt" } ]
            },
            postgres: {
                badge: "DATABASE ENGINE", title: "PostgreSQL & Neon",
                rank: "NUEVE DE DIAMANTES ♦", accent: "#4169E1", icon: "fas fa-database",
                desc: "Base de datos relacional serverless con aislamiento de transacciones ACID y consultas JSONB híbridas.",
                projects: [
                    { icon: "fas fa-database", name: "Motor de Datos Multi-Tenant", desc: "Índices B-Tree optimizados + consultas JSONB." },
                    { icon: "fas fa-cloud", name: "Arquitectura Serverless Neon", desc: "Escalado elástico a cero en inactividad." }
                ],
                metrics: [ { val: "100%", lbl: "Garantía ACID" }, { val: "0.001ms", lbl: "Index Lookup" }, { val: "Neon Cloud", lbl: "Serverless Mesh" }, { val: "JSONB", lbl: "Document Hybrid" } ]
            },
            cloudflare: {
                badge: "CYBER SECURITY", title: "Cloudflare Tunnels",
                rank: "DIEZ DE DIAMANTES ♦", accent: "#F38020", icon: "fas fa-shield-alt",
                desc: "Enrutamiento privado de redes Zero Trust, túneles cifrados de punto a punto y protección anti-DDoS.",
                projects: [
                    { icon: "fas fa-user-shield", name: "Arquitectura Zero Trust", desc: "Acceso seguro a servidores locales sin puertos abiertos." },
                    { icon: "fas fa-network-wired", name: "Cloudflare Edge Tunnels", desc: "Tráfico encriptado de alta velocidad." }
                ],
                metrics: [ { val: "Zero Trust", lbl: "Sin Puertos Abiertos" }, { val: "Anti-DDoS", lbl: "Protección Edge" }, { val: "100% SSL", lbl: "Cifrado Total" }, { val: "< 2ms", lbl: "Latencia Túnel" } ]
            },
            johan_core: {
                badge: "CORE ENGINE", title: "Python, C++, Docker & Git",
                rank: "JOTA DE DIAMANTES ♦", accent: "#11d483", icon: "fas fa-code-branch",
                desc: "Integración de lenguajes de alto rendimiento, código nativo C++, contenedores Docker y flujos Git.",
                projects: [
                    { icon: "fas fa-terminal", name: "Bindings C++ Nativo", desc: "Aceleración de código crítico para procesamiento 3D y AI." },
                    { icon: "fas fa-boxes", name: "Dockerized Pipelines", desc: "Entornos de entrenamiento aislados en contenedores." }
                ],
                metrics: [ { val: "C++ Native", lbl: "Cómputo Nativo" }, { val: "Docker AI", lbl: "Entornos Aislados" }, { val: "Git Flow", lbl: "Control Código" }, { val: "Python AI", lbl: "Integración Core" } ]
            },
            vanta_master: {
                badge: "THE WINNING HAND", title: "CRITERIO",
                rank: "AS MAESTRO ♠♦", accent: "#f0c030", icon: "fas fa-crown",
                desc: "Sinergia técnica de elite por Andrés & Johan. La combinación perfecta de Full-Stack Cloud, IA y Gráficos 3D.",
                projects: [
                    { icon: "fas fa-user-astronaut", name: "Andrés — Full-Stack & Cloud", desc: "FastAPI, Supabase, React, Node, Python, Flask, C++, Vercel, Docker, Git." },
                    { icon: "fas fa-robot", name: "Johan — AI Vision & 3D", desc: "YOLOv8, Machine Learning, 3D Models, Three.js, Postgres, Cloudflare Tunnels, Python, C++, Docker, Git." }
                ],
                metrics: [ { val: "360° Studio", lbl: "Cobertura Total" }, { val: "60 FPS", lbl: "Rendimiento Web" }, { val: "Local AI", lbl: "Inferencia Propia" }, { val: "Awwwards", lbl: "Nivel de Calidad" } ]
            }
        };

        function setupPokerDealer() {
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                setTimeout(setupPokerDealer, 100);
                return;
            }
            gsap.registerPlugin(ScrollTrigger);

            // ─── Audio synth ─────────────────────────────────────────────
            let audioCtx = null;
            function playTick(freq = 440, dur = 0.06) {
                try {
                    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    if (audioCtx.state === 'suspended') audioCtx.resume();
                    const osc  = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + dur);
                    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + dur);
                } catch(e) {}
            }

            // ─── Master Slam Felt Shockwave ───────────────────────────────
            function spawnMasterFeltShockwave() {
                if (!tableFelt) return;
                for (let w = 0; w < 3; w++) {
                    const ripple = document.createElement('div');
                    ripple.className = 'master-felt-shockwave';
                    ripple.style.cssText = `left:50%;top:50%;width:${160 + w*40}px;height:${80 + w*20}px;animation-delay:${w * 0.12}s;`;
                    tableFelt.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 1100 + w * 120);
                }
            }

            // ─── Screen Shake ─────────────────────────────────────────────
            function triggerScreenShake() {
                if (!tableFelt) return;
                gsap.to(tableFelt, {
                    x: "+=6", y: "+=4", duration: 0.035,
                    repeat: 8, yoyo: true, ease: "sine.inOut",
                    onComplete: () => gsap.set(tableFelt, { x: 0, y: 0 })
                });
            }

            // ─── Card Positions ───────────────────────────────────────────
            // ─── Card Positions & Responsive Spreads ───────────────────────
            const andresCards = Array.from(document.querySelectorAll('.card-andres'));
            const johanCards  = Array.from(document.querySelectorAll('.card-johan'));
            const masterCard  = document.getElementById('master-vanta-card');

            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            const xSpread = isMobile ? (window.innerWidth < 480 ? 0.46 : 0.62) : (isTablet ? 0.82 : 1.0);
            const ySpread = isMobile ? (window.innerHeight < 700 ? 0.72 : 0.85) : 1.0;
            const cardTargetScale = isMobile ? 0.68 : (isTablet ? 0.80 : 0.91);
            const masterTargetScale = isMobile ? 0.80 : (isTablet ? 0.92 : 1.0);

            // Final resting spots for each hand
            const andresSpots = [
                { x: -300 * xSpread, y: -138 * ySpread, rZ: -12 },
                { x: -180 * xSpread, y: -145 * ySpread, rZ: -7  },
                { x: -60  * xSpread, y: -148 * ySpread, rZ: -2  },
                { x:  60  * xSpread, y: -148 * ySpread, rZ:  2  },
                { x:  180 * xSpread, y: -145 * ySpread, rZ:  7  },
                { x:  300 * xSpread, y: -138 * ySpread, rZ:  12 }
            ];
            // Johan (bottom of table): mirror
            const johanSpots = [
                { x: -300 * xSpread, y:  138 * ySpread, rZ: -12 },
                { x: -180 * xSpread, y:  145 * ySpread, rZ: -7  },
                { x: -60  * xSpread, y:  148 * ySpread, rZ: -2  },
                { x:  60  * xSpread, y:  148 * ySpread, rZ:  2  },
                { x:  180 * xSpread, y:  145 * ySpread, rZ:  7  },
                { x:  300 * xSpread, y:  138 * ySpread, rZ:  12 }
            ];

            // ─── Pre-set ALL cards to dealer deck at center ───────────────
            // Deck is slightly above center (dealer's side concept)
            const deckY = 0;
            andresCards.forEach((card) => {
                gsap.set(card, { x: 0, y: deckY, scale: 0.18, opacity: 0, rotationZ: 0, zIndex: 2 });
                const inner = card.querySelector('.poker-card-inner');
                if (inner) gsap.set(inner, { rotateY: 0 });
            });
            johanCards.forEach((card) => {
                gsap.set(card, { x: 0, y: deckY, scale: 0.18, opacity: 0, rotationZ: 0, zIndex: 2 });
                const inner = card.querySelector('.poker-card-inner');
                if (inner) gsap.set(inner, { rotateY: 0 });
            });
            if (masterCard) {
                gsap.set(masterCard, { x: 0, y: 0, scale: 0.18, opacity: 0, rotationZ: 0, zIndex: 50 });
                const inner = masterCard.querySelector('.poker-card-inner');
                if (inner) gsap.set(inner, { rotateY: 0 });
            }

            // Seats
            const seatA = document.getElementById('seat-andres');
            const seatJ = document.getElementById('seat-johan');
            if (seatA) gsap.set(seatA, { opacity: 0, y: -10 });
            if (seatJ) gsap.set(seatJ, { opacity: 0, y:  10 });

            // ─── ScrollTrigger Timeline ───────────────────────────────────
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=260%",
                    pin: true,
                    scrub: 1.6,
                    anticipatePin: 1
                }
            });

            // PHASE 0: Header cinema fade-out + seat reveal
            const pokerHeader = section.querySelector('.poker-header');
            if (pokerHeader) {
                tl.to(pokerHeader, {
                    opacity: 0, y: -40, scale: 0.95, filter: "blur(8px)",
                    duration: 0.35, ease: "power2.inOut"
                }, 0);
            }
            if (seatA) tl.to(seatA, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }, 0.05);
            if (seatJ) tl.to(seatJ, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }, 0.10);

            // ─── PHASE 1+2: Alternating Dealer Deal (A0,J0,A1,J1,...) ────
            // Real poker heads-up deal: alternate every card, one to each player
            const dealSequence = [];
            for (let i = 0; i < 6; i++) {
                dealSequence.push({ card: andresCards[i], spot: andresSpots[i], player: 'andres', idx: i });
                dealSequence.push({ card: johanCards[i],  spot: johanSpots[i],  player: 'johan',  idx: i });
            }

            const DEAL_SPACING = 0.38; // time between each card being dealt (tight = snappy dealer)
            const SLIDE_DUR    = 0.52; // how long the slide across the felt takes
            const FLIP_DUR     = 0.38; // how long the card flip takes

            dealSequence.forEach((deal, seqIdx) => {
                const { card, spot, player, idx } = deal;
                const inner = card.querySelector('.poker-card-inner');
                const baseDelay = 0.25 + seqIdx * DEAL_SPACING;

                const endX  = spot.x;
                const endY  = spot.y;
                const endRZ = spot.rZ;

                // Arc mid-point: 52% of the way, with lateral deflection for curve feel
                const arcMidX = endX * 0.52 + (endRZ > 0 ? -14 : 14);
                const arcMidY = endY * 0.48;

                // — Step 1: Snap out of deck, rocket toward arc midpoint —
                tl.to(card, {
                    x: arcMidX, y: arcMidY,
                    scale: cardTargetScale * 0.96, opacity: 1,
                    rotationZ: endRZ * 0.25,
                    duration: SLIDE_DUR * 0.6,
                    ease: "power4.out"
                }, baseDelay);

                // — Flip card face-up during travel (split: 90° then reveal) —
                if (inner) {
                    // First half of flip (goes dark)
                    tl.to(inner, {
                        rotateY: 90,
                        duration: FLIP_DUR * 0.45,
                        ease: "power2.in"
                    }, baseDelay + SLIDE_DUR * 0.30);
                    // Second half (reveals front face)
                    tl.to(inner, {
                        rotateY: 180,
                        duration: FLIP_DUR * 0.55,
                        ease: "power2.out"
                    }, baseDelay + SLIDE_DUR * 0.30 + FLIP_DUR * 0.45);
                }

                // — Step 2: Decelerate & settle into final position —
                tl.to(card, {
                    x: endX, y: endY,
                    scale: cardTargetScale,
                    rotationZ: endRZ,
                    duration: SLIDE_DUR * 0.55,
                    ease: "power3.inOut"
                }, baseDelay + SLIDE_DUR * 0.52);

                // — Step 3: Landing thud — squish compress then elastic bounce —
                const landAt = baseDelay + SLIDE_DUR * 0.52 + SLIDE_DUR * 0.55;
                tl.to(card, { scaleY: cardTargetScale * 0.88, scaleX: cardTargetScale * 1.05, duration: 0.055, ease: "power3.in" }, landAt);
                tl.to(card, { scaleY: cardTargetScale, scaleX: cardTargetScale, duration: 0.20,  ease: "elastic.out(1.35, 0.52)" }, landAt + 0.055);

                // Crisp click sound on landing
                tl.call(() => {
                    playTick(player === 'andres' ? 430 + idx * 22 : 470 + idx * 22, 0.065);
                }, null, landAt + 0.01);
            });

            // ─── PHASE 3: The River Slam — VANTA Master Card ─────────────
            const riverStart = 0.30 + dealSequence.length * DEAL_SPACING + 0.40;

            if (masterCard) {
                const inner = masterCard.querySelector('.poker-card-inner');

                // Master card: ascends smoothly from deck to floating hero position
                tl.to(masterCard, {
                    y: isMobile ? -160 : -240, scale: isMobile ? 1.15 : 1.55, opacity: 1,
                    duration: 0.50, ease: "power3.out"
                }, riverStart);

                // Hold in air with subtle floating drift (suspense beat)
                tl.to(masterCard, {
                    y: isMobile ? -170 : -255, scale: isMobile ? 1.20 : 1.60,
                    duration: 0.35, ease: "sine.inOut"
                }, riverStart + 0.50);

                // Flip face-up while hovering majestically
                if (inner) {
                    tl.to(inner, { rotateY: 90,  duration: 0.30, ease: "power2.in"  }, riverStart + 0.40);
                    tl.to(inner, { rotateY: 180, duration: 0.30, ease: "power2.out" }, riverStart + 0.70);
                }

                // Heavy gravity slam DOWN onto center of felt
                tl.to(masterCard, {
                    x: 0, y: 0,
                    scale: masterTargetScale * 1.05,
                    rotationZ: 0,
                    duration: 0.45,
                    ease: "power4.in"
                }, riverStart + 0.85);

                // Landing: heavy compress + dramatic elastic expansion
                tl.to(masterCard, { scaleY: masterTargetScale * 0.75, scaleX: masterTargetScale * 1.12, duration: 0.09, ease: "power4.in" }, riverStart + 1.30);
                tl.to(masterCard, { scaleY: masterTargetScale,  scaleX: masterTargetScale,  duration: 0.45, ease: "elastic.out(1.2, 0.48)" }, riverStart + 1.39);

                // Shockwave + shake + bass boom
                tl.call(() => {
                    spawnMasterFeltShockwave();
                    triggerScreenShake();
                    playTick(220, 0.35);
                    setTimeout(() => playTick(880, 0.15), 80);
                }, null, riverStart + 1.31);
            }

            // ─── Hover & Click Interactions ───────────────────────────────
            cards.forEach((card) => {
                const inner    = card.querySelector('.poker-card-inner');
                const isMaster = card.classList.contains('master-vanta-card');

                card.addEventListener('mouseenter', () => {
                    playTick(600, 0.04);
                    gsap.to(card, { scale: (isMaster ? 1.0 : 0.91) * 1.16, zIndex: 40, duration: 0.22, ease: "power2.out" });
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { scale: isMaster ? 1.0 : 0.91, zIndex: 10, duration: 0.22, ease: "power2.out" });
                });
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.poker-inspect-btn')) return;
                    if (!inner) return;
                    playTick(760, 0.07);
                    const cur = gsap.getProperty(inner, "rotateY") || 0;
                    gsap.to(inner, { rotateY: cur >= 90 ? 0 : 180, duration: 0.55, ease: "back.out(1.5)" });
                });
            });

            // ─── Inspection Modal ─────────────────────────────────────────
            const inspectBtns = document.querySelectorAll('.poker-inspect-btn');
            const closeBtn    = modal ? modal.querySelector('.poker-modal-close')   : null;
            const backdrop    = modal ? modal.querySelector('.poker-modal-backdrop') : null;

            function openModal(key) {
                const d = techSpecsData[key];
                if (!d || !modal) return;
                document.getElementById('modal-badge').innerText = d.badge;
                document.getElementById('modal-title').innerText = d.title;
                document.getElementById('modal-rank').innerText  = d.rank;
                document.getElementById('modal-desc').innerText  = d.desc;
                const iconBox = document.getElementById('modal-icon');
                if (iconBox) { iconBox.innerHTML = `<i class="${d.icon}"></i>`; iconBox.style.color = d.accent; }
                const cardBox = document.getElementById('modal-card-box');
                if (cardBox) { cardBox.style.borderColor = d.accent; cardBox.style.setProperty('--modal-accent', d.accent); }
                const pEl = document.getElementById('modal-projects');
                if (pEl) pEl.innerHTML = d.projects.map(p => `
                    <div class="project-chip" style="--modal-accent:${d.accent}">
                        <i class="${p.icon}"></i>
                        <div class="project-chip-info">
                            <span class="project-chip-title">${p.name}</span>
                            <span class="project-chip-desc">${p.desc}</span>
                        </div>
                    </div>`).join('');
                const mEl = document.getElementById('modal-metrics');
                if (mEl) mEl.innerHTML = d.metrics.map(m => `
                    <div class="modal-metric-card" style="--modal-accent:${d.accent}">
                        <span class="modal-metric-val">${m.val}</span>
                        <span class="modal-metric-lbl">${m.lbl}</span>
                    </div>`).join('');
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
            }

            function closeModal() {
                if (!modal) return;
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }

            inspectBtns.forEach(btn => btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(btn.getAttribute('data-tech'));
            }));
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (backdrop)  backdrop.addEventListener('click', closeModal);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
            });
        }

        setTimeout(setupPokerDealer, 200);
    })();

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffectsScript);
} else {
    initEffectsScript();
}


