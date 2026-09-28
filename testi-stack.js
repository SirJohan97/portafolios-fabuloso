/* =============================================================
   VANTA STUDIO — TESTIMONIALS STACKABLE SWIPE DECK & AVATAR 3D TILT
   Táctil, orgánico, sin fricción ni tipeo
   ============================================================= */

(function () {
    'use strict';

    /* =============================================================
       1. STACKABLE SWIPE DECK TESTIMONIALS & PINNED SCROLLYTELLING
       ============================================================= */
    function initTestiStack() {
        const stage = document.getElementById('testiStackStage');
        if (!stage) return;

        let cards = Array.from(stage.querySelectorAll('.testi-stack-card'));
        if (!cards.length) return;

        const nextBtn = document.getElementById('testiNextBtn');
        const prevBtn = document.getElementById('testiPrevBtn');
        const dots = document.querySelectorAll('.testi-dot');
        const testiSection = document.getElementById('testimonials');

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let activeCard = null;
        let isAnimating = false;

        let testiST = null;
        let testiTl = null;
        let currentActiveCardIdx = 0;

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
                currentActiveCardIdx = activeOriginalIndex;
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

            if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.playChirp === 'function') {
                window.VANTA_AUDIO.playChirp(0.3, 560);
            }

            setTimeout(() => {
                cards.push(cards.shift());
                updateStackPositions(true);
                isAnimating = false;
            }, 350);
        }

        function prevCard() {
            if (isAnimating || !cards.length) return;
            isAnimating = true;

            const lastCard = cards.pop();
            cards.unshift(lastCard);

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

        function scrollToCard(idx) {
            if (!testiST) return;
            const targets = [0.14, 0.54, 0.92];
            const targetP = targets[idx] !== undefined ? targets[idx] : 0.14;
            const targetScroll = testiST.start + targetP * (testiST.end - testiST.start);
            if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                window.lenis.scrollTo(targetScroll, { duration: 0.9 });
            } else {
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }
        }

        function setupDesktopScrolly() {
            if (testiST) {
                testiST.kill();
                testiST = null;
            }
            if (testiTl) {
                testiTl.kill();
                testiTl = null;
            }

            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || window.innerWidth <= 991) {
                cards.forEach(card => {
                    gsap.set(card, { clearProps: "all" });
                });
                updateStackPositions(false);
                return;
            }

            if (!testiSection) return;

            // Make sure cards are ordered by data-index 0, 1, 2
            cards.sort((a, b) => {
                return parseInt(a.getAttribute('data-index') || '0', 10) - parseInt(b.getAttribute('data-index') || '0', 10);
            });

            cards.forEach(c => {
                c.style.transition = 'none';
            });

            const card0 = cards[0];
            const card1 = cards[1];
            const card2 = cards[2];
            if (!card0 || !card1 || !card2) return;

            gsap.set(card0, { x: 0, y: 0, scale: 1, rotationZ: 0, opacity: 1, zIndex: 10 });
            gsap.set(card1, { x: 0, y: 18, scale: 0.95, rotationZ: 2, opacity: 0.85, zIndex: 8 });
            gsap.set(card2, { x: 0, y: 36, scale: 0.90, rotationZ: -2, opacity: 0.65, zIndex: 6 });

            testiTl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

            // ACTO 1: Dwell en Card 0 (0.00 a 2.80)
            testiTl.to({}, { duration: 2.80 });

            // ACTO 2: Glide Card 0 -> Card 1 (2.80 a 4.40)
            testiTl.to(card0, { x: 540, y: -25, rotationZ: 20, opacity: 0, scale: 0.90, duration: 1.60 }, 2.80)
                   .to(card1, { y: 0, scale: 1, rotationZ: 0, opacity: 1, zIndex: 10, duration: 1.60 }, 2.80)
                   .to(card2, { y: 18, scale: 0.95, rotationZ: 2, opacity: 0.85, zIndex: 8, duration: 1.60 }, 2.80);

            // ACTO 3: Dwell en Card 1 (4.40 a 6.80)
            testiTl.to({}, { duration: 2.40 }, 4.40);

            // ACTO 4: Glide Card 1 -> Card 2 (6.80 a 8.40)
            testiTl.to(card1, { x: -540, y: -25, rotationZ: -20, opacity: 0, scale: 0.90, duration: 1.60 }, 6.80)
                   .to(card2, { y: 0, scale: 1, rotationZ: 0, opacity: 1, zIndex: 10, duration: 1.60 }, 6.80);

            // ACTO 5: Dwell en Card 2 (8.40 a 10.00)
            testiTl.to({}, { duration: 1.60 }, 8.40);

            let lastReportedIdx = 0;
            testiST = ScrollTrigger.create({
                trigger: testiSection,
                pin: true,
                start: "top top",
                end: "+=160%",
                scrub: 0.85,
                animation: testiTl,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onEnter: () => {
                    if (window.setVantaTheme) {
                        window.setVantaTheme({ id: 'testimonials', num: '05', name: 'REPORTES', primary: '#a78bfa', r: 167, g: 139, b: 250 });
                    }
                },
                onEnterBack: () => {
                    if (window.setVantaTheme) {
                        window.setVantaTheme({ id: 'testimonials', num: '05', name: 'REPORTES', primary: '#a78bfa', r: 167, g: 139, b: 250 });
                    }
                },
                onUpdate: (self) => {
                    const p = self.progress;
                    let currentIdx = 0;
                    if (p < 0.36) {
                        currentIdx = 0;
                    } else if (p < 0.74) {
                        currentIdx = 1;
                    } else {
                        currentIdx = 2;
                    }

                    currentActiveCardIdx = currentIdx;
                    dots.forEach((dot, idx) => {
                        dot.classList.toggle('active', idx === currentIdx);
                    });

                    if (currentIdx !== lastReportedIdx) {
                        lastReportedIdx = currentIdx;
                        if (window.VANTA_AUDIO && typeof window.VANTA_AUDIO.playChirp === 'function') {
                            window.VANTA_AUDIO.playChirp((currentIdx - 1) * 0.4, 480 + currentIdx * 70);
                        }
                    }
                }
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

            if (window.innerWidth <= 991) {
                activeCard.style.transition = 'none';
                activeCard.style.cursor = 'grabbing';
            }
            try { activeCard.setPointerCapture(e.pointerId); } catch(err) {}
        });

        stage.addEventListener('pointermove', (e) => {
            if (!isDragging || !activeCard) return;

            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            if (window.innerWidth <= 991) {
                const rotate = currentX * 0.06;
                activeCard.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotate}deg)`;
            }
        });

        function endDrag(e) {
            if (!isDragging || !activeCard) return;
            isDragging = false;

            if (e && e.pointerId && activeCard.releasePointerCapture) {
                try { activeCard.releasePointerCapture(e.pointerId); } catch (err) {}
            }

            if (window.innerWidth > 991 && testiST) {
                if (currentX < -70) {
                    scrollToCard(Math.min(2, currentActiveCardIdx + 1));
                } else if (currentX > 70) {
                    scrollToCard(Math.max(0, currentActiveCardIdx - 1));
                }
            } else {
                activeCard.style.cursor = 'grab';
                if (Math.abs(currentX) > 90) {
                    throwCard(currentX > 0 ? 1 : -1);
                } else {
                    activeCard.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    activeCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
                }
            }

            activeCard = null;
        }

        stage.addEventListener('pointerup', endDrag);
        stage.addEventListener('pointercancel', endDrag);

        // Buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.innerWidth > 991 && testiST) {
                    if (currentActiveCardIdx < 2) {
                        scrollToCard(currentActiveCardIdx + 1);
                    } else {
                        scrollToCard(2);
                    }
                } else {
                    throwCard(1);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.innerWidth > 991 && testiST) {
                    if (currentActiveCardIdx > 0) {
                        scrollToCard(currentActiveCardIdx - 1);
                    } else {
                        scrollToCard(0);
                    }
                } else {
                    prevCard();
                }
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.innerWidth > 991 && testiST) {
                    scrollToCard(idx);
                }
            });
        });

        // Initial setup
        setupDesktopScrolly();

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setupDesktopScrolly();
            }, 200);
        }, { passive: true });

        console.log('[VANTA] Testimonials Stackable Swipe Deck & Scrollytelling OK');
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
