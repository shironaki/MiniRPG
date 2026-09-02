class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 36;
        this.speed = 220;
        this.level = 1;
        this.xp = 0;
        this.xpToNext = 100;
        this.maxHp = 100;
        this.hp = 100;
        this.attackPower = 20;
        this.aimX = 0;
        this.aimY = 1;
        this.direction = "down";
        this.isMoving = false;
        this.attackTimer = 0;
        this.attackDuration = 0.18;
        this.dodgeTimer = 0;
        this.dodgeDuration = 0.16;
        this.dodgeSpeed = 620;
        this.invulnerable = 0;
        this.walkTime = 0;
        this.attackFlash = 0;
        this.attackCount = 0;
        this.sprites = {
            down: this.loadSprite("assets/player/player-down.svg"),
            up: this.loadSprite("assets/player/player-up.svg"),
            right: this.loadSprite("assets/player/player-side.svg"),
            left: this.loadSprite("assets/player/player-side-left.svg")
        };
    }

    loadSprite(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    update(dt, input, world, camera) {
        this.attackTimer = Math.max(0, this.attackTimer - dt);
        this.dodgeTimer = Math.max(0, this.dodgeTimer - dt);
        this.invulnerable = Math.max(0, this.invulnerable - dt);
        this.attackFlash = Math.max(0, this.attackFlash - dt);

        const movement = input.getMovement();
        const aim = input.getAim(this, camera);
        this.aimX = aim.x;
        this.aimY = aim.y;
        this.isMoving = Math.abs(movement.x) > 0.05 || Math.abs(movement.y) > 0.05;
        if (this.isMoving) this.walkTime += dt * 12;
        this.updateDirection();

        if (input.consumeDodge() && this.dodgeTimer <= 0) this.dodge(movement, world);

        const speed = this.dodgeTimer > 0 ? this.dodgeSpeed : this.speed;
        const nextX = this.x + movement.x * speed * dt;
        if (world.canMoveTo(nextX, this.y, this.width, this.height)) this.x = nextX;
        const nextY = this.y + movement.y * speed * dt;
        if (world.canMoveTo(this.x, nextY, this.width, this.height)) this.y = nextY;

        if (input.consumeAttack()) this.attack();
    }

    updateDirection() {
        const angle = Math.atan2(this.aimY, this.aimX);
        if (angle > -Math.PI / 4 && angle <= Math.PI / 4) this.direction = "right";
        else if (angle > Math.PI / 4 && angle <= Math.PI * 0.75) this.direction = "down";
        else if (angle > Math.PI * 0.75 || angle <= -Math.PI * 0.75) this.direction = "left";
        else this.direction = "up";
    }

    attack() {
        if (this.attackTimer > 0) return;
        this.attackTimer = this.attackDuration;
        this.attackFlash = this.attackDuration;
        this.attackCount++;
    }

    dodge(movement, world) {
        this.dodgeTimer = this.dodgeDuration;
        this.invulnerable = this.dodgeDuration;
        let dx = movement.x;
        let dy = movement.y;
        if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
            dx = this.aimX;
            dy = this.aimY;
        }
        const length = Math.hypot(dx, dy);
        if (length === 0) return;
        dx /= length;
        dy /= length;
        const distance = 90;
        const nextX = this.x + dx * distance;
        const nextY = this.y + dy * distance;
        if (world.canMoveTo(nextX, this.y, this.width, this.height)) this.x = nextX;
        if (world.canMoveTo(this.x, nextY, this.width, this.height)) this.y = nextY;
    }

    takeDamage(amount) {
        if (this.invulnerable > 0) return;
        this.hp = Math.max(0, this.hp - amount);
    }

    gainXP(amount) {
        this.xp += amount;
        while (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext;
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xpToNext = Math.floor(this.xpToNext * 1.25);
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.attackPower += 5;
        if (window.game) window.game.showMessage(`LEVEL UP — ${this.level}`);
    }

    draw(ctx) {
        const x = this.x;
        const y = this.y;
        const walkBob = this.isMoving ? Math.sin(this.walkTime) * 2.2 : 0;
        const walkLean = this.isMoving ? Math.sin(this.walkTime) * 0.035 : 0;
        const stepScale = this.isMoving ? 1 + Math.sin(this.walkTime * 2) * 0.018 : 1;
        const dodgeAlpha = this.invulnerable > 0 ? 0.72 : 1;
        const sprite = this.sprites[this.direction];

        ctx.save();
        ctx.globalAlpha = dodgeAlpha;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.ellipse(x, y + 18, 20, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        const aura = ctx.createRadialGradient(x, y - 5, 2, x, y - 5, 32);
        aura.addColorStop(0, "rgba(125,75,255,0.20)");
        aura.addColorStop(1, "rgba(55,25,100,0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(x, y - 4, 32, 0, Math.PI * 2);
        ctx.fill();

        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            const drawWidth = 76 * stepScale;
            const drawHeight = 89 * stepScale;
            ctx.save();
            ctx.translate(x, y + walkBob);
            ctx.rotate(walkLean);
            ctx.drawImage(sprite, -drawWidth / 2, -52 - drawHeight * 0.02, drawWidth, drawHeight);
            ctx.restore();
        } else {
            ctx.fillStyle = "#171322";
            ctx.fillRect(x - 14, y - 8 + walkBob, 28, 23);
            ctx.fillStyle = "#d9aa90";
            ctx.beginPath();
            ctx.arc(x, y - 20 + walkBob, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.attackTimer > 0) {
            const angle = Math.atan2(this.aimY, this.aimX);
            const progress = 1 - this.attackTimer / this.attackDuration;
            ctx.save();
            ctx.translate(x, y - 2);
            ctx.rotate(angle + (progress - 0.5) * 0.25);
            ctx.shadowBlur = 18;
            ctx.shadowColor = "#9a63ff";
            ctx.strokeStyle = "rgba(205,175,255,0.95)";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(13, 0, 27 + progress * 8, -0.78 + progress * 0.15, 0.78 + progress * 0.15);
            ctx.stroke();
            ctx.restore();
        }

        if (this.invulnerable > 0) {
            const dodgeProgress = 1 - this.invulnerable / this.dodgeDuration;
            ctx.strokeStyle = `rgba(170,130,255,${0.7 - dodgeProgress * 0.45})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y - 4, 25 + dodgeProgress * 10, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }
}
