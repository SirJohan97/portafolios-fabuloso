/* ================================================================
   TUNEL.JS v9 — AWWWARDS HOLOGRAPHIC QUANTUM WARP & AEROSPACE PORTAL
   ─────────────────────────────────────────────────────────────────
   • Raymarched Quantum Nebula GLSL Shader with Hyperspace Velocity Streaks
   • Chromatic Aberration Prism Dispersion & Soft Volumetric Core Bloom
   • Floating Aerospace Holographic Chassis with Laser Scanline Beam
   • Dedicated Tech Stack Badges, Real-time Telemetry & Depth-of-Field
   • Hyper-fast 0.75s Flight Duration with Instant Skip (ESC / Click)
   • Seamless Zero-Flicker Transition into Project Dossier Modal
   ================================================================ */

(function () {
    "use strict";

    // ─── SHADER GLSL — Quantum Nebula & Hyperspace Prism Shader ───
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float iTime;
        uniform vec3  iResolution;
        uniform vec2  iMouse;
        uniform float iWarpFactor;
        uniform vec3  iColorA;
        uniform vec3  iColorB;

        varying vec2 vUv;

        // Simplex Noise 2D
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                               -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m; m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        // Render single channel with polar noise offset for Chromatic Aberration
        float nebulaSample(vec2 st, float speedMult, float offset) {
            float r = length(st);
            float a = atan(st.y, st.x) + offset;
            vec2 dir = vec2(cos(a), sin(a));

            float z = (iTime * (0.95 + iWarpFactor * 3.8) * speedMult) + (1.1 / (r + 0.06));
            float n  = snoise(vec2(dir.x * 2.6 + iTime * 0.45, z * 0.35 + dir.y * 2.6));
            float n2 = snoise(vec2(dir.y * 4.2 - iTime * 0.35, z * 0.8 + dir.x * 4.2));

            float ring = sin(z * 12.0 + n * 2.2) * 0.5 + 0.5;
            float rib  = sin(a * 7.0 + n2 * 1.8) * 0.5 + 0.5;

            return pow(ring * rib, 1.25) * smoothstep(0.0, 0.48, r);
        }

        void main() {
            vec2 st = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
            st += iMouse * 0.14;

            float r = length(st);

            // Hyperspace Chromatic Aberration Prism Shift
            float caOffset = 0.016 * (1.0 + iWarpFactor * 3.2);
            float sampR = nebulaSample(st * (1.0 + caOffset), 1.0,  0.014);
            float sampG = nebulaSample(st,                    1.0,  0.000);
            float sampB = nebulaSample(st * (1.0 - caOffset), 1.0, -0.014);

            vec3 colR = mix(iColorA, vec3(1.0, 1.0, 1.0), sampR * 0.45);
            vec3 colB = mix(iColorB, vec3(0.1, 0.85, 1.0), sampB * 0.55);

            vec3 color = vec3(
                mix(colR.r, colB.r, sampR),
                mix(colR.g, colB.g, sampG),
                mix(colR.b, colB.b, sampB)
            );

            color *= (sampG * 2.4 + 0.2);

            // Soft Volumetric Core Glow
            float coreGlow = smoothstep(0.78, 0.0, r);
            color += mix(iColorB, vec3(0.92, 0.96, 1.0), 0.55) * coreGlow * (0.9 + iWarpFactor * 1.8);

            // Vignette & Outer Dark Void
            float vig = smoothstep(0.96, 0.28, r);
            color *= vig;

            // Hyperspace Velocity Radial Streaks
            if (iWarpFactor > 0.08) {
                float a = atan(st.y, st.x);
                float streak = pow(sin(a * 24.0 + iTime * 22.0) * 0.5 + 0.5, 8.0);
                color += mix(iColorA, vec3(1.0), 0.4) * streak * (iWarpFactor - 0.08) * 1.2;
            }

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // ─── PROJECT METADATA & RICH STACK PALETTES ───────────────────
    const PROJECTS = {
        sviva: {
            title: 'SVIVA Tactical',
            tag: 'IA · VISIÓN COMPUTACIONAL · EDGE',
            cat: 'CIBERSEGURIDAD PERIMETRAL',
            img: 'img/sviva/svivalogo.webp',
            colorA: [0.066, 0.831, 0.513],
            colorB: [0.0, 1.0, 0.65],
            hex: "#11d483",
            stack: ['YOLOv8 Edge', 'RTSP Stream', 'Inferencia <15ms', 'Python']
        },
        svivaweb: {
            title: 'SVIVA Web',
            tag: 'REACT · TYPESCRIPT · TELEMETRÍA',
            cat: 'CONSOLA DE MONITOREO EN VIVO',
            img: 'img/sviva/Dashboard.webp',
            colorA: [0.0, 0.823, 1.0],
            colorB: [0.2, 0.4, 1.0],
            hex: "#00d2ff",
            stack: ['React 19', 'TypeScript', 'Vite', 'WebSockets']
        },
        ventastrack: {
            title: 'VentasTrack B2B',
            tag: 'SISTEMA COMERCIAL · SAP ERP · OFFLINE',
            cat: 'AUTOMATIZACIÓN COMERCIAL BEHRENS',
            img: 'img/ventastrack/login-ventast.webp',
            colorA: [0.231, 0.509, 0.964],
            colorB: [0.55, 0.3, 0.98],
            hex: "#3b82f6",
            stack: ['FastAPI', 'IndexedDB', 'SAP ZB01/21', 'Tasa BCV']
        },
        kioskoazul: {
            title: 'Kiosko Azul',
            tag: 'GASTRONOMÍA · MENÚ QR · APP MÓVIL',
            cat: 'POS DIGITAL & COMANDAS EN VIVO',
            img: 'img/kioskoazul/login-kiosko.webp',
            colorA: [0.0, 0.941, 1.0],
            colorB: [0.0, 0.5, 1.0],
            hex: "#00f0ff",
            stack: ['Python', 'Menú QR Mesa', 'Cola Asíncrona', 'Pago Móvil']
        },
        iuta: {
            title: 'CERDIV IUTA',
            tag: 'POSTGRESQL · MULTI-TENANT · 5 SEDES',
            cat: 'CATALOGACIÓN TÉCNICA BIBLIOTECARIA',
            img: 'img/cerdiv/Captura de pantalla 2026-09-15 154435.webp',
            colorA: [0.658, 0.333, 0.968],
            colorB: [0.4, 0.2, 0.95],
            hex: "#a855f7",
            stack: ['PostgreSQL', 'Multi-Tenant', 'Dewey Index', 'Flask']
        },
        aura: {
            title: 'Aura Check',
            tag: 'BIOMETRÍA · FASTAPI · CRIPTOGRAFÍA',
            cat: 'CONTROL DE ACCESO EMPRESARIAL',
            img: 'img/auracheck/auralogin.webp',
            colorA: [0.96, 0.62, 0.043],
            colorB: [0.95, 0.25, 0.25],
            hex: "#f59e0b",
            stack: ['FastAPI', 'Face Liveness 99.4%', 'SHA-256', 'Edge Kiosk']
        },
        cuerpo: {
            title: '¿Qué le pasa a mi cuerpo?',
            tag: 'IA EDUCATIVA · INTERACTIVO · 3D',
            cat: 'PLATAFORMA PEDIÁTRICA & SALUD',
            img: 'img/quelepasacuerpo/cuerpologin.webp',
            colorA: [0.925, 0.282, 0.6],
            colorB: [0.95, 0.15, 0.45],
            hex: "#ec4899",
            stack: ['FastAPI', 'Gemini IA', 'UX Inmersiva', 'Responsive']
        },
        inventario: {
            title: 'Inventario Pro',
            tag: 'STOCK REALTIME · SQL ACID · REPORTES',
            cat: 'ERP MODULAR & CADENA DE SUMINISTRO',
            img: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM.webp',
            colorA: [0.066, 0.831, 0.513],
            colorB: [0.0, 1.0, 0.65],
            hex: "#11d483",
            stack: ['PostgreSQL', 'SELECT FOR UPDATE', 'Alertas Stock', 'FastAPI']
        }
    };
    const DEFAULT_PROJECT = {
        title: 'VANTA EXPEDIENTE',
        tag: 'INGENIERÍA DE SOFTWARE & IA',
        cat: 'SISTEMAS DE PRODUCCIÓN',
        img: 'img/sviva/svivalogo.webp',
        colorA: [0.066, 0.831, 0.513],
        colorB: [0.0, 0.8, 1.0],
        hex: "#11d483",
        stack: ['Arquitectura Élite', 'Python / TS', 'Alta Concurrencia']
    };

    // ─── AUDIO ENGINE ─────────────────────────────────────────────
    class CinematicAudio {
        constructor() { this.ctx = null; this.muted = false; this.hum = null; this.gain = null; }
        init() {
            if (this.ctx) return;
            try { const C = window.AudioContext || window.webkitAudioContext; if (C) this.ctx = new C(); } catch(e) {}
        }
        startWarpHum() {
            if (!this.ctx || this.muted) return;
            this.stopWarpHum();
            try {
                if (this.ctx.state === "suspended") this.ctx.resume();
                this.hum = this.ctx.createOscillator();
                this.gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();
                filter.type = "lowpass"; filter.frequency.value = 320;
                this.hum.type = "sine"; this.hum.frequency.value = 52;
                this.gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
                this.gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.6);
                this.hum.connect(filter); filter.connect(this.gain); this.gain.connect(this.ctx.destination);
                this.hum.start();
            } catch(e) {}
        }
        updatePitch(warpFactor) {
            if (!this.hum || !this.ctx) return;
            try { this.hum.frequency.setTargetAtTime(52 + warpFactor * 120, this.ctx.currentTime, 0.08); } catch(e) {}
        }
        stopWarpHum() {
            if (this.gain && this.ctx) {
                try {
                    this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
                    if (this.hum) { this.hum.stop(); this.hum.disconnect(); }
                } catch(e) {}
                this.hum = null; this.gain = null;
            }
        }
        stopHum() { this.stopWarpHum(); }
        sonicBoom() {
            if (!this.ctx || this.muted) return;
            try {
                if (this.ctx.state === "suspended") this.ctx.resume();
                const now = this.ctx.currentTime;
                const len = Math.floor(this.ctx.sampleRate * 0.5);
                const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
                const d = buf.getChannelData(0);
                for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
                const src = this.ctx.createBufferSource(); src.buffer = buf;
                const filter = this.ctx.createBiquadFilter(); filter.type = "lowpass";
                filter.frequency.setValueAtTime(1100, now); filter.frequency.exponentialRampToValueAtTime(35, now + 0.5);
                const g = this.ctx.createGain(); g.gain.setValueAtTime(0.4, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                src.connect(filter); filter.connect(g); g.connect(this.ctx.destination);
                src.start(now);
            } catch(e) {}
        }
    }

    const audio = new CinematicAudio();

    // ─── STARDUST PARTICLE STREAM ─────────────────────────────────
    class StardustStream {
        constructor(scene, hex) {
            this.count  = 340;
            this.posArr = new Float32Array(this.count * 3);
            const c     = new THREE.Color(hex);

            for (let i = 0; i < this.count; i++) {
                this.posArr[i * 3]     = (Math.random() - 0.5) * 4.5;
                this.posArr[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
                this.posArr[i * 3 + 2] = -Math.random() * 11.0;
            }

            this.geo = new THREE.BufferGeometry();
            this.geo.setAttribute("position", new THREE.BufferAttribute(this.posArr, 3));

            const mat = new THREE.PointsMaterial({
                color: c, size: 0.052, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending,
            });
            this.pts = new THREE.Points(this.geo, mat);
            scene.add(this.pts);
        }

        update(dt, speedRatio) {
            const spd = (16.0 + speedRatio * 26.0) * dt;
            const attr = this.geo.attributes.position;
            const arr = attr.array;
            for (let i = 0; i < this.count; i++) {
                arr[i * 3 + 2] += spd;
                if (arr[i * 3 + 2] > 1.2) {
                    arr[i * 3]     = (Math.random() - 0.5) * 4.5;
                    arr[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
                    arr[i * 3 + 2] = -11.0;
                }
            }
            attr.needsUpdate = true;
        }

        setColor(hex) {
            this.pts.material.color.set(hex);
        }

        dispose(scene) {
            scene.remove(this.pts);
            this.geo.dispose();
            this.pts.material.dispose();
        }
    }

    // ─── WARP RUNNER CONTROLLER ──────────────────────────────────
    const WarpRunner = {
        overlay: null, canvas: null, renderer: null, scene: null, camera: null, material: null, stardust: null,
        animId: null, active: false, currentProject: null, onCompleteCallback: null,

        mousePos: { x: 0, y: 0 }, targetMouse: { x: 0, y: 0 },
        warpFactor: 0.0, targetWarpFactor: 0.0,
        startTime: 0, flightDuration: 0.75, // Hyper-fast 0.75s flight duration
        flyingCard: null,

        init() {
            if (this.overlay) return;

            const html = `
<div id="vanta-cinematic-warp" class="vanta-cinematic-warp" style="
    position:fixed;inset:0;width:100vw;height:100vh;z-index:100005;display:none;background:#030509;overflow:hidden;
    opacity:1;font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    cursor:pointer;
" title="Haz clic o pulsa ESC para abrir directamente">
    <canvas id="vanta-warp-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block;"></canvas>

    <!-- Holographic Crosshairs & Reticle Overlay -->
    <div class="cw-reticle" style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at center, transparent 40%, rgba(3,5,9,0.7) 100%);">
        <div style="position:absolute;top:50%;left:50%;width:240px;height:240px;transform:translate(-50%,-50%);border:1px dashed rgba(255,255,255,0.12);border-radius:50%;animation:cw-spin 20s linear infinite;"></div>
        <div style="position:absolute;top:50%;left:50%;width:380px;height:380px;transform:translate(-50%,-50%);border:1px solid rgba(17,212,131,0.08);border-radius:50%;"></div>
    </div>

    <!-- Floating Aerospace Holographic Chassis (Emerges from inside nebula) -->
    <div id="cw-flying-card" class="cw-flying-card" style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.05);
        z-index:10;pointer-events:none;opacity:0;transition:none;
        background:rgba(7, 11, 19, 0.88);border:1px solid rgba(17,212,131,0.55);
        border-radius:24px;padding:2rem 2.4rem;max-width:480px;width:90%;
        text-align:center;box-shadow:0 0 80px rgba(0,0,0,0.95), 0 0 50px rgba(17,212,131,0.4);
        backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
        display:flex;flex-direction:column;align-items:center;gap:0.9rem;
        overflow:hidden;
    ">
        <!-- Laser Scanline Animation -->
        <div class="cw-laser-scanline" style="
            position:absolute;top:0;left:0;right:0;height:2px;
            background:linear-gradient(90deg, transparent, #11d483, #00f0ff, transparent);
            box-shadow:0 0 15px #11d483;opacity:0.85;animation:cw-scan 1.2s cubic-bezier(0.4,0,0.2,1) infinite;
        "></div>

        <!-- Project Image Aperture with Glowing Rim -->
        <div class="cw-card-aperture" style="
            position:relative;width:110px;height:110px;border-radius:20px;overflow:hidden;
            border:1.5px solid rgba(255,255,255,0.25);box-shadow:0 10px 30px rgba(0,0,0,0.7);
            background:#000;
        ">
            <img id="cw-card-img" src="" alt="" style="width:100%;height:100%;object-fit:cover;">
            <div id="cw-card-rim" style="position:absolute;inset:0;box-shadow:inset 0 0 20px rgba(17,212,131,0.5);pointer-events:none;"></div>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;">
            <span id="cw-card-cat" style="font-size:0.68rem;font-weight:800;letter-spacing:2.5px;color:rgba(255,255,255,0.6);font-family:monospace;text-transform:uppercase;">SECTOR</span>
            <h3 id="cw-card-title" style="margin:0;font-size:1.85rem;font-weight:900;color:#fff;letter-spacing:-0.5px;font-family:'Syne',sans-serif;">TITLE</h3>
            <span id="cw-card-tag" style="font-size:0.75rem;font-weight:800;letter-spacing:1.8px;color:#11d483;font-family:monospace;text-transform:uppercase;">TAG</span>
        </div>

        <!-- Dynamic Stack Badges -->
        <div id="cw-card-stack" style="display:flex;flex-wrap:wrap;justify-content:center;gap:0.4rem;margin-top:0.2rem;">
            <!-- Populated dynamically -->
        </div>

        <!-- Progress Gauge Bar -->
        <div style="width:100%;background:rgba(255,255,255,0.08);height:3px;border-radius:3px;overflow:hidden;margin-top:0.4rem;">
            <div id="cw-gauge-fill" style="width:0%;height:100%;background:#11d483;box-shadow:0 0 10px #11d483;transition:width 0.05s linear;"></div>
        </div>
        <span style="font-size:0.62rem;color:rgba(255,255,255,0.5);font-family:monospace;letter-spacing:1px;">SINCRONIZANDO EXPEDIENTE TÉCNICO...</span>
    </div>

    <!-- Top Left Status Telemetry -->
    <div style="position:absolute;top:2rem;left:2.5rem;z-index:11;pointer-events:none;">
        <div style="
            display:flex;align-items:center;gap:0.75rem;background:rgba(6,10,16,0.85);
            backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.14);
            padding:0.55rem 1.3rem;border-radius:50px;box-shadow:0 10px 30px rgba(0,0,0,0.6);
        ">
            <span style="width:8px;height:8px;border-radius:50%;background:#11d483;box-shadow:0 0 12px #11d483;animation:cw-pulse 1.2s infinite;"></span>
            <span id="cw-dest-title" style="color:#fff;font-size:0.72rem;font-weight:800;letter-spacing:2px;font-family:monospace;text-transform:uppercase;">WARP DRIVE // 0.98c</span>
        </div>
    </div>

    <!-- Top Right Skip Button -->
    <button id="cw-skip-btn" type="button" aria-label="Saltear vuelo hiperespacial" style="
        position:absolute;top:2rem;right:2.5rem;z-index:15;cursor:pointer;
        display:flex;align-items:center;gap:0.6rem;background:rgba(12,18,28,0.88);
        backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
        border:1px solid rgba(255,255,255,0.22);color:#fff;
        padding:0.55rem 1.25rem;border-radius:50px;box-shadow:0 10px 30px rgba(0,0,0,0.7);
        font-family:monospace;font-size:0.72rem;font-weight:800;letter-spacing:1.5px;
        transition:all 0.2s ease;
    ">
        <span style="color:rgba(255,255,255,0.7);">ABRIR</span>
        <span style="color:#11d483;font-weight:900;">[ESC]</span>
        <span style="font-size:0.85rem;">⏭</span>
    </button>

    <!-- Bottom Left Aerospace Telemetry -->
    <div class="cw-bottom-hud" style="position:absolute;bottom:2rem;left:2.5rem;z-index:11;pointer-events:none;display:flex;flex-direction:column;gap:0.3rem;">
        <span style="font-family:monospace;font-size:0.64rem;color:rgba(255,255,255,0.45);letter-spacing:1.5px;">[ TELEMETRÍA // BUFFER_100% • LATENCIA &lt;10ms ]</span>
        <span id="cw-sub-telemetry" style="font-family:monospace;font-size:0.64rem;color:#11d483;letter-spacing:1.5px;">ESTADO // VECTOR HIPERESPACIAL BLOQUEADO</span>
    </div>

    <!-- Soft Prism Flash Layer -->
    <div id="cw-flash" style="position:absolute;inset:0;z-index:12;pointer-events:none;opacity:0;background:radial-gradient(circle at center, rgba(255,255,255,0.95), rgba(0,210,255,0.4));"></div>
</div>
<style>
  @keyframes cw-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
  @keyframes cw-spin { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes cw-scan { 0%{top:0;opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{top:100%;opacity:0} }
  #cw-skip-btn:hover { background:rgba(17,212,131,0.15) !important; border-color:#11d483 !important; transform:translateY(-1px); }
  @media (max-width: 600px) {
      .cw-flying-card { padding: 1.5rem 1.2rem !important; }
      .cw-bottom-hud { display: none !important; }
      #cw-skip-btn { top: 1.2rem !important; right: 1.2rem !important; padding: 0.4rem 0.9rem !important; font-size: 0.65rem !important; }
  }
</style>`;

            document.body.insertAdjacentHTML("beforeend", html);

            this.overlay    = document.getElementById("vanta-cinematic-warp");
            this.canvas     = document.getElementById("vanta-warp-canvas");
            this.flyingCard = document.getElementById("cw-flying-card");

            this._bindEvents();
        },

        _bindEvents() {
            window.addEventListener("mousemove", (e) => {
                if (!this.active) return;
                this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
                this.targetMouse.y = (e.clientY / window.innerHeight - 0.5) * -2;
            });

            window.addEventListener("resize", () => this._resize());

            // Click anywhere on overlay or skip button triggers instant finish
            if (this.overlay) {
                this.overlay.addEventListener("click", (e) => {
                    if (this.active) {
                        e.stopPropagation();
                        this.triggerFinish(true);
                    }
                });
            }

            const skipBtn = document.getElementById("cw-skip-btn");
            if (skipBtn) {
                skipBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.triggerFinish(true);
                });
            }

            // Global ESC / Enter key to skip warp immediately
            window.addEventListener("keydown", (e) => {
                if (this.active && (e.key === "Escape" || e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.triggerFinish(true);
                }
            }, true);
        },

        _resize() {
            if (!this.renderer) return;
            const W = window.innerWidth, H = window.innerHeight;
            this.renderer.setSize(W, H);
            this.material.uniforms.iResolution.value.set(W, H, 1);
        },

        _setupThree() {
            if (this.renderer) return;
            const W = window.innerWidth, H = window.innerHeight;

            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false });
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.renderer.setSize(W, H);

            this.scene  = new THREE.Scene();
            this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

            this.material = new THREE.ShaderMaterial({
                uniforms: {
                    iTime:       { value: 0 },
                    iResolution: { value: new THREE.Vector3(W, H, 1) },
                    iMouse:      { value: new THREE.Vector2(0, 0) },
                    iWarpFactor: { value: 0.0 },
                    iColorA:     { value: new THREE.Vector3(0.066, 0.831, 0.513) },
                    iColorB:     { value: new THREE.Vector3(0.0, 1.0, 0.65) },
                },
                vertexShader, fragmentShader,
            });

            const geo = new THREE.PlaneGeometry(2, 2);
            this.scene.add(new THREE.Mesh(geo, this.material));

            this.stardust = new StardustStream(this.scene, "#11d483");
        },

        // ── PUBLIC LAUNCH (HOLOGRAPHIC WARP PORTAL) ───────────────────
        launch(projectId, onComplete) {
            this.init();
            this._setupThree();
            audio.init();

            const p = PROJECTS[projectId] || DEFAULT_PROJECT;
            this.currentProject     = projectId;
            this.onCompleteCallback = onComplete;

            // Apply Theme Palette to Shader & Stardust
            this.material.uniforms.iColorA.value.set(...p.colorA);
            this.material.uniforms.iColorB.value.set(...p.colorB);
            if (this.stardust) this.stardust.setColor(p.hex);

            // Populate Aerospace Holographic Card
            const cardImg = document.getElementById("cw-card-img");
            if (cardImg) cardImg.src = p.img;

            const cardCat = document.getElementById("cw-card-cat");
            if (cardCat) cardCat.textContent = p.cat || "PROYECTO VANTA";

            const cardTag = document.getElementById("cw-card-tag");
            if (cardTag) {
                cardTag.textContent = p.tag;
                cardTag.style.color = p.hex;
            }

            const cardTitle = document.getElementById("cw-card-title");
            if (cardTitle) cardTitle.textContent = p.title;

            // Render Tech Stack Badges
            const stackContainer = document.getElementById("cw-card-stack");
            if (stackContainer) {
                const badges = p.stack || ['Python', 'FastAPI', 'PostgreSQL'];
                stackContainer.innerHTML = badges.map(b => `
                    <span style="
                        font-size:0.62rem;font-weight:700;letter-spacing:0.8px;
                        background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);
                        padding:0.2rem 0.55rem;border-radius:6px;color:#e2e8f0;font-family:monospace;
                    ">${b}</span>
                `).join('');
            }

            // Outer Neon Glow
            this.flyingCard.style.borderColor = p.hex;
            this.flyingCard.style.boxShadow = `0 25px 80px rgba(0,0,0,0.95), 0 0 50px ${p.hex}66`;

            const destTitle = document.getElementById("cw-dest-title");
            if (destTitle) destTitle.textContent = `WARP LOCK // ${p.title.toUpperCase()}`;

            const subTelemetry = document.getElementById("cw-sub-telemetry");
            if (subTelemetry) {
                subTelemetry.textContent = `SECTOR // ${p.cat || 'PRODUCCIÓN'}`;
                subTelemetry.style.color = p.hex;
            }

            // Reset Card Animation State
            this.flyingCard.style.transform = "translate(-50%, -50%) scale(0.05)";
            this.flyingCard.style.opacity   = "0";
            this.flyingCard.style.filter    = "blur(18px)";

            const gaugeFill = document.getElementById("cw-gauge-fill");
            if (gaugeFill) {
                gaugeFill.style.width = "0%";
                gaugeFill.style.background = p.hex;
                gaugeFill.style.boxShadow = `0 0 10px ${p.hex}`;
            }

            this.overlay.style.transition = "none";
            this.overlay.style.display = "block";
            this.overlay.style.opacity = "1";

            document.body.style.overflow = "hidden";
            this.active           = true;
            this.warpFactor       = 0.0;
            this.targetWarpFactor = 1.0;
            this.startTime        = performance.now();

            audio.startWarpHum();
            this._resize();
            this._loop();
        },

        _loop() {
            if (!this.active) return;

            const now = performance.now();
            const elapsed = (now - this.startTime) * 0.001;
            const progress = Math.min(1.0, elapsed / this.flightDuration);

            // Smooth Mouse Parallax
            this.mousePos.x += (this.targetMouse.x - this.mousePos.x) * 0.1;
            this.mousePos.y += (this.targetMouse.y - this.mousePos.y) * 0.1;

            this.targetWarpFactor = Math.min(1.0, 0.45 + progress * 0.55);
            this.warpFactor += (this.targetWarpFactor - this.warpFactor) * 0.14;

            this.material.uniforms.iTime.value       = elapsed;
            this.material.uniforms.iMouse.value.set(this.mousePos.x, this.mousePos.y);
            this.material.uniforms.iWarpFactor.value = this.warpFactor;

            if (this.stardust) this.stardust.update(0.016, this.warpFactor);
            audio.updatePitch(this.warpFactor);

            // Update Gauge
            const gaugeFill = document.getElementById("cw-gauge-fill");
            if (gaugeFill) gaugeFill.style.width = `${Math.round(progress * 100)}%`;

            // ── CARD FLY-THROUGH ANIMATION (Emerges smoothly from hyper-space) ──
            if (progress > 0.08) {
                const cardProg = (progress - 0.08) / 0.92;
                const scale = 0.05 + Math.pow(cardProg, 2.0) * 0.95;
                const opacity = Math.min(1.0, cardProg * 1.9);
                const blur = Math.max(0, (1 - cardProg * 1.3) * 16);

                this.flyingCard.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
                this.flyingCard.style.opacity   = opacity.toFixed(2);
                this.flyingCard.style.filter    = `blur(${blur.toFixed(1)}px)`;
            }

            this.renderer.render(this.scene, this.camera);

            if (progress >= 1.0) {
                this.triggerFinish(true);
            } else {
                this.animId = requestAnimationFrame(() => this._loop());
            }
        },

        triggerFinish(openDossier = true) {
            if (!this.active) return;
            this.active = false;

            if (this.animId) cancelAnimationFrame(this.animId);

            try {
                audio.sonicBoom();
                audio.stopWarpHum();
            } catch(e) {}

            const flash = document.getElementById("cw-flash");

            // 1. Soft Prism Glow Burst
            if (flash) {
                flash.style.transition = "none";
                flash.style.opacity = "0.9";
            }

            // 2. Open Project Modal underneath the flash layer
            if (openDossier && typeof this.onCompleteCallback === "function") {
                this.onCompleteCallback(this.currentProject);
            }

            // Restore body scroll
            document.body.style.overflow = "";

            // 3. Smoothly fade out flash and overlay
            setTimeout(() => {
                this.overlay.style.transition = "opacity 0.35s cubic-bezier(0.16,1,0.3,1)";
                this.overlay.style.opacity    = "0";
                if (flash) {
                    flash.style.transition = "opacity 0.35s cubic-bezier(0.16,1,0.3,1)";
                    flash.style.opacity    = "0";
                }
                setTimeout(() => {
                    this.overlay.style.display = "none";
                    if (flash) flash.style.opacity = "0";
                }, 380);
            }, 60);
        }
    };

    window.WarpRunner = WarpRunner;
})();
