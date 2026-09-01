class Enemy {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.width = options.width || 30;
        this.height = options.height || 36;
        this.speed = options.speed || 72;
        this.maxHp = options.maxHp || 60;
        this.hp = this.maxHp;
        this.xpReward = options.xpReward || 50;
        this.damage = options.damage || 8;
        this.attackRange = options.attackRange || 38;
        this.attackCooldown = 0;
        this.hitTimer = 0;
        this.alive = true;
        this.flashTimer = 0;
        this.type = options.type || "shadow";
        this.name = options.name || "SHADOW BEAST";
        this.sprite = this.loadSprite(options.sprite || "assets/enemies/shadow-beast.svg");
    }

    loadSprite(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    update(dt, player, world) {
        if (!this.alive) return;
        this.attackCooldown = Math.max(0, this.attackCooldown - dt);
        this.hitTimer = Math.max(0, this.hitTimer - dt);
        this.flashTimer = Math.max(0, this.flashTimer - dt);

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance > this.attackRange) {
            const length = Math.max(distance, 0.001);
            const nextX = this.x + (dx / length) * this.speed * dt;
            const nextY = this.y + (dy / length) * this.speed * dt;
            if (world.canMoveTo(nextX, this.y, this.width, this.height)) this.x = nextX;
            if (world.canMoveTo(this.x, nextY, this.width, this.height)) this.y = nextY;
        } else if (this.attackCooldown <= 0) {
            player.takeDamage(this.damage);
            this.attackCooldown = 0.8;
            if (window.game && window.game.effects) {
                window.game.effects.spawnHit(player.x, player.y, 3);
                window.game.addDamageNumber(player.x, player.y - 28, this.damage, true);
            }
        }
    }

    takeDamage(amount, effects) {
        if (!this.alive) return false;
        this.hp = Math.max(0, this.hp - amount);
        this.hitTimer = 0.18;
        this.flashTimer = 0.12;
        if (effects) effects.spawnHit(this.x, this.y, 5);
        if (window.game) window.game.addDamageNumber(this.x, this.y - 32, amount, false);
        if (this.hp <= 0) {
            this.alive = false;
            return true;
        }
        return false;
    }

    draw(ctx) {
        if (!this.alive) return;
        const e = this;
        const pulse = 1 + Math.sin(performance.now() * 0.006) * 0.035;
        ctx.save();
        ctx.globalAlpha = e.hitTimer > 0 ? 0.9 : 1;
        ctx.translate(e.x, e.y);
        ctx.scale(pulse, pulse);

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.ellipse(0, 17, 20, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        if (e.sprite && e.sprite.complete && e.sprite.naturalWidth > 0) {
            ctx.globalAlpha = e.flashTimer > 0 ? 0.72 : 1;
            ctx.drawImage(e.sprite, -38, -45, 76, 89);
        } else {
            ctx.fillStyle = e.flashTimer > 0 ? "#ffffff" : "#7a2032";
            ctx.fillRect(-15, -18, 30, 36);
        }
        ctx.restore();

        const hpPercent = e.hp / e.maxHp;
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(e.x - 22, e.y - 45, 44, 5);
        ctx.fillStyle = "#d33";
        ctx.fillRect(e.x - 22, e.y - 45, 44 * hpPercent, 5);
    }
}
