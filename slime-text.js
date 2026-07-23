/* =============================================================
   SLIME-TEXT.JS v8 — Optimized High-End Vector Slime & SVG Warp Engine
   ============================================================= */

(function initSlimeTextEngine() {
    'use strict';

    // ─── WORDS ────────────────────────────────────────────────
    const WORDS = [
        'APLICACIONES WEB',
        'SISTEMAS BACKEND',
        'INTELIGENCIA ARTIFICIAL',
        'AUTOMATIZACIÓN',
    ];

    // ─── TIMING ───────────────────────────────────────────────
    const DISPLAY_MS  = 4600;   // idle display time
    const SAG_MS      = 400;    // viscous sag start
    const DRIP_MS     = 1000;   // warp + fade + drip
    const EMPTY_MS    = 200;    // brief clear canvas pause
    const CREATE_MS   = 1000;   // crystallize new word from liquid

    // ─── STATE ────────────────────────────────────────────────
    let canvas, ctx;
    let wrapEl, anchorEl, filterDisp, filterTurb, filterBlur;
    let wordIndex  = 0;
    let particles  = [];
    let phase      = 'idle';    // idle|sag|drip|empty|create
    let phaseStart = 0;
    let lastTime   = 0;

    let CANVAS_W   = 0;
    let CANVAS_H   = 0;

    let isSlimeVisible = true;
    let timeoutId      = null;

    function scheduleNextCycle() {
        if (timeoutId) clearTimeout(timeoutId);
        const currentScroll = window.scrollY || window.pageYOffset;
        isSlimeVisible = currentScroll < window.innerHeight * 1.5;
        if (isSlimeVisible && !document.hidden) {
            timeoutId = setTimeout(startSag, DISPLAY_MS);
        }
    }

    // ─── INIT ─────────────────────────────────────────────────
    function init() {
        anchorEl = document.getElementById('liquid-text');
        filterDisp = document.getElementById('vanta-slime-displacement');
        if (!anchorEl || !filterDisp) return;
        filterTurb = filterDisp.parentNode.querySelector('feTurbulence');
        filterBlur = document.getElementById('vanta-slime-blur');

        wrapEl = anchorEl.closest('.hero-typing-subtitle-wrap');
        if (!wrapEl) return;

        // Make HTML text visible
        anchorEl.style.visibility = 'visible';
        anchorEl.style.opacity    = '1';
        anchorEl.style.transform  = 'translateY(0)';
        anchorEl.textContent      = WORDS[0];

        // Turn off SVG filter initially to save 100% rendering cost during idle
        anchorEl.style.filter     = 'none';
        filterDisp.setAttribute('scale', '0');
        if (filterBlur) filterBlur.setAttribute('stdDeviation', '0');

        // Create canvas for dripping particles behind/below the text
        canvas = document.createElement('canvas');
        canvas.id = 'slime-canvas';
        canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:2;';
        wrapEl.appendChild(canvas);
        ctx = canvas.getContext('2d');

        resize();
        window.addEventListener('resize', resize);

        phase = 'idle';
        phaseStart = performance.now();

        function wakeUpSlime() {
            const currentScroll = window.scrollY || window.pageYOffset;
            const nowVisible = currentScroll < window.innerHeight * 1.5;
            if (nowVisible) {
                if (!isSlimeVisible || (phase === 'idle' && !timeoutId)) {
                    isSlimeVisible = true;
                    scheduleNextCycle();
                }
            } else {
                if (isSlimeVisible) {
                    isSlimeVisible = false;
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                }
            }
        }

        window.addEventListener('scroll', wakeUpSlime, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            } else {
                wakeUpSlime();
            }
        });

        scheduleNextCycle();
    }

    // ─── RESIZE ───────────────────────────────────────────────
    function resize() {
        if (!wrapEl || !anchorEl || !canvas) return;
        const wRect = wrapEl.getBoundingClientRect();
        const aRect = anchorEl.getBoundingClientRect();

        CANVAS_W = Math.max(aRect.width + 120, 320);
        CANVAS_H = 150; // height for drip

        canvas.width  = CANVAS_W;
        canvas.height = CANVAS_H;

        // Center canvas relative to the anchor text
        const leftOff = aRect.left - wRect.left - 60;
        canvas.style.left = leftOff + 'px';
        canvas.style.top  = (aRect.top - wRect.top - 10) + 'px';
    }

    // ─── PHASE TRIGGERS ───────────────────────────────────────
    function startSag() {
        if (phase !== 'idle') return;
        phase = 'sag';
        phaseStart = performance.now();
        
        // Turn on filter for the sag animation
        anchorEl.style.filter = "url('#vanta-slime-filter')";
        
        // Start animation loop
        requestAnimationFrame(loop);
    }

    function startDrip() {
        phase = 'drip';
        phaseStart = performance.now();
        
        // Spawn green dripping particles along the width of the text
        const rect = anchorEl.getBoundingClientRect();
        const textW = rect.width;
        const particleCount = Math.min(25, Math.floor(textW / 12));

        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: 60 + Math.random() * textW,
                y: 35 + Math.random() * 8, // start just below top edge
                vx: (Math.random() - 0.5) * 1.5,
                vy: 0.5 + Math.random() * 2,
                r: 2.2 + Math.random() * 2.8,
                dripDelay: Math.random() * 0.4,
                alpha: 1
            });
        }
    }

    function startEmpty() {
        phase = 'empty';
        phaseStart = performance.now();
        particles = []; // clear dripping particles
        anchorEl.textContent = ''; // clear text
    }

    function startCreate() {
        wordIndex = (wordIndex + 1) % WORDS.length;
        anchorEl.textContent = WORDS[wordIndex];
        phase = 'create';
        phaseStart = performance.now();
        resize(); // resize canvas to match the new word width
    }

    // ─── ANIMATION LOOP ───────────────────────────────────────
    function loop(ts) {
        if (phase === 'idle') return; // Stop loop during idle
        
        requestAnimationFrame(loop);
        const elapsed = ts - phaseStart;
        update(ts, elapsed);
        render(ts);
        lastTime = ts;
    }

    function update(ts, elapsed) {
        if (!filterDisp) return;

        if (phase === 'idle') {
            return;
        } else if (phase === 'sag') {
            const t = Math.min(elapsed / SAG_MS, 1);
            
            // viscous sag: scale starts warping, blur increases
            const scaleVal = 3 + t * 20; // scale goes up to 23
            filterDisp.setAttribute('scale', scaleVal);
            
            if (filterBlur) {
                const blurVal = 0.4 + t * 2.8; // blur goes up to 3.2
                filterBlur.setAttribute('stdDeviation', blurVal.toString());
            }
            
            // Translate HTML text down slightly
            anchorEl.style.transform = `translateY(${t * 6}px)`;
            
            if (t >= 1) startDrip();

        } else if (phase === 'drip') {
            const t = Math.min(elapsed / DRIP_MS, 1);
            
            // Extreme liquid warp and dissolve
            const scaleVal = 23 + t * 77; // goes up to 100
            filterDisp.setAttribute('scale', scaleVal);
            
            if (filterBlur) filterBlur.setAttribute('stdDeviation', '3.2');
            
            // Fade out HTML text
            anchorEl.style.opacity = (1 - t).toString();
            anchorEl.style.transform = `translateY(${6 + t * 18}px)`;

            // Update dripping particles
            particles.forEach(p => {
                if (t > p.dripDelay) {
                    p.vy += 0.22; // gravity
                    p.vx += Math.sin(ts * 0.006 + p.x) * 0.08;
                    p.vx *= 0.85;
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    // Fade/shrink as they fall off bottom
                    if (p.y > CANVAS_H - 40) {
                        p.alpha = Math.max(0, (CANVAS_H - p.y) / 40);
                    }
                }
            });

            if (t >= 1) startEmpty();

        } else if (phase === 'empty') {
            filterDisp.setAttribute('scale', '100');
            if (filterBlur) filterBlur.setAttribute('stdDeviation', '3.2');
            anchorEl.style.opacity = '0';
            
            if (elapsed >= EMPTY_MS) startCreate();

        } else if (phase === 'create') {
            const t = Math.min(elapsed / CREATE_MS, 1);
            const eased = easeOutBack(t);
            
            // Crystallize: scale goes from 100 down to 3
            const scaleVal = 100 - eased * 97;
            filterDisp.setAttribute('scale', scaleVal.toString());
            
            if (filterBlur) {
                const blurVal = 3.2 - eased * 2.8; // blur goes down to 0.4
                filterBlur.setAttribute('stdDeviation', blurVal.toString());
            }
            
            // Fade in and lift up to position
            anchorEl.style.opacity = eased.toString();
            anchorEl.style.transform = `translateY(${-12 + eased * 12}px)`;

            if (t >= 1) {
                phase = 'idle';
                
                // Turn off filter during idle for performance and legibility
                anchorEl.style.filter = 'none';
                filterDisp.setAttribute('scale', '0');
                if (filterBlur) filterBlur.setAttribute('stdDeviation', '0');
                anchorEl.style.transform = 'translateY(0)';
                anchorEl.style.opacity = '1';
                
                if (ctx) ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
                
                phaseStart = performance.now();
                scheduleNextCycle();
            }
        }
    }

    // ─── RENDER ───────────────────────────────────────────────
    function render(ts) {
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        // Draw green dripping slime drops in the canvas
        if (particles.length > 0) {
            // Apply standard gooey shadow layer for drops
            ctx.save();
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 10;
            ctx.fillStyle = 'rgba(17, 212, 131, 0.9)';

            particles.forEach(p => {
                if (p.alpha > 0.01 && p.y < CANVAS_H) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * p.alpha, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.restore();
        }
    }

    // ─── EASING ──────────────────────────────────────────────
    function easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    // ─── BOOT ─────────────────────────────────────────────────
    function tryInit() {
        const el = document.getElementById('liquid-text');
        const disp = document.getElementById('vanta-slime-displacement');
        if (!el || !disp) { setTimeout(tryInit, 200); return; }
        init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }

})();
