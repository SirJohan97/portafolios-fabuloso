/* =========================================
   INICIO DEL SCRIPT - ESPERA A QUE EL DOM ESTÉ LISTO
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MENÚ MÓVIL (HAMBURGUESA)
       ========================================= */
    
    /* Selección de elementos del menú móvil */
    const menuToggle = document.querySelector('.menu-toggle');  // Botón hamburguesa
    const navLinks = document.querySelector('.nav-links');       // Contenedor del menú
    const links = document.querySelectorAll('.nav-links a');    // Todos los enlaces del menú

    /* Evento click en el botón hamburguesa para abrir/cerrar menú */
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');              // Muestra/oculta el menú
            menuToggle.classList.toggle('fa-times');         // Cambia el icono a X
        });
    }

    /* Cierra el menú cuando se hace click en cualquier enlace */
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');             // Oculta el menú
            menuToggle.classList.remove('fa-times');        // Restaura el icono hamburguesa
        });
    });

    /* =========================================
       2. ANIMACIONES AL HACER SCROLL
       ========================================= */
    
    /* Configuración del Intersection Observer para elementos generales */
    const observerOptions = {
        root: null,           // Usa el viewport como contenedor
        threshold: 0.15,      // Se activa cuando el 15% del elemento es visible
        rootMargin: "0px"     // Sin margen adicional
    };

    /* Observer para elementos con clase .hidden (títulos, textos, etc.) */
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
       2.1. ANIMACIONES ESPECÍFICAS PARA TARJETAS DE PROYECTOS
       ========================================= */
    
    /* Configuración específica para tarjetas con umbral más bajo */
    const cardObserverOptions = {
        root: null,
        threshold: 0.1,        // Se activa más temprano (10% visible)
        rootMargin: "50px"    // Margen para activar antes de entrar completamente
    };

    /* Observer dedicado para las tarjetas de proyectos */
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Agrega un pequeño delay escalonado para efecto cascada
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // 100ms de diferencia entre cada tarjeta
                observer.unobserve(entry.target);
            }
        });
    }, cardObserverOptions);

    /* Observa todas las tarjetas de proyectos */
    const projectCards = document.querySelectorAll('.gallery-grid .card');
    projectCards.forEach((card) => {
        cardObserver.observe(card);
    });

    /* =========================================
       3. EFECTO PARALLAX SUAVE EN EL HERO
       ========================================= */
    
    /* Selección del contenido del hero */
    const heroContent = document.querySelector('.hero-content');
    
    /* Evento de scroll para crear efecto parallax */
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;  // Posición actual del scroll
        
        /* Solo aplica el efecto en los primeros 800px de scroll */
        if (scrollPosition < 800 && heroContent) {
            /* Mueve el contenido hacia abajo con velocidad reducida (0.4x) */
            heroContent.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            /* Reduce la opacidad gradualmente hasta desaparecer */
            heroContent.style.opacity = 1 - scrollPosition / 600;
        }
    });

    /* =========================================
       4. CURSOR PERSONALIZADO
       ========================================= */
    
    /* Selección de los elementos del cursor personalizado */
    const cursor = document.querySelector('.cursor');   // Cursor grande (anillo)
    const cursor2 = document.querySelector('.cursor2'); // Cursor pequeño (punto)
    
    /* Solo activar en pantallas grandes (para no molestar en móviles) */
    if (window.innerWidth > 991) {
        /* Evento de movimiento del mouse para seguir el cursor */
        document.addEventListener('mousemove', function(e){
            /* Actualiza la posición del cursor pequeño (punto) */
            cursor2.style.left = e.clientX + "px";
            cursor2.style.top = e.clientY + "px";
            /* Actualiza la posición del cursor grande (anillo) */
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });

        /* Efecto hover en elementos interactivos */
        const linksAndButtons = document.querySelectorAll('a, button, .card, .logo');
        linksAndButtons.forEach(item => {
            /* Agrega clase 'hovered' cuando el mouse entra al elemento */
            item.addEventListener('mouseover', () => cursor.classList.add('hovered'));
            /* Remueve clase 'hovered' cuando el mouse sale del elemento */
            item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    /* =========================================
       5. EFECTO MÁQUINA DE ESCRIBIR (Typing)
       ========================================= */
    
    /* Selección del elemento donde se mostrará el texto animado */
    const textElement = document.querySelector('.typing-text');
    
    /* Array de palabras que se mostrarán en el efecto typing */
    const words = ["Experiencias.", "Innovación.", "Tecnología.", "Tu Futuro."];
    
    /* Variables de control del efecto typing */
    let wordIndex = 0;      // Índice de la palabra actual
    let charIndex = 0;      // Índice del carácter actual
    let isDeleting = false; // Indica si está borrando o escribiendo

    /* Función recursiva que crea el efecto de máquina de escribir */
    function typeEffect() {
        /* Verifica que el elemento exista antes de continuar */
        if (!textElement) return;

        /* Obtiene la palabra actual del array */
        const currentWord = words[wordIndex];
        
        /* Modo borrado: elimina caracteres uno por uno */
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex--);
            /* Cuando termina de borrar, pasa a la siguiente palabra */
            if (charIndex < 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;  // Cicla al inicio si llega al final
                setTimeout(typeEffect, 500);  // Espera 500ms antes de empezar a escribir
                return;
            }
        } 
        /* Modo escritura: agrega caracteres uno por uno */
        else {
            textElement.textContent = currentWord.substring(0, charIndex++);
            /* Cuando termina de escribir, espera y luego borra */
            if (charIndex > currentWord.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000); // Espera 2 segundos antes de borrar
                return;
            }
        }
        
        /* Velocidad de escritura/borrado (más rápido al borrar) */
        const speed = isDeleting ? 100 : 150;
        setTimeout(typeEffect, speed);
    }

    /* Inicia el efecto typing */
    typeEffect();
});