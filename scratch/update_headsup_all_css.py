import os

css_perfect_styles = """/* =========================================
   REAL HEADS-UP POKER TABLE & COMPACT CARDS (CINEMATIC SCROLLYTELLING)
   ========================================= */
.poker-dealer-section {
    position: relative;
    width: 100%;
    min-height: 150vh;
    background: #030609;
    overflow: hidden;
}
.poker-dealer-section #sparkles-canvas {
    display: none !important;
}

.poker-pinned-wrapper {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    padding: 1rem 2%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
    overflow: visible;
}

/* HEADER: Scrollytelling Fade Out for Pure Table Cinema */
.poker-header {
    text-align: center;
    max-width: 780px;
    margin-bottom: 0.6rem;
    position: relative;
    z-index: 10;
    will-change: transform, opacity, filter;
}
.poker-header .section-title {
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    margin-bottom: 0.15rem;
}
.poker-header .section-subtitle {
    font-size: clamp(0.8rem, 1.1vw, 0.95rem);
    opacity: 0.85;
}

/* REAL POKER TABLE CONTAINER (EXPANDED MAJESTIC PROPORTIONS) */
.poker-table-container {
    position: relative;
    width: 100%;
    max-width: 1080px;
    height: 640px; /* Taller height for perfect card-to-felt proportion */
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
}

.poker-table-felt {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 260px;
    background: radial-gradient(ellipse at center, #0f2e21 0%, #061911 65%, #020b08 100%);
    border: 14px solid #141d27;
    box-shadow: inset 0 0 65px rgba(0, 0, 0, 0.95), 0 25px 80px rgba(0, 0, 0, 0.95), 0 0 45px rgba(17, 212, 131, 0.18);
    overflow: visible;
}

.table-border-inner {
    position: absolute;
    inset: 12px;
    border-radius: 245px;
    border: 2px solid rgba(17, 212, 131, 0.35);
    pointer-events: none;
}
.table-bet-ring {
    position: absolute;
    inset: 65px;
    border-radius: 195px;
    border: 1px dashed rgba(17, 212, 131, 0.18);
    pointer-events: none;
}
.table-pot-indicator {
    position: absolute;
    top: 72px;
    left: 50%;
    transform: translateX(-50%);
    font-family: monospace;
    font-size: 0.52rem;
    letter-spacing: 2px;
    color: rgba(240, 192, 48, 0.7);
    pointer-events: none;
}
.table-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-display);
    font-size: clamp(0.75rem, 1.2vw, 0.92rem);
    letter-spacing: 6px;
    color: rgba(17, 212, 131, 0.12);
    font-weight: 900;
    pointer-events: none;
    text-shadow: 0 0 10px rgba(17, 212, 131, 0.08);
}

/* PLAYER SEATS — OUTSIDE FELT ON OUTER LEATHER RAIL (ZERO CARDS OVERLAP) */
.player-seat {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(5, 10, 18, 0.95);
    border: 1px solid rgba(17, 212, 131, 0.4);
    padding: 0.25rem 0.8rem;
    border-radius: 20px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.9);
    will-change: transform, opacity;
}
.seat-top { top: -46px; }
.seat-bottom { bottom: -46px; }

.seat-badge {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
}
.seat-role {
    font-family: monospace;
    font-size: 0.5rem;
    color: rgba(17, 212, 131, 0.85);
    letter-spacing: 1px;
}
.seat-name {
    font-family: var(--font-display);
    font-size: 0.8rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 1.5px;
}

/* CASINO CHIPS */
.casino-chip {
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
    box-shadow: 0 4px 15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2);
}
.casino-chip::before {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    border: 2px dashed rgba(255,255,255,0.25);
}
.chip-andres {
    background: radial-gradient(circle at 35% 35%, #c8960a, #8a6700);
    border: 2px solid #f0c030;
}
.chip-johan {
    background: radial-gradient(circle at 35% 35%, #0fd47e, #087548);
    border: 2px solid #11d483;
}
.chip-label {
    font-family: var(--font-display);
    font-size: 0.4rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.5px;
    line-height: 1;
}
.chip-value {
    font-family: var(--font-display);
    font-size: 0.6rem;
    font-weight: 900;
    color: #ffffff;
    line-height: 1;
}

/* POKER FELT STAGE & CARDS */
.poker-felt-stage {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    perspective: 1200px;
}

/* COMPACT POKER CARD (ELEGANT CASINO SCALE) */
.poker-card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 205px;
    margin-left: -70px;
    margin-top: -102px;
    perspective: 1000px;
    z-index: 5;
    will-change: transform, opacity;
}

.poker-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-face {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.85);
}

/* CARD BACK */
.card-back {
    background: #060a0f;
    transform: rotateY(0deg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(17, 212, 131, 0.45);
    box-shadow: inset 0 0 25px rgba(17, 212, 131, 0.08);
}
.vanta-back-pattern {
    position: absolute;
    inset: 6px;
    border-radius: 9px;
    border: 1px solid rgba(17, 212, 131, 0.18);
}
.vanta-back-logo {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
}
.vanta-v-symbol {
    font-family: var(--font-display);
    font-size: 2.2rem;
    font-weight: 900;
    color: #11d483;
    text-shadow: 0 0 20px rgba(17, 212, 131, 0.8);
    line-height: 1;
}
.vanta-brand-name {
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 2.5px;
    color: #ffffff;
}

/* CARD FRONT */
.card-front {
    background: #0b121e;
    transform: rotateY(180deg);
    padding: 0.6rem 0.55rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.poker-card:hover .card-front {
    border-color: var(--poker-accent, #11d483);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.95), 0 0 25px var(--poker-accent, rgba(17, 212, 131, 0.5));
}

/* PIPS */
.poker-pip {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
}
.pip-tl { top: 5px; left: 6px; }
.pip-br { bottom: 5px; right: 6px; transform: rotate(180deg); }
.pip-val { font-family: var(--font-display); font-size: 0.7rem; font-weight: 900; color: #ffffff; }
.pip-suit { font-size: 0.65rem; color: #11d483; }

/* CONTENT */
.poker-card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
    justify-content: space-between;
    padding: 0.5rem 0.1rem 0 0.1rem;
}
.poker-tech-badge {
    font-family: monospace;
    font-size: 0.44rem;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.5px;
}
.poker-hero-art {
    font-size: 1.5rem;
    margin: 0.15rem 0;
}
.poker-card-title {
    font-family: var(--font-display);
    font-size: 0.75rem;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.1;
    margin: 0.1rem 0;
}
.poker-card-desc {
    font-size: 0.54rem;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.2;
    margin-bottom: 0.2rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.poker-inspect-btn {
    background: rgba(17, 212, 131, 0.1);
    border: 1px solid var(--poker-accent, #11d483);
    color: var(--poker-accent, #11d483);
    font-family: var(--font-display);
    font-size: 0.5rem;
    font-weight: 900;
    padding: 3px 6px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
}
.poker-inspect-btn:hover {
    background: var(--poker-accent, #11d483);
    color: #000000;
    box-shadow: 0 0 12px var(--poker-accent, rgba(17, 212, 131, 0.6));
}

/* MASTER WINNER CARD (CENTER SLAM) */
.master-vanta-card {
    width: 165px !important;
    height: 245px !important;
    margin-left: -82px !important;
    margin-top: -122px !important;
    border: 2px solid #f0c030 !important;
    box-shadow: 0 0 45px rgba(240, 192, 48, 0.55), inset 0 0 30px rgba(240, 192, 48, 0.3) !important;
}
.master-card-front {
    background: radial-gradient(circle at 50% 30%, #171407 0%, #060501 100%) !important;
}
.master-badge { color: #f0c030 !important; font-weight: 900; }
.vanta-v-master {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 900;
    color: #f0c030;
    text-shadow: 0 0 25px rgba(240, 192, 48, 0.9);
    line-height: 1;
}
.master-title { color: #ffffff !important; text-shadow: 0 0 10px rgba(240, 192, 48, 0.7); }
.master-btn { background: rgba(240, 192, 48, 0.15) !important; border-color: #f0c030 !important; color: #f0c030 !important; }
.master-btn:hover { background: #f0c030 !important; color: #000000 !important; }

/* MASTER SLAM SHOCKWAVE ONLY (ON FELT) */
.master-felt-shockwave {
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgba(240, 192, 48, 0.9);
    box-shadow: 0 0 25px rgba(240, 192, 48, 0.7);
    pointer-events: none;
    z-index: 4;
    transform: translate(-50%, -50%) scale(0);
    animation: masterShockwaveExpand 0.8s ease-out forwards;
}
@keyframes masterShockwaveExpand {
    0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.95; }
    50%  { opacity: 0.75; }
    100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
}"""

with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

idx_start = content.find('/* =========================================\n   REAL HEADS-UP POKER TABLE & COMPACT CARDS')
idx_end = content.find('/* =========================================\n   FULLSCREEN HD INSPECTION MODAL')

if idx_start != -1 and idx_end != -1:
    new_content = content[:idx_start] + css_perfect_styles + '\n\n' + content[idx_end:]
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS: Updated styles.css with perfect 640px height table!')
else:
    print('ERROR: Could not locate markers in styles.css')
