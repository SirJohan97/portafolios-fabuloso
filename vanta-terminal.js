/* ================================================================
   VA-OS v4.0 INTERACTIVE LIVE TERMINAL & BENCHMARK ENGINE
   ────────────────────────────────────────────────────────────────
   • Sandboxed CLI Engine with History, Autocomplete & Audio Feedback
   • Live WebGL / GPU Micro-Benchmark with Dynamic GFLOPS & 3D Torus
   • Real-Time Token-by-Token AI Inference Stream Simulator
   • Dynamic Multi-Theme Shader Switcher (Emerald, Cyan, Gold, Matrix)
   • Click-to-Type Auto-Typing from Cyber Notepad Cheat-Sheet
   ================================================================ */

(function () {
    "use strict";

    class VantaTerminal {
        constructor() {
            this.inputEl = document.getElementById('vantaTermInput');
            this.screenEl = document.getElementById('vantaTermScreen');
            this.fpsEl = document.getElementById('termFpsVal');
            this.uptimeEl = document.getElementById('termUptimeVal');
            this.wrapper = document.querySelector('.terminal-interactive-wrapper');

            this.history = [];
            this.historyIndex = -1;
            this.isBusy = false;
            this.startTime = Date.now();
            this.frameCount = 0;
            this.lastFpsTime = performance.now();

            this.init();
        }

        init() {
            if (!this.inputEl || !this.screenEl) return;

            // Keyboard navigation
            this.inputEl.addEventListener('keydown', (e) => this.handleKeyDown(e));

            // Focus on clicking anywhere in terminal screen
            this.screenEl.addEventListener('click', () => this.inputEl.focus());

            // Bind Cyber Notepad Click-to-Type items
            document.querySelectorAll('.notepad-cmd-item').forEach((item) => {
                item.addEventListener('click', () => {
                    const cmd = item.getAttribute('data-cmd');
                    if (cmd) {
                        this.autoTypeAndExecute(cmd);
                    }
                });
            });

            // Start Telemetry loop
            this.updateTelemetry();
        }

        updateTelemetry() {
            const now = performance.now();
            this.frameCount++;
            if (now - this.lastFpsTime >= 1000) {
                const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
                if (this.fpsEl) this.fpsEl.textContent = `${fps} FPS`;
                this.frameCount = 0;
                this.lastFpsTime = now;
            }

            const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
            const secs = String(elapsedSec % 60).padStart(2, '0');
            if (this.uptimeEl) this.uptimeEl.textContent = `UP: ${mins}:${secs}`;

            requestAnimationFrame(() => this.updateTelemetry());
        }

        handleKeyDown(e) {
            // Typing sound feedback
            if (window.VANTA_AUDIO && e.key.length === 1) {
                window.VANTA_AUDIO.playSwitch(1.3);
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                const cmd = this.inputEl.value.trim();
                if (cmd) {
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                    this.execute(cmd);
                }
                this.inputEl.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.history.length && this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputEl.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputEl.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.inputEl.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autocomplete();
            }
        }

        autocomplete() {
            const val = this.inputEl.value.trim().toLowerCase();
            const commands = ['help', 'bench', 'ai', 'stack', 'theme', 'projects', 'contact', 'clear', 'team'];
            const match = commands.find(c => c.startsWith(val));
            if (match) {
                this.inputEl.value = match;
            }
        }

        autoTypeAndExecute(commandText) {
            if (this.isBusy) return;
            this.isBusy = true;
            this.inputEl.value = '';
            this.inputEl.focus();

            let index = 0;
            const typeInterval = setInterval(() => {
                if (index < commandText.length) {
                    this.inputEl.value += commandText[index];
                    if (window.VANTA_AUDIO) window.VANTA_AUDIO.playSwitch(1.2 + Math.random() * 0.3);
                    index++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        this.history.push(commandText);
                        this.historyIndex = this.history.length;
                        this.execute(commandText);
                        this.inputEl.value = '';
                        this.isBusy = false;
                    }, 140);
                }
            }, 38);
        }

        printLine(text, type = '') {
            const line = document.createElement('div');
            line.className = `term-out-line ${type}`;
            line.innerHTML = text;
            this.screenEl.appendChild(line);
            this.screenEl.scrollTop = this.screenEl.scrollHeight;
            return line;
        }

        execute(rawCmd) {
            const parts = rawCmd.trim().split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            // Print echo
            this.printLine(`<span class="prompt-symbol">user@vanta:~$</span> <span style="color:#fff;">${rawCmd}</span>`);

            if (window.VANTA_AUDIO) window.VANTA_AUDIO.playSwitch(0.9);

            switch (cmd) {
                case 'help':
                case '?':
                    this.printHelp();
                    break;
                case 'bench':
                case 'benchmark':
                    this.runGpuBenchmark();
                    break;
                case 'ai':
                    this.runAiStream(args.join(' ') || 'Diseña una arquitectura de microservicios resiliente');
                    break;
                case 'stack':
                    this.printStack();
                    break;
                case 'theme':
                    this.setTheme(args[0]);
                    break;
                case 'projects':
                    this.listProjects();
                    break;
                case 'contact':
                    this.printLine(`[SYS_COMMS] Abriendo canal directo con el equipo de ingeniería...`, 'success');
                    setTimeout(() => {
                        window.location.href = '#contact';
                    }, 400);
                    break;
                case 'clear':
                case 'cls':
                    this.screenEl.innerHTML = '';
                    break;
                case 'team':
                    this.printLine(`[CORE_AGENTS] Johan Fernández (AI & 3D) · Andrés Morales (Cloud & Backend)`, 'info');
                    break;
                default:
                    this.printLine(`Comando no reconocido: "${cmd}". Escribe <span class="highlight">help</span> o haz clic en la hoja de notas.`, 'warn');
                    break;
            }
        }

        printHelp() {
            this.printLine(`════════════════════════════════════════════════════════`, 'sys');
            this.printLine(`  <span class="highlight">VA-OS v4.0 CLI // MANUAL DE INGENIERÍA</span>`, 'highlight');
            this.printLine(`════════════════════════════════════════════════════════`, 'sys');
            this.printLine(`  <span class="success">bench</span>        - Ejecuta benchmark WebGL GPU en tiempo real`, 'sub');
            this.printLine(`  <span class="success">ai [prompt]</span>  - Simula inferencia de IA token por token con TTFT`, 'sub');
            this.printLine(`  <span class="success">theme [color]</span>- Cambia paleta: <span class="info">emerald</span> | <span class="info">cyan</span> | <span class="info">gold</span>`, 'sub');
            this.printLine(`  <span class="success">stack</span>        - Muestra capacidades técnicas de Andrés & Johan`, 'sub');
            this.printLine(`  <span class="success">projects</span>     - Lista los 8 sistemas desplegados en producción`, 'sub');
            this.printLine(`  <span class="success">clear</span>        - Limpia el buffer de la terminal`, 'sub');
            this.printLine(`════════════════════════════════════════════════════════`, 'sys');
        }

        runGpuBenchmark() {
            this.printLine(`[BENCH] Inicializando pipeline WebGL GPU Stress Test...`, 'info');
            
            // Create canvas for live benchmark visualization
            const canvasWrap = document.createElement('div');
            canvasWrap.className = 'term-bench-canvas-wrap';
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 140;
            canvasWrap.appendChild(canvas);
            this.screenEl.appendChild(canvasWrap);
            this.screenEl.scrollTop = this.screenEl.scrollHeight;

            const ctx = canvas.getContext('2d');
            let frame = 0;
            const t0 = performance.now();
            const totalFrames = 90;

            const benchLoop = () => {
                ctx.fillStyle = 'rgba(0, 5, 12, 0.25)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#11d483';
                ctx.lineWidth = 1.5;
                ctx.beginPath();

                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const radius = 45;
                const points = 32;

                for (let i = 0; i <= points; i++) {
                    const theta = (i / points) * Math.PI * 2;
                    const r = radius + Math.sin(theta * 4 + frame * 0.15) * 16;
                    const px = cx + Math.cos(theta + frame * 0.08) * r;
                    const py = cy + Math.sin(theta + frame * 0.08) * (r * 0.55);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();

                frame++;
                if (frame < totalFrames) {
                    requestAnimationFrame(benchLoop);
                } else {
                    const elapsed = performance.now() - t0;
                    const gflops = (38.4 * (1000 / elapsed)).toFixed(1);
                    this.printLine(`✔ [BENCH_COMPLETE] Renderizado: ${elapsed.toFixed(1)}ms (${totalFrames} frames)`, 'success');
                    this.printLine(`✔ [SCORE] Rendimiento Estimado: <span class="highlight">${gflops} GFLOPS</span> // Calificación: <span class="success">S-TIER ULTRA OPTIMIZED</span>`, 'highlight');
                    if (window.VANTA_AUDIO) window.VANTA_AUDIO.playGlitch(960);
                }
            };
            requestAnimationFrame(benchLoop);
        }

        runAiStream(prompt) {
            this.printLine(`[AI_CORE] Prompt recibido: "${prompt}"`, 'info');
            this.printLine(`[AI_CORE] Conectando con Red Neuronal VANTA... Latencia TTFT: 1.2ms`, 'sys');

            const outputLine = this.printLine('', 'success');
            const tokens = [
                "Estructurando", " lógica", " de", " agentes", " autónomos", "...",
                "\n→ [1]", " FastAPI", " asíncrono", " con", " tipado", " Pydantic", " v2.",
                "\n→ [2]", " Inferencia", " local", " YOLOv8", " y", " modelos", " de", " visión.",
                "\n→ [3]", " Bases", " de", " datos", " Postgres", " con", " políticas", " RLS.",
                "\n✔ [STATUS]", " Arquitectura", " compilada", " exitosamente", " a", " 60", " FPS."
            ];

            let tIdx = 0;
            const streamInterval = setInterval(() => {
                if (tIdx < tokens.length) {
                    outputLine.innerHTML += tokens[tIdx];
                    if (window.VANTA_AUDIO) window.VANTA_AUDIO.playSwitch(1.6 + Math.random() * 0.4);
                    this.screenEl.scrollTop = this.screenEl.scrollHeight;
                    tIdx++;
                } else {
                    clearInterval(streamInterval);
                }
            }, 65);
        }

        printStack() {
            this.printLine(`┌────────────────────────────────────────────────────────────┐`, 'sys');
            this.printLine(`│  <span class="highlight">VANTA ENGINEERING MATRIX (Andrés Morales & Johan F.)</span>    │`, 'highlight');
            this.printLine(`├─────────────────────────────┬──────────────────────────────┤`, 'sys');
            this.printLine(`│ <span class="info">ANDRÉS (Full-Stack & Cloud)</span> │ <span class="info">JOHAN (AI Vision & 3D)</span>       │`, 'info');
            this.printLine(`│ • FastAPI Async REST APIs   │ • YOLOv8 Local Vision AI     │`, 'sub');
            this.printLine(`│ • Supabase Cloud & Postgres │ • Machine Learning Models    │`, 'sub');
            this.printLine(`│ • Node.js & Vercel Edge     │ • Three.js 3D & GLSL Shaders │`, 'sub');
            this.printLine(`│ • Docker CI/CD & C++ Native │ • Cloudflare Zero Trust Mesh │`, 'sub');
            this.printLine(`└─────────────────────────────┴──────────────────────────────┘`, 'sys');
        }

        setTheme(colorName) {
            const themes = {
                cyan: { rgb: '0, 255, 255', hex: '#00ffff', name: 'AZUL CYBER' },
                gold: { rgb: '240, 192, 48', hex: '#f0c030', name: 'DORADO ROYALE' },
                emerald: { rgb: '17, 212, 131', hex: '#11d483', name: 'VERDE NEÓN' },
                matrix: { rgb: '34, 197, 94', hex: '#22c55e', name: 'MATRIX GREEN' }
            };

            const t = themes[colorName ? colorName.toLowerCase() : 'emerald'];
            if (!t) {
                this.printLine(`Tema no válido. Usa: <span class="info">cyan</span>, <span class="info">gold</span>, o <span class="info">emerald</span>.`, 'warn');
                return;
            }

            document.documentElement.style.setProperty('--primary-rgb', t.rgb);
            document.documentElement.style.setProperty('--primary', t.hex);
            window.currentPrimaryColor = t.hex;

            this.printLine(`✔ Tema actualizado a: <span class="highlight">${t.name}</span>`, 'success');
            if (window.VANTA_AUDIO) window.VANTA_AUDIO.playGlitch(1100);
        }

        listProjects() {
            this.printLine(`[PROYECTOS EN PRODUCCIÓN]`, 'highlight');
            this.printLine(`1. <span class="success">SVIVA</span> - Visión Artificial & Detección Local (Tesis)`, 'sub');
            this.printLine(`2. <span class="success">SVIVA Web</span> - Vite · TypeScript · React Showcase`, 'sub');
            this.printLine(`3. <span class="success">Kiosko Azul</span> - Gestión de Restaurante & Reservas en Tiempo Real`, 'sub');
            this.printLine(`4. <span class="success">IUTA</span> - Sistema de Gestión Bibliotecaria Automatizado`, 'sub');
            this.printLine(`5. <span class="success">Aura Check</span> - Auditoría Biométrica Local`, 'sub');
            this.printLine(`6. <span class="success">¿Qué le pasa a mi cuerpo?</span> - IA Médica Inmersiva`, 'sub');
            this.printLine(`7. <span class="success">VentasTrack</span> - Plataforma B2B & Facturación`, 'sub');
            this.printLine(`8. <span class="success">Inventario Pro</span> - Control de Stock & Analíticas`, 'sub');
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        window.vantaTerminalInstance = new VantaTerminal();
    });
})();
