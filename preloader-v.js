/* ====================================================================
   PRELOADER-V.JS — Awwwards-Grade Cinematic Vanta Logo Preloader
   
   Features:
   1. Dynamic Column Curtain: Replaces 2-part curtains with 5 staggered
      vertical columns that slide away in a wave.
   2. Interactive Cyber Grid: A WebGL-like 2D grid that warps under
      the progress and mouse movement.
   3. Custom Vector Animated Logo: Draws the official VANTA logo (Diamond
      Frame + V Chevron) dynamically with progress-based path drawing.
   4. Kinetic Text: "V A N T A" text expands letter-spacing on progress.
   5. Cybernetic Diagnostic Console: Real-time boot logs typing in the corner.
   ==================================================================== */

(function initVPreloader() {
    'use strict';

    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Lock scroll during preloading
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    if (window.history && window.history.scrollRestoration) {
        window.history.scrollRestoration = 'manual';
    }

    // ─── 1. Build Curtain Columns Dynamically ───
    preloader.querySelectorAll('.curtain').forEach(c => c.remove());
    
    const COL_COUNT = 5;
    const columns = [];
    for (let i = 0; i < COL_COUNT; i++) {
        const col = document.createElement('div');
        col.className = 'preloader-column';
        col.style.cssText = `
            position: absolute;
            top: 0;
            left: ${i * (100 / COL_COUNT)}%;
            width: ${100 / COL_COUNT}%;
            height: 100%;
            background: #050505;
            z-index: 1;
            transform: translateY(0);
        `;
        preloader.appendChild(col);
        columns.push(col);
    }

    // ─── 2. Setup Canvas ───
    const canvas = document.getElementById('preloader-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let cx = W / 2;
    let cy = H / 2;

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cx = W / 2;
        cy = H / 2;
    });

    // ─── 3. Cybernetic Boot Logs ───
    const BOOT_LOGS = [
        'SYSTEM: INITIALIZING VANTA_CORE_v4.0.2',
        'KERNEL: LOADING QUANTUM_GRID_MATRIX... OK',
        'MODULE: INJECTING VISCOUS_SLIME_FLOW... OK',
        'THREE_JS: COUPLING VERTEX_SHADERS... OK',
        'NAV: BUFFERING ASYNC_PORTFOLIO_TRACK... OK',
        'THEME: ACCELERATING NEON_GREEN_EMISSIVES... OK',
        'STATUS: VANTA_CORE IS READY'
    ];
    let logIndex = 0;
    let currentLogs = [];
    
    function addLog() {
        if (logIndex < BOOT_LOGS.length) {
            currentLogs.push(BOOT_LOGS[logIndex]);
            if (currentLogs.length > 5) currentLogs.shift();
            logIndex++;
            setTimeout(addLog, 450 + Math.random() * 300);
        }
    }
    setTimeout(addLog, 200);

    // ─── 4. Animation State ───
    const TOTAL_MS = sessionStorage.getItem('vanta-preloader-seen') ? 1600 : 3600;
    const startTime = performance.now();
    let mouseX = cx, mouseY = cy;

    window.addEventListener('mousemove', (e) => {
        mouseX += (e.clientX - mouseX) * 0.1;
        mouseY += (e.clientY - mouseY) * 0.1;
    });

    // ─── 5. Grid Particles ───
    const gridRows = 16;
    const gridCols = 16;
    const gridPoints = [];
    for (let r = 0; r <= gridRows; r++) {
        for (let c = 0; c <= gridCols; c++) {
            gridPoints.push({
                rx: c / gridCols,
                ry: r / gridRows,
            });
        }
    }

    // ─── 6. Main Loop ───
    function loop(ts) {
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / TOTAL_MS, 1);

        // Clear
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, W, H);

        // A. Draw Warping Cyber Grid
        ctx.strokeStyle = 'rgba(17, 212, 131, 0.08)';
        ctx.lineWidth = 1;

        for (let r = 0; r <= gridRows; r++) {
            ctx.beginPath();
            for (let c = 0; c <= gridCols; c++) {
                const pt = gridPoints[r * (gridCols + 1) + c];
                const baseX = pt.rx * W;
                const baseY = pt.ry * H;

                const dx = mouseX - baseX;
                const dy = mouseY - baseY;
                const dist = Math.sqrt(dx * dx + dy * dy) + 1;
                const force = Math.max(0, (200 - dist) / 200) * 45 * (1 - progress);

                const px = baseX - (dx / dist) * force;
                const py = baseY - (dy / dist) * force;

                if (c === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }

        for (let c = 0; c <= gridCols; c++) {
            ctx.beginPath();
            for (let r = 0; r <= gridRows; r++) {
                const pt = gridPoints[r * (gridCols + 1) + c];
                const baseX = pt.rx * W;
                const baseY = pt.ry * H;

                const dx = mouseX - baseX;
                const dy = mouseY - baseY;
                const dist = Math.sqrt(dx * dx + dy * dy) + 1;
                const force = Math.max(0, (200 - dist) / 200) * 45 * (1 - progress);

                const px = baseX - (dx / dist) * force;
                const py = baseY - (dy / dist) * force;

                if (r === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }

        // B. Draw Custom Vector Animated VANTA Logo
        drawAnimatedLogo(progress, ts);

        // C. Render Corner Diagnostic Console logs
        ctx.save();
        ctx.font = '11px "Courier New", monospace';
        ctx.fillStyle = 'rgba(17, 212, 131, 0.5)';
        ctx.textAlign = 'left';
        
        const logX = 40;
        let logY = H - 180;
        ctx.fillText('// VANTA DIAGNOSTIC DATASTREAM', logX, logY - 20);
        
        ctx.strokeStyle = 'rgba(17, 212, 131, 0.2)';
        ctx.beginPath();
        ctx.moveTo(logX, logY - 12);
        ctx.lineTo(logX + 280, logY - 12);
        ctx.stroke();

        currentLogs.forEach((log, index) => {
            ctx.fillText(log, logX, logY + index * 22);
        });
        ctx.restore();

        // Continue or Reveal
        if (progress < 1) {
            requestAnimationFrame(loop);
        } else {
            triggerReveal();
        }
    }

    // ─── 7. Logo Drawing Logic ───
    function drawAnimatedLogo(progress, ts) {
        const size = Math.min(130, W * 0.28); // diamond size
        const ly = cy - 25; // center Y of diamond

        const top = { x: cx, y: ly - size };
        const right = { x: cx + size, y: ly };
        const bottom = { x: cx, y: ly + size };
        const left = { x: cx - size, y: ly };

        ctx.save();

        // 1. Draw Diamond Frame stroke dynamically
        ctx.strokeStyle = '#11d483';
        ctx.shadowColor = '#11d483';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';

        // Stagger diamond lines based on progress
        const t1 = Math.min(1, Math.max(0, progress / 0.18));
        const t2 = Math.min(1, Math.max(0, (progress - 0.18) / 0.18));
        const t3 = Math.min(1, Math.max(0, (progress - 0.36) / 0.18));
        const t4 = Math.min(1, Math.max(0, (progress - 0.54) / 0.18));

        // Line 1: Top to Right
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(top.x + (right.x - top.x) * t1, top.y + (right.y - top.y) * t1);
        ctx.stroke();

        // Line 2: Right to Bottom
        if (t2 > 0) {
            ctx.beginPath();
            ctx.moveTo(right.x, right.y);
            ctx.lineTo(right.x + (bottom.x - right.x) * t2, right.y + (bottom.y - right.y) * t2);
            ctx.stroke();
        }

        // Line 3: Bottom to Left
        if (t3 > 0) {
            ctx.beginPath();
            ctx.moveTo(bottom.x, bottom.y);
            ctx.lineTo(bottom.x + (left.x - bottom.x) * t3, bottom.y + (left.y - bottom.y) * t3);
            ctx.stroke();
        }

        // Line 4: Left to Top
        if (t4 > 0) {
            ctx.beginPath();
            ctx.moveTo(left.x, left.y);
            ctx.lineTo(left.x + (top.x - left.x) * t4, left.y + (top.y - left.y) * t4);
            ctx.stroke();
        }

        // Fill background of diamond softly
        if (progress > 0.45) {
            ctx.fillStyle = `rgba(17, 212, 131, ${(progress - 0.45) * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(top.x, top.y);
            ctx.lineTo(right.x, right.y);
            ctx.lineTo(bottom.x, bottom.y);
            ctx.lineTo(left.x, left.y);
            ctx.closePath();
            ctx.fill();
        }

        // 2. Draw V Chevron inside dynamically
        // Chevron coordinates inside diamond
        const vTopLeft = { x: cx - size * 0.45, y: ly - size * 0.28 };
        const vBottom  = { x: cx, y: ly + size * 0.4 };
        const vTopRight= { x: cx + size * 0.45, y: ly - size * 0.28 };

        const tv = Math.min(1, Math.max(0, (progress - 0.45) / 0.35)); // draws from progress 0.45 to 0.8
        if (tv > 0) {
            ctx.strokeStyle = '#11d483';
            ctx.lineWidth = 5.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            
            // Left arm to bottom vertex, then bottom vertex to right arm
            if (tv <= 0.5) {
                const subT = tv / 0.5;
                ctx.moveTo(vTopLeft.x, vTopLeft.y);
                ctx.lineTo(vTopLeft.x + (vBottom.x - vTopLeft.x) * subT, vTopLeft.y + (vBottom.y - vTopLeft.y) * subT);
            } else {
                const subT = (tv - 0.5) / 0.5;
                ctx.moveTo(vTopLeft.x, vTopLeft.y);
                ctx.lineTo(vBottom.x, vBottom.y);
                ctx.lineTo(vBottom.x + (vTopRight.x - vBottom.x) * subT, vBottom.y + (vTopRight.y - vBottom.y) * subT);
            }
            ctx.stroke();
        }

        // 3. Draw "V A N T A" Brand text below
        if (progress > 0.3) {
            const textAlpha = Math.min(1, (progress - 0.3) / 0.5);
            const letterSpacing = 8 + (progress * 18); // Dynamic spacing expansion
            
            ctx.font = '700 24px "Courier New", monospace';
            ctx.fillStyle = `rgba(17, 212, 131, ${textAlpha})`;
            ctx.textAlign = 'center';

            // Custom letter spacing drawing
            const brandText = 'VANTA';
            const totalW = (brandText.length - 1) * letterSpacing;
            let startX = cx - totalW / 2;
            const textY = ly + size + 42;

            for (let i = 0; i < brandText.length; i++) {
                ctx.fillText(brandText[i], startX + i * letterSpacing, textY);
            }
        }

        // 4. Progress percentage line & number right below text
        const pct = Math.floor(progress * 100);
        ctx.font = '600 11px "Courier New", monospace';
        ctx.fillStyle = 'rgba(17, 212, 131, 0.4)';
        ctx.fillText(`BOOTING_CORE_DAT: ${pct}%`, cx, ly + size + 74);

        ctx.restore();
    }

    // ─── 8. Staggered Column Curtain Transition ───
    function triggerReveal() {
        if (typeof gsap !== 'undefined') {
            gsap.to(columns, {
                y: (i) => i % 2 === 0 ? '-100%' : '100%',
                duration: 1.1,
                stagger: 0.08,
                ease: 'power4.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = '';
                    if (window.lenis) {
                        window.lenis.start();
                        window.lenis.scrollTo(0, { immediate: true });
                    }
                    if (window.play3DVEntranceAnimation) {
                        window.play3DVEntranceAnimation();
                    }
                }
            });
            gsap.to(canvas, { opacity: 0, duration: 0.5 });
        } else {
            columns.forEach((col, i) => {
                col.style.transform = i % 2 === 0 ? 'translateY(-100%)' : 'translateY(100%)';
                col.style.transition = 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1)';
            });
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
                if (window.lenis) {
                    window.lenis.start();
                    window.lenis.scrollTo(0, { immediate: true });
                }
                if (window.play3DVEntranceAnimation) window.play3DVEntranceAnimation();
            }, 850);
        }
    }

    requestAnimationFrame(loop);

})();
