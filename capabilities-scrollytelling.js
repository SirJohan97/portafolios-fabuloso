/* =============================================================
   VANTA STUDIO — KINETIC CAPABILITIES SCROLLYTELLING ENGINE
   Awwwards Pinned Interactive Showcase with Live Telemetry
   ============================================================= */

(function() {
    'use strict';

    function initCapabilitiesScrollytelling() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('[VANTA] GSAP or ScrollTrigger not loaded for capabilities scrollytelling');
            return;
        }

        const section = document.querySelector('.kinetic-capabilities-section');
        if (!section) return;

        const vectorItems = document.querySelectorAll('.kc-vector-item');
        const stagePanels = document.querySelectorAll('.kc-stage-panel');
        const activeNumEl = document.getElementById('kcActiveNum');
        const totalVectors = vectorItems.length;

        let activeIndex = 0;

        function setActiveVector(newIndex) {
            if (newIndex < 0 || newIndex >= totalVectors) return;
            if (newIndex === activeIndex && vectorItems[newIndex].classList.contains('active')) return;

            activeIndex = newIndex;

            // Update vector items
            vectorItems.forEach((item, idx) => {
                if (idx === activeIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Update stage panels with smooth crossfade
            stagePanels.forEach((panel, idx) => {
                if (idx === activeIndex) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });

            // Update top counter
            if (activeNumEl) {
                activeNumEl.textContent = `0${activeIndex + 1}`;
            }
        }

        // Only pin and scrub on desktop/tablet where height is sufficient
        const isMobile = window.innerWidth <= 980;

        if (!isMobile) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=250%',
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const prog = self.progress; // 0 to 1
                        const targetIdx = Math.min(totalVectors - 1, Math.floor(prog * totalVectors));
                        setActiveVector(targetIdx);

                        // Update individual progress bars inside each vector item
                        const stepSize = 1 / totalVectors;
                        vectorItems.forEach((item, idx) => {
                            const fill = item.querySelector('.kcv-progress-fill');
                            if (!fill) return;

                            const itemStart = idx * stepSize;
                            const itemEnd = (idx + 1) * stepSize;

                            if (prog <= itemStart) {
                                fill.style.width = '0%';
                            } else if (prog >= itemEnd) {
                                fill.style.width = '100%';
                            } else {
                                const localProg = (prog - itemStart) / stepSize;
                                fill.style.width = `${Math.round(localProg * 100)}%`;
                            }
                        });
                    }
                }
            });

            // Allow clicking vector items to smoothly scroll to corresponding progress
            vectorItems.forEach((item, idx) => {
                item.addEventListener('click', () => {
                    const triggerST = tl.scrollTrigger;
                    if (triggerST) {
                        const targetScroll = triggerST.start + (triggerST.end - triggerST.start) * ((idx + 0.5) / totalVectors);
                        if (window.lenis) {
                            window.lenis.scrollTo(targetScroll);
                        } else {
                            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                        }
                    } else {
                        setActiveVector(idx);
                    }
                });
            });
        } else {
            // Mobile fallback: click-to-switch
            vectorItems.forEach((item, idx) => {
                item.addEventListener('click', () => {
                    setActiveVector(idx);
                });
            });
        }

        // Initialize Live Interactive Telemetry Micro-Engines
        initVisionTelemetry();
        initCipherStream();
        initMeshCanvas();
        initCreativeCanvas();

        console.log('[VANTA] Kinetic capabilities scrollytelling initialized successfully');
    }

    /* 1. Stage 1: Tactical Vision HUD Live Coordinates */
    function initVisionTelemetry() {
        const bboxCoords = document.querySelector('.bbox-coords');
        if (!bboxCoords) return;

        let baseX = 420.4;
        let baseY = 812.1;

        setInterval(() => {
            const deltaX = (Math.random() - 0.5) * 1.6;
            const deltaY = (Math.random() - 0.5) * 1.6;
            bboxCoords.textContent = `X: ${(baseX + deltaX).toFixed(1)} Y: ${(baseY + deltaY).toFixed(1)}`;
        }, 120);
    }

    /* 2. Stage 2: Cyber Terminal Dynamic Cipher Stream */
    function initCipherStream() {
        const cipherEl = document.getElementById('kcCipherHash');
        if (!cipherEl) return;

        const hexChars = '0123456789abcdef';
        setInterval(() => {
            let hash = '';
            for (let i = 0; i < 64; i++) {
                hash += hexChars[Math.floor(Math.random() * hexChars.length)];
            }
            cipherEl.textContent = hash;
        }, 300);
    }

    /* 3. Stage 3: Distributed Mesh Throughput Waveform Canvas */
    function initMeshCanvas() {
        const canvas = document.getElementById('kcMeshCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let step = 0;

        function drawWaveform() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#C084FC';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#C084FC';

            ctx.beginPath();
            const sliceWidth = canvas.width / 40;
            let x = 0;

            for (let i = 0; i <= 40; i++) {
                const y = canvas.height / 2 + Math.sin((i * 0.4) + step) * 18 + Math.cos((i * 0.2) - step * 0.5) * 10;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            ctx.stroke();
            step += 0.08;
            requestAnimationFrame(drawWaveform);
        }

        drawWaveform();
    }

    /* 4. Stage 4: Awwwards Interactive Particle Sphere Canvas */
    function initCreativeCanvas() {
        const canvas = document.getElementById('kcCreativeCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        function resize() {
            canvas.width = canvas.parentElement.clientWidth || 400;
            canvas.height = canvas.parentElement.clientHeight || 400;
        }
        resize();
        window.addEventListener('resize', resize);

        const numParticles = 80;
        const particles = [];
        const radius = Math.min(canvas.width, canvas.height) * 0.32;

        for (let i = 0; i < numParticles; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            particles.push({
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi)
            });
        }

        let angleX = 0;
        let angleY = 0;

        function renderSphere() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            angleX += 0.008;
            angleY += 0.012;

            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                const x1 = p.x * cosY - p.z * sinY;
                const z1 = p.z * cosY + p.x * sinY;

                const y1 = p.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + p.y * sinX;

                const fov = 300;
                const scale = fov / (fov + z2);
                const px = cx + x1 * scale;
                const py = cy + y1 * scale;

                const alpha = Math.max(0.15, Math.min(1, (z2 + radius) / (2 * radius)));

                ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
                ctx.beginPath();
                ctx.arc(px, py, Math.max(1, 2.5 * scale), 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y, p.z - p2.z);
                    if (dist < 70) {
                        const x2_1 = p2.x * cosY - p2.z * sinY;
                        const z2_1 = p2.z * cosY + p2.x * sinY;
                        const y2_1 = p2.y * cosX - z2_1 * sinX;
                        const z2_2 = z2_1 * cosX + p2.y * sinX;

                        const scale2 = fov / (fov + z2_2);
                        const px2 = cx + x2_1 * scale2;
                        const py2 = cy + y2_1 * scale2;

                        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.18})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(px2, py2);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(renderSphere);
        }

        renderSphere();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCapabilitiesScrollytelling);
    } else {
        initCapabilitiesScrollytelling();
    }
})();
