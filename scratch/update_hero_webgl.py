import os

with open('script.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's inspect particleCount and particle loop in script.js
old_particle_setup = """        // 2. Configuración de 1,200 Partículas del V-Shockwave Core (Optimizado para 60 FPS)
        const particleCount = 1200; 
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const nodeData = [];             // Posiciones target de la V
        const disintegrationOffsets = []; // Offsets de disolución cíclica
        const homeDistances = new Float32Array(particleCount); // Precalculado de distancias
        
        const maxHomeRadius = 5.0;
        let shockwaves = [];             // Cola de ondas expansivas

        // Generar coordenadas tridimensionales de la V y offsets
        for (let i = 0; i < particleCount; i++) {
            let x, y, z;
            if (i < particleCount / 2) {
                // Rama izquierda de la V (t de 0 a 1)
                const t = i / (particleCount / 2);
                x = -1.3 * (1 - t);
                y = 1.9 * (1 - t) - 1.5 * t;
            } else {
                // Rama derecha de la V (t de 0 a 1)
                const t = (i - particleCount / 2) / (particleCount / 2);
                x = 1.3 * (1 - t);
                y = 1.9 * (1 - t) - 1.5 * t;
            }

            // Dispersión radial suave (grosor de trazo)
            const rOffset = Math.random() * 0.16;
            const thetaOffset = Math.random() * Math.PI * 2;
            x += Math.cos(thetaOffset) * rOffset;
            y += Math.sin(thetaOffset) * rOffset;
            z = (Math.random() - 0.5) * 0.4;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const vec = new THREE.Vector3(x, y, z);
            nodeData.push(vec);
            homeDistances[i] = vec.length() + 1e-6; // Precalcular distancia de origen

            // Colores por defecto (verde/blanco neón)
            colors[i * 3] = 0.5;
            colors[i * 3 + 1] = 1.0;
            colors[i * 3 + 2] = 0.7;

            // Offsets de disolución cíclica radiales
            const offsetStrength = 5.0 + Math.random() * 6.0;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.acos(2 * Math.random() - 1);
            disintegrationOffsets.push(new THREE.Vector3(
                Math.sin(theta) * Math.cos(phi) * offsetStrength,
                Math.sin(theta) * Math.sin(phi) * offsetStrength,
                Math.cos(theta) * offsetStrength * 0.3
            ));
        }"""

new_particle_setup = """        // 2. Configuración de 2,400 Partículas Gravitacionales de Alta Densidad (Optimizado para 60/120 FPS)
        const particleCount = 2400; 
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const nodeData = [];             // Posiciones target de la V
        const disintegrationOffsets = []; // Offsets de disolución cíclica
        const homeDistances = new Float32Array(particleCount); // Precalculado de distancias
        
        const maxHomeRadius = 5.0;
        let shockwaves = [];             // Cola de ondas expansivas

        // Generar coordenadas tridimensionales de la V y envolvente cuántica
        for (let i = 0; i < particleCount; i++) {
            let x, y, z;
            const isHalo = i >= 1800; // 600 partículas para aura de stardust ambiental

            if (isHalo) {
                // Aura estelar sutil alrededor de la V
                const ang = Math.random() * Math.PI * 2;
                const rad = 0.4 + Math.random() * 2.2;
                x = Math.cos(ang) * rad * 0.9;
                y = (Math.sin(ang) * rad * 1.1) - 0.2;
                z = (Math.random() - 0.5) * 1.2;
            } else if (i < 900) {
                // Rama izquierda de la V (t de 0 a 1)
                const t = i / 900;
                x = -1.35 * (1 - t);
                y = 1.95 * (1 - t) - 1.55 * t;
                const rOffset = Math.random() * 0.18;
                const thetaOffset = Math.random() * Math.PI * 2;
                x += Math.cos(thetaOffset) * rOffset;
                y += Math.sin(thetaOffset) * rOffset;
                z = (Math.random() - 0.5) * 0.45;
            } else {
                // Rama derecha de la V (t de 0 a 1)
                const t = (i - 900) / 900;
                x = 1.35 * (1 - t);
                y = 1.95 * (1 - t) - 1.55 * t;
                const rOffset = Math.random() * 0.18;
                const thetaOffset = Math.random() * Math.PI * 2;
                x += Math.cos(thetaOffset) * rOffset;
                y += Math.sin(thetaOffset) * rOffset;
                z = (Math.random() - 0.5) * 0.45;
            }

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const vec = new THREE.Vector3(x, y, z);
            nodeData.push(vec);
            homeDistances[i] = vec.length() + 1e-6;

            colors[i * 3] = 0.5;
            colors[i * 3 + 1] = 1.0;
            colors[i * 3 + 2] = 0.7;

            const offsetStrength = 5.0 + Math.random() * 6.0;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.acos(2 * Math.random() - 1);
            disintegrationOffsets.push(new THREE.Vector3(
                Math.sin(theta) * Math.cos(phi) * offsetStrength,
                Math.sin(theta) * Math.sin(phi) * offsetStrength,
                Math.cos(theta) * offsetStrength * 0.3
            ));
        }"""

if old_particle_setup in c:
    c = c.replace(old_particle_setup, new_particle_setup)
    print('SUCCESS: Replaced particle setup with 2,400 particle gravitational core!')
else:
    print('ERROR: old_particle_setup not found')

# Now let's update the particle loop to add gravitational cursor orbital swirl
old_loop = """                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    const home = nodeData[i];
                    const dist = homeDistances[i];

                    const waveX = Math.sin(time * waveSpeed + home.y * waveFreqY) * 0.12;
                    const waveY = Math.cos(time * waveSpeed * 0.85 + home.x * waveFreqX) * 0.08;
                    const waveZ = Math.sin(time * waveSpeed * 1.1 + (home.x + home.y) * 0.5) * 0.08;

                    const distToPulse = Math.abs(home.y - pulseCenter);
                    let pulseFactor = 0.0;
                    if (distToPulse < pulseLength) {
                        pulseFactor = Math.cos((distToPulse / pulseLength) * Math.PI * 0.5);
                    }

                    const pulseDisplace = pulseFactor * 0.07;
                    const dirX = home.x > 0 ? 1.0 : -1.0;

                    let addX = 0, addY = 0, addZ = 0;
                    for (let w = 0; w < shockwaves.length; w++) {
                        const sw = shockwaves[w];
                        const elapsed = Math.max(0, time - sw.t0);
                        const R = sw.speed * elapsed;
                        const sigma = sw.width;
                        const decayFactor = Math.exp(-sw.decay * elapsed);
                        const g = Math.exp(-((dist - R) * (dist - R)) / (2 * sigma * sigma));
                        const amp = sw.amplitude * g * decayFactor;
                        addX += (home.x / dist) * amp;
                        addY += (home.y / dist) * amp;
                        addZ += (home.z / dist) * amp * 0.5;
                    }

                    const lerpFactor = 0.085;
                    posArray[i3]     += (home.x + waveX + (dirX * pulseDisplace) + addX - posArray[i3]) * lerpFactor;
                    posArray[i3 + 1] += (home.y + waveY + addY - posArray[i3 + 1]) * lerpFactor;
                    posArray[i3 + 2] += (home.z + waveZ + addZ - posArray[i3 + 2]) * lerpFactor;

                    let bright = 0.55 + Math.sin(time * 2.2 + (i % 8)) * 0.12 + pulseFactor * 1.1;
                    colArray[i3]     = logoMaterial.color.r * bright;
                    colArray[i3 + 1] = logoMaterial.color.g * bright;
                    colArray[i3 + 2] = logoMaterial.color.b * bright;
                }"""

new_loop = """                // Cursor Gravitational Interaction Coordinates
                const mouseWorldX = (mouseX / 0.0006) * 0.004;
                const mouseWorldY = (-mouseY / 0.0006) * 0.004;

                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    const home = nodeData[i];
                    const dist = homeDistances[i];

                    const waveX = Math.sin(time * waveSpeed + home.y * waveFreqY) * 0.12;
                    const waveY = Math.cos(time * waveSpeed * 0.85 + home.x * waveFreqX) * 0.08;
                    const waveZ = Math.sin(time * waveSpeed * 1.1 + (home.x + home.y) * 0.5) * 0.08;

                    const distToPulse = Math.abs(home.y - pulseCenter);
                    let pulseFactor = 0.0;
                    if (distToPulse < pulseLength) {
                        pulseFactor = Math.cos((distToPulse / pulseLength) * Math.PI * 0.5);
                    }

                    const pulseDisplace = pulseFactor * 0.07;
                    const dirX = home.x > 0 ? 1.0 : -1.0;

                    // Micro-gravitational swirl near mouse
                    const dx = posArray[i3] - mouseWorldX;
                    const dy = posArray[i3 + 1] - mouseWorldY;
                    const mDistSq = dx * dx + dy * dy + 0.15;
                    let gravX = 0, gravY = 0;
                    if (mDistSq < 4.0) {
                        const mForce = 0.12 / mDistSq;
                        gravX = -dy * mForce * 0.8 + dx * mForce * 0.4;
                        gravY = dx * mForce * 0.8 + dy * mForce * 0.4;
                    }

                    let addX = 0, addY = 0, addZ = 0;
                    for (let w = 0; w < shockwaves.length; w++) {
                        const sw = shockwaves[w];
                        const elapsed = Math.max(0, time - sw.t0);
                        const R = sw.speed * elapsed;
                        const sigma = sw.width;
                        const decayFactor = Math.exp(-sw.decay * elapsed);
                        const g = Math.exp(-((dist - R) * (dist - R)) / (2 * sigma * sigma));
                        const amp = sw.amplitude * g * decayFactor;
                        addX += (home.x / dist) * amp;
                        addY += (home.y / dist) * amp;
                        addZ += (home.z / dist) * amp * 0.5;
                    }

                    const lerpFactor = 0.085;
                    posArray[i3]     += (home.x + waveX + (dirX * pulseDisplace) + addX + gravX - posArray[i3]) * lerpFactor;
                    posArray[i3 + 1] += (home.y + waveY + addY + gravY - posArray[i3 + 1]) * lerpFactor;
                    posArray[i3 + 2] += (home.z + waveZ + addZ - posArray[i3 + 2]) * lerpFactor;

                    let bright = 0.55 + Math.sin(time * 2.2 + (i % 8)) * 0.12 + pulseFactor * 1.1;
                    colArray[i3]     = logoMaterial.color.r * bright;
                    colArray[i3 + 1] = logoMaterial.color.g * bright;
                    colArray[i3 + 2] = logoMaterial.color.b * bright;
                }"""

if old_loop in c:
    c = c.replace(old_loop, new_loop)
    print('SUCCESS: Replaced particle loop with gravitational swirl physics!')
else:
    print('ERROR: old_loop not found')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(c)
