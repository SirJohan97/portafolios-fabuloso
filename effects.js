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
    applyTilt(document.querySelectorAll('.service-card, .pricing-card, .team-card, .testimonial-card'));

    /* =========================================
       2.5 SCROLL REVEAL (Animaciones de Entrada)
       ========================================= */
    const revealElements = document.querySelectorAll('.card, .service-card, .pricing-card, .team-card, .method-step, .stat-item');
    
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));


    /* =========================================
       3. CURSOR TRAIL (Estela de partículas)
       ========================================= */
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
        function animateElectric() {
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

            requestAnimationFrame(animateElectric);
        }

        // Solo activar cuando la sección es visible
        const teamVisObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) animateElectric();
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
       7. PARALLAX MULTI-CAPA EN EL HERO
       El blueprint y el texto se mueven a
       velocidades distintas al hacer scroll
       ========================================= */
    const heroBlueprintContainer = document.querySelector('.blueprint-container');
    const heroContent            = document.querySelector('.hero-content');
    const hero                   = document.querySelector('.hero');

    let parallaxTicking = false;

    function updateParallax() {
        if (!hero) return;
        const scrollY  = window.scrollY;
        const heroH    = hero.offsetHeight;

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

    function drawMatrix() {
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

        requestAnimationFrame(drawMatrix);
    }

    // Solo arrancar si el hero es visible
    const heroVisObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            initDrops();
            drawMatrix();
            heroVisObs.disconnect();
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

});
