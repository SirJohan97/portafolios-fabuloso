document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MENÚ MÓVIL (HAMBURGUESA)
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Al hacer clic en el icono, abre/cierra el menú
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animación simple del icono (opcional: cambia icono bars a X)
        menuToggle.classList.toggle('fa-times'); 
    });

    // Al hacer clic en un enlace del menú, cerrar el menú automáticamente
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('fa-times');
        });
    });


    /* =========================================
       2. ANIMACIONES AL HACER SCROLL
       (Intersection Observer API)
       ========================================= */
    
    const observerOptions = {
        root: null,     // Usa el viewport del navegador
        threshold: 0.15, // Se activa cuando el 15% del elemento es visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento entra en pantalla
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Deja de observar (anima solo una vez)
            }
        });
    }, observerOptions);

    // Seleccionamos todos los elementos con la clase '.hidden' en el HTML
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));


    /* =========================================
       3. EFECTO PARALLAX SUAVE EN EL HERO
       ========================================= */
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Solo aplica el efecto si estamos cerca del top para ahorrar recursos
        if (scrollPosition < 800) {
            // Mueve el texto hacia abajo más lento que el scroll
            heroContent.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            // Desvanece el texto al bajar
            heroContent.style.opacity = 1 - scrollPosition / 600;
        }
    });

});