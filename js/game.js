class Game {
    constructor() {
        window.game = this;
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.input = new Input();
        this.dungeon = new Dungeon();

        this.roomIndex = 0;
        this.floor = 1;
        this.portalCooldown = 0;
        this.roomTransitionCooldown = 0;
        this.damageNumbers = [];

        const spawn = this.dungeon.getSpawnPoint(28, 36, this.roomIndex);
        this.player = new Player(spawn.x, spawn.y);
        this.createEnemy();
        this.dungeon.setRoomProgress(this.roomIndex, false);

        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.effects = new Effects();
        this.loop = new GameLoop(this);
        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    createEnemy() {
        const room = this.dungeon.rooms[this.roomIndex];
        const x = (room.x + room.width / 2) * this.dungeon.tileSize;
        const y = 8 * this.dungeon.tileSize;
        this.enemy = new Enemy(x, y, { maxHp: 60, xpReward: 50, speed: 72, damage: 8 });
    }

    start() { this.loop.start(); }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.camera.resize(window.innerWidth, window.innerHeight);
    }

    update(dt) {
        this.portalCooldown = Math.max(0, this.portalCooldown - dt);
        this.roomTransitionCooldown = Math.max(0, this.roomTransitionCooldown - dt);
        this.dungeon.update(dt);

        this.player.update(dt, this.input, this.dungeon, this.camera);
        this.updateEnemy(dt);
        this.updateDamageNumbers(dt);

        if (this.roomTransitionCooldown <= 0) {
            const nextRoom = this.dungeon.getDoorTransition(this.player.x, this.player.y, this.roomIndex);
            if (nextRoom !== null) this.enterRoom(nextRoom);
        }

        if (this.portalCooldown <= 0 && this.dungeon.isNearPortal(this.player.x, this.player.y)) {
            this.enterPortal();
        }

        this.camera.follow(this.player, this.dungeon.width, this.dungeon.height);
        this.camera.updateShake(dt);
        this.effects.update(dt);

        if (this.player.isMoving && Math.random() < 0.15) {
            this.effects.spawnDust(this.player.x, this.player.y + 15, 1);
        }
    }

    enterRoom(nextRoom) {
        if (nextRoom < 0 || nextRoom > 2) return;
        this.roomIndex = nextRoom;
        this.roomTransitionCooldown = 0.7;
        const spawn = this.dungeon.getSpawnPoint(this.player.width, this.player.height, this.roomIndex);
        this.player.x = spawn.x;
        this.player.y = spawn.y;
        this.player.attackTimer = 0;
        this.player.dodgeTimer = 0;
        this.player.invulnerable = 0;
        this.createEnemy();
        this.dungeon.setRoomProgress(this.roomIndex, false);
        this.showMessage(this.dungeon.rooms[this.roomIndex].name);
    }

    enterPortal() {
        this.portalCooldown = 1.25;
        this.floor++;
        this.roomIndex = 0;
        this.dungeon.generate();
        const spawn = this.dungeon.getSpawnPoint(this.player.width, this.player.height, 0);
        this.player.x = spawn.x;
        this.player.y = spawn.y;
        this.player.attackTimer = 0;
        this.player.dodgeTimer = 0;
        this.player.invulnerable = 0;
        this.createEnemy();
        this.dungeon.setRoomProgress(0, false);
        this.showMessage(`FLOOR ${this.floor}`);
    }

    updateEnemy(dt) {
        if (!this.enemy || !this.enemy.alive) return;

        this.enemy.update(dt, this.player, this.dungeon);

        if (this.player.attackTimer > 0 && this.player.attackTimer >= this.player.attackDuration - 0.05 && this.enemy.hitTimer <= 0) {
            const dx = this.enemy.x - this.player.x;
            const dy = this.enemy.y - this.player.y;
            const distance = Math.hypot(dx, dy);
            if (distance <= 58) {
                const length = Math.max(distance, 0.001);
                const dot = (dx / length) * this.player.aimX + (dy / length) * this.player.aimY;
                if (dot > 0.25) {
                    const killed = this.enemy.takeDamage(this.player.attackPower, this.effects);
                    this.enemy.hitTimer = 0.18;
                    if (killed) {
                        this.player.gainXP(this.enemy.xpReward);
                        this.dungeon.setRoomProgress(this.roomIndex, true);
                        this.showMessage(this.roomIndex === 2 ? "PORTAL UNLOCKED" : "+50 XP — DOOR OPEN");
                    }
                }
            }
        }
    }

    addDamageNumber(x, y, amount, playerDamage = false) {
        this.damageNumbers.push({ x, y, amount, playerDamage, life: 0.7, maxLife: 0.7, vy: -32 });
    }

    updateDamageNumbers(dt) {
        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            const n = this.damageNumbers[i];
            n.y += n.vy * dt;
            n.vy *= Math.pow(0.05, dt);
            n.life -= dt;
            if (n.life <= 0) this.damageNumbers.splice(i, 1);
        }
    }

    drawDamageNumbers(ctx) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.font = "bold 15px Arial";
        for (const n of this.damageNumbers) {
            ctx.globalAlpha = Math.min(1, n.life / 0.25);
            ctx.fillStyle = n.playerDamage ? "#ff6b6b" : "#f1d4ff";
            ctx.shadowBlur = 8;
            ctx.shadowColor = n.playerDamage ? "#ff3344" : "#9a63ff";
            ctx.fillText(`-${n.amount}`, n.x, n.y);
        }
        ctx.restore();
    }

    render() {
        const ctx = this.ctx;
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.save();
        this.camera.apply(ctx);
        ctx.translate(-this.camera.x, -this.camera.y);
        this.dungeon.draw(ctx, this.camera);
        this.effects.draw(ctx);
        this.enemy.draw(ctx);
        this.player.draw(ctx);
        this.drawDamageNumbers(ctx);
        ctx.restore();
        this.updateHUD();
    }

    updateHUD() {
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        const xpPercent = (this.player.xp / this.player.xpToNext) * 100;
        const hpFill = document.getElementById("hpFill");
        const xpFill = document.getElementById("xpFill");
        const levelValue = document.getElementById("levelValue");
        const statsText = document.getElementById("statsText");
        const location = document.getElementById("locationInfo");
        if (hpFill) hpFill.style.width = `${hpPercent}%`;
        if (xpFill) xpFill.style.width = `${xpPercent}%`;
        if (levelValue) levelValue.textContent = this.player.level;
        if (statsText) statsText.textContent = `HP ${Math.ceil(this.player.hp)} / ${this.player.maxHp}`;
        if (location) location.textContent = `DUNGEON ${String(this.floor).padStart(2, "0")} · ROOM ${this.roomIndex + 1}`;
    }

    showMessage(message) {
        const element = document.getElementById("centerMessage");
        if (!element) return;
        element.textContent = message;
        element.style.opacity = "1";
        clearTimeout(this.messageTimer);
        this.messageTimer = setTimeout(() => { element.style.opacity = "0"; }, 1300);
    }
}
