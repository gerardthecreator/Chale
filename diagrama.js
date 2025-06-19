const Diagramas = {
    g: 9.81,

    // Inicializador general de canvas
    _initCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 400 * dpr; // Altura fija para consistencia
        ctx.scale(dpr, dpr);
        ctx.font = "14px 'Share Tech Mono'";
        return { canvas, ctx };
    },

    // ================= DIBUJANTE: PLANO INCLINADO =================
    planoInclinado(state) {
        const { canvas, ctx } = this._initCanvas('canvas-pi');
        const scale = 2.5;
        const angleRad = state.angle * Math.PI / 180;
        
        // Dibuja el plano inclinado
        ctx.beginPath();
        ctx.moveTo(50, 350);
        ctx.lineTo(550, 350);
        ctx.lineTo(550, 350 - Math.tan(angleRad) * 500);
        ctx.closePath();
        ctx.fillStyle = "#374151"; ctx.fill();

        // Rota el canvas para dibujar el bloque y fuerzas alineadas
        ctx.save();
        ctx.translate(300, 350 - Math.tan(angleRad) * 250);
        ctx.rotate(-angleRad);

        // Bloque
        ctx.fillStyle = '#93C5FD'; ctx.fillRect(-20, -40, 40, 40);
        
        // Fuerzas
        this._drawArrow(ctx, 0, 0, state.Fn * scale, -90, '#00E5FF', 'N');
        this._drawArrow(ctx, 0, 0, (state.mass * this.g) * scale, 90 + state.angle, '#FACC15', 'mg');
        if (state.forceApplied !== 0) this._drawArrow(ctx, 0, 0, Math.abs(state.forceApplied) * scale, state.forceApplied > 0 ? 0 : 180, '#FF4D4D', 'Fa');
        if (state.frictionForce !== 0) this._drawArrow(ctx, 0, 0, Math.abs(state.frictionForce) * scale, state.frictionForce < 0 ? 0 : 180, '#7CFF4D', 'Ff');
        
        ctx.restore();
    },

    // ================= DIBUJANTE: MÁQUINA DE ATWOOD =================
    poleaAtwood(state) {
        const { canvas, ctx } = this._initCanvas('canvas-pa');
        const scale = 2;
        let y1 = 180, y2 = 180;
        if (state.acceleration !== 0) { // Simula movimiento
            y1 = state.acceleration > 0 ? 220 : 140;
            y2 = state.acceleration > 0 ? 140 : 220;
        }

        // Polea
        ctx.beginPath(); ctx.arc(325, 80, 40, 0, 2 * Math.PI);
        ctx.fillStyle = "#9CA3AF"; ctx.fill();

        // Cuerdas
        ctx.strokeStyle = "#F9FAFB"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(285, 80); ctx.lineTo(285, y1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(365, 80); ctx.lineTo(365, y2); ctx.stroke();

        // Bloque 1
        ctx.fillStyle = '#93C5FD'; ctx.fillRect(265, y1, 40, 40);
        this._drawArrow(ctx, 285, y1, state.T * scale, -90, '#00E5FF', 'T');
        this._drawArrow(ctx, 285, y1+40, (state.m1 * this.g) * scale, 90, '#FACC15', 'm1g');
        
        // Bloque 2
        ctx.fillStyle = '#FCA5A5'; ctx.fillRect(345, y2, 40, 40);
        this._drawArrow(ctx, 365, y2, state.T * scale, -90, '#00E5FF', 'T');
        this._drawArrow(ctx, 365, y2+40, (state.m2 * this.g) * scale, 90, '#FACC15', 'm2g');
    },
    
    // ================= DIBUJANTE: BLOQUES EN CONTACTO =================
    bloquesContacto(state) {
        const { canvas, ctx } = this._initCanvas('canvas-bc');
        const scale = 0.5;

        // Suelo
        ctx.fillStyle = "#374151"; ctx.fillRect(50, 300, 550, 20);

        // Bloque 1
        ctx.fillStyle = '#93C5FD'; ctx.fillRect(200, 250, 80, 50);
        this._drawArrow(ctx, 200, 275, state.F * scale, 180, '#FF4D4D', 'F');
        this._drawArrow(ctx, 240, 275, state.F21 * scale, 180, '#A78BFA', 'F21'); //Fuerza de 2 sobre 1
        this._drawArrow(ctx, 240, 300, state.Ff1 * scale, 0, '#7CFF4D', 'Ff1');
        
        // Bloque 2
        ctx.fillStyle = '#FCA5A5'; ctx.fillRect(280, 220, 120, 80);
        this._drawArrow(ctx, 280, 275, state.F12 * scale, 180, '#A78BFA', 'F12'); //Fuerza de 1 sobre 2
        this._drawArrow(ctx, 340, 300, state.Ff2 * scale, 0, '#7CFF4D', 'Ff2');

    },

    // --- FUNCIÓN AUXILIAR PARA DIBUJAR FLECHAS ---
    _drawArrow(ctx, x, y, magnitude, angleDeg, color, label) {
        if (magnitude <= 0) return;
        const angleRad = angleDeg * Math.PI / 180;
        const endX = x + magnitude * Math.cos(angleRad);
        const endY = y + magnitude * Math.sin(angleRad);
        ctx.save();
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(endX, endY); ctx.stroke();
        ctx.translate(endX, endY); ctx.rotate(angleRad);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, -5); ctx.lineTo(-10, 5); ctx.closePath(); ctx.fill();
        ctx.restore();
        ctx.fillStyle = color; ctx.fillText(label, endX + 10, endY - 10);
    }
};
