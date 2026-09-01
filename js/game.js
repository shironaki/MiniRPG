class Game {

    constructor() {

        window.game = this;


        this.canvas =
            document.getElementById(
                "gameCanvas"
            );


        this.ctx =
            this.canvas.getContext(
                "2d"
            );


        this.input =
            new Input();


        this.dungeon =
            new Dungeon();


        /*
         * Безопасный spawn.
         */

        const spawn =
            this.dungeon.getSpawnPoint(
                28,
                36
            );


        this.player =
            new Player(
                spawn.x,
                spawn.y
            );

        this.enemy = {
            x: spawn.x,
            y: spawn.y - 90,

            width: 30,
            height: 36,

            maxHp: 60,
            hp: 60,

            xpReward: 50,

            hitTimer: 0,
            alive: true
        };


        this.camera =
            new Camera(
                window.innerWidth,
                window.innerHeight
            );


        this.effects =
            new Effects();


        this.loop =
            new GameLoop(this);


        this.resize();


        window.addEventListener(
            "resize",
            () => this.resize()
        );

    }


    start() {

        this.loop.start();

    }


    resize() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        this.canvas.width =
            window.innerWidth *
            dpr;

        this.canvas.height =
            window.innerHeight *
            dpr;


        this.canvas.style.width =
            window.innerWidth + "px";

        this.canvas.style.height =
            window.innerHeight + "px";


        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        this.camera.resize(
            window.innerWidth,
            window.innerHeight
        );

    }


    update(dt) {

        this.player.update(
            dt,
            this.input,
            this.dungeon,
            this.camera,
            this.updateEnemy(dt)
        );


        this.camera.follow(
            this.player,
            this.dungeon.width,
            this.dungeon.height
        );


        this.camera.updateShake(dt);


        this.effects.update(dt);


        if (
            this.player.isMoving
        ) {

            if (
                Math.random() < 0.15
            ) {

                this.effects.spawnDust(
                    this.player.x,
                    this.player.y + 15,
                    1
                );

            }

        }

    }

    updateEnemy(dt) {

    if (!this.enemy.alive) {
            return;
        }

        this.enemy.hitTimer =
            Math.max(
                0,
                this.enemy.hitTimer - dt
            );

    /*
     * Проверяем начало новой атаки.
     */
    if (
        this.player.attackTimer > 0 &&
        this.player.attackTimer >=
        this.player.attackDuration - 0.05 &&
        this.enemy.hitTimer <= 0
        ) {

            const dx =
                this.enemy.x -
                this.player.x;

            const dy =
                this.enemy.y -
                this.player.y;

            const distance =
                Math.hypot(dx, dy);

        /*
         * Максимальная дистанция удара.
         */
            const attackRange = 55;

        if (
            distance <= attackRange
            ) {

            /*
             * Проверяем,
             * находится ли враг
             * перед игроком.
             */
            const length =
                Math.max(
                    distance,
                    0.001
                );

            const dirX =
                dx / length;

            const dirY =
                dy / length;

            const dot =
                dirX * this.player.aimX +
                dirY * this.player.aimY;

            /*
             * ~90 градусов перед игроком.
             */
            if (dot > 0.25) {

                this.enemy.hp -=
                    this.player.attackPower;

                this.enemy.hitTimer = 0.18;

                if (
                    this.enemy.hp <= 0
                    ) {

                        this.enemy.hp = 0;
                        this.enemy.alive = false;

                        this.player.gainXP(
                            this.enemy.xpReward
                        );

                        this.showMessage(
                            "+50 XP"
                        );
                    }
            }
            }
        }
    }


    render() {

        const ctx =
            this.ctx;


        const dpr =
            window.devicePixelRatio || 1;


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        ctx.save();


        this.camera.apply(ctx);


        ctx.translate(
            -this.camera.x,
            -this.camera.y
        );


        this.dungeon.draw(
            ctx,
            this.camera
        );


        this.effects.draw(ctx);

        this.drawEnemy(ctx);

        this.player.draw(ctx);


        ctx.restore();


        this.updateHUD();

    }

    drawEnemy(ctx) {

    const enemy =
        this.enemy;

    if (!enemy.alive) {
        return;
    }

    /*
     * Тень
     */
    ctx.fillStyle =
        "rgba(0,0,0,0.45)";

    ctx.beginPath();

    ctx.ellipse(
        enemy.x,
        enemy.y + 17,
        19,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
     * Тело
     */
    ctx.fillStyle =
        enemy.hitTimer > 0
            ? "#ffffff"
            : "#8b2635";

    ctx.fillRect(
        enemy.x - 15,
        enemy.y - 18,
        30,
        36
    );

    /*
     * Голова
     */
    ctx.fillStyle =
        "#5a1825";

    ctx.beginPath();

    ctx.arc(
        enemy.x,
        enemy.y - 22,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
     * HP bar
     */
    const barWidth = 42;

    const hpPercent =
        enemy.hp /
        enemy.maxHp;

    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        enemy.x - barWidth / 2,
        enemy.y - 43,
        barWidth,
        5
    );

    ctx.fillStyle =
        "#d33";

    ctx.fillRect(
        enemy.x - barWidth / 2,
        enemy.y - 43,
        barWidth * hpPercent,
        5
    );
    }


    updateHUD() {

        const hpPercent =
            (
                this.player.hp /
                this.player.maxHp
            ) * 100;


        const xpPercent =
            (
                this.player.xp /
                this.player.xpToNext
            ) * 100;


        document.getElementById(
            "hpFill"
        ).style.width =
            `${hpPercent}%`;


        document.getElementById(
            "xpFill"
        ).style.width =
            `${xpPercent}%`;


        document.getElementById(
            "levelValue"
        ).textContent =
            this.player.level;


        document.getElementById(
            "statsText"
        ).textContent =
            `HP ${Math.ceil(
                this.player.hp
            )} / ${this.player.maxHp}`;

    }


    showMessage(message) {

        const element =
            document.getElementById(
                "centerMessage"
            );


        element.textContent =
            message;


        element.style.opacity =
            "1";


        clearTimeout(
            this.messageTimer
        );


        this.messageTimer =
            setTimeout(
                () => {

                    element.style.opacity =
                        "0";

                },
                1300
            );

    }

}