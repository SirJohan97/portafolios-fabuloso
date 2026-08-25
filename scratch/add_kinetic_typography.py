import os

# 1. Update script.js with Viewport Auto-Sleep Engine
with open('script.js', 'r', encoding='utf-8') as f:
    s = f.read()

old_sleep_block = """        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            } else {
                if (!animationFrameId) {
                    animate();
                }
            }
        });"""

new_sleep_block = """        // Viewport Auto-Sleep Engine (Zero GPU usage when off-screen)
        let isSceneVisible = true;
        if ('IntersectionObserver' in window && container) {
            const sceneObserver = new IntersectionObserver((entries) => {
                isSceneVisible = entries[0].isIntersecting;
                if (!isSceneVisible && animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                } else if (isSceneVisible && !animationFrameId && !document.hidden) {
                    animate();
                }
            }, { threshold: 0.01 });
            sceneObserver.observe(container);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            } else {
                if (!animationFrameId && isSceneVisible) {
                    animate();
                }
            }
        });"""

if old_sleep_block in s:
    s = s.replace(old_sleep_block, new_sleep_block)
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(s)
    print('SUCCESS: Updated script.js with Viewport Auto-Sleep Engine!')
else:
    print('ERROR: old_sleep_block not found in script.js')

# 2. Add Kinetic Typography to effects.js
with open('effects.js', 'r', encoding='utf-8') as f:
    e = f.read()

kinetic_code = """    /* ============================================================
       0. HERO KINETIC VARIABLE TYPOGRAPHY ENGINE (AWWWARDS 2026)
       ============================================================ */
    (function initHeroKineticTypography() {
        const titleGroup = document.querySelector('.hero-title-group');
        if (!titleGroup || window.matchMedia('(pointer: coarse)').matches) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isHovered = false;

        const titles = titleGroup.querySelectorAll('.hero-title-main');

        titleGroup.addEventListener('mouseenter', () => { isHovered = true; });
        titleGroup.addEventListener('mousemove', (e) => {
            const rect = titleGroup.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        });
        titleGroup.addEventListener('mouseleave', () => {
            isHovered = false;
            mouseX = 0;
            mouseY = 0;
        });

        function kineticLoop() {
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;

            if (Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001 || isHovered) {
                titles.forEach((t, i) => {
                    const depth = (i + 1) * 6;
                    const rotY = currentX * 7;
                    const rotX = -currentY * 5;
                    t.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translate3d(${currentX * depth}px, ${currentY * (depth * 0.5)}px, 0)`;
                });
            } else {
                titles.forEach(t => {
                    t.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translate3d(0, 0, 0)';
                });
            }
            requestAnimationFrame(kineticLoop);
        }
        kineticLoop();
    })();

"""

target_marker = "function initEffectsScript() {"
if target_marker in e and "initHeroKineticTypography" not in e:
    e = e.replace(target_marker, target_marker + "\n" + kinetic_code)
    with open('effects.js', 'w', encoding='utf-8') as f:
        f.write(e)
    print('SUCCESS: Added Hero Kinetic Typography to effects.js!')
else:
    print('NOTE: target_marker already updated or not found')
