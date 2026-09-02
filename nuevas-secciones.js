/* =============================================================
   VANTA REDESIGN — NUEVAS SECCIONES JS
   Hero Typing Effect, SVIVA Pipeline Animation, ScrollTrigger reveals
   ============================================================= */
(function () {
    "use strict";

    /* --- SVIVA PIPELINE & TACTICAL TIMECODE --- */
    function initSvivaPipeline() {
        var steps = document.querySelectorAll(".sviva-pipe-step");
        if (steps.length) {
            var currentStep = 0;
            function activateStep(index) {
                steps.forEach(function(s, i) { s.classList.toggle("active", i === index); });
            }
            setInterval(function() { currentStep = (currentStep + 1) % steps.length; activateStep(currentStep); }, 1800);
        }

        // Live CCTV Timecode
        var tcEl = document.getElementById("svivaTimecode");
        if (tcEl) {
            function updateTc() {
                var now = new Date();
                var iso = now.toISOString().replace('T', ' ').replace('Z', ' UTC');
                tcEl.textContent = iso;
                requestAnimationFrame(updateTc);
            }
            requestAnimationFrame(updateTc);
        }

        console.log("[VANTA] SVIVA tactical HUD OK");
    }

    /* --- SCROLL REVEALS NUEVAS SECCIONES --- */
    function initNewSectionReveals() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        /* SVIVA */
        gsap.from(".sviva-eyebrow, .sviva-title, .sviva-subtitle", {
            y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: ".sviva-showcase-section", start: "top 78%" }
        });
        gsap.from(".sviva-feed-panel, .sviva-info-panel", {
            y: 40, opacity: 0, duration: 0.9, stagger: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: ".sviva-soc-wrapper", start: "top 82%" }
        });

        /* Capabilities */
        gsap.from(".cap-eyebrow, .cap-title, .cap-subtitle", {
            y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: ".capabilities-section", start: "top 78%" }
        });
        gsap.set(".cap-card", { opacity: 0, y: 30 });
        ScrollTrigger.batch(".cap-card", {
            start: "top 90%",
            onEnter: function(batch) {
                gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: "auto" });
            }
        });

        /* CyberSec */
        gsap.from(".cybersec-eyebrow, .cybersec-title, .cybersec-desc", {
            x: -30, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: ".cybersec-section", start: "top 78%" }
        });
        gsap.set(".ctb-badge", { opacity: 0, y: 15, scale: 0.9 });
        ScrollTrigger.batch(".ctb-badge", {
            start: "top 92%",
            onEnter: function(batch) {
                gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)", overwrite: "auto" });
            }
        });
        gsap.set(".owasp-card", { opacity: 0, y: 20 });
        ScrollTrigger.batch(".owasp-card", {
            start: "top 90%",
            onEnter: function(batch) {
                gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out", overwrite: "auto" });
            }
        });
        console.log("[VANTA] New section reveals OK");
    }

    /* --- MASCOT EASTER EGG --- */
    function initMascotEasterEgg() {
        document.addEventListener("keydown", function(e) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "M") {
                showMascotEgg();
            }
        });
    }

    function showMascotEgg() {
        if (document.querySelector(".mascot-easter-overlay")) return;
        var overlay = document.createElement("div");
        overlay.className = "mascot-easter-overlay";
        overlay.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);";
        overlay.innerHTML = '<div style="background:#0F1219;border:1px solid rgba(0,229,255,0.3);border-radius:16px;padding:2rem;max-width:520px;width:90%;position:relative;box-shadow:0 0 40px rgba(0,229,255,0.1);">' +
            '<div style="font-family:monospace;font-size:0.65rem;color:rgba(0,229,255,0.6);letter-spacing:0.1em;margin-bottom:1rem;">// CLASSIFIED_PERSONNEL.SYS — VANTA_INTERNAL</div>' +
            '<div style="display:flex;gap:1.5rem;align-items:flex-start;">' +
            '<img src="img/team/panafrescoo.jpeg" alt="El Pana Fresco" style="width:100px;height:100px;object-fit:cover;border-radius:12px;border:2px solid rgba(0,229,255,0.3);" onerror="this.style.display=\'none\'">' +
            '<div><h3 style="font-size:1.2rem;color:#E8EAF0;margin:0 0 0.3rem;">El Pana Fresco</h3>' +
            '<p style="font-family:monospace;font-size:0.6rem;color:#00E5FF;margin:0 0 0.6rem;letter-spacing:0.1em;">// CHIEF_MORALE_OFFICER</p>' +
            '<p style="font-size:0.82rem;color:#7A8099;">El corazon del equipo. Motivador principal. Especialista en apoyo emocional en produccion a las 3AM.</p></div></div>' +
            '<img src="img/team/isacxd.jpeg" alt="Isaac" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-top:1rem;border:1px solid rgba(255,255,255,0.1);" onerror="this.style.display=\'none\'">' +
            '<button onclick="this.closest(\'.mascot-easter-overlay\').remove()" style="display:block;margin-top:1.5rem;width:100%;padding:0.6rem;background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.2);border-radius:8px;color:rgba(0,229,255,0.7);font-family:monospace;font-size:0.7rem;letter-spacing:0.08em;cursor:pointer;">[ESC] CLOSE CLASSIFIED FILE</button></div>';
        document.body.appendChild(overlay);
        overlay.addEventListener("click", function(e) { if (e.target === overlay) overlay.remove(); });
        document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", esc); } });
    }

    /* --- INTERACTIVE CONTACT FORM --- */
    function initInteractiveContactForm() {
        // Project Type Chips
        var typeChips = document.querySelectorAll('#projectTypeChips .contact-chip-btn');
        typeChips.forEach(function (btn) {
            btn.addEventListener('click', function () {
                typeChips.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });
        });

        // Budget Chips
        var budgetChips = document.querySelectorAll('#budgetChips .contact-chip-btn');
        budgetChips.forEach(function (btn) {
            btn.addEventListener('click', function () {
                budgetChips.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });
        });

        // Form Submit
        var form = document.getElementById('formContactoWa');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var nombre = (document.getElementById('waNombre') || {}).value || '';
            var email = (document.getElementById('waEmail') || {}).value || '';
            var mensaje = (document.getElementById('waMensaje') || {}).value || '';

            var activeType = document.querySelector('#projectTypeChips .contact-chip-btn.active');
            var selectedType = activeType ? activeType.getAttribute('data-type') : 'General';

            var activeBudget = document.querySelector('#budgetChips .contact-chip-btn.active');
            var selectedBudget = activeBudget ? activeBudget.getAttribute('data-budget') : 'Por definir';

            var waPayload = "🚀 *SOLICITUD DE PROYECTO // VANTA STUDIO*\n\n" +
                "👤 *Cliente / Empresa:* " + nombre + "\n" +
                "📧 *Correo:* " + email + "\n" +
                "🛠️ *Tipo de Proyecto:* " + selectedType + "\n" +
                "💰 *Inversión Estimada:* " + selectedBudget + "\n\n" +
                "📝 *Detalles del Sistema:*\n" + mensaje + "\n\n" +
                "---\n_Enviado desde vanta.studio_";

            var waUrl = "https://wa.me/584127121162?text=" + encodeURIComponent(waPayload);

            // Trigger HUD toast feedback
            var toast = document.getElementById('vanta-hud-toast');
            if (toast) {
                var msg = toast.querySelector('#toastMsg');
                if (msg) msg.textContent = 'CONECTANDO CON WHATSAPP // VANTA CORE';
                toast.classList.add('show');
                setTimeout(function () { toast.classList.remove('show'); }, 3500);
            }

            // Open WhatsApp
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });

        console.log("[VANTA] Interactive contact form OK");
    }

    /* --- INIT --- */
    function init() {
        initSvivaPipeline();
        initMascotEasterEgg();
        initInteractiveContactForm();
        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            initNewSectionReveals();
        } else {
            window.addEventListener("load", function() { setTimeout(initNewSectionReveals, 800); });
        }
    }

    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); }
    else { init(); }
})();
