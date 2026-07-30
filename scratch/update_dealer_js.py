import os

js_dealer_code = """    /* ============================================================
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
                badge: "THE WINNING HAND", title: "VANTA ENGINE 2025",
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
            const andresCards = Array.from(document.querySelectorAll('.card-andres'));
            const johanCards  = Array.from(document.querySelectorAll('.card-johan'));
            const masterCard  = document.getElementById('master-vanta-card');

            // Final resting spots for each hand
            // Andrés (top of table): x from -320 to 320, y around -160
            const andresSpots = [
                { x: -320, y: -155, rZ: -12 },
                { x: -192, y: -163, rZ: -7  },
                { x: -64,  y: -167, rZ: -2  },
                { x:  64,  y: -167, rZ:  2  },
                { x:  192, y: -163, rZ:  7  },
                { x:  320, y: -155, rZ:  12 }
            ];
            // Johan (bottom of table): mirror
            const johanSpots = [
                { x: -320, y:  155, rZ: -12 },
                { x: -192, y:  163, rZ: -7  },
                { x: -64,  y:  167, rZ: -2  },
                { x:  64,  y:  167, rZ:  2  },
                { x:  192, y:  163, rZ:  7  },
                { x:  320, y:  155, rZ:  12 }
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
                    end: "+=140%",
                    pin: true,
                    scrub: 1.2,
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

            const DEAL_SPACING = 0.19; // time between each card being dealt (tight = snappy dealer)
            const SLIDE_DUR    = 0.30; // how long the slide across the felt takes
            const FLIP_DUR     = 0.22; // how long the card flip takes

            dealSequence.forEach((deal, seqIdx) => {
                const { card, spot, player, idx } = deal;
                const inner = card.querySelector('.poker-card-inner');
                const baseDelay = 0.25 + seqIdx * DEAL_SPACING;

                const endX  = spot.x;
                const endY  = spot.y;
                const endRZ = spot.rZ;

                // Arc mid-point: 52% of the way, with lateral deflection for curve feel
                // Deflect slightly opposite to the rotation direction to simulate wrist flick
                const arcMidX = endX * 0.52 + (endRZ > 0 ? -18 : 18);
                const arcMidY = endY * 0.48;

                // — Step 1: Snap out of deck, rocket toward arc midpoint —
                tl.to(card, {
                    x: arcMidX, y: arcMidY,
                    scale: 0.90, opacity: 1,
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
                    scale: 0.91,
                    rotationZ: endRZ,
                    duration: SLIDE_DUR * 0.55,
                    ease: "power3.inOut"
                }, baseDelay + SLIDE_DUR * 0.52);

                // — Step 3: Landing thud — squish compress then elastic bounce —
                const landAt = baseDelay + SLIDE_DUR * 0.52 + SLIDE_DUR * 0.55;
                tl.to(card, { scaleY: 0.84, scaleX: 0.97, duration: 0.055, ease: "power3.in" }, landAt);
                tl.to(card, { scaleY: 0.91, scaleX: 0.91, duration: 0.20,  ease: "elastic.out(1.35, 0.52)" }, landAt + 0.055);

                // Crisp click sound on landing
                tl.call(() => {
                    playTick(player === 'andres' ? 430 + idx * 22 : 470 + idx * 22, 0.065);
                }, null, landAt + 0.01);
            });

            // ─── PHASE 3: The River Slam — VANTA Master Card ─────────────
            const riverStart = 0.25 + dealSequence.length * DEAL_SPACING + 0.35;

            if (masterCard) {
                const inner = masterCard.querySelector('.poker-card-inner');

                // Master card: shoots from deck at scale 1.5 (dramatic reveal)
                tl.to(masterCard, {
                    y: -260, scale: 1.5, opacity: 1,
                    duration: 0.30, ease: "power3.out"
                }, riverStart);

                // Hold in air briefly (suspense beat)
                tl.to(masterCard, {
                    y: -270, scale: 1.55,
                    duration: 0.12, ease: "power1.inOut"
                }, riverStart + 0.30);

                // Flip face-up while hovering
                if (inner) {
                    tl.to(inner, { rotateY: 90,  duration: 0.18, ease: "power2.in"  }, riverStart + 0.28);
                    tl.to(inner, { rotateY: 180, duration: 0.18, ease: "power2.out" }, riverStart + 0.46);
                }

                // Gravity slam DOWN onto center of felt
                tl.to(masterCard, {
                    x: 0, y: 0,
                    scale: 1.05,
                    rotationZ: 0,
                    duration: 0.28,
                    ease: "power4.in"
                }, riverStart + 0.44);

                // Landing: heavy compress + slow elastic expansion
                tl.to(masterCard, { scaleY: 0.78, scaleX: 1.10, duration: 0.07, ease: "power4.in" }, riverStart + 0.72);
                tl.to(masterCard, { scaleY: 1.0,  scaleX: 1.0,  duration: 0.35, ease: "elastic.out(1.2, 0.5)" }, riverStart + 0.79);

                // Shockwave + shake + bass boom
                tl.call(() => {
                    spawnMasterFeltShockwave();
                    triggerScreenShake();
                    playTick(220, 0.35);
                    setTimeout(() => playTick(880, 0.15), 80);
                }, null, riverStart + 0.73);
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
    })();"""

with open('effects.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the poker scrollytelling block and replace it
idx_start = content.find('/* ================================================= ecclesiastical\n       AWWWARDS CYBERPUNK POKER TECH DECK — Real Heads-Up Game Sequence')
if idx_start == -1:
    idx_start = content.find('(function initCyberpunkPokerDeckScrollytelling() {')

idx_end = content.find("if (document.readyState === 'loading') {")

if idx_start != -1 and idx_end != -1:
    new_content = content[:idx_start] + js_dealer_code + '\n\n}\n\n' + content[idx_end:]
    with open('effects.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS: Updated effects.js with realistic alternating arc-slide dealer!')
else:
    print(f'ERROR: Markers not found. idx_start={idx_start}, idx_end={idx_end}')
