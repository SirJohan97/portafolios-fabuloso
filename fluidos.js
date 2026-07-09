(function () {
    'use strict';
    
    const canvas = document.getElementById('entropy-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const sizeW = 310;
    const sizeH = 150;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = sizeW * dpr;
    canvas.height = sizeH * dpr;
    canvas.style.width = sizeW + 'px';
    canvas.style.height = sizeH + 'px';
    ctx.scale(dpr, dpr);
    
    // Read active CSS variable color dynamically (Optimizado sin reflows)
    function getParticleColor() {
        return window.currentPrimaryColor || '#11d483';
    }
    
    class Particle {
        constructor(x, y, order) {
            this.x = x;
            this.y = y;
            this.originalX = x;
            this.originalY = y;
            this.size = 1.6;
            this.order = order;
            this.velocity = {
                x: (Math.random() - 0.5) * 1.5,
                y: (Math.random() - 0.5) * 1.5
            };
            this.influence = 0;
            this.neighbors = [];
        }
        
        update() {
            if (this.order) {
                const dx = this.originalX - this.x;
                const dy = this.originalY - this.y;
                
                const chaosInfluence = { x: 0, y: 0 };
                this.neighbors.forEach(neighbor => {
                    if (!neighbor.order) {
                        const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y);
                        const strength = Math.max(0, 1 - distance / 70);
                        chaosInfluence.x += (neighbor.velocity.x * strength);
                        chaosInfluence.y += (neighbor.velocity.y * strength);
                        this.influence = Math.max(this.influence, strength);
                    }
                });
                
                this.x += dx * 0.05 * (1 - this.influence) + chaosInfluence.x * this.influence;
                this.y += dy * 0.05 * (1 - this.influence) + chaosInfluence.y * this.influence;
                
                this.influence *= 0.98;
            } else {
                this.velocity.x += (Math.random() - 0.5) * 0.4;
                this.velocity.y += (Math.random() - 0.5) * 0.4;
                this.velocity.x *= 0.94;
                this.velocity.y *= 0.94;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                
                if (this.x < sizeW / 2 || this.x > sizeW) this.velocity.x *= -1;
                if (this.y < 0 || this.y > sizeH) this.velocity.y *= -1;
                this.x = Math.max(sizeW / 2, Math.min(sizeW, this.x));
                this.y = Math.max(0, Math.min(sizeH, this.y));
            }
        }
        
        draw(color) {
            const alpha = this.order ? (0.75 - this.influence * 0.45) : 0.75;
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create grid
    const particles = [];
    const gridCols = 16;
    const gridRows = 8;
    const spacingX = sizeW / gridCols;
    const spacingY = sizeH / gridRows;
    
    for (let i = 0; i < gridCols; i++) {
        for (let j = 0; j < gridRows; j++) {
            const x = spacingX * i + spacingX / 2;
            const y = spacingY * j + spacingY / 2;
            const order = x < sizeW / 2;
            particles.push(new Particle(x, y, order));
        }
    }
    
    function updateNeighbors() {
        particles.forEach(p => {
            p.neighbors = particles.filter(other => {
                if (other === p) return false;
                const distance = Math.hypot(p.x - other.x, p.y - other.y);
                return distance < 65;
            });
        });
    }
    
    // Mouse hover interaction
    const mouse = { x: -9999, y: -9999 };
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });
    
    let time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, sizeW, sizeH);
        
        if (time % 20 === 0) {
            updateNeighbors();
        }
        
        const currentColor = getParticleColor();
        
        // Repulsion to mouse
        particles.forEach(p => {
            if (mouse.x > 0 && mouse.y > 0) {
                const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (dist < 45) {
                    const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);
                    const force = (45 - dist) * 0.08;
                    p.x += Math.cos(angle) * force;
                    p.y += Math.sin(angle) * force;
                }
            }
            
            p.update();
            p.draw(currentColor);
            
            // Draw lines
            p.neighbors.forEach(n => {
                const dist = Math.hypot(p.x - n.x, p.y - n.y);
                if (dist < 32) {
                    ctx.strokeStyle = currentColor;
                    ctx.globalAlpha = 0.16 * (1 - dist / 32);
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(n.x, n.y);
                    ctx.stroke();
                }
            });
        });
        
        // Draw center division line
        ctx.strokeStyle = currentColor;
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(sizeW / 2, 0);
        ctx.lineTo(sizeW / 2, sizeH);
        ctx.stroke();
        
        time++;
        requestAnimationFrame(animate);
    }
    
    updateNeighbors();
    animate();
})();
