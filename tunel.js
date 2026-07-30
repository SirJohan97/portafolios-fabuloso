/* ================================================================
   TUNEL.JS v8 — AWWWARDS QUANTUM NEBULA & PRISM GLASS WARP (HYBRID 1+3)
   ─────────────────────────────────────────────────────────────────
   • Raymarched Quantum Nebula GLSL Shader (Option 1)
   • Chromatic Aberration Prism Distortion & Soft Volumetric Bloom (Option 3)
   • 300 Luminous Micro-Particles (Stardust motion blur streaks)
   • Floating Glassmorphic 3D Panel with Neon Glow & Depth-of-Field
   • Surgical 1.5s Transition into Rich Project Modal (Zero Flicker)
   ================================================================ */

(function () {
    "use strict";

    // ─── SHADER GLSL — Quantum Nebula & Prism Glass Shader ────────
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

            float z = (iTime * (0.65 + iWarpFactor * 2.2) * speedMult) + (0.9 / (r + 0.08));
            float n  = snoise(vec2(dir.x * 2.4 + iTime * 0.3, z * 0.3 + dir.y * 2.4));
            float n2 = snoise(vec2(dir.y * 3.8 - iTime * 0.25, z * 0.65 + dir.x * 3.8));

            float ring = sin(z * 10.0 + n * 2.0) * 0.5 + 0.5;
            float rib  = sin(a * 6.0 + n2 * 1.5) * 0.5 + 0.5;

            return pow(ring * rib, 1.3) * smoothstep(0.0, 0.42, r);
        }

        void main() {
            vec2 st = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
            st += iMouse * 0.12;

            float r = length(st);

            // Chromatic Aberration Prism Shift (Option 3 Glass Prism)
            float caOffset = 0.012 * (1.0 + iWarpFactor * 2.5);
            float sampR = nebulaSample(st * (1.0 + caOffset), 1.0,  0.01);
            float sampG = nebulaSample(st,                    1.0,  0.00);
            float sampB = nebulaSample(st * (1.0 - caOffset), 1.0, -0.01);

            vec3 colR = mix(iColorA, vec3(1.0), sampR * 0.4);
            vec3 colB = mix(iColorB, vec3(0.0, 0.8, 1.0), sampB * 0.5);

            vec3 color = vec3(
                mix(colR.r, colB.r, sampR),
                mix(colR.g, colB.g, sampG),
                mix(colR.b, colB.b, sampB)
            );

            color *= (sampG * 2.0 + 0.15);

            // Soft Volumetric Core Glow (Luxurious Bloom instead of harsh white spikes)
            float coreGlow = smoothstep(0.72, 0.0, r);
            color += mix(iColorB, vec3(0.9, 0.95, 1.0), 0.5) * coreGlow * (0.8 + iWarpFactor * 1.4);

            // Vignette & Outer Dark Edge
            float vig = smoothstep(0.94, 0.3, r);
            color *= vig;

            // Subtle Speed Motion Streak
            if (iWarpFactor > 0.1) {
                float a = atan(st.y, st.x);
                float streak = pow(sin(a * 18.0 + iTime * 15.0) * 0.5 + 0.5, 9.0);
                color += iColorA * streak * (iWarpFactor - 0.1) * 0.8;
            }

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // ─── PROJECT METADATA & COLOR PALETTES ────────────────────────
    const PROJECTS = {
        sviva:       { title: 'SVIVA', tag: 'TESIS · IA · EDGE', img: 'img/sviva/svivalogo.png', colorA: [0.066, 0.831, 0.513], colorB: [0.0, 1.0, 0.65], hex: "#11d483" },
        svivaweb:    { title: 'SVIVA Web', tag: 'Vite · TypeScript · React', img: 'img/sviva/svivaindex.jpeg', colorA: [0.0, 0.823, 1.0], colorB: [0.2, 0.4, 1.0], hex: "#00d2ff" },
        kioskoazul:  { title: 'Kiosko Azul', tag: 'Python · Flask · SQLite', img: 'img/auracheck/auralogin.jpeg', colorA: [0.0, 0.941, 1.0], colorB: [0.0, 0.5, 1.0], hex: "#00f0ff" },
        iuta:        { title: 'Sistema Bibliotecario IUTA', tag: 'Python · Flask · PostgreSQL', img: 'img/cerdiv/cerdivweb.jpeg', colorA: [0.658, 0.333, 0.968], colorB: [0.4, 0.2, 0.95], hex: "#a855f7" },
        aura:        { title: 'Aura Check', tag: 'FastAPI · Biometría · Seguridad', img: 'img/auracheck/auralogin.jpeg', colorA: [0.96, 0.62, 0.043], colorB: [0.95, 0.25, 0.25], hex: "#f59e0b" },
        cuerpo:      { title: '¿Qué le pasa a mi cuerpo?', tag: 'IA · FastAPI · Inmersivo', img: 'img/quelepasacuerpo/cuerpologin.jpeg', colorA: [0.925, 0.282, 0.6], colorB: [0.95, 0.15, 0.45], hex: "#ec4899" },
        ventastrack: { title: 'VentasTrack B2B', tag: 'Node.js · TS · PostgreSQL', img: 'img/sviva/svivaconfig.jpeg', colorA: [0.231, 0.509, 0.964], colorB: [0.55, 0.3, 0.98], hex: "#3b82f6" },
        inventario:  { title: 'Inventario Pro', tag: 'Sistema · Personalizable', img: 'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM.jpeg', colorA: [0.066, 0.831, 0.513], colorB: [0.0, 1.0, 0.65], hex: "#11d483" }
    };
    const DEFAULT_PROJECT = { title: 'VANTA WARP', tag: 'QUANTUM ENGINE', img: 'img/sviva/svivalogo.png', colorA: [0.066, 0.831, 0.513], colorB: [0.0, 0.8, 1.0], hex: "#11d483" };

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
                filter.type = "lowpass"; filter.frequency.value = 260;
                this.hum.type = "sine"; this.hum.frequency.value = 48;
                this.gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
                this.gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 1.2);
                this.hum.connect(filter); filter.connect(this.gain); this.gain.connect(this.ctx.destination);
                this.hum.start();
            } catch(e) {}
        }
        updatePitch(warpFactor) {
            if (!this.hum || !this.ctx) return;
            try { this.hum.frequency.setTargetAtTime(48 + warpFactor * 85, this.ctx.currentTime, 0.1); } catch(e) {}
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
                const len = Math.floor(this.ctx.sampleRate * 0.65);
                const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
                const d = buf.getChannelData(0);
                for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
                const src = this.ctx.createBufferSource(); src.buffer = buf;
                const filter = this.ctx.createBiquadFilter(); filter.type = "lowpass";
                filter.frequency.setValueAtTime(900, now); filter.frequency.exponentialRampToValueAtTime(30, now + 0.6);
                const g = this.ctx.createGain(); g.gain.setValueAtTime(0.35, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
                src.connect(filter); filter.connect(g); g.connect(this.ctx.destination);
                src.start(now);
            } catch(e) {}
        }
    }

    const audio = new CinematicAudio();

    // ─── STARDUST PARTICLE STREAM (Option 1 Micro-Particles) ─────
    class StardustStream {
        constructor(scene, hex) {
            this.count  = 260;
            this.posArr = new Float32Array(this.count * 3);
            const c     = new THREE.Color(hex);

            for (let i = 0; i < this.count; i++) {
                this.posArr[i * 3]     = (Math.random() - 0.5) * 4.0;
                this.posArr[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
                this.posArr[i * 3 + 2] = -Math.random() * 10.0;
            }

            this.geo = new THREE.BufferGeometry();
            this.geo.setAttribute("position", new THREE.BufferAttribute(this.posArr, 3));

            const mat = new THREE.PointsMaterial({
                color: c, size: 0.045, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending,
            });
            this.pts = new THREE.Points(this.geo, mat);
            scene.add(this.pts);
        }

        update(dt, speedRatio) {
            const spd = (12.0 + speedRatio * 18.0) * dt;
            const attr = this.geo.attributes.position;
            const arr = attr.array;
            for (let i = 0; i < this.count; i++) {
                arr[i * 3 + 2] += spd;
                if (arr[i * 3 + 2] > 1.0) {
                    arr[i * 3]     = (Math.random() - 0.5) * 4.0;
                    arr[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
                    arr[i * 3 + 2] = -10.0;
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
        startTime: 0, flightDuration: 1.5,
        flyingCard: null,

        init() {
            if (this.overlay) return;

            const html = `
<div id="vanta-cinematic-warp" style="
    position:fixed;inset:0;z-index:9500;display:none;background:#030509;overflow:hidden;
    opacity:0;transition:opacity 0.4s cubic-bezier(0.16,1,0.3,1);font-family:'Inter',system-ui,sans-serif;
">
    <canvas id="vanta-warp-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block;"></canvas>

    <!-- Floating 3D Card emerging from inside the nebula -->
    <div id="cw-flying-card" style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.05);
        z-index:10;pointer-events:none;opacity:0;transition:none;
        background:rgba(8, 12, 20, 0.82);border:1px solid rgba(17,212,131,0.5);
        border-radius:24px;padding:2.2rem 2.8rem;max-width:460px;width:90%;
        text-align:center;box-shadow:0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(17,212,131,0.35);
        backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
        display:flex;flex-direction:column;align-items:center;gap:1.1rem;
    ">
        <div style="width:120px;height:120px;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.2);box-shadow:0 12px 30px rgba(0,0,0,0.6);">
            <img id="cw-card-img" src="" alt="" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <span id="cw-card-tag" style="font-size:0.72rem;font-weight:800;letter-spacing:2px;color:#11d483;font-family:monospace;text-transform:uppercase;">TAG</span>
        <h3 id="cw-card-title" style="margin:0;font-size:1.75rem;font-weight:900;color:#fff;letter-spacing:-0.5px;">TITLE</h3>
    </div>

    <!-- Top Left Status Badge -->
    <div style="position:absolute;top:2rem;left:2.5rem;z-index:11;pointer-events:none;">
        <div style="
            display:flex;align-items:center;gap:0.7rem;background:rgba(255,255,255,0.06);
            backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.12);
            padding:0.5rem 1.2rem;border-radius:50px;box-shadow:0 10px 30px rgba(0,0,0,0.5);
        ">
            <span style="width:8px;height:8px;border-radius:50%;background:#11d483;box-shadow:0 0 12px #11d483;animation:cw-pulse 1.2s infinite;"></span>
            <span id="cw-dest-title" style="color:#fff;font-size:0.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;">CONECTANDO AL EXPEDIENTE...</span>
        </div>
    </div>

    <!-- Soft Prism Flash Layer -->
    <div id="cw-flash" style="position:absolute;inset:0;z-index:12;pointer-events:none;opacity:0;background:radial-gradient(circle at center, rgba(255,255,255,0.9), rgba(0,210,255,0.4));"></div>
</div>
<style>
  @keyframes cw-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
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

        // ── PUBLIC LAUNCH (NEBULA & PRISM HYBRID) ─────────────────────
        launch(projectId, onComplete) {
            this.init();
            this._setupThree();
            audio.init();

            const p = PROJECTS[projectId] || DEFAULT_PROJECT;
            this.currentProject     = projectId;
            this.onCompleteCallback = onComplete;

            // Apply Theme Palette
            this.material.uniforms.iColorA.value.set(...p.colorA);
            this.material.uniforms.iColorB.value.set(...p.colorB);
            if (this.stardust) this.stardust.setColor(p.hex);

            // Set Floating Card Content & Neon Glow Border
            document.getElementById("cw-card-img").src = p.img;
            document.getElementById("cw-card-tag").textContent = p.tag;
            document.getElementById("cw-card-tag").style.color = p.hex;
            document.getElementById("cw-card-title").textContent = p.title;
            this.flyingCard.style.borderColor = p.hex;
            this.flyingCard.style.boxShadow = `0 0 80px rgba(0,0,0,0.9), 0 0 45px ${p.hex}66`;

            document.getElementById("cw-dest-title").textContent = `CONECTANDO A: ${p.title.toUpperCase()}...`;

            // Reset Card Animation State
            this.flyingCard.style.transform = "translate(-50%, -50%) scale(0.05)";
            this.flyingCard.style.opacity   = "0";
            this.flyingCard.style.filter    = "blur(16px)";

            this.overlay.style.display = "block";
            requestAnimationFrame(() => { this.overlay.style.opacity = "1"; });

            document.body.style.overflow = "hidden";
            this.active           = true;
            this.warpFactor       = 0.0;
            this.targetWarpFactor = 0.85;
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

            // Lerp Mouse
            this.mousePos.x += (this.targetMouse.x - this.mousePos.x) * 0.08;
            this.mousePos.y += (this.targetMouse.y - this.mousePos.y) * 0.08;

            this.targetWarpFactor = Math.min(1.0, 0.4 + progress * 0.6);
            this.warpFactor += (this.targetWarpFactor - this.warpFactor) * 0.1;

            this.material.uniforms.iTime.value       = elapsed;
            this.material.uniforms.iMouse.value.set(this.mousePos.x, this.mousePos.y);
            this.material.uniforms.iWarpFactor.value = this.warpFactor;

            if (this.stardust) this.stardust.update(0.016, this.warpFactor);
            audio.updatePitch(this.warpFactor);

            // ── CARD FLY-THROUGH ANIMATION (Emerges from inside nebula) ──
            if (progress > 0.12) {
                const cardProg = (progress - 0.12) / 0.88;
                const scale = 0.05 + Math.pow(cardProg, 2.2) * 0.90;
                const opacity = Math.min(1.0, cardProg * 1.8);
                const blur = Math.max(0, (1 - cardProg * 1.2) * 14);

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
                flash.style.opacity = "0.95";
            }

            // 2. Open Project Modal UNDERNEATH the flash layer right now!
            if (openDossier && typeof this.onCompleteCallback === "function") {
                this.onCompleteCallback(this.currentProject);
            }

            // 3. Smoothly fade out flash and overlay, seamlessly revealing the opened modal!
            setTimeout(() => {
                this.overlay.style.transition = "opacity 0.45s cubic-bezier(0.16,1,0.3,1)";
                this.overlay.style.opacity    = "0";
                if (flash) {
                    flash.style.transition = "opacity 0.45s cubic-bezier(0.16,1,0.3,1)";
                    flash.style.opacity    = "0";
                }
                setTimeout(() => {
                    this.overlay.style.display = "none";
                    if (flash) flash.style.opacity = "0";
                }, 480);
            }, 80);
        }
    };

    window.WarpRunner = WarpRunner;
})();
