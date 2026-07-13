/* =========================================
   0. CINEMATIC PRELOADER
   ========================================= */
(function() {
    const _preloader = document.getElementById('preloader');
    if (!_preloader) return;

    /* --- Canvas de partículas flotantes fondo --- */
    const plCanvas = document.getElementById('preloader-canvas');
    const plCtx    = plCanvas ? plCanvas.getContext('2d') : null;
    let plParticles = [];
    let plRafId;

    function initPlCanvas() {
        if (!plCtx) return;
        plCanvas.width  = window.innerWidth;
        plCanvas.height = window.innerHeight;

        // Generar 60 partículas flotantes
        plParticles = Array.from({ length: 60 }, () => ({
            x: Math.random() * plCanvas.width,
            y: Math.random() * plCanvas.height,
            r: Math.random() * 1.5 + 0.4,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.1
        }));

        animatePl();
    }

    function animatePl() {
        if (!plCtx) return;
        // Fondo oscuro semi-sólido (el canvas sirve como fondo del preloader)
        plCtx.fillStyle = 'rgba(5, 5, 5, 0.96)';
        plCtx.fillRect(0, 0, plCanvas.width, plCanvas.height);
        plParticles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = plCanvas.width;
            if (p.x > plCanvas.width) p.x = 0;
            if (p.y < 0) p.y = plCanvas.height;
            if (p.y > plCanvas.height) p.y = 0;
            plCtx.beginPath();
            plCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            plCtx.fillStyle = `rgba(17,212,131,${p.alpha})`;
            plCtx.fill();
        });
        plRafId = requestAnimationFrame(animatePl);
    }

    initPlCanvas();

    /* --- Barra de progreso y contador animados --- */
    const plFill = document.querySelector('.pl-fill');
    const plPct  = document.getElementById('pl-pct');
    let progress = 0;
    
    // Optimización Awwwards: Preloader corto en visitas recurrentes
    const hasVisited = sessionStorage.getItem('vanta-preloader-seen');
    const TOTAL_MS = hasVisited ? 500 : 2800; // 500ms si ya visitó la página
    if (!hasVisited) {
        sessionStorage.setItem('vanta-preloader-seen', 'true');
    }
    
    const start = performance.now();

    function updateProgress(now) {
        const elapsed = now - start;
        const raw = Math.min(elapsed / TOTAL_MS, 1);
        progress = raw < 0.7
            ? raw / 0.7 * 85
            : 85 + (raw - 0.7) / 0.3 * 15;
        progress = Math.min(progress, 100);

        if (plFill) plFill.style.width = progress + '%';
        if (plPct)  plPct.textContent  = Math.floor(progress) + '%';

        if (progress < 100) {
            requestAnimationFrame(updateProgress);
        }
    }
    requestAnimationFrame(updateProgress);

    /* --- Reveal: cortinas + fade del preloader --- */
    window.setTimeout(() => {
        cancelAnimationFrame(plRafId);
        _preloader.classList.add('preloader-hidden');

        // Las cortinas tardan 750ms en abrirse → activamos el Blueprint cuando terminen
        setTimeout(() => {
            _preloader.style.display = 'none';
            // Liberamos la animación del Blueprint exactamente al finalizarse el reveal
            const blueprintEl = document.querySelector('.blueprint-container');
            if (blueprintEl) {
                blueprintEl.classList.remove('blueprint-paused');
            }
            // Disparar la entrada dramática de la V 3D
            if (window.play3DVEntranceAnimation) {
                window.play3DVEntranceAnimation();
            }
        }, 800);
    }, TOTAL_MS);
})();

/* =========================================
   INICIO DEL SCRIPT PRINCIPAL
   ========================================= */
function initMainScript() {

    /* =========================================
       1. MENÚ MÓVIL (HAMBURGUESA)
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks   = document.querySelector('.nav-links');
    const links      = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    /* =========================================
       2. ANIMACIONES AL HACER SCROLL (.hidden)
       ========================================= */
    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    /* =========================================
       2.1. ANIMACIONES PARA TARJETAS
       ========================================= */
    const cardObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "50px"
    };

    const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                obs.unobserve(entry.target);
            }
        });
    }, cardObserverOptions);

    document.querySelectorAll('.gallery-grid .card').forEach(card => {
        cardObserver.observe(card);
    });

    /* =========================================
       3. CONTADOR ANIMADO DE ESTADÍSTICAS
       ========================================= */
    function animateCounter(el) {
        const target   = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800; // ms
        const step     = target / (duration / 16); // ~60fps
        let current    = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    }

    const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(c => animateCounter(c));
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);

    /* =========================================
       4. EFECTO PARALLAX SUAVE EN EL HERO
       ========================================= */
    let currentScrollY = 0;
    const heroContent = document.querySelector('.hero-content');
    const heroBlueprintContainer = document.querySelector('.blueprint-container');
    const hero = document.querySelector('.hero');
    let heroH = hero ? hero.offsetHeight : window.innerHeight;

    window.addEventListener('resize', () => {
        if (hero) heroH = hero.offsetHeight;
    }, { passive: true });

    /* =========================================
       5. CURSOR PERSONALIZADO Y VARIABLES GLOBALES (GPU ACCELERATED)
       ========================================= */
    const cursor  = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');

    // Capturar coordenadas globales del mouse y setear variables CSS
    document.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    // Indicador deslizante (cápsula) de la barra de navegación
    function initNavbarIndicator() {
        const navLinksContainer = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-links a');
        const indicator = document.querySelector('.nav-indicator-capsule');
        if (!indicator || !navLinksContainer) return;

        function moveIndicator(link) {
            const rect = link.getBoundingClientRect();
            const parentRect = navLinksContainer.getBoundingClientRect();
            const left = rect.left - parentRect.left;
            const width = rect.width;
            
            indicator.style.transform = `translate3d(${left}px, 0, 0)`;
            indicator.style.width = `${width}px`;
            indicator.classList.add('active');
        }

        function hideIndicator() {
            indicator.classList.remove('active');
        }

        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveIndicator(link));
        });

        navLinksContainer.addEventListener('mouseleave', hideIndicator);
    }
    initNavbarIndicator();
 
    // Efecto Magnético Global Optimizado (Sin lag de transición)
    document.querySelectorAll('.btn, .btn-outline, .modal-close, .viewer-close, .modal-tab-btn, .nav-links a, .logo, .menu-toggle').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transition = 'none'; // Desactivar transiciones para evitar lag durante mousemove
            if (cursor) cursor.classList.add('btn-hover');
        });

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - (rect.left + rect.width / 2)) * 0.32;
            const y = (e.clientY - (rect.top + rect.height / 2)) * 0.32;
            item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
 
        item.addEventListener('mouseleave', () => {
            item.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)'; // Transición elástica de retorno
            item.style.transform = 'translate3d(0px, 0px, 0)';
            if (cursor) cursor.classList.remove('btn-hover');
        });
    });
 
    if (window.innerWidth > 991 && cursor) {
        document.body.classList.add('custom-cursor-active');
 
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let c1X = mouseX, c1Y = mouseY;
        let c2X = mouseX, c2Y = mouseY;
 
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
 
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursor2.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursor2.style.opacity = '1';
        });
 
        function renderCursor() {
            c1X += (mouseX - c1X) * 0.17;
            c1Y += (mouseY - c1Y) * 0.17;
            c2X += (mouseX - c2X) * 0.8;
            c2Y += (mouseY - c2Y) * 0.8;
 
            cursor.style.transform = `translate3d(calc(${c1X}px - 50%), calc(${c1Y}px - 50%), 0)`;
            cursor2.style.transform = `translate3d(calc(${c2X}px - 50%), calc(${c2Y}px - 50%), 0)`;
 
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);
 
        // Hover general del cursor
        document.querySelectorAll('a, button, .logo, .service-card, .method-step, .testimonial-card, .pricing-card').forEach(item => {
            item.addEventListener('mouseover',  () => {
                if (!cursor.classList.contains('spec-active') && !cursor.classList.contains('project-hover')) {
                    cursor.classList.add('hovered');
                }
            });
            item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });

        // Morph del cursor en tarjetas de proyectos (Portfolio)
        document.querySelectorAll('.horizontal-track .card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursor.classList.remove('hovered');
                cursor.classList.add('project-hover');
                if (cursor2) cursor2.style.opacity = '0';
            });
            card.addEventListener('mouseleave', () => {
                cursor.classList.remove('project-hover');
                if (cursor2) cursor2.style.opacity = '1';
            });
        });
 
        // Morph del cursor en expedientes del equipo (data-spec Awwwards)
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const specText = card.getAttribute('data-spec');
                if (specText) {
                    cursor.classList.remove('hovered');
                    cursor.classList.remove('project-hover');
                    cursor.setAttribute('data-spec-text', specText);
                    cursor.classList.add('spec-active');
                    if (cursor2) cursor2.style.opacity = '0';
                }
            });
            card.addEventListener('mouseleave', () => {
                cursor.classList.remove('spec-active');
                cursor.removeAttribute('data-spec-text');
                if (cursor2) cursor2.style.opacity = '1';
            });
        });
    }

    /* =========================================
       6. EFECTO MÁQUINA DE ESCRIBIR
       ========================================= */
    const textElement = document.querySelector('.typing-text');
    const words       = ["Arquitectura.", "Experiencias.", "Infraestructura.", "Tecnología.", "Tu Futuro."];
    let wordIndex   = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    function typeEffect() {
        if (!textElement) return;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex--);
            if (charIndex < 0) {
                isDeleting  = false;
                wordIndex   = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 500);
                return;
            }
        } else {
            textElement.textContent = currentWord.substring(0, charIndex++);
            if (charIndex > currentWord.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2200);
                return;
            }
        }

        setTimeout(typeEffect, isDeleting ? 80 : 140);
    }

    typeEffect();

    /* =========================================
       7. FORMULARIO A WHATSAPP
       ========================================= */
    const formContacto = document.getElementById('formContactoWa');

    if (formContacto) {
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre  = document.getElementById('waNombre').value.trim();
            const email   = document.getElementById('waEmail').value.trim();
            const mensaje = document.getElementById('waMensaje').value.trim();

            if (!nombre || !email || !mensaje) return;

            const textoMensaje = `¡Hola! Vengo de su sitio web VANTA y requiero cotizar un proyecto.%0A%0A*Nombre:* ${encodeURIComponent(nombre)}%0A*Correo:* ${encodeURIComponent(email)}%0A*Requerimiento:* ${encodeURIComponent(mensaje)}`;
            const numeroWa     = "584127121162";
            const urlWa        = `https://wa.me/${numeroWa}?text=${textoMensaje}`;

            window.open(urlWa, '_blank', 'noopener,noreferrer');
        });
    }

    /* =========================================
       8. NAVBAR SMART HIDE-ON-SCROLL & PROGRESS
       ========================================= */
    const navbar = document.querySelector('.navbar');
    const logoEl = document.querySelector('.logo');
    const progressBar = document.querySelector('.nav-progress-bar');

    function updateNavbar(scrollY) {
        // Solidify background once past the hero
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Logo morfológico: colapsa el texto a monograma al scrollear
        if (logoEl) {
            if (scrollY > 30) {
                logoEl.classList.add('logo-compact');
            } else {
                logoEl.classList.remove('logo-compact');
            }
        }

        // --- BARRA DE PROGRESO DE LECTURA NEÓN ---
        if (progressBar) {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollY / Math.max(1, documentHeight)) * 100;
            progressBar.style.width = scrollPercentage + '%';
        }
    }

    /* =========================================
       9. CANVAS NETWORK ANIMATION (NODOS)
       ========================================= */
    const canvas = document.getElementById('canvas-network');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // Configuración de la Red
        const particleCount = 70; // Cantidad de nodos
        const connectionDistance = 120; // Distancia máxima para conectar nodos
        const mouseConnectionDistance = 160; // Distancia de interacción con el mouse

        // Live color object — mutated by window.setVantaTheme()
        window.constellationColors = {
            node:      'rgba(17, 212, 131, 0.9)',
            line:      'rgba(17, 212, 131, 0.25)',
            mouseLine: 'rgba(17, 212, 131, 0.6)',
        };

        let mouse = { x: null, y: null };

        function resizeCanvas() {
            // El canvas cubre solo el header#home
            const heroSection = document.getElementById('home');
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.0;
                this.vy = (Math.random() - 0.5) * 1.0;
                this.radius = Math.random() * 2.0 + 1.0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Rebotar en los bordes
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = window.constellationColors.node;
                ctx.fill();
            }
        }

        function init() {
            resizeCanvas();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Actualizar y dibujar partículas
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Dibujar lineas (Red)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = window.constellationColors.line;
                        ctx.lineWidth = 1 - (dist / connectionDistance);
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Interacción con mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const dxm = particles[i].x - mouse.x;
                    const dym = particles[i].y - mouse.y;
                    const distMouse = Math.sqrt(dxm * dxm + dym * dym);

                    if (distMouse < mouseConnectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = window.constellationColors.mouseLine;
                        ctx.lineWidth = 1.5 - (distMouse / mouseConnectionDistance);
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        
                        // Pequeña atracción magnética al mouse
                        particles[i].x -= dxm * 0.015;
                        particles[i].y -= dym * 0.015;
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        // Listeners
        window.addEventListener('resize', () => {
            resizeCanvas();
        });

        const heroElement = document.getElementById('home');
        heroElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        heroElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Lanzar
        init();
        animate();
    }

    /* =========================================
       10. CARD MENU INTERACTIVO (click to toggle)
       ========================================= */
    const PROJECT_DATA = {
        kioskoazul: {
            tag: 'Python · Flask · SQLite · Bootstrap',
            title: 'Kiosko Azul — Gestión de Restaurante',
            description: 'Sistema integrado para el restaurante Kiosko Azul. Permite a los comensales visualizar un menú digital dinámico, reservar mesas en tiempo real y generar pedidos directo a cocina. Para los administradores, cuenta con un completo panel de edición de menú, administración y control de órdenes, y un dashboard de estadísticas para toma de decisiones financieras.',
            tech: ['Python / Flask', 'SQLite', 'Bootstrap 5', 'Bases de Datos', 'Dashboard Admin', 'Control de Pedidos'],
            url: '#contact',
            screenshots: ['img/auracheck/auralogin.jpeg'],
            code: `# Rutas de Pedidos y Reservas de Kiosko Azul
from flask import Flask, render_template, request, redirect, url_for
from models import db, Mesa, Pedido

@app.route('/reservar', methods=['POST'])
def reservar_mesa():
    mesa_id = request.form.get('mesa_id')
    cliente = request.form.get('nombre_cliente')
    
    mesa = Mesa.query.get(mesa_id)
    if mesa and mesa.disponible:
        mesa.disponible = False
        mesa.cliente = cliente
        db.session.commit()
        return jsonify({"status": "SUCCESS", "message": "Mesa reservada"})
    return jsonify({"status": "ERROR", "message": "Mesa no disponible"})`
        },
        svivaweb: {
            tag: 'React · TS · Vite · Tailwind',
            title: 'SVIVA Web — Showcase & Descargas',
            description: 'Sitio web oficial diseñado para promocionar y exhibir nuestro proyecto principal de grado: SVIVA. Es una landing page altamente inmersiva y profesional que aloja la descarga directa del archivo instalador ejecutable (.exe). Integra componentes dinámicos en React, animaciones de alto rendimiento con Tailwind CSS y guías interactivas de configuración.',
            tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Showcase de Producto'],
            url: '#contact',
            screenshots: ['img/sviva/svivaindex.jpeg'],
            code: `// Descarga de Ejecutable e Interfaz React TS
import React from 'react';

export const DownloadButton: React.FC = () => {
  const handleDownload = () => {
    // Iniciar descarga del .exe del sistema de videovigilancia
    window.location.href = '/downloads/sviva_installer.exe';
  };

  return (
    <button onClick={handleDownload} className="download-btn">
      Descargar SVIVA.exe
    </button>
  );
};`
        },
        ventastrack: {
            tag: 'Node.js · TS · Vite · PostgreSQL',
            title: 'VentasTrack — Gestión de Ventas B2B',
            description: 'Sistema integral de gestión comercial B2B. Se conecta directamente a los servidores y bases de datos locales de la empresa cliente, actualizando stock y catálogos de forma diaria. Diseñado con una estructura de roles y jerarquías seguras para vendedores y gerentes. Incluye un módulo interactivo para crear cotizaciones/facturas rellenando casillas clave de clientes, y un carrito de compras multi-producto dinámico.',
            tech: ['Node.js', 'Express', 'TypeScript', 'Vite', 'PostgreSQL', 'Sincronización Diaria', 'Facturación B2B', 'Carrito de Compras'],
            url: '#contact',
            screenshots: ['img/cerdiv/cerdivweb.jpeg'],
            code: `// Proceso de Facturación y Cotización en Node+TS
import { Request, Response } from 'express';
import { Pool } from 'pg';

export const generarFactura = async (req: Request, res: Response) => {
  const { clienteId, items, vendedorId } = req.body;
  const pool = new Pool();
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const total = items.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0);
    const result = await client.query(
      'INSERT INTO facturas (cliente_id, total, vendedor_id, estado) VALUES ($1, $2, $3, $4) RETURNING id',
      [clienteId, total, vendedorId, 'PENDIENTE']
    );
    await client.query('COMMIT');
    res.json({ id: result.rows[0].id, total });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
};`
        },
        sviva: {
            tag: 'YOLOv8 · FastAPI · Visión Artificial · Local',
            title: 'SVIVA — Sistema de Videovigilancia Inteligente',
            description: 'Proyecto de tesis (En desarrollo activo). Democratiza el acceso a seguridad avanzada operando algoritmos de visión artificial en tiempo real sobre hardware de gama media. No depende de la nube. Detecta intrusos, rastrea sujetos únicos (ByteTrack) y automatiza toma de decisiones en red local. Cuenta con FastAPI asíncrono, servicio de inferencia desacoplado, motor de grabación inteligente con pre-trigger, módulo de analítica en SQLite y notificaciones en tiempo real vía bot de Telegram.',
            tech: ['Python', 'YOLOv8', 'FastAPI', 'Inferencia Desacoplada', 'Telegram API', 'SQLite'],
            url: '#',
            screenshots: [
                'img/sviva/svivaindex.jpeg',
                'img/sviva/svivacamaras.jpeg',
                'img/sviva/svivagrabacion.jpeg',
                'img/sviva/svivagraficas.jpeg',
                'img/sviva/svivalogin.jpeg',
                'img/sviva/svivaconfig.jpeg',
                'img/sviva/svivapersonas.jpeg',
                'img/sviva/svivatelegram.jpeg'
            ],
            code: `# Algoritmo de Visión Artificial YOLOv8 + ByteTrack
import cv2
from ultralytics import YOLO
from trackers.multi_tracker_zoo import create_tracker

class VisionPipeline:
    def __init__(self, model_path="yolov8n.pt"):
        self.model = YOLO(model_path)
        self.tracker = create_tracker("bytetrack", "config/bytetrack.yaml")

    def process_frame(self, frame):
        results = self.model(frame, stream=True)
        for r in results:
            boxes = r.boxes.xyxy.cpu().numpy()
            scores = r.boxes.conf.cpu().numpy()
            class_ids = r.boxes.cls.cpu().numpy()
            
            # Rastreo local e inferencia
            tracks = self.tracker.update(boxes, scores, class_ids, frame)
            self.draw_debug_ui(frame, tracks)
        return frame`
        },
        iuta: {
            tag: 'Python · Flask · PostgreSQL · Cloud',
            title: 'Sistema de Gestión Bibliotecaria IUTA',
            description: 'Desarrollado como servicio comunitario para el IUTA, este sistema centraliza y automatiza la administración de libros y ejemplares físicos en múltiples sedes universitarias. Reemplaza registros físicos con una base de datos estructurada, implementa búsqueda en tiempo real por título/autor/sede, y gestiona stock con control de copias individuales y estados de disponibilidad. Incluye autenticación segura con cifrado de contraseñas y un panel CRUD completo para administradores.',
            tech: ['Flask (Python)', 'PostgreSQL / Neon', 'Vercel Blob', 'Werkzeug Auth', 'Búsqueda Asíncrona', 'Multi-sede'],
            url: 'https://biblioteca-ashy-sigma.vercel.app',
            screenshots: [
                'img/cerdiv/cerdivweb.jpeg',
                'img/cerdiv/cerdivsede.jpeg'
            ],
            code: `# Consultas de Bases de Datos Relacionales (PostgreSQL Neon)
from flask_sqlalchemy import SQLAlchemy
from models import db, Libro, Prestamo

def registrar_prestamo_libro(usuario_id, libro_id, sede_id):
    # Transacción ACID con bloqueo de fila optimista
    with db.session.begin(nested=True):
        libro = db.session.query(Libro).filter_by(id=libro_id, sede_id=sede_id).with_for_update().first()
        if not libro or libro.copias_disponibles <= 0:
            raise Exception("Ejemplares agotados en la sede seleccionada")
        
        prestamo = Prestamo(usuario_id=usuario_id, libro_id=libro_id, sede_id=sede_id, estado="ACTIVO")
        libro.copias_disponibles -= 1
        db.session.add(prestamo)
    db.session.commit()`
        },
        aura: {
            tag: 'FastAPI · Biometría · WebAuthn · Seguridad Local',
            title: 'Aura Check — Panel de Auditoría de Seguridad',
            description: 'Aplicación de auditoría de seguridad biométrica que opera 100% en local: ningún dato sensible abandona el dispositivo. Analiza cinco módulos: integridad biométrica (WebAuthn / huella / facial), sensor óptico (cámara + face-api.js), frecuencia acústica (Web Audio API), estado del sistema (Battery API) y seguridad de red (test de velocidad real + geolocalización IP). Genera certificados PDF forenses descargables y persiste el historial de auditorías en localStorage.',
            tech: ['FastAPI + Python 3.11', 'WebAuthn / Biometría', 'face-api.js', 'Web Audio API', 'jsPDF', 'Vercel Serverless', 'SlowAPI Rate Limiting'],
            url: 'https://aura-check-omega.vercel.app/',
            screenshots: [
                'img/auracheck/aura.jpeg',
                'img/auracheck/auralogin.jpeg'
            ],
            code: `// Verificación de Integridad Biométrica y Speed Test Local
async function auditBiometrics() {
    const hasWebAuthn = window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
    // face-api.js local face recognition setup
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    const detection = await faceapi.detectSingleFace(
        videoEl, new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();
    
    return {
        webauthn: hasWebAuthn ? "COMPLIANT" : "MISSING",
        biometryScore: detection ? detection.detection.score : 0,
        timestamp: Date.now()
    };
}`
        },
        cuerpo: {
            tag: 'Google Gemini · FastAPI · IA Narrativa · Victorian UX',
            title: '¿Qué le pasa a mi cuerpo? | Archivo Médico 1885',
            description: 'Plataforma de consulta médica inmersiva con IA que actúa como un doctor victoriano de 1885. Integra Gemini 1.5/2.0 Flash para respuestas con personalidad histórica, un sistema de fallback a Wikipedia y MedlinePlus (BeautifulSoup4 + httpx), filtros de imagen Cloudinary para estética de grabado antiguo, partículas de polvo ambiental, sellos de cera interactivos y paginación de respuestas simulando un libro físico.',
            tech: ['Google Gemini 1.5/2.0', 'FastAPI + Python', 'BeautifulSoup4', 'Cloudinary API', 'Tailwind CSS', 'Wikipedia / MedlinePlus', 'Vercel Functions'],
            url: 'https://que-le-pasa-a-mi-cuerpo.vercel.app/',
            screenshots: [
                'img/quelepasacuerpo/cuerpologin.jpeg',
                'img/quelepasacuerpo/cuerpopasa.jpeg'
            ],
            code: `# Motor Narrativo IA del Doctor Victoriano con Fallback
import google.generativeai as genai
from bs4 import BeautifulSoup

def consulta_medica_historica(pregunta: str):
    genai.configure(api_key="GEMINI_API_KEY")
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Inyectar System Prompt victoriano
    prompt = f"Actúa como un médico británico en 1885. Pregunta: {pregunta}"
    response = model.generate_content(prompt)
    
    # Filtro de respuesta para remover HTML o tags indeseados
    soup = BeautifulSoup(response.text, "html.parser")
    return soup.get_text()`
        },
        inventario: {
            tag: 'Gestión Empresarial · Stock · Reportes',
            title: 'Sistema de Inventario Pro | ¡Personalízalo para tu negocio!',
            description: 'Nuestra solución de inventario es un ecosistema digital diseñado para empresas que buscan orden y escalabilidad. Ofrecemos este software como un producto base altamente flexible: podemos adaptarlo a tus necesidades específicas (campos personalizados, alertas de stock mínimo, multi-sucursales). Incluye gestión de proveedores, historial de movimientos y exportación de reportes detallados.',
            tech: ['Python', 'Gestión de Stock', 'Base de Datos', 'Personalizable', 'Soporte 24/7'],
            url: '#contact',
            screenshots: [
                'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM.jpeg',
                'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (2).jpeg',
                'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (3).jpeg',
                'img/inventario/WhatsApp Image 2026-04-16 at 3.24.24 PM (7).jpeg'
            ],
            code: `-- Query de Inventario con Bloqueo de Filas y Reportes Diarios
BEGIN;
SELECT i.id, i.sku, i.stock_actual 
FROM inventario i
WHERE i.sku = 'SKU-7739-B' AND i.bodega_id = 2
FOR UPDATE;

UPDATE inventario 
SET stock_actual = stock_actual - 15, fecha_actualizacion = NOW()
WHERE sku = 'SKU-7739-B' AND bodega_id = 2;

INSERT INTO logs_movimientos (sku, bodega_id, cantidad, tipo)
VALUES ('SKU-7739-B', 2, 15, 'SALIDA');
COMMIT;`
        }
    };

    // ---- Modal and Technical 3D State ----
    const modalOverlay   = document.getElementById('projectModalOverlay');
    const modalTag       = document.getElementById('modalTag');
    const modalTitle     = document.getElementById('modalTitle');
    const modalDesc      = document.getElementById('modalDescription');
    const modalTechList  = document.getElementById('modalTechList');
    const modalLearnMore = document.getElementById('modalLearnMore');
    const modalCloseBtn  = document.getElementById('modalClose');
    const galleryCards   = document.querySelectorAll('.horizontal-track .card');

    let modal3DScene = null;
    let modal3DCamera = null;
    let modal3DRenderer = null;
    let modal3DMesh = null;
    let modal3DAnimationId = null;
    let modal3DListeners = null;

    function initModal3D(projectKey) {
        const container = document.getElementById('modal-3d-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        // Limpieza previa por seguridad
        disposeModal3D();

        const width = container.clientWidth || window.innerWidth * 0.55;
        const height = container.clientHeight || window.innerHeight;

        modal3DScene = new THREE.Scene();
        modal3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        modal3DCamera.position.z = 6.2;

        modal3DRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        modal3DRenderer.setSize(width, height);
        modal3DRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(modal3DRenderer.domElement);

        // Material wireframe neón verde
        const mat = new THREE.MeshBasicMaterial({
            color: 0x11d483,
            wireframe: true,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });
        window.modal3DMaterial = mat;

        // Sincronizar color inicial con el tema activo
        const initialPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (initialPrimary) {
            mat.color.setStyle(initialPrimary);
        }

        // Crear geometría única por proyecto
        if (projectKey === 'sviva') {
            // Neural Net / Icosaedro subdivided
            modal3DMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), mat);
        } else if (projectKey === 'iuta') {
            // DB cylinders stack
            const dbGroup = new THREE.Group();
            for (let i = 0; i < 3; i++) {
                const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.55, 12, 1, true), mat);
                cyl.position.y = (i - 1) * 0.85;
                dbGroup.add(cyl);
            }
            modal3DMesh = dbGroup;
        } else if (projectKey === 'aura') {
            // Biometric shield / Sphere octaedro
            modal3DMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.8, 2), mat);
        } else if (projectKey === 'cuerpo') {
            // Historical book / Torus
            modal3DMesh = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.45, 8, 20), mat);
        } else {
            // Inventario Pro / Server rack
            const rackGroup = new THREE.Group();
            for (let i = 0; i < 3; i++) {
                const box = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.42, 1.7), mat);
                box.position.y = (i - 1) * 0.72;
                rackGroup.add(box);
            }
            modal3DMesh = rackGroup;
        }

        modal3DScene.add(modal3DMesh);

        // Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        modal3DScene.add(ambientLight);

        // Interacción rotación 3D con cursor (Inercial / Drag)
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let targetRotation = { x: 0.2, y: 0.5 };
        let currentRotation = { x: 0.2, y: 0.5 };

        const onMouseDown = (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            targetRotation.y += deltaX * 0.0075;
            targetRotation.x += deltaY * 0.0075;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        container.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        const onResize = () => {
            if (!container || !modal3DRenderer || !modal3DCamera) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            modal3DCamera.aspect = w / h;
            modal3DCamera.updateProjectionMatrix();
            modal3DRenderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        modal3DListeners = {
            mousedown: onMouseDown,
            mousemove: onMouseMove,
            mouseup: onMouseUp,
            resize: onResize,
            container: container
        };

        function animateModal3D() {
            modal3DAnimationId = requestAnimationFrame(animateModal3D);

            // Lerp de rotación inercial
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.07;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.07;

            if (modal3DMesh) {
                modal3DMesh.rotation.x = currentRotation.x;
                modal3DMesh.rotation.y = currentRotation.y;
                if (!isDragging) {
                    targetRotation.y += 0.0035;
                    targetRotation.x += 0.001;
                }
            }

            if (modal3DRenderer && modal3DScene && modal3DCamera) {
                modal3DRenderer.render(modal3DScene, modal3DCamera);
            }
        }
        animateModal3D();

        // Activar fade-in
        setTimeout(() => {
            if (container && modalOverlay.classList.contains('modal-open')) {
                container.classList.add('loaded');
            }
        }, 50);
    }

    function disposeModal3D() {
        if (modal3DAnimationId) {
            cancelAnimationFrame(modal3DAnimationId);
            modal3DAnimationId = null;
        }
        if (modal3DListeners) {
            if (modal3DListeners.container) {
                modal3DListeners.container.removeEventListener('mousedown', modal3DListeners.mousedown);
            }
            window.removeEventListener('mousemove', modal3DListeners.mousemove);
            window.removeEventListener('mouseup', modal3DListeners.mouseup);
            window.removeEventListener('resize', modal3DListeners.resize);
            modal3DListeners = null;
        }
        if (modal3DRenderer) {
            const container = document.getElementById('modal-3d-canvas-container');
            if (container && modal3DRenderer.domElement.parentNode === container) {
                container.removeChild(modal3DRenderer.domElement);
            }
            modal3DRenderer.dispose();
            modal3DRenderer = null;
        }
        if (modal3DMesh) {
            // Recursividad para grupos
            const disposeNode = (node) => {
                if (node.geometry) node.geometry.dispose();
                if (node.material) {
                    if (Array.isArray(node.material)) {
                        node.material.forEach(m => m.dispose());
                    } else {
                        node.material.dispose();
                    }
                }
            };
            if (modal3DMesh.traverse) {
                modal3DMesh.traverse(disposeNode);
            } else {
                disposeNode(modal3DMesh);
            }
            modal3DMesh = null;
        }
        modal3DScene = null;
        modal3DCamera = null;
    }

    function highlightCode(code) {
        if (!code) return '';
        // Escapar HTML primero para evitar inyección y romper etiquetas
        let escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Regex para resaltar: comentarios, strings, keywords, números y funciones conocidas
        const regex = /(#.*|\/\/.*)|(".*?"|'.*?'|`.*?`)|(\b(?:def|class|import|from|self|return|if|else|for|in|while|try|except|with|as|raise|const|let|var|function|async|await|new|and|or|not|is|lambda|pass|break|continue|yield|del|BEGIN|COMMIT|SELECT|FROM|WHERE|UPDATE|SET|INSERT|INTO|VALUES|FOR|UPDATE)\b)|(\b\d+\b)|(\b(?:print|int|str|len|dict|list|set|tuple|open|close|Exception|query|filter_by|first|add|commit|append|querySelector|querySelectorAll|addEventListener|PublicKeyCredential|faceapi|nets|loadFromUri|detectSingleFace|TinyFaceDetectorOptions|withFaceLandmarks|configure|GenerativeModel|generate_content|BeautifulSoup)\b)/g;

        return escaped.replace(regex, (match, comment, string, keyword, number, builtin) => {
            if (comment) return `<span class="code-comment">${comment}</span>`;
            if (string) return `<span class="code-str">${string}</span>`;
            if (keyword) return `<span class="code-kw">${keyword}</span>`;
            if (number) return `<span class="code-num">${number}</span>`;
            if (builtin) return `<span class="code-builtin">${builtin}</span>`;
            return match;
        });
    }

    function initModalTabs() {
        const tabBtns = document.querySelectorAll('.modal-tab-btn');
        const canvasContainer = document.getElementById('modal-3d-canvas-container');
        const canvasHint = document.querySelector('.canvas-3d-hint');
        const galleryContainer = document.getElementById('modal-gallery-container');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const tab = btn.getAttribute('data-tab');
                if (tab === 'wireframe') {
                    if (canvasContainer) canvasContainer.classList.remove('tab-hidden');
                    if (canvasHint) canvasHint.classList.remove('tab-hidden');
                    if (galleryContainer) galleryContainer.classList.add('tab-hidden');
                    // Forzar resize para que Three.js se reajuste si estaba oculto
                    if (modal3DRenderer && modal3DCamera) {
                        const w = canvasContainer.clientWidth;
                        const h = canvasContainer.clientHeight;
                        if (w > 0 && h > 0) {
                            modal3DCamera.aspect = w / h;
                            modal3DCamera.updateProjectionMatrix();
                            modal3DRenderer.setSize(w, h);
                        }
                    }
                } else {
                    if (canvasContainer) canvasContainer.classList.add('tab-hidden');
                    if (canvasHint) canvasHint.classList.add('tab-hidden');
                    if (galleryContainer) galleryContainer.classList.remove('tab-hidden');
                }
            });
        });
    }

    function openModal(projectKey) {
        const data = PROJECT_DATA[projectKey];
        if (!data) return;

        modalTag.textContent   = data.tag;
        modalTitle.textContent = data.title;
        modalDesc.textContent  = data.description;
        modalTechList.innerHTML = data.tech.map(t => `<li>${t}</li>`).join('');
        modalLearnMore.href = data.url;

        // Reset modal tabs to default (wireframe)
        const defaultTabBtn = document.querySelector('.modal-tab-btn[data-tab="wireframe"]');
        if (defaultTabBtn) {
            document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            defaultTabBtn.classList.add('active');
        }
        const canvasContainer = document.getElementById('modal-3d-canvas-container');
        const canvasHint = document.querySelector('.canvas-3d-hint');
        const galleryContainer = document.getElementById('modal-gallery-container');
        if (canvasContainer) canvasContainer.classList.remove('tab-hidden');
        if (canvasHint) canvasHint.classList.remove('tab-hidden');
        if (galleryContainer) galleryContainer.classList.add('tab-hidden');

        // Renderizar capturas de pantalla reales en la pestaña de galería
        const galleryGrid = document.getElementById('modalGalleryGrid');
        if (galleryGrid) {
            if (data.screenshots && data.screenshots.length > 0) {
                galleryGrid.innerHTML = data.screenshots.map(src => `
                    <div class="gallery-screenshot-card" data-src="${src}">
                        <img src="${src}" alt="Captura de ${data.title}">
                    </div>
                `).join('');
                
                // Evento click para abrir lightbox
                galleryGrid.querySelectorAll('.gallery-screenshot-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const src = card.getAttribute('data-src');
                        openFullscreen(src);
                    });
                    
                    // Asociar eventos del cursor personalizado
                    card.addEventListener('mouseenter', () => {
                        if (cursor) {
                            cursor.classList.remove('hovered');
                            cursor.classList.add('project-hover');
                            if (cursor2) cursor2.style.opacity = '0';
                        }
                    });
                    card.addEventListener('mouseleave', () => {
                        if (cursor) {
                            cursor.classList.remove('project-hover');
                            if (cursor2) cursor2.style.opacity = '1';
                        }
                    });
                });
            } else {
                galleryGrid.innerHTML = '<p style="color: rgba(255,255,255,0.3); text-align: center; grid-column: 1/-1; padding: 2rem;">No hay capturas disponibles para este sistema.</p>';
            }
        }

        // Inyectar y resaltar código fuente
        const codeSnippetEl = document.getElementById('modalCodeSnippet');
        if (codeSnippetEl) {
            codeSnippetEl.innerHTML = highlightCode(data.code || '');
        }

        modalOverlay.classList.add('modal-open');
        document.body.style.overflow = 'hidden';

        // Inicializar canvas 3D con delay para animación CSS
        setTimeout(() => {
            initModal3D(projectKey);
        }, 120);

        // Forzar un segundo resize tras finalizar la animación CSS de apertura (750ms) para corregir aspect ratio
        setTimeout(() => {
            if (modal3DRenderer && modal3DCamera) {
                const container = document.getElementById('modal-3d-canvas-container');
                if (container) {
                    const w = container.clientWidth;
                    const h = container.clientHeight;
                    if (w > 0 && h > 0) {
                        modal3DCamera.aspect = w / h;
                        modal3DCamera.updateProjectionMatrix();
                        modal3DRenderer.setSize(w, h);
                    }
                }
            }
        }, 800);
    }
    window.openProjectModal = openModal;

    function closeModal() {
        modalOverlay.classList.remove('modal-open');
        document.body.style.overflow = '';
        
        // Quitar fade-in del canvas
        const container = document.getElementById('modal-3d-canvas-container');
        if (container) container.classList.remove('loaded');

        // Retrasar la destrucción del canvas 3D 750ms para que siga viéndose mientras el modal se desliza hacia abajo
        setTimeout(() => {
            if (!modalOverlay.classList.contains('modal-open')) {
                disposeModal3D();
            }
        }, 750);
    }

    function closeAllCards() {
        galleryCards.forEach(c => c.classList.remove('card-active'));
    }

    // Card interaction (Mobile fallback)
    galleryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Si el click fue en el menu (botón o link), no toggling
            if (e.target.closest('.card-menu')) return;
            
            // En dispositivos táctiles, alternamos la clase activa
            if (window.innerWidth <= 1024) {
                const isActive = card.classList.contains('card-active');
                closeAllCards();
                if (!isActive) card.classList.add('card-active');
            }
        });
    });

    // Info button → open modal
    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const key = btn.getAttribute('data-info');
            openModal(key);
        });
    });

    // Close modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Inicializar navegación de pestañas del modal
    initModalTabs();

    // Click fuera de cards → cierra el menú activo
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.horizontal-track .card')) {
            closeAllCards();
        }
    });

    /* =========================================
       10. VISOR FULLSCREEN (LIGHTBOX)
       ========================================= */
    const fsViewer  = document.getElementById('fullscreenViewer');
    const viewerImg = document.getElementById('viewerImg');
    const closeFs   = document.getElementById('closeViewer');

    function openFullscreen(src) {
        if (!fsViewer || !viewerImg) return;
        viewerImg.src = src;
        fsViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeFullscreen() {
        if (!fsViewer) return;
        fsViewer.classList.remove('active');
        // Solo restaurar el scroll si el modal de proyecto no está abierto
        if (!document.getElementById('projectModalOverlay').classList.contains('modal-open')) {
            document.body.style.overflow = '';
        }
    }

    if (closeFs) closeFs.addEventListener('click', closeFullscreen);
    if (fsViewer) {
        fsViewer.addEventListener('click', (e) => {
            if (e.target !== viewerImg) closeFullscreen();
        });
    }

    // Tecla ESC para cerrar todo
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeFullscreen();
            closeModal();
            closeAllCards();
        }
    });

    /* =========================================================
       11. NÚCLEO DIGITAL 3D (THREE.JS)
       ========================================================= */
        // Objeto global de comunicación para scrollytelling WebGL
    window.vanta3D = {
        progress: 0,
        glitch: 0,
        packets: 0
    };

            function initPhilosophy3D() {
        const canvas = document.getElementById('philosophy-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const container = canvas.parentElement;
        const width = container.clientWidth || 300;
        const height = container.clientHeight || 300;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.z = 6.2;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        // Exactly 64 nodes to map 1-to-1 to a 4x4x4 grid (no duplicates/overlap)
        const nodeCount = 64;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(nodeCount * 3);
        const nodeData = [];
        const cubePositions = [];

        // 1. Generate chaotic initial state (beautiful spherical layout)
        for (let i = 0; i < nodeCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 1.3 + Math.random() * 0.45; // tighter spherical shell

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i*3] = x;
            positions[i*3+1] = y;
            positions[i*3+2] = z;

            nodeData.push(new THREE.Vector3(x, y, z));
        }

        // 2. Generate target grid cube positions (perfect 4x4x4 layout)
        const cubeSize = 2.1;
        const stepSize = cubeSize / 3; // 4 nodes = 3 steps
        for (let i = 0; i < nodeCount; i++) {
            const z = Math.floor(i / 16) % 4;
            const y = Math.floor(i / 4) % 4;
            const x = i % 4;

            const cx = x * stepSize - cubeSize / 2;
            const cy = y * stepSize - cubeSize / 2;
            const cz = z * stepSize - cubeSize / 2;

            cubePositions.push(new THREE.Vector3(cx, cy, cz));
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // 3. Generate connection lines along orthogonal axes of the grid only (no diagonal jumble)
        const connections = [];
        for (let z = 0; z < 4; z++) {
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    const i = x + y * 4 + z * 16;
                    if (x < 3) connections.push({ i, j: i + 1 });
                    if (y < 3) connections.push({ i, j: i + 4 });
                    if (z < 3) connections.push({ i, j: i + 16 });
                }
            }
        }

        const lineCount = connections.length;
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(lineCount * 2 * 3);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

        // Create glowing radial circular dot particle texture for elegant point look
        function createCircleTexture(colorStr) {
            const matCanvas = document.createElement('canvas');
            matCanvas.width = 32;
            matCanvas.height = 32;
            const matCtx = matCanvas.getContext('2d');
            
            const grad = matCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.22, colorStr);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            
            matCtx.fillStyle = grad;
            matCtx.fillRect(0, 0, 32, 32);
            
            const tex = new THREE.CanvasTexture(matCanvas);
            tex.needsUpdate = true;
            return tex;
        }

        const primaryColorStr = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#11d483';

        // Elegant PointsMaterial using texture and real 3D depth attenuation
        const nodeMaterial = new THREE.PointsMaterial({
            size: 0.17,
            sizeAttenuation: true,
            map: createCircleTexture(primaryColorStr),
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Thin, sharp blueprints style line material
        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(primaryColorStr),
            transparent: true,
            opacity: 0.28,
            linewidth: 1,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, nodeMaterial);
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

        const group = new THREE.Group();
        group.add(points);
        group.add(lines);
        scene.add(group);

        const clock = new THREE.Clock();
        const nodesCurrent = Array.from({ length: nodeCount }, () => new THREE.Vector3());

        // Parallax states
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.45;
            targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.45;
        });

        container.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });

        let isPhilosophyVisible = false;
        const philosophyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isPhilosophyVisible = entry.isIntersecting;
            });
        }, { threshold: 0.01 });
        philosophyObserver.observe(canvas);

        function animateLocal() {
            requestAnimationFrame(animateLocal);
            if (!isPhilosophyVisible) return;

            const time = clock.getElapsedTime();
            const progress = (window.vanta3D && window.vanta3D.progress) || 0;
            const glitchVal = (window.vanta3D && window.vanta3D.glitch) || 0;

            // Sync dynamic colors
            const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#11d483';
            nodeMaterial.color.setStyle('#ffffff'); // core stays white/bright
            lineMaterial.color.setStyle(activeColor);

            // Interpolate Positions: Chaos Sphere (0.0) -> Ordered Grid Cube (1.0)
            const posAttr = geometry.getAttribute('position');
            for (let i = 0; i < nodeCount; i++) {
                const orig = nodeData[i];
                const target = cubePositions[i];

                let tx = THREE.MathUtils.lerp(orig.x, target.x, progress);
                let ty = THREE.MathUtils.lerp(orig.y, target.y, progress);
                let tz = THREE.MathUtils.lerp(orig.z, target.z, progress);

                // Chaotic organic wavelike float (decreases as progress reaches 1.0)
                const floatAmt = (1.0 - progress) * 0.08;
                tx += Math.sin(time * 1.5 + i) * floatAmt;
                ty += Math.cos(time * 1.2 + i) * floatAmt;
                tz += Math.sin(time * 0.8 + i) * floatAmt;

                // Glitch effect on error/chaos chapter
                if (progress < 0.35 && glitchVal > 0.05) {
                    tx += (Math.random() - 0.5) * glitchVal * 0.25;
                    ty += (Math.random() - 0.5) * glitchVal * 0.25;
                    tz += (Math.random() - 0.5) * glitchVal * 0.25;
                }

                posAttr.setXYZ(i, tx, ty, tz);
                nodesCurrent[i].set(tx, ty, tz);
            }
            posAttr.needsUpdate = true;

            // Update line positions
            const linePosAttr = lineGeometry.getAttribute('position');
            let lineIdx = 0;
            for (let c = 0; c < connections.length; c++) {
                const conn = connections[c];
                const n1 = nodesCurrent[conn.i];
                const n2 = nodesCurrent[conn.j];
                linePosAttr.setXYZ(lineIdx++, n1.x, n1.y, n1.z);
                linePosAttr.setXYZ(lineIdx++, n2.x, n2.y, n2.z);
            }
            linePosAttr.needsUpdate = true;

            // Interpolate mouse parallax
            mouseX += (targetX - mouseX) * 0.08;
            mouseY += (targetY - mouseY) * 0.08;

            // Auto-rotation + mouse parallax tilt
            group.rotation.y = time * 0.09 + mouseX;
            group.rotation.x = time * 0.04 + mouseY;

            renderer.render(scene, camera);
        }

        // Local resize handler
        const resizeLocal = () => {
            const w = container.clientWidth || 300;
            const h = container.clientHeight || 300;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', resizeLocal);
        resizeLocal();

        animateLocal();
    }

    function init3DCore() {
        
        const container = document.getElementById('canvas-3d-container');
        if (!container) return;
        if (typeof THREE === 'undefined') {
            throw new Error("Three.js library is not loaded! THREE is undefined.");
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 7.5);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        // 1. Crear Textura Programática de Partícula con Gradiente Radial
        function createParticleTexture() {
            const canvas = document.createElement('canvas');
            const size = 32;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size / 2;

            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
            gradient.addColorStop(0.3, 'rgba(17,212,131,0.85)');
            gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
            
            // Define the circular path for the particle shape
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.closePath();
            
            ctx.fillStyle = gradient;
            ctx.fill();

            const tex = new THREE.CanvasTexture(canvas);
            tex.needsUpdate = true;
            return tex;
        }

        // 2. Configuración de 1,200 Partículas del V-Shockwave Core (Optimizado para 60 FPS)
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
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Material premium con AdditiveBlending y tamaño aumentado para densidad
        const logoMaterial = new THREE.PointsMaterial({
            size: 7.0,              // 7 píxeles de pantalla exactos
            sizeAttenuation: false, // Desactivar atenuación para nitidez perfecta sin importar la cámara
            map: createParticleTexture(),
            vertexColors: true,
            transparent: true,
            opacity: 0.0,           // Inicia invisible, se anima en la entrada
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            alphaTest: 0.005
        });

        const points = new THREE.Points(geometry, logoMaterial);
        
        const logoGroup = new THREE.Group();
        logoGroup.add(points);
        logoGroup.scale.setScalar(0.0001); // Escala inicial cero
        scene.add(logoGroup);

        // 3. Crear Terreno de Rejilla Vectorial (PlaneGeometry para el fondo)
        const terrainGeometry = new THREE.PlaneGeometry(45, 45, 28, 28);
        const terrainMaterial = new THREE.MeshBasicMaterial({
            color: 0x11d483,
            wireframe: true,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending
        });

        const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrainMesh.rotation.x = -Math.PI / 2.2;
        terrainMesh.position.set(0, -2.5, -2.0);
        scene.add(terrainMesh);

        // Guardar posiciones originales de la rejilla
        const terrainPosAttr = terrainGeometry.getAttribute('position');
        const originalZ = new Float32Array(terrainPosAttr.count);
        for (let i = 0; i < terrainPosAttr.count; i++) {
            originalZ[i] = terrainPosAttr.getZ(i);
        }

        // Posicionamiento responsivo del logo
        const updateLogoPosition = () => {
            if (window.innerWidth > 991) {
                logoGroup.position.x = 3.3; // Totalmente a la derecha en escritorio
            } else {
                logoGroup.position.x = 0;   // Centrado en móviles
            }
        };
        updateLogoPosition();

        // Variables de interacción y física de scroll
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        let lastScrollY = window.scrollY || window.pageYOffset;
        let scrollVelocity = 0;
        let flowOffset = 0;
        let logoScaleObj = { value: 0.0001 };
        let logoRotationObj = { y: 3.5 };

        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - window.innerWidth / (window.innerWidth > 991 ? 1.4 : 2)) * 0.0006;
            targetY = (e.clientY - window.innerHeight / 2) * 0.0006;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updateLogoPosition();
        });

        // Disparador de Shockwaves al hacer click en el Hero
        window.addEventListener('click', (e) => {
            if (window.scrollY < window.innerHeight * 0.8) {
                triggerShockwave({ amplitude: 7.5, speed: 12.0, width: 0.8, decay: 1.25 });
            }
        });

        function triggerShockwave(opts = {}) {
            const { amplitude = 7.5, speed = 12.0, width = 0.8, decay = 1.25 } = opts;
            shockwaves.push({ t0: clock.getElapsedTime(), amplitude, speed, width, decay });
            if (shockwaves.length > 5) shockwaves.shift();
        }

        // 4. Función global de entrada elástica de la V + Flash
        window.play3DVEntranceAnimation = function() {
            
            if (typeof gsap !== 'undefined') {
                gsap.killTweensOf(logoScaleObj);
                gsap.killTweensOf(logoRotationObj);
                
                gsap.fromTo(logoScaleObj,
                    { value: 0.0001 },
                    { value: 1.0, duration: 2.2, ease: 'elastic.out(0.85, 0.68)' }
                );
                
                gsap.fromTo(logoRotationObj,
                    { y: 3.5 },
                    { y: 0.0, duration: 2.8, ease: 'power2.out' }
                );
            } else {
                logoScaleObj.value = 1.0;
                logoRotationObj.y = 0.0;
            }
            
            // Destello flash blanco (se lerpea en el bucle animate)
            logoMaterial.color.setRGB(2.0, 2.0, 2.0);
        };

        // Resiliencia: si las cortinas ya se abrieron, arrancar animación
        const curtainA = document.querySelector('.hero-curtain.curtain-a');
        const preloaderEl = document.getElementById('preloader');
        if (!curtainA || curtainA.classList.contains('opened') || (preloaderEl && preloaderEl.style.display === 'none')) {
            setTimeout(() => {
                if (window.play3DVEntranceAnimation) window.play3DVEntranceAnimation();
            }, 100);
        }

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const time = clock.getElapsedTime();
            const currentScroll = window.scrollY || window.pageYOffset;
            const deltaScroll = currentScroll - lastScrollY;
            lastScrollY = currentScroll;


            const transitionLimit = window.innerHeight * 1.2;
            const progress = Math.min(currentScroll / transitionLimit, 1.0);

            scrollVelocity += (Math.abs(deltaScroll) - scrollVelocity) * 0.08;
            const clampedVelocity = Math.min(scrollVelocity, 120);

            // 2. Colores neón dinámicos con Lerp suave (Optimizado sin reflows)
            let primaryColor = new THREE.Color(0x11d483);
            if (window.currentPrimaryColor) {
                primaryColor.setStyle(window.currentPrimaryColor);
            }

            logoMaterial.color.lerp(primaryColor, 0.06);
            terrainMaterial.color.lerp(primaryColor, 0.06);

            // 3. Físicas de Partículas en la "V"
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;
            
            if (currentScroll <= window.innerHeight * 1.2) {
                // Settle into a gentle sway plus mouse tilt, preserving the entrance rotation
                const swayY = Math.sin(time * 0.2) * 0.08;
                const swayX = Math.cos(time * 0.15) * 0.04;
                logoGroup.rotation.y = logoRotationObj.y + swayY + mouseX * 0.65;
                logoGroup.rotation.x = swayX + mouseY * 0.55;

                const logoOpacity = Math.max(0, 1.0 - progress * 2.5);
                logoMaterial.opacity = logoOpacity * 0.85;
                
                logoGroup.scale.setScalar(0.92 * (1.0 - progress * 0.35) * logoScaleObj.value);
                logoGroup.position.y = progress * 3.2;
            } else {
                logoMaterial.opacity = 0;
            }

            if (currentScroll <= window.innerHeight * 1.2) {
                // Actualizar posiciones de las partículas con matemáticas optimizadas (sin Math.sqrt interno)
            const posAttr = geometry.getAttribute('position');
            const colAttr = geometry.getAttribute('color');
            const posArray = posAttr.array;
            const colArray = colAttr.array;

            // Ondulación y latido de energía ascendente
            const waveSpeed = 1.3;
            const waveFreqY = 0.75;
            const waveFreqX = 0.55;
            
            // Pulso de energía vertical que sube desde abajo (y = -1.6) hasta arriba (y = 2.0)
            const pulseSpeed = 1.6;
            const pulseLength = 1.1; // Ancho de la onda del pulso
            const pulseCycle = 5.0;  // Tiempo de ciclo completo
            const pulseCenter = -1.6 + ((time * pulseSpeed) % (3.6 + pulseLength));

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const home = nodeData[i];
                const dist = homeDistances[i]; // Distancia precalculada

                // 1. Calcular Viento Ondulatorio 3D continuo
                const waveX = Math.sin(time * waveSpeed + home.y * waveFreqY) * 0.12;
                const waveY = Math.cos(time * waveSpeed * 0.85 + home.x * waveFreqX) * 0.08;
                const waveZ = Math.sin(time * waveSpeed * 1.1 + (home.x + home.y) * 0.5) * 0.08;

                // 2. Latido Cuántico de Energía Ascendente
                const distToPulse = Math.abs(home.y - pulseCenter);
                let pulseFactor = 0.0;
                if (distToPulse < pulseLength) {
                    pulseFactor = Math.cos((distToPulse / pulseLength) * Math.PI * 0.5);
                }

                // Desplazamiento ligero hacia afuera al paso del pulso (efecto abombamiento)
                const pulseDisplace = pulseFactor * 0.07;
                const dirX = home.x > 0 ? 1.0 : -1.0;

                // Calcular Shockwaves (Ondas Expansivas al hacer Click)
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

                // Target final combinado (Oscilación base + Desplazamiento de pulso + Ondas expansivas)
                let curTargetX = home.x + waveX + (dirX * pulseDisplace) + addX;
                let curTargetY = home.y + waveY + addY;
                let curTargetZ = home.z + waveZ + addZ;

                const lerpFactor = 0.085;

                // Suavizar posición física
                posArray[i3]     += (curTargetX - posArray[i3]) * lerpFactor;
                posArray[i3 + 1] += (curTargetY - posArray[i3 + 1]) * lerpFactor;
                posArray[i3 + 2] += (curTargetZ - posArray[i3 + 2]) * lerpFactor;

                // 3. Brillo neón dinámico (Oscilación individual + Aumento al paso del pulso)
                let baseBright = 0.55 + Math.sin(time * 2.2 + (i % 8)) * 0.12;
                // El pulso hace brillar intensamente en verde/blanco neón
                let bright = baseBright + pulseFactor * 1.1; 
                
                colArray[i3]     = logoMaterial.color.r * bright;
                colArray[i3 + 1] = logoMaterial.color.g * bright;
                colArray[i3 + 2] = logoMaterial.color.b * bright;
            }
            posAttr.needsUpdate = true;
            colAttr.needsUpdate = true;
            }

            // Filtrar shockwaves vencidas
            if (shockwaves.length) {
                shockwaves = shockwaves.filter(sw => {
                    const elapsed = time - sw.t0;
                    return elapsed < 3.0;
                });
            }

            // 5. Animación de Olas del Terreno Vectorial
            flowOffset += 0.012 + clampedVelocity * 0.0018;
            const amplitudeFactor = 0.4 + clampedVelocity * 0.007;

            const terrainPos = terrainGeometry.getAttribute('position');
            for (let i = 0; i < terrainPos.count; i++) {
                const x = terrainPos.getX(i);
                const y = terrainPos.getY(i);
                const waveHeight = Math.sin(x * 0.18 + y * 0.14 - flowOffset) * amplitudeFactor;
                terrainPos.setZ(i, originalZ[i] + waveHeight);
            }
            terrainPos.needsUpdate = true;

            const terrainOpacity = Math.min(0.22, progress * 1.6);
            terrainMaterial.opacity = terrainOpacity;

            terrainMesh.rotation.x = -Math.PI / 2.2 + clampedVelocity * 0.0006;

            renderer.render(scene, camera);
        }

        animate();
    }
    /* =========================================================
       12. LENIS SMOOTH SCROLL (INERCIAL UNIFICADO)
       ========================================================= */
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            lerp: 0.08, // Fricción reducida para máxima suavidad Awwwards
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.0,
            smoothTouch: false,
            touchMultiplier: 1.2,
            infinite: false,
        });
        window.lenis = lenis;

        // Pause Lenis during preload
        const preloaderEl = document.getElementById('preloader');
        if (preloaderEl && preloaderEl.style.display !== 'none') {
            lenis.stop();
        }

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Enlaces de navegación con scroll suave vía Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    // duration: 1.2 segundos para una transición suave y elegante
                    lenis.scrollTo(target, { offset: 0, duration: 1.2 });
                }
            });
        });
    }

    /* =========================================================
       13. SCROLL HORIZONTAL (PORTAFOLIO)
       ========================================================= */
    const portfolioContainer = document.querySelector('.portfolio-scroll-container');
    const horizontalTrack    = document.querySelector('.horizontal-track');
    
    // Cache de dimensiones para evitar getBoundingClientRect en scroll
    let portfolioTop = 0;
    let portfolioHeight = 0;
    let maxTranslate = 0;

    function cachePortfolioLayout() {
        if (!portfolioContainer || !horizontalTrack) return;
        // offsetTop nos da la posición acumulada desde el inicio de la página sin forzar reflow pesado
        let top = 0;
        let obj = portfolioContainer;
        while (obj) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        portfolioTop = top;
        portfolioHeight = portfolioContainer.offsetHeight;
        maxTranslate = horizontalTrack.scrollWidth - window.innerWidth;
    }

    function handleHorizontalScroll(scrollY) {
        if (!portfolioContainer || !horizontalTrack || window.innerWidth <= 991) {
            if (horizontalTrack) horizontalTrack.style.transform = 'none';
            return;
        }

        const startOffset = scrollY - portfolioTop;
        const maxScroll = portfolioHeight - window.innerHeight;
        
        let progress = startOffset / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        const translateX = -progress * maxTranslate;
        horizontalTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;

        // Parallax horizontal multicapa para los elementos de las tarjetas
        const cards = horizontalTrack.querySelectorAll('.card');
        const viewportW = window.innerWidth;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const viewportCenterX = viewportW / 2;

            let offset = (cardCenterX - viewportCenterX) / (viewportW / 2);
            offset = Math.max(-1.5, Math.min(1.5, offset));

            // Inyectar variables en la tarjeta
            card.style.setProperty('--card-parallax-bg', `${offset * 30}px`);
            card.style.setProperty('--card-parallax-fg', `${offset * -45}px`);
        });
    }

    /* =========================================================
       14. SCROLL INVERTIDO (SERVICIOS)
       ========================================================= */
    const servicesContainer = document.querySelector('.services-scroll-container');
    const invertedTrack     = document.querySelector('.services-inverted-track');
    const textItems         = document.querySelectorAll('.service-text-item');

    let servicesTop = 0;
    let servicesHeight = 0;

    function cacheServicesLayout() {
        if (!servicesContainer) return;
        let top = 0;
        let obj = servicesContainer;
        while (obj) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        servicesTop = top;
        servicesHeight = servicesContainer.offsetHeight;
    }

    function handleInvertedScroll(scrollY) {
        if (!servicesContainer || !invertedTrack || window.innerWidth <= 991) {
            if (invertedTrack) invertedTrack.style.transform = 'none';
            return;
        }

        const startOffset = scrollY - servicesTop;
        const maxScroll = servicesHeight - window.innerHeight;
        
        let progress = startOffset / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        const translateValue = -200 + (progress * 200);
        invertedTrack.style.transform = `translate3d(0, ${translateValue}vh, 0)`;

        let activeIndex = 0;
        if (progress > 0.33 && progress <= 0.66) {
            activeIndex = 1;
        } else if (progress > 0.66) {
            activeIndex = 2;
        }

        textItems.forEach((item, index) => {
            if (index === activeIndex) {
                if (!item.classList.contains('active')) item.classList.add('active');
            } else {
                if (item.classList.contains('active')) item.classList.remove('active');
            }
        });
    }

    /* =========================================================
       14b. SCROLL LOCK METODOLOGÍA (PIPELINE & TERMINAL)
       ========================================================= */
    const methodologyContainer = document.querySelector('.methodology-scroll-container');
    const pipelineProgress     = document.querySelector('.pipeline-progress-bar');
    const methodSteps          = document.querySelectorAll('.methodology-left .method-step');
    const consoleScreens       = document.querySelectorAll('.cyber-terminal .console-screen');

    let methodologyTop = 0;
    let methodologyHeight = 0;

    function cacheMethodologyLayout() {
        if (!methodologyContainer) return;
        let top = 0;
        let obj = methodologyContainer;
        while (obj) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        methodologyTop = top;
        methodologyHeight = methodologyContainer.offsetHeight;
    }

    function handleMethodologyScroll(scrollY) {
        if (!methodologyContainer || window.innerWidth <= 991) {
            methodSteps.forEach(step => step.classList.add('active'));
            return;
        }

        const startOffset = scrollY - methodologyTop;
        const maxScroll = methodologyHeight - window.innerHeight;
        
        let progress = startOffset / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        // Actualizar barra de progreso vertical
        if (pipelineProgress) {
            pipelineProgress.style.height = (progress * 100) + '%';
        }

        // Determinar paso activo (4 pasos en total: dividimos por rangos de 0.25)
        let activeStep = 1;
        if (progress > 0.25 && progress <= 0.5) {
            activeStep = 2;
        } else if (progress > 0.5 && progress <= 0.75) {
            activeStep = 3;
        } else if (progress > 0.75) {
            activeStep = 4;
        }

        // Activar la tarjeta de paso correspondiente
        methodSteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'), 10);
            if (stepNum === activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Activar la pantalla de la terminal correspondiente
        consoleScreens.forEach(screen => {
            const screenNum = parseInt(screen.getAttribute('data-console-step'), 10);
            if (screenNum === activeStep) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        });
    }

    // Calcular layouts iniciales y en cada resize
    function updateLayoutCache() {
        cachePortfolioLayout();
        cacheServicesLayout();
        cacheMethodologyLayout();
    }
    window.addEventListener('resize', updateLayoutCache, { passive: true });

    // Scroll listener unificado y súper optimizado
    function handleScrollUnified(scrollY) {
        currentScrollY = scrollY;
        
        // Parallax del Hero
        if (scrollY < 800) {
            if (heroContent) {
                heroContent.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
                heroContent.style.opacity   = 1 - scrollY / 650;
            }
            if (heroBlueprintContainer) {
                const factor = scrollY / (heroH || 800);
                heroBlueprintContainer.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0) scale(${1 - factor * 0.06})`;
            }
        }

        // Actualizar navbar
        updateNavbar(scrollY);

        // Scroll horizontal e invertido y metodología
        handleHorizontalScroll(scrollY);
        handleInvertedScroll(scrollY);
        handleMethodologyScroll(scrollY);
    }

    if (lenis) {
        lenis.on('scroll', (e) => {
            // Sincronizado directamente al RAF de Lenis
            handleScrollUnified(e.scroll);
        });
    } else {
        window.addEventListener('scroll', () => {
            handleScrollUnified(window.scrollY || window.pageYOffset);
        }, { passive: true });
    }

    // Intersection Observer para textos revelables (Costo de rendimiento = 0)
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-text').forEach(el => {
        revealObserver.observe(el);
    });

    // Lanzar al cargar
    setTimeout(() => {
        updateLayoutCache();
        const scrollY = window.scrollY || window.pageYOffset;
        handleHorizontalScroll(scrollY);
        handleInvertedScroll(scrollY);
        handleMethodologyScroll(scrollY);
        init3DCore();
        initPhilosophy3D();
        
        // Activar textos iniciales en Hero
        document.querySelectorAll('.hero-content .reveal-text').forEach(el => {
            el.classList.add('active');
        });
    }, 150);

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMainScript);
} else {
    initMainScript();
}