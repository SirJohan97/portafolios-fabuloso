/* =========================================
   0. PRELOADER DELEGATION
   Handled with full cinematic authority by preloader-v.js (Monumental GSAP FLIP reveal)
   ========================================= */
(function() {
    // Delegated to preloader-v.js
    console.log('[VANTA] Preloader delegated to preloader-v.js');
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

    let currentScrollY = 0;

    /* =========================================
       5. CURSOR PERSONALIZADO Y VARIABLES GLOBALES (GPU ACCELERATED)
       ========================================= */
    const cursor  = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');

    // Variables compartidas de layout para evitar lecturas de DOM desincronizadas
    let portfolioTop = 0;
    let portfolioHeight = 0;
    let maxTranslate = 0;

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
 
        let mouseX = -100;
        let mouseY = -100;
        let c1X = -100, c1Y = -100;
        let c2X = -100, c2Y = -100;
        let cursorRafId = null;
        let isCursorRunning = false;
        let hasMovedMouse = false;

        cursor.style.opacity = '0';
        if (cursor2) cursor2.style.opacity = '0';

        function startCursorLoop() {
            if (!isCursorRunning && !document.hidden && hasMovedMouse) {
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
            if (!hasMovedMouse) {
                hasMovedMouse = true;
                c1X = e.clientX;
                c1Y = e.clientY;
                c2X = e.clientX;
                c2Y = e.clientY;
                cursor.style.opacity = '1';
                if (cursor2) cursor2.style.opacity = '1';
            }
            mouseX = e.clientX;
            mouseY = e.clientY;
            startCursorLoop();
        });
 
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            if (cursor2) cursor2.style.opacity = '0';
            stopCursorLoop();
        });
        document.addEventListener('mouseenter', () => {
            if (hasMovedMouse) {
                cursor.style.opacity = '1';
                if (cursor2) cursor2.style.opacity = '1';
                startCursorLoop();
            }
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

            c1X += diff1X * 0.22;
            c1Y += diff1Y * 0.22;
            c2X += diff2X * 0.85;
            c2Y += diff2Y * 0.85;
 
            cursor.style.transform = `translate3d(calc(${c1X}px - 50%), calc(${c1Y}px - 50%), 0)`;
            cursor2.style.transform = `translate3d(calc(${c2X}px - 50%), calc(${c2Y}px - 50%), 0)`;
 
            if (Math.abs(diff1X) < 0.05 && Math.abs(diff1Y) < 0.05 && Math.abs(diff2X) < 0.05 && Math.abs(diff2Y) < 0.05) {
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
    } else {
        if (cursor) cursor.style.display = 'none';
        if (cursor2) cursor2.style.display = 'none';
    }

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
    if (emailCopyBtn) {
        emailCopyBtn.addEventListener('click', () => {
            const email = 'proyectos@vanta-studio.com';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    emailCopyBtn.classList.add('btn-copied');
                    window.showHudToast('[CORREO COPIADO // PROYECTOS@VANTA-STUDIO.COM]');
                    setTimeout(() => {
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

    // ─── ACTO 07: THE VANTA DEAL DESK // INTERACTIVIDAD, RELOJ CCS & RECEIPT ───
    function initCaracasClock() {
        const clockEl = document.getElementById('caracasClock');
        if (!clockEl) return;
        function updateTime() {
            try {
                const now = new Date();
                const formatter = new Intl.DateTimeFormat('es-VE', {
                    timeZone: 'America/Caracas',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                clockEl.textContent = formatter.format(now);
            } catch (e) {
                const now = new Date();
                clockEl.textContent = now.toTimeString().substring(0, 8);
            }
        }
        updateTime();
        setInterval(updateTime, 1000);
    }
    initCaracasClock();

    const formContacto = document.getElementById('formContactoWa');
    const typeChips = document.querySelectorAll('#projectTypeChips .contact-chip-btn');
    const budgetChips = document.querySelectorAll('#budgetChips .contact-chip-btn');

    function updateLiveReceipt() {
        const activeTypeEl   = document.querySelector('#projectTypeChips .contact-chip-btn.active');
        const activeBudgetEl = document.querySelector('#budgetChips .contact-chip-btn.active');
        const receiptType    = document.getElementById('receiptType');
        const receiptBudget  = document.getElementById('receiptBudget');
        const receiptTicket  = document.getElementById('receiptTicket');
        const nameInput      = document.getElementById('waNombre');

        const tipo = activeTypeEl ? activeTypeEl.getAttribute('data-type') : 'Sitio Web / Catálogo de Alta Conversión';
        const presupuesto = activeBudgetEl ? activeBudgetEl.getAttribute('data-budget') : 'Negocio Local (< $500)';

        if (receiptType) receiptType.textContent = tipo;
        if (receiptBudget) receiptBudget.textContent = presupuesto;

        if (receiptTicket) {
            const seed = (nameInput && nameInput.value.trim()) ? nameInput.value.trim().toUpperCase() : 'CORE';
            let hash = 0;
            for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            const num = Math.abs(hash % 900) + 100;
            receiptTicket.textContent = `TICKET #VANTA-2026-${num}`;
        }
    }

    function initChipsGroup(chips) {
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                updateLiveReceipt();
                if (window._vantaAudio && typeof window._vantaAudio.playClick === 'function') {
                    window._vantaAudio.playClick();
                }
            });
        });
    }

    initChipsGroup(typeChips);
    initChipsGroup(budgetChips);
    updateLiveReceipt();

    const nameInput = document.getElementById('waNombre');
    if (nameInput) {
        nameInput.addEventListener('input', updateLiveReceipt);
    }



    // Conexión del botón de RFP Corporativo de la sección Gobernanza B2B
    const govRfpBtn = document.getElementById('govRfpBtn');
    if (govRfpBtn) {
        govRfpBtn.addEventListener('click', () => {
            const targetType = 'ERP, Sincronización SAP & Pipeline B2B';
            const targetBudget = 'Enterprise / RFP ($10,000 - $50,000+)';

            typeChips.forEach(c => {
                if (c.getAttribute('data-type') === targetType) {
                    typeChips.forEach(x => x.classList.remove('active'));
                    c.classList.add('active');
                }
            });

            budgetChips.forEach(c => {
                if (c.getAttribute('data-budget') === targetBudget) {
                    budgetChips.forEach(x => x.classList.remove('active'));
                    c.classList.add('active');
                }
            });

            updateLiveReceipt();

            const contactSection = document.getElementById('contact');
            if (contactSection) {
                if (window.lenis) {
                    window.lenis.scrollTo(contactSection, { duration: 1.2 });
                } else {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            setTimeout(() => {
                const nameInput = document.getElementById('waNombre');
                if (nameInput) {
                    nameInput.focus();
                    nameInput.placeholder = "Nombre de la Empresa o Representante Legal";
                }
                const msgInput = document.getElementById('waMensaje');
                if (msgInput && !msgInput.value) {
                    msgInput.value = "Estimados Andrés y Johan: Deseamos evaluar los términos de contratación, acuerdos de confidencialidad (NDA) y alcance técnico para una propuesta corporativa...";
                }
            }, 600);
        });
    }

    if (formContacto) {
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();

            const activeTypeEl   = document.querySelector('#projectTypeChips .contact-chip-btn.active');
            const activeBudgetEl = document.querySelector('#budgetChips .contact-chip-btn.active');
            const tipoProyecto   = activeTypeEl ? activeTypeEl.getAttribute('data-type') : 'Sitio Web / Catálogo de Alta Conversión';
            const presupuesto    = activeBudgetEl ? activeBudgetEl.getAttribute('data-budget') : 'Negocio Local (< $500)';

            const nombre  = (document.getElementById('waNombre') || {}).value.trim();
            const email   = (document.getElementById('waEmail') || {}).value.trim();
            const mensaje = (document.getElementById('waMensaje') || {}).value.trim();

            if (!nombre || !email || !mensaje) return;

            const ticketEl = document.getElementById('receiptTicket');
            const ticket = ticketEl ? ticketEl.textContent : 'TICKET #VANTA-2026';

            const textoMensaje = `🚀 *SOLICITUD DE INGENIERÍA // VANTA STUDIO*%0A` +
                `📋 *${encodeURIComponent(ticket)}*%0A%0A` +
                `👤 *Cliente / Empresa:* ${encodeURIComponent(nombre)}%0A` +
                `📧 *Correo Oficial:* ${encodeURIComponent(email)}%0A` +
                `🛠️ *Alcance & Arquitectura:* ${encodeURIComponent(tipoProyecto)}%0A` +
                `💰 *Inversión Estimada:* ${encodeURIComponent(presupuesto)}%0A%0A` +
                `📝 *Especificaciones / Requerimientos:*%0A${encodeURIComponent(mensaje)}%0A%0A` +
                `--%0A_Atención Directa: Andrés Morales & Johan Fernández // VANTA Core_`;

            const numeroWa = "584127121162";
            const urlWa    = `https://wa.me/${numeroWa}?text=${textoMensaje}`;

            if (window.showHudToast) {
                window.showHudToast('[CONEXIÓN SEGURA // DESPACHANDO TICKET A WHATSAPP]');
            }

            window.open(urlWa, '_blank', 'noopener,noreferrer');
        });
    }

    /* =========================================
       8. APPLE DYNAMIC ISLAND FLUID SPRING CONTROLLER
       Authentic Apple Liquid Spring & Inward Collapse
       ========================================= */
    const navbar = document.getElementById('vanta-navbar') || document.querySelector('.navbar');
    const navbarLogoTarget = document.getElementById('navbar-logo-target');
    const navCenterDeck = document.querySelector('.nav-center-deck');
    const navDeckCapsule = document.querySelector('.nav-deck-capsule');
    const navDeckItems = document.querySelectorAll('.nav-deck-list li');
    const navCommandWing = document.querySelector('.nav-command-wing');

    let isScrolledClean = false;
    let isIslandExpanded = true;

    function animateDynamicIsland(expand, immediate = false) {
        if (!navbar || !navCenterDeck || !navCommandWing) return;

        isIslandExpanded = expand;

        if (expand) {
            navbar.classList.add('nav-peek');
            navbar.classList.remove('nav-island-hidden');

            if (!window.gsap) {
                navCenterDeck.style.opacity = '1';
                navCenterDeck.style.transform = 'scale(1)';
                navCommandWing.style.opacity = '1';
                navCommandWing.style.transform = 'translate(0, 0) scale(1)';
                return;
            }

            if (immediate) {
                gsap.set([navCenterDeck, navDeckCapsule, navCommandWing], { clearProps: 'transform,opacity,filter' });
                if (navDeckItems.length) gsap.set(navDeckItems, { clearProps: 'opacity,transform' });
                return;
            }

            gsap.killTweensOf([navCenterDeck, navDeckCapsule, navCommandWing, navDeckItems]);

            // 1. Center Deck Capsule: Bloomea desde el centro exacto con resorte Apple líquido
            gsap.fromTo(navCenterDeck,
                { scale: 0.12, opacity: 0, filter: 'blur(10px)', transformOrigin: '50% 50%' },
                {
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.54,
                    ease: "back.out(1.55)", // Resorte orgánico Apple con rebote natural
                    overwrite: "auto"
                }
            );

            gsap.fromTo(navDeckCapsule,
                { scaleX: 0.35, transformOrigin: '50% 50%' },
                {
                    scaleX: 1,
                    duration: 0.48,
                    ease: "back.out(1.4)",
                    overwrite: "auto"
                }
            );

            // 2. Links de navegación: Cascada fluida que no distorsiona las letras
            if (navDeckItems.length) {
                gsap.fromTo(navDeckItems,
                    { opacity: 0, y: 6, scale: 0.94 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.32,
                        delay: 0.12,
                        stagger: 0.028,
                        ease: "power2.out",
                        overwrite: "auto"
                    }
                );
            }

            // 3. Command Wing: Nace desde el centro y se proyecta suavemente a la derecha
            gsap.fromTo(navCommandWing,
                { x: -75, scale: 0.25, opacity: 0, filter: 'blur(6px)', transformOrigin: 'left center' },
                {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.52,
                    delay: 0.06,
                    ease: "back.out(1.35)",
                    overwrite: "auto"
                }
            );

        } else {
            navbar.classList.remove('nav-peek');
            navbar.classList.add('nav-island-hidden');

            if (!window.gsap) {
                navCenterDeck.style.opacity = '0';
                navCenterDeck.style.transform = 'scale(0.12)';
                navCommandWing.style.opacity = '0';
                return;
            }

            gsap.killTweensOf([navCenterDeck, navDeckCapsule, navCommandWing, navDeckItems]);

            // 1. Enlaces: Fade out rápido antes de que la cápsula se encoja (evita letras aplastadas)
            if (navDeckItems.length) {
                gsap.to(navDeckItems, {
                    opacity: 0,
                    duration: 0.15,
                    ease: "power2.in",
                    overwrite: "auto"
                });
            }

            // 2. Center Deck: Se absorbe elásticamente hacia su propio centro
            gsap.to(navCenterDeck, {
                scale: 0.12,
                opacity: 0,
                filter: 'blur(10px)',
                duration: 0.38,
                ease: "power3.inOut",
                transformOrigin: '50% 50%',
                overwrite: "auto"
            });

            gsap.to(navDeckCapsule, {
                scaleX: 0.25,
                duration: 0.36,
                ease: "power3.inOut",
                transformOrigin: '50% 50%',
                overwrite: "auto"
            });

            // 3. Command Wing: Colapsa hacia adentro
            gsap.to(navCommandWing, {
                x: -75,
                scale: 0.2,
                opacity: 0,
                filter: 'blur(8px)',
                duration: 0.3,
                ease: "power3.in",
                transformOrigin: 'left center',
                overwrite: "auto"
            });
        }
    }

    function updateNavbar(scrollY) {
        if (!navbar) return;

        // Umbral de scroll para activar modo limpio (55px)
        const shouldBeScrolled = scrollY > 55;

        if (shouldBeScrolled !== isScrolledClean) {
            isScrolledClean = shouldBeScrolled;
            if (isScrolledClean) {
                navbar.classList.add('nav-scrolled-clean', 'scrolled');
                document.body.classList.add('scrolled');
                // Colapso elástico hacia adentro
                animateDynamicIsland(false);
            } else {
                navbar.classList.remove('nav-scrolled-clean', 'scrolled');
                document.body.classList.remove('scrolled');
                // Nace del medio como Dynamic Island al volver arriba
                animateDynamicIsland(true);
            }
        }
    }

    // Logo click: retorno ultra-fluido al inicio
    if (navbarLogoTarget) {
        navbarLogoTarget.addEventListener('click', (e) => {
            const href = navbarLogoTarget.getAttribute('href');
            if (href === '#home' || href === '#') {
                e.preventDefault();
                if (window.lenis) {
                    window.lenis.scrollTo(0, { duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }

    // Dynamic Island Hover Peek: nace del medio si el cursor se acerca al borde superior (< 65px)
    let peekActive = false;
    window.addEventListener('mousemove', (e) => {
        if (!isScrolledClean || !navbar) return;
        if (e.clientY <= 65) {
            if (!peekActive) {
                peekActive = true;
                animateDynamicIsland(true);
            }
        } else if (e.clientY > 115) {
            if (peekActive) {
                peekActive = false;
                animateDynamicIsland(false);
            }
        }
    }, { passive: true });

    if (navbar) {
        navbar.addEventListener('mouseenter', () => {
            if (isScrolledClean && !peekActive) {
                peekActive = true;
                animateDynamicIsland(true);
            }
        });
        navbar.addEventListener('mouseleave', (e) => {
            if (isScrolledClean && peekActive && e.clientY > 95) {
                peekActive = false;
                animateDynamicIsland(false);
            }
        });
    }

    /* =========================================
       9. CONSTELLATION PALETTE DEFINITION
       ========================================= */
    window.constellationColors = {
        node:      'rgba(17, 212, 131, 0.9)',
        line:      'rgba(17, 212, 131, 0.25)',
        mouseLine: 'rgba(17, 212, 131, 0.6)',
    };

    /* =========================================
       10. CARD MENU INTERACTIVO & DATOS DE PROYECTOS
       ========================================= */
    const PROJECT_DATA = {
        sviva: {
            tag: 'Python · YOLOv8 · OpenCV · TensorRT · Telegram API',
            title: 'SVIVA CORE — Videovigilancia Táctica & AI Edge',
            description: 'Sistema de videovigilancia táctica e inteligencia artificial que opera 100% en local sobre hardware estándar. Sin latencia y con absoluta soberanía de datos (cero dependencia de la nube). Validado exhaustivamente con streams RTSP simulados en teléfonos móviles y diseñado con compatibilidad agnóstica para cualquier cámara de seguridad convencional (cámaras IP PoE, streams RTSP o CCTV cableado vía encoder). Integra inferencia multiclase con YOLOv8 para detección de personas, mascotas, vehículos, objetos peligrosos/armas y merodeos sospechosos en zonas perimetrales. Conectado a un bot interactivo de Telegram que despacha alertas fotográficas forenses con telemetría en tiempo real (cámara, hora exacta y nivel de amenaza) e incorpora botones de acción directa para activar alarmas disuasivas y generar reportes semanales automáticos.',
            metrics: ['⚡ INFERENCIA 12ms', '🔒 100% LOCAL / ZERO CLOUD', '📡 BOT TELEGRAM INTERACTIVO', '🚨 ALERTA FORENSE & MERODEO'],
            pipeline: ['📹 RTSP / Cámara IP Convencional', '→', '⚡ Inferencia YOLOv8 Local (<15ms)', '→', '🧠 ByteTrack ID & Análisis de Merodeo', '→', '📡 Bot Telegram + Alarma Disuasiva'],
            tech: ['Python 3.11', 'YOLOv8 Real-time', 'ByteTrack Tracker', 'OpenCV / TensorRT', 'FastAPI Async Engine', 'Telegram Bot API (Inline Buttons)', 'SQLite Analytics'],
            url: '#',
            screenshots: [
                { src: 'img/sviva/svivalogo.webp', caption: 'Branding & Identidad SVIVA Tactical Core' },
                { src: 'img/sviva/Dashboard.webp', caption: 'Dashboard Central de Monitoreo & Cámaras' },
                { src: 'img/sviva/Dashboard 2.webp', caption: 'Consola Multi-Cámara en Tiempo Real' },
                { src: 'img/sviva/Deteccion e IA.webp', caption: 'Inferencia de Red Neuronal & Bounding Boxes YOLOv8' },
                { src: 'img/sviva/Analitica.webp', caption: 'Métricas Forenses y Gráficas de Tráfico Semanal' },
                { src: 'img/sviva/Analitica 2.webp', caption: 'Distribución de Eventos y Horarios de Mayor Detección' },
                { src: 'img/sviva/Analitica 3.webp', caption: 'Panel Estadístico Avanzado de Actividad Perimetral' },
                { src: 'img/sviva/Grabaciones.webp', caption: 'Búsqueda y Reproducción de Grabaciones Forenses' },
                { src: 'img/sviva/Grabacion y disco.webp', caption: 'Gestión de Almacenamiento Local y Cuotas de Disco' },
                { src: 'img/sviva/Nueva Camara.webp', caption: 'Asistente de Configuración de Stream IP / RTSP' },
                { src: 'img/sviva/Red y Acceso Remoto.webp', caption: 'Configuración de Red Local, Puertos y VPN Segura' },
                { src: 'img/sviva/Gestion de Usuarios.webp', caption: 'Control de Roles, Permisos y Operadores de Seguridad' },
                { src: 'img/sviva/Mi perfil.webp', caption: 'Ajustes de Cuenta de Operador y Preferencias de Alerta' },
                { src: 'img/sviva/Login.webp', caption: 'Acceso Seguro al Sistema con Autenticación Local' },
                { src: 'img/sviva/Registro.webp', caption: 'Registro de Dispositivos y Credenciales del Sistema' },
                { src: 'img/sviva/Rendimiento.webp', caption: 'Telemetría en Vivo de Carga CPU, GPU y VRAM' },
                { src: 'img/sviva/Respaldo y Logs.webp', caption: 'Auditoría Transaccional, Logs y Copias de Seguridad' },
                { src: 'img/sviva/Seguridad.webp', caption: 'Módulo de Políticas de Cifrado y Blindaje Operativo' },
                { src: 'img/sviva/Politicas y Legalidad.webp', caption: 'Términos de Privacidad y Cumplimiento Normativo' },
                { src: 'img/sviva/Telegram y Notificaciones.webp', caption: 'Configuración del Bot y Notificaciones Push' },
                { src: 'img/sviva/deteccioncuchillo.webp', caption: 'Alerta Forense en Vivo — Detección Crítica de Arma Blanca (Knife 82%)' },
                { src: 'img/sviva/deteccioncuchillo2.webp', caption: 'Alerta Táctica con Bounding Box — Detección de Amenaza Perimetral (Knife 85%)' },
                { src: 'img/sviva/deteccionmultiple.webp', caption: 'Inferencia Multi-Objetivo en Directo — Detección Simultánea de Personas' },
                { src: 'img/sviva/svivatelegram.webp', caption: 'Recepción de Captura Forense con Botones de Acción en Telegram' },
                { src: 'img/sviva/WhatsApp Image 2026-09-16 at 10.21.08 AM.webp', caption: 'Modo Móvil Ultra-Responsive en Smartphone' },
                { src: 'img/sviva/WhatsApp Image 2026-09-16 at 10.22.37 AM.webp', caption: 'Visualización Táctica Móvil — Telemetría en Teléfono' },
                { src: 'img/sviva/hihi.webp', caption: 'Módulo Especial de Pruebas de Visión Artificial' }
            ],
            code: `# Algoritmo de Inferencia Táctica YOLOv8 + Despacho Interactivo Telegram
import cv2
from ultralytics import YOLO
from trackers.multi_tracker_zoo import create_tracker

class VisionPipeline:
    def __init__(self, model_path="yolov8n.pt"):
        self.model = YOLO(model_path)
        self.tracker = create_tracker("bytetrack", "config/bytetrack.yaml")

    def process_frame(self, frame, camera_id="CAM_01"):
        # Inferencia local sin dependencia de la nube
        results = self.model(frame, stream=True, conf=0.45)
        for r in results:
            boxes = r.boxes.xyxy.cpu().numpy()
            scores = r.boxes.conf.cpu().numpy()
            class_ids = r.boxes.cls.cpu().numpy()
            
            # Rastreo determinista de IDs únicos y control de merodeo
            tracks = self.tracker.update(boxes, scores, class_ids, frame)
            threat_level = self.evaluar_amenaza(class_ids, tracks)
            if threat_level != "NORMAL":
                self.enviar_alerta_telegram(frame, camera_id, threat_level)
        return frame`
        },
        ventastrack: {
            tag: 'Python · FastAPI · PostgreSQL · Enterprise B2B · Lab. Behrens',
            title: 'VentasTrack — Automatización Comercial Exclusiva Laboratorios Behrens',
            description: 'Plataforma corporativa integral de automatización y gestión comercial B2B diseñada y desarrollada exclusivamente para la fuerza de ventas y las operaciones estratégicas de Laboratorios Behrens, C.A. Actúa como puente digital de alta fidelidad que conecta a visitadores médicos y asesores comerciales en calle directamente con Atención al Cliente (ATC), Tesorería, Supervisión y el sistema central SAP ERP.\n\nCentraliza todo el ciclo de vida comercial: captura inteligente de cotizaciones en smartphones con listas de precios diferenciadas (Clínica, Droguería Nacional, Droguería Regional), descuentos escalonados con precisión de 3 decimales, operatividad offline total con IndexedDB para rutas sin cobertura celular (sincronización automática al recuperar señal), flujo de validación multirrol y exportación estructurada a SAP ERP (pedidos ZB01, condiciones ZB21, tasa oficial BCV a 4 decimales y sedes destino ZDES). Incluye generación instantánea de cotizaciones en PDF con membrete institucional y cálculos multimoneda en tiempo real (USD / Bs. BCV).',
            metrics: ['💊 EXCLUSIVO LAB. BEHRENS', '🔄 INTEGRACIÓN SAP ERP (ZB01)', '📶 OFFLINE-FIRST (INDEXEDDB)', '💵 MULTIMONEDA TASA BCV'],
            pipeline: ['📱 Pedido Visitador en Calle (Offline/Online)', '→', '🏢 Validación ATC & Tesorería', '→', '🔄 Generación Doc. SAP (ZB01/ZB21)', '→', '📄 Factura PDF & Despacho'],
            tech: ['FastAPI / Python', 'PostgreSQL', 'TypeScript / Vite', 'IndexedDB Offline Cache', 'SAP ERP Connector', 'Generador PDF Oficial', 'JWT Roles & Permissions'],
            url: '#contact',
            screenshots: [
                { src: 'img/ventastrack/login-ventast.webp', caption: 'Portal Principal de Acceso B2B Laboratorios Behrens' },
                { src: 'img/ventastrack/loginresponsive.webp', caption: 'Login Optimizado para Smartphones de Fuerza de Ventas' },
                { src: 'img/ventastrack/responsiveventastra.webp', caption: 'Dashboard Móvil para Visitadores Médicos en Ruta' },
                { src: 'img/ventastrack/WhatsApp Image 2026-09-16 at 10.16.58 AM.webp', caption: 'Levantamiento Táctil de Cotizaciones en Teléfono' },
                { src: 'img/ventastrack/WhatsApp Image 2026-09-16 at 10.16.59 AM.webp', caption: 'Catálogo de Productos y Listas de Precios por Droguería' },
                { src: 'img/ventastrack/VentasTrack.webp', caption: 'Cabecera e Identidad Oficial VentasTrack Behrens' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 155907.webp', caption: 'Consola Desktop de Gestión Comercial & Pedidos' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 160116.webp', caption: 'Directorio de Clientes y Estado de Créditos ATC' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 160308.webp', caption: 'Selección y Filtro de Productos por Línea Farmacéutica' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 160515.webp', caption: 'Validación de Inventario Físico en Almacén Central' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 160938.webp', caption: 'Edición de Condiciones Comerciales y Descuentos Escalonados' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 161000.webp', caption: 'Cálculo Oficial Multidivisa y Tasa BCV a 4 Decimales' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 161251.webp', caption: 'Módulo de Exportación Directa a SAP ERP (ZB01)' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 161528.webp', caption: 'Generación de Cotización Formal PDF con Membrete Behrens' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 162612.webp', caption: 'Historial de Pedidos Aprobados y Estatus de Despacho' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 162741.webp', caption: 'Reporte Consolidado de Ventas por Zona Geográfica' },
                { src: 'img/ventastrack/Captura de pantalla 2026-09-15 162956.webp', caption: 'Panel de Auditoría y Trazabilidad de Operaciones Comerciales' }
            ],
            code: `# Generación de Pedido Comercial SAP ERP (ZB01 / ZB21) con Tasa Oficial BCV
from decimal import Decimal
from models import Cotizacion, SAPSalesOrder

def exportar_a_sap_erp(cotizacion_id: int, tasa_bcv: Decimal):
    cot = Cotizacion.query.get(cotizacion_id)
    # Formato oficial de orden de venta SAP de Laboratorios Behrens
    sap_payload = {
        "doc_type": "ZB01",
        "sales_org": "BEHR",
        "tasa_cambio": round(tasa_bcv, 4),
        "cliente_sap": cot.cliente.codigo_sap,
        "sede_destino": cot.sede_zdes,
        "items": [
            {
                "material": it.material_sap,
                "cantidad": it.unidades,
                "precio_lista": it.precio_lista,
                "descuento_zb21": round(it.descuento, 3)
            } for it in cot.items
        ]
    }
    return SAPSalesOrder.crear(sap_payload)`
        },
        kioskoazul: {
            tag: 'Python · Flask · SQLite · POS Real-time · Async Queue',
            title: 'Kiosko Azul — POS & Menú Digital Interactivo',
            description: 'Plataforma gastronómica integral de punto de venta (POS) y comanda digital diseñada para restaurantes y comercios con alto tráfico de comensales. Su arquitectura backend implementa un sistema de colas asíncronas (async FIFO queue) donde cada pedido entra a un buffer ultraligero y se procesa en cuestión de milisegundos, garantizando cero caídas ni saturación en pruebas de estrés masivas. Incorpora métodos de pago personalizados adaptados al mercado (Pago Móvil y Efectivo), menú digital interactivo por código QR para smartphones de comensales, interfaz táctil acelerada para meseros en tabletas y sincronización instantánea con el monitor de cocina y cuadre financiero en caja.',
            metrics: ['🍔 MENÚ QR MOBILE', '⚡ COLA ASÍNCRONA <10ms', '📱 TÁCTIL MESEROS & COCINA', '💵 PAGO MÓVIL & EFECTIVO'],
            pipeline: ['📱 Pedido QR Comensal', '→', '⚡ Cola Asíncrona FIFO (<10ms)', '→', '💾 Transacción SQLite Concurrente', '→', '👨‍🍳 Monitor Cocina & Cuadre Caja'],
            tech: ['Python 3', 'Flask Microframework', 'Async Queue System', 'SQLite / PostgreSQL', 'Mobile-First UX', 'Módulo Pago Móvil / Efectivo'],
            url: '#',
            screenshots: [
                { src: 'img/kioskoazul/login-kiosko.webp', caption: 'Acceso Administrativo y Punto de Venta' },
                { src: 'img/kioskoazul/menu-kiosko.webp', caption: 'Menú Digital Interactivo para Clientes' },
                { src: 'img/kioskoazul/carrito-kiosko.webp', caption: 'Carrito de Compras y Resumen de Orden' },
                { src: 'img/kioskoazul/Captura de pantalla 2026-09-15 152419.webp', caption: 'Tablero de Control POS y Pedidos en Preparación' },
                { src: 'img/kioskoazul/admin.webp', caption: 'Panel Central de Administración de Local y Mesas' },
                { src: 'img/kioskoazul/catal.webp', caption: 'Catálogo de Platillos, Bebidas y Precios en Carta' },
                { src: 'img/kioskoazul/gestion.webp', caption: 'Gestión de Menú, Inventario de Ingredientes y Alérgenos' },
                { src: 'img/kioskoazul/pedidos.webp', caption: 'Monitor de Comandas Activas y Cola FIFO de Cocina' },
                { src: 'img/kioskoazul/pago.webp', caption: 'Pasarela de Cobro Multimoneda (Pago Móvil y Efectivo)' },
                { src: 'img/kioskoazul/delivery.webp', caption: 'Módulo de Pedidos para Llevar y Despacho a Domicilio' },
                { src: 'img/kioskoazul/reserv.webp', caption: 'Control de Reservaciones y Disponibilidad de Salones' },
                { src: 'img/kioskoazul/analitics.webp', caption: 'Métricas de Ventas, Ticket Promedio y Platos Populares' },
                { src: 'img/kioskoazul/seg.webp', caption: 'Configuración de Roles, Cajeros y Seguridad de Caja' },
                { src: 'img/kioskoazul/nnjj.webp', caption: 'Resumen Operativo de Turno y Cuadre de Caja' },
                { src: 'img/kioskoazul/WhatsApp Image 2026-09-15 at 3.14.13 PM.webp', caption: 'Experiencia Móvil en Smartphones (QR Mesa)' },
                { src: 'img/kioskoazul/WhatsApp Image 2026-09-15 at 3.14.21 PM.webp', caption: 'Ficha Detallada de Platillos en Pantalla Móvil' },
                { src: 'img/kioskoazul/WhatsApp Image 2026-09-15 at 3.14.29 PM.webp', caption: 'Gestión de Selección y Adicionales en Teléfono' },
                { src: 'img/kioskoazul/WhatsApp Image 2026-09-15 at 3.14.37 PM.webp', caption: 'Confirmación y Pasarela Pago Móvil / Efectivo en Teléfono' },
                { src: 'img/kioskoazul/WhatsApp Image 2026-09-15 at 3.14.47 PM.webp', caption: 'Terminal Táctil para Camareros en Tablet' },
                { src: 'img/kioskoazul/WhatsApp Image 2026-09-15 at 3.14.50 PM.webp', caption: 'Vista de Comanda Rápida para Meseros' },
                { src: 'img/kioskoazul/WhatsApp Image 2026-09-15 at 3.15.00 PM.webp', caption: 'Despacho de Cocina y Cuadre de Caja en Vivo' },
                { src: 'img/kioskoazul/WhatsApp Image 2026-09-16 at 12.36.29 PM.webp', caption: 'Panel Móvil Completo de Control de Órdenes' }
            ],
            code: `# Motor de Cola Asíncrona de Pedidos para Pruebas de Estrés
import queue, threading, sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
order_queue = queue.Queue()

def queue_worker():
    conn = sqlite3.connect('kiosko.db', check_same_thread=False)
    while True:
        order = order_queue.get()
        if order is None: break
        # Procesamiento secuencial en memoria en <5ms sin contención de locks
        cursor = conn.cursor()
        cursor.execute("INSERT INTO pedidos (mesa_id, total, metodo_pago) VALUES (?, ?, ?)",
                       (order['mesa_id'], order['total'], order['metodo_pago']))
        conn.commit()
        order_queue.task_done()

threading.Thread(target=queue_worker, daemon=True).start()`
        },
        iuta: {
            tag: 'Python · Flask · PostgreSQL · Multi-Tenant · 5 Sedes',
            title: 'CERDIV IUTA — Centro de Recursos Digitales Multi-Sede',
            description: 'Sistema administrativo centralizado de inventario bibliográfico y catalogación técnica multi-tenant desarrollado para el Instituto Universitario de Tecnología de Administración Industrial (IUTA). Su objetivo primordial es el registro exhaustivo y la auditoría patrimonial de los ejemplares físicos de las 5 bibliotecas del instituto (Sedes Central, Baralt, Jesuitas, Altos Mirandinos y Guarenas). Cada registro incluye la catalogación bibliotecológica normalizada, clasificación Dewey, cota, ISBN, editorial, imagen de portada y desglose de volúmenes disponibles por sede, permitiendo una trazabilidad precisa del patrimonio bibliográfico universitario sin requerir almacenamiento ni distribución de archivos PDF.',
            metrics: ['🏛️ 5 SEDES CONECTADAS', '📚 15.000+ FICHAS TÉCNICAS', '🔍 CATALOGACIÓN BIBLIOTECOLÓGICA', '🐘 POSTGRESQL MULTI-TENANT'],
            pipeline: ['🔍 Búsqueda Asíncrona por Cota/ISBN', '→', '⚡ Router Multi-Tenant Flask', '→', '🐘 PostgreSQL Neon Cloud', '→', '📖 Inventario de Ejemplares por Sede'],
            tech: ['Python / Flask', 'PostgreSQL Neon', 'Vercel Serverless', 'Arquitectura Multi-Tenant', 'Catalogación Bibliotecológica', 'Búsqueda Asíncrona'],
            url: 'https://biblioteca-ashy-sigma.vercel.app',
            screenshots: [
                { src: 'img/cerdiv/Captura de pantalla 2026-09-15 154435.webp', caption: 'Portal Oficial CERDIV IUTA — Vista de las 5 Sedes' },
                { src: 'img/cerdiv/cerdivweb.webp', caption: 'Catálogo de Libros y Motor de Búsqueda por Facetas' },
                { src: 'img/cerdiv/cerdivsede.webp', caption: 'Selección de Sede y Disponibilidad de Ejemplares Físicos' }
            ],
            code: `# Consulta de Disponibilidad Multi-Tenant en 5 Sedes
from models import db, Libro, EjemplarSede

def consultar_stock_multi_sede(cota: str):
    # Inventario centralizado a través de las 5 sedes universitarias de IUTA
    sedes_activas = ['Central', 'Baralt', 'Jesuitas', 'Altos Mirandinos', 'Guarenas']
    query = db.session.query(
        EjemplarSede.nombre_sede,
        EjemplarSede.ejemplares_fisicos
    ).filter(
        EjemplarSede.cota == cota,
        EjemplarSede.nombre_sede.in_(sedes_activas)
    ).all()
    
    return {sede: cant for sede, cant in query}`
        },
        inventario: {
            tag: 'Python · FastAPI · PostgreSQL · Promedio Ponderado · Base Modular',
            title: 'Sistema de Control de Inventario & Kardex Multibodega',
            description: 'Plataforma industrial de control de existencias, trazabilidad Kardex bajo método de Promedio Ponderado y gestión de almacenes centrales. Ha sido concebida como la solución base modular de VANTA Studio: un software de alta ingeniería listo para ser personalizado e implantado a la medida de las reglas de negocio, categorías y flujos de cualquier empresa cliente. Incluye cálculo automático de costos medios, alertas inteligentes de rotura de stock, registro de mermas y bloqueos transaccionales optimistas (ACID) para operaciones concurrentes en depósitos múltiples.',
            metrics: ['📦 PROMEDIO PONDERADO', '🏢 BASE 100% PERSONALIZABLE', '⚡ STOCK & MERMAS EN VIVO', '🔒 MULTI-BODEGA TRANSACCIONAL'],
            pipeline: ['📦 Código de Barras / SKU', '→', '⚡ FastAPI Async Engine', '→', '📊 Cálculo Promedio Ponderado', '→', '🏢 Balance & Kardex Multi-Almacén'],
            tech: ['Python / FastAPI', 'PostgreSQL', 'SQLite', 'Dashboards Analíticos', 'Lector Código de Barras', 'Control de Mermas'],
            url: '#contact',
            screenshots: [
                { src: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (8).webp', caption: 'Consola Principal de Inventario y Stock Global' },
                { src: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM.webp', caption: 'Kardex Detallado por Producto y Registro de Lote' },
                { src: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (1).webp', caption: 'Módulo de Entradas y Recepción de Mercancía' },
                { src: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (2).webp', caption: 'Directorio de Proveedores y Órdenes de Compra' },
                { src: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (3).webp', caption: 'Alertas de Stock Crítico y Puntos de Reorden' },
                { src: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (6).webp', caption: 'Reportes y Métricas de Rotación de Inventario' }
            ],
            code: `-- Cálculo Automático de Promedio Ponderado en Transacción ACID
BEGIN;
SELECT stock_actual, costo_promedio
FROM inventario_bodega
WHERE sku = 'SKU-MED-8810' AND bodega_id = 1
FOR UPDATE;

-- Nuevo Costo Promedio = (Valor Existente + Valor Nuevo Ingreso) / Total Unidades
UPDATE inventario_bodega
SET costo_promedio = ((stock_actual * costo_promedio) + (100 * 12.50)) / (stock_actual + 100),
    stock_actual = stock_actual + 100,
    ultima_modificacion = NOW()
WHERE sku = 'SKU-MED-8810' AND bodega_id = 1;

COMMIT;`
        },
        svivaweb: {
            tag: 'React · TS · Vite · Three.js · Scrollytelling',
            title: 'SVIVA Web — Showcase Inmersivo & Landing de Descargas',
            description: 'Sitio web oficial y plataforma de distribución de alto impacto diseñada para la presentación del ejecutable de videovigilancia SVIVA. Desarrollada con rigurosos estándares Awwwards: scrollytelling cinemático, animaciones de alto rendimiento con Three.js y React, microinteracciones fluidas y canal de descarga seguro del instalador (.exe). Demuestra la capacidad de VANTA Studio para transformar software técnico en una experiencia de marca envolvente.',
            metrics: ['🎬 VIDEO DEMO EN VIVO', '🚀 SCROLLYTELLING FLUIDO', '⚡ 100/100 LIGHTHOUSE', '📦 DESCARGA INSTALADOR EXE'],
            pipeline: ['🌐 Visitante Web', '→', '🎬 Scrollytelling Cinemático', '→', '⚡ React + Three.js SPA', '→', '📦 Descarga Instalador EXE'],
            tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Three.js', 'GSAP ScrollTrigger', 'Showcase Web'],
            url: '#contact',
            youtubeId: 'RCy3nJT36fs',
            videoUrl: 'https://www.youtube.com/embed/RCy3nJT36fs',
            screenshots: [
                { src: 'img/sviva/Dashboard.webp', caption: 'Showcase del Sistema en la Web' },
                { src: 'img/sviva/Analitica.webp', caption: 'Vista Previa de Analítica Web' }
            ],
            code: `// Descarga de Ejecutable e Interfaz React TS
export const DownloadButton: React.FC = () => {
    return (
        <button onClick={() => window.location.href = '/downloads/sviva_installer.exe'}>
            Descargar SVIVA.exe
        </button>
    );
};`
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
                { src: 'img/auracheck/aura.webp', caption: 'Dashboard Central de Auditoría de Seguridad' },
                { src: 'img/auracheck/auralogin.webp', caption: 'Autenticación Biométrica y Verificación WebAuthn' }
            ],
            code: `// Verificación de Integridad Biométrica y Speed Test Local
async function auditBiometrics() {
    const hasWebAuthn = window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
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
            description: 'Plataforma de consulta médica inmersiva con IA que actúa como un doctor victoriano de 1885. Integra Gemini 1.5/2.0 Flash para respuestas con personalidad histórica, un sistema de fallback a Wikipedia y MedlinePlus (BeautifulSoup4 + httpx), y filtros de imagen Cloudinary para estética de grabado antiguo.',
            metrics: ['🎙️ VOZ VICTORIANA 1885', '🤖 GEMINI AI', '⚡ TTS EN TIEMPO REAL', '📖 UX HISTÓRICA'],
            pipeline: ['❓ User Query', '→', '🤖 Gemini 1.5 Flash', '→', '📜 Victorian Filter', '→', '🔊 Web Audio TTS'],
            tech: ['Google Gemini 1.5/2.0', 'FastAPI + Python', 'BeautifulSoup4', 'Cloudinary API', 'Tailwind CSS', 'Wikipedia / MedlinePlus', 'Vercel Functions'],
            url: 'https://que-le-pasa-a-mi-cuerpo.vercel.app/',
            screenshots: [
                { src: 'img/quelepasacuerpo/cuerpologin.webp', caption: 'Portada y Consulta del Doctor Victoriano' },
                { src: 'img/quelepasacuerpo/cuerpopasa.webp', caption: 'Ficha Histórica y Diagnóstico Médico 1885' }
            ],
            code: `# Motor Narrativo IA del Doctor Victoriano con Fallback
import google.generativeai as genai
from bs4 import BeautifulSoup

def consulta_medica_historica(pregunta: str):
    genai.configure(api_key="GEMINI_API_KEY")
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"Actúa como un médico británico en 1885. Pregunta: {pregunta}"
    response = model.generate_content(prompt)
    soup = BeautifulSoup(response.text, "html.parser")
    return soup.get_text()`
        },
        behban: {
            tag: 'Python · FastAPI · OpenCV · WebAuthn · Motor de Nómina · Exclusivo Behrens',
            title: 'BehBAN — Asistencia Biométrica y Nómina para Behrens',
            description: 'Solución corporativa integral de control de acceso y registro de jornada laboral desarrollada exclusivamente para el personal de planta y administración de Laboratorios Behrens, C.A. Reemplaza por completo el registro manual en hojas físicas y los relojes dactilares mediante reconocimiento facial de alta precisión con validación de vida activa (anti-spoofing en menos de 300 ms) para erradicar cualquier intento de suplantación. Su consola web centralizada concilia automáticamente retardos, turnos rotativos, permisos y horas extras diurnas/nocturnas, generando la prenómina calculada lista para su liquidación contable y sincronización con SAP ERP.',
            metrics: ['⚡ <300MS RECONOCIMIENTO', '🛡️ ANTI-SPOOFING LIVENESS', '🏢 EXCLUSIVO BEHRENS', '📊 PRENÓMINA SAP'],
            pipeline: ['👤 Captura Facial en Pórtico Behrens', '→', '🧠 Detección 68 Landmarks & Liveness', '→', '⚡ Matching Vectorial Biométrico', '→', '📅 Conciliación de Turnos & Retardos', '→', '💰 Liquidación Nómina & SAP ERP'],
            tech: ['Python / FastAPI', 'OpenCV & InsightFace', 'React / TypeScript', 'PostgreSQL', 'Algoritmos Anti-Spoofing', 'Integración SAP ERP'],
            url: '#contact',
            screenshots: [
                { src: 'img/auracheck/aura.webp', caption: 'Kiosko de Reconocimiento Facial y Verificación de Vida' },
                { src: 'img/ventastrack/dashboard.png', caption: 'Consola Centralizada de Liquidación de Nómina y Turnos' }
            ],
            code: `# Pipeline Biométrico de Asistencia y Liveness Check para Behrens
import numpy as np
from datetime import datetime

def procesar_fichaje_facial(embedding_captura: np.ndarray, empleado_id: str, liveness_score: float):
    # 1. Validación de vida activa (anti-spoofing contra fotos/pantallas)
    if liveness_score < 0.95:
        return {"status": "REJECTED", "reason": "SPOOF_ATTEMPT_DETECTED"}
    
    # 2. Matching biométrico por similitud coseno contra vector enrolado
    vector_oficial = obtener_vector_empleado(empleado_id)
    similitud = np.dot(embedding_captura, vector_oficial) / (
        np.linalg.norm(embedding_captura) * np.linalg.norm(vector_oficial)
    )
    
    if similitud >= 0.88:
        # 3. Registro inmediato y conciliación contra turno asignado
        evento = registrar_asistencia(empleado_id, timestamp=datetime.utcnow())
        actualizar_acumulado_nomina(empleado_id, evento)
        return {"status": "SUCCESS", "empleado": empleado_id, "similitud": float(similitud)}
    
    return {"status": "FAIL", "reason": "BIOMETRIC_MISMATCH"}`
        },
        wifisense: {
            tag: 'Python · NumPy · Wi-Fi CSI · Micro-Doppler · Zero-Camera · En Desarrollo',
            title: 'GhostSense RF — Wi-Fi Sensing & Presencia Invisible',
            description: 'Proyecto de ingeniería disruptiva que democratiza la tecnología de Wi-Fi Sensing (Channel State Information - CSI). Transforma las ondas electromagnéticas ambientales de routers Wi-Fi y microcontroladores accesibles (como ESP32) en un radar biométrico invisible capaz de detectar personas, contar ocupantes y registrar patrones de respiración sin requerir una sola cámara de seguridad ni sensores ópticos invasivos. Al operar en radiofrecuencia (2.4 GHz y 5 GHz), atraviesa tabiques y paredes convencionales, funciona en absoluta oscuridad y garantiza el 100% de la privacidad humana, haciéndolo idóneo para seguridad perimetral encubierta, residencias geriátricas y automatización de edificios inteligentes.',
            metrics: ['📡 ZERO-CAMERA PRIVACY', '🧱 DETECCIÓN A TRAVÉS DE PAREDES', '📶 CSI RADIO INTERFEROMETRÍA', '💡 100% HARDWARE ACCESIBLE'],
            pipeline: ['📶 Balizas RF Wi-Fi (CSI)', '→', '📊 Extracción Amplitud y Fase OFDM', '→', '🧠 Filtro de Micro-Doppler Humano', '→', '👤 Clasificación: Presencia / Respiración', '→', '🚨 Telemetría & Automatización IoT'],
            tech: ['Python / SciPy', 'Wi-Fi CSI Subcarrier Analysis', 'ESP32 / Commodity Routers', 'Filtros Kalman & Wavelet', 'Micro-Doppler Radar', 'Zero-Camera Privacy'],
            url: '#contact',
            screenshots: [
                { src: 'img/sviva/Dashboard.webp', caption: 'Radar de Perturbación RF y Conteo de Presencia Invisible' },
                { src: 'img/sviva/WhatsApp Image 2026-03-24 at 1.48.24 PM (1).jpeg', caption: 'Monitor de Ondas de Radiofrecuencia CSI Subcarriers' }
            ],
            code: `# Extracción y Filtrado de Ondas Wi-Fi CSI (Subcarrier Perturbation)
import numpy as np
from scipy.signal import butter, filtfilt

def detectar_presencia_csi(csi_matrix: np.ndarray, frec_corte=0.35):
    """
    csi_matrix: matriz de forma (paquetes_tiempo, 64_subportadoras_ofdm)
    Analiza la varianza de amplitud inducida por el movimiento del cuerpo humano
    """
    # 1. Extracción de amplitud pura eliminando desfases de antena
    amplitud = np.abs(csi_matrix)
    
    # 2. Filtro pasa-banda Butterworth para aislar micro-doppler de respiración y pasos
    b, a = butter(4, frec_corte, btype='highpass', fs=50.0)
    amplitud_filtrada = filtfilt(b, a, amplitud, axis=0)
    
    # 3. Cálculo de varianza dinámica diferencial entre subportadoras
    energia_perturbacion = np.mean(np.var(amplitud_filtrada, axis=0))
    humano_presente = bool(energia_perturbacion > 0.042)
    
    return {
        "presencia_detectada": humano_presente,
        "nivel_perturbacion_rf": float(energia_perturbacion),
        "zero_camera": True
    }`
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
                    stopModalCarousel();
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
                    resumeModalCarousel();
                }
            });
        });
    }

        // ---- Automatic Modal Carousel Engine ----
    let modalCarouselTimer = null;
    let currentSlideIndex = 0;

    function initModalCarousel(screenshots, projectTitle) {
        const grid = document.getElementById('modalGalleryGrid');
        if (!grid) return;

        stopModalCarousel();

        if (!screenshots || screenshots.length === 0) {
            grid.innerHTML = '<p class="mc-empty">No hay capturas disponibles para este sistema.</p>';
            return;
        }

        const items = screenshots.map((item, idx) => {
            if (typeof item === 'string') {
                const isMobile = item.toLowerCase().includes('responsive') || item.toLowerCase().includes('whatsapp');
                return {
                    src: item,
                    caption: isMobile ? 'MODO MÓVIL // RESPONSIVE COMPACT' : `CAPTURA ${String(idx + 1).padStart(2, '0')} // ${projectTitle}`
                };
            }
            return item;
        });

        currentSlideIndex = 0;
        const total = items.length;

        grid.innerHTML = `
            <div class="modal-carousel-root" id="modalCarouselRoot">
                <div class="mc-stage">
                    <div class="mc-slide-viewport">
                        ${items.map((it, i) => `
                            <div class="mc-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                                <img src="${it.src}" alt="${it.caption || projectTitle}" loading="lazy">
                                <div class="mc-slide-overlay">
                                    <span class="mc-slide-badge">${it.caption || `CAPTURA ${String(i + 1).padStart(2, '0')}`}</span>
                                    <span class="mc-zoom-hint"><i class="fas fa-search-plus"></i> CLICK PARA EXPANDIR</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <button class="mc-nav-btn mc-prev" aria-label="Anterior" type="button">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="mc-nav-btn mc-next" aria-label="Siguiente" type="button">
                        <i class="fas fa-chevron-right"></i>
                    </button>

                    <div class="mc-progress-track">
                        <div class="mc-progress-bar" id="mcProgressBar"></div>
                    </div>
                </div>

                <div class="mc-footer">
                    <div class="mc-counter">
                        <span class="mc-current-num">01</span>
                        <span class="mc-sep">/</span>
                        <span class="mc-total-num">${String(total).padStart(2, '0')}</span>
                    </div>
                    <div class="mc-dots">
                        ${items.map((_, i) => `
                            <button class="mc-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Diapositiva ${i + 1}"></button>
                        `).join('')}
                    </div>
                    <div class="mc-status-pill">
                        <span class="mc-pulse-dot"></span>
                        <span class="mc-status-label">AUTO-SLIDE</span>
                    </div>
                </div>

                <div class="mc-thumbnails">
                    ${items.map((it, i) => `
                        <button class="mc-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" type="button">
                            <img src="${it.src}" alt="Miniatura ${i + 1}">
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        const root = document.getElementById('modalCarouselRoot');
        const slides = root.querySelectorAll('.mc-slide');
        const dots = root.querySelectorAll('.mc-dot');
        const thumbs = root.querySelectorAll('.mc-thumb');
        const prevBtn = root.querySelector('.mc-prev');
        const nextBtn = root.querySelector('.mc-next');
        const currentNum = root.querySelector('.mc-current-num');
        const progressBar = document.getElementById('mcProgressBar');

        function showSlide(idx) {
            currentSlideIndex = (idx + total) % total;
            slides.forEach((sl, i) => sl.classList.toggle('active', i === currentSlideIndex));
            dots.forEach((dt, i) => dt.classList.toggle('active', i === currentSlideIndex));
            thumbs.forEach((th, i) => {
                th.classList.toggle('active', i === currentSlideIndex);
                if (i === currentSlideIndex) {
                    th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
            if (currentNum) currentNum.textContent = String(currentSlideIndex + 1).padStart(2, '0');
            resetProgressBar();
        }

        function resetProgressBar() {
            if (!progressBar) return;
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            void progressBar.offsetWidth;
            progressBar.style.transition = 'width 3500ms linear';
            progressBar.style.width = '100%';
        }

        function startAutoSlide() {
            stopAutoSlide();
            resetProgressBar();
            modalCarouselTimer = setInterval(() => {
                showSlide(currentSlideIndex + 1);
            }, 3500);
        }

        function stopAutoSlide() {
            if (modalCarouselTimer) {
                clearInterval(modalCarouselTimer);
                modalCarouselTimer = null;
            }
            if (progressBar) {
                const curW = window.getComputedStyle(progressBar).width;
                progressBar.style.transition = 'none';
                progressBar.style.width = curW;
            }
        }

        window._modalCarouselResume = startAutoSlide;
        window._modalCarouselPause  = stopAutoSlide;

        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlideIndex - 1);
            startAutoSlide();
        });

        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlideIndex + 1);
            startAutoSlide();
        });

        dots.forEach(d => {
            d.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(parseInt(d.dataset.index, 10));
                startAutoSlide();
            });
        });

        thumbs.forEach(t => {
            t.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(parseInt(t.dataset.index, 10));
                startAutoSlide();
            });
        });

        root.addEventListener('mouseenter', stopAutoSlide);
        root.addEventListener('mouseleave', startAutoSlide);

        slides.forEach(sl => {
            sl.addEventListener('click', () => {
                const img = sl.querySelector('img');
                if (img && typeof openFullscreen === 'function') {
                    openFullscreen(img.src);
                }
            });
        });

        startAutoSlide();
    }

    function stopModalCarousel() {
        if (modalCarouselTimer) {
            clearInterval(modalCarouselTimer);
            modalCarouselTimer = null;
        }
    }

    function resumeModalCarousel() {
        if (typeof window._modalCarouselResume === 'function') {
            window._modalCarouselResume();
        }
    }

    function openModal(projectKey) {
        if (projectKey === 'cerdiv') projectKey = 'iuta';
        if (projectKey === 'biopass' || projectKey === 'facepayroll' || projectKey === 'aura-biopass') projectKey = 'behban';
        if (projectKey === 'wifi-sense' || projectKey === 'ghostsense') projectKey = 'wifisense';
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

        // Activar pestaña de Capturas Reales / Video por defecto
        const defaultTabBtn = document.querySelector('.modal-tab-btn[data-tab="screenshots"]');
        if (defaultTabBtn) {
            document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            defaultTabBtn.classList.add('active');
            defaultTabBtn.innerHTML = data.youtubeId ? '<i class="fab fa-youtube"></i> Video Demo' : '<i class="fas fa-desktop"></i> Capturas Reales';
        }
        const canvasContainer = document.getElementById('modal-3d-canvas-container');
        const canvasHint = document.querySelector('.canvas-3d-hint');
        const galleryContainer = document.getElementById('modal-gallery-container');
        if (canvasContainer) canvasContainer.classList.add('tab-hidden');
        if (canvasHint) canvasHint.classList.add('tab-hidden');
        if (galleryContainer) galleryContainer.classList.remove('tab-hidden');

        const grid = document.getElementById('modalGalleryGrid');
        if (data.youtubeId) {
            // Reproductor HD de YouTube para SVIVA Web y proyectos con video
            stopModalCarousel();
            if (grid) {
                grid.innerHTML = `
                    <div class="modal-video-stage">
                        <div class="modal-video-frame">
                            <iframe 
                                id="modalYoutubeIframe"
                                src="https://www.youtube-nocookie.com/embed/${data.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1" 
                                title="${data.title}" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div class="modal-video-info">
                            <span class="mc-slide-badge"><i class="fab fa-youtube"></i> DEMO EN VIVO // SCROLLYTELLING SHOWCASE</span>
                            <span class="mc-zoom-hint"><i class="fas fa-play-circle"></i> REPRODUCCIÓN FULL HD</span>
                        </div>
                        ${data.screenshots && data.screenshots.length > 0 ? `
                            <div class="mc-thumbnails" style="margin-top: 6px;">
                                ${data.screenshots.map((s, i) => `
                                    <button class="mc-thumb" data-index="${i}" type="button" title="Ver captura ${i + 1}">
                                        <img src="${typeof s === 'string' ? s : s.src}" alt="Miniatura ${i + 1}">
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;

                grid.querySelectorAll('.mc-thumb').forEach(th => {
                    th.addEventListener('click', () => {
                        const idx = parseInt(th.dataset.index, 10);
                        const s = data.screenshots[idx];
                        const src = typeof s === 'string' ? s : s.src;
                        if (typeof openFullscreen === 'function') openFullscreen(src);
                    });
                });
            }
        } else {
            // Inicializar el carrusel automático con las fotos del proyecto
            initModalCarousel(data.screenshots, data.title);
        }

        // Inyectar y resaltar código fuente
        const codeSnippetEl = document.getElementById('modalCodeSnippet');
        if (codeSnippetEl) {
            codeSnippetEl.innerHTML = highlightCode(data.code || '');
        }

        modalOverlay.classList.add('modal-open');
        document.body.style.overflow = 'hidden';

        // Inicializar canvas 3D con delay por si el usuario pasa a la pestaña 3D
        setTimeout(() => {
            initModal3D(projectKey);
        }, 120);

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
    window.closeProjectModal = closeModal;

    function closeModal() {
        stopModalCarousel();
        // Detener de inmediato cualquier video de YouTube activo
        const grid = document.getElementById('modalGalleryGrid');
        if (grid) grid.innerHTML = '';

        modalOverlay.classList.remove('modal-open');
        document.body.style.overflow = '';
        
        const container = document.getElementById('modal-3d-canvas-container');
        if (container) container.classList.remove('loaded');

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


    // Attach clicks to R&D Pipeline cards (.rd-card)
    document.querySelectorAll('.rd-card[data-info], .rd-showcase-card[data-info]').forEach(card => {
        card.addEventListener('click', (e) => {
            // Evitar duplicar si se hizo clic directo en el botón info-btn
            if (e.target.closest('.info-btn')) return;
            const key = card.getAttribute('data-info');
            if (key) openModal(key);
        });
    });

    // ---- Visualizador Animado de Ondas Wi-Fi CSI (GhostSense RF) ----
    function initRFWavesAnimation() {
        const canvas = document.getElementById('canvas-rf-waves');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.clientWidth || 480;
        let height = canvas.height = canvas.parentElement.clientHeight || 200;

        window.addEventListener('resize', () => {
            if (canvas.parentElement) {
                width = canvas.width = canvas.parentElement.clientWidth;
                height = canvas.height = canvas.parentElement.clientHeight;
            }
        }, { passive: true });

        let step = 0;
        let burstIntensity = 0;
        let burstTimer = 0;

        function draw() {
            step += 0.035;
            burstTimer += 1;

            // Simular perturbación periódica por movimiento humano cada ~3.5 segundos
            if (burstTimer > 180) {
                burstIntensity = 1.0;
                burstTimer = 0;
            }
            if (burstIntensity > 0) {
                burstIntensity -= 0.012;
                if (burstIntensity < 0) burstIntensity = 0;
            }

            ctx.fillStyle = 'rgba(5, 7, 10, 0.25)';
            ctx.fillRect(0, 0, width, height);

            // Dibujar rejilla HUD de fondo
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
            ctx.lineWidth = 1;
            const gridSpacing = 30;
            for (let x = 0; x < width; x += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // 4 capas de ondas sinusoidales representando subportadoras OFDM Wi-Fi
            const waves = [
                { color: 'rgba(0, 229, 255, 0.85)', speed: 1.2, freq: 0.016, amp: 26, yOffset: 0 },
                { color: 'rgba(17, 212, 131, 0.65)', speed: 0.8, freq: 0.022, amp: 18, yOffset: -12 },
                { color: 'rgba(139, 92, 246, 0.55)', speed: 1.5, freq: 0.028, amp: 22, yOffset: 12 },
                { color: 'rgba(0, 229, 255, 0.35)', speed: 0.5, freq: 0.012, amp: 32, yOffset: 0 }
            ];

            const centerY = height / 2;

            waves.forEach(w => {
                ctx.beginPath();
                ctx.strokeStyle = w.color;
                ctx.lineWidth = 1.8;

                const dynamicAmp = w.amp * (1 + burstIntensity * 1.6);

                for (let x = 0; x < width; x += 4) {
                    const angle = x * w.freq + step * w.speed;
                    // Modulación por portadoras secundarias
                    const microNoise = Math.sin(x * 0.08 + step * 2) * (burstIntensity * 8);
                    const y = centerY + w.yOffset + Math.sin(angle) * dynamicAmp + microNoise;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            });

            requestAnimationFrame(draw);
        }

        draw();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRFWavesAnimation);
    } else {
        initRFWavesAnimation();
    }

    // Attach clicks to Works Archive rows (.wa-row) and any .info-btn
    document.querySelectorAll('.wa-row[data-info]').forEach(row => {
        row.addEventListener('click', (e) => {
            const key = row.getAttribute('data-info');
            if (key) openModal(key);
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


            // Philosophy engine legacy stub for backward compatibility
    window.switchPhCanvas = function() {};
    window._phCanvasActive = 1;

    function init3DCore() {
        
        const container = document.getElementById('canvas-3d-container');
        if (!container) return;
        if (typeof THREE === 'undefined') {
            throw new Error("Three.js library is not loaded! THREE is undefined.");
        }

        const scene = new THREE.Scene();
        window.__debugScene = scene;
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 7.5);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;
        container.appendChild(renderer.domElement);

        // ====================================================================
        // AWWWARDS SOTY MASTERPIECE: THE VANTA OBSIDIAN MONOLITH & QUANTUM CORE
        // Procedural Studio IBL + Multi-Faceted Creased Blades + Optical Crystal
        // ====================================================================

        // --- 1. PROCEDURAL STUDIO ENVIRONMENT MAP (High-End IBL Specular Highlights) ---
        function createStudioEnvironment(rendererInstance) {
            const pmremGenerator = new THREE.PMREMGenerator(rendererInstance);
            pmremGenerator.compileEquirectangularShader();

            const c = document.createElement('canvas');
            c.width = 1024;
            c.height = 512;
            const ctx = c.getContext('2d');

            // Deep studio obsidian background with soft vertical vignette
            const bgG = ctx.createLinearGradient(0, 0, 0, 512);
            bgG.addColorStop(0, '#04070a');
            bgG.addColorStop(0.5, '#020406');
            bgG.addColorStop(1, '#010203');
            ctx.fillStyle = bgG;
            ctx.fillRect(0, 0, 1024, 512);

            // Overhead Softbox (pure diffuse white with emerald falloff)
            const topG = ctx.createLinearGradient(0, 0, 0, 160);
            topG.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            topG.addColorStop(0.4, 'rgba(210, 245, 230, 0.6)');
            topG.addColorStop(1, 'rgba(2, 4, 6, 0.0)');
            ctx.fillStyle = topG;
            ctx.fillRect(200, 0, 624, 160);

            // Left Key Light (slanted architectural slit with crisp emerald laser ribbon)
            ctx.save();
            ctx.translate(220, 260);
            ctx.rotate(-0.25);
            const leftKey = ctx.createLinearGradient(-40, 0, 40, 0);
            leftKey.addColorStop(0, 'rgba(0,0,0,0)');
            leftKey.addColorStop(0.5, 'rgba(17, 212, 131, 0.95)');
            leftKey.addColorStop(0.8, 'rgba(255, 255, 255, 0.9)');
            leftKey.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = leftKey;
            ctx.fillRect(-60, -180, 120, 360);
            ctx.restore();

            // Right Rim Light (razor-sharp white diamond specular highlight)
            ctx.save();
            ctx.translate(820, 240);
            ctx.rotate(0.3);
            const rightRim = ctx.createLinearGradient(-35, 0, 35, 0);
            rightRim.addColorStop(0, 'rgba(0,0,0,0)');
            rightRim.addColorStop(0.4, 'rgba(255, 255, 255, 0.95)');
            rightRim.addColorStop(0.7, 'rgba(0, 229, 255, 0.7)');
            rightRim.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = rightRim;
            ctx.fillRect(-50, -180, 100, 360);
            ctx.restore();

            // Bottom ground bounce
            const btmG = ctx.createLinearGradient(0, 400, 0, 512);
            btmG.addColorStop(0, 'rgba(0,0,0,0)');
            btmG.addColorStop(1, 'rgba(17, 212, 131, 0.25)');
            ctx.fillStyle = btmG;
            ctx.fillRect(0, 400, 1024, 112);

            const tex = new THREE.CanvasTexture(c);
            tex.mapping = THREE.EquirectangularReflectionMapping;
            const envMap = pmremGenerator.fromEquirectangular(tex).texture;
            pmremGenerator.dispose();
            return envMap;
        }

        scene.environment = createStudioEnvironment(renderer);

        // --- 2. STUDIO LIGHTING SYSTEM ---
        const ambientLight = new THREE.AmbientLight(0x020704, 0.75);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
        keyLight.position.set(4.5, 5.5, 4.0);
        scene.add(keyLight);

        const topLight = new THREE.DirectionalLight(0xffffff, 2.5);
        topLight.position.set(-2.0, 6.5, 3.0);
        scene.add(topLight);

        const fillLight = new THREE.DirectionalLight(0x059669, 2.2);
        fillLight.position.set(-5.0, -3.5, 2.0);
        scene.add(fillLight);

        const frontLight = new THREE.DirectionalLight(0x34d399, 1.2);
        frontLight.position.set(0, 0, 6.0);
        scene.add(frontLight);

        const cursorPointLight = new THREE.PointLight(0x11d483, 2.8, 12, 1.8);
        cursorPointLight.position.set(0, 0, 4.0);
        scene.add(cursorPointLight);

        // --- 3. GEOMETRY: THE MONOLITHIC OBSIDIAN CHEVRON ---
        const vMonolithMat = new THREE.MeshPhysicalMaterial({
            color: 0x010403,
            emissive: 0x02150b,
            emissiveIntensity: 0.35,
            roughness: 0.12,
            metalness: 0.85,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04,
            reflectivity: 1.0,
            ior: 1.78,
            transparent: true,
            opacity: 0.95,
            envMapIntensity: 2.8
        });
        const sculptureMat = vMonolithMat;

        const edgeLineMat = new THREE.LineBasicMaterial({
            color: 0x11d483,
            transparent: true,
            opacity: 0.60,
            blending: THREE.AdditiveBlending
        });

        function createCreasedBlade(isLeft) {
            const geom = new THREE.BufferGeometry();
            const sign = isLeft ? -1 : 1;

            const slices = [
                { y: -1.35, w: 0.26, t: 0.28, x: 0.14 * sign },
                { y: -0.60, w: 0.48, t: 0.42, x: 0.52 * sign },
                { y: 0.35,  w: 0.68, t: 0.52, x: 1.05 * sign },
                { y: 1.20,  w: 0.62, t: 0.44, x: 1.58 * sign },
                { y: 1.80,  w: 0.52, t: 0.32, x: 1.98 * sign }
            ];

            const positions = [];

            function pt(slice, type) {
                const x0 = slice.x;
                const y0 = slice.y;
                const w = slice.w;
                const t = slice.t;
                if (type === 'F') return [x0, y0, t * 0.55];
                if (type === 'B') return [x0, y0, -t * 0.55];
                if (type === 'O') return [x0 + w * 0.68 * sign, y0, 0];
                if (type === 'I') return [x0 - w * 0.32 * sign, y0, 0];
            }

            function addQuad(p1, p2, p3, p4) {
                positions.push(...p1, ...p2, ...p3);
                positions.push(...p1, ...p3, ...p4);
            }

            for (let i = 0; i < slices.length - 1; i++) {
                const s0 = slices[i];
                const s1 = slices[i + 1];

                const f0 = pt(s0, 'F'), f1 = pt(s1, 'F');
                const o0 = pt(s0, 'O'), o1 = pt(s1, 'O');
                const b0 = pt(s0, 'B'), b1 = pt(s1, 'B');
                const i0 = pt(s0, 'I'), i1 = pt(s1, 'I');

                if (isLeft) {
                    addQuad(f0, o0, o1, f1);
                    addQuad(f0, f1, i1, i0);
                    addQuad(b0, b1, o1, o0);
                    addQuad(b0, i0, i1, b1);
                } else {
                    addQuad(f0, f1, o1, o0);
                    addQuad(f0, i0, i1, f1);
                    addQuad(b0, o0, o1, b1);
                    addQuad(b0, b1, i1, i0);
                }
            }

            // Bottom Apex Cap
            const apex = slices[0];
            const af = pt(apex, 'F'), ao = pt(apex, 'O'), ab = pt(apex, 'B'), ai = pt(apex, 'I');
            if (isLeft) addQuad(af, ao, ab, ai);
            else addQuad(af, ai, ab, ao);

            // Top Wing Tip Cap
            const tip = slices[slices.length - 1];
            const tf = pt(tip, 'F'), to = pt(tip, 'O'), tb = pt(tip, 'B'), ti = pt(tip, 'I');
            if (isLeft) addQuad(tf, ti, tb, to);
            else addQuad(tf, to, tb, ti);

            geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geom.computeVertexNormals();
            return geom;
        }

        const leftGeo = createCreasedBlade(true);
        const rightGeo = createCreasedBlade(false);

        const leftBlade = new THREE.Mesh(leftGeo, vMonolithMat);
        const rightBlade = new THREE.Mesh(rightGeo, vMonolithMat);

        const leftEdges = new THREE.LineSegments(new THREE.EdgesGeometry(leftGeo, 28), edgeLineMat);
        const rightEdges = new THREE.LineSegments(new THREE.EdgesGeometry(rightGeo, 28), edgeLineMat);
        leftBlade.add(leftEdges);
        rightBlade.add(rightEdges);

        const bladesGroup = new THREE.Group();
        bladesGroup.add(leftBlade);
        bladesGroup.add(rightBlade);
        const vMonolithMesh = bladesGroup;
        const sculptureMesh = bladesGroup;

        // --- 4. FLOATING OPTICAL QUANTUM SINGULARITY CORE ---
        const coreGeo = new THREE.OctahedronGeometry(0.28, 0);
        const coreMat = new THREE.MeshPhysicalMaterial({
            color: 0x01150b,
            emissive: 0x059669,
            emissiveIntensity: 0.95,
            roughness: 0.02,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            ior: 2.4,
            transparent: true,
            opacity: 0.85,
            envMapIntensity: 3.5
        });
        const conduitMat = coreMat;
        const photonMat = coreMat;
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.set(0, 0.38, 0.05);

        const photonMesh = coreMesh;
        const innerCoreGroup = new THREE.Group();
        innerCoreGroup.add(coreMesh);

        const innerCoreLight = new THREE.PointLight(0x10b981, 2.5, 6.5, 1.8);
        innerCoreLight.position.set(0, 0.38, 0.2);

        // --- 5. HOROLOGY PRECISION HORIZON BEZEL ---
        const ringGeo = new THREE.TorusGeometry(2.45, 0.0065, 16, 160);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x0d2218,
            emissive: 0x11d483,
            emissiveIntensity: 0.35,
            metalness: 0.95,
            roughness: 0.15,
            transparent: true,
            opacity: 0.50
        });
        const ring1Mat = ringMat;
        const ring2Mat = ringMat;

        const horizonRing = new THREE.Mesh(ringGeo, ringMat);
        horizonRing.position.set(0, -0.35, 0);
        horizonRing.rotation.x = Math.PI / 2.32;
        horizonRing.rotation.y = -Math.PI / 16;

        const tickGeo = new THREE.BoxGeometry(0.012, 0.065, 0.012);
        const tickMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.85 });
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const tick = new THREE.Mesh(tickGeo, tickMat);
            tick.position.set(Math.cos(angle) * 2.45, Math.sin(angle) * 2.45, 0);
            tick.rotation.z = angle;
            horizonRing.add(tick);
        }

        const orbitalGroup = horizonRing;
        const gimbalGroup = new THREE.Group(); // clean legacy stub
        const rhombusGroup = new THREE.Group(); // clean legacy stub

        // --- 6. AMBIENT QUANTUM DUST EMBERS ---
        const emberGeo = new THREE.BufferGeometry();
        const emberCount = 35;
        const emberPos = new Float32Array(emberCount * 3);
        for (let i = 0; i < emberCount; i++) {
            emberPos[i * 3] = (Math.random() - 0.5) * 7.5;
            emberPos[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
            emberPos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
        }
        emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
        const emberMat = new THREE.PointsMaterial({
            color: 0x11d483,
            size: 0.045,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const embers = new THREE.Points(emberGeo, emberMat);

        // Master Assembly
        const logoGroup = new THREE.Group();
        logoGroup.add(bladesGroup);
        logoGroup.add(innerCoreGroup);
        logoGroup.add(innerCoreLight);
        logoGroup.add(horizonRing);
        logoGroup.add(embers);
        logoGroup.scale.setScalar(1.0);
        scene.add(logoGroup);

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

        // Posicionamiento responsivo del logo: Centrado en el lienzo mundial para el Spatial Sandwich
        const updateLogoPosition = () => {
            logoGroup.position.x = 0;
            const isMob = window.innerWidth <= 768;
            logoGroup.position.y = isMob ? -0.12 : (window.innerWidth <= 991 ? -0.08 : -0.1);
        };
        updateLogoPosition();

        // Variables de interacción y física de scroll
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        let normMouseX = 0, normMouseY = 0;
        let lastScrollY = window.scrollY || window.pageYOffset || 0;
        let scrollVelocity = 0;
        let flowOffset = 0;
        let logoScaleObj = { value: 1.0 };
        let logoRotationObj = { y: 0.0 };

        window.addEventListener('mousemove', (e) => {
            normMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            normMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            targetX = (e.clientX - window.innerWidth / 2) * 0.0007;
            targetY = (e.clientY - window.innerHeight / 2) * 0.0007;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updateLogoPosition();
        });

        // Mecánica "Press & Hold" (Quantum Overcharge — Resn)
        let isHolding = false;
        let holdCharge = 0.0;

        window.addEventListener('mousedown', (e) => {
            if (window.scrollY < window.innerHeight * 0.85 && !e.target.closest('a, button, input, textarea')) {
                isHolding = true;
                
                if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.startOvercharge === 'function') {
                    window.VANTA_AUDIO.startOvercharge();
                }
            }
        });

        window.addEventListener('mouseup', () => {
            if (isHolding) {
                isHolding = false;
                
                if (holdCharge > 0.28) {
                    triggerShockwave({ amplitude: 12.0 * holdCharge + 4.0, speed: 18.0, width: 1.2, decay: 1.1 });
                    if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.stopOvercharge === 'function') {
                        window.VANTA_AUDIO.stopOvercharge(true);
                    }
                } else {
                    if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.stopOvercharge === 'function') {
                        window.VANTA_AUDIO.stopOvercharge(false);
                    }
                }
                holdCharge = 0.0;
            }
        });

        window.addEventListener('touchstart', (e) => {
            if (window.scrollY < window.innerHeight * 0.85 && !e.target.closest('a, button, input, textarea')) {
                isHolding = true;
                
                if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.startOvercharge === 'function') {
                    window.VANTA_AUDIO.startOvercharge();
                }
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            if (isHolding) {
                isHolding = false;
                
                if (holdCharge > 0.28) {
                    triggerShockwave({ amplitude: 12.0 * holdCharge + 4.0, speed: 18.0, width: 1.2, decay: 1.1 });
                    if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.stopOvercharge === 'function') {
                        window.VANTA_AUDIO.stopOvercharge(true);
                    }
                } else {
                    if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.stopOvercharge === 'function') {
                        window.VANTA_AUDIO.stopOvercharge(false);
                    }
                }
                holdCharge = 0.0;
            }
        }, { passive: true });

        const shockwaves = [];

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
                    { value: 0.05 },
                    { value: 1.0, duration: 2.2, ease: 'elastic.out(0.85, 0.68)' }
                );
                
                gsap.fromTo(logoRotationObj,
                    { y: -0.55 },
                    { y: 0.0, duration: 2.6, ease: 'power3.out' }
                );
            } else {
                logoScaleObj.value = 1.0;
                logoRotationObj.y = 0.0;
            }
            
            // Destello flash blanco sutil en el material
            if (typeof vMonolithMat !== 'undefined') {
                vMonolithMat.emissive = new THREE.Color(0x11d483);
                vMonolithMat.emissiveIntensity = 1.2;
            }
            if (typeof conduitMat !== 'undefined') {
                conduitMat.emissiveIntensity = 6.0;
            }
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

        // Gestor de ciclo de vida 3D (Se ejecuta continuamente en pestaña activa)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            } else {
                if (!animationFrameId) {
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
            const isWarpActive = (typeof window.__heroWarpProgress === 'number');
            const warpP = isWarpActive ? window.__heroWarpProgress : 0;
            const heroPinSpan = window.__heroPinDistance || (heroHeight * 1.4);
            const inHero = isWarpActive ? (warpP < 1.0 || currentScroll <= (heroHeight + heroPinSpan)) : (currentScroll <= heroHeight * 1.2);
            const progress = isWarpActive ? warpP : Math.min(currentScroll / (heroHeight * 1.2), 1.0);

            scrollVelocity += (Math.abs(deltaScroll) - scrollVelocity) * 0.08;
            const clampedVelocity = Math.min(scrollVelocity, 120);

            // Colores neón dinámicos
            let primaryColor = new THREE.Color(0x11d483);
            if (window.currentPrimaryColor) {
                primaryColor.setStyle(window.currentPrimaryColor);
            }
            if (typeof sculptureMat !== 'undefined' && sculptureMat.emissiveIntensity > 0) {
                sculptureMat.emissiveIntensity *= 0.95;
            }
            if (typeof cursorPointLight !== 'undefined') {
                cursorPointLight.color.lerp(primaryColor, 0.06);
            }
            terrainMaterial.color.lerp(primaryColor, 0.06);

            // --- V LOGO (solo en Hero) ---
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;

            let warpBlast = 0;
            if (inHero) {
                // Interactive 3D Cursor Lighting (Dynamic Specular Caustics)
                cursorPointLight.position.x = mouseX * 5.5;
                cursorPointLight.position.y = mouseY * 4.5;

                // 1. Dynamic 3D Gaze Tracking & High-End Facet Rotation for the V Monolith
                const swayY = Math.sin(time * 0.22) * 0.04;
                const swayX = Math.cos(time * 0.16) * 0.03;
                bladesGroup.rotation.y += (time * 0.08 + mouseX * 0.75 + swayY - bladesGroup.rotation.y) * 0.045;
                bladesGroup.rotation.x += (0.18 + mouseY * 0.45 + swayX - bladesGroup.rotation.x) * 0.045;
                bladesGroup.rotation.z = Math.sin(time * 0.14) * 0.02;

                // 2. Optical Quantum Singularity: Counter-rotation & breathing luminescence
                coreMesh.rotation.y = -time * 0.32;
                coreMesh.rotation.x = Math.sin(time * 0.5) * 0.22;

                if (isHolding) {
                    holdCharge = Math.min(1.0, holdCharge + 0.02);
                } else {
                    holdCharge = Math.max(0.0, holdCharge - 0.035);
                }

                const pulseLum = 0.95 + Math.sin(time * 2.4) * 0.35;
                coreMat.emissiveIntensity = isHolding ? (1.5 + holdCharge * 5.0) : pulseLum;
                innerCoreLight.intensity = isHolding ? (3.5 + holdCharge * 8.0) : (2.5 + Math.sin(time * 2.4) * 0.6);

                // 3. Horology Precision Horizon: Precession spin
                horizonRing.rotation.z += isHolding ? 0.015 : 0.0025;

                // 4. Scrollytelling Transition (Aristide Benoist Luxury Flow)
                const isMob = window.innerWidth <= 768;
                const isTab = window.innerWidth <= 991;
                const baseScale = isMob ? 0.44 : (isTab ? 0.70 : 0.98);
                const defaultPosY = isMob ? 0.62 : (isTab ? -0.04 : -0.05);

                if (isWarpActive && warpP > 0.005) {
                    logoGroup.position.y = defaultPosY - warpP * 1.8;
                    logoGroup.position.z = -warpP * 5.8;
                    logoGroup.scale.setScalar(baseScale * (1.0 - warpP * 0.4) * logoScaleObj.value);
                    const fade = Math.max(0.0, 1.0 - warpP * 0.85);
                    vMonolithMat.opacity = fade * 0.95;
                    coreMat.opacity = fade * 0.85;
                    edgeLineMat.opacity = fade * 0.60;
                    ringMat.opacity = fade * 0.50;
                    emberMat.opacity = fade * 0.60;
                    ring1Mat.opacity = fade * 0.50;
                    ring2Mat.opacity = fade * 0.50;
                } else {
                    logoGroup.position.set(0, defaultPosY, 0);
                    logoGroup.scale.setScalar(baseScale * logoScaleObj.value);
                    vMonolithMat.opacity = 0.95;
                    coreMat.opacity = 0.85;
                    edgeLineMat.opacity = 0.60;
                    ringMat.opacity = 0.50;
                    emberMat.opacity = 0.60;
                    ring1Mat.opacity = 0.50;
                    ring2Mat.opacity = 0.50;
                }
            } else {
                vMonolithMat.opacity = 0.0;
                coreMat.opacity = 0.0;
                conduitMat.opacity = 0.0;
                photonMat.opacity = 0.0;
                edgeLineMat.opacity = 0.0;
                ringMat.opacity = 0.0;
                emberMat.opacity = 0.0;
                ring1Mat.opacity = 0.0;
                ring2Mat.opacity = 0.0;
                if (camera.position.z !== 7.5) {
                    camera.position.set(0, 0, 7.5);
                    camera.fov = 50;
                    camera.updateProjectionMatrix();
                }
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

        // Iniciar bucle de renderizado 3D continuo
        animate();
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
                    const offset = targetId === '#tech-matrix' ? Math.round(window.innerHeight * 0.85) : 0;
                    // duration: 1.2 segundos para una transición suave y elegante
                    lenis.scrollTo(target, { offset: offset, duration: 1.2 });
                }
            });
        });
    }

    // Scroll listener unificado y súper optimizado
    function handleScrollUnified(scrollY) {
        currentScrollY = scrollY;
        updateNavbar(scrollY);
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
                const label   = btn.querySelector('.audio-status-label');
                if (this.enabled) {
                    if (iconOff) iconOff.style.display = 'none';
                    if (iconOn)  iconOn.style.display = 'inline-block';
                    if (label)   label.textContent = 'AUDIO: ON';
                    btn.classList.add('active');
                    this.playClick();
                } else {
                    if (iconOff) iconOff.style.display = 'inline-block';
                    if (iconOn)  iconOn.style.display = 'none';
                    if (label)   label.textContent = 'AUDIO: OFF';
                    btn.classList.remove('active');
                }
            }
            if (window.VANTA_AUDIO && window.VANTA_AUDIO.isEnabled !== this.enabled) {
                window.VANTA_AUDIO.isEnabled = this.enabled;
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

    // Lanzar al cargar
    setTimeout(() => {
        init3DCore();
        initTechBentoTilt();
        
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