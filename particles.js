/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   SISTEMA DE PARTÍCULAS — Réplica estilo Google Antigravity  ║
 * ║   Partículas tipo confetti que flotan continuamente,         ║
 * ║   con repulsión suave al pasar el cursor.                    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  ÍNDICE DE CONFIGURACIÓN (todas las variables calibrables):
 *  ── Cantidad y tamaño          → CONFIG.COUNT, STROKE_LEN_*
 *  ── Velocidad idle             → CONFIG.SPEED_*
 *  ── Repulsión del cursor       → CONFIG.REPULSION_*
 *  ── Colores                    → CONFIG.COLORS
 */

(function () {
    'use strict'; 

    /* ══════════════════════════════════════════════════════════════
       1. CONFIGURACIÓN
       ══════════════════════════════════════════════════════════════ */
    const CONFIG = {

        // ── Cantidad de partículas ────────────────────────────────
        COUNT: 220,          // Número de partículas (más = más denso)

        // ── Velocidad de deriva en idle ───────────────────────────
        // Cada partícula tiene su propia velocidad aleatoria dentro
        // de este rango. El movimiento es continuo y nunca para.
        // ↑ Sube SPEED_MAX para un efecto más energético.
        SPEED_MIN: 0.18,    // Velocidad mínima de deriva (px/frame)
        SPEED_MAX: 0.55,    // Velocidad máxima de deriva (px/frame)

        // ── Tamaño de los trazos (confetti) ───────────────────────
        STROKE_LEN_MIN: 4,   // Longitud mínima del trazo (px)
        STROKE_LEN_MAX: 11,  // Longitud máxima del trazo (px)
        STROKE_WIDTH:   1.5, // Grosor de línea (px)

        // ── Repulsión del cursor ───────────────────────────────────
        REPULSION_RADIUS: 130,  // px: radio de influencia del cursor
        REPULSION_FORCE:  3.5,  // Fuerza máxima del empuje

        // ── Fricción aplicada a la velocidad de repulsión ─────────
        // (No afecta la velocidad idle, solo el exceso por repulsión)
        FRICTION: 0.92,

        // ── Colores (paleta estilo el portafolio pero vibrante) ───
        // Añade o quita colores a tu gusto.
        COLORS: [
            '#27ae60',   // verde primario
            '#2ecc71',   // verde claro
            '#1abc9c',   // teal
            '#16a085',   // teal oscuro
            '#52c788',   // verde menta
            '#a8edcc',   // verde muy claro
            '#ffffff',   // blanco (acento)
            '#85e0a3',   // menta suave
        ],

        // ── Opacidad de cada partícula (aleatorio entre estos) ────
        ALPHA_MIN: 0.35,
        ALPHA_MAX: 0.85,
    };

    /* ══════════════════════════════════════════════════════════════
       2. CANVAS
       ══════════════════════════════════════════════════════════════ */
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particle-canvas';
    canvas.style.cssText = [
        'position:fixed', 'top:0', 'left:0',
        'width:100%', 'height:100%',
        'pointer-events:none',
        'z-index:0',
        'display:block',
    ].join(';');
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    /* ══════════════════════════════════════════════════════════════
       3. CURSOR
       ══════════════════════════════════════════════════════════════ */
    const mouse = { x: -9999, y: -9999 };
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    /* ══════════════════════════════════════════════════════════════
       4. CLASE PARTICLE
       ══════════════════════════════════════════════════════════════
       Cada partícula es un trazo corto (confetti) que:
       – Nace en una posición aleatoria de la pantalla
       – Se mueve en una dirección aleatoria a velocidad constante
       – Al salir de la pantalla, renace en el borde opuesto (wrap)
       – Si el cursor se acerca, es empujada en dirección opuesta    */

    class Particle {
        constructor() {
            this.reset(true);
        }

        /**
         * Inicializa o reinicia la partícula.
         * @param {boolean} scatter - Si true, coloca la partícula en
         *   cualquier punto de la pantalla (inicio). Si false, la
         *   hace nacer en un borde aleatorio (reentrada tras salir).
         */
        reset(scatter = false) {
            if (scatter) {
                // Posición inicial aleatoria en toda la pantalla
                this.x = Math.random() * W;
                this.y = Math.random() * H;
            } else {
                // Reentrada por un borde aleatorio
                const edge = Math.floor(Math.random() * 4);
                if (edge === 0) { this.x = Math.random() * W; this.y = -10; }
                if (edge === 1) { this.x = W + 10;             this.y = Math.random() * H; }
                if (edge === 2) { this.x = Math.random() * W; this.y = H + 10; }
                if (edge === 3) { this.x = -10;                this.y = Math.random() * H; }
            }

            // ─── Velocidad de deriva aleatoria ───────────────────────────
            // Ángulo aleatorio → dirección de movimiento idle
            const angle    = Math.random() * Math.PI * 2;
            const speed    = CONFIG.SPEED_MIN + Math.random() * (CONFIG.SPEED_MAX - CONFIG.SPEED_MIN);
            this.driftVx   = Math.cos(angle) * speed;   // Velocidad idle X
            this.driftVy   = Math.sin(angle) * speed;   // Velocidad idle Y

            // Exceso de velocidad por repulsión (se amortigua con FRICTION)
            this.pushVx = 0;
            this.pushVy = 0;

            // ─── Apariencia ──────────────────────────────────────────────
            // Ángulo de rotación del trazo (visual, no afecta movimiento)
            this.angle     = Math.random() * Math.PI * 2;
            // Ligera rotación continua para dar vida
            this.spin      = (Math.random() - 0.5) * 0.03;
            // Longitud del trazo confetti
            this.len       = CONFIG.STROKE_LEN_MIN
                           + Math.random() * (CONFIG.STROKE_LEN_MAX - CONFIG.STROKE_LEN_MIN);
            // Color y opacidad fijos para esta partícula
            this.color     = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)];
            this.alpha     = CONFIG.ALPHA_MIN + Math.random() * (CONFIG.ALPHA_MAX - CONFIG.ALPHA_MIN);
        }

        update() {
            // ─── Repulsión del cursor ─────────────────────────────────────
            const dx   = this.x - mouse.x;   // Vector partícula → cursor
            const dy   = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.REPULSION_RADIUS && dist > 0) {
                // Fuerza proporcional a la cercanía (mayor cuanto más cerca)
                const intensity = (CONFIG.REPULSION_RADIUS - dist) / CONFIG.REPULSION_RADIUS;
                const force     = intensity * CONFIG.REPULSION_FORCE;
                // El empuje va en la dirección partícula→afuera (dx/dy ya apunta away)
                this.pushVx += (dx / dist) * force;
                this.pushVy += (dy / dist) * force;
            }

            // ─── Amortiguación del exceso de velocidad ───────────────────
            this.pushVx *= CONFIG.FRICTION;
            this.pushVy *= CONFIG.FRICTION;

            // ─── Movimiento total = idle drift + empuje cursor ────────────
            this.x += this.driftVx + this.pushVx;
            this.y += this.driftVy + this.pushVy;

            // ─── Rotación visual del trazo ────────────────────────────────
            this.angle += this.spin;

            // ─── Wrap-around: si sale de pantalla, renace en el borde opuesto
            const margin = 20;
            if (this.x < -margin || this.x > W + margin ||
                this.y < -margin || this.y > H + margin) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.strokeStyle = this.color;
            ctx.lineWidth   = CONFIG.STROKE_WIDTH;
            ctx.lineCap     = 'round';

            // Traducir al centro de la partícula y rotar
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            // Dibujar el trazo centrado
            ctx.beginPath();
            ctx.moveTo(-this.len / 2, 0);
            ctx.lineTo( this.len / 2, 0);
            ctx.stroke();

            ctx.restore();
        }
    }

    /* ══════════════════════════════════════════════════════════════
       5. INICIALIZACIÓN
       ══════════════════════════════════════════════════════════════ */
    let particles = [];

    function initParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.COUNT; i++) {
            particles.push(new Particle());
        }
    }

    /* ══════════════════════════════════════════════════════════════
       6. RESIZE
       ══════════════════════════════════════════════════════════════ */
    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W;
        canvas.height = H;
        initParticles();
    }, { passive: true });

    /* ══════════════════════════════════════════════════════════════
       7. BUCLE DE ANIMACIÓN
       ══════════════════════════════════════════════════════════════ */
    function animate() {
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }

    /* ══════════════════════════════════════════════════════════════
       8. ARRANQUE
       ══════════════════════════════════════════════════════════════ */
    initParticles();
    requestAnimationFrame(animate);

})();
