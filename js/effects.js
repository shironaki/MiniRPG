class Effects {
    constructor() { this.particles = []; }

    spawnDust(x, y, amount = 5) {
        for (let i = 0; i < amount; i++) this.particles.push({ x, y, vx: (Math.random() - 0.5) * 70, vy: (Math.random() - 0.5) * 70, life: 0.4 + Math.random() * 0.4, maxLife: 0.8, size: 2 + Math.random() * 3, type: "dust" });
    }

    spawnHit(x, y, amount = 6) {
        for (let i = 0; i < amount; i++) this.particles.push({ x, y, vx: (Math.random() - 0.5) * 180, vy: (Math.random() - 0.5) * 180, life: 0.22 + Math.random() * 0.18, maxLife: 0.4, size: 2 + Math.random() * 2, type: "hit" });
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= Math.pow(0.04, dt);
            p.vy *= Math.pow(0.04, dt);
            p.life -= dt;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    draw(ctx) {
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.type === "hit" ? "#d8b9ff" : "#9a8bb8";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}
