/* ===========================================
   EFFECTS.JS — Fase 5: Efectos Premium de Élite
   =========================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. ACTIVE NAV LINK (Sección activa)
       ========================================= */
    const sections      = document.querySelectorAll('section[id], header[id]');
    const navLinks      = document.querySelectorAll('.nav-links a');

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


    /* =========================================
       2. TILT 3D EN TARJETAS
       ========================================= */
    const TILT_MAX = 12;   // grados máximos de inclinación

    function applyTilt(cards) {
        cards.forEach(card => {
            card.classList.add('tilt-card');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const dx   = (e.clientX - cx) / (rect.width  / 2);   // -1 a 1
                const dy   = (e.clientY - cy) / (rect.height / 2);   // -1 a 1

                const rotY =  dx * TILT_MAX;
                const rotX = -dy * TILT_MAX;

                card.style.setProperty('--rotX', rotX + 'deg');
                card.style.setProperty('--rotY', rotY + 'deg');

                // Posición del destello especular (en %)
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

    // Aplicar a tarjetas de proyectos, servicios, planes y equipo
    applyTilt(document.querySelectorAll('.service-card, .pricing-card-inner, .team-card, .testimonial-card'));

    /* ============================================================
       2.5 UNIFIED SCROLL REVEAL SYSTEM (SUPER ROBUST & HIGH PERFORMANCE)
       ============================================================ */
    (function initUnifiedReveal() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Add clip-reveal class to the targets programmatically
        document.querySelectorAll('.testimonial-card-h-inner, .scope-sim-result, .team-terminal-container').forEach(el => {
            el.classList.add('clip-reveal');
        });

        // Function to reveal a single element based on its type/classes
        function revealElement(el) {
            let revealedAny = false;

            // 1. .hidden -> .show
            if (el.classList.contains('hidden') && !el.classList.contains('show')) {
                el.classList.add('show');
                revealedAny = true;
            }

            // 2. card/component -> .visible
            if ((el.classList.contains('card') || el.classList.contains('service-card') || 
                 el.classList.contains('pricing-card') || el.classList.contains('team-card') || 
                 el.classList.contains('method-step') || el.classList.contains('stat-item')) && 
                !el.classList.contains('visible')) {
                el.classList.add('visible');
                revealedAny = true;
            }

            // 3. pricing-clip-wrapper -> .revealed + children
            if (el.classList.contains('pricing-clip-wrapper') && !el.classList.contains('revealed')) {
                el.classList.add('revealed');
                el.querySelectorAll('.pricing-card').forEach(card => card.classList.add('visible'));
                const slot = el.querySelector('.price-slot');
                if (slot && typeof runSlotMachine === 'function') {
                    setTimeout(() => runSlotMachine(slot), 300);
                }
                revealedAny = true;
            }

            // 4. clip-reveal -> .clip-revealed
            if (el.classList.contains('clip-reveal') && !el.classList.contains('clip-revealed')) {
                el.classList.add('clip-revealed');
                revealedAny = true;
            }

            // 5. reveal-text -> .active
            if (el.classList.contains('reveal-text') && !el.classList.contains('active')) {
                el.classList.add('active');
                revealedAny = true;
            }

            return revealedAny;
        }

        // If reduced motion is preferred, reveal everything immediately and stop
        if (reducedMotion) {
            const allElements = document.querySelectorAll(
                '.hidden, .card, .service-card, .pricing-card, .team-card, .method-step, .stat-item, .pricing-clip-wrapper, .clip-reveal, .reveal-text'
            );
            allElements.forEach(revealElement);
            return;
        }

        // Create the global intersection observer with hyper-sensitive settings
        const globalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    globalObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.01, // trigger when 1% visible
            rootMargin: '120px 50px 120px 50px' // preload before scrolling in from top/bottom
        });

        // Register all targets to the observer
        function registerObserver() {
            const allElements = document.querySelectorAll(
                '.hidden, .card, .service-card, .pricing-card, .team-card, .method-step, .stat-item, .pricing-clip-wrapper, .clip-reveal, .reveal-text'
            );
            allElements.forEach(el => globalObserver.observe(el));
        }
        registerObserver();

        // FALLBACK 1: Check viewport on load immediately after a small delay
        const checkViewportNow = () => {
            const allElements = document.querySelectorAll(
                '.hidden:not(.show), .card:not(.visible), .service-card:not(.visible), .pricing-card:not(.visible), .team-card:not(.visible), .method-step:not(.visible), .stat-item:not(.visible), .pricing-clip-wrapper:not(.revealed), .clip-reveal:not(.clip-revealed), .reveal-text:not(.active)'
            );
            const vpH = window.innerHeight;
            const vpW = window.innerWidth;
            allElements.forEach(el => {
                const r = el.getBoundingClientRect();
                // If it is in the viewport (even partially)
                if (r.top < vpH && r.bottom > 0 && r.left < vpW && r.right > 0) {
                    revealElement(el);
                    globalObserver.unobserve(el);
                }
            });
        };

        setTimeout(checkViewportNow, 250);
        setTimeout(checkViewportNow, 750); // double-check once page settles

        // FALLBACK 2: Check viewport on scroll (debounced/throttled via RAF)
        let revealRaf = false;
        const handleRevealScroll = () => {
            if (!revealRaf) {
                revealRaf = true;
                requestAnimationFrame(() => {
                    checkViewportNow();
                    revealRaf = false;
                });
            }
        };

        window.addEventListener('scroll', handleRevealScroll, { passive: true });
        
        // Expose function globally for manual triggers if needed
        window.triggerManualRevealCheck = checkViewportNow;
    })();


    /* =========================================
       3. CURSOR TRAIL (Estela de partículas)
       ========================================= */
    // Deshabilitado para mejorar rendimiento y evitar lag en scroll (DOM churn / GC pauses)
    /*
    let lastTrail = 0;

    window.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastTrail < 40) return;   // Limitar a ~25 puntos/s
        lastTrail = now;

        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        dot.style.left = e.clientX + 'px';
        dot.style.top  = e.clientY + 'px';

        // Tamaño y opacidad aleatorios para variedad
        const size = Math.random() * 4 + 3;
        dot.style.width  = size + 'px';
        dot.style.height = size + 'px';

        document.body.appendChild(dot);
        // Remover del DOM cuando la animación termine
        dot.addEventListener('animationend', () => dot.remove());
    }, { passive: true });
    */


    /* =========================================
       4. STATS COUNTER ANIMADO
       ========================================= */
    const statEls = document.querySelectorAll('.stat-number, [data-count]');

    function animateCounter(el) {
        // Extraer el número del texto (ej: "50+" → 50)
        const raw    = el.textContent.trim();
        const suffix = raw.replace(/[0-9]/g, '');   // "+ ", "%", etc.
        const target = parseInt(raw.replace(/\D/g, ''), 10);
        if (isNaN(target)) return;

        const duration   = 1800;   // ms
        const startTime  = performance.now();

        function tick(now) {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo para aceleración descendente dramática
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const value = Math.floor(eased * target);

            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target + suffix;
                el.classList.add('count-done');
                setTimeout(() => el.classList.remove('count-done'), 600);
            }
        }

        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    statEls.forEach(el => {
        el.dataset.original = el.textContent;   // Guardar original
        counterObserver.observe(el);
    });


    /* =========================================
       5. ELECTRIC CANVAS — Sección Equipo
       Canvas con rayos eléctricos animados
       ========================================= */
    const elCanvas  = document.getElementById('electric-canvas');

    if (elCanvas) {
        const elCtx     = elCanvas.getContext('2d');
        const teamSection = document.querySelector('.team-section');

        function resizeElCanvas() {
            elCanvas.width  = teamSection.offsetWidth;
            elCanvas.height = teamSection.offsetHeight;
        }
        resizeElCanvas();
        window.addEventListener('resize', resizeElCanvas, { passive: true });

        // ---- Generador de rayos eléctricos fraccionados ----
        function drawBolt(ctx, x1, y1, x2, y2, roughness, depth) {
            if (depth === 0) {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                return;
            }
            const mx  = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
            const my  = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness;
            drawBolt(ctx, x1, y1, mx, my, roughness / 2, depth - 1);
            drawBolt(ctx, mx, my, x2, y2, roughness / 2, depth - 1);

            // Rama secundaria aleatoria
            if (depth === 2 && Math.random() > 0.55) {
                const branchX = mx + (Math.random() - 0.5) * roughness * 1.5;
                const branchY = my + (Math.random() - 0.5) * roughness * 1.5;
                drawBolt(ctx, mx, my, branchX, branchY, roughness / 3, depth - 1);
            }
        }

        // Pool de rayos activos
        const bolts = [];

        function spawnBolt() {
            const w = elCanvas.width;
            const h = elCanvas.height;

            // Orígen aleatorio en los bordes o puntos del grid de fondo
            const x1 = Math.random() * w;
            const y1 = Math.random() * h * 0.3;    // zona superior
            const x2 = x1 + (Math.random() - 0.5) * 200;
            const y2 = y1 + Math.random() * 180 + 60;

            bolts.push({
                x1, y1, x2, y2,
                roughness: 30 + Math.random() * 40,
                alpha: 0.8 + Math.random() * 0.2,
                life: 0,
                maxLife: 12 + Math.floor(Math.random() * 10),   // frames visibles
                width: 0.5 + Math.random() * 1,
                hue:  155 + Math.floor(Math.random() * 20)      // Verde primario ±10
            });
        }

        let elFrame = 0;
        let electricActive = false;
        let electricRafId = null;

        function animateElectric() {
            if (!electricActive) return;
            elFrame++;
            elCtx.clearRect(0, 0, elCanvas.width, elCanvas.height);

            // Generar un nuevo rayo cada ~20 frames (~3/s)
            if (elFrame % 22 === 0) spawnBolt();
            // A veces 2 simultáneos para un pulso doble
            if (elFrame % 55 === 0) spawnBolt();

            // Dibujar rayos activos
            for (let i = bolts.length - 1; i >= 0; i--) {
                const b = bolts[i];
                b.life++;

                // Fade in → sustain → fade out
                let opacity;
                if (b.life < 4) {
                    opacity = b.alpha * (b.life / 4);
                } else if (b.life < b.maxLife - 4) {
                    opacity = b.alpha;
                } else {
                    opacity = b.alpha * ((b.maxLife - b.life) / 4);
                }

                if (opacity <= 0) { bolts.splice(i, 1); continue; }

                elCtx.save();
                elCtx.beginPath();
                elCtx.strokeStyle = `hsla(${b.hue}, 100%, 60%, ${opacity})`;
                elCtx.shadowColor  = `hsla(${b.hue}, 100%, 60%, ${opacity * 0.8})`;
                elCtx.shadowBlur   = 8;
                elCtx.lineWidth    = b.width;
                drawBolt(elCtx, b.x1, b.y1, b.x2, b.y2, b.roughness, 4);
                elCtx.stroke();
                elCtx.restore();

                if (b.life >= b.maxLife) bolts.splice(i, 1);
            }

            electricRafId = requestAnimationFrame(animateElectric);
        }

        // Solo activar cuando la sección es visible (Pausar/Reanudar dinámicamente)
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



    /* =========================================
       6. TEXT SCRAMBLE — Títulos con efecto hacker
       ========================================= */
    const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

    function scrambleText(el) {
        const original = el.dataset.original || el.textContent;
        el.dataset.original = original;
        const len = original.length;
        let iteration = 0;
        const totalFrames = len * 2.5;

        const interval = setInterval(() => {
            el.textContent = original
                .split('')
                .map((char, idx) => {
                    if (char === ' ') return ' ';
                    // A medida que avanza, más letras "se fijan"
                    if (idx < Math.floor(iteration / 2.5)) return char;
                    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                })
                .join('');

            iteration++;
            if (iteration >= totalFrames) {
                clearInterval(interval);
                el.textContent = original;
            }
        }, 35);
    }

    // Aplicar a todos los section-title cuando entran al viewport
    const scrambleTargets = document.querySelectorAll('.section-title, .hero-badge');
    const scrambleObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            setTimeout(() => scrambleText(entry.target), 100);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.7 });

    scrambleTargets.forEach(el => {
        el.dataset.original = el.textContent;
        scrambleObs.observe(el);
    });


    /* =========================================
       7. PARALLAX MULTI-CAPA EN EL HERO (Deshabilitado en favor de script.js)
       ========================================= */
    // Removido para evitar conflictos de sobreescritura de estilos con script.js
    /*
    const heroBlueprintContainer = document.querySelector('.blueprint-container');
    const heroContent            = document.querySelector('.hero-content');
    const hero                   = document.querySelector('.hero');
 
    let parallaxTicking = false;
    let heroH = hero ? hero.offsetHeight : window.innerHeight;

    window.addEventListener('resize', () => {
        if (hero) heroH = hero.offsetHeight;
    }, { passive: true });
  
    function updateParallax() {
        if (!hero) return;
        const scrollY  = window.scrollY || window.pageYOffset;
 
        if (scrollY > heroH) {
            parallaxTicking = false;
            return;
        }
 
        const factor = scrollY / heroH;          // 0 → 1
 
        // Blueprint se mueve más lento (se queda atrás)
        if (heroBlueprintContainer) {
            heroBlueprintContainer.style.transform =
                `translateY(${scrollY * 0.18}px) scale(${1 - factor * 0.06})`;
        }
        // Texto del hero sube más rápido (se adelanta)
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * -0.08}px)`;
        }
 
        parallaxTicking = false;
    }
 
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });
    */


    /* =========================================
       8. PARTICLE BURST AL HACER CLIC
       Explosión de partículas verdes en el punto
       donde el usuario hace clic
       ========================================= */
    function createBurst(x, y) {
        // Reducimos la cantidad de partículas en móvil para mejorar el rendimiento
        const isMobile = window.innerWidth < 768;
        const COUNT  = isMobile ? 6 : 10;
        const colors = ['#11d483', '#2ecc71', '#00ffaa', '#ffffff'];

        for (let i = 0; i < COUNT; i++) {
            const dot = document.createElement('div');
            dot.className = 'burst-dot';
            document.body.appendChild(dot);

            // Dirección y velocidad aleatorias
            const angle  = (Math.PI * 2 / COUNT) * i + Math.random() * 0.5;
            const speed  = 40 + Math.random() * 60;
            const size   = 3 + Math.random() * 5;
            const color  = colors[Math.floor(Math.random() * colors.length)];
            
            // Eliminamos la sombra en móvil para evitar sobrecarga de la GPU (fill-rate)
            const boxShadow = isMobile ? 'none' : `0 0 6px ${color}`;

            dot.style.cssText = `
                position: fixed;
                left: ${x}px; top: ${y}px;
                width: ${size}px; height: ${size}px;
                border-radius: 50%;
                background: ${color};
                box-shadow: ${boxShadow};
                pointer-events: none;
                z-index: 99997;
                transform: translate3d(-50%, -50%, 0);
                will-change: transform, opacity;
                transition: none;
            `;

            // Animación manual con RAF
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            let   ox = 0, oy = 0, opacity = 1;
            let   startTs = null;
            const duration = 500 + Math.random() * 300;

            function animBurst(ts) {
                if (!startTs) startTs = ts;
                const elapsed  = ts - startTs;
                const progress = Math.min(elapsed / duration, 1);

                ox = vx * progress;
                oy = vy * progress + 80 * progress * progress; // Gravedad downward
                opacity = 1 - progress;

                // OPTIMIZACIÓN: usar transform en vez de modificar top/left salva reflows y aumenta muchísimo los fps
                dot.style.transform = `translate3d(calc(-50% + ${ox}px), calc(-50% + ${oy}px), 0)`;
                dot.style.opacity = opacity;

                if (progress < 1) {
                    requestAnimationFrame(animBurst);
                } else {
                    dot.remove();
                }
            }
            requestAnimationFrame(animBurst);
        }
    }

    // Disparar el burst en cada clic (excepto en botones/links para no interferir)
    window.addEventListener('click', (e) => {
        createBurst(e.clientX, e.clientY);
    });


    /* =========================================
       9. MATRIX DATA RAIN EN EL HERO
       Columnas de caracteres hexadecimales
       cayendo a baja opacidad en el hero
       ========================================= */
    const hero = document.querySelector('.hero');
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.id = 'matrix-canvas';
    matrixCanvas.style.cssText = `
        position: absolute;
        inset: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 0; opacity: 0.04;
    `;
    if (hero) hero.appendChild(matrixCanvas);

    const mCtx     = matrixCanvas.getContext('2d');
    const COL_SIZE = 16;
    const CHARS    = '01アイウエオカキクケコABCDEF9438';

    function resizeMatrix() {
        matrixCanvas.width  = matrixCanvas.offsetWidth;
        matrixCanvas.height = matrixCanvas.offsetHeight;
    }
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix, { passive: true });

    const cols    = () => Math.floor(matrixCanvas.width / COL_SIZE);
    const drops   = [];

    function initDrops() {
        const c = cols();
        drops.length = 0;
        for (let i = 0; i < c; i++) {
            drops[i] = Math.floor(Math.random() * -50);   // Start above screen
        }
    }
    initDrops();

    let matrixActive = false;
    let matrixRafId = null;

    function drawMatrix() {
        if (!matrixActive) return;
        // Trail fade
        mCtx.fillStyle = 'rgba(18,18,18,0.05)';
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        mCtx.fillStyle = '#11d483';
        mCtx.font      = `${COL_SIZE}px monospace`;

        const c = cols();
        for (let i = 0; i < c; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const x    = i * COL_SIZE;
            const y    = drops[i] * COL_SIZE;

            mCtx.fillStyle = drops[i] < 3 ? '#ffffff' : '#11d483';
            mCtx.globalAlpha = 0.6 + Math.random() * 0.4;
            mCtx.fillText(char, x, y);
            mCtx.globalAlpha = 1;

            if (y > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        matrixRafId = requestAnimationFrame(drawMatrix);
    }

    // Solo arrancar si el hero es visible (Pausar/Reanudar dinámicamente)
    const heroVisObs = new IntersectionObserver((entries) => {
        const isVisible = entries[0].isIntersecting;
        if (isVisible) {
            if (!matrixActive) {
                matrixActive = true;
                initDrops();
                drawMatrix();
            }
        } else {
            matrixActive = false;
            if (matrixRafId) {
                cancelAnimationFrame(matrixRafId);
                matrixRafId = null;
            }
        }
    }, { threshold: 0.1 });
    if (hero) heroVisObs.observe(hero);


    /* =========================================
       10. TOAST FEEDBACK DEL FORMULARIO
       Notificación elegante en esquina inferior
       ========================================= */
    function showToast(message, type = 'success') {
        // Remover cualquier toast existente
        document.querySelectorAll('.site-toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `site-toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : '!'}</span>
            <span class="toast-msg">${message}</span>
            <div class="toast-bar"></div>
        `;
        document.body.appendChild(toast);

        // Trigger entrance
        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('toast-show'));
        });

        // Auto-dismiss after 3.5s
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // Hookearse al submit del formulario de WhatsApp
    const waForm = document.getElementById('formContactoWa');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            // No cancelamos el evento original (sigue yendo a WhatsApp)
            setTimeout(() => {
                showToast('Abriendo WhatsApp... ¡Te respondemos pronto! 🚀', 'success');
            }, 300);
        });
    }


    /* =========================================
       11. AWWWARDS SCROLLYTELLING — TRAMO FINAL
       ========================================= */

    /* --- 11A. PRICING REVEAL + SLOT MACHINE --- */
    const pricingWrappers = document.querySelectorAll('.pricing-clip-wrapper');
    const priceSlots      = document.querySelectorAll('.price-slot');

    // Slot-machine animation for prices
    function runSlotMachine(el) {
        const target = el.dataset.value;
        const text   = el.dataset.text;
        if (!target && !text) return;

        el.classList.add('spinning');

        if (target) {
            // Numeric scramble
            const val = parseInt(target, 10);
            const steps = 8;
            let step = 0;
            const iv = setInterval(() => {
                const rand = Math.floor(Math.random() * val * 1.5);
                el.textContent = '$' + rand;
                step++;
                if (step >= steps) {
                    clearInterval(iv);
                    el.textContent = '$' + val;
                    el.classList.remove('spinning');
                }
            }, 60);
        } else {
            setTimeout(() => {
                el.textContent = text;
                el.classList.remove('spinning');
            }, 700);
        }
    }




    /* --- 11B. TECH MARQUEE BAND — Velocity-linked speed --- */
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
        let marqueeOffset = 0;
        let marqueeBaseSpeed = 0.55;  // px per frame at rest
        let marqueeCurrSpeed = marqueeBaseSpeed;
        let marqueeAnimId;
        const marqueeHalfWidth = () => marqueeTrack.scrollWidth / 2;

        // Get Lenis instance (exposed on window by script.js if available)
        let lastScrollY = window.scrollY;
        let scrollVel = 0;

        // Integrate with scroll events for velocity
        const velocityListener = () => {
            const currScrollY = window.scrollY;
            scrollVel = Math.abs(currScrollY - lastScrollY);
            lastScrollY = currScrollY;
        };
        window.addEventListener('scroll', velocityListener, { passive: true });

        function animMarquee() {
            // Smoothly blend toward target speed based on velocity
            const targetSpeed = marqueeBaseSpeed + Math.min(scrollVel * 0.18, 4);
            marqueeCurrSpeed += (targetSpeed - marqueeCurrSpeed) * 0.08;
            scrollVel *= 0.92; // decay

            marqueeOffset += marqueeCurrSpeed;
            const half = marqueeHalfWidth();
            if (half > 0 && marqueeOffset >= half) marqueeOffset -= half;

            marqueeTrack.style.transform = `translate3d(-${marqueeOffset}px, 0, 0)`;
            marqueeAnimId = requestAnimationFrame(animMarquee);
        }

        // Pause on hover for natural feel
        marqueeTrack.addEventListener('mouseenter', () => {
            cancelAnimationFrame(marqueeAnimId);
        });
        marqueeTrack.addEventListener('mouseleave', () => {
            animMarquee();
        });

        animMarquee();
    }


    /* --- 11C. TESTIMONIALS HORIZONTAL PINNED SCROLL --- */
    const testimonialsSection = document.querySelector('.testimonials-section');
    const testimonialsTrack   = document.getElementById('testimonialsTrack');
    const testimonialsProgress = document.getElementById('testimonialsProgress');
    const testimonialCards    = document.querySelectorAll('.testimonial-card-h');

    if (testimonialsSection && testimonialsTrack && window.innerWidth >= 768) {
        function updateTestimonialsScroll() {
            const rect     = testimonialsSection.getBoundingClientRect();
            const sectionH = testimonialsSection.offsetHeight;
            const vpH      = window.innerHeight;

            // scrolled into the section
            const scrolled = -rect.top; // 0 at section top, grows as we scroll
            const scrollable = sectionH - vpH; // total scrollable distance within

            if (scrolled < 0 || scrolled > scrollable) return;

            const progress = scrolled / scrollable; // 0 → 1

            // Translate track: move left proportionally
            // Total translation = (numCards - 1) * 100vw
            const totalTranslate = (testimonialCards.length - 1) * window.innerWidth;
            const translateX = progress * totalTranslate;

            testimonialsTrack.style.transform = `translate3d(-${translateX}px, 0, 0)`;

            // Progress bar
            if (testimonialsProgress) {
                testimonialsProgress.style.width = (progress * 100) + '%';
            }

            // Determine which card is "active" (centered)
            const activeIndex = Math.round(progress * (testimonialCards.length - 1));
            testimonialCards.forEach((card, i) => {
                if (i === activeIndex) {
                    card.classList.add('in-view');
                } else {
                    card.classList.remove('in-view');
                }
            });
        }

        // Hook into existing Lenis or fallback to scroll
        if (window.lenis) {
            window.lenis.on('scroll', updateTestimonialsScroll);
        } else {
            window.addEventListener('scroll', updateTestimonialsScroll, { passive: true });
        }

        // Also run once on load
        updateTestimonialsScroll();

        // Activate first card immediately
        if (testimonialCards[0]) testimonialCards[0].classList.add('in-view');
    } else if (window.innerWidth < 768) {
        // Mobile: show all cards immediately
        testimonialCards.forEach(c => c.classList.add('in-view'));
    }


    /* --- 11D. CONTACT SECTION CIRCLE-REVEAL --- */
    const contactSection = document.getElementById('contact');
    const contactReveal  = document.querySelector('.contact-reveal-container');
    if (contactSection && contactReveal) {
        // Clip initially if JS is active (progressive enhancement)
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
                            // Inline fallback scramble if not in scope
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
    }


    /* --- 11E. FOOTER MARQUEE — Pause-on-section-visible + speed variation --- */
    const footerMarqueeSection = document.querySelector('.footer-marquee-section');
    if (footerMarqueeSection) {
        const fmiLeft  = document.querySelector('.fmi-left');
        const fmiRight = document.querySelector('.fmi-right');

        // Add perspective hover effect to letters
        footerMarqueeSection.querySelectorAll('.footer-marquee-inner span:not(.fm-sep)').forEach(span => {
            span.addEventListener('mouseenter', () => {
                span.style.setProperty('--fm-scale', '1.05');
            });
            span.addEventListener('mouseleave', () => {
                span.style.setProperty('--fm-scale', '1');
            });
        });

        // Slow animation when footer comes into view, speed up on scroll
        const footerObs = new IntersectionObserver((entries) => {
            const visible = entries[0].isIntersecting;
            if (fmiLeft && fmiRight) {
                fmiLeft.style.animationPlayState  = visible ? 'running' : 'paused';
                fmiRight.style.animationPlayState = visible ? 'running' : 'paused';
            }
        }, { threshold: 0.1 });
        footerObs.observe(footerMarqueeSection);
    }

    /* ==========================================================================
       AWWWARDS UPGRADE IMPLEMENTATION: MINIMALIST INTERACTION & INMERSION
       ========================================================================== */

    /* --- 1. PRICING PERIOD TOGGLE --- */
    const pricingToggleBtn = document.getElementById('pricingToggleBtn');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const cardInners = document.querySelectorAll('.pricing-card-inner');

    if (pricingToggleBtn) {
        pricingToggleBtn.addEventListener('click', () => {
            const isAnnual = pricingToggleBtn.classList.toggle('annual-active');
            
            toggleLabels.forEach(label => {
                const period = label.getAttribute('data-period');
                if ((period === 'annual' && isAnnual) || (period === 'monthly' && !isAnnual)) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });

            cardInners.forEach(inner => {
                if (isAnnual) {
                    inner.classList.add('flipped');
                } else {
                    inner.classList.remove('flipped');
                }
            });
        });

        // Flip morph cursor hint
        pricingToggleBtn.addEventListener('mouseenter', () => {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.classList.add('flip-hover');
                const cursor2 = document.querySelector('.cursor2');
                if (cursor2) cursor2.style.opacity = '0';
            }
        });
        pricingToggleBtn.addEventListener('mouseleave', () => {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.classList.remove('flip-hover');
                const cursor2 = document.querySelector('.cursor2');
                if (cursor2) cursor2.style.opacity = '1';
            }
        });
    }

    /* --- 2. SCOPE SIMULATOR REACTIVO --- */
    const inputPages = document.getElementById('inputPages');
    const inputAI = document.getElementById('inputAI');
    const checkDB = document.getElementById('checkDB');
    const checkSupport = document.getElementById('checkSupport');

    const valPages = document.getElementById('valPages');
    const valAI = document.getElementById('valAI');
    const suggestedPlan = document.getElementById('suggestedPlan');
    const suggestedDesc = document.getElementById('suggestedDesc');
    const estTime = document.getElementById('estTime');
    const estComplexity = document.getElementById('estComplexity');
    const scopeChecklist = document.getElementById('scopeChecklist');
    const btnSendScopeWa = document.getElementById('btnSendScopeWa');

    function updateSimulator() {
        if (!inputPages || !inputAI || !checkDB || !checkSupport) return;

        const pages = parseInt(inputPages.value, 10);
        const aiLevel = parseInt(inputAI.value, 10);
        const hasDB = checkDB.checked;
        const hasSupport = checkSupport.checked;

        // Update labels
        if (valPages) {
            valPages.textContent = pages === 1 ? '1 página' : `${pages} páginas`;
        }
        if (valAI) {
            const aiTexts = ['Ninguno', 'Básico (Chatbot / API)', 'Avanzado (Agentes Autónomos)'];
            valAI.textContent = aiTexts[aiLevel];
        }

        // Suggested Plan & details logic
        let planName = 'Básico';
        let planDesc = 'Ideal para proyectos sencillos o de aterrizaje rápido y presencia digital.';
        let complexity = 'Baja';
        let duration = '1-2 semanas';
        let checklistItems = [];

        if (aiLevel === 2 || pages > 10) {
            planName = 'Empresarial';
            planDesc = 'Sistemas a gran escala, automatización compleja con IA y alta disponibilidad.';
            complexity = 'Alta';
            duration = '4-6 semanas';
            checklistItems = [
                'Ecosistema web completo a medida',
                'Agentes autónomos de IA integrados',
                'Infraestructura en la nube redundante',
                'Control de seguridad y SLA garantizado'
            ];
        } else if (pages > 5 || hasDB || aiLevel === 1) {
            planName = 'Profesional';
            planDesc = 'Perfecto para negocios que requieren bases de datos, administración y APIs.';
            complexity = 'Media';
            duration = '2-3 semanas';
            checklistItems = [
                'Sitio web multi-página autoadministrable',
                'Base de datos segura + Panel admin',
                'Integración de APIs externas',
                'Optimización SEO y rendimiento'
            ];
        } else {
            // Plan Básico
            checklistItems = [
                'Landing page profesional premium',
                'Diseño ultra-responsive (móvil & desktop)',
                'Formulario de contacto a WhatsApp',
                'Despliegue y hosting inicial configurado'
            ];
        }

        if (hasSupport) {
            checklistItems.push('Soporte mensual post-entrega activo');
        }

        // Render suggest values
        if (suggestedPlan) {
            suggestedPlan.textContent = 'Plan ' + planName;
            // Se acuerdan precios según pedido y de común acuerdo
            if (planName === 'Básico') {
                suggestedPlan.innerHTML = 'Plan Básico <span style="font-size:0.9rem; color:var(--text-muted); font-weight:normal;">(Precios acordados según pedido)</span>';
            } else if (planName === 'Profesional') {
                suggestedPlan.innerHTML = 'Plan Profesional <span style="font-size:0.9rem; color:var(--text-muted); font-weight:normal;">(Precios acordados según pedido)</span>';
            } else {
                suggestedPlan.innerHTML = 'Plan Empresarial <span style="font-size:0.9rem; color:var(--text-muted); font-weight:normal;">(Precios acordados según pedido)</span>';
            }
        }
        if (suggestedDesc) suggestedDesc.textContent = planDesc;
        if (estTime) estTime.textContent = duration;
        if (estComplexity) estComplexity.textContent = complexity;

        if (scopeChecklist) {
            scopeChecklist.innerHTML = checklistItems.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('');
        }

        // Generate WA Link
        if (btnSendScopeWa) {
            const aiLevelsText = ['Sin IA', 'IA Básica (Chatbot)', 'IA Avanzada (Agentes)'];
            const dbText = hasDB ? 'Sí' : 'No';
            const supportText = hasSupport ? 'Sí' : 'No';
            
            const message = `Hola VANTA, he simulado un alcance personalizado en su sitio web:
- Páginas/Vistas: ${pages}
- Nivel de IA: ${aiLevelsText[aiLevel]}
- Base de Datos + Panel Admin: ${dbText}
- Soporte Post-Entrega: ${supportText}

Plan Sugerido: Plan ${planName} (Precio a convenir)
Complejidad: ${complexity}
Tiempo Estimado: ${duration}

Me gustaría recibir una cotización formal y hablar sobre los detalles de mi proyecto.`;

            const encodedMessage = encodeURIComponent(message);
            btnSendScopeWa.href = `https://wa.me/584127121162?text=${encodedMessage}`;
        }
    }

    if (inputPages) {
        inputPages.addEventListener('input', updateSimulator);
        inputAI.addEventListener('input', updateSimulator);
        checkDB.addEventListener('change', updateSimulator);
        checkSupport.addEventListener('change', updateSimulator);
        
        updateSimulator();
    }

    /* --- 3. TEAM TERMINAL PANEL DIAGNOSTICS --- */
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
        }, 15);
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

    /* --- 4. SCROLL-LINKED TEXT REVEAL (WORD-BY-WORD WITH TYPOGRAPHY REVEAL MASKS) --- */
    const revealWords = [];
    document.querySelectorAll('.section-title').forEach(title => {
        const words = title.querySelectorAll('.reveal-word');
        if (words.length > 0) {
            // Programmatically wrap each reveal-word in a reveal-word-wrapper with overflow:hidden
            words.forEach(word => {
                if (word.parentNode.classList.contains('reveal-word-wrapper')) return;
                
                const wrapper = document.createElement('span');
                wrapper.className = 'reveal-word-wrapper';
                wrapper.style.display = 'inline-block';
                wrapper.style.overflow = 'hidden';
                wrapper.style.verticalAlign = 'bottom';
                
                word.parentNode.insertBefore(wrapper, word);
                wrapper.appendChild(word);
            });
            
            revealWords.push({
                title: title,
                words: Array.from(words)
            });
        }
    });

    function updateTextReveal() {
        const vpH = window.innerHeight;
        revealWords.forEach(group => {
            const rect = group.title.getBoundingClientRect();
            const start = vpH * 0.95;
            const end = vpH * 0.45;
            
            let progress = 0;
            if (rect.top <= start) {
                progress = (start - rect.top) / (start - end);
                progress = Math.max(0, Math.min(1, progress));
            }
            
            const totalWords = group.words.length;
            group.words.forEach((word, index) => {
                const wordStart = index / totalWords;
                const wordEnd = (index + 1) / totalWords;
                
                let wordProgress = (progress - wordStart) / (wordEnd - wordStart);
                wordProgress = Math.max(0, Math.min(1, wordProgress));
                
                if (wordProgress >= 0.85) {
                    word.classList.add('revealed');
                } else {
                    word.classList.remove('revealed');
                }
                
                // Opacity slide up mask reveal
                const opacity = 0.15 + (0.85 * wordProgress);
                const translateY = (1 - wordProgress) * 100; // translate from 100% to 0%
                
                word.style.opacity = opacity;
                word.style.transform = `translate3d(0, ${translateY}%, 0)`;
                word.style.transition = 'none'; // Bind directly to scroll
            });
        });
    }

    /* --- 5. PROJECT PARALLAX HORIZONTAL CARDS --- */
    const pCards = document.querySelectorAll('.horizontal-track .card');
    
    function updateProjectParallax() {
        pCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const screenCenter = window.innerWidth / 2;
            const offset = (center - screenCenter) / (window.innerWidth / 2 + rect.width / 2);
            const clampedOffset = Math.max(-1, Math.min(1, offset));
            
            const parallaxX = clampedOffset * -45;
            card.style.setProperty('--parallax-x', `${parallaxX}px`);
        });
    }

    /* --- 6. SCROLL WARP PHYSICS ON BG PARTICLES --- */
    let lastScrollY = window.scrollY;
    let targetWarp = 0;
    let currentWarp = 0;

    window.addEventListener('scroll', () => {
        const currScrollY = window.scrollY;
        const diff = currScrollY - lastScrollY;
        lastScrollY = currScrollY;
        
        targetWarp = diff * 0.12;
    }, { passive: true });

    function updateWarpInertia() {
        currentWarp += (targetWarp - currentWarp) * 0.08;
        targetWarp *= 0.92;
        
        window.bgParticleScrollWarp = currentWarp;
        requestAnimationFrame(updateWarpInertia);
    }
    updateWarpInertia();

    /* --- 7. CARD-STACKING SECTION REVEAL & PARALLAX COLUMNS --- */
    const stackSections = [
        document.querySelector('.hero'),
        document.querySelector('.portfolio-scroll-container'),
        document.querySelector('.services-scroll-container'),
        document.querySelector('.team-section'),
        document.querySelector('.pricing-section'),
        document.querySelector('.testimonials-section'),
        document.querySelector('.contact-section')
    ].filter(Boolean);

    const sLeft = document.querySelector('.services-left');
    const sRight = document.querySelector('.services-right');
    const servicesSec = document.querySelector('.services-scroll-container');

    function handleCardStackingAndParallax(scrollY) {
        const vpH = window.innerHeight;

        // B. Services Column Parallax only (card-stacking removed — caused permanent section accumulation)
        if (servicesSec && sLeft && sRight && window.innerWidth >= 992) {
            const rect = servicesSec.getBoundingClientRect();
            const top = scrollY + rect.top; // absolute scroll offset of the section
            const startOffset = scrollY - top;
            const maxScroll = servicesSec.offsetHeight - vpH;
            
            let progress = startOffset / maxScroll;
            progress = Math.max(0, Math.min(1, progress));
            
            const leftVal = 12 - (progress * 24); // 12vh to -12vh
            const rightVal = -12 + (progress * 24); // -12vh to 12vh
            
            sLeft.style.transform = `translate3d(0, ${leftVal}vh, 0)`;
            sRight.style.transform = `translate3d(0, ${rightVal}vh, 0)`;
        } else {
            if (sLeft) sLeft.style.transform = '';
            if (sRight) sRight.style.transform = '';
        }
    }

    /* --- 8. HUD SIDEBAR NAVIGATOR SCROLL TRACKING --- */
    const hudSidebar = document.querySelector('.hud-sidebar');
    const hudDots = document.querySelectorAll('.hud-dots li');
    const hudSectionNum = document.querySelector('.hud-section-num');
    const hudSectionName = document.querySelector('.hud-section-name');
    const hudProgressFill = document.querySelector('.hud-progress-fill');

    const trackerSections = [
        { id: 'home', num: '01', name: 'INICIO', el: document.querySelector('.hero') },
        { id: 'portfolio', num: '02', name: 'TRABAJO', el: document.querySelector('.portfolio-scroll-container') },
        { id: 'services', num: '03', name: 'SERVICIOS', el: document.querySelector('.services-scroll-container') },
        { id: 'pricing', num: '04', name: 'PLANES', el: document.querySelector('.pricing-section') },
        { id: 'team', num: '05', name: 'EQUIPO', el: document.querySelector('.team-section') },
        { id: 'contact', num: '06', name: 'CONTACTO', el: document.querySelector('.contact-section') }
    ].filter(item => item.el);

    function updateHudTracker(scrollY) {
        if (!hudSidebar || window.innerWidth < 992) return;

        const vpH = window.innerHeight;
        let activeIdx = 0;

        // Find current section
        trackerSections.forEach((sec, idx) => {
            const rect = sec.el.getBoundingClientRect();
            if (rect.top <= vpH * 0.5 && rect.bottom >= vpH * 0.5) {
                activeIdx = idx;
            }
        });

        const activeSec = trackerSections[activeIdx];
        if (activeSec) {
            // Update Text indicators
            if (hudSectionNum) hudSectionNum.textContent = `[ ${activeSec.num} ]`;
            if (hudSectionName) hudSectionName.textContent = activeSec.name;

            // Highlight corresponding dot
            hudDots.forEach((dot, idx) => {
                if (idx === activeIdx) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Calculate progress in current section
            const rect = activeSec.el.getBoundingClientRect();
            const totalScrollableHeight = rect.height;
            const scrolledHeight = Math.max(0, -rect.top);
            let progress = scrolledHeight / (totalScrollableHeight - vpH);
            if (totalScrollableHeight <= vpH) {
                progress = Math.max(0, Math.min(1, (vpH - rect.top) / vpH));
            }
            progress = Math.max(0, Math.min(1, progress));

            if (hudProgressFill) {
                hudProgressFill.style.height = (progress * 100) + '%';
            }
        }
    }

    // Connect dots clicks to smooth scroll
    hudDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const targetId = dot.getAttribute('data-target');
            const targetSec = document.getElementById(targetId);
            if (targetSec) {
                if (window.lenis) {
                    window.lenis.scrollTo(targetSec);
                } else {
                    targetSec.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Hook scroll listeners to Lenis if active, otherwise window scroll
    const globalScrollHandler = () => {
        const scrollY = window.scrollY;
        updateTextReveal();
        updateProjectParallax();
        handleCardStackingAndParallax(scrollY);
        updateHudTracker(scrollY);
    };

    if (window.lenis) {
        window.lenis.on('scroll', globalScrollHandler);
    } else {
        window.addEventListener('scroll', globalScrollHandler, { passive: true });
    }

    // Initial triggers
    globalScrollHandler();

    // ============================================================
    // AWWWARDS SCROLLYTELLING PACK — 4 EFECTOS INMERSIVOS PREMIUM
    // ============================================================

    /* ─────────────────────────────────────────────────────────────
       EFECTO 1: KINETIC WORD REVEAL
       Cada título se divide en palabras; cada una emerge de abajo
       con un delay escalonado al entrar al viewport.
    ───────────────────────────────────────────────────────────── */
    (function initKineticWordReveal() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // NOTA: Los .section-title con .reveal-word ya tienen su propio sistema de reveal.
        // El KWR solo procesa: títulos hero, h2 de servicios, h3 de metodología.
        const kwrTargets = Array.from(document.querySelectorAll(
            '.hero-title-main, .service-text-item h2, .method-body h3, .pricing-name'
        )).filter(el => {
            // Excluir si ya tiene reveal-words (sistema existente)
            if (el.querySelector('.reveal-word')) return false;
            // Excluir si ya fue procesado
            if (el.dataset.kwrDone) return false;
            return true;
        });

        function wrapWords(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const parts = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                parts.forEach(part => {
                    if (/^\s*$/.test(part)) {
                        frag.appendChild(document.createTextNode(part));
                    } else {
                        const mask = document.createElement('span');
                        mask.className = 'kwr-word-mask';
                        const word = document.createElement('span');
                        word.className = 'kwr-word';
                        if (reducedMotion) word.classList.add('kwr-revealed');
                        word.textContent = part;
                        mask.appendChild(word);
                        frag.appendChild(mask);
                    }
                });
                return frag;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                Array.from(node.childNodes).forEach(child => clone.appendChild(wrapWords(child)));
                return clone;
            }
            return node.cloneNode(true);
        }

        kwrTargets.forEach(el => {
            if (el.dataset.kwrDone) return;
            el.dataset.kwrDone = '1';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = el.innerHTML;
            el.innerHTML = '';
            Array.from(tempDiv.childNodes).forEach(child => el.appendChild(wrapWords(child)));
        });

        const kwrObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const words = entry.target.querySelectorAll('.kwr-word');
                words.forEach((w, i) => setTimeout(() => w.classList.add('kwr-revealed'), i * 60));
                kwrObs.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

        kwrTargets.forEach(el => kwrObs.observe(el));
    })();


    /* ─────────────────────────────────────────────────────────────
       EFECTO 2: HERO PARALLAX MULTI-CAPA
       BG (matrix/canvas): 55% velocidad
       MID (crosshairs/HUD): 28% + lateral
       FG (contenido hero): -6% (sube = profundidad)
    ───────────────────────────────────────────────────────────── */
    (function initHeroParallax() {
        const heroEl = document.querySelector('.hero');
        if (!heroEl) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const bgLayers  = [document.getElementById('matrix-canvas')].filter(Boolean);
        const midLayers = [
            heroEl.querySelector('.decor-top-left'),
            heroEl.querySelector('.decor-top-right'),
            heroEl.querySelector('.decor-bottom-left'),
            heroEl.querySelector('.decor-bottom-right'),
            heroEl.querySelector('.hud-bottom-left'),
            heroEl.querySelector('.hud-bottom-right'),
        ].filter(Boolean);
        const fgLayer = heroEl.querySelector('.hero-center-layout');

        const heroH = heroEl.offsetHeight;
        let pxRaf = false;

        function applyParallax() {
            const sy = window.scrollY;
            if (sy > heroH * 1.3) { pxRaf = false; return; }
            const ratio = Math.min(sy / heroH, 1);

            bgLayers.forEach(el => {
                el.style.transform = `translate3d(0, ${sy * 0.55}px, 0)`;
            });
            midLayers.forEach((el, i) => {
                const side = i % 2 === 0 ? -1 : 1;
                el.style.transform = `translate3d(${ratio * side * 20}px, ${sy * 0.28}px, 0)`;
            });
            if (fgLayer) {
                fgLayer.style.transform = `translate3d(0, ${sy * -0.06}px, 0)`;
            }
            pxRaf = false;
        }

        window.addEventListener('scroll', () => {
            if (!pxRaf) { pxRaf = true; requestAnimationFrame(applyParallax); }
        }, { passive: true });
        applyParallax();
    })();


    /* ─────────────────────────────────────────────────────────────
       EFECTO 4: HERO HORIZONTAL SCROLL SCRUB
       El split-left y split-right del hero se separan
       cinematográficamente mientras el usuario scrollea.
    ───────────────────────────────────────────────────────────── */
    (function initHeroScrub() {
        const heroEl = document.querySelector('.hero');
        if (!heroEl) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.innerWidth < 768) return;

        const scrubLeft  = heroEl.querySelector('.hero-split-left');
        const scrubRight = heroEl.querySelector('.hero-split-right');
        const scrubTitle = heroEl.querySelector('.hero-title-group');
        const scrollInd  = heroEl.querySelector('.hero-scroll-indicator');
        const heroH = heroEl.offsetHeight;
        let sRaf = false;

        function updateScrub() {
            const sy = window.scrollY;
            if (sy > heroH) { sRaf = false; return; }
            const p = Math.min(sy / heroH, 1);
            const e = 1 - Math.pow(1 - p, 2); // ease-out cuadrático

            if (scrubLeft)  { scrubLeft.style.transform  = `translate3d(${e * -90}px, 0, 0)`; scrubLeft.style.opacity  = Math.max(0, 1 - e * 2); }
            if (scrubRight) { scrubRight.style.transform = `translate3d(${e * 90}px, 0, 0)`;  scrubRight.style.opacity = Math.max(0, 1 - e * 2); }
            if (scrubTitle) { scrubTitle.style.transform = `translate3d(${e * -25}px, 0, 0)`; }
            if (scrollInd)  { scrollInd.style.opacity    = Math.max(0, 1 - p * 5); }
            sRaf = false;
        }

        window.addEventListener('scroll', () => {
            if (!sRaf) { sRaf = true; requestAnimationFrame(updateScrub); }
        }, { passive: true });
        updateScrub();
    })();

}); // ← Fin del DOMContentLoaded
