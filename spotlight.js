/* =============================================================
   VANTA SPOTLIGHT EFFECT
   Rastrea la posición del mouse en cada tarjeta y actualiza
   custom properties CSS --mouse-x y --mouse-y para el gradiente.
   ============================================================= */
(function() {
    'use strict';

    function initSpotlight() {
        const cards = document.querySelectorAll('.vanta-spotlight-card');
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            }, { passive: true });
        });

        console.log('[VANTA] Spotlight effect OK —', cards.length, 'cards');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSpotlight);
    } else {
        initSpotlight();
    }
})();
