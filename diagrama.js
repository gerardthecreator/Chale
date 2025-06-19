const DiagramDrawer = {
    ctx: null,
    canvas: null,
    scale: 2.5,
    g: 9.81,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        // Aumentar la resolución del canvas para que no se vea pixelado
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
    },

    // Función principal para dibujar todo
    draw(state) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "14px 'Share Tech Mono'";

        const angleRad = state.angle * Math.PI / 180;
        
        // --- Dibujar elementos base ---
        this._drawRamp(angleRad);
        
        // --- Guardar estado y rotar para el bloque y las fuerzas ---
        this.ctx.save();
        this.ctx.translate(200, 320 - Math.tan(angleRad) * 150);
        this.ctx.rotate(-angleRad);
        
        this._drawBlock();

        // --- Calcular y dibujar fuerzas ---
        const Fg = state.mass * this.g;
        const Fn = Fg * Math.cos(angleRad);
        const Fgx = Fg * Math.sin(angleRad);
        
        this._drawForceArrow(0, 0, Fg * Math.cos(angleRad), -90, '#00E5FF', 'N');  // Normal
        this._drawForceArrow(0, 0, Fg, 90 + state.angle, '#FACC15', 'mg'); // Peso
        
        if (state.forceApplied !== 0) {
            this._drawForceArrow(0, 0, Math.abs(state.forceApplied), (state.forceApplied > 0) ? 0 : 180, '#FF4D4D', 'Fa');
        }

        if (state.frictionForce !== 0) {
             this._drawForceArrow(0, 0, Math.abs(state.frictionForce), (state.frictionForce < 0) ? 0 : 180, '#7CFF4D', 'Ff');
        }

        this.ctx.restore(); // Volver al estado original sin rotación
    },

    _drawRamp(angleRad) {
        this.ctx.fillStyle = "#374151";
        this.ctx.strokeStyle = "#9CA3AF";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(50, 320);
        this.ctx.lineTo(450, 320);
        this.ctx.lineTo(450, 320 - Math.tan(angleRad) * 400);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Ángulo
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        this.ctx.beginPath();
        this.ctx.arc(50, 320, 40, 0, -angleRad, true);
        this.ctx.stroke();
        this.ctx.fillStyle = "white";
        this.ctx.fillText(Math.round(angleRad * 180 / Math.PI) + '°', 100, 310);
    },

    _drawBlock() {
        this.ctx.fillStyle = '#93C5FD';
        this.ctx.strokeStyle = '#3B82F6';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(-20, -40, 40, 40);
        this.ctx.strokeRect(-20, -40, 40, 40);
    },
    
    _drawForceArrow(x, y, magnitude, angleDeg, color, label) {
        const length = magnitude * this.scale;
        const angleRad = angleDeg * Math.PI / 180;
        
        const endX = x + length * Math.cos(angleRad);
        const endY = y + length * Math.sin(angleRad);

        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 3;

        // Línea
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // Punta de flecha
        this.ctx.translate(endX, endY);
        this.ctx.rotate(angleRad);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-10, -5);
        this.ctx.lineTo(-10, 5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        
        // Etiqueta
        this.ctx.fillStyle = color;
        this.ctx.fillText(label, endX + 10, endY);
    }
};
