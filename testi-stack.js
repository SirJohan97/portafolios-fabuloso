/* =============================================================
   VANTA STUDIO — TESTIMONIALS STACKABLE SWIPE DECK & AVATAR 3D TILT
   Táctil, orgánico, sin fricción ni tipeo
   ============================================================= */

(function () {
    'use strict';

    /* =============================================================
       1. STACKABLE SWIPE DECK — INTERACTIVE TESTIMONIALS
       ============================================================= */
    function initTestiStack() {
        const stage = document.getElementById('testiStackStage');
        if (!stage) return;

        let cards = Array.from(stage.querySelectorAll('.testi-stack-card'));
        const prevBtn = document.getElementById('testiPrevBtn');
        const nextBtn = document.getElementById('testiNextBtn');
        const dots = document.querySelectorAll('#testiDots .testi-dot');

        if (!cards.length) return;

        let isAnimating = false;
        let isDragging = false;
        let isTouchMode = false;
        let gestureLocked = null; // null | 'horizontal' | 'vertical'
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let activeCard = null;
        let activePointerId = null;

        function updateStackPositions(animate = true) {
            cards.forEach((card, i) => {
                card.style.transition = animate ? 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
                
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
            if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.playChirp === 'function') {
                window.VANTA_AUDIO.playChirp(direction * 0.3, 560);
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

            if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.playChirp === 'function') {
                window.VANTA_AUDIO.playChirp(-0.3, 520);
            }

            requestAnimationFrame(() => {
                updateStackPositions(true);
                setTimeout(() => {
                    isAnimating = false;
                }, 400);
            });
        }

        // Pointer event handlers with mobile vertical scroll discrimination
        stage.addEventListener('pointerdown', (e) => {
            if (isAnimating) return;
            activeCard = cards[0];
            if (!activeCard) return;

            activePointerId = e.pointerId;
            isTouchMode = (e.pointerType === 'touch' || window.innerWidth <= 900);
            gestureLocked = null;
            startX = e.clientX;
            startY = e.clientY;
            currentX = 0;
            currentY = 0;

            if (!isTouchMode) {
                // PC / Mouse: drag inmediato 2D
                isDragging = true;
                activeCard.style.transition = 'none';
                activeCard.style.cursor = 'grabbing';
                try { activeCard.setPointerCapture(e.pointerId); } catch(err) {}
            } else {
                // Móvil / Touch: NO capturar pointer todavía.
                // Permitir que el navegador mida la dirección para scroll vertical natural.
                isDragging = false;
            }
        });

        stage.addEventListener('pointermove', (e) => {
            if (!activeCard) return;

            if (!isTouchMode) {
                // Modo PC: Reacciona con libertad a movimientos en X e Y
                if (!isDragging) return;
                currentX = e.clientX - startX;
                currentY = e.clientY - startY;

                const rotate = currentX * 0.06; // tilt proportional to drag
                activeCard.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotate}deg)`;
                return;
            }

            // Modo Móvil táctil:
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (!gestureLocked) {
                const distance = Math.hypot(deltaX, deltaY);
                if (distance < 8) return; // Umbral de 8px antes de clasificar el gesto

                if (Math.abs(deltaY) >= Math.abs(deltaX)) {
                    // Intención vertical: el usuario quiere hacer scroll en la página
                    gestureLocked = 'vertical';
                    isDragging = false;
                    activeCard = null;
                    activePointerId = null;
                    return; // Dejar que el scroll del navegador fluya sin bloquear
                } else {
                    // Intención horizontal: el usuario quiere deslizar la tarjeta
                    gestureLocked = 'horizontal';
                    isDragging = true;
                    activeCard.style.transition = 'none';
                    try { activeCard.setPointerCapture(e.pointerId); } catch(err) {}
                }
            }

            if (gestureLocked === 'horizontal' && isDragging) {
                // Solo reacciona a movimientos laterales en móvil
                currentX = deltaX;
                currentY = 0; // Y se mantiene rígidamente en 0
                const rotate = currentX * 0.05;
                activeCard.style.transform = `translate3d(${currentX}px, 0, 0) rotate(${rotate}deg)`;
            }
        });

        function endDrag(e) {
            if (!activeCard) {
                isDragging = false;
                gestureLocked = null;
                activePointerId = null;
                return;
            }

            const card = activeCard;
            const wasDragging = isDragging;
            const pointerId = activePointerId || (e ? e.pointerId : null);

            isDragging = false;
            gestureLocked = null;
            activeCard = null;
            activePointerId = null;

            card.style.cursor = 'grab';
            if (pointerId && card.releasePointerCapture) {
                try { card.releasePointerCapture(pointerId); } catch (err) {}
            }

            if (!wasDragging) return;

            // Umbral de disparo: 70px en táctil móvil, 90px en PC
            const threshold = isTouchMode ? 70 : 90;
            if (Math.abs(currentX) > threshold) {
                throwCard(currentX > 0 ? 1 : -1);
            } else {
                // Snap elástico de retorno
                card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
            }
        }

        stage.addEventListener('pointerup', endDrag);
        stage.addEventListener('pointercancel', endDrag);

        // Buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                throwCard(1);
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevCard();
            });
        }

        // Dots
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                if (isAnimating) return;
                const currentIdx = parseInt(cards[0].getAttribute('data-index') || '0', 10);
                if (idx === currentIdx) return;
                let diff = (idx - currentIdx + cards.length) % cards.length;
                if (diff === 1) throwCard(1);
                else if (diff === 2) prevCard();
            });
        });

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
