import os

html_content = """            <!-- Poker Felt Table Stage -->
            <div class="poker-felt-stage" id="poker-felt-stage">

                <!-- Player Seat: ANDRÉS (Left Seat) -->
                <div class="player-seat seat-andres" id="seat-andres">
                    <div class="casino-chip chip-andres" id="chip-andres">
                        <span class="chip-label">ANDRÉS</span>
                        <span class="chip-value">♠</span>
                    </div>
                    <div class="seat-badge">
                        <span class="seat-role">// FULL-STACK &amp; CLOUD</span>
                        <span class="seat-name">ANDRÉS</span>
                    </div>
                </div>

                <!-- Player Seat: JOHAN (Right Seat) -->
                <div class="player-seat seat-johan" id="seat-johan">
                    <div class="casino-chip chip-johan" id="chip-johan">
                        <span class="chip-label">JOHAN</span>
                        <span class="chip-value">♦</span>
                    </div>
                    <div class="seat-badge">
                        <span class="seat-role">// AI &amp; 3D GRAPHICS</span>
                        <span class="seat-name">JOHAN</span>
                    </div>
                </div>

                <!-- ===== MANO DE ANDRÉS (6 CARTAS EN SU LADO) ===== -->
                <!-- Card A1: FastAPI Async (As de Corazones ♥) -->
                <div class="poker-card card-andres" data-index="0" data-player="andres" data-tech="fastapi" style="--poker-accent: #059669;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo">
                                <span class="vanta-v-symbol">V</span>
                                <span class="vanta-brand-name">VANTA</span>
                                <span class="vanta-subtext">ANDRÉS DECK</span>
                            </div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">A</span><span class="pip-suit" style="color: #059669;">♥</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">A</span><span class="pip-suit" style="color: #059669;">♥</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">BACKEND // ASYNC REST</div>
                                <div class="poker-hero-art" style="color: #059669;"><i class="fas fa-bolt poker-icon"></i></div>
                                <h3 class="poker-card-title">FastAPI Async</h3>
                                <p class="poker-card-desc">APIs asíncronas de ultra-baja latencia con esquema estricto OpenAPI v3.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 98%; background: #059669;"></div><span class="power-label">10K REQ/SEC</span></div>
                                    <button class="poker-inspect-btn" data-tech="fastapi"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card A2: Supabase Cloud (Rey de Picas ♠) -->
                <div class="poker-card card-andres" data-index="1" data-player="andres" data-tech="supabase" style="--poker-accent: #3ECF8E;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">ANDRÉS DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">K</span><span class="pip-suit">♠</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">K</span><span class="pip-suit">♠</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">CLOUD // BAAS ENGINE</div>
                                <div class="poker-hero-art" style="color: #3ECF8E;"><i class="fas fa-cloud-upload-alt poker-icon"></i></div>
                                <h3 class="poker-card-title">Supabase Cloud</h3>
                                <p class="poker-card-desc">Postgres en vivo, autenticación OAuth, Storage RLS y edge functions.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 96%; background: #3ECF8E;"></div><span class="power-label">REALTIME DB</span></div>
                                    <button class="poker-inspect-btn" data-tech="supabase"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card A3: React 19 & TS (Reina de Diamantes ♦) -->
                <div class="poker-card card-andres" data-index="2" data-player="andres" data-tech="react" style="--poker-accent: #61DAFB;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">ANDRÉS DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">Q</span><span class="pip-suit" style="color: #61DAFB;">♦</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">Q</span><span class="pip-suit" style="color: #61DAFB;">♦</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">FRONTEND // UI REACT</div>
                                <div class="poker-hero-art" style="color: #61DAFB;"><i class="fab fa-react poker-icon"></i></div>
                                <h3 class="poker-card-title">React 19 &amp; TS</h3>
                                <p class="poker-card-desc">UI modular, TypeScript estricto, HTML5/CSS3 avanzado e interacciones JS.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 97%; background: #61DAFB;"></div><span class="power-label">LIGHTHOUSE 100</span></div>
                                    <button class="poker-inspect-btn" data-tech="react"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card A4: Node.js & Vercel (Jota de Tréboles ♣) -->
                <div class="poker-card card-andres" data-index="3" data-player="andres" data-tech="nodejs" style="--poker-accent: #68A063;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">ANDRÉS DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">J</span><span class="pip-suit">♣</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">J</span><span class="pip-suit">♣</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">SERVERLESS // NODE &amp; VERCEL</div>
                                <div class="poker-hero-art" style="color: #68A063;"><i class="fab fa-node-js poker-icon"></i></div>
                                <h3 class="poker-card-title">Node.js &amp; Vercel</h3>
                                <p class="poker-card-desc">Microservicios Node asíncronos y despliegues serverless edge global.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 95%; background: #68A063;"></div><span class="power-label">GLOBAL EDGE</span></div>
                                    <button class="poker-inspect-btn" data-tech="nodejs"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card A5: Python 3.11 & Flask (As de Espadas ♠) -->
                <div class="poker-card card-andres" data-index="4" data-player="andres" data-tech="python" style="--poker-accent: #3776AB;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">ANDRÉS DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">A</span><span class="pip-suit">♠</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">A</span><span class="pip-suit">♠</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">CORE // PYTHON &amp; FLASK</div>
                                <div class="poker-hero-art" style="color: #3776AB;"><i class="fab fa-python poker-icon"></i></div>
                                <h3 class="poker-card-title">Python &amp; Flask</h3>
                                <p class="poker-card-desc">Procesamiento numérico, APIs ligeras Flask y scripts backend de alto nivel.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 99%; background: #3776AB;"></div><span class="power-label">PYTHON 3.11</span></div>
                                    <button class="poker-inspect-btn" data-tech="python"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card A6: C++, Docker & Git (Diez de Picas ♠) -->
                <div class="poker-card card-andres" data-index="5" data-player="andres" data-tech="andres_infra" style="--poker-accent: #00599C;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">ANDRÉS DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">10</span><span class="pip-suit">♠</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">10</span><span class="pip-suit">♠</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">INFRA // C++, DOCKER &amp; GIT</div>
                                <div class="poker-hero-art" style="color: #00599C;"><i class="fab fa-docker poker-icon"></i></div>
                                <h3 class="poker-card-title">C++, Docker &amp; Git</h3>
                                <p class="poker-card-desc">Contenedores distribuidos, control de versiones Git y cómputo nativo C++.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 96%; background: #00599C;"></div><span class="power-label">CONTAINERIZED</span></div>
                                    <button class="poker-inspect-btn" data-tech="andres_infra"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ===== MANO DE JOHAN (6 CARTAS EN SU LADO) ===== -->
                <!-- Card J1: YOLOv8 AI (Rey de Diamantes ♦) -->
                <div class="poker-card card-johan" data-index="6" data-player="johan" data-tech="yolo" style="--poker-accent: #11d483;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">JOHAN DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">K</span><span class="pip-suit" style="color: #11d483;">♦</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">K</span><span class="pip-suit" style="color: #11d483;">♦</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">AI // COMPUTER VISION</div>
                                <div class="poker-hero-art" style="color: #11d483;"><i class="fas fa-eye poker-icon"></i></div>
                                <h3 class="poker-card-title">YOLOv8 AI</h3>
                                <p class="poker-card-desc">Detección y seguimiento de objetos local en tiempo real sin latencia nube.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 99%; background: #11d483;"></div><span class="power-label">PRECISION 99.4%</span></div>
                                    <button class="poker-inspect-btn" data-tech="yolo"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card J2: Machine Learning (As de Tréboles ♣) -->
                <div class="poker-card card-johan" data-index="7" data-player="johan" data-tech="ml" style="--poker-accent: #a855f7;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">JOHAN DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">A</span><span class="pip-suit">♣</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">A</span><span class="pip-suit">♣</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">AI // NEURAL NETWORKS</div>
                                <div class="poker-hero-art" style="color: #a855f7;"><i class="fas fa-brain poker-icon"></i></div>
                                <h3 class="poker-card-title">Machine Learning</h3>
                                <p class="poker-card-desc">Entrenamiento de modelos neuronales, regresión y clasificación automatizada.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 97%; background: #a855f7;"></div><span class="power-label">DEEP LEARNING</span></div>
                                    <button class="poker-inspect-btn" data-tech="ml"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card J3: 3D Models & Three.js (Reina de Tréboles ♣) -->
                <div class="poker-card card-johan" data-index="8" data-player="johan" data-tech="three" style="--poker-accent: #00ffff;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">JOHAN DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">Q</span><span class="pip-suit">♣</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">Q</span><span class="pip-suit">♣</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">3D // MODELS &amp; WEBGL</div>
                                <div class="poker-hero-art" style="color: #00ffff;"><i class="fas fa-cube poker-icon"></i></div>
                                <h3 class="poker-card-title">3D Models &amp; Three.js</h3>
                                <p class="poker-card-desc">Renderizado 3D interactivo WebGL, iluminación PBR y shaders GLSL.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 96%; background: #00ffff;"></div><span class="power-label">120 FPS GPU</span></div>
                                    <button class="poker-inspect-btn" data-tech="three"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card J4: PostgreSQL & Neon (Nueve de Diamantes ♦) -->
                <div class="poker-card card-johan" data-index="9" data-player="johan" data-tech="postgres" style="--poker-accent: #4169E1;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">JOHAN DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">9</span><span class="pip-suit" style="color: #4169E1;">♦</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">9</span><span class="pip-suit" style="color: #4169E1;">♦</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">DATABASE // POSTGRESQL</div>
                                <div class="poker-hero-art" style="color: #4169E1;"><i class="fas fa-database poker-icon"></i></div>
                                <h3 class="poker-card-title">PostgreSQL &amp; Neon</h3>
                                <p class="poker-card-desc">Aislamiento ACID estricto, índices B-Tree y consultas JSONB aceleradas.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 98%; background: #4169E1;"></div><span class="power-label">ACID GUARANTEE</span></div>
                                    <button class="poker-inspect-btn" data-tech="postgres"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card J5: Cloudflare Tunnels (Diez de Diamantes ♦) -->
                <div class="poker-card card-johan" data-index="10" data-player="johan" data-tech="cloudflare" style="--poker-accent: #F38020;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">JOHAN DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">10</span><span class="pip-suit" style="color: #F38020;">♦</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">10</span><span class="pip-suit" style="color: #F38020;">♦</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">SECURITY // CLOUDFLARE TUNNELS</div>
                                <div class="poker-hero-art" style="color: #F38020;"><i class="fas fa-shield-alt poker-icon"></i></div>
                                <h3 class="poker-card-title">Cloudflare Tunnels</h3>
                                <p class="poker-card-desc">Conexiones seguras Zero Trust, protección DDoS y enrutamiento privado.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 99%; background: #F38020;"></div><span class="power-label">ZERO TRUST SECURE</span></div>
                                    <button class="poker-inspect-btn" data-tech="cloudflare"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card J6: Python, C++, Docker & Git (Jota de Diamantes ♦) -->
                <div class="poker-card card-johan" data-index="11" data-player="johan" data-tech="johan_core" style="--poker-accent: #00599C;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">JOHAN DECK</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">J</span><span class="pip-suit" style="color: #11d483;">♦</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">J</span><span class="pip-suit" style="color: #11d483;">♦</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge">CORE // PYTHON, C++, DOCKER &amp; GIT</div>
                                <div class="poker-hero-art" style="color: #11d483;"><i class="fas fa-code-branch poker-icon"></i></div>
                                <h3 class="poker-card-title">Python, C++ &amp; Dev</h3>
                                <p class="poker-card-desc">Bindings nativos C++, despliegues Docker y pipelines de colaboración Git.</p>
                                <div class="poker-card-actions">
                                    <div class="poker-power-bar"><div class="power-fill" style="width: 98%; background: #11d483;"></div><span class="power-label">NATIVE HIGH PERFORMANCE</span></div>
                                    <button class="poker-inspect-btn" data-tech="johan_core"><i class="fas fa-search-plus"></i> INSPECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ===== CARTA CENTRAL SLAM DE REMATE (THE WINNING RIVER CARD) ===== -->
                <div class="poker-card master-vanta-card" id="master-vanta-card" data-index="12" data-tech="vanta_master" style="--poker-accent: #f0c030;">
                    <div class="poker-card-inner">
                        <div class="card-face card-back">
                            <div class="vanta-back-pattern"></div>
                            <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span><span class="vanta-subtext">ALL-IN WINNER</span></div>
                            <div class="vanta-back-border"></div>
                        </div>
                        <div class="card-face card-front master-card-front">
                            <div class="poker-pip pip-tl"><span class="pip-val">A</span><span class="pip-suit" style="color: #f0c030;">♠♦</span></div>
                            <div class="poker-pip pip-br"><span class="pip-val">A</span><span class="pip-suit" style="color: #f0c030;">♠♦</span></div>
                            <div class="poker-card-content">
                                <div class="poker-tech-badge master-badge">// THE ALL-IN WINNING HAND</div>
                                <div class="poker-hero-art master-art" style="color: #f0c030;">
                                    <span class="vanta-v-master">V</span>
                                </div>
                                <h3 class="poker-card-title master-title">VANTA ENGINE 2025</h3>
                                <p class="poker-card-desc master-desc">Sinergia técnica de elite por Andrés &amp; Johan. Sistemas de software galardonados a nivel mundial.</p>
                                <div class="poker-card-actions">
                                    <button class="poker-inspect-btn master-btn" data-tech="vanta_master"><i class="fas fa-crown"></i> EXPLORAR CAPACIDADES</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div><!-- /.poker-felt-stage -->"""

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<!-- Poker Felt Table Stage -->'
end_marker = '<!-- Fullscreen Glass Modal: Inspection HD Showcase -->'

idx_start = content.find(start_marker)
idx_end = content.find(end_marker)

if idx_start != -1 and idx_end != -1:
    new_content = content[:idx_start] + html_content + '\n\n        ' + content[idx_end:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS: Updated index.html with 13 cards!')
else:
    print('ERROR: Could not find markers in index.html')
