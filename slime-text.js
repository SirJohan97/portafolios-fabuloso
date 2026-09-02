/* =============================================================
   KINETIC FLUID ROTATOR — VANTA Hero Subtitle Engine
   Transitions keywords smoothly with high legibility and zero artifacts
   ============================================================= */
(function initKineticRotator() {
    'use strict';

    const WORDS = [
        'APLICACIONES WEB & SAAS',
        'COMPUTER VISION & EDGE AI',
        'CIBERSEGURIDAD OFENSIVA',
        'AGENTES AUTÓNOMOS CON IA',
        'SISTEMAS DISTRIBUIDOS',
        'DESPLIEGUES ZERO-TRUST'
    ];

    let wordIdx = 0;
    let anchorEl = null;
    let intervalId = null;

    function transitionWord() {
        if (!anchorEl) return;
        
        anchorEl.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, filter 0.35s ease';
        anchorEl.style.transform = 'translateY(-10px)';
        anchorEl.style.opacity = '0';
        anchorEl.style.filter = 'blur(4px)';

        setTimeout(() => {
            wordIdx = (wordIdx + 1) % WORDS.length;
            anchorEl.textContent = WORDS[wordIdx];
            
            anchorEl.style.transition = 'none';
            anchorEl.style.transform = 'translateY(10px)';
            anchorEl.style.opacity = '0';
            anchorEl.style.filter = 'blur(4px)';

            void anchorEl.offsetWidth;

            anchorEl.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, filter 0.45s ease';
            anchorEl.style.transform = 'translateY(0)';
            anchorEl.style.opacity = '1';
            anchorEl.style.filter = 'blur(0)';
        }, 360);
    }

    function init() {
        anchorEl = document.getElementById('liquid-text');
        if (!anchorEl) return;

        anchorEl.textContent = WORDS[0];
        anchorEl.style.display = 'inline-block';
        anchorEl.style.willChange = 'transform, opacity, filter';
        anchorEl.style.color = '#11D483';
        anchorEl.style.fontWeight = '700';
        anchorEl.style.textShadow = '0 0 16px rgba(17, 212, 131, 0.4)';

        const oldCanvas = document.getElementById('slime-canvas');
        if (oldCanvas) oldCanvas.remove();

        intervalId = setInterval(transitionWord, 3200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
