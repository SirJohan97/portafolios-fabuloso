/* =========================================
   INICIO DEL SCRIPT
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

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
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < 800 && heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
            heroContent.style.opacity   = 1 - scrollY / 650;
        }
    }, { passive: true });

    /* =========================================
       5. CURSOR PERSONALIZADO
       ========================================= */
    const cursor  = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');

    if (window.innerWidth > 991 && cursor) {
        document.addEventListener('mousemove', e => {
            cursor2.style.left = e.clientX + "px";
            cursor2.style.top  = e.clientY + "px";
            cursor.style.left  = e.clientX + "px";
            cursor.style.top   = e.clientY + "px";
        });

        document.querySelectorAll('a, button, .card, .logo, .service-card, .team-card, .method-step, .testimonial-card, .pricing-card').forEach(item => {
            item.addEventListener('mouseover',  () => cursor.classList.add('hovered'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    /* =========================================
       6. EFECTO MÁQUINA DE ESCRIBIR
       ========================================= */
    const textElement = document.querySelector('.typing-text');
    const words       = ["Experiencias.", "Innovación.", "Tecnología.", "Tu Futuro."];
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

            const textoMensaje = `¡Hola! Vengo del portafolio y quiero cotizar un proyecto.%0A%0A*Nombre:* ${encodeURIComponent(nombre)}%0A*Correo:* ${encodeURIComponent(email)}%0A*Requerimiento:* ${encodeURIComponent(mensaje)}`;
            const numeroWa     = "584127121162";
            const urlWa        = `https://wa.me/${numeroWa}?text=${textoMensaje}`;

            window.open(urlWa, '_blank', 'noopener,noreferrer');
        });
    }

    /* =========================================
       8. NAVBAR SMART HIDE-ON-SCROLL
       ========================================= */
    const navbar = document.querySelector('.navbar');
    let lastScrollY   = window.scrollY;
    let ticking       = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollDiff     = currentScrollY - lastScrollY;

        // Solidify background once past the hero
        if (currentScrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide when scrolling down (past 120px) — show when scrolling up
        if (currentScrollY > 120) {
            if (scrollDiff > 4) {
                // Scrolling DOWN → hide
                navbar.classList.add('nav-hidden');
            } else if (scrollDiff < -4) {
                // Scrolling UP → reveal
                navbar.classList.remove('nav-hidden');
            }
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
});