/* =============================================================
   VANTA STUDIO — TESTIMONIALS STACKABLE SWIPE DECK & AVATAR 3D TILT
   Táctil, orgánico, sin fricción ni tipeo
   ============================================================= */

(function () {
    'use strict';

    /* =============================================================
       1. STACKABLE SWIPE DECK TESTIMONIALS
       ============================================================= */
    function initTestiStack() {
        const stage = document.getElementById('testiStackStage');
        if (!stage) return;

        let cards = Array.from(stage.querySelectorAll('.testi-stack-card'));
        if (!cards.length) return;

        const nextBtn = document.getElementById('testiNextBtn');
        const prevBtn = document.getElementById('testiPrevBtn');
        const dots = document.querySelectorAll('.testi-dot');

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let activeCard = null;
        let isAnimating = false;

        function updateStackPositions(animate = true) {
            cards.forEach((card, i) => {
                card.style.transition = animate ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease' : 'none';
                
                if (i === 0) {
                    card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
                    card.style.opacity = '1';
                    card.style.zIndex = '10';
                    card.style.pointerEvents = 'auto';
                    card.style.cursor = 'grab';
                } else if (i === 1) {
                    card.style.transform = 'translate3d(0, 18px, -40px) scale(0.95) rotate(2deg)';
                    card.style.opacity = '0.85';
                    card.style.zIndex = '8';
                    card.style.pointerEvents = 'none';
                } else if (i === 2) {
                    card.style.transform = 'translate3d(0, 36px, -80px) scale(0.90) rotate(-2deg)';
                    card.style.opacity = '0.65';
                    card.style.zIndex = '6';
                    card.style.pointerEvents = 'none';
                } else {
                    card.style.transform = 'translate3d(0, 50px, -120px) scale(0.85) rotate(0deg)';
                    card.style.opacity = '0';
                    card.style.zIndex = '4';
                    card.style.pointerEvents = 'none';
                }
            });

            // Update dots based on active card data-index
            if (cards[0]) {
                const activeOriginalIndex = parseInt(cards[0].getAttribute('data-index') || '0', 10);
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === activeOriginalIndex);
                });
            }
        }

        function throwCard(direction) {
            if (isAnimating || !cards.length) return;
            isAnimating = true;

            const topCard = cards[0];
            topCard.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
            const throwX = direction > 0 ? (window.innerWidth * 0.7) : -(window.innerWidth * 0.7);
            const throwRotate = direction > 0 ? 25 : -25;

            topCard.style.transform = `translate3d(${throwX}px, ${currentY * 0.5}px, 0) rotate(${throwRotate}deg)`;
            topCard.style.opacity = '0';

            // Play sound if available
            if (window.VantaAudio && window.VantaAudio.playSwipe) {
                window.VantaAudio.playSwipe();
            }

            setTimeout(() => {
                // Move first card to the back
                cards.push(cards.shift());
                updateStackPositions(true);
                isAnimating = false;
            }, 350);
        }

        function prevCard() {
            if (isAnimating || !cards.length) return;
            isAnimating = true;

            // Move last card to the front
            const lastCard = cards.pop();
            cards.unshift(lastCard);

            // Start it slightly off-screen to animate in
            lastCard.style.transition = 'none';
            lastCard.style.transform = 'translate3d(-200px, -40px, 40px) scale(1.05) rotate(-10deg)';
            lastCard.style.opacity = '0';
            lastCard.style.zIndex = '12';

            requestAnimationFrame(() => {
                updateStackPositions(true);
                setTimeout(() => {
                    isAnimating = false;
                }, 400);
            });
        }

        // Pointer event handlers for the top card
        stage.addEventListener('pointerdown', (e) => {
            if (isAnimating) return;
            activeCard = cards[0];
            if (!activeCard) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            currentX = 0;
            currentY = 0;

            activeCard.style.transition = 'none';
            activeCard.style.cursor = 'grabbing';
            activeCard.setPointerCapture(e.pointerId);
        });

        stage.addEventListener('pointermove', (e) => {
            if (!isDragging || !activeCard) return;

            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            const rotate = currentX * 0.06; // tilt proportional to drag
            activeCard.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotate}deg)`;
        });

        function endDrag(e) {
            if (!isDragging || !activeCard) return;
            isDragging = false;
            activeCard.style.cursor = 'grab';

            if (e && e.pointerId && activeCard.releasePointerCapture) {
                try { activeCard.releasePointerCapture(e.pointerId); } catch (err) {}
            }

            // If dragged past threshold, throw!
            if (Math.abs(currentX) > 90) {
                throwCard(currentX > 0 ? 1 : -1);
            } else {
                // Elastic snap back
                activeCard.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                activeCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
            }

            activeCard = null;
        }

        stage.addEventListener('pointerup', endDrag);
        stage.addEventListener('pointercancel', endDrag);

        // Buttons
        if (nextBtn) nextBtn.addEventListener('click', () => throwCard(1));
        if (prevBtn) prevBtn.addEventListener('click', prevCard);

        // Initial setup
        updateStackPositions(false);
        console.log('[VANTA] Testimonials Stackable Swipe Deck OK');
    }

    /* =============================================================
       2. HEROIC AVATAR 3D PARALLAX & TACTICAL DEPTH (Robin & Gohan)
       ============================================================= */
    function initAvatarParallax() {
        const cards = document.querySelectorAll('.founder-pillar-card');
        if (!cards.length) return;

        cards.forEach((card) => {
            const img = card.querySelector('.fpc-avatar-img');
            const aura = card.querySelector('.fpc-avatar-aura');
            const codename = card.querySelector('.fpc-codename');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) - 0.5; // -0.5 to 0.5
                const y = ((e.clientY - rect.top) / rect.height) - 0.5;

                if (img) {
                    img.style.transform = `translate3d(${x * 20}px, ${y * 14}px, 30px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) scale(1.06)`;
                }
                if (aura) {
                    aura.style.transform = `translate3d(${-x * 30}px, ${-y * 20}px, 0) scale(1.2)`;
                    aura.style.opacity = '0.75';
                }
                if (codename) {
                    codename.style.transform = `translate3d(${x * 10}px, ${y * 6}px, 40px)`;
                }
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                if (img) {
                    img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                    img.style.transform = 'translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg) scale(1)';
                    setTimeout(() => { img.style.transition = ''; }, 600);
                }
                if (aura) {
                    aura.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
                    aura.style.transform = 'translate3d(0, 0, 0) scale(1)';
                    aura.style.opacity = '0.5';
                    setTimeout(() => { aura.style.transition = ''; }, 600);
                }
                if (codename) {
                    codename.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                    codename.style.transform = 'translate3d(0, 0, 0)';
                    setTimeout(() => { codename.style.transition = ''; }, 600);
                }
            });
        });

        console.log('[VANTA] Avatar 3D Parallax OK');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTestiStack();
            initAvatarParallax();
        });
    } else {
        initTestiStack();
        initAvatarParallax();
    }
})();
