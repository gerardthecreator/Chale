document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const controls = {
        massSlider: document.getElementById('mass-slider'),
        angleSlider: document.getElementById('angle-slider'),
        frictionSlider: document.getElementById('friction-slider'),
        forceSlider: document.getElementById('force-slider'),
        massValue: document.getElementById('mass-value'),
        angleValue: document.getElementById('angle-value'),
        frictionValue: document.getElementById('friction-value'),
        forceValue: document.getElementById('force-value'),
        exampleSelect: document.getElementById('example-select')
    };

    const results = {
        normal: document.querySelector('#force-normal-result span'),
        gravityX: document.querySelector('#force-gravity-x-result span'),
        friction: document.querySelector('#force-friction-result span'),
        net: document.querySelector('#force-net-result span'),
        acceleration: document.querySelector('#acceleration-result span')
    };

    const G = 9.81; // Aceleración de la gravedad

    // --- ESCENARIOS DE EJEMPLO ---
    const examples = [
        { name: "Bloque en Reposo (Inclinado)", mass: 10, angle: 20, mu_s: 0.5, force: 0 },
        { name: "Al Borde del Deslizamiento", mass: 10, angle: 26.5, mu_s: 0.5, force: 0 },
        { name: "Deslizamiento Libre", mass: 10, angle: 45, mu_s: 0.3, force: 0 },
        { name: "Plano Horizontal con Fricción", mass: 20, angle: 0, mu_s: 0.4, force: 50 },
        { name: "Empujando Cuesta Arriba (Equilibrio)", mass: 15, angle: 30, mu_s: 0.6, force: 73.5 },
        { name: "Empujando Cuesta Arriba (Movimiento)", mass: 15, angle: 30, mu_s: 0.2, force: 120 },
        { name: "Sostenido por Tensión (Cuesta Abajo)", mass: 25, angle: 40, mu_s: 0.3, force: -100 },
        { name: "Caja Pesada en Rampa Leve", mass: 80, angle: 10, mu_s: 0.2, force: 0 },
        { name: "Objeto Ligero, Ángulo Pronunciado", mass: 2, angle: 60, mu_s: 0.1, force: 0 },
        { name: "Fuerza Negativa (Tirando)", mass: 30, angle: 15, mu_s: 0.25, force: -50 },
        { name: "Sin Fricción (Ideal)", mass: 10, angle: 30, mu_s: 0, force: 0 },
        { name: "Máxima Fricción Estática", mass: 50, angle: 30, mu_s: 1.0, force: 0 },
        { name: "Prueba de Fuerza Aplicada Grande", mass: 5, angle: 5, mu_s: 0.5, force: 100 },
        { name: "Prueba de Masa Grande", mass: 100, angle: 20, mu_s: 0.3, force: 150 },
        { name: "Caso Límite (Vertical)", mass: 10, angle: 90, mu_s: 0.5, force: 0 }
    ];

    // --- INICIALIZACIÓN ---
    function init() {
        DiagramDrawer.init('fbd-canvas');

        // Poblar el dropdown de ejemplos
        examples.forEach((ex, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = ex.name;
            controls.exampleSelect.appendChild(option);
        });

        loadExample(0); // Cargar el primer ejemplo por defecto

        // Añadir listeners a todos los controles
        Object.values(controls).forEach(control => {
            if(control.tagName === 'INPUT' || control.tagName === 'SELECT') {
                control.addEventListener('input', updateSystem);
            }
        });
    }

    // --- CARGAR UN EJEMPLO PREDEFINIDO ---
    function loadExample(index) {
        const ex = examples[index];
        controls.massSlider.value = ex.mass;
        controls.angleSlider.value = ex.angle;
        controls.frictionSlider.value = ex.mu_s;
        controls.forceSlider.value = ex.force;
        updateSystem();
    }
    
    // --- FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN ---
    function updateSystem() {
        const state = {
            mass: parseFloat(controls.massSlider.value),
            angle: parseFloat(controls.angleSlider.value),
            mu_s: parseFloat(controls.frictionSlider.value),
            forceApplied: parseFloat(controls.forceSlider.value)
        };

        // Actualizar las etiquetas de valor
        controls.massValue.textContent = state.mass;
        controls.angleValue.textContent = state.angle;
        controls.frictionValue.textContent = state.mu_s;
        controls.forceValue.textContent = state.forceApplied;
        
        // --- CÁLCULOS DE FÍSICA ---
        const angleRad = state.angle * Math.PI / 180;
        const Fg = state.mass * G;
        const Fn = Fg * Math.cos(angleRad);
        const Fgx = Fg * Math.sin(angleRad);

        const maxStaticFriction = Fn * state.mu_s;
        
        let drivingForce = state.forceApplied + Fgx;
        let frictionForce = 0;
        let netForce = 0;
        
        // Determinar la fuerza de fricción
        if (Math.abs(drivingForce) <= maxStaticFriction) {
            // El objeto está en reposo, la fricción se opone a la fuerza motriz
            frictionForce = -drivingForce;
            netForce = 0;
        } else {
            // El objeto se mueve, la fricción es máxima y se opone al movimiento
            frictionForce = -maxStaticFriction * Math.sign(drivingForce);
            netForce = drivingForce + frictionForce;
        }
        
        const acceleration = (state.mass > 0) ? netForce / state.mass : 0;
        
        // Actualizar el estado con los valores calculados para dibujar
        state.frictionForce = frictionForce;

        // --- MOSTRAR RESULTADOS ---
        results.normal.textContent = `${Fn.toFixed(2)} N`;
        results.gravityX.textContent = `${Fgx.toFixed(2)} N`;
        results.friction.textContent = `${frictionForce.toFixed(2)} N`;
        results.net.textContent = `${netForce.toFixed(2)} N`;
        results.acceleration.textContent = `${acceleration.toFixed(2)} m/s²`;
        
        // --- REDIBUJAR EL DIAGRAMA ---
        DiagramDrawer.draw(state);
    }
    
    init();
});
