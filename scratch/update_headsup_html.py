import os

html_content = """            <!-- Real 3D Rounded Poker Table Container -->
            <div class="poker-table-container">
                <div class="poker-table-felt" id="poker-table-felt">
                    <div class="table-border-inner"></div>
                    <div class="table-bet-ring"></div>
                    <div class="table-watermark">VANTA HEADS-UP ARENA</div>

                    <!-- Top Player Seat: ANDRÉS -->
                    <div class="player-seat seat-top" id="seat-andres">
                        <div class="casino-chip chip-andres">
                            <span class="chip-label">ANDRÉS</span>
                            <span class="chip-value">♠</span>
                        </div>
                        <div class="seat-badge">
                            <span class="seat-role">// FULL-STACK &amp; CLOUD</span>
                            <span class="seat-name">ANDRÉS</span>
                        </div>
                    </div>

                    <!-- Bottom Player Seat: JOHAN -->
                    <div class="player-seat seat-bottom" id="seat-johan">
                        <div class="seat-badge">
                            <span class="seat-role">// AI &amp; 3D GRAPHICS</span>
                            <span class="seat-name">JOHAN</span>
                        </div>
                        <div class="casino-chip chip-johan">
                            <span class="chip-label">JOHAN</span>
                            <span class="chip-value">♦</span>
                        </div>
                    </div>

                    <!-- ===== POKER FELT CARDS STAGE ===== -->
                    <div class="poker-felt-stage" id="poker-felt-stage">

                        <!-- ===== MANO DE ANDRÉS (TOP CARDS) ===== -->
                        <!-- Card A1: FastAPI Async (As de Corazones ♥) -->
                        <div class="poker-card card-andres" data-index="0" data-player="andres" data-tech="fastapi" style="--poker-accent: #059669;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">A</span><span class="pip-suit" style="color: #059669;">♥</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">A</span><span class="pip-suit" style="color: #059669;">♥</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">BACKEND // ASYNC</div>
                                        <div class="poker-hero-art" style="color: #059669;"><i class="fas fa-bolt poker-icon"></i></div>
                                        <h3 class="poker-card-title">FastAPI Async</h3>
                                        <p class="poker-card-desc">APIs de baja latencia OpenAPI v3.</p>
                                        <button class="poker-inspect-btn" data-tech="fastapi"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card A2: Supabase Cloud (Rey de Picas ♠) -->
                        <div class="poker-card card-andres" data-index="1" data-player="andres" data-tech="supabase" style="--poker-accent: #3ECF8E;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">K</span><span class="pip-suit">♠</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">K</span><span class="pip-suit">♠</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">CLOUD // BAAS</div>
                                        <div class="poker-hero-art" style="color: #3ECF8E;"><i class="fas fa-cloud-upload-alt poker-icon"></i></div>
                                        <h3 class="poker-card-title">Supabase Cloud</h3>
                                        <p class="poker-card-desc">Postgres Realtime &amp; Edge Auth.</p>
                                        <button class="poker-inspect-btn" data-tech="supabase"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card A3: React 19 & TS (Reina de Diamantes ♦) -->
                        <div class="poker-card card-andres" data-index="2" data-player="andres" data-tech="react" style="--poker-accent: #61DAFB;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">Q</span><span class="pip-suit" style="color: #61DAFB;">♦</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">Q</span><span class="pip-suit" style="color: #61DAFB;">♦</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">UI // REACT 19</div>
                                        <div class="poker-hero-art" style="color: #61DAFB;"><i class="fab fa-react poker-icon"></i></div>
                                        <h3 class="poker-card-title">React 19 &amp; TS</h3>
                                        <p class="poker-card-desc">UI modular, HTML5, CSS3 &amp; JS.</p>
                                        <button class="poker-inspect-btn" data-tech="react"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card A4: Node.js & Vercel (Jota de Tréboles ♣) -->
                        <div class="poker-card card-andres" data-index="3" data-player="andres" data-tech="nodejs" style="--poker-accent: #68A063;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">J</span><span class="pip-suit">♣</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">J</span><span class="pip-suit">♣</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">SERVERLESS // NODE</div>
                                        <div class="poker-hero-art" style="color: #68A063;"><i class="fab fa-node-js poker-icon"></i></div>
                                        <h3 class="poker-card-title">Node.js &amp; Vercel</h3>
                                        <p class="poker-card-desc">Microservicios &amp; Edge CDN.</p>
                                        <button class="poker-inspect-btn" data-tech="nodejs"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card A5: Python 3.11 & Flask (As de Espadas ♠) -->
                        <div class="poker-card card-andres" data-index="4" data-player="andres" data-tech="python" style="--poker-accent: #3776AB;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">A</span><span class="pip-suit">♠</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">A</span><span class="pip-suit">♠</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">CORE // PYTHON</div>
                                        <div class="poker-hero-art" style="color: #3776AB;"><i class="fab fa-python poker-icon"></i></div>
                                        <h3 class="poker-card-title">Python &amp; Flask</h3>
                                        <p class="poker-card-desc">Micro-APIs &amp; Cómputo Async.</p>
                                        <button class="poker-inspect-btn" data-tech="python"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card A6: C++, Docker & Git (Diez de Picas ♠) -->
                        <div class="poker-card card-andres" data-index="5" data-player="andres" data-tech="andres_infra" style="--poker-accent: #00599C;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">10</span><span class="pip-suit">♠</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">10</span><span class="pip-suit">♠</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">INFRA // DOCKER &amp; C++</div>
                                        <div class="poker-hero-art" style="color: #00599C;"><i class="fab fa-docker poker-icon"></i></div>
                                        <h3 class="poker-card-title">C++, Docker &amp; Git</h3>
                                        <p class="poker-card-desc">Contenedores &amp; Code CI/CD.</p>
                                        <button class="poker-inspect-btn" data-tech="andres_infra"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ===== MANO DE JOHAN (BOTTOM CARDS) ===== -->
                        <!-- Card J1: YOLOv8 AI (Rey de Diamantes ♦) -->
                        <div class="poker-card card-johan" data-index="6" data-player="johan" data-tech="yolo" style="--poker-accent: #11d483;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">K</span><span class="pip-suit" style="color: #11d483;">♦</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">K</span><span class="pip-suit" style="color: #11d483;">♦</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">AI // COMPUTER VISION</div>
                                        <div class="poker-hero-art" style="color: #11d483;"><i class="fas fa-eye poker-icon"></i></div>
                                        <h3 class="poker-card-title">YOLOv8 AI</h3>
                                        <p class="poker-card-desc">Detección local en vivo 60 FPS.</p>
                                        <button class="poker-inspect-btn" data-tech="yolo"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card J2: Machine Learning (As de Tréboles ♣) -->
                        <div class="poker-card card-johan" data-index="7" data-player="johan" data-tech="ml" style="--poker-accent: #a855f7;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">A</span><span class="pip-suit">♣</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">A</span><span class="pip-suit">♣</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">AI // NEURAL NETS</div>
                                        <div class="poker-hero-art" style="color: #a855f7;"><i class="fas fa-brain poker-icon"></i></div>
                                        <h3 class="poker-card-title">Machine Learning</h3>
                                        <p class="poker-card-desc">Modelos neuronales profundos.</p>
                                        <button class="poker-inspect-btn" data-tech="ml"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card J3: 3D Models & Three.js (Reina de Tréboles ♣) -->
                        <div class="poker-card card-johan" data-index="8" data-player="johan" data-tech="three" style="--poker-accent: #00ffff;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">Q</span><span class="pip-suit">♣</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">Q</span><span class="pip-suit">♣</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">3D // MODELS &amp; WEBGL</div>
                                        <div class="poker-hero-art" style="color: #00ffff;"><i class="fas fa-cube poker-icon"></i></div>
                                        <h3 class="poker-card-title">3D Models &amp; Three</h3>
                                        <p class="poker-card-desc">Renderizado 3D PBR &amp; GLSL.</p>
                                        <button class="poker-inspect-btn" data-tech="three"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card J4: PostgreSQL & Neon (Nueve de Diamantes ♦) -->
                        <div class="poker-card card-johan" data-index="9" data-player="johan" data-tech="postgres" style="--poker-accent: #4169E1;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">9</span><span class="pip-suit" style="color: #4169E1;">♦</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">9</span><span class="pip-suit" style="color: #4169E1;">♦</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">DATABASE // POSTGRES</div>
                                        <div class="poker-hero-art" style="color: #4169E1;"><i class="fas fa-database poker-icon"></i></div>
                                        <h3 class="poker-card-title">PostgreSQL &amp; Neon</h3>
                                        <p class="poker-card-desc">Aislamiento ACID &amp; Serverless.</p>
                                        <button class="poker-inspect-btn" data-tech="postgres"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card J5: Cloudflare Tunnels (Diez de Diamantes ♦) -->
                        <div class="poker-card card-johan" data-index="10" data-player="johan" data-tech="cloudflare" style="--poker-accent: #F38020;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">10</span><span class="pip-suit" style="color: #F38020;">♦</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">10</span><span class="pip-suit" style="color: #F38020;">♦</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">SECURITY // TUNNELS</div>
                                        <div class="poker-hero-art" style="color: #F38020;"><i class="fas fa-shield-alt poker-icon"></i></div>
                                        <h3 class="poker-card-title">Cloudflare Tunnels</h3>
                                        <p class="poker-card-desc">Túneles Zero Trust Anti-DDoS.</p>
                                        <button class="poker-inspect-btn" data-tech="cloudflare"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card J6: Python, C++, Docker & Git (Jota de Diamantes ♦) -->
                        <div class="poker-card card-johan" data-index="11" data-player="johan" data-tech="johan_core" style="--poker-accent: #00599C;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">J</span><span class="pip-suit" style="color: #11d483;">♦</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">J</span><span class="pip-suit" style="color: #11d483;">♦</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge">CORE // C++ &amp; DOCKER</div>
                                        <div class="poker-hero-art" style="color: #11d483;"><i class="fas fa-code-branch poker-icon"></i></div>
                                        <h3 class="poker-card-title">Python, C++ &amp; Dev</h3>
                                        <p class="poker-card-desc">Bindings C++ nativo &amp; Git Flow.</p>
                                        <button class="poker-inspect-btn" data-tech="johan_core"><i class="fas fa-search-plus"></i> INSPECT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ===== CARTA CENTRAL SLAM DE REMATE (THE WINNING RIVER CARD) ===== -->
                        <div class="poker-card master-vanta-card" id="master-vanta-card" data-index="12" data-tech="vanta_master" style="--poker-accent: #f0c030;">
                            <div class="poker-card-inner">
                                <div class="card-face card-back">
                                    <div class="vanta-back-pattern"></div>
                                    <div class="vanta-back-logo"><span class="vanta-v-symbol">V</span><span class="vanta-brand-name">VANTA</span></div>
                                    <div class="vanta-back-border"></div>
                                </div>
                                <div class="card-face card-front master-card-front">
                                    <div class="poker-pip pip-tl"><span class="pip-val">A</span><span class="pip-suit" style="color: #f0c030;">♠♦</span></div>
                                    <div class="poker-pip pip-br"><span class="pip-val">A</span><span class="pip-suit" style="color: #f0c030;">♠♦</span></div>
                                    <div class="poker-card-content">
                                        <div class="poker-tech-badge master-badge">// THE WINNING RIVER</div>
                                        <div class="poker-hero-art master-art" style="color: #f0c030;">
                                            <span class="vanta-v-master">V</span>
                                        </div>
                                        <h3 class="poker-card-title master-title">VANTA ENGINE</h3>
                                        <p class="poker-card-desc master-desc">Sinergia técnica de elite por Andrés &amp; Johan.</p>
                                        <button class="poker-inspect-btn master-btn" data-tech="vanta_master"><i class="fas fa-crown"></i> EXPLORAR</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div><!-- /.poker-felt-stage -->
                </div><!-- /.poker-table-felt -->
            </div><!-- /.poker-table-container -->"""

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<!-- Real 3D Rounded Poker Table Container -->'
if start_marker not in content:
    start_marker = '<!-- Crupier Dealer Deck Stack at Top -->'

idx_start = content.find(start_marker)
idx_end = content.find('<!-- Fullscreen Glass Modal: Inspection HD Showcase -->')

if idx_start != -1 and idx_end != -1:
    new_content = content[:idx_start] + html_content + '\n\n        ' + content[idx_end:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS: Updated index.html with Real Poker Table and Heads-Up layout!')
else:
    print('ERROR: Could not locate markers in index.html')
