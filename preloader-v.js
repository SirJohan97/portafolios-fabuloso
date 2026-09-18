/* ====================================================================
   PRELOADER-V.JS — Awwwards SOTY Cinematic Minimalist Preloader
   ────────────────────────────────────────────────────────────────────
   • 100% Pure Minimalist Aesthetic (No corner clutter / Zero distraction)
   • High-Contrast Glowing Vector Diamond + Chevron V Monogram
   • Fast 1.2s Non-Linear Psychological Ease (Snappy & High-Performance)
   • Dennis Snellenberg Elastic Bézier Curve Membrane Exit (Q Curve Morph)
   • Lead-in Overlap: Unlocks Hero Entrance at 60% of Curtain Retraction
   • Automatic GPU Shader Warm-Up Integration
   ==================================================================== */

(function initVPreloader() {
    'use strict';

    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // 1. Lock scroll during preloading
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    if (window.history && window.history.scrollRestoration) {
        window.history.scrollRestoration = 'manual';
    }

    // Clean any old legacy curtain elements if present
    preloader.querySelectorAll('.curtain, .preloader-column').forEach(c => c.remove());

    // 2. Setup Canvas
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

    // 3. Fast & Snappy Animation Timing (1.25s first visit, 0.65s revisit)
    const hasSeen = sessionStorage.getItem('vanta-preloader-seen');
    const TOTAL_MS = hasSeen ? 650 : 1250;
    sessionStorage.setItem('vanta-preloader-seen', 'true');
    const startTime = performance.now();

    let mouseX = cx, mouseY = cy;
    window.addEventListener('mousemove', (e) => {
        mouseX += (e.clientX - mouseX) * 0.12;
        mouseY += (e.clientY - mouseY) * 0.12;
    }, { passive: true });

    // Subtle ambient dust particles (only 40 ultra-discrete particles)
    const dustCount = 40;
    const dust = [];
    for (let i = 0; i < dustCount; i++) {
        dust.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.5,
            speedY: -0.2 - Math.random() * 0.4,
            opacity: Math.random() * 0.4 + 0.1
        });
    }

    let isRevealing = false;

    // 4. Main Drawing Loop
    function loop(ts) {
        if (isRevealing) return;

        const elapsed = ts - startTime;
        // Non-linear cubic ease for progress: rapid acceleration then confident snap
        const rawT = Math.min(elapsed / TOTAL_MS, 1.0);
        const progress = Math.min(1.0, 1 - Math.pow(1 - rawT, 3.2));

        // Background: Deep void black
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, W, H);

        // A. Subtle ambient floating dust
        ctx.fillStyle = 'rgba(17, 212, 131, 0.25)';
        for (let i = 0; i < dust.length; i++) {
            const p = dust[i];
            p.y += p.speedY;
            if (p.y < 0) p.y = H;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // B. Draw High-Contrast Glowing Monogram
        drawLuminousLogo(progress, ts);

        // C. Progress or Reveal Trigger
        if (rawT < 1.0) {
            requestAnimationFrame(loop);
        } else {
            isRevealing = true;
            triggerSnellenbergReveal();
        }
    }

    // 5. Monogram Drawing with Specular Lighting & Neon Emissives
    function drawLuminousLogo(progress, ts) {
        const size = Math.min(140, Math.max(90, W * 0.22));
        const ly = cy - 30;

        const top    = { x: cx, y: ly - size };
        const right  = { x: cx + size, y: ly };
        const bottom = { x: cx, y: ly + size };
        const left   = { x: cx - size, y: ly };

        ctx.save();

        // Ambient radial glow behind diamond
        const glowGrad = ctx.createRadialGradient(cx, ly, size * 0.1, cx, ly, size * 1.8);
        glowGrad.addColorStop(0, `rgba(17, 212, 131, ${progress * 0.22})`);
        glowGrad.addColorStop(0.5, `rgba(17, 212, 131, ${progress * 0.06})`);
        glowGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, ly, size * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 1. Diamond Frame Vector Lines
        ctx.strokeStyle = '#11d483';
        ctx.shadowColor = 'rgba(17, 212, 131, 0.9)';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const t1 = Math.min(1, Math.max(0, progress / 0.25));
        const t2 = Math.min(1, Math.max(0, (progress - 0.2) / 0.25));
        const t3 = Math.min(1, Math.max(0, (progress - 0.4) / 0.25));
        const t4 = Math.min(1, Math.max(0, (progress - 0.6) / 0.25));

        // Line 1: Top -> Right
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(top.x + (right.x - top.x) * t1, top.y + (right.y - top.y) * t1);
        ctx.stroke();

        // Line 2: Right -> Bottom
        if (t2 > 0) {
            ctx.beginPath();
            ctx.moveTo(right.x, right.y);
            ctx.lineTo(right.x + (bottom.x - right.x) * t2, right.y + (bottom.y - right.y) * t2);
            ctx.stroke();
        }

        // Line 3: Bottom -> Left
        if (t3 > 0) {
            ctx.beginPath();
            ctx.moveTo(bottom.x, bottom.y);
            ctx.lineTo(bottom.x + (left.x - bottom.x) * t3, bottom.y + (left.y - bottom.y) * t3);
            ctx.stroke();
        }

        // Line 4: Left -> Top
        if (t4 > 0) {
            ctx.beginPath();
            ctx.moveTo(left.x, left.y);
            ctx.lineTo(left.x + (top.x - left.x) * t4, left.y + (top.y - left.y) * t4);
            ctx.stroke();
        }

        // Diamond Interior Hue
        if (progress > 0.4) {
            ctx.fillStyle = `rgba(17, 212, 131, ${(progress - 0.4) * 0.1})`;
            ctx.beginPath();
            ctx.moveTo(top.x, top.y);
            ctx.lineTo(right.x, right.y);
            ctx.lineTo(bottom.x, bottom.y);
            ctx.lineTo(left.x, left.y);
            ctx.closePath();
            ctx.fill();
        }

        // 2. Bold V Chevron with Specular Shine
        const vTopLeft  = { x: cx - size * 0.44, y: ly - size * 0.25 };
        const vBottom   = { x: cx, y: ly + size * 0.42 };
        const vTopRight = { x: cx + size * 0.44, y: ly - size * 0.25 };

        const tv = Math.min(1, Math.max(0, (progress - 0.35) / 0.45));
        if (tv > 0) {
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#11d483';
            ctx.shadowBlur = 24;
            ctx.lineWidth = 6.0;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();

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

            // Inner Neon Core Stroke
            ctx.strokeStyle = '#11d483';
            ctx.lineWidth = 3.2;
            ctx.stroke();
        }

        // 3. Kinetic Brand "V A N T A"
        if (progress > 0.3) {
            const alpha = Math.min(1, (progress - 0.3) / 0.45);
            const tracking = 14 + (progress * 12);
            ctx.font = '700 22px "Space Mono", "Courier New", monospace';
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
            ctx.shadowColor = 'rgba(17, 212, 131, 0.6)';
            ctx.shadowBlur = 10;
            ctx.textAlign = 'center';

            const brand = 'VANTA';
            const totalW = (brand.length - 1) * tracking;
            const startX = cx - totalW / 2;
            const textY = ly + size + 46;

            for (let i = 0; i < brand.length; i++) {
                ctx.fillText(brand[i], startX + i * tracking, textY);
            }
        }

        // 4. Dynamic Percentage Counter (Minimalist & Clean)
        const pct = Math.floor(progress * 100);
        ctx.font = '600 12px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(17, 212, 131, 0.75)';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.fillText(`[ ${pct.toString().padStart(2, '0')}% ]`, cx, ly + size + 78);

        ctx.restore();
    }

    // 6. Dennis Snellenberg Bézier Curve Membrane Exit
    function triggerSnellenbergReveal() {
        const svgPath = document.getElementById('preloader-curve-path');

        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = '';
                    if (window.lenis) {
                        window.lenis.start();
                        window.lenis.scrollTo(0, { immediate: true });
                    }
                }
            });

            // A. SVG Membrane Stretch: Pulls down then snaps up
            if (svgPath) {
                tl.fromTo(svgPath,
                    { attr: { d: "M 0 0 L 100 0 L 100 100 Q 50 180 0 100 Z" } },
                    {
                        attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" },
                        duration: 0.95,
                        ease: "power4.inOut"
                    }, 0);
            }

            // B. Whole Preloader flies up with Snellenberg cubic bezier
            tl.to(preloader, {
                yPercent: -100,
                duration: 0.95,
                ease: gsap.parseEase("cubic-bezier(0.76, 0, 0.24, 1)")
            }, 0);

            // C. Canvas fade out simultaneously
            tl.to(canvas, { opacity: 0, duration: 0.4 }, 0);

            // D. LEAD-IN OVERLAP: At 52% of the curtain pull, fire Hero entrance!
            tl.call(() => {
                if (typeof window.play3DVEntranceAnimation === 'function') {
                    window.play3DVEntranceAnimation();
                } else {
                    let retries = 0;
                    const chk = setInterval(() => {
                        if (typeof window.play3DVEntranceAnimation === 'function') {
                            clearInterval(chk);
                            window.play3DVEntranceAnimation();
                        } else if (++retries > 20) {
                            clearInterval(chk);
                        }
                    }, 50);
                }
                // Animate hero titles into view
                gsap.fromTo('.htm-line',
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.08, duration: 1.1, ease: 'power4.out' }
                );
                gsap.fromTo('.hero-eyebrow-tag',
                    { y: -20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                );
                gsap.fromTo('#vanta-navbar',
                    { y: -30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
                );
                gsap.fromTo('.hero-sub-row, .hero-mini-bento, .hero-btns-row, .hero-hud-bottom',
                    { y: 25, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.08, duration: 1.0, ease: 'power3.out' }
                );
            }, null, 0.52);

        } else {
            // Fallback if GSAP is unavailable
            preloader.style.transition = 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)';
            preloader.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
                if (window.play3DVEntranceAnimation) window.play3DVEntranceAnimation();
            }, 850);
        }
    }

    requestAnimationFrame(loop);

})();
