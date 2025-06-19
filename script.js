document.addEventListener('DOMContentLoaded', () => {

    const G = 9.81;
    const moduleSelect = document.getElementById('module-select');
    const modules = document.querySelectorAll('.physics-module');

    // ==========================================================
    //            LÓGICA PARA CADA MÓDULO DE FÍSICA
    // ==========================================================
    const physicsModules = {

        // ========== MÓDULO 1: PLANO INCLINADO ==========
        planoInclinado: {
            elements: {
                mass: document.getElementById('mass-pi'),
                angle: document.getElementById('angle-pi'),
                friction: document.getElementById('friction-pi'),
                force: document.getElementById('force-pi'),
                massVal: document.getElementById('mass-value-pi'),
                angleVal: document.getElementById('angle-value-pi'),
                frictionVal: document.getElementById('friction-value-pi'),
                forceVal: document.getElementById('force-value-pi'),
                results: document.getElementById('results-pi'),
            },
            update() {
                const state = {
                    mass: parseFloat(this.elements.mass.value),
                    angle: parseFloat(this.elements.angle.value),
                    mu_s: parseFloat(this.elements.friction.value),
                    forceApplied: parseFloat(this.elements.force.value),
                };

                this.elements.massVal.textContent = state.mass;
                this.elements.angleVal.textContent = state.angle;
                this.elements.frictionVal.textContent = state.mu_s;
                this.elements.forceVal.textContent = state.forceApplied;

                const angleRad = state.angle * Math.PI / 180;
                state.Fn = state.mass * G * Math.cos(angleRad);
                const Fgx = state.mass * G * Math.sin(angleRad);
                const maxFf = state.Fn * state.mu_s;
                const drivingForce = state.forceApplied - Fgx;
                
                state.frictionForce = Math.abs(drivingForce) < maxFf ? -drivingForce : -maxFf * Math.sign(drivingForce);
                const netForce = drivingForce + state.frictionForce;
                const acceleration = state.mass > 0 ? netForce / state.mass : 0;
                
                this.elements.results.innerHTML = `
                    <p>Fuerza Normal (N): <span>${state.Fn.toFixed(2)} N</span></p>
                    <p>Fricción (Ff): <span>${state.frictionForce.toFixed(2)} N</span></p>
                    <p>Fuerza Neta: <span>${netForce.toFixed(2)} N</span></p>
                    <p class="highlight-result">Aceleración (a): <span>${acceleration.toFixed(2)} m/s²</span></p>
                `;
                
                Diagramas.planoInclinado(state);
            }
        },
        
        // ========== MÓDULO 2: MÁQUINA DE ATWOOD ==========
        poleaAtwood: {
            elements: {
                mass1: document.getElementById('mass1-pa'),
                mass2: document.getElementById('mass2-pa'),
                mass1Val: document.getElementById('mass1-value-pa'),
                mass2Val: document.getElementById('mass2-value-pa'),
                results: document.getElementById('results-pa'),
            },
            update() {
                const state = {
                    m1: parseFloat(this.elements.mass1.value),
                    m2: parseFloat(this.elements.mass2.value),
                };
                
                this.elements.mass1Val.textContent = state.m1;
                this.elements.mass2Val.textContent = state.m2;

                const mTotal = state.m1 + state.m2;
                state.acceleration = mTotal > 0 ? ((state.m1 - state.m2) * G) / mTotal : 0;
                state.T = mTotal > 0 ? (state.m1 * state.m2 * 2 * G) / mTotal : 0;
                
                this.elements.results.innerHTML = `
                    <p>Tensión Cuerda (T): <span>${state.T.toFixed(2)} N</span></p>
                    <p class="highlight-result">Aceleración (a): <span>${state.acceleration.toFixed(2)} m/s²</span></p>
                    <p><small>Positiva si m1 baja, negativa si m2 baja.</small></p>
                `;

                Diagramas.poleaAtwood(state);
            }
        },

        // ========== MÓDULO 3: BLOQUES EN CONTACTO ==========
        bloquesContacto: {
            elements: {
                force: document.getElementById('force-bc'),
                mass1: document.getElementById('mass1-bc'),
                mass2: document.getElementById('mass2-bc'),
                friction: document.getElementById('friction-bc'),
                forceVal: document.getElementById('force-value-bc'),
                mass1Val: document.getElementById('mass1-value-bc'),
                mass2Val: document.getElementById('mass2-value-bc'),
                frictionVal: document.getElementById('friction-value-bc'),
                results: document.getElementById('results-bc'),
            },
            update() {
                const state = {
                    F: parseFloat(this.elements.force.value),
                    m1: parseFloat(this.elements.mass1.value),
                    m2: parseFloat(this.elements.mass2.value),
                    mu_k: parseFloat(this.elements.friction.value),
                };
                
                this.elements.forceVal.textContent = state.F;
                this.elements.mass1Val.textContent = state.m1;
                this.elements.mass2Val.textContent = state.m2;
                this.elements.frictionVal.textContent = state.mu_k;

                const N1 = state.m1 * G;
                const N2 = state.m2 * G;
                state.Ff1 = N1 * state.mu_k;
                state.Ff2 = N2 * state.mu_k;
                const Ff_total = state.Ff1 + state.Ff2;
                const mTotal = state.m1 + state.m2;

                const drivingForce = state.F - Ff_total;
                const acceleration = mTotal > 0 && drivingForce > 0 ? drivingForce / mTotal : 0;
                
                // Fuerza de contacto
                state.F12 = mTotal > 0 && acceleration > 0 ? state.m2 * acceleration + state.Ff2 : 0; //Fuerza de 1 sobre 2
                state.F21 = state.F12; // 3ra ley de Newton
                
                this.elements.results.innerHTML = `
                    <p>Fuerza Contacto (F12): <span>${state.F12.toFixed(2)} N</span></p>
                    <p>Fricción Total: <span>${Ff_total.toFixed(2)} N</span></p>
                    <p class="highlight-result">Aceleración (a): <span>${acceleration.toFixed(2)} m/s²</span></p>
                `;

                Diagramas.bloquesContacto(state);
            }
        },
    };

    // ==========================================================
    //                  CONTROLADOR PRINCIPAL
    // ==========================================================
    function switchModule(moduleName) {
        modules.forEach(module => {
            module.classList.remove('active-module');
        });
        document.getElementById(`${moduleName}-module`).classList.add('active-module');
        physicsModules[moduleName].update();
    }

    function init() {
        // Inicializar listeners para todos los inputs
        document.querySelectorAll('input[type="range"]').forEach(input => {
            input.addEventListener('input', () => {
                const activeModule = moduleSelect.value;
                physicsModules[activeModule].update();
            });
        });
        
        moduleSelect.addEventListener('change', (e) => switchModule(e.target.value));

        // Iniciar con el primer módulo
        switchModule(moduleSelect.value);
    }
    
    init();
});
