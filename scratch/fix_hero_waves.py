import os

with open('script.js', 'r', encoding='utf-8') as f:
    c = f.read()

old_block = """            // Opacidad del terreno: aparece al entrar en el Hero y se mantiene en el resto
            const terrainOpacity = inHero
                ? Math.min(0.22, progress * 1.1)   // fade-in en el Hero
                : 0.22;                              // siempre visible fuera del Hero
            terrainMaterial.opacity = terrainOpacity;"""

new_block = """            // Opacidad del terreno de olas 3D: NUNCA en el Hero ni al scrollear en Hero/Filosofía.
            // Se activa únicamente al entrar al apartado "Nuestro Trabajo" (#portfolio)
            const portfolioEl = document.getElementById('portfolio');
            let terrainOpacity = 0;
            if (portfolioEl) {
                const rect = portfolioEl.getBoundingClientRect();
                const windowH = window.innerHeight;
                if (rect.top < windowH && rect.bottom > 0) {
                    // Entrando o dentro del apartado Nuestro Trabajo (#portfolio)
                    const enteringProgress = Math.min(1.0, Math.max(0, (windowH - rect.top) / (windowH * 0.6)));
                    terrainOpacity = enteringProgress * 0.22;
                } else if (rect.bottom <= 0) {
                    terrainOpacity = 0.22; // En secciones posteriores a Nuestro Trabajo
                } else {
                    terrainOpacity = 0; // Arriba de #portfolio (Hero y Filosofía) -> CERO olas
                }
            }
            terrainMaterial.opacity = terrainOpacity;"""

if old_block in c:
    c = c.replace(old_block, new_block)
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(c)
    print('SUCCESS: Updated script.js so 3D reactive waves only appear in Nuestro Trabajo section!')
else:
    print('ERROR: old_block not found in script.js')
