import os

with open('script.js', 'r', encoding='utf-8') as f:
    s = f.read()

# 1. Ensure portfolioTop and portfolioHeight are declared early and cached
# Let's search for the start of script.js after 'DOMContentLoaded' or window.addEventListener('load')

old_cursor_block = """    /* =========================================
       5. CURSOR PERSONALIZADO Y VARIABLES GLOBALES (GPU ACCELERATED)
       ========================================= */
    const cursor  = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');

    // Capturar coordenadas globales del mouse y setear variables CSS
    document.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });"""

new_cursor_block = """    /* =========================================
       5. CURSOR PERSONALIZADO Y VARIABLES GLOBALES (GPU ACCELERATED)
       ========================================= */
    const cursor  = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');

    // Variables compartidas de layout para evitar lecturas de DOM desincronizadas
    let portfolioTop = 0;
    let portfolioHeight = 0;
    let maxTranslate = 0;"""

if old_cursor_block in s:
    s = s.replace(old_cursor_block, new_cursor_block)
    print('SUCCESS: Removed global --mouse-x DOM invalidation and declared portfolioTop early!')
else:
    print('ERROR: old_cursor_block not found')

# 2. Optimize cursor rendering loop in script.js
old_cursor_render = """        function renderCursor() {
            if (document.hidden || !isCursorRunning) return;
            const diff1X = mouseX - c1X;
            const diff1Y = mouseY - c1Y;
            const diff2X = mouseX - c2X;
            const diff2Y = mouseY - c2Y;

            c1X += diff1X * 0.17;
            c1Y += diff1Y * 0.17;
            c2X += diff2X * 0.8;
            c2Y += diff2Y * 0.8;

            cursor.style.transform = `translate3d(calc(${c1X}px - 50%), calc(${c1Y}px - 50%), 0)`;
            cursor2.style.transform = `translate3d(calc(${c2X}px - 50%), calc(${c2Y}px - 50%), 0)`;

            if (Math.abs(diff1X) < 0.1 && Math.abs(diff1Y) < 0.1 && Math.abs(diff2X) < 0.1 && Math.abs(diff2Y) < 0.1) {
                isCursorRunning = false;
                cursorRafId = null;
            } else {
                cursorRafId = requestAnimationFrame(renderCursor);
            }
        }"""

new_cursor_render = """        function renderCursor() {
            if (document.hidden || !isCursorRunning) return;
            const diff1X = mouseX - c1X;
            const diff1Y = mouseY - c1Y;
            const diff2X = mouseX - c2X;
            const diff2Y = mouseY - c2Y;

            c1X += diff1X * 0.22;
            c1Y += diff1Y * 0.22;
            c2X += diff2X * 0.85;
            c2Y += diff2Y * 0.85;

            cursor.style.transform = `translate3d(${c1X}px, ${c1Y}px, 0)`;
            cursor2.style.transform = `translate3d(${c2X}px, ${c2Y}px, 0)`;

            if (Math.abs(diff1X) < 0.05 && Math.abs(diff1Y) < 0.05 && Math.abs(diff2X) < 0.05 && Math.abs(diff2Y) < 0.05) {
                isCursorRunning = false;
                cursorRafId = null;
            } else {
                cursorRafId = requestAnimationFrame(renderCursor);
            }
        }"""

if old_cursor_render in s:
    s = s.replace(old_cursor_render, new_cursor_render)
    print('SUCCESS: Optimized cursor render loop with direct hardware transforms!')
else:
    print('ERROR: old_cursor_render not found')

# 3. Fix 3D scene animation loop & waves freeze in init3DCore
old_3d_loop_block = """        // Viewport Auto-Sleep Engine (Zero GPU usage when off-screen)
        let isSceneVisible = true;
        const heroSectionEl = document.getElementById('home');
        const portfolioSectionEl = document.getElementById('portfolio');
        let heroInView = true;
        let portfolioInView = false;

        function checkSceneActive() {
            const shouldBeActive = (heroInView || portfolioInView) && !document.hidden;
            if (shouldBeActive !== isSceneVisible) {
                isSceneVisible = shouldBeActive;
                if (!isSceneVisible && animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                } else if (isSceneVisible && !animationFrameId) {
                    animate();
                }
            }
        }

        if ('IntersectionObserver' in window) {
            if (heroSectionEl) {
                new IntersectionObserver((entries) => {
                    heroInView = entries[0].isIntersecting;
                    checkSceneActive();
                }, { threshold: 0.01 }).observe(heroSectionEl);
            }
            if (portfolioSectionEl) {
                new IntersectionObserver((entries) => {
                    portfolioInView = entries[0].isIntersecting;
                    checkSceneActive();
                }, { threshold: 0.01 }).observe(portfolioSectionEl);
            }
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
        });

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            if (document.hidden) return;"""

new_3d_loop_block = """        // Gestor de ciclo de vida 3D (Se ejecuta continuamente en pestaña activa)
        document.addEventListener('visibilitychange', () => {
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
        });

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            if (document.hidden) return;"""

if old_3d_loop_block in s:
    s = s.replace(old_3d_loop_block, new_3d_loop_block)
    print('SUCCESS: Fixed 3D scene animation loop so waves never freeze!')
else:
    print('ERROR: old_3d_loop_block not found')

# 4. Remove duplicate `let portfolioTop = 0; let portfolioHeight = 0; let maxTranslate = 0;` at line 2834
old_dup_portfolio = """    // Cache de dimensiones para evitar getBoundingClientRect en scroll
    let portfolioTop = 0;
    let portfolioHeight = 0;
    let maxTranslate = 0;"""

new_dup_portfolio = """    // Cache de dimensiones para evitar getBoundingClientRect en scroll (ya declaradas en scope global)"""

if old_dup_portfolio in s:
    s = s.replace(old_dup_portfolio, new_dup_portfolio)
    print('SUCCESS: Removed duplicate portfolio variable declarations!')
else:
    print('NOTE: old_dup_portfolio not found or already replaced')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(s)
