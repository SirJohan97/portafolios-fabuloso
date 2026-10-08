/* ================================================================
   VANTA STUDIO — PROJECT TRANSITION CONTROLLER
   ─────────────────────────────────────────────────────────────────
   El túnel y las pantallas intermedias han sido eliminados por completo.
   Los proyectos se abren de forma directa, instantánea y orgánica
   a través del modal técnico con animaciones fluidas Awwwards.
   ================================================================ */

(function () {
    "use strict";

    window.WarpRunner = {
        launch: function (projectId, arg2, arg3) {
            const cb = typeof arg3 === 'function' ? arg3 : (typeof arg2 === 'function' ? arg2 : null);
            if (cb) {
                cb(projectId);
            } else if (typeof window.openProjectModal === 'function') {
                window.openProjectModal(projectId);
            }
        }
    };

    window.VantaTransition = window.WarpRunner;
})();
