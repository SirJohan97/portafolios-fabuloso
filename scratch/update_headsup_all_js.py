import os

js_perfect_code = """    /* ============================================================
       AWWWARDS CYBERPUNK POKER TECH DECK — Real Heads-Up Game Sequence
       Top Player: ANDRÉS ♠ (Full-Stack & Cloud)
       Bottom Player: JOHAN ♦ (AI Vision & 3D Graphics)
       Center Pot: THE WINNING RIVER CARD (VANTA Master Slam)
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
                metrics: [
                    { val: "10k Req/s", lbl: "Concurrencia" },
                    { val: "< 1.5ms", lbl: "Latencia" },
                    { val: "Pydantic v2", lbl: "Esquema Estricto" },
                    { val: "Uvicorn", lbl: "ASGI Core" }
                ]
            },
            supabase: {
                badge: "CLOUD & BAAS", title: "Supabase Cloud",
                rank: "REY DE PICAS ♠", accent: "#3ECF8E", icon: "fas fa-cloud-upload-alt",
                desc: "Bases de datos relacionales Postgres en tiempo real con políticas RLS, Storage CDN y Edge Functions.",
                projects: [
                    { icon: "fas fa-database", name: "Base de Datos Multi-Tenant", desc: "Streaming WebSocket en vivo y triggers automáticos." },
                    { icon: "fas fa-lock", name: "Row Level Security (RLS)", desc: "Aisolation granular de datos por cliente." }
                ],
                metrics: [
                    { val: "Realtime", lbl: "WebSockets" },
                    { val: "100% RLS", lbl: "Seguridad Granular" },
                    { val: "Edge CDN", lbl: "Global Cache" },
                    { val: "Postgres", lbl: "ACID Engine" }
                ]
            },
            react: {
                badge: "UI FRONTEND", title: "React 19, TS & Core Web",
                rank: "REINA DE DIAMANTES ♦", accent: "#61DAFB", icon: "fab fa-react",
                desc: "Plataformas frontend modulares con React 19, Server Components, TypeScript estricto, HTML5, CSS3 y JS.",
                projects: [
                    { icon: "fas fa-desktop", name: "Plataforma Web Studio", desc: "Renderizado reactivo a 60 FPS con animaciones cinéticas." },
                    { icon: "fas fa-code", name: "HTML5/CSS3/JS Moderno", desc: "Sin dependencias pesadas, optimización CSS atómica." }
                ],
                metrics: [
                    { val: "100/100", lbl: "Lighthouse" },
                    { val: "0.0s", lbl: "CLS Layout Shift" },
                    { val: "Strict TS", lbl: "Tipado Estricto" },
                    { val: "React 19", lbl: "Server Actions" }
                ]
            },
            nodejs: {
                badge: "SERVERLESS ENGINE", title: "Node.js & Vercel Edge",
                rank: "JOTA DE TRÉBOLES ♣", accent: "#68A063", icon: "fab fa-node-js",
                desc: "Microservicios en Node.js asíncronos y canalización de despliegue serverless continuo en Vercel Edge Network.",
                projects: [
                    { icon: "fas fa-network-wired", name: "Edge Microservices Network", desc: "Despliegues globales instantáneos con latencia cero." },
                    { icon: "fas fa-rocket", name: "Vercel CI/CD Pipeline", desc: "Compilación atomizada y vistas previas de ramas de Git." }
                ],
                metrics: [
                    { val: "< 5ms", lbl: "Edge Response" },
                    { val: "Serverless", lbl: "Escalado Elástico" },
                    { val: "Node.js 20", lbl: "Runtime LTH" },
                    { val: "Vercel CDN", lbl: "Cobertura Mundial" }
                ]
            },
            python: {
                badge: "CORE COMPUTING", title: "Python 3.11 & Flask",
                rank: "AS DE ESPADAS ♠", accent: "#3776AB", icon: "fab fa-python",
                desc: "Motor computacional en Python 3.11 para backend síncrono/asíncrono, micro-APIs en Flask y scripts de datos.",
                projects: [
                    { icon: "fas fa-microchip", name: "Microservicios Flask", desc: "APIs ligeras de alto rendimiento para procesamiento paralelo." },
                    { icon: "fas fa-cogs", name: "Orquestación de Datos", desc: "Pipelines de transformación y computación numérica." }
                ],
                metrics: [
                    { val: "Python 3.11", lbl: "CPython Async" },
                    { val: "Flask REST", lbl: "Micro-APIs" },
                    { val: "Zero-GIL", lbl: "Parallel Workers" },
                    { val: "100%", lbl: "Estabilidad Backend" }
                ]
            },
            andres_infra: {
                badge: "INFRASTRUCTURE", title: "C++, Docker & Git",
                rank: "DIEZ DE ESPADAS ♠", accent: "#00599C", icon: "fab fa-docker",
                desc: "Contenedores Docker aislados, control de versiones colaborativo con Git y módulos de bajo nivel en C++.",
                projects: [
                    { icon: "fas fa-box", name: "Dockerized Microservices", desc: "Contenedores multi-stage optimizados para producción." },
                    { icon: "fas fa-code-branch", name: "Git Workflow Master", desc: "Pipelines CI/CD automatizados y control estricto de ramas." }
                ],
                metrics: [
                    { val: "Dockerized", lbl: "Aislamiento Total" },
                    { val: "C++ Native", lbl: "Cómputo Nativo" },
                    { val: "Git CI/CD", lbl: "Control Versiones" },
                    { val: "Multi-Cloud", lbl: "Compatibilidad" }
                ]
            },
            yolo: {
                badge: "COMPUTER VISION", title: "YOLOv8 AI Vision",
                rank: "REY DE DIAMANTES ♦", accent: "#11d483", icon: "fas fa-eye",
                desc: "Redes convolucionales YOLOv8 para segmentación y detección de objetos en tiempo real 100% locales.",
                projects: [
                    { icon: "fas fa-video", name: "Control de Calidad Industrial", desc: "Inspección automatizada con 99.4% de precisión." },
                    { icon: "fas fa-camera", name: "Tracking Multicámara", desc: "32 objetos simultáneos sin latencia en la nube." }
                ],
                metrics: [
                    { val: "99.4%", lbl: "Precisión mAP" },
                    { val: "60 FPS", lbl: "Inferencia Local" },
                    { val: "TensorRT", lbl: "Aceleración GPU" },
                    { val: "0 Cloud", lbl: "Privacidad Total" }
                ]
            },
            ml: {
                badge: "ARTIFICIAL INTELLIGENCE", title: "Machine Learning & Neural Nets",
                rank: "AS DE TRÉBOLES ♣", accent: "#a855f7", icon: "fas fa-brain",
                desc: "Entrenamiento de modelos de aprendizaje profundo, redes neuronales personalizadas y algoritmos predictivos.",
                projects: [
                    { icon: "fas fa-project-diagram", name: "Redes Neuronales Profundas", desc: "Clasificación multivariada y modelos predictivos." },
                    { icon: "fas fa-chart-line", name: "Optimización de Hiperparámetros", desc: "Ajuste fino de modelos para máxima precisión." }
                ],
                metrics: [
                    { val: "Deep Learning", lbl: "Redes Neuronales" },
                    { val: "PyTorch Core", lbl: "Framework AI" },
                    { val: "Real-time", lbl: "Predicciones" },
                    { val: "Local AI", lbl: "Sin Intermediarios" }
                ]
            },
            three: {
                badge: "3D GRAPHICS", title: "3D Models & Three.js",
                rank: "REINA DE TRÉBOLES ♣", accent: "#00ffff", icon: "fas fa-cube",
                desc: "Visualización 3D interactiva en tiempo real WebGL, modelos 3D PBR, shaders GLSL y animaciones físicas.",
                projects: [
                    { icon: "fas fa-globe", name: "Universo 3D Portafolio VANTA", desc: "Partículas fluidas, cristal interactivo y refracción." },
                    { icon: "fas fa-cube", name: "Modelos 3D PBR", desc: "Carga optimizada de archivos GLTF/GLB con mapas HDRI." }
                ],
                metrics: [
                    { val: "120 FPS", lbl: "Render WebGL" },
                    { val: "GLSL 3.0", lbl: "Custom Shaders" },
                    { val: "PBR Materials", lbl: "Física de Luz" },
                    { val: "< 1.2MB", lbl: "Bundle Opt" }
                ]
            },
            postgres: {
                badge: "DATABASE ENGINE", title: "PostgreSQL & Neon",
                rank: "NUEVE DE DIAMANTES ♦", accent: "#4169E1", icon: "fas fa-database",
                desc: "Base de datos relacional serverless con aislamiento de transacciones ACID strictly enforcement y consultas JSONB híbridas.",
                projects: [
                    { icon: "fas fa-database", name: "Motor de Datos Multi-Tenant", desc: "Índices B-Tree optimizados + consultas JSONB." },
                    { icon: "fas fa-cloud", name: "Arquitectura Serverless Neon", desc: "Escalado elástico a cero en inactividad." }
                ],
                metrics: [
                    { val: "100%", lbl: "Garantía ACID" },
                    { val: "0.001ms", lbl: "Index Lookup" },
                    { val: "Neon Cloud", lbl: "Serverless Mesh" },
                    { val: "JSONB", lbl: "Document Hybrid" }
                ]
            },
            cloudflare: {
                badge: "CYBER SECURITY", title: "Cloudflare Tunnels",
                rank: "DIEZ DE DIAMANTES ♦", accent: "#F38020", icon: "fas fa-shield-alt",
                desc: "Enrutamiento privado de redes Zero Trust, túneles cifrados de punto a punto y protección anti-DDoS.",
                projects: [
                    { icon: "fas fa-user-shield", name: "Arquitectura Zero Trust", desc: "Acceso seguro a servidores locales sin puertos abiertos." },
                    { icon: "fas fa-network-wired", name: "Cloudflare Edge Tunnels", desc: "Tráfico encriptado de alta velocidad." }
                ],
                metrics: [
                    { val: "Zero Trust", lbl: "Sin Puertos Abiertos" },
                    { val: "Anti-DDoS", lbl: "Protección Edge" },
                    { val: "100% SSL", lbl: "Cifrado Total" },
                    { val: "< 2ms", lbl: "Latencia Túnel" }
                ]
            },
            johan_core: {
                badge: "CORE ENGINE", title: "Python, C++, Docker & Git",
                rank: "JOTA DE DIAMANTES ♦", accent: "#11d483", icon: "fas fa-code-branch",
                desc: "Integración de lenguajes de alto rendimiento, código nativo C++, contenedores Docker y flujos Git.",
                projects: [
                    { icon: "fas fa-terminal", name: "Bindings C++ Nativo", desc: "Aceleración de código crítico para procesamiento 3D y AI." },
                    { icon: "fas fa-boxes", name: "Dockerized Pipelines", desc: "Entornos de entrenamiento aislados en contenedores." }
                ],
                metrics: [
                    { val: "C++ Native", lbl: "Cómputo Nativo" },
                    { val: "Docker AI", lbl: "Entornos Aislados" },
                    { val: "Git Flow", lbl: "Control Código" },
                    { val: "Python AI", lbl: "Integración Core" }
                ]
            },
            vanta_master: {
                badge: "THE WINNING HAND", title: "VANTA ENGINE 2025",
                rank: "AS MAESTRO ♠♦", accent: "#f0c030", icon: "fas fa-crown",
                desc: "Sinergia técnica de elite por Andrés & Johan. La combinación perfecta de Full-Stack Cloud, IA y Gráficos 3D.",
                projects: [
                    { icon: "fas fa-user-astronaut", name: "Andrés — Full-Stack & Cloud", desc: "FastAPI, Supabase, React, Node, Python, Flask, C++, Vercel, Docker, Git." },
                    { icon: "fas fa-robot", name: "Johan — AI Vision & 3D", desc: "YOLOv8, Machine Learning, 3D Models, Three.js, Postgres, Cloudflare Tunnels, Python, C++, Docker, Git." }
                ],
                metrics: [
                    { val: "360° Studio", lbl: "Cobertura Total" },
                    { val: "60 FPS", lbl: "Rendimiento Web" },
                    { val: "Local AI", lbl: "Inferencia Propia" },
                    { val: "Awwwards", lbl: "Nivel de Calidad" }
                ]
            }
        };

        function setupPokerDealer() {
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                setTimeout(setupPokerDealer, 100);
                return;
            }
            gsap.registerPlugin(ScrollTrigger);

            // ─── Audio synth ───────────────────────────────────────────────
            let audioCtx = null;
            function playTick(freq = 440, dur = 0.06) {
                try {
                    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    if (audioCtx.state === 'suspended') audioCtx.resume();
                    const osc  = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, audioCtx.currentTime + dur);
                    gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + dur);
                } catch(e) {}
            }

            // ─── Master Slam Felt Shockwave Only ──────────────────────────
            function spawnMasterFeltShockwave() {
                if (!tableFelt) return;
                const ripple = document.createElement('div');
                ripple.className = 'master-felt-shockwave';
                ripple.style.cssText = `
                    left: 50%;
                    top: 50%;
                    width: 180px;
                    height: 90px;
                `;
                tableFelt.appendChild(ripple);
                setTimeout(() => ripple.remove(), 900);
            }

            // ─── Screen Shake on Master Slam ──────────────────────────────
            function triggerScreenShake() {
                if (!tableFelt) return;
                gsap.to(tableFelt, {
                    x: "+=5", y: "+=5",
                    duration: 0.04,
                    repeat: 7,
                    yoyo: true,
                    ease: "sine.inOut",
                    onComplete: () => gsap.set(tableFelt, { x: 0, y: 0 })
                });
            }

            // ─── Heads-Up Positions (Expanded Table 1080px x 640px) ───────
            const andresCards = document.querySelectorAll('.card-andres');
            const johanCards  = document.querySelectorAll('.card-johan');
            const masterCard  = document.getElementById('master-vanta-card');

            // Andrés hand (Top of Table) — 6 cards spread horizontally
            const andresSpots = [
                { x: -320, y: -160, rZ: -10 },
                { x: -192, y: -168, rZ: -6  },
                { x: -64,  y: -172, rZ: -2  },
                { x: 64,   y: -172, rZ: 2   },
                { x: 192,  y: -168, rZ: 6   },
                { x: 320,  y: -160, rZ: 10  }
            ];

            // Johan hand (Bottom of Table) — 6 cards spread horizontally
            const johanSpots = [
                { x: -320, y: 160, rZ: -10 },
                { x: -192, y: 168, rZ: -6  },
                { x: -64,  y: 172, rZ: -2  },
                { x: 64,   y: 172, rZ: 2   },
                { x: 192,  y: 168, rZ: 6   },
                { x: 320,  y: 160, rZ: 10  }
            ];

            // Initial hide of all cards inside center deck
            andresCards.forEach((card, i) => {
                const inner = card.querySelector('.poker-card-inner');
                gsap.set(card, { x: 0, y: -160, scale: 0.2, opacity: 0, rotationZ: 0, zIndex: i + 1 });
                if (inner) gsap.set(inner, { rotateY: 0 });
            });
            johanCards.forEach((card, i) => {
                const inner = card.querySelector('.poker-card-inner');
                gsap.set(card, { x: 0, y: 160, scale: 0.2, opacity: 0, rotationZ: 0, zIndex: i + 1 });
                if (inner) gsap.set(inner, { rotateY: 0 });
            });

            // Master Card initial state (Center pot)
            if (masterCard) {
                const inner = masterCard.querySelector('.poker-card-inner');
                gsap.set(masterCard, { x: 0, y: -220, scale: 2.2, opacity: 0, rotationZ: 0, zIndex: 50 });
                if (inner) gsap.set(inner, { rotateY: 0 });
            }

            // Player Seats Initial State
            const seatA = document.getElementById('seat-andres');
            const seatJ = document.getElementById('seat-johan');
            if (seatA) gsap.set(seatA, { opacity: 0, scale: 0.8 });
            if (seatJ) gsap.set(seatJ, { opacity: 0, scale: 0.8 });

            // ─── Master Scrubbed Timeline ──────────────────────────────────
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=130%",
                    pin: true,
                    scrub: 1.0,
                    anticipatePin: 1
                }
            });

            // PHASE 0: Header text Scrollytelling Fade Out -> Pure Cinema
            const pokerHeader = section.querySelector('.poker-header');
            if (pokerHeader) {
                gsap.set(pokerHeader, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
                tl.to(pokerHeader, {
                    opacity: 0,
                    y: -50,
                    scale: 0.94,
                    filter: "blur(10px)",
                    duration: 0.45,
                    ease: "power2.inOut"
                }, 0);
            }

            // Reveal Player Seats (Top & Bottom Rails)
            if (seatA) tl.to(seatA, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.5)" }, 0.1);
            if (seatJ) tl.to(seatJ, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.5)" }, 0.15);

            // PHASE 1: Deal Andrés's hand (Top of Table)
            andresCards.forEach((card, index) => {
                const spot  = andresSpots[index] || { x: 0, y: -160, rZ: 0 };
                const inner = card.querySelector('.poker-card-inner');
                const delay = 0.2 + index * 0.12;

                tl.to(card, { x: spot.x, y: spot.y - 30, scale: 0.95, opacity: 1, rotationZ: spot.rZ * 0.5, duration: 0.4, ease: "power2.out" }, delay);
                if (inner) tl.to(inner, { rotateY: 180, duration: 0.4, ease: "power1.inOut" }, delay + 0.12);
                tl.to(card, { x: spot.x, y: spot.y, scale: 0.92, rotationZ: spot.rZ, duration: 0.4, ease: "power3.in" }, delay + 0.35);
                tl.to(card, { scaleY: 0.86, scaleX: 0.96, duration: 0.08, ease: "power1.out" }, delay + 0.75);
                tl.to(card, { scaleY: 0.92, scaleX: 0.92, duration: 0.15, ease: "elastic.out(1.2, 0.6)" }, delay + 0.83);
                tl.call(() => playTick(400 + index * 30, 0.06), null, delay + 0.78);
            });

            // PHASE 2: Deal Johan's hand (Bottom of Table)
            const johanStart = 1.05;
            johanCards.forEach((card, index) => {
                const spot  = johanSpots[index] || { x: 0, y: 160, rZ: 0 };
                const inner = card.querySelector('.poker-card-inner');
                const delay = johanStart + index * 0.12;

                tl.to(card, { x: spot.x, y: spot.y + 30, scale: 0.95, opacity: 1, rotationZ: spot.rZ * 0.5, duration: 0.4, ease: "power2.out" }, delay);
                if (inner) tl.to(inner, { rotateY: 180, duration: 0.4, ease: "power1.inOut" }, delay + 0.12);
                tl.to(card, { x: spot.x, y: spot.y, scale: 0.92, rotationZ: spot.rZ, duration: 0.4, ease: "power3.in" }, delay + 0.35);
                tl.to(card, { scaleY: 0.86, scaleX: 0.96, duration: 0.08, ease: "power1.out" }, delay + 0.75);
                tl.to(card, { scaleY: 0.92, scaleX: 0.92, duration: 0.15, ease: "elastic.out(1.2, 0.6)" }, delay + 0.83);
                tl.call(() => playTick(440 + index * 30, 0.06), null, delay + 0.78);
            });

            // PHASE 3: THE FINAL SLAM — Central VANTA Master Winning River Card
            const masterStart = johanStart + 1.05;
            if (masterCard) {
                const inner = masterCard.querySelector('.poker-card-inner');

                tl.to(masterCard, {
                    x: 0, y: 0,
                    scale: 1.05,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power4.in"
                }, masterStart);

                if (inner) {
                    tl.to(inner, {
                        rotateY: 180,
                        duration: 0.5,
                        ease: "power2.inOut"
                    }, masterStart + 0.15);
                }

                tl.to(masterCard, {
                    scale: 1.0,
                    duration: 0.15,
                    ease: "power1.out"
                }, masterStart + 0.6);

                tl.call(() => {
                    spawnMasterFeltShockwave();
                    triggerScreenShake();
                    playTick(880, 0.2);
                }, null, masterStart + 0.61);
            }

            // ─── Interactive: Hover lift + Manual flip on click ────────────
            cards.forEach((card) => {
                const inner = card.querySelector('.poker-card-inner');
                const isMaster = card.classList.contains('master-vanta-card');

                card.addEventListener('mouseenter', () => {
                    playTick(560, 0.05);
                    const baseScale = isMaster ? 1.0 : 0.92;
                    gsap.to(card, {
                        scale: baseScale * 1.18,
                        zIndex: 40, duration: 0.25, ease: "power2.out"
                    });
                });
                card.addEventListener('mouseleave', () => {
                    const baseScale = isMaster ? 1.0 : 0.92;
                    gsap.to(card, {
                        scale: baseScale,
                        zIndex: 10, duration: 0.25, ease: "power2.out"
                    });
                });
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.poker-inspect-btn')) return;
                    if (!inner) return;
                    playTick(720, 0.07);
                    const cur     = gsap.getProperty(inner, "rotateY") || 0;
                    const nextRot = cur >= 90 ? 0 : 180;
                    gsap.to(inner, { rotateY: nextRot, duration: 0.6, ease: "back.out(1.5)" });
                });
            });

            // ─── Inspection Modal Controller ───────────────────────────────
            const inspectBtns = document.querySelectorAll('.poker-inspect-btn');
            const closeBtn    = modal ? modal.querySelector('.poker-modal-close')  : null;
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

            if (closeBtn)  closeBtn.addEventListener('click', closeModal);
            if (backdrop)  backdrop.addEventListener('click', closeModal);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
            });
        }

        setTimeout(setupPokerDealer, 200);
    })();"""

with open('effects.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx_start = content.find('/* ================================================= ecclesiastical\n       AWWWARDS CYBERPUNK POKER TECH DECK — Real Heads-Up Game Sequence')
if idx_start == -1:
    idx_start = content.find('(function initCyberpunkPokerDeckScrollytelling() {')

idx_end = content.find('if (document.readyState === \'loading\') {')

if idx_start != -1 and idx_end != -1:
    new_content = content[:idx_start] + js_perfect_code + '\n\n}\n\n' + content[idx_end:]
    with open('effects.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS: Updated effects.js with scrollytelling header fade and perfect fan positions!')
else:
    print('ERROR: Could not locate markers in effects.js')
