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

        if (this.isMoving) {
            this.walkTime += dt * 10;
        }

        this.updateDirection();

        if (input.consumeDodge() && this.dodgeTimer <= 0) {
            this.dodge(movement, world);
        }

        const speed = this.dodgeTimer > 0 ? this.dodgeSpeed : this.speed;

        const nextX = this.x + movement.x * speed * dt;
        if (world.canMoveTo(nextX, this.y, this.width, this.height)) {
            this.x = nextX;
        }

        const nextY = this.y + movement.y * speed * dt;
        if (world.canMoveTo(this.x, nextY, this.width, this.height)) {
            this.y = nextY;
        }

        if (input.consumeAttack()) {
            this.attack();
        }
    }


    updateDirection() {
        const angle = Math.atan2(this.aimY, this.aimX);

        if (angle > -Math.PI / 4 && angle <= Math.PI / 4) {
            this.direction = "right";
        } else if (angle > Math.PI / 4 && angle <= Math.PI * 0.75) {
            this.direction = "down";
        } else if (angle > Math.PI * 0.75 || angle <= -Math.PI * 0.75) {
            this.direction = "left";
        } else {
            this.direction = "up";
        }
    }


    attack() {
        if (this.attackTimer > 0) {
            return;
        }

        this.attackTimer = this.attackDuration;
        this.attackFlash = this.attackDuration;
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
        if (length === 0) {
            return;
        }

        dx /= length;
        dy /= length;

        const distance = 90;
        const nextX = this.x + dx * distance;
        const nextY = this.y + dy * distance;

        if (world.canMoveTo(nextX, this.y, this.width, this.height)) {
            this.x = nextX;
        }

        if (world.canMoveTo(this.x, nextY, this.width, this.height)) {
            this.y = nextY;
        }
    }


    takeDamage(amount) {
        if (this.invulnerable > 0) {
            return;
        }

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

        if (window.game) {
            window.game.showMessage(`LEVEL UP — ${this.level}`);
        }
    }


    draw(ctx) {

        const x = this.x;
        const y = this.y;
        const bob = this.isMoving ? Math.sin(this.walkTime) * 2 : 0;
        const dodgeAlpha = this.invulnerable > 0 ? 0.72 : 1;

        ctx.save();
        ctx.globalAlpha = dodgeAlpha;

        // Ground shadow.
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.ellipse(x, y + 18, 20, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shadow aura behind the character.
        const aura = ctx.createRadialGradient(x, y - 5, 2, x, y - 5, 32);
        aura.addColorStop(0, "rgba(125,75,255,0.20)");
        aura.addColorStop(1, "rgba(55,25,100,0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(x, y - 4, 32, 0, Math.PI * 2);
        ctx.fill();

        // Long dark coat.
        ctx.fillStyle = "#171322";
        ctx.beginPath();
        ctx.moveTo(x - 14, y - 8 + bob);
        ctx.lineTo(x - 12, y + 15 + bob);
        ctx.lineTo(x, y + 11 + bob);
        ctx.lineTo(x + 12, y + 15 + bob);
        ctx.lineTo(x + 14, y - 8 + bob);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#44315f";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Violet inner coat / chest.
        ctx.fillStyle = "#39265b";
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 11 + bob);
        ctx.lineTo(x, y + 8 + bob);
        ctx.lineTo(x + 8, y - 11 + bob);
        ctx.closePath();
        ctx.fill();

        // Neck.
        ctx.fillStyle = "#c5967e";
        ctx.fillRect(x - 4, y - 13 + bob, 8, 7);

        // Head.
        ctx.fillStyle = "#d9aa90";
        ctx.beginPath();
        ctx.arc(x, y - 20 + bob, 10.5, 0, Math.PI * 2);
        ctx.fill();

        // Tousled black hair silhouette.
        ctx.fillStyle = "#0a0910";
        ctx.beginPath();
        ctx.moveTo(x - 11, y - 21 + bob);
        ctx.lineTo(x - 8, y - 31 + bob);
        ctx.lineTo(x - 3, y - 27 + bob);
        ctx.lineTo(x + 1, y - 33 + bob);
        ctx.lineTo(x + 5, y - 27 + bob);
        ctx.lineTo(x + 11, y - 30 + bob);
        ctx.lineTo(x + 10, y - 17 + bob);
        ctx.lineTo(x + 5, y - 21 + bob);
        ctx.lineTo(x, y - 18 + bob);
        ctx.lineTo(x - 6, y - 21 + bob);
        ctx.closePath();
        ctx.fill();

        // Eyes track the aim direction.
        const eyeForward = 5.5;
        const eyeSide = 3.2;
        const px = -this.aimY;
        const py = this.aimX;

        ctx.fillStyle = "#b58aff";
        ctx.shadowBlur = 7;
        ctx.shadowColor = "#8d55ff";

        ctx.fillRect(
            x + this.aimX * eyeForward + px * eyeSide - 1.5,
            y - 20 + bob + this.aimY * eyeForward + py * eyeSide - 1.5,
            3,
            3
        );

        ctx.fillRect(
            x + this.aimX * eyeForward - px * eyeSide - 1.5,
            y - 20 + bob + this.aimY * eyeForward - py * eyeSide - 1.5,
            3,
            3
        );

        ctx.shadowBlur = 0;

        // Attack arc.
        if (this.attackTimer > 0) {
            const angle = Math.atan2(this.aimY, this.aimX);

            ctx.save();
            ctx.translate(x, y - 2);
            ctx.rotate(angle);

            ctx.shadowBlur = 18;
            ctx.shadowColor = "#9a63ff";
            ctx.strokeStyle = "rgba(205,175,255,0.95)";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(13, 0, 27, -0.75, 0.75);
            ctx.stroke();

            ctx.restore();
        }

        // Dodge trails.
        if (this.invulnerable > 0) {
            ctx.strokeStyle = "rgba(170,130,255,0.55)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y - 4, 25, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

}
