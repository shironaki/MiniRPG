class Enemy {
    constructor(x, y, options = {}) {
        this.x = x; this.y = y; this.width = options.width || 30; this.height = options.height || 36;
        this.speed = options.speed || 72; this.maxHp = options.maxHp || 60; this.hp = this.maxHp;
        this.xpReward = options.xpReward || 50; this.damage = options.damage || 8; this.attackRange = options.attackRange || 38;
        this.attackCooldown = 0; this.hitTimer = 0; this.alive = true; this.flashTimer = 0;
        this.type = options.type || "melee"; this.name = options.name || "SHADOW BEAST";
        this.projectileCooldown = options.projectileCooldown || 1.4;
        this.sprite = this.loadSprite(options.sprite || "assets/enemies/shadow-beast.svg");
    }
    loadSprite(path) { const image = new Image(); image.src = path; return image; }
    update(dt, player, world) {
        if (!this.alive) return;
        this.attackCooldown = Math.max(0, this.attackCooldown - dt); this.hitTimer = Math.max(0, this.hitTimer - dt);
        this.flashTimer = Math.max(0, this.flashTimer - dt); this.projectileCooldown = Math.max(0, this.projectileCooldown - dt);
        const dx = player.x - this.x, dy = player.y - this.y, distance = Math.hypot(dx, dy), length = Math.max(distance, 0.001);
        if (this.type === "ranged") {
            if (distance > 170) this.moveToward(dx, dy, length, dt, world); else if (distance < 105) this.moveToward(-dx, -dy, length, dt, world);
            if (distance <= 280 && this.projectileCooldown <= 0) {
                this.projectileCooldown = 1.4;
                if (window.game) window.game.spawnEnemyProjectile(this.x, this.y, dx / length, dy / length, this.damage);
            }
            return;
        }
        if (distance > this.attackRange) this.moveToward(dx, dy, length, dt, world); else if (this.attackCooldown <= 0) this.attackPlayer(player);
    }
    moveToward(dx, dy, length, dt, world) {
        const nextX = this.x + (dx / length) * this.speed * dt, nextY = this.y + (dy / length) * this.speed * dt;
        if (world.canMoveTo(nextX, this.y, this.width, this.height)) this.x = nextX;
        if (world.canMoveTo(this.x, nextY, this.width, this.height)) this.y = nextY;
    }
    attackPlayer(player) {
        player.takeDamage(this.damage); this.attackCooldown = this.type === "fast" ? 0.55 : 0.9;
        if (window.game && window.game.effects) {
            window.game.effects.spawnHit(player.x, player.y, 4); window.game.addDamageNumber(player.x, player.y - 28, this.damage, true);
        }
    }
    takeDamage(amount, effects, knockbackX = 0, knockbackY = 0, world = null) {
        if (!this.alive) return false;
        this.hp = Math.max(0, this.hp - amount); this.hitTimer = 0.18; this.flashTimer = 0.12;
        if (effects) effects.spawnHit(this.x, this.y, 6);
        if (window.game) window.game.addDamageNumber(this.x, this.y - 32, amount, false);
        if (world && (knockbackX || knockbackY)) {
            const push = this.type === "fast" ? 8 : 13, nextX = this.x + knockbackX * push, nextY = this.y + knockbackY * push;
            if (world.canMoveTo(nextX, this.y, this.width, this.height)) this.x = nextX;
            if (world.canMoveTo(this.x, nextY, this.width, this.height)) this.y = nextY;
        }
        if (this.hp <= 0) {
            this.alive = false; if (window.game && window.game.effects) window.game.effects.spawnDeath(this.x, this.y); return true;
        }
        return false;
    }
    draw(ctx) {
        if (!this.alive) return;
        const pulse = 1 + Math.sin(performance.now() * 0.006) * 0.035;
        ctx.save(); ctx.globalAlpha = this.hitTimer > 0 ? 0.9 : 1; ctx.translate(this.x, this.y); ctx.scale(pulse, pulse);
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.ellipse(0, 17, 20, 7, 0, 0, Math.PI * 2); ctx.fill();
        if (this.sprite && this.sprite.complete && this.sprite.naturalWidth > 0) { ctx.globalAlpha *= this.flashTimer > 0 ? 0.72 : 1; ctx.drawImage(this.sprite, -38, -45, 76, 89); }
        else { ctx.fillStyle = this.flashTimer > 0 ? "#fff" : "#7a2032"; ctx.fillRect(-15, -18, 30, 36); }
        if (this.type === "fast" || this.type === "ranged") { ctx.strokeStyle = this.type === "fast" ? "rgba(255,120,180,0.55)" : "rgba(120,190,255,0.65)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -3, this.type === "fast" ? 25 : 27, 0, Math.PI * 2); ctx.stroke(); }
        ctx.restore();
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(this.x - 22, this.y - 45, 44, 5);
        ctx.fillStyle = this.type === "ranged" ? "#62b6ff" : this.type === "fast" ? "#ff5b9d" : "#d33";
        ctx.fillRect(this.x - 22, this.y - 45, 44 * hpPercent, 5);
    }
}
