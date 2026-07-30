import os

with open('effects.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Locate riverStart block
river_start_idx = c.find('// ─── PHASE 3: The River Slam')
if river_start_idx != -1:
    river_end_idx = c.find('// ─── Hover & Click Interactions', river_start_idx)
    if river_end_idx != -1:
        old_river_block = c[river_start_idx:river_end_idx]
        new_river_block = """// ─── PHASE 3: The River Slam — VANTA Master Card ─────────────
            const riverStart = 0.30 + dealSequence.length * DEAL_SPACING + 0.40;

            if (masterCard) {
                const inner = masterCard.querySelector('.poker-card-inner');

                // Master card: ascends smoothly from deck to floating hero position
                tl.to(masterCard, {
                    y: -240, scale: 1.55, opacity: 1,
                    duration: 0.50, ease: "power3.out"
                }, riverStart);

                // Hold in air with subtle floating drift (suspense beat)
                tl.to(masterCard, {
                    y: -255, scale: 1.60,
                    duration: 0.35, ease: "sine.inOut"
                }, riverStart + 0.50);

                // Flip face-up while hovering majestically
                if (inner) {
                    tl.to(inner, { rotateY: 90,  duration: 0.30, ease: "power2.in"  }, riverStart + 0.40);
                    tl.to(inner, { rotateY: 180, duration: 0.30, ease: "power2.out" }, riverStart + 0.70);
                }

                // Heavy gravity slam DOWN onto center of felt
                tl.to(masterCard, {
                    x: 0, y: 0,
                    scale: 1.05,
                    rotationZ: 0,
                    duration: 0.45,
                    ease: "power4.in"
                }, riverStart + 0.85);

                // Landing: heavy compress + dramatic elastic expansion
                tl.to(masterCard, { scaleY: 0.75, scaleX: 1.12, duration: 0.09, ease: "power4.in" }, riverStart + 1.30);
                tl.to(masterCard, { scaleY: 1.0,  scaleX: 1.0,  duration: 0.45, ease: "elastic.out(1.2, 0.48)" }, riverStart + 1.39);

                // Shockwave + shake + bass boom
                tl.call(() => {
                    spawnMasterFeltShockwave();
                    triggerScreenShake();
                    playTick(220, 0.35);
                    setTimeout(() => playTick(880, 0.15), 80);
                }, null, riverStart + 1.31);
            }

            """
        c = c[:river_start_idx] + new_river_block + c[river_end_idx:]
        with open('effects.js', 'w', encoding='utf-8') as f:
            f.write(c)
        print('SUCCESS: Updated Master River Card slam timing!')
    else:
        print('ERROR: river_end_idx not found')
else:
    print('ERROR: river_start_idx not found')
