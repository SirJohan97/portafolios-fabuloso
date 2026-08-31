/* =========================================
   0. CINEMATIC PRELOADER
   ========================================= */
(function() {
    const _preloader = document.getElementById('preloader');
    if (!_preloader) return;

    /* --- Canvas de partículas flotantes fondo --- */
    const plCanvas = document.getElementById('preloader-canvas');
    const plCtx    = plCanvas ? plCanvas.getContext('2d') : null;
    let plParticles = [];
    let plRafId;

    function initPlCanvas() {
        if (!plCtx) return;
        plCanvas.width  = window.innerWidth;
        plCanvas.height = window.innerHeight;

        // Generar 60 partículas flotantes
        plParticles = Array.from({ length: 60 }, () => ({
            x: Math.random() * plCanvas.width,
            y: Math.random() * plCanvas.height,
            r: Math.random() * 1.5 + 0.4,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.1
        }));

        animatePl();
    }

    function animatePl() {
        if (!plCtx) return;
        // Fondo oscuro semi-sólido (el canvas sirve como fondo del preloader)
        plCtx.fillStyle = 'rgba(5, 5, 5, 0.96)';
        plCtx.fillRect(0, 0, plCanvas.width, plCanvas.height);
        plParticles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = plCanvas.width;
            if (p.x > plCanvas.width) p.x = 0;
            if (p.y < 0) p.y = plCanvas.height;
            if (p.y > plCanvas.height) p.y = 0;
            plCtx.beginPath();
            plCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            plCtx.fillStyle = `rgba(17,212,131,${p.alpha})`;
            plCtx.fill();
        });
        plRafId = requestAnimationFrame(animatePl);
    }

    initPlCanvas();

    /* --- Barra de progreso y contador animados --- */
    const plFill = document.querySelector('.pl-fill');
    const plPct  = document.getElementById('pl-pct');
    let progress = 0;
    
    // Optimización Awwwards: Preloader corto en visitas recurrentes
    const hasVisited = sessionStorage.getItem('vanta-preloader-seen');
    const TOTAL_MS = hasVisited ? 500 : 2800; // 500ms si ya visitó la página
    if (!hasVisited) {
        sessionStorage.setItem('vanta-preloader-seen', 'true');
    }
    
    const start = performance.now();

    function updateProgress(now) {
        const elapsed = now - start;
        const raw = Math.min(elapsed / TOTAL_MS, 1);
        progress = raw < 0.7
            ? raw / 0.7 * 85
            : 85 + (raw - 0.7) / 0.3 * 15;
        progress = Math.min(progress, 100);

        if (plFill) plFill.style.width = progress + '%';
        if (plPct)  plPct.textContent  = Math.floor(progress) + '%';

        if (progress < 100) {
            requestAnimationFrame(updateProgress);
        }
    }
    requestAnimationFrame(updateProgress);

    /* --- Reveal: cortinas + fade del preloader --- */
    window.setTimeout(() => {
        cancelAnimationFrame(plRafId);
        _preloader.classList.add('preloader-hidden');

        // Las cortinas tardan 750ms en abrirse → activamos el Blueprint cuando terminen
        setTimeout(() => {
            _preloader.style.display = 'none';
            // Liberamos la animación del Blueprint exactamente al finalizarse el reveal
            const blueprintEl = document.querySelector('.blueprint-container');
            if (blueprintEl) {
                blueprintEl.classList.remove('blueprint-paused');
            }
            // Disparar la entrada dramática de la V 3D
            if (window.play3DVEntranceAnimation) {
                window.play3DVEntranceAnimation();
            }
        }, 800);
    }, TOTAL_MS);
})();

/* =========================================
   INICIO DEL SCRIPT PRINCIPAL
   ========================================= */
function initMainScript() {

    /* =========================================
       1. MENÚ MÓVIL (HAMBURGUESA)
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks   = document.querySelector('.nav-links');
    const links      = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    /* =========================================
       2. ANIMACIONES AL HACER SCROLL (.hidden)
       ========================================= */
    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    /* =========================================
       2.1. ANIMACIONES PARA TARJETAS
       ========================================= */
    const cardObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "50px"
    };

    const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                obs.unobserve(entry.target);
            }
        });
    }, cardObserverOptions);

    document.querySelectorAll('.gallery-grid .card').forEach(card => {
        cardObserver.observe(card);
    });

    /* =========================================
       3. CONTADOR ANIMADO DE ESTADÍSTICAS
       ========================================= */
    function animateCounter(el) {
        const target   = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800; // ms
        const step     = target / (duration / 16); // ~60fps
        let current    = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    }

    const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(c => animateCounter(c));
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);

    /* =========================================
       4. EFECTO PARALLAX SUAVE EN EL HERO
       ========================================= */
    let currentScrollY = 0;
    const heroCenterLayout = document.querySelector('.hero-center-layout');
    const heroBlueprintContainer = document.querySelector('.blueprint-container');
    const hero = document.querySelector('.hero');
    let heroH = hero ? hero.offsetHeight : window.innerHeight;

    window.addEventListener('resize', () => {
        if (hero) heroH = hero.offsetHeight;
    }, { passive: true });

    /* =========================================
       5. CURSOR PERSONALIZADO Y VARIABLES GLOBALES (GPU ACCELERATED)
       ========================================= */
    const cursor  = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');

    // Capturar coordenadas globales del mouse y setear variables CSS
    document.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    // Indicador deslizante (cápsula) de la barra de navegación
    function initNavbarIndicator() {
        const navLinksContainer = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-links a');
        const indicator = document.querySelector('.nav-indicator-capsule');
        if (!indicator || !navLinksContainer) return;

        function moveIndicator(link) {
            const rect = link.getBoundingClientRect();
            const parentRect = navLinksContainer.getBoundingClientRect();
            const left = rect.left - parentRect.left;
            const width = rect.width;
            
            indicator.style.transform = `translate3d(${left}px, 0, 0)`;
            indicator.style.width = `${width}px`;
            indicator.classList.add('active');
        }

        function hideIndicator() {
            indicator.classList.remove('active');
        }

        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveIndicator(link));
        });

        navLinksContainer.addEventListener('mouseleave', hideIndicator);
    }
    initNavbarIndicator();
 
    // Hover de botones sin desplazamiento magnético (botón estable + cursor fluido)
    document.querySelectorAll('.btn, .btn-outline, .modal-close, .viewer-close, .modal-tab-btn, .nav-links a, .logo, .menu-toggle').forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('btn-hover');
        });
        item.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('btn-hover');
        });
    });
 
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (window.innerWidth > 991 && cursor && !isTouchDevice) {
        document.body.classList.add('custom-cursor-active');
 
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let c1X = mouseX, c1Y = mouseY;
        let c2X = mouseX, c2Y = mouseY;
        let cursorRafId = null;
        let isCursorRunning = false;

        function startCursorLoop() {
            if (!isCursorRunning && !document.hidden) {
                isCursorRunning = true;
                renderCursor();
            }
        }

        function stopCursorLoop() {
            isCursorRunning = false;
            if (cursorRafId) {
                cancelAnimationFrame(cursorRafId);
                cursorRafId = null;
            }
        }
 
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            startCursorLoop();
        });
 
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursor2.style.opacity = '0';
            stopCursorLoop();
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursor2.style.opacity = '1';
            startCursorLoop();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopCursorLoop();
            } else {
                startCursorLoop();
            }
        });
 
        function renderCursor() {
            if (document.hidden || !isCursorRunning) return;
            const diff1X = mouseX - c1X;
            const diff1Y = mouseY - c1Y;
            const diff2X = mouseX - c2X;
            const diff2Y = mouseY - c2Y;

            c1X += diff1X * 0.17;
            c1Y += diff1Y * 0.17;
            c2X += diff2X * 0.8;
            c2Y += diff2Y * 0.8;
 
            cursor.style.transform = `translate3d(calc(${c1X}px - 50%), calc(${c1Y}px - 50%), 0)`;
            cursor2.style.transform = `translate3d(calc(${c2X}px - 50%), calc(${c2Y}px - 50%), 0)`;
 
            if (Math.abs(diff1X) < 0.1 && Math.abs(diff1Y) < 0.1 && Math.abs(diff2X) < 0.1 && Math.abs(diff2Y) < 0.1) {
                isCursorRunning = false;
                cursorRafId = null;
            } else {
                cursorRafId = requestAnimationFrame(renderCursor);
            }
        }
        startCursorLoop();
 
 
        // Hover general del cursor
        document.querySelectorAll('a, button, .logo, .service-card, .method-step, .testimonial-card, .pricing-card').forEach(item => {
            item.addEventListener('mouseover',  () => {
                if (!cursor.classList.contains('spec-active') && !cursor.classList.contains('project-hover')) {
                    cursor.classList.add('hovered');
                }
            });
            item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });

        // Morph del cursor en tarjetas de proyectos (Portfolio)
        document.querySelectorAll('.horizontal-track .card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursor.classList.remove('hovered');
                cursor.classList.add('project-hover');
                if (cursor2) cursor2.style.opacity = '0';
            });
            card.addEventListener('mouseleave', () => {
                cursor.classList.remove('project-hover');
                if (cursor2) cursor2.style.opacity = '1';
            });
        });
 
        // Morph del cursor en expedientes del equipo (data-spec Awwwards)
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const specText = card.getAttribute('data-spec');
                if (specText) {
                    cursor.classList.remove('hovered');
                    cursor.classList.remove('project-hover');
                    cursor.setAttribute('data-spec-text', specText);
                    cursor.classList.add('spec-active');
                    if (cursor2) cursor2.style.opacity = '0';
                }
            });
            card.addEventListener('mouseleave', () => {
                cursor.classList.remove('spec-active');
                cursor.removeAttribute('data-spec-text');
                if (cursor2) cursor2.style.opacity = '1';
            });
        });
    } else {
        if (cursor) cursor.style.display = 'none';
        if (cursor2) cursor2.style.display = 'none';
    }

    /* =========================================
       6. EFECTO MÁQUINA DE ESCRIBIR
       ========================================= */
    const textElement = document.querySelector('.typing-text');
    const words       = ["Arquitectura.", "Experiencias.", "Infraestructura.", "Tecnología.", "Tu Futuro."];
    let wordIndex   = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    function typeEffect() {
        if (!textElement) return;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex--);
            if (charIndex < 0) {
                isDeleting  = false;
                wordIndex   = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 500);
                return;
            }
        } else {
            textElement.textContent = currentWord.substring(0, charIndex++);
            if (charIndex > currentWord.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2200);
                return;
            }
        }

        setTimeout(typeEffect, isDeleting ? 80 : 140);
    }

    typeEffect();

    /* =========================================
       7. HUD TOAST & FORMULARIO A WHATSAPP
       ========================================= */
    let hudToastTimeout = null;
    window.showHudToast = function(message, duration = 3400) {
        const toast = document.getElementById('vanta-hud-toast');
        const msgEl = document.getElementById('toastMsg');
        if (!toast || !msgEl) return;

        msgEl.textContent = message;
        toast.classList.add('active');

        if (hudToastTimeout) clearTimeout(hudToastTimeout);
        hudToastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, duration);
    };

    // Copiar Correo Directo
    const emailCopyBtn = document.getElementById('emailCopyBtn');
    const emailCopyText = document.getElementById('emailCopyText');
    if (emailCopyBtn) {
        emailCopyBtn.addEventListener('click', () => {
            const email = 'contacto@vanta.tech';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    if (emailCopyText) emailCopyText.textContent = '¡Copiado!';
                    emailCopyBtn.classList.add('btn-copied');
                    window.showHudToast('[CORREO COPIADO // CONTACTO@VANTA.TECH]');
                    setTimeout(() => {
                        if (emailCopyText) emailCopyText.textContent = 'Copiar Correo';
                        emailCopyBtn.classList.remove('btn-copied');
                    }, 2800);
                }).catch(() => {
                    window.location.href = `mailto:${email}`;
                });
            } else {
                window.location.href = `mailto:${email}`;
            }
        });
    }

    const formContacto = document.getElementById('formContactoWa');

    if (formContacto) {
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre  = document.getElementById('waNombre').value.trim();
            const email   = document.getElementById('waEmail').value.trim();
            const mensaje = document.getElementById('waMensaje').value.trim();

            if (!nombre || !email || !mensaje) return;

            const textoMensaje = `¡Hola! Vengo de su sitio web VANTA y requiero cotizar un proyecto.%0A%0A*Nombre:* ${encodeURIComponent(nombre)}%0A*Correo:* ${encodeURIComponent(email)}%0A*Requerimiento:* ${encodeURIComponent(mensaje)}`;
            const numeroWa     = "584127121162";
            const urlWa        = `https://wa.me/${numeroWa}?text=${textoMensaje}`;

            if (window.showHudToast) {
                window.showHudToast('[TRANSMISIÓN ENVIADA // ENLACE A WHATSAPP ACTIVO]');
            }

            window.open(urlWa, '_blank', 'noopener,noreferrer');
        });
    }

    /* =========================================
       8. NAVBAR SMART HIDE-ON-SCROLL & PROGRESS
       ========================================= */
    const navbar = document.querySelector('.navbar');
    const logoEl = document.querySelector('.logo');

    // Motor de Interpolación Física Lerp para Navbar y Logo (Awwwards Grade)
    let navTargetP  = 0;
    let navCurrentP = 0;
    let isNavLerpRunning = false;

    const logoIcon = document.querySelector('.logo-icon');
    const hideLtrs = document.querySelectorAll('.logo .l.hide');
    const navMenuContainer = document.querySelector('.nav-links');

    function updateNavbar(scrollY) {
        // Progreso continuo 0.0 -> 1.0 según la salida del Hero (0px a 260px)
        navTargetP = Math.min(1, Math.max(0, scrollY / 260));

        if (!isNavLerpRunning) {
            isNavLerpRunning = true;
            requestAnimationFrame(renderNavLerp);
        }
    }

    function renderNavLerp() {
        const diff = navTargetP - navCurrentP;
        if (Math.abs(diff) > 0.0005) {
            navCurrentP += diff * 0.09; // lerp continuo ultra-fluido a 60fps
            requestAnimationFrame(renderNavLerp);
        } else {
            navCurrentP = navTargetP;
            isNavLerpRunning = false;
        }

        const p = navCurrentP; // 0.0 en Hero -> 1.0 al salir del Hero

        // 1. Estado colapsado: sin recuadros, 100% transparente para máxima inmersión
        if (p > 0.85) {
            navbar.classList.add('scrolled-out');
        } else {
            navbar.classList.remove('scrolled-out');
        }

        if (p < 0.85) {
            const bgAlpha = (1 - p) * 0.45;
            const borderAlpha = (1 - p) * 0.05;
            const shadowAlpha = (1 - p) * 0.5;
            const blurPx = (1 - p) * 22;

            navbar.style.background = `rgba(10, 10, 10, ${bgAlpha.toFixed(3)})`;
            navbar.style.borderColor = `rgba(255, 255, 255, ${borderAlpha.toFixed(3)})`;
            navbar.style.boxShadow = `0 10px 40px rgba(0, 0, 0, ${shadowAlpha.toFixed(3)})`;
            navbar.style.backdropFilter = `blur(${blurPx.toFixed(1)}px)`;
            navbar.style.webkitBackdropFilter = `blur(${blurPx.toFixed(1)}px)`;
        } else {
            navbar.style.background = '';
            navbar.style.borderColor = '';
            navbar.style.boxShadow = '';
            navbar.style.backdropFilter = '';
            navbar.style.webkitBackdropFilter = '';
        }

        // 2. Enlaces del menú: se desvanecen suavemente según el progreso del scroll
        if (navMenuContainer && !navbar.classList.contains('scrolled-out')) {
            navMenuContainer.style.opacity = Math.max(0, 1 - p * 1.25).toFixed(3);
            navMenuContainer.style.transform = `translate3d(0, ${(-p * 12).toFixed(1)}px, 0)`;
            navMenuContainer.style.pointerEvents = p > 0.65 ? 'none' : 'all';
        } else if (navMenuContainer && navbar.classList.contains('scrolled-out')) {
            navMenuContainer.style.opacity = '';
            navMenuContainer.style.transform = '';
            navMenuContainer.style.pointerEvents = '';
        }

        // 3. Icono morfológico del logo: emerge desde 0px a 34px de ancho
        if (logoIcon) {
            const iconW = p * 34;
            const iconMargin = p * 10;
            logoIcon.style.width = `${iconW.toFixed(1)}px`;
            logoIcon.style.marginRight = `${iconMargin.toFixed(1)}px`;
            logoIcon.style.opacity = p.toFixed(3);
        }

        // 4. Letras A, N, T: colapsan suavemente en cascada
        hideLtrs.forEach(ltr => {
            const ltrOpacity = Math.max(0, 1 - p * 1.35);
            const ltrW = Math.max(0, (1 - p) * 2);
            ltr.style.opacity = ltrOpacity.toFixed(3);
            ltr.style.maxWidth = `${ltrW.toFixed(2)}ch`;
            ltr.style.letterSpacing = `${((1 - p) * 5).toFixed(1)}px`;
        });
    }

    /* =========================================
       9. CANVAS NETWORK ANIMATION (NODOS)
       ========================================= */
    const canvas = document.getElementById('canvas-network');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // Configuración de la Red (Ultra-optimizado para 60 FPS estables)
        const isMob = window.innerWidth < 768;
        const particleCount = isMob ? 24 : 40; // Nodos balanceados
        const connectionDistance = isMob ? 90 : 110; // Distancia máxima para conectar nodos
        const mouseConnectionDistance = 140; // Distancia de interacción con el mouse

        // Live color object — mutated by window.setVantaTheme()
        window.constellationColors = {
            node:      'rgba(17, 212, 131, 0.9)',
            line:      'rgba(17, 212, 131, 0.25)',
            mouseLine: 'rgba(17, 212, 131, 0.6)',
        };

        let mouse = { x: null, y: null };

        function resizeCanvas() {
            // El canvas cubre solo el header#home
            const heroSection = document.getElementById('home');
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.0;
                this.vy = (Math.random() - 0.5) * 1.0;
                this.radius = Math.random() * 2.0 + 1.0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Rebotar en los bordes
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = window.constellationColors.node;
                ctx.fill();
            }
        }

        function init() {
            resizeCanvas();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        let networkRafId = null;
        let isNetworkVisible = false; // starts false, observer sets it true when hero is in view

        function startNetwork() {
            if (networkRafId) return; // already running
            networkRafId = requestAnimationFrame(animate);
        }

        function stopNetwork() {
            if (networkRafId) {
                cancelAnimationFrame(networkRafId);
                networkRafId = null;
            }
        }

        function animate() {
            networkRafId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => { p.update(); p.draw(); });

            // Batch all strokes in one pass to minimize state changes
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = window.constellationColors.line;
                        ctx.lineWidth = 1 - (dist / connectionDistance);
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null && mouse.y !== null) {
                    const dxm = particles[i].x - mouse.x;
                    const dym = particles[i].y - mouse.y;
                    const distMouse = Math.sqrt(dxm * dxm + dym * dym);
                    if (distMouse < mouseConnectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = window.constellationColors.mouseLine;
                        ctx.lineWidth = 1.5 - (distMouse / mouseConnectionDistance);
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        particles[i].x -= dxm * 0.015;
                        particles[i].y -= dym * 0.015;
                    }
                }
            }
        }

        window.addEventListener('resize', resizeCanvas);

        const heroElement = document.getElementById('home');
        if (heroElement) {
            heroElement.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            heroElement.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

            new IntersectionObserver((entries) => {
                isNetworkVisible = entries[0].isIntersecting;
                if (isNetworkVisible && !document.hidden) startNetwork();
                else stopNetwork();
            }, { threshold: 0.05 }).observe(heroElement);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopNetwork();
            else if (isNetworkVisible) startNetwork();
        });

        init();
        // Don't call animate() directly — let the IntersectionObserver handle it
        // Fallback: if hero is already visible on load (above the fold), start immediately
        if (heroElement) {
            const rect = heroElement.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                isNetworkVisible = true;
                startNetwork();
            }
        }
    }

    /* =========================================
       10. CARD MENU INTERACTIVO (click to toggle)
       ========================================= */
    const PROJECT_DATA = {
        kioskoazul: {
            tag: 'Python · Flask · SQLite · Bootstrap',
            title: 'Kiosko Azul — Gestión de Restaurante',
            description: 'Sistema integrado para el restaurante Kiosko Azul. Permite a los comensales visualizar un menú digital dinámico, reservar mesas en tiempo real y generar pedidos directo a cocina. Para los administradores, cuenta con un completo panel de edición de menú, administración y control de órdenes, y un dashboard de estadísticas para toma de decisiones financieras.',
            tech: ['Python / Flask', 'SQLite', 'Bootstrap 5', 'Bases de Datos', 'Dashboard Admin', 'Control de Pedidos'],
            url: '#contact',
            screenshots: ['img/auracheck/auralogin.jpeg'],
            code: `# Rutas de Pedidos y Reservas de Kiosko Azul
from flask import Flask, render_template, request, redirect, url_for
from models import db, Mesa, Pedido

@app.route('/reservar', methods=['POST'])
def reservar_mesa():
    mesa_id = request.form.get('mesa_id')
    cliente = request.form.get('nombre_cliente')
    
    mesa = Mesa.query.get(mesa_id)
    if mesa and mesa.disponible:
        mesa.disponible = False
        mesa.cliente = cliente
        db.session.commit()
        return jsonify({"status": "SUCCESS", "message": "Mesa reservada"})
    return jsonify({"status": "ERROR", "message": "Mesa no disponible"})`
        },
        svivaweb: {
            tag: 'React · TS · Vite · Tailwind',
            title: 'SVIVA Web — Showcase & Descargas',
            description: 'Sitio web oficial diseñado para promocionar y exhibir nuestro proyecto principal de grado: SVIVA. Es una landing page altamente inmersiva y profesional que aloja la descarga directa del archivo instalador ejecutable (.exe). Integra componentes dinámicos en React, animaciones de alto rendimiento con Tailwind CSS y guías interactivas de configuración.',
            tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Showcase de Producto'],
            url: '#contact',
            screenshots: ['img/sviva/svivaindex.jpeg'],
            code: `// Descarga de Ejecutable e Interfaz React TS
import React from 'react';

export const DownloadButton: React.FC = () => {
  const handleDownload = () => {
    // Iniciar descarga del .exe del sistema de videovigilancia
    window.location.href = '/downloads/sviva_installer.exe';
  };

  return (
    <button onClick={handleDownload} className="download-btn">
      Descargar SVIVA.exe
    </button>
  );
};`
        },
        ventastrack: {
            tag: 'Node.js · TS · Vite · PostgreSQL',
            title: 'VentasTrack — Gestión de Ventas B2B',
            description: 'Sistema integral de gestión comercial B2B. Se conecta directamente a los servidores y bases de datos locales de la empresa cliente, actualizando stock y catálogos de forma diaria. Diseñado con una estructura de roles y jerarquías seguras para vendedores y gerentes. Incluye un módulo interactivo para crear cotizaciones/facturas rellenando casillas clave de clientes, y un carrito de compras multi-producto dinámico.',
            tech: ['Node.js', 'Express', 'TypeScript', 'Vite', 'PostgreSQL', 'Sincronización Diaria', 'Facturación B2B', 'Carrito de Compras'],
            url: '#contact',
            screenshots: ['img/cerdiv/cerdivweb.jpeg'],
            code: `// Proceso de Facturación y Cotización en Node+TS
import { Request, Response } from 'express';
import { Pool } from 'pg';

export const generarFactura = async (req: Request, res: Response) => {
  const { clienteId, items, vendedorId } = req.body;
  const pool = new Pool();
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const total = items.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0);
    const result = await client.query(
      'INSERT INTO facturas (cliente_id, total, vendedor_id, estado) VALUES ($1, $2, $3, $4) RETURNING id',
      [clienteId, total, vendedorId, 'PENDIENTE']
    );
    await client.query('COMMIT');
    res.json({ id: result.rows[0].id, total });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
};`
        },
        sviva: {
            tag: 'YOLOv8 · FastAPI · Visión Artificial · Local',
            title: 'SVIVA — Sistema de Videovigilancia Inteligente',
            description: 'Proyecto de tesis (En desarrollo activo). Democratiza el acceso a seguridad avanzada operando algoritmos de visión artificial en tiempo real sobre hardware de gama media. No depende de la nube. Detecta intrusos, rastrea sujetos únicos (ByteTrack) y automatiza toma de decisiones en red local. Cuenta con FastAPI asíncrono, servicio de inferencia desacoplado, motor de grabación inteligente con pre-trigger, módulo de analítica en SQLite y notificaciones en tiempo real vía bot de Telegram.',
            metrics: ['⚡ INFERENCIA 12ms', '🔒 100% LOCAL / ZERO CLOUD', '🎯 99.4% PRECISIÓN', '📡 TELEGRAM BOT'],
            pipeline: ['📹 Camera Feed', '→', '⚡ YOLOv8 Inferencia', '→', '🧠 ByteTrack ID', '→', '💾 SQLite & Bot'],
            tech: ['Python', 'YOLOv8', 'FastAPI', 'Inferencia Desacoplada', 'Telegram API', 'SQLite'],
            url: '#',
            screenshots: [
                'img/sviva/svivaindex.jpeg',
                'img/sviva/svivacamaras.jpeg'
            ],
            code: `# Algoritmo de Visión Artificial YOLOv8 + ByteTrack
import cv2
from ultralytics import YOLO
from trackers.multi_tracker_zoo import create_tracker

class VisionPipeline:
    def __init__(self, model_path="yolov8n.pt"):
        self.model = YOLO(model_path)
        self.tracker = create_tracker("bytetrack", "config/bytetrack.yaml")

    def process_frame(self, frame):
        results = self.model(frame, stream=True)
        for r in results:
            boxes = r.boxes.xyxy.cpu().numpy()
            scores = r.boxes.conf.cpu().numpy()
            class_ids = r.boxes.cls.cpu().numpy()
            
            # Rastreo local e inferencia
            tracks = self.tracker.update(boxes, scores, class_ids, frame)
            self.draw_debug_ui(frame, tracks)
        return frame`
        },
        svivaweb: {
            tag: 'Vite · TypeScript · React · Three.js Showcase',
            title: 'SVIVA Web — Showcase & Landing de Descargas',
            description: 'Plataforma oficial diseñada para promocionar y distribuir el ejecutable de visión artificial SVIVA. Integra componentes dinámicos en React, animaciones de alto rendimiento con Three.js y GSAP, y guías interactivas.',
            metrics: ['🚀 VITE + TS', '⚡ 100/100 LIGHTHOUSE', '🎨 THREE.JS + GSAP', '📦 DOWNLOAD EXE'],
            pipeline: ['🌐 Web Visitor', '→', '🎨 WebGL Hero', '→', '⚡ React SPA Engine', '→', '📦 Executable Download'],
            tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Showcase de Producto'],
            url: '#',
            screenshots: [
                'img/sviva/svivaindex.jpeg',
                'img/sviva/svivaconfig.jpeg'
            ],
            code: `// React + Three.js Showcase Component
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3D = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        renderer.setSize(400, 400);
        return () => renderer.dispose();
    }, []);
    return <canvas ref={canvasRef} />;
};`
        },
        kioskoazul: {
            tag: 'Python · Flask · SQLite · POS Real-time',
            title: 'Kiosko Azul — POS & Menú Digital Interactivo',
            description: 'Menú digital, reservaciones en tiempo real y pedidos con un completo dashboard administrativo de estadísticas de órdenes para restauración y comercio.',
            metrics: ['🍔 REAL-TIME POS', '⚡ 0.04s LATENCIA', '📊 DASHBOARD SQL', '🔒 AUDITORÍA POS'],
            pipeline: ['📱 Client Order UI', '→', '⚡ Flask Async Engine', '→', '💾 SQLite Database', '→', '👨‍🍳 Kitchen Dashboard'],
            tech: ['Python', 'Flask', 'SQLite', 'HTML5', 'CSS3', 'JavaScript Async'],
            url: '#',
            screenshots: [
                'img/auracheck/auralogin.jpeg',
                'img/cerdiv/cerdivweb.jpeg'
            ],
            code: `# Motor POS y Gestión de Órdenes Flask
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/api/ordenes', methods=['POST'])
def crear_orden():
    data = request.get_json()
    conn = sqlite3.connect('kiosko.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO ordenes (mesa_id, total, estado) VALUES (?, ?, ?)',
                   (data['mesa_id'], data['total'], 'PENDIENTE'))
    conn.commit()
    conn.close()
    return jsonify({'status': 'SUCCESS', 'orden_id': cursor.lastrowid})`
        },
        iuta: {
            tag: 'Python · Flask · PostgreSQL · Multi-Sede',
            title: 'Sistema de Gestión Bibliotecaria IUTA',
            description: 'Desarrollado como servicio comunitario para el IUTA, este sistema centraliza y automatiza la administración de libros y ejemplares físicos en múltiples sedes universitarias.',
            metrics: ['📚 15.000+ REGISTROS', '⚡ BÚSQUEDA ASÍNCRONA', '🔒 POSTGRESQL NEON', '🏛️ MULTI-SEDE'],
            pipeline: ['🔍 Search Query', '→', '⚡ Flask ORM', '→', '🐘 PostgreSQL Neon', '→', '📖 Stock Allocation'],
            tech: ['Flask (Python)', 'PostgreSQL / Neon', 'Vercel Blob', 'Werkzeug Auth', 'Búsqueda Asíncrona', 'Multi-sede'],
            url: 'https://biblioteca-ashy-sigma.vercel.app',
            screenshots: [
                'img/cerdiv/cerdivweb.jpeg',
                'img/cerdiv/cerdivsede.jpeg'
            ],
            code: `# Consultas de Bases de Datos Relacionales (PostgreSQL Neon)
from flask_sqlalchemy import SQLAlchemy
from models import db, Libro, Prestamo

def registrar_prestamo_libro(usuario_id, libro_id, sede_id):
    # Transacción ACID con bloqueo de fila optimista
    with db.session.begin(nested=True):
        libro = db.session.query(Libro).filter_by(id=libro_id, sede_id=sede_id).with_for_update().first()
        if not libro or libro.copias_disponibles <= 0:
            raise Exception("Ejemplares agotados en la sede seleccionada")
        
        prestamo = Prestamo(usuario_id=usuario_id, libro_id=libro_id, sede_id=sede_id, estado="ACTIVO")
        libro.copias_disponibles -= 1
        db.session.add(prestamo)
    db.session.commit()`
        },
        aura: {
            tag: 'FastAPI · Biometría · WebAuthn · Seguridad Local',
            title: 'Aura Check — Panel de Auditoría de Seguridad',
            description: 'Aplicación de auditoría de seguridad biométrica que opera 100% en local: ningún dato sensible abandona el dispositivo. Analiza cinco módulos: integridad biométrica (WebAuthn / huella / facial), sensor óptico (cámara + face-api.js), frecuencia acústica (Web Audio API), estado del sistema (Battery API) y seguridad de red (test de velocidad real + geolocalización IP).',
            metrics: ['🧬 BIOMETRÍA FACIAL', '🔒 ZERO DATA LEAK', '⚡ FASTAPI ASYNC', '📄 PDF FORENSE'],
            pipeline: ['👁️ Optical Camera', '→', '⚡ face-api.js Local', '→', '🔑 WebAuthn Key', '→', '📄 Audit PDF Generator'],
            tech: ['FastAPI + Python 3.11', 'WebAuthn / Biometría', 'face-api.js', 'Web Audio API', 'jsPDF', 'Vercel Serverless', 'SlowAPI Rate Limiting'],
            url: 'https://aura-check-omega.vercel.app/',
            screenshots: [
                'img/auracheck/aura.jpeg',
                'img/auracheck/auralogin.jpeg'
            ],
            code: `// Verificación de Integridad Biométrica y Speed Test Local
async function auditBiometrics() {
    const hasWebAuthn = window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
    // face-api.js local face recognition setup
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    const detection = await faceapi.detectSingleFace(
        videoEl, new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();
    
    return {
        webauthn: hasWebAuthn ? "COMPLIANT" : "MISSING",
        biometryScore: detection ? detection.detection.score : 0,
        timestamp: Date.now()
    };
}`
        },
        cuerpo: {
            tag: 'Google Gemini · FastAPI · IA Narrativa · Victorian UX',
            title: '¿Qué le pasa a mi cuerpo? | Archivo Médico 1885',
            description: 'Plataforma de consulta médica inmersiva con IA que actúa como un doctor victoriano de 1885. Integra Gemini 1.5/2.0 Flash para respuestas con personalidad histórica, un sistema de fallback a Wikipedia y MedlinePlus (BeautifulSoup4 + httpx), filtros de imagen Cloudinary para estética de grabado antiguo.',
            metrics: ['🎙️ VOZ VICTORIANA 1885', '🤖 GEMINI AI', '⚡ TTS EN TIEMPO REAL', '📖 UX HISTÓRICA'],
            pipeline: ['❓ User Query', '→', '🤖 Gemini 1.5 Flash', '→', '📜 Victorian Filter', '→', '🔊 Web Audio TTS'],
            tech: ['Google Gemini 1.5/2.0', 'FastAPI + Python', 'BeautifulSoup4', 'Cloudinary API', 'Tailwind CSS', 'Wikipedia / MedlinePlus', 'Vercel Functions'],
            url: 'https://que-le-pasa-a-mi-cuerpo.vercel.app/',
            screenshots: [
                'img/quelepasacuerpo/cuerpologin.jpeg',
                'img/quelepasacuerpo/cuerpopasa.jpeg'
            ],
            code: `# Motor Narrativo IA del Doctor Victoriano con Fallback
import google.generativeai as genai
from bs4 import BeautifulSoup

def consulta_medica_historica(pregunta: str):
    genai.configure(api_key="GEMINI_API_KEY")
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Inyectar System Prompt victoriano
    prompt = f"Actúa como un médico británico en 1885. Pregunta: {pregunta}"
    response = model.generate_content(prompt)
    
    # Filtro de respuesta para remover HTML o tags indeseados
    soup = BeautifulSoup(response.text, "html.parser")
    return soup.get_text()`
        },
        ventastrack: {
            tag: 'Node.js · TypeScript · PostgreSQL · B2B',
            title: 'VentasTrack B2B Commercial System',
            description: 'Plataforma de ventas con roles y jerarquías, carrito de compras y módulo de facturación, sincronizada a diario con bases de datos del cliente.',
            metrics: ['💼 B2B FACTURACIÓN', '🔄 SYNC DIARIO', '⚡ NODE.JS + TS', '📊 REPORTES SALES'],
            pipeline: ['🛒 B2B Cart', '→', '⚡ Node.js Transaction', '→', '🐘 PostgreSQL ACID', '→', '📄 Invoice PDF'],
            tech: ['Node.js', 'TypeScript', 'Vite', 'PostgreSQL', 'JWT Auth', 'Billing Engine'],
            url: '#',
            screenshots: [
                'img/sviva/svivaconfig.jpeg',
                'img/sviva/svivagraficas.jpeg'
            ],
            code: `// Node.js + TypeScript Transaction Handler
import { Pool } from 'pg';
const pool = new Pool();

export const processOrder = async (clienteId: string, items: any[]) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const res = await client.query(
            'INSERT INTO facturas (cliente_id, total, estado) VALUES ($1, $2, $3) RETURNING id',
            [clienteId, total, 'PENDIENTE']
        );
        await client.query('COMMIT');
        return res.rows[0];
    } finally {
        client.release();
    }
};`
        },
        inventario: {
            tag: 'Gestión Empresarial · Stock · Custom Software',
            title: 'Sistema de Inventario Pro | 100% Personalizable',
            description: 'Nuestra solución de inventario es un ecosistema digital diseñado para empresas que buscan orden y escalabilidad. Ofrecemos este software como un producto base altamente flexible (campos personalizados, alertas de stock mínimo, multi-sucursales).',
            metrics: ['📦 100% CUSTOM', '⚡ STOCK EN VIVO', '📊 REPORTES AUTO', '🔒 MULTI-BODEGA'],
            pipeline: ['📦 Stock Scan', '→', '⚡ Python FastAPI', '→', '🔒 FOR UPDATE Lock', '→', '📊 Real-time Inventory'],
            tech: ['Python', 'Gestión de Stock', 'Base de Datos', 'Personalizable', 'Soporte 24/7'],
            url: '#contact',
            screenshots: [
                'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM.jpeg',
                'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (2).jpeg'
            ],
            code: `-- Query de Inventario con Bloqueo de Filas y Reportes Diarios
BEGIN;
SELECT i.id, i.sku, i.stock_actual 
FROM inventario i
WHERE i.sku = 'SKU-7739-B' AND i.bodega_id = 2
FOR UPDATE;

UPDATE inventario 
SET stock_actual = stock_actual - 15, fecha_actualizacion = NOW()
WHERE sku = 'SKU-7739-B' AND bodega_id = 2;

INSERT INTO logs_movimientos (sku, bodega_id, cantidad, tipo)
VALUES ('SKU-7739-B', 2, 15, 'SALIDA');
COMMIT;`
        }
    };

    // ---- Modal and Technical 3D State ----
    const modalOverlay   = document.getElementById('projectModalOverlay');
    const modalTag       = document.getElementById('modalTag');
    const modalTitle     = document.getElementById('modalTitle');
    const modalDesc      = document.getElementById('modalDescription');
    const modalTechList  = document.getElementById('modalTechList');
    const modalLearnMore = document.getElementById('modalLearnMore');
    const modalCloseBtn  = document.getElementById('modalClose');
    const galleryCards   = document.querySelectorAll('.horizontal-track .card');

    let modal3DScene = null;
    let modal3DCamera = null;
    let modal3DRenderer = null;
    let modal3DMesh = null;
    let modal3DAnimationId = null;
    let modal3DListeners = null;

    function initModal3D(projectKey) {
        const container = document.getElementById('modal-3d-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        // Limpieza previa por seguridad
        disposeModal3D();

        const width = container.clientWidth || window.innerWidth * 0.55;
        const height = container.clientHeight || window.innerHeight;

        modal3DScene = new THREE.Scene();
        modal3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        modal3DCamera.position.z = 6.2;

        modal3DRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        modal3DRenderer.setSize(width, height);
        modal3DRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(modal3DRenderer.domElement);

        // Material wireframe neón verde
        const mat = new THREE.MeshBasicMaterial({
            color: 0x11d483,
            wireframe: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        window.modal3DMaterial = mat;

        // Sincronizar color inicial con el tema activo
        const initialPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (initialPrimary) {
            mat.color.setStyle(initialPrimary);
        }

        // Crear geometría visualizadora 3D única por proyecto
        if (projectKey === 'sviva') {
            // 👁️ SVIVA: AI Security Camera Node + Scan Rings
            const group = new THREE.Group();
            const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 1), mat);
            const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.05, 8, 30), mat);
            const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.04, 8, 30), mat);
            ring2.rotation.x = Math.PI / 2;
            group.add(core, ring1, ring2);
            modal3DMesh = group;

        } else if (projectKey === 'svivaweb') {
            // 💻 SVIVA WEB: Floating 3D Laptop/Screen Hologram
            const group = new THREE.Group();
            const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.8), mat);
            const screen = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.6, 0.08), mat);
            screen.position.set(0, 0.85, -0.8);
            screen.rotation.x = -0.15;
            group.add(base, screen);
            modal3DMesh = group;

        } else if (projectKey === 'kioskoazul') {
            // 🍔 KIOSKO AZUL: 3D POS Tablet & Stand
            const group = new THREE.Group();
            const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 2.0, 12), mat);
            const tablet = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 0.1), mat);
            tablet.position.set(0, 0.7, 0.2);
            tablet.rotation.x = -0.28;
            group.add(stand, tablet);
            modal3DMesh = group;

        } else if (projectKey === 'iuta') {
            // 📚 IUTA: 3D Database Stack & Core Knowledge Cube
            const group = new THREE.Group();
            for (let i = 0; i < 3; i++) {
                const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 16, 1, true), mat);
                cyl.position.y = (i - 1) * 0.75;
                group.add(cyl);
            }
            const coreCube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), mat);
            group.add(coreCube);
            modal3DMesh = group;

        } else if (projectKey === 'aura') {
            // 🧬 AURA CHECK: 3D Biometric Facial/Vault Mesh + Scan Ring
            const group = new THREE.Group();
            const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 2), mat);
            const scanRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.05, 8, 24), mat);
            scanRing.rotation.x = Math.PI / 2;
            group.add(mesh, scanRing);
            modal3DMesh = group;

        } else if (projectKey === 'cuerpo') {
            // 🎙️ CUERPO: 3D Victorian Anatomical DNA Knot
            const group = new THREE.Group();
            const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.1, 0.35, 64, 12), mat);
            group.add(knot);
            modal3DMesh = group;

        } else if (projectKey === 'ventastrack') {
            // 💼 VENTASTRACK: 3D Commercial Sales Node Network
            const group = new THREE.Group();
            const centerNode = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), mat);
            group.add(centerNode);
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const node = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 0), mat);
                node.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0);
                group.add(node);
            }
            modal3DMesh = group;

        } else {
            // 📦 INVENTARIO PRO: 3x3 Automated Storage Grid
            const group = new THREE.Group();
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    const box = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), mat);
                    box.position.set(x * 0.9, y * 0.9, 0);
                    group.add(box);
                }
            }
            modal3DMesh = group;
        }

        modal3DScene.add(modal3DMesh);

        // Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        modal3DScene.add(ambientLight);

        // Interacción rotación 3D con cursor (Inercial / Drag)
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let targetRotation = { x: 0.2, y: 0.5 };
        let currentRotation = { x: 0.2, y: 0.5 };

        const onMouseDown = (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            targetRotation.y += deltaX * 0.0075;
            targetRotation.x += deltaY * 0.0075;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        container.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        const onResize = () => {
            if (!container || !modal3DRenderer || !modal3DCamera) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            modal3DCamera.aspect = w / h;
            modal3DCamera.updateProjectionMatrix();
            modal3DRenderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        modal3DListeners = {
            mousedown: onMouseDown,
            mousemove: onMouseMove,
            mouseup: onMouseUp,
            resize: onResize,
            container: container
        };

        function animateModal3D() {
            modal3DAnimationId = requestAnimationFrame(animateModal3D);

            // Lerp de rotación inercial
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.07;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.07;

            if (modal3DMesh) {
                modal3DMesh.rotation.x = currentRotation.x;
                modal3DMesh.rotation.y = currentRotation.y;
                if (!isDragging) {
                    targetRotation.y += 0.0035;
                    targetRotation.x += 0.001;
                }
            }

            if (modal3DRenderer && modal3DScene && modal3DCamera) {
                modal3DRenderer.render(modal3DScene, modal3DCamera);
            }
        }
        animateModal3D();

        // Activar fade-in
        setTimeout(() => {
            if (container && modalOverlay.classList.contains('modal-open')) {
                container.classList.add('loaded');
            }
        }, 50);
    }

    function disposeModal3D() {
        if (modal3DAnimationId) {
            cancelAnimationFrame(modal3DAnimationId);
            modal3DAnimationId = null;
        }
        if (modal3DListeners) {
            if (modal3DListeners.container) {
                modal3DListeners.container.removeEventListener('mousedown', modal3DListeners.mousedown);
            }
            window.removeEventListener('mousemove', modal3DListeners.mousemove);
            window.removeEventListener('mouseup', modal3DListeners.mouseup);
            window.removeEventListener('resize', modal3DListeners.resize);
            modal3DListeners = null;
        }
        if (modal3DRenderer) {
            const container = document.getElementById('modal-3d-canvas-container');
            if (container && modal3DRenderer.domElement.parentNode === container) {
                container.removeChild(modal3DRenderer.domElement);
            }
            modal3DRenderer.dispose();
            modal3DRenderer = null;
        }
        if (modal3DMesh) {
            // Recursividad para grupos
            const disposeNode = (node) => {
                if (node.geometry) node.geometry.dispose();
                if (node.material) {
                    if (Array.isArray(node.material)) {
                        node.material.forEach(m => m.dispose());
                    } else {
                        node.material.dispose();
                    }
                }
            };
            if (modal3DMesh.traverse) {
                modal3DMesh.traverse(disposeNode);
            } else {
                disposeNode(modal3DMesh);
            }
            modal3DMesh = null;
        }
        modal3DScene = null;
        modal3DCamera = null;
    }

    function highlightCode(code) {
        if (!code) return '';
        // Escapar HTML primero para evitar inyección y romper etiquetas
        let escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Regex para resaltar: comentarios, strings, keywords, números y funciones conocidas
        const regex = /(#.*|\/\/.*)|(".*?"|'.*?'|`.*?`)|(\b(?:def|class|import|from|self|return|if|else|for|in|while|try|except|with|as|raise|const|let|var|function|async|await|new|and|or|not|is|lambda|pass|break|continue|yield|del|BEGIN|COMMIT|SELECT|FROM|WHERE|UPDATE|SET|INSERT|INTO|VALUES|FOR|UPDATE)\b)|(\b\d+\b)|(\b(?:print|int|str|len|dict|list|set|tuple|open|close|Exception|query|filter_by|first|add|commit|append|querySelector|querySelectorAll|addEventListener|PublicKeyCredential|faceapi|nets|loadFromUri|detectSingleFace|TinyFaceDetectorOptions|withFaceLandmarks|configure|GenerativeModel|generate_content|BeautifulSoup)\b)/g;

        return escaped.replace(regex, (match, comment, string, keyword, number, builtin) => {
            if (comment) return `<span class="code-comment">${comment}</span>`;
            if (string) return `<span class="code-str">${string}</span>`;
            if (keyword) return `<span class="code-kw">${keyword}</span>`;
            if (number) return `<span class="code-num">${number}</span>`;
            if (builtin) return `<span class="code-builtin">${builtin}</span>`;
            return match;
        });
    }

    function initModalTabs() {
        const tabBtns = document.querySelectorAll('.modal-tab-btn');
        const canvasContainer = document.getElementById('modal-3d-canvas-container');
        const canvasHint = document.querySelector('.canvas-3d-hint');
        const galleryContainer = document.getElementById('modal-gallery-container');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const tab = btn.getAttribute('data-tab');
                if (tab === 'wireframe') {
                    if (canvasContainer) canvasContainer.classList.remove('tab-hidden');
                    if (canvasHint) canvasHint.classList.remove('tab-hidden');
                    if (galleryContainer) galleryContainer.classList.add('tab-hidden');
                    // Forzar resize para que Three.js se reajuste si estaba oculto
                    if (modal3DRenderer && modal3DCamera) {
                        const w = canvasContainer.clientWidth;
                        const h = canvasContainer.clientHeight;
                        if (w > 0 && h > 0) {
                            modal3DCamera.aspect = w / h;
                            modal3DCamera.updateProjectionMatrix();
                            modal3DRenderer.setSize(w, h);
                        }
                    }
                } else {
                    if (canvasContainer) canvasContainer.classList.add('tab-hidden');
                    if (canvasHint) canvasHint.classList.add('tab-hidden');
                    if (galleryContainer) galleryContainer.classList.remove('tab-hidden');
                }
            });
        });
    }

    function openModal(projectKey) {
        const data = PROJECT_DATA[projectKey];
        if (!data) return;

        modalTag.textContent   = data.tag;
        modalTitle.textContent = data.title;
        modalDesc.textContent  = data.description;
        modalTechList.innerHTML = data.tech.map(t => `<li>${t}</li>`).join('');
        modalLearnMore.href = data.url;

        // Renderizar Métricas de Ingeniería (KPI Pills)
        const metricsBar = document.getElementById('modalMetricsBar');
        if (metricsBar) {
            if (data.metrics && data.metrics.length > 0) {
                metricsBar.innerHTML = data.metrics.map(m => `<span class="hud-metric-pill">${m}</span>`).join('');
            } else {
                metricsBar.innerHTML = '';
            }
        }

        // Renderizar Diagrama de Flujo de la Arquitectura
        const pipelineEl = document.getElementById('modalPipelineDiagram');
        if (pipelineEl) {
            if (data.pipeline && data.pipeline.length > 0) {
                pipelineEl.innerHTML = data.pipeline.map(step => {
                    if (step === '→') return `<span class="pipeline-arrow">→</span>`;
                    return `<span class="pipeline-node">${step}</span>`;
                }).join('');
            } else {
                pipelineEl.innerHTML = '';
            }
        }

        // Reset modal tabs to default (wireframe)
        const defaultTabBtn = document.querySelector('.modal-tab-btn[data-tab="wireframe"]');
        if (defaultTabBtn) {
            document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            defaultTabBtn.classList.add('active');
        }
        const canvasContainer = document.getElementById('modal-3d-canvas-container');
        const canvasHint = document.querySelector('.canvas-3d-hint');
        const galleryContainer = document.getElementById('modal-gallery-container');
        if (canvasContainer) canvasContainer.classList.remove('tab-hidden');
        if (canvasHint) canvasHint.classList.remove('tab-hidden');
        if (galleryContainer) galleryContainer.classList.add('tab-hidden');

        // Renderizar capturas de pantalla reales en la pestaña de galería
        const galleryGrid = document.getElementById('modalGalleryGrid');
        if (galleryGrid) {
            if (data.screenshots && data.screenshots.length > 0) {
                galleryGrid.innerHTML = data.screenshots.map(src => `
                    <div class="gallery-screenshot-card" data-src="${src}">
                        <img src="${src}" alt="Captura de ${data.title}">
                    </div>
                `).join('');
                
                // Evento click para abrir lightbox
                galleryGrid.querySelectorAll('.gallery-screenshot-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const src = card.getAttribute('data-src');
                        openFullscreen(src);
                    });
                    
                    // Asociar eventos del cursor personalizado
                    card.addEventListener('mouseenter', () => {
                        if (cursor) {
                            cursor.classList.remove('hovered');
                            cursor.classList.add('project-hover');
                            if (cursor2) cursor2.style.opacity = '0';
                        }
                    });
                    card.addEventListener('mouseleave', () => {
                        if (cursor) {
                            cursor.classList.remove('project-hover');
                            if (cursor2) cursor2.style.opacity = '1';
                        }
                    });
                });
            } else {
                galleryGrid.innerHTML = '<p style="color: rgba(255,255,255,0.3); text-align: center; grid-column: 1/-1; padding: 2rem;">No hay capturas disponibles para este sistema.</p>';
            }
        }

        // Inyectar y resaltar código fuente
        const codeSnippetEl = document.getElementById('modalCodeSnippet');
        if (codeSnippetEl) {
            codeSnippetEl.innerHTML = highlightCode(data.code || '');
        }

        modalOverlay.classList.add('modal-open');
        document.body.style.overflow = 'hidden';

        // Inicializar canvas 3D con delay para animación CSS
        setTimeout(() => {
            initModal3D(projectKey);
        }, 120);

        // Forzar un segundo resize tras finalizar la animación CSS de apertura (750ms) para corregir aspect ratio
        setTimeout(() => {
            if (modal3DRenderer && modal3DCamera) {
                const container = document.getElementById('modal-3d-canvas-container');
                if (container) {
                    const w = container.clientWidth;
                    const h = container.clientHeight;
                    if (w > 0 && h > 0) {
                        modal3DCamera.aspect = w / h;
                        modal3DCamera.updateProjectionMatrix();
                        modal3DRenderer.setSize(w, h);
                    }
                }
            }
        }, 800);
    }
    window.openProjectModal = openModal;

    function closeModal() {
        modalOverlay.classList.remove('modal-open');
        document.body.style.overflow = '';
        
        // Quitar fade-in del canvas
        const container = document.getElementById('modal-3d-canvas-container');
        if (container) container.classList.remove('loaded');

        // Retrasar la destrucción del canvas 3D 750ms para que siga viéndose mientras el modal se desliza hacia abajo
        setTimeout(() => {
            if (!modalOverlay.classList.contains('modal-open')) {
                disposeModal3D();
            }
        }, 750);
    }

    function closeAllCards() {
        galleryCards.forEach(c => c.classList.remove('card-active'));
    }

    // Card interaction (Mobile fallback)
    galleryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Si el click fue en el menu (botón o link), no toggling
            if (e.target.closest('.card-menu')) return;
            
            // En dispositivos táctiles, alternamos la clase activa
            if (window.innerWidth <= 1024) {
                const isActive = card.classList.contains('card-active');
                closeAllCards();
                if (!isActive) card.classList.add('card-active');
            }
        });
    });

    // Info button → 3D Warp Tunnel Flight Experience
    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const key = btn.getAttribute('data-info');
            const card = btn.closest('.card');
            
            if (window.WarpRunner && typeof window.WarpRunner.launch === 'function') {
                window.WarpRunner.launch(key, (projKey) => {
                    if (typeof window.openProjectModal === 'function') {
                        window.openProjectModal(projKey);
                    } else {
                        openModal(projKey);
                    }
                });
            } else {
                openModal(key);
            }
        });
    });

    // Close modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Botón "Cotizar este sistema" en el modal
    const modalContactBtn = document.getElementById('modalContact');
    if (modalContactBtn) {
        modalContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectTitle = modalTitle ? modalTitle.textContent.trim() : 'Sistema VANTA';
            closeModal();

            const waMsgEl = document.getElementById('waMensaje');
            if (waMsgEl) {
                waMsgEl.value = `¡Hola! Me gustaría cotizar e implementar una arquitectura basada en el proyecto: ${projectTitle}.`;
            }

            if (window.showHudToast) {
                window.showHudToast(`[PROYECTO SELECCIONADO // ${projectTitle.toUpperCase()}]`);
            }

            const contactSec = document.getElementById('contact');
            if (contactSec) {
                contactSec.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    const nameInput = document.getElementById('waNombre');
                    if (nameInput) nameInput.focus();
                }, 500);
            }
        });
    }

    // Inicializar navegación de pestañas del modal
    initModalTabs();

    // Click fuera de cards → cierra el menú activo
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.horizontal-track .card')) {
            closeAllCards();
        }
    });

    /* =========================================
       10. VISOR FULLSCREEN (LIGHTBOX)
       ========================================= */
    const fsViewer  = document.getElementById('fullscreenViewer');
    const viewerImg = document.getElementById('viewerImg');
    const closeFs   = document.getElementById('closeViewer');

    function openFullscreen(src) {
        if (!fsViewer || !viewerImg) return;
        viewerImg.src = src;
        fsViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeFullscreen() {
        if (!fsViewer) return;
        fsViewer.classList.remove('active');
        // Solo restaurar el scroll si el modal de proyecto no está abierto
        if (!document.getElementById('projectModalOverlay').classList.contains('modal-open')) {
            document.body.style.overflow = '';
        }
    }

    if (closeFs) closeFs.addEventListener('click', closeFullscreen);
    if (fsViewer) {
        fsViewer.addEventListener('click', (e) => {
            if (e.target !== viewerImg) closeFullscreen();
        });
    }

    // Tecla ESC para cerrar todo
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeFullscreen();
            closeModal();
            closeAllCards();
        }
    });

    /* =========================================================
       11. NÚCLEO DIGITAL 3D (THREE.JS)
       ========================================================= */
        // Objeto global de comunicación para scrollytelling WebGL
    window.vanta3D = {
        progress: 0,
        glitch: 0,
        packets: 0
    };


            // ============================================================
            //  FASE 2 #1: MESH GRADIENT BACKGROUND (Canvas 2D, 20fps)
            // ============================================================
            (function initMeshGradient() {
                const canvas = document.getElementById('mesh-gradient-canvas');
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                let W, H, rafId, lastTs = 0;
                const THROTTLE = 100; // 10 FPS para el fondo difuminado (Cero impacto en GPU)
                const blobs = [
                    { x:0.2, y:0.15, r:0.55, sp:0.00018, ph:0 },
                    { x:0.8, y:0.25, r:0.48, sp:0.00023, ph:1.3 },
                    { x:0.5, y:0.72, r:0.52, sp:0.00015, ph:2.6 },
                    { x:0.15,y:0.65, r:0.42, sp:0.00021, ph:3.9 },
                    { x:0.85,y:0.6,  r:0.45, sp:0.00017, ph:5.2 },
                ];
                let colors = [[8,15,42],[4,42,22],[30,8,55],[8,38,18],[18,8,35]];
                const PALETTES = {
                    home:       [[8,12,40],[4,42,22],[28,8,55],[8,35,18],[18,8,32]],
                    portfolio:  [[4,42,22],[8,8,12],[8,55,30],[4,30,14],[12,28,8]],
                    bento:      [[8,35,18],[22,12,5],[8,8,12],[4,42,22],[8,25,8]],
                    services:   [[8,18,50],[4,55,40],[28,8,10],[8,22,45],[5,12,35]],
                    pricing:    [[8,32,18],[38,28,6],[8,8,12],[4,40,20],[18,22,5]],
                    contact:    [[4,55,25],[4,4,4],[8,8,8],[8,45,22],[4,4,4]],
                    philosophy: [[50,8,8],[35,18,4],[8,8,8],[28,12,4],[18,8,4]],
                    stats:      [[4,42,22],[8,8,8],[22,50,22],[4,28,14],[8,8,8]],
                };
                let target = colors.map(c => [...c]);
                function setPalette(id) {
                    const key = PALETTES[id] ? id : 'home';
                    target = PALETTES[key].map(c => [...c]);
                }
                document.querySelectorAll('section[id]').forEach(sec => {
                    new IntersectionObserver(entries => {
                        if (entries[0].isIntersecting) setPalette(sec.id);
                    }, { threshold: 0.35 }).observe(sec);
                });
                function resize() {
                    W = canvas.width  = Math.ceil(window.innerWidth / 4);
                    H = canvas.height = Math.ceil(window.innerHeight / 4);
                }
                function draw(ts) {
                    ctx.clearRect(0, 0, W, H);
                    ctx.fillStyle = '#050508';
                    ctx.fillRect(0, 0, W, H);
                    blobs.forEach((b, i) => {
                        colors[i] = colors[i].map((c, j) => c + (target[i][j] - c) * 0.05);
                        const t  = ts * b.sp + b.ph;
                        const bx = (b.x + Math.sin(t) * 0.18) * W;
                        const by = (b.y + Math.cos(t * 1.3) * 0.12) * H;
                        const br = b.r * Math.max(W, H);
                        const [r, g, bl] = colors[i].map(Math.round);
                        const grd = ctx.createRadialGradient(bx, by, 0, bx, by, br);
                        grd.addColorStop(0, `rgba(${r},${g},${bl},0.5)`);
                        grd.addColorStop(1, 'rgba(0,0,0,0)');
                        ctx.fillStyle = grd;
                        ctx.fillRect(0, 0, W, H);
                    });
                }
                let timerId = null;
                function startGradient() {
                    if (timerId) return;
                    timerId = setInterval(() => draw(performance.now()), THROTTLE);
                }
                function stopGradient() {
                    if (timerId) { clearInterval(timerId); timerId = null; }
                }
                resize();
                window.addEventListener('resize', resize, { passive: true });
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) stopGradient();
                    else startGradient();
                });
                startGradient();
            })();


            // ============================================================
            //  FASE 2 #2: BENTO UNIVERSE (Three.js Orbiting System)
            // ============================================================
            (function initBentoUniverse() {
                const canvas = document.getElementById('bento-universe-canvas');
                if (!canvas || typeof THREE === 'undefined') return;
                const wrap = document.getElementById('bento-universe-canvas-wrap');
                if (!wrap) return;
                let W = wrap.clientWidth || 600, H = wrap.clientHeight || 560;
                const scene  = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
                camera.position.z = 7;
                const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
                renderer.setSize(W, H);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.3));
                const col = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#11d483';
                const COL = new THREE.Color(col);

                // Sol central
                const sunMat = new THREE.MeshBasicMaterial({ color: COL, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending });
                const sun    = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), sunMat);
                const haloMat= new THREE.MeshBasicMaterial({ color: COL, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, side: THREE.BackSide });
                sun.add(new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), haloMat));
                scene.add(sun);

                // Anillos
                const ORBITS = [
                    { r: 1.6, speed: 0.55, incl: 0.25 },
                    { r: 2.3, speed: 0.38, incl: -0.4 },
                    { r: 3.0, speed: 0.28, incl: 0.6 },
                ];
                ORBITS.forEach(o => {
                    const pts = new THREE.EllipseCurve(0, 0, o.r, o.r * 0.35, 0, Math.PI * 2, false, 0).getPoints(64);
                    const ring = new THREE.LineLoop(
                        new THREE.BufferGeometry().setFromPoints(pts),
                        new THREE.LineBasicMaterial({ color: COL, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending })
                    );
                    ring.rotation.x = o.incl;
                    scene.add(ring);
                });

                // Orbes
                const ORB_DATA = [
                    { oi: 0, angle: 0 }, { oi: 0, angle: Math.PI },
                    { oi: 1, angle: 0.5 }, { oi: 1, angle: 0.5 + Math.PI },
                    { oi: 2, angle: 1.2 }, { oi: 2, angle: 1.2 + Math.PI },
                ];
                const orbMeshes = ORB_DATA.map((od, i) => {
                    const sz = 0.12 + (i % 3) * 0.04;
                    const m  = new THREE.Mesh(
                        new THREE.SphereGeometry(sz, 10, 10),
                        new THREE.MeshBasicMaterial({ color: COL, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
                    );
                    m.add(new THREE.Mesh(
                        new THREE.SphereGeometry(sz * 2.2, 8, 8),
                        new THREE.MeshBasicMaterial({ color: COL, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, side: THREE.BackSide })
                    ));
                    scene.add(m);
                    return m;
                });

                // Lineas de conexion
                const lineGeos = ORB_DATA.map(() => {
                    const buf = new Float32Array(6);
                    const geo = new THREE.BufferGeometry();
                    geo.setAttribute('position', new THREE.BufferAttribute(buf, 3));
                    scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: COL, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending })));
                    return { geo, buf };
                });

                // Stars
                const starPos = new Float32Array(300 * 3).map(() => (Math.random() - 0.5) * 14);
                const starGeo = new THREE.BufferGeometry();
                starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
                scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.3 })));

                const clock = new THREE.Clock();
                let running = false, rafId = null, mx = 0, my = 0, tx = 0, ty = 0;
                wrap.addEventListener('mousemove', e => {
                    const r = wrap.getBoundingClientRect();
                    tx = ((e.clientX - r.left) / r.width  - 0.5) * 0.5;
                    ty = ((e.clientY - r.top)  / r.height - 0.5) * 0.5;
                });
                wrap.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
                const orbLabels = document.querySelectorAll('.orb-label');

                function animate() {
                    if (!running) return;
                    rafId = requestAnimationFrame(animate);
                    const t = clock.getElapsedTime();
                    mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
                    scene.rotation.y = mx * 0.5;
                    scene.rotation.x = my * 0.3;
                    sunMat.opacity  = 0.75 + Math.sin(t * 2.2) * 0.2;
                    haloMat.opacity = 0.05 + Math.sin(t * 1.8) * 0.03;
                    ORB_DATA.forEach((od, i) => {
                        const orb   = ORBITS[od.oi];
                        const angle = od.angle + t * orb.speed;
                        const x = Math.cos(angle) * orb.r;
                        const z = Math.sin(angle) * orb.r * 0.35;
                        const y = Math.sin(angle * 0.7 + od.angle) * 0.3;
                        orbMeshes[i].position.set(x, y * Math.cos(orb.incl) - z * Math.sin(orb.incl), y * Math.sin(orb.incl) + z * Math.cos(orb.incl));
                        orbMeshes[i].material.opacity = 0.7 + Math.sin(t * 3 + i) * 0.25;
                        const { buf } = lineGeos[i];
                        buf[0]=0; buf[1]=0; buf[2]=0;
                        buf[3]=orbMeshes[i].position.x; buf[4]=orbMeshes[i].position.y; buf[5]=orbMeshes[i].position.z;
                        lineGeos[i].geo.getAttribute('position').needsUpdate = true;
                        if (orbLabels[i]) {
                            const tempProjVec = new THREE.Vector3();
                            tempProjVec.copy(orbMeshes[i].position).project(camera);
                            orbLabels[i].style.left = ((tempProjVec.x * 0.5 + 0.5) * W) + 'px';
                            orbLabels[i].style.top  = ((-tempProjVec.y * 0.5 + 0.5) * H + 18) + 'px';
                            orbLabels[i].classList.add('visible');
                        }
                    });
                    renderer.render(scene, camera);
                }

                new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting) { running = true; animate(); }
                    else { running = false; cancelAnimationFrame(rafId); orbLabels.forEach(l => l.classList.remove('visible')); }
                }, { threshold: 0.1 }).observe(canvas);

                // Counter animation
                document.querySelectorAll('.bum').forEach(el => {
                    const val = parseInt(el.dataset.val) || 0;
                    const sfx = el.dataset.suffix || '';
                    const lbl = el.dataset.label || '';
                    el.innerHTML = `<span class="bum-val">0${sfx}</span><span class="bum-label">${lbl}</span>`;
                    const numEl = el.querySelector('.bum-val');
                    new IntersectionObserver(entries => {
                        if (!entries[0].isIntersecting) return;
                        let cur = 0;
                        const step = Math.max(1, Math.floor(val / 40));
                        const tick = setInterval(() => {
                            cur = Math.min(cur + step, val);
                            numEl.textContent = cur + sfx;
                            if (cur >= val) clearInterval(tick);
                        }, 30);
                    }, { threshold: 0.5 }).observe(el);
                });

                window.addEventListener('resize', () => {
                    W = wrap.clientWidth || 600; H = wrap.clientHeight || 560;
                    camera.aspect = W / H; camera.updateProjectionMatrix();
                    renderer.setSize(W, H);
                }, { passive: true });
            })();


            // ============================================================
            //  FASE 2 #3: PORTFOLIO CARD — CURSOR-REACTIVE WATER RIPPLE
            //  Dynamic fluid wave that reacts in real-time to cursor speed & position
            // ============================================================
            (function initPortfolioRipple() {
                if (window.matchMedia('(pointer: coarse)').matches) return;

                const dispMap    = document.getElementById('water-disp');
                const turbulence = document.getElementById('water-turbulence');
                if (!dispMap || !turbulence) return;

                let currentScale = 0;
                let targetScale  = 0;
                let activeImg    = null;
                let animId       = null;
                let t            = 0;

                // Mouse tracking state for real-time cursor reactivity
                let lastX    = 0, lastY = 0;
                let mouseVel = 0;
                let normX    = 0.5, normY = 0.5;

                function renderRipple() {
                    t += 0.015;

                    // Mouse velocity decays naturally like fluid drag
                    mouseVel *= 0.91;

                    // Dynamic scale: base scale (10) + velocity impulse from mouse movement (up to +20)
                    const activeTarget = targetScale > 0 ? (10 + Math.min(20, mouseVel * 1.3)) : 0;
                    currentScale += (activeTarget - currentScale) * 0.1;

                    if (currentScale > 0.1 && activeImg) {
                        // Fluid wave pulse driven by cursor activity
                        const wave = currentScale * (1 + Math.sin(t * 2.5) * 0.15);
                        dispMap.setAttribute('scale', wave.toFixed(2));

                        // Wave frequency dynamically follows normalized mouse position on the card
                        const freqX = (0.009 + normX * 0.014 + Math.sin(t * 1.5) * 0.003).toFixed(4);
                        const freqY = (0.013 + normY * 0.016 + Math.cos(t * 1.2) * 0.003).toFixed(4);
                        turbulence.setAttribute('baseFrequency', `${freqX} ${freqY}`);

                        animId = requestAnimationFrame(renderRipple);
                    } else {
                        dispMap.setAttribute('scale', '0');
                        if (activeImg) {
                            activeImg.style.filter = '';
                            activeImg = null;
                        }
                        animId = null;
                    }
                }

                document.querySelectorAll('.card').forEach(card => {
                    const imgEl = card.querySelector('img');
                    if (!imgEl) return;

                    card.addEventListener('mouseenter', (e) => {
                        if (activeImg && activeImg !== imgEl) {
                            activeImg.style.filter = '';
                        }
                        activeImg = imgEl;
                        activeImg.style.filter = 'url(#water-ripple-filter)';
                        targetScale = 10;
                        lastX = e.clientX;
                        lastY = e.clientY;
                        mouseVel = 6; // Splash impulse when cursor enters card
                        if (!animId) animId = requestAnimationFrame(renderRipple);
                    });

                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

                        // Calculate cursor movement speed
                        const dx = e.clientX - lastX;
                        const dy = e.clientY - lastY;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        mouseVel = Math.max(mouseVel, dist);

                        lastX = e.clientX;
                        lastY = e.clientY;
                    });

                    card.addEventListener('mouseleave', () => {
                        if (activeImg === imgEl) {
                            targetScale = 0; // Smoothly fade out when cursor leaves
                        }
                    });
                });
            })();

            // ============================================================
            //  PHILOSOPHY ENGINE v2 — CANVAS CENTRALIZADO + OPTIMIZADO
            //  Arquitectura: UN loop maestro, renderiza solo el canvas activo
            //  Cap1: Caos Digital (Canvas2D, 60 particulas, throttled)
            //  Cap2: Cristal Dodecaedro (Three.js, lazy-init)
            //  Cap3: Red Neuronal (Three.js, lazy-init)
            // ============================================================
            (function initPhilosophyEngine() {

                // ---- Estado central ----
                let activeCanvas = 1;    // 1, 2, o 3
                let sectionVisible = false;
                let masterRafId = null;
                let masterRunning = false;
                const container = document.querySelector('.ph-col-right');

                // ---- Exponer switchPhCanvas globalmente ----
                window.switchPhCanvas = function(n) {
                    if (activeCanvas === n) return;
                    activeCanvas = n;
                    document.querySelectorAll('.ph-chapter-canvas').forEach((c, i) => {
                        c.classList.toggle('active', i + 1 === n);
                    });
                    // Resize el canvas que acaba de activarse
                    if (n === 2 && crystal) crystal.resize();
                    if (n === 3 && neural)  neural.resize();
                };
                window._phCanvasActive = 1;
                const origSwitch = window.switchPhCanvas;
                window.switchPhCanvas = function(n) {
                    window._phCanvasActive = n;
                    origSwitch(n);
                };

                // ---- CAP 01: CAOS DIGITAL (Canvas 2D) ----
                const chaos = (function() {
                    const cvs = document.getElementById('ph-canvas-1');
                    if (!cvs) return null;
                    const ctx = cvs.getContext('2d');
                    const CHARS = '01xyzABC#@!%<>{}|*+-=?~'.split('');
                    const RED = '#e74c3c', AMBER = '#e67e22', DIM = 'rgba(200,50,30,0.22)';
                    let W = 1, H = 1, particles = null;
                    const N = 60; // reduced for perf
                    let lastDraw = 0;
                    const THROTTLE = 33; // ~30fps cap for Canvas2D

                    function resize() {
                        if (!container) return;
                        W = cvs.width  = container.clientWidth  || 350;
                        H = cvs.height = container.clientHeight || 350;
                    }

                    function mkP() {
                        return {
                            x: Math.random() * W, y: Math.random() * H,
                            ch: CHARS[Math.floor(Math.random() * CHARS.length)],
                            sz: 8 + Math.random() * 10,
                            vx: (Math.random() - 0.5) * 0.7,
                            vy: (Math.random() - 0.5) * 0.7,
                            al: 0.2 + Math.random() * 0.55,
                            life: Math.random() * 180, maxLife: 140 + Math.random() * 160,
                            col: Math.random() > 0.4 ? DIM : (Math.random() > 0.5 ? RED : AMBER)
                        };
                    }

                    function draw(ts) {
                        if (ts - lastDraw < THROTTLE) return; // throttle
                        lastDraw = ts;
                        ctx.fillStyle = 'rgba(5,5,5,0.2)';
                        ctx.fillRect(0, 0, W, H);
                        for (const p of particles) {
                            p.life++;
                            if (p.life > p.maxLife) { Object.assign(p, mkP()); p.x = Math.random()*W; p.y = Math.random()*H; }
                            p.x += p.vx + Math.sin(p.life * 0.04) * 0.25;
                            p.y += p.vy + Math.cos(p.life * 0.033) * 0.25;
                            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                            const fade = Math.sin((p.life / p.maxLife) * Math.PI);
                            ctx.globalAlpha = p.al * fade;
                            ctx.fillStyle = (Math.random() < 0.006) ? '#ffffff' : p.col;
                            ctx.font = p.sz + 'px monospace';
                            ctx.fillText(p.ch, p.x, p.y);
                        }
                        ctx.globalAlpha = 1;
                    }

                    function init() {
                        resize();
                        if (!particles) particles = Array.from({ length: N }, mkP);
                        window.addEventListener('resize', resize);
                    }
                    init();
                    return { draw, resize };
                })();

                // ---- CAP 02: CRISTAL THREE.JS (lazy-init) ----
                let crystal = null;
                function initCrystal() {
                    if (crystal || typeof THREE === 'undefined') return;
                    const cvs = document.getElementById('ph-canvas-2');
                    if (!cvs) return;
                    const scene  = new THREE.Scene();
                    const cam    = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
                    cam.position.z = 6.5;
                    const rend = new THREE.WebGLRenderer({ canvas: cvs, antialias: false, alpha: true });
                    rend.setPixelRatio(Math.min(window.devicePixelRatio, 1.3));

                    const col = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#11d483';
                    const geo   = new THREE.DodecahedronGeometry(1.65, 0);
                    const edges = new THREE.EdgesGeometry(geo);
                    const mat   = new THREE.LineBasicMaterial({ color: new THREE.Color(col), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
                    const wire  = new THREE.LineSegments(edges, mat);
                    const igeo  = new THREE.OctahedronGeometry(0.85, 0);
                    const imat  = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
                    const inner = new THREE.LineSegments(new THREE.EdgesGeometry(igeo), imat);
                    const core  = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8),
                        new THREE.MeshBasicMaterial({ color: new THREE.Color(col), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));

                    // Photons — 12 only for perf
                    const PCOUNT = 12;
                    const pGeo = new THREE.BufferGeometry();
                    const pPos = new Float32Array(PCOUNT * 3);
                    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
                    const pMat  = new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
                    const pPts  = new THREE.Points(pGeo, pMat);

                    const eArr = edges.getAttribute('position').array;
                    const eCnt = eArr.length / 6;
                    const pData = Array.from({ length: PCOUNT }, () => {
                        const ei = Math.floor(Math.random() * eCnt) * 6;
                        return { ax: eArr[ei], ay: eArr[ei+1], az: eArr[ei+2], bx: eArr[ei+3], by: eArr[ei+4], bz: eArr[ei+5], t: Math.random(), sp: 0.009 + Math.random() * 0.011 };
                    });

                    const grp = new THREE.Group();
                    grp.add(wire, inner, core, pPts);
                    scene.add(grp);
                    const clk = new THREE.Clock();
                    let mx = 0, my = 0, tx = 0, ty = 0;
                    if (container) {
                        container.addEventListener('mousemove', e => {
                            const r = container.getBoundingClientRect();
                            tx = ((e.clientX - r.left) / r.width  - 0.5) * 0.55;
                            ty = ((e.clientY - r.top)  / r.height - 0.5) * 0.55;
                        });
                        container.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
                    }

                    function draw() {
                        const t = clk.getElapsedTime();
                        mx += (tx - mx) * 0.07; my += (ty - my) * 0.07;
                        grp.rotation.y  = t * 0.11 + mx;
                        grp.rotation.x  = t * 0.065 + my;
                        inner.rotation.y = -t * 0.21;
                        inner.rotation.z =  t * 0.13;
                        core.material.opacity = 0.55 + Math.sin(t * 3.8) * 0.3;
                        pData.forEach((p, i) => {
                            p.t += p.sp;
                            if (p.t > 1) { p.t = 0; const ei = Math.floor(Math.random() * eCnt) * 6; p.ax=eArr[ei];p.ay=eArr[ei+1];p.az=eArr[ei+2];p.bx=eArr[ei+3];p.by=eArr[ei+4];p.bz=eArr[ei+5]; }
                            pPos[i*3]   = p.ax + (p.bx-p.ax)*p.t;
                            pPos[i*3+1] = p.ay + (p.by-p.ay)*p.t;
                            pPos[i*3+2] = p.az + (p.bz-p.az)*p.t;
                        });
                        pGeo.getAttribute('position').needsUpdate = true;
                        rend.render(scene, cam);
                    }

                    function resize() {
                        if (!container) return;
                        const w = container.clientWidth || 350;
                        const h = container.clientHeight || 350;
                        cam.aspect = w / h;
                        cam.updateProjectionMatrix();
                        rend.setSize(w, h);
                    }
                    window.addEventListener('resize', resize);
                    resize();
                    crystal = { draw, resize };
                }

                // ---- CAP 03: RED NEURONAL THREE.JS (lazy-init) ----
                let neural = null;
                function initNeural() {
                    if (neural || typeof THREE === 'undefined') return;
                    const cvs = document.getElementById('ph-canvas-3');
                    if (!cvs) return;
                    const scene = new THREE.Scene();
                    const cam   = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
                    cam.position.z = 7;
                    const rend = new THREE.WebGLRenderer({ canvas: cvs, antialias: false, alpha: true });
                    rend.setPixelRatio(Math.min(window.devicePixelRatio, 1.3));

                    const col = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#11d483';

                    // Nodos — 22 para perf
                    const NODES = 22;
                    const nodePos = [], nodeMeshes = [];
                    const nGrp = new THREE.Group();

                    for (let i = 0; i < NODES; i++) {
                        const theta = Math.acos(1 - 2*(i+0.5)/NODES);
                        const phi   = Math.PI * (1 + Math.sqrt(5)) * i;
                        const r = 2.2 + Math.random() * 0.7;
                        const v = new THREE.Vector3(r*Math.sin(theta)*Math.cos(phi), r*Math.sin(theta)*Math.sin(phi), r*Math.cos(theta));
                        nodePos.push(v);
                        const m = new THREE.Mesh(
                            new THREE.SphereGeometry(0.055 + Math.random() * 0.04, 6, 6),
                            new THREE.MeshBasicMaterial({ color: new THREE.Color(col), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
                        );
                        m.position.copy(v);
                        nGrp.add(m);
                        nodeMeshes.push(m);
                    }

                    // Axones
                    const MAX_D = 2.5;
                    const axonLines = [];
                    nodePos.forEach((a, i) => nodePos.forEach((b, j) => { if (j > i && a.distanceTo(b) < MAX_D) axonLines.push([i,j]); }));
                    const aCnt = axonLines.length;
                    const aPosArr = new Float32Array(aCnt * 6);
                    axonLines.forEach(([a,b],idx) => {
                        aPosArr[idx*6]=nodePos[a].x;aPosArr[idx*6+1]=nodePos[a].y;aPosArr[idx*6+2]=nodePos[a].z;
                        aPosArr[idx*6+3]=nodePos[b].x;aPosArr[idx*6+4]=nodePos[b].y;aPosArr[idx*6+5]=nodePos[b].z;
                    });
                    const aGeo = new THREE.BufferGeometry();
                    aGeo.setAttribute('position', new THREE.BufferAttribute(aPosArr, 3));
                    const aLines = new THREE.LineSegments(aGeo, new THREE.LineBasicMaterial({ color: new THREE.Color(col), transparent: true, opacity: 0.11, blending: THREE.AdditiveBlending }));
                    nGrp.add(aLines);

                    // Pulsos — 8 para perf
                    const PULSES = 8;
                    const pGeo = new THREE.BufferGeometry();
                    const pPos = new Float32Array(PULSES * 3);
                    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
                    const pPts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
                    nGrp.add(pPts);
                    const pData = Array.from({ length: PULSES }, () => ({ ai: Math.floor(Math.random()*aCnt), t: Math.random(), sp: 0.007+Math.random()*0.009 }));

                    scene.add(nGrp);
                    const clk = new THREE.Clock();

                    function draw() {
                        const t = clk.getElapsedTime();
                        nGrp.rotation.y = t * 0.065;
                        nGrp.rotation.x = Math.sin(t * 0.14) * 0.10;
                        nodeMeshes.forEach((m, i) => {
                            const s = 1 + 0.13 * Math.sin(t * 2.3 + i * 0.85);
                            m.scale.setScalar(s);
                            m.material.opacity = 0.7 + 0.25 * Math.sin(t * 2.1 + i * 0.9);
                        });
                        pData.forEach((p, pi) => {
                            p.t += p.sp;
                            if (p.t > 1) { p.t = 0; p.ai = Math.floor(Math.random() * aCnt); }
                            const [ai, bi] = axonLines[p.ai];
                            const tempPulseVec = new THREE.Vector3(); tempPulseVec.copy(nodePos[ai]).lerp(nodePos[bi], p.t); const np = tempPulseVec;
                            pPos[pi*3]=np.x; pPos[pi*3+1]=np.y; pPos[pi*3+2]=np.z;
                        });
                        pGeo.getAttribute('position').needsUpdate = true;
                        rend.render(scene, cam);
                    }

                    function resize() {
                        if (!container) return;
                        const w = container.clientWidth || 350;
                        const h = container.clientHeight || 350;
                        cam.aspect = w / h;
                        cam.updateProjectionMatrix();
                        rend.setSize(w, h);
                    }
                    window.addEventListener('resize', resize);
                    resize();
                    neural = { draw, resize };
                }

                // ---- MASTER LOOP — Solo renderiza el canvas activo ----
                function masterLoop(ts) {
                    if (!masterRunning) return;
                    masterRafId = requestAnimationFrame(masterLoop);
                    const ac = activeCanvas;

                    if (ac === 1 && chaos) {
                        chaos.draw(ts);
                    } else if (ac === 2) {
                        if (!crystal) initCrystal();
                        if (crystal) crystal.draw();
                    } else if (ac === 3) {
                        if (!neural) initNeural();
                        if (neural) neural.draw();
                    }
                }

                function startMaster() {
                    if (masterRunning) return;
                    masterRunning = true;
                    masterRafId = requestAnimationFrame(masterLoop);
                }

                function stopMaster() {
                    masterRunning = false;
                    if (masterRafId) { cancelAnimationFrame(masterRafId); masterRafId = null; }
                }

                // ---- Observer en el CONTENEDOR (no en los canvas individuales) ----
                if (container) {
                    const obs = new IntersectionObserver(entries => {
                        sectionVisible = entries[0].isIntersecting;
                        if (sectionVisible) startMaster();
                        else stopMaster();
                    }, { threshold: 0.01 });
                    obs.observe(container);
                }

                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) stopMaster();
                    else if (sectionVisible) startMaster();
                });

                window.addEventListener('resize', () => {
                    if (chaos) chaos.resize();
                    if (crystal && activeCanvas === 2) crystal.resize();
                    if (neural  && activeCanvas === 3) neural.resize();
                });

            })();










    function init3DCore() {
        
        const container = document.getElementById('canvas-3d-container');
        if (!container) return;
        if (typeof THREE === 'undefined') {
            throw new Error("Three.js library is not loaded! THREE is undefined.");
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 7.5);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        // 1. Crear Textura Programática de Partícula con Gradiente Radial
        function createParticleTexture() {
            const canvas = document.createElement('canvas');
            const size = 32;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size / 2;

            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
            gradient.addColorStop(0.3, 'rgba(17,212,131,0.85)');
            gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
            
            // Define the circular path for the particle shape
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.closePath();
            
            ctx.fillStyle = gradient;
            ctx.fill();

            const tex = new THREE.CanvasTexture(canvas);
            tex.needsUpdate = true;
            return tex;
        }

        // 2. Configuración de 2,400 Partículas Gravitacionales de Alta Densidad (Optimizado para 60/120 FPS)
        const particleCount = 2400; 
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const nodeData = [];             // Posiciones target de la V
        const disintegrationOffsets = []; // Offsets de disolución cíclica
        const homeDistances = new Float32Array(particleCount); // Precalculado de distancias
        
        const maxHomeRadius = 5.0;
        let shockwaves = [];             // Cola de ondas expansivas

        // Generar coordenadas tridimensionales de la V y envolvente cuántica
        for (let i = 0; i < particleCount; i++) {
            let x, y, z;
            const isHalo = i >= 1800; // 600 partículas para aura de stardust ambiental

            if (isHalo) {
                // Aura estelar sutil alrededor de la V
                const ang = Math.random() * Math.PI * 2;
                const rad = 0.4 + Math.random() * 2.2;
                x = Math.cos(ang) * rad * 0.9;
                y = (Math.sin(ang) * rad * 1.1) - 0.2;
                z = (Math.random() - 0.5) * 1.2;
            } else if (i < 900) {
                // Rama izquierda de la V (t de 0 a 1)
                const t = i / 900;
                x = -1.35 * (1 - t);
                y = 1.95 * (1 - t) - 1.55 * t;
                const rOffset = Math.random() * 0.18;
                const thetaOffset = Math.random() * Math.PI * 2;
                x += Math.cos(thetaOffset) * rOffset;
                y += Math.sin(thetaOffset) * rOffset;
                z = (Math.random() - 0.5) * 0.45;
            } else {
                // Rama derecha de la V (t de 0 a 1)
                const t = (i - 900) / 900;
                x = 1.35 * (1 - t);
                y = 1.95 * (1 - t) - 1.55 * t;
                const rOffset = Math.random() * 0.18;
                const thetaOffset = Math.random() * Math.PI * 2;
                x += Math.cos(thetaOffset) * rOffset;
                y += Math.sin(thetaOffset) * rOffset;
                z = (Math.random() - 0.5) * 0.45;
            }

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const vec = new THREE.Vector3(x, y, z);
            nodeData.push(vec);
            homeDistances[i] = vec.length() + 1e-6;

            colors[i * 3] = 0.5;
            colors[i * 3 + 1] = 1.0;
            colors[i * 3 + 2] = 0.7;

            const offsetStrength = 5.0 + Math.random() * 6.0;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.acos(2 * Math.random() - 1);
            disintegrationOffsets.push(new THREE.Vector3(
                Math.sin(theta) * Math.cos(phi) * offsetStrength,
                Math.sin(theta) * Math.sin(phi) * offsetStrength,
                Math.cos(theta) * offsetStrength * 0.3
            ));
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Material premium con AdditiveBlending y tamaño aumentado para densidad
        const logoMaterial = new THREE.PointsMaterial({
            size: 7.0,              // 7 píxeles de pantalla exactos
            sizeAttenuation: false, // Desactivar atenuación para nitidez perfecta sin importar la cámara
            map: createParticleTexture(),
            vertexColors: true,
            transparent: true,
            opacity: 0.0,           // Inicia invisible, se anima en la entrada
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            alphaTest: 0.005
        });

        const points = new THREE.Points(geometry, logoMaterial);
        
        const logoGroup = new THREE.Group();
        logoGroup.add(points);
        logoGroup.scale.setScalar(0.0001); // Escala inicial cero
        scene.add(logoGroup);

        // 3. Crear Terreno de Rejilla Vectorial (PlaneGeometry para el fondo)
        const terrainGeometry = new THREE.PlaneGeometry(45, 45, 28, 28);
        const terrainMaterial = new THREE.MeshBasicMaterial({
            color: 0x11d483,
            wireframe: true,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending
        });

        const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrainMesh.rotation.x = -Math.PI / 2.2;
        terrainMesh.position.set(0, -2.5, -2.0);
        scene.add(terrainMesh);

        // Guardar posiciones originales de la rejilla
        const terrainPosAttr = terrainGeometry.getAttribute('position');
        const originalZ = new Float32Array(terrainPosAttr.count);
        for (let i = 0; i < terrainPosAttr.count; i++) {
            originalZ[i] = terrainPosAttr.getZ(i);
        }

        // Posicionamiento responsivo del logo
        const updateLogoPosition = () => {
            if (window.innerWidth > 991) {
                logoGroup.position.x = 3.3; // Totalmente a la derecha en escritorio
            } else {
                logoGroup.position.x = 0;   // Centrado en móviles
            }
        };
        updateLogoPosition();

        // Variables de interacción y física de scroll
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        let lastScrollY = window.scrollY || window.pageYOffset || 0;
        let scrollVelocity = 0;
        let flowOffset = 0;
        let logoScaleObj = { value: 0.0001 };
        let logoRotationObj = { y: 3.5 };

        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - window.innerWidth / (window.innerWidth > 991 ? 1.4 : 2)) * 0.0006;
            targetY = (e.clientY - window.innerHeight / 2) * 0.0006;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updateLogoPosition();
        });

        // Disparador de Shockwaves al hacer click en el Hero
        window.addEventListener('click', (e) => {
            if (window.scrollY < window.innerHeight * 0.8) {
                triggerShockwave({ amplitude: 7.5, speed: 12.0, width: 0.8, decay: 1.25 });
            }
        });

        function triggerShockwave(opts = {}) {
            const { amplitude = 7.5, speed = 12.0, width = 0.8, decay = 1.25 } = opts;
            shockwaves.push({ t0: clock.getElapsedTime(), amplitude, speed, width, decay });
            if (shockwaves.length > 5) shockwaves.shift();
        }

        // 4. Función global de entrada elástica de la V + Flash
        window.play3DVEntranceAnimation = function() {
            
            if (typeof gsap !== 'undefined') {
                gsap.killTweensOf(logoScaleObj);
                gsap.killTweensOf(logoRotationObj);
                
                gsap.fromTo(logoScaleObj,
                    { value: 0.0001 },
                    { value: 1.0, duration: 2.2, ease: 'elastic.out(0.85, 0.68)' }
                );
                
                gsap.fromTo(logoRotationObj,
                    { y: 3.5 },
                    { y: 0.0, duration: 2.8, ease: 'power2.out' }
                );
            } else {
                logoScaleObj.value = 1.0;
                logoRotationObj.y = 0.0;
            }
            
            // Destello flash blanco (se lerpea en el bucle animate)
            logoMaterial.color.setRGB(2.0, 2.0, 2.0);
        };

        // Resiliencia: si las cortinas ya se abrieron, arrancar animación
        const curtainA = document.querySelector('.hero-curtain.curtain-a');
        const preloaderEl = document.getElementById('preloader');
        if (!curtainA || curtainA.classList.contains('opened') || (preloaderEl && preloaderEl.style.display === 'none')) {
            setTimeout(() => {
                if (window.play3DVEntranceAnimation) window.play3DVEntranceAnimation();
            }, 100);
        }

        const clock = new THREE.Clock();
 
        let animationFrameId = null;

        // Viewport Auto-Sleep Engine (Zero GPU usage when off-screen)
        let isSceneVisible = true;
        const heroSectionEl = document.getElementById('home');
        const portfolioSectionEl = document.getElementById('portfolio');
        let heroInView = true;
        let portfolioInView = false;

        function checkSceneActive() {
            const shouldBeActive = (heroInView || portfolioInView) && !document.hidden;
            if (shouldBeActive !== isSceneVisible) {
                isSceneVisible = shouldBeActive;
                if (!isSceneVisible && animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                } else if (isSceneVisible && !animationFrameId) {
                    animate();
                }
            }
        }

        if ('IntersectionObserver' in window) {
            if (heroSectionEl) {
                new IntersectionObserver((entries) => {
                    heroInView = entries[0].isIntersecting;
                    checkSceneActive();
                }, { threshold: 0.01 }).observe(heroSectionEl);
            }
            if (portfolioSectionEl) {
                new IntersectionObserver((entries) => {
                    portfolioInView = entries[0].isIntersecting;
                    checkSceneActive();
                }, { threshold: 0.01 }).observe(portfolioSectionEl);
            }
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            } else {
                if (!animationFrameId && isSceneVisible) {
                    animate();
                }
            }
        });

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            if (document.hidden) return;

            const currentScroll = window.scrollY || window.pageYOffset || 0;
            const time = clock.getElapsedTime();
            const deltaScroll = currentScroll - lastScrollY;
            lastScrollY = currentScroll;

            const heroHeight = window.innerHeight;
            const inHero = currentScroll <= heroHeight * 1.2;
            const progress = Math.min(currentScroll / (heroHeight * 1.2), 1.0);

            scrollVelocity += (Math.abs(deltaScroll) - scrollVelocity) * 0.08;
            const clampedVelocity = Math.min(scrollVelocity, 120);

            // Colores neón dinámicos
            let primaryColor = new THREE.Color(0x11d483);
            if (window.currentPrimaryColor) {
                primaryColor.setStyle(window.currentPrimaryColor);
            }
            logoMaterial.color.lerp(primaryColor, 0.06);
            terrainMaterial.color.lerp(primaryColor, 0.06);

            // --- V LOGO (solo en Hero) ---
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;

            if (inHero) {
                const swayY = Math.sin(time * 0.2) * 0.08;
                const swayX = Math.cos(time * 0.15) * 0.04;
                logoGroup.rotation.y = logoRotationObj.y + swayY + mouseX * 0.65;
                logoGroup.rotation.x = swayX + mouseY * 0.55;
                const logoOpacity = Math.max(0, 1.0 - progress * 2.5);
                logoMaterial.opacity = logoOpacity * 0.85;
                logoGroup.scale.setScalar(0.92 * (1.0 - progress * 0.35) * logoScaleObj.value);
                logoGroup.position.y = -0.7 + progress * 3.2;

                // Partículas de la V
                const posAttr = geometry.getAttribute('position');
                const colAttr = geometry.getAttribute('color');
                const posArray = posAttr.array;
                const colArray = colAttr.array;

                const waveSpeed = 1.3;
                const waveFreqY = 0.75;
                const waveFreqX = 0.55;
                const pulseSpeed = 1.6;
                const pulseLength = 1.1;
                const pulseCenter = -1.6 + ((time * pulseSpeed) % (3.6 + pulseLength));

                // Cursor Gravitational Interaction Coordinates
                const mouseWorldX = (mouseX / 0.0006) * 0.004;
                const mouseWorldY = (-mouseY / 0.0006) * 0.004;

                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    const home = nodeData[i];
                    const dist = homeDistances[i];

                    const waveX = Math.sin(time * waveSpeed + home.y * waveFreqY) * 0.12;
                    const waveY = Math.cos(time * waveSpeed * 0.85 + home.x * waveFreqX) * 0.08;
                    const waveZ = Math.sin(time * waveSpeed * 1.1 + (home.x + home.y) * 0.5) * 0.08;

                    const distToPulse = Math.abs(home.y - pulseCenter);
                    let pulseFactor = 0.0;
                    if (distToPulse < pulseLength) {
                        pulseFactor = Math.cos((distToPulse / pulseLength) * Math.PI * 0.5);
                    }

                    const pulseDisplace = pulseFactor * 0.07;
                    const dirX = home.x > 0 ? 1.0 : -1.0;

                    // Micro-gravitational swirl near mouse
                    const dx = posArray[i3] - mouseWorldX;
                    const dy = posArray[i3 + 1] - mouseWorldY;
                    const mDistSq = dx * dx + dy * dy + 0.15;
                    let gravX = 0, gravY = 0;
                    if (mDistSq < 4.0) {
                        const mForce = 0.12 / mDistSq;
                        gravX = -dy * mForce * 0.8 + dx * mForce * 0.4;
                        gravY = dx * mForce * 0.8 + dy * mForce * 0.4;
                    }

                    let addX = 0, addY = 0, addZ = 0;
                    for (let w = 0; w < shockwaves.length; w++) {
                        const sw = shockwaves[w];
                        const elapsed = Math.max(0, time - sw.t0);
                        const R = sw.speed * elapsed;
                        const sigma = sw.width;
                        const decayFactor = Math.exp(-sw.decay * elapsed);
                        const g = Math.exp(-((dist - R) * (dist - R)) / (2 * sigma * sigma));
                        const amp = sw.amplitude * g * decayFactor;
                        addX += (home.x / dist) * amp;
                        addY += (home.y / dist) * amp;
                        addZ += (home.z / dist) * amp * 0.5;
                    }

                    const lerpFactor = 0.085;
                    posArray[i3]     += (home.x + waveX + (dirX * pulseDisplace) + addX + gravX - posArray[i3]) * lerpFactor;
                    posArray[i3 + 1] += (home.y + waveY + addY + gravY - posArray[i3 + 1]) * lerpFactor;
                    posArray[i3 + 2] += (home.z + waveZ + addZ - posArray[i3 + 2]) * lerpFactor;

                    let bright = 0.55 + Math.sin(time * 2.2 + (i % 8)) * 0.12 + pulseFactor * 1.1;
                    colArray[i3]     = logoMaterial.color.r * bright;
                    colArray[i3 + 1] = logoMaterial.color.g * bright;
                    colArray[i3 + 2] = logoMaterial.color.b * bright;
                }
                posAttr.needsUpdate = true;
                colAttr.needsUpdate = true;

                // Limpiar shockwaves vencidas
                if (shockwaves.length) {
                    shockwaves = shockwaves.filter(sw => (time - sw.t0) < 3.0);
                }
            } else {
                logoMaterial.opacity = 0;
            }

            // Opacidad del terreno de olas 3D: NUNCA en el Hero ni al scrollear en Hero/Filosofía.
            // Se activa únicamente al entrar al apartado "Nuestro Trabajo" (#portfolio)
            // Ultra-optimizado: cálculo puramente matemático sin getBoundingClientRect() en bucle 60 FPS
            let terrainOpacity = 0;
            if (portfolioHeight > 0) {
                const windowH = window.innerHeight;
                const relTop = portfolioTop - currentScroll;
                if (relTop < windowH && (relTop + portfolioHeight) > 0) {
                    const enteringProgress = Math.min(1.0, Math.max(0, (windowH - relTop) / (windowH * 0.6)));
                    terrainOpacity = enteringProgress * 0.22;
                } else if ((relTop + portfolioHeight) <= 0) {
                    terrainOpacity = 0.22; // En secciones posteriores a Nuestro Trabajo
                } else {
                    terrainOpacity = 0; // Arriba de #portfolio (Hero y Filosofía) -> CERO olas
                }
            }
            terrainMaterial.opacity = terrainOpacity;

            // --- TERRAIN DE OLAS: Solo mutar vértices si el terreno tiene opacidad visible ---
            if (terrainOpacity > 0.005) {
                flowOffset += 0.012 + clampedVelocity * 0.0018;
                const amplitudeFactor = 0.4 + clampedVelocity * 0.007;

                const terrainPos = terrainGeometry.getAttribute('position');
                for (let i = 0; i < terrainPos.count; i++) {
                    const x = terrainPos.getX(i);
                    const y = terrainPos.getY(i);
                    const waveHeight = Math.sin(x * 0.18 + y * 0.14 - flowOffset) * amplitudeFactor;
                    terrainPos.setZ(i, originalZ[i] + waveHeight);
                }
                terrainPos.needsUpdate = true;
                terrainMesh.rotation.x = -Math.PI / 2.2 + clampedVelocity * 0.0006;
            }

            // Solo renderizar si el Logo V o el Terreno están visibles
            if (inHero || terrainOpacity > 0.005) {
                renderer.render(scene, camera);
            }
        }

        // Inicio inteligente: verificar si hero ya está en viewport antes de lanzar
        const _heroRect = heroSectionEl ? heroSectionEl.getBoundingClientRect() : null;
        const _heroAlreadyVisible = _heroRect && _heroRect.top < window.innerHeight && _heroRect.bottom > 0;
        heroInView = !!_heroAlreadyVisible;
        isSceneVisible = heroInView || portfolioInView;
        if (isSceneVisible) animate();
    }
    /* =========================================================
       12. LENIS SMOOTH SCROLL (INERCIAL UNIFICADO)
       ========================================================= */
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            lerp: 0.08, // Fricción reducida para máxima suavidad Awwwards
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.0,
            smoothTouch: false,
            touchMultiplier: 1.2,
            infinite: false,
        });
        window.lenis = lenis;

        // Pause Lenis during preload
        const preloaderEl = document.getElementById('preloader');
        if (preloaderEl && preloaderEl.style.display !== 'none') {
            lenis.stop();
        }

        // Sincronización oficial GSAP Ticker + Lenis (Zero Jitter / 60 FPS unificado)
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
        }
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        // Enlaces de navegación con scroll suave vía Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    // duration: 1.2 segundos para una transición suave y elegante
                    lenis.scrollTo(target, { offset: 0, duration: 1.2 });
                }
            });
        });
    }

    /* =========================================================
       13. SCROLL HORIZONTAL (PORTAFOLIO)
       ========================================================= */
    const portfolioContainer = document.querySelector('.portfolio-scroll-container');
    const horizontalTrack    = document.querySelector('.horizontal-track');
    
    // Cache de dimensiones para evitar getBoundingClientRect en scroll
    let portfolioTop = 0;
    let portfolioHeight = 0;
    let maxTranslate = 0;

    function cachePortfolioLayout() {
        if (!portfolioContainer || !horizontalTrack) return;
        // offsetTop nos da la posición acumulada desde el inicio de la página sin forzar reflow pesado
        let top = 0;
        let obj = portfolioContainer;
        while (obj) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        portfolioTop = top;
        portfolioHeight = portfolioContainer.offsetHeight;
        maxTranslate = horizontalTrack.scrollWidth - window.innerWidth;
    }

    function handleHorizontalScroll(scrollY) {
        if (!portfolioContainer || !horizontalTrack || window.innerWidth <= 991) {
            if (horizontalTrack) horizontalTrack.style.transform = 'none';
            return;
        }

        const vpH = window.innerHeight;
        // Viewport Culling: salir de inmediato si el scroll está fuera del rango del portafolio
        if (scrollY < portfolioTop - vpH || scrollY > portfolioTop + portfolioHeight) {
            return;
        }

        const startOffset = scrollY - portfolioTop;
        const maxScroll = portfolioHeight - vpH;
        
        let progress = startOffset / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        const translateX = -progress * maxTranslate;
        horizontalTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;

        // Parallax horizontal multicapa matemático (Cero getBoundingClientRect / Cero Reflow)
        const cards = horizontalTrack.children;
        const viewportW = window.innerWidth;
        const totalCards = cards.length;
        if (totalCards > 0) {
            const cardWidth = (horizontalTrack.scrollWidth / totalCards);
            for (let i = 0; i < totalCards; i++) {
                const card = cards[i];
                const cardCenterX = i * cardWidth + translateX + cardWidth / 2;
                // Solo calcular si la tarjeta está cerca de la pantalla
                if (cardCenterX > -cardWidth && cardCenterX < viewportW + cardWidth) {
                    let offset = (cardCenterX - viewportW / 2) / (viewportW / 2);
                    offset = Math.max(-1.5, Math.min(1.5, offset));
                    card.style.setProperty('--card-parallax-bg', `${(offset * 30).toFixed(1)}px`);
                    card.style.setProperty('--card-parallax-fg', `${(offset * -45).toFixed(1)}px`);
                }
            }
        }
    }

    /* =========================================================
       14. SCROLL INVERTIDO (SERVICIOS)
       ========================================================= */
    const servicesContainer = document.querySelector('.services-scroll-container');
    const invertedTrack     = document.querySelector('.services-inverted-track');
    const textItems         = document.querySelectorAll('.service-text-item');

    let servicesTop = 0;
    let servicesHeight = 0;

    function cacheServicesLayout() {
        if (!servicesContainer) return;
        let top = 0;
        let obj = servicesContainer;
        while (obj) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        servicesTop = top;
        servicesHeight = servicesContainer.offsetHeight;
    }

    let lastServicesIndex = -1;
    function handleInvertedScroll(scrollY) {
        if (!servicesContainer || !invertedTrack || window.innerWidth <= 991) {
            if (invertedTrack) invertedTrack.style.transform = 'none';
            return;
        }

        const vpH = window.innerHeight;
        // Viewport Culling
        if (scrollY < servicesTop - vpH || scrollY > servicesTop + servicesHeight) {
            return;
        }

        const startOffset = scrollY - servicesTop;
        const maxScroll = servicesHeight - vpH;
        
        let progress = startOffset / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        const translateValue = -200 + (progress * 200);
        invertedTrack.style.transform = `translate3d(0, ${translateValue}vh, 0)`;

        let activeIndex = 0;
        if (progress > 0.33 && progress <= 0.66) {
            activeIndex = 1;
        } else if (progress > 0.66) {
            activeIndex = 2;
        }

        if (activeIndex !== lastServicesIndex) {
            lastServicesIndex = activeIndex;
            textItems.forEach((item, index) => {
                if (index === activeIndex) {
                    if (!item.classList.contains('active')) item.classList.add('active');
                } else {
                    if (item.classList.contains('active')) item.classList.remove('active');
                }
            });
        }
    }

    /* =========================================================
       14b. SCROLL LOCK METODOLOGÍA (PIPELINE & TERMINAL)
       ========================================================= */
    const methodologyContainer = document.querySelector('.methodology-scroll-container');
    const pipelineProgress     = document.querySelector('.pipeline-progress-bar');
    const methodSteps          = document.querySelectorAll('.methodology-left .method-step');
    const consoleScreens       = document.querySelectorAll('.cyber-terminal .console-screen');

    let methodologyTop = 0;
    let methodologyHeight = 0;

    function cacheMethodologyLayout() {
        if (!methodologyContainer) return;
        let top = 0;
        let obj = methodologyContainer;
        while (obj) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        methodologyTop = top;
        methodologyHeight = methodologyContainer.offsetHeight;
    }

    let lastMethodStep = -1;
    function handleMethodologyScroll(scrollY) {
        if (!methodologyContainer || window.innerWidth <= 991) {
            methodSteps.forEach(step => step.classList.add('active'));
            return;
        }

        const vpH = window.innerHeight;
        // Viewport Culling
        if (scrollY < methodologyTop - vpH || scrollY > methodologyTop + methodologyHeight) {
            return;
        }

        const startOffset = scrollY - methodologyTop;
        const maxScroll = methodologyHeight - vpH;
        
        let progress = startOffset / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        // Actualizar barra de progreso vertical
        if (pipelineProgress) {
            pipelineProgress.style.height = (progress * 100).toFixed(1) + '%';
        }

        // Determinar paso activo (4 pasos en total: dividimos por rangos de 0.25)
        let activeStep = 1;
        if (progress > 0.25 && progress <= 0.5) {
            activeStep = 2;
        } else if (progress > 0.5 && progress <= 0.75) {
            activeStep = 3;
        } else if (progress > 0.75) {
            activeStep = 4;
        }

        if (activeStep !== lastMethodStep) {
            lastMethodStep = activeStep;
            // Activar la tarjeta de paso correspondiente
            methodSteps.forEach(step => {
                const stepNum = parseInt(step.getAttribute('data-step'), 10);
                if (stepNum === activeStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });

            // Activar la pantalla de la terminal correspondiente
            consoleScreens.forEach(screen => {
                const screenNum = parseInt(screen.getAttribute('data-console-step'), 10);
                if (screenNum === activeStep) {
                    screen.classList.add('active');
                } else {
                    screen.classList.remove('active');
                }
            });
        }
    }

    // Calcular layouts iniciales y en cada resize
    function updateLayoutCache() {
        cachePortfolioLayout();
        cacheServicesLayout();
        cacheMethodologyLayout();
    }
    window.addEventListener('resize', updateLayoutCache, { passive: true });

    // Scroll listener unificado y súper optimizado
    function handleScrollUnified(scrollY) {
        currentScrollY = scrollY;
        
        // Parallax del Hero
        if (scrollY < 800) {
            if (heroCenterLayout) {
                heroCenterLayout.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
                heroCenterLayout.style.opacity   = 1 - scrollY / 650;
            }
            if (heroBlueprintContainer) {
                const factor = scrollY / (heroH || 800);
                heroBlueprintContainer.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0) scale(${1 - factor * 0.06})`;
            }
        }

        // Actualizar navbar
        updateNavbar(scrollY);

        // Scroll horizontal e invertido y metodología
        handleHorizontalScroll(scrollY);
        handleInvertedScroll(scrollY);
        handleMethodologyScroll(scrollY);
    }

    if (lenis) {
        lenis.on('scroll', (e) => {
            // Sincronizado directamente al RAF de Lenis
            handleScrollUnified(e.scroll);
        });
    } else {
        window.addEventListener('scroll', () => {
            handleScrollUnified(window.scrollY || window.pageYOffset);
        }, { passive: true });
    }

    // Intersection Observer para textos revelables (Costo de rendimiento = 0)
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-text').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── 🔊 GENERATIVE WEB AUDIO UI SYNTHESIZER ───
    const UISound = {
        ctx: null,
        enabled: false,
        init() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            } catch(e) {}
        },
        toggle(forceState) {
            this.enabled = typeof forceState === 'boolean' ? forceState : !this.enabled;
            const btn = document.getElementById('audio-toggle-btn');
            if (btn) {
                const iconOff = btn.querySelector('.audio-icon-off');
                const iconOn  = btn.querySelector('.audio-icon-on');
                if (this.enabled) {
                    if (iconOff) iconOff.style.display = 'none';
                    if (iconOn)  iconOn.style.display = 'inline-block';
                    btn.classList.add('active');
                    this.playClick();
                } else {
                    if (iconOff) iconOff.style.display = 'inline-block';
                    if (iconOn)  iconOn.style.display = 'none';
                    btn.classList.remove('active');
                }
            }
            return this.enabled;
        },
        playTick() {
            if (!this.enabled || !this.ctx) return;
            try {
                if (this.ctx.state === 'suspended') this.ctx.resume();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(2800, this.ctx.currentTime + 0.03);
                gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.04);
            } catch(e) {}
        },
        playClick() {
            if (!this.enabled || !this.ctx) return;
            try {
                if (this.ctx.state === 'suspended') this.ctx.resume();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(220, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.09);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.1);
            } catch(e) {}
        }
    };
    window.UISound = UISound;
    UISound.init();

    // Hook audio toggle button
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            UISound.toggle();
        });
    }

    // Attach hover ticks to all interactive elements
    document.querySelectorAll('.btn, .btn-outline, .card, .plan-tab-btn, .modal-tab-btn, .nav-links a').forEach(el => {
        el.addEventListener('mouseenter', () => UISound.playTick());
        el.addEventListener('click', () => UISound.playClick());
    });

    // ─── 🌐 TECH BENTO GRID TILT ───
    function initTechBentoTilt() {
        const cards = document.querySelectorAll('.tech-bento-card.tilt-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });

            card.addEventListener('mouseenter', () => {
                if (window.UISound) window.UISound.playTick();
            });

            card.addEventListener('click', () => {
                if (window.UISound) window.UISound.playClick();
            });
        });
    }

    // ─── ✨ COSMIC SPARKLES CANVAS (tecnologias.tsx) ───
    function initSparklesCanvas() {
        const canvas = document.getElementById('sparkles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
        let height = canvas.parentElement ? canvas.parentElement.clientHeight : 600;
        let particles = [];

        function resize() {
            if (!canvas.parentElement) return;
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }

        class Sparkle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.2 + 0.6;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.opacitySpeed = (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
                this.color = Math.random() > 0.35 ? '#ffffff' : '#11d483';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.opacity += this.opacitySpeed;
                if (this.opacity >= 1 || this.opacity <= 0.1) {
                    this.opacitySpeed = -this.opacitySpeed;
                }
                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < 60; i++) { // 250→60 partículas, invisible de cerca
                particles.push(new Sparkle());
            }
        }

        let sparklesRafId = null;
        let sparklesVisible = false;

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            sparklesRafId = requestAnimationFrame(animate);
        }

        init();
        window.addEventListener('resize', resize);

        if (canvas.parentElement && 'IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                sparklesVisible = entries[0].isIntersecting;
                if (sparklesVisible && !sparklesRafId) {
                    animate();
                } else if (!sparklesVisible && sparklesRafId) {
                    cancelAnimationFrame(sparklesRafId);
                    sparklesRafId = null;
                }
            }, { threshold: 0.05 }).observe(canvas.parentElement);
        } else {
            animate(); // fallback
        }
    }

    // ─── 🧠 NEURAL FLOW FIELD CANVAS (final.tsx) ───
    function initNeuralCanvas() {
        const canvas = document.getElementById('neural-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
        let height = canvas.parentElement ? canvas.parentElement.clientHeight : 600;
        let particles = [];
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            if (!canvas.parentElement) return;
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }

        class NeuralParticle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = 0;
                this.vy = 0;
                this.age = 0;
                this.life = Math.random() * 200 + 100;
            }
            update() {
                const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
                this.vx += Math.cos(angle) * 0.2;
                this.vy += Math.sin(angle) * 0.2;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.vx -= dx * force * 0.05;
                    this.vy -= dy * force * 0.05;
                }

                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.95;
                this.vy *= 0.95;

                this.age++;
                if (this.age > this.life) this.reset();

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }
            draw() {
                const alpha = 1 - Math.abs((this.age / this.life) - 0.5) * 2;
                ctx.fillStyle = '#11d483';
                ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.8));
                ctx.fillRect(this.x, this.y, 1.8, 1.8);
            }
        }

        function init() {
            resize();
            particles = [];
            const count = window.innerWidth < 768 ? 60 : 120; // 300→120
            for (let i = 0; i < count; i++) {
                particles.push(new NeuralParticle());
            }
        }

        let neuralRafId = null;
        let isNeuralVisible = false;

        function startNeural() {
            if (neuralRafId) return;
            neuralRafId = requestAnimationFrame(animate);
        }
        function stopNeural() {
            if (neuralRafId) { cancelAnimationFrame(neuralRafId); neuralRafId = null; }
        }

        function animate() {
            ctx.fillStyle = 'rgba(5, 8, 16, 0.15)';
            ctx.fillRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            neuralRafId = requestAnimationFrame(animate);
        }

        init();

        window.addEventListener('resize', () => { resize(); init(); });

        const contactSec = document.getElementById('contact') || canvas.parentElement;
        if (contactSec) {
            contactSec.addEventListener('mousemove', (e) => {
                const r = canvas.getBoundingClientRect();
                mouse.x = e.clientX - r.left;
                mouse.y = e.clientY - r.top;
            });
            contactSec.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

            new IntersectionObserver((entries) => {
                isNeuralVisible = entries[0].isIntersecting;
                if (isNeuralVisible && !document.hidden) startNeural();
                else stopNeural();
            }, { threshold: 0.05 }).observe(contactSec);

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) stopNeural();
                else if (isNeuralVisible) startNeural();
            });
        }
    }

    // Lanzar al cargar
    setTimeout(() => {
        updateLayoutCache();
        const scrollY = window.scrollY || window.pageYOffset;
        handleHorizontalScroll(scrollY);
        handleInvertedScroll(scrollY);
        handleMethodologyScroll(scrollY);
        init3DCore();
        initTechBentoTilt();
        initSparklesCanvas();
        initNeuralCanvas();
        
        // Activar textos iniciales en Hero
        document.querySelectorAll('.hero-content .reveal-text').forEach(el => {
            el.classList.add('active');
        });
    }, 150);

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMainScript);
} else {
    initMainScript();
}