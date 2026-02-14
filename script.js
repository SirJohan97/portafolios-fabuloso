document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MENÚ MÓVIL (HAMBURGUESA)
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('fa-times'); 
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('fa-times');
        });
    });

    /* =========================================
       2. ANIMACIONES AL HACER SCROLL
       ========================================= */
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    /* =========================================
       3. EFECTO PARALLAX SUAVE EN EL HERO
       ========================================= */
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < 800 && heroContent) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            heroContent.style.opacity = 1 - scrollPosition / 600;
        }
    });

    /* =========================================
       4. CURSOR PERSONALIZADO
       ========================================= */
    const cursor = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');
    
    // Solo activar en pantallas grandes (para no molestar en móviles)
    if (window.innerWidth > 991) {
        document.addEventListener('mousemove', function(e){
            cursor2.style.left = e.clientX + "px";
            cursor2.style.top = e.clientY + "px";
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });

        // Efecto hover en elementos interactivos
        const linksAndButtons = document.querySelectorAll('a, button, .card, .logo');
        linksAndButtons.forEach(item => {
            item.addEventListener('mouseover', () => cursor.classList.add('hovered'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    /* =========================================
       5. EFECTO MÁQUINA DE ESCRIBIR (Typing)
       ========================================= */
    const textElement = document.querySelector('.typing-text');
    const words = ["Experiencias.", "Innovación.", "Tecnología.", "Tu Futuro."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!textElement) return;

        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex--);
            if (charIndex < 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 500);
                return;
            }
        } else {
            textElement.textContent = currentWord.substring(0, charIndex++);
            if (charIndex > currentWord.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000); // Espera 2 segundos antes de borrar
                return;
            }
        }
        
        const speed = isDeleting ? 100 : 150;
        setTimeout(typeEffect, speed);
    }

    typeEffect();
});