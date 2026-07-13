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

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const dx   = (e.clientX - cx) / (rect.width  / 2);
                const dy   = (e.clientY - cy) / (rect.height / 2);

                const rotY =  dx * TILT_MAX;
                const rotX = -dy * TILT_MAX;

                card.style.setProperty('--rotX', rotX + 'deg');
                card.style.setProperty('--rotY', rotY + 'deg');

                const mx = ((e.clientX - rect.left) / rect.width)  * 100;
                const my = ((e.clientY - rect.top)  / rect.height) * 100;
                card.style.setProperty('--mx', mx + '%');
                card.style.setProperty('--my', my + '%');

                card.classList.remove('tilt-reset');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.add('tilt-reset');
                card.style.setProperty('--rotX', '0deg');
                card.style.setProperty('--rotY', '0deg');
            });
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
       4. MAGNETIC CURSOR & CURSOR MORPH (Throttled & Consolidated)
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

        // Elementos interactivos para morphing
        document.querySelectorAll('.card, .testimonial-card-h').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.classList.add('cursor--view'); label.textContent = 'VER'; });
            el.addEventListener('mouseleave', () => { cursor.classList.remove('cursor--view'); label.textContent = ''; });
        });

        document.querySelectorAll('.btn, .btn-outline, .magnetic-btn, .wa-orbital-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor--click'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--click'));
        });

        // Magnetismo en botones (Throttled con bandera para evitar saturacion de CPU)
        const magneticEls = document.querySelectorAll(
            '.btn, .btn-outline, .magnetic-btn, .wa-orbital-btn, .nav-links a, .logo, .footer-social a'
        );

        const STRENGTH = 0.38;
        const RADIUS = 80;
        let activeElement = null;
        let clientX = 0;
        let clientY = 0;

        // Guardar coordenadas de raton de forma pasiva
        document.addEventListener('mousemove', (e) => {
            clientX = e.clientX;
            clientY = e.clientY;
        }, { passive: true });

        // Ticker de GSAP para actualizar posiciones a 60fps (evitando miles de repaints en mousemove)
        gsap.ticker.add(() => {
            if (!activeElement) return;

            const rect = activeElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;
            const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (dist < RADIUS) {
                const pull = 1 - dist / RADIUS;
                const moveX = deltaX * STRENGTH * pull;
                const moveY = deltaY * STRENGTH * pull;

                activeElement.style.transition = 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)';
                activeElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
                
                const inner = activeElement.querySelector('span, i');
                if (inner) {
                    inner.style.transition = 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)';
                    inner.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
                }
            } else {
                snapBack(activeElement);
                activeElement = null;
            }
        });

        // Eventos Hover para activar/desactivar el magnetismo de forma selectiva
        magneticEls.forEach(el => {
            el.addEventListener('mouseenter', () => { activeElement = el; });
            el.addEventListener('mouseleave', () => {
                if (activeElement === el) {
                    snapBack(el);
                    activeElement = null;
                }
            });
        });

        function snapBack(el) {
            el.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
            el.style.transform = 'translate(0px, 0px)';
            const inner = el.querySelector('span, i');
            if (inner) {
                inner.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
                inner.style.transform = 'translate(0px, 0px)';
            }
        }
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

    const scrambleTargets = document.querySelectorAll('.section-title, .hero-badge');
    const scrambleObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const words = el.querySelectorAll('.reveal-word');
            const text = words.length > 0 ? Array.from(words).map(w => w.textContent).join(' ') : el.textContent.trim();
            el.dataset.scrambleOriginal = text;
            setTimeout(() => scrambleText(el), 500);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    scrambleTargets.forEach(el => scrambleObs.observe(el));

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

                    // Alimentar el canvas 3D global
                    if (window.vanta3D) {
                        window.vanta3D.progress = self.progress;
                        if (self.progress < 0.35) {
                            const norm = self.progress / 0.35;
                            window.vanta3D.glitch = Math.sin(norm * Math.PI) * 0.95;
                        } else {
                            window.vanta3D.glitch = 0;
                        }
                    }

                    if (statusText && led) {
                        if (self.progress < 0.35) {
                            statusText.textContent = 'SYSTEM_STATUS: ERROR_CAOS';
                            statusText.style.color = '#e74c3c';
                            led.style.background = '#e74c3c';
                            led.style.boxShadow = '0 0 8px #e74c3c';
                        } else if (self.progress < 0.7) {
                            statusText.textContent = 'SYSTEM_STATUS: OPTIMIZING_GRID';
                            statusText.style.color = '#f1c40f';
                            led.style.background = '#f1c40f';
                            led.style.boxShadow = '0 0 8px #f1c40f';
                        } else {
                            statusText.textContent = 'SYSTEM_STATUS: ACTIVE_ECOSYSTEM';
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
       12. PROJECT CARD MORPHING TRANSITION
       ============================================================ */
    (function initModalMorphing() {
        const cards = document.querySelectorAll('.card');
        const modalOverlay = document.getElementById('projectModalOverlay');
        const modal = document.getElementById('projectModal');
        if (!modalOverlay || !modal) return;

        cards.forEach(card => {
            const btn = card.querySelector('.info-btn');
            if (!btn) return;

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const projectId = card.getAttribute('data-project');
                const rect = card.getBoundingClientRect();

                const clone = document.createElement('div');
                clone.className = 'morph-transition-helper';
                clone.style.top = `${rect.top}px`;
                clone.style.left = `${rect.left}px`;
                clone.style.width = `${rect.width}px`;
                clone.style.height = `${rect.height}px`;
                document.body.appendChild(clone);

                // Detener scroll suave Lenis global
                if (window.lenis) window.lenis.stop();

                const tl = gsap.timeline({
                    onComplete: () => {
                        if (typeof window.openProjectModal === 'function') {
                            window.openProjectModal(projectId);
                        } else {
                            modalOverlay.classList.add('active');
                            modal.classList.add('active');
                        }

                        gsap.to(clone, {
                            opacity: 0,
                            duration: 0.45,
                            onComplete: () => {
                                clone.remove();
                                if (window.lenis) window.lenis.start();
                            }
                        });
                    }
                });

                tl.to(clone, {
                    top: 0, left: 0, width: '100vw', height: '100vh',
                    borderRadius: 0,
                    background: 'rgba(17, 212, 131, 0.12)',
                    borderColor: 'rgba(17, 212, 131, 0.8)',
                    duration: 0.65,
                    ease: 'power4.inOut'
                });
            });
        });
    })();

    /* ============================================================
       13. TESTIMONIALS HORIZONTAL PINNED SCROLL
       ============================================================ */
    (function initTestimonialsHorizontalScroll() {
        const testimonialsSection = document.querySelector('.testimonials-section');
        const testimonialsTrack   = document.getElementById('testimonialsTrack');
        const testimonialsProgress = document.getElementById('testimonialsProgress');
        const testimonialCards    = document.querySelectorAll('.testimonial-card-h');
        
        if (testimonialsSection && testimonialsTrack && window.innerWidth >= 768) {
            function updateTestimonialsScroll() {
                const rect     = testimonialsSection.getBoundingClientRect();
                const sectionH = testimonialsSection.offsetHeight;
                const vpH      = window.innerHeight;

                const scrolled = -rect.top; 
                const scrollable = sectionH - vpH; 

                // Forzar límites de 0 a 1 para evitar congelamientos antes/después del tramo
                let progress = scrolled / scrollable; 
                progress = Math.max(0, Math.min(1, progress));

                const totalTranslate = (testimonialCards.length - 1) * window.innerWidth;
                const translateX = progress * totalTranslate;

                testimonialsTrack.style.transform = `translate3d(-${translateX}px, 0, 0)`;

                if (testimonialsProgress) {
                    testimonialsProgress.style.width = (progress * 100) + '%';
                }

                const activeIndex = Math.round(progress * (testimonialCards.length - 1));
                testimonialCards.forEach((card, i) => {
                    if (i === activeIndex) {
                        card.classList.add('in-view');
                    } else {
                        card.classList.remove('in-view');
                    }
                });
            }

            // Escuchar tanto scroll de ventana nativo (Lenis actualiza las coordenadas nativas) para compatibilidad
            window.addEventListener('scroll', updateTestimonialsScroll, { passive: true });
            if (window.lenis) {
                window.lenis.on('scroll', updateTestimonialsScroll);
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

                    // Scramble the headline title
                    const headline = document.getElementById('contactHeadline');
                    if (headline) {
                        setTimeout(() => {
                            if (typeof scrambleText === 'function') scrambleText(headline);
                            else {
                                const orig = headline.textContent;
                                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
                                let iter = 0;
                                const total = orig.length * 2.5;
                                const iv = setInterval(() => {
                                    headline.textContent = orig.split('').map((c, i) => {
                                        if (c === ' ') return ' ';
                                        if (i < Math.floor(iter / 2.5)) return c;
                                        return chars[Math.floor(Math.random() * chars.length)];
                                    }).join('');
                                    iter++;
                                    if (iter >= total) { clearInterval(iv); headline.textContent = orig; }
                                }, 35);
                            }
                        }, 500);
                    }

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
        const terminalBody = document.getElementById('teamTerminalBody');
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
       14. BUS DE DATOS SVG (Scroll-Drawing Fiber Path)
       ============================================================ */
    (function initVantaFiberPath() {
        const path = document.getElementById('vanta-fiber-path');
        const pointer = document.getElementById('vanta-hud-pointer');
        const svg = document.getElementById('vanta-fiber-svg');
        if (!path || !pointer || !svg) return;

        const pathLength = path.getTotalLength();
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.set(path, { strokeDashoffset: pathLength * (1 - progress) });

                const point = path.getPointAtLength(progress * pathLength);
                const svgRect = svg.getBoundingClientRect();
                const globalX = svgRect.left + (point.x / 100) * svgRect.width;
                const globalY = window.scrollY + svgRect.top + (point.y / 1000) * svgRect.height;

                gsap.set(pointer, {
                    x: globalX,
                    y: globalY,
                    opacity: progress > 0.005 && progress < 0.995 ? 1 : 0
                });
            }
        });
    })();

    /* ============================================================
       13. TESTIMONIALS HORIZONTAL PINNED SCROLL
       ============================================================ */
    (function initTestimonialsHorizontalScroll() {
        const testimonialsSection = document.querySelector('.testimonials-section');
        const testimonialsTrack   = document.getElementById('testimonialsTrack');
        const testimonialsProgress = document.getElementById('testimonialsProgress');
        const testimonialCards    = document.querySelectorAll('.testimonial-card-h');
        
        if (testimonialsSection && testimonialsTrack && window.innerWidth >= 768) {
            function updateTestimonialsScroll() {
                const rect     = testimonialsSection.getBoundingClientRect();
                const sectionH = testimonialsSection.offsetHeight;
                const vpH      = window.innerHeight;

                const scrolled = -rect.top; 
                const scrollable = sectionH - vpH; 

                // Forzar límites de 0 a 1 para evitar congelamientos antes/después del tramo
                let progress = scrolled / scrollable; 
                progress = Math.max(0, Math.min(1, progress));

                const totalTranslate = (testimonialCards.length - 1) * window.innerWidth;
                const translateX = progress * totalTranslate;

                testimonialsTrack.style.transform = `translate3d(-${translateX}px, 0, 0)`;

                if (testimonialsProgress) {
                    testimonialsProgress.style.width = (progress * 100) + '%';
                }

                const activeIndex = Math.round(progress * (testimonialCards.length - 1));
                testimonialCards.forEach((card, i) => {
                    if (i === activeIndex) {
                        card.classList.add('in-view');
                    } else {
                        card.classList.remove('in-view');
                    }
                });
            }

            // Escuchar tanto scroll de ventana nativo (Lenis actualiza las coordenadas nativas) para compatibilidad
            window.addEventListener('scroll', updateTestimonialsScroll, { passive: true });
            if (window.lenis) {
                window.lenis.on('scroll', updateTestimonialsScroll);
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

                    // Scramble the headline title
                    const headline = document.getElementById('contactHeadline');
                    if (headline) {
                        setTimeout(() => {
                            if (typeof scrambleText === 'function') scrambleText(headline);
                            else {
                                const orig = headline.textContent;
                                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
                                let iter = 0;
                                const total = orig.length * 2.5;
                                const iv = setInterval(() => {
                                    headline.textContent = orig.split('').map((c, i) => {
                                        if (c === ' ') return ' ' ;
                                        if (i < Math.floor(iter / 2.5)) return c;
                                        return chars[Math.floor(Math.random() * chars.length)];
                                    }).join('');
                                    iter++;
                                    if (iter >= total) { clearInterval(iv); headline.textContent = orig; }
                                }, 35);
                            }
                        }, 500);
                    }

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
            } else {
                window.bgParticleScrollWarp = currentWarp;
            }

            requestAnimationFrame(updateWarpLoop);
        }

        // Lanzar loop de render
        requestAnimationFrame(updateWarpLoop);

        // Integración directa con Lenis si está activo
        setTimeout(() => {
            if (window.lenis) {
                window.lenis.on('scroll', (e) => {
                    const target = e.velocity * 0.04;
                    currentWarp += (target - currentWarp) * 0.12;
                    window.bgParticleScrollWarp = currentWarp;
                });
            }
        }, 500);
    })();


    /* ============================================================
       16. FILM GRAIN CANVAS — Versión ultraligera (tiny canvas + CSS scale)
       ============================================================ */
    (function initFilmGrain() {
        const canvas = document.getElementById('film-grain-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        // Draw on tiny canvas - browsers handle the scaling for free
        const GRAIN_RES = 128;
        canvas.width  = GRAIN_RES;
        canvas.height = GRAIN_RES;
        // CSS scales it up to full screen
        canvas.style.width  = '100%';
        canvas.style.height = '100%';
        canvas.style.imageRendering = 'pixelated';

        const imageData = ctx.createImageData(GRAIN_RES, GRAIN_RES);
        const data = imageData.data;

        let lastDraw = 0;
        function loop(ts) {
            if (ts - lastDraw > 100) { // only 10fps - imperceptible but grain-like
                for (let i = 0; i < data.length; i += 4) {
                    const v = Math.random() * 255 | 0;
                    data[i] = data[i+1] = data[i+2] = v;
                    data[i+3] = 255;
                }
                ctx.putImageData(imageData, 0, 0);
                lastDraw = ts;
            }
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
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

        // Section headings: trigger via IntersectionObserver
        document.querySelectorAll('.section-title, .bento-title, .stats-headline').forEach(heading => {
            if (!heading.classList.contains('split-target')) {
                splitAndAnimate(heading, 0);
            }
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => revealSplitWords(entry.target), 100);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            obs.observe(heading);
        });
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

        // Show/hide counter based on portfolio section visibility
        const sectionObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                counter.classList.toggle('visible', entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        sectionObs.observe(portfolioSection);

        // Read horizontal scroll progress via GSAP ScrollTrigger
        // Poll horizontal track scroll offset
        function getActiveCard() {
            const track = document.querySelector('.horizontal-track');
            if (!track) return 0;
            const trackRect = track.getBoundingClientRect();
            const cardWidth = cards[0].offsetWidth + 32; // including gap
            const scrolled = -trackRect.left;
            const index = Math.round(scrolled / cardWidth);
            return Math.max(0, Math.min(cards.length - 1, index));
        }

        let lastIndex = -1;
        function updateCounter() {
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
            requestAnimationFrame(updateCounter);
        }
        requestAnimationFrame(updateCounter);
    })();

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffectsScript);
} else {
    initEffectsScript();
}

