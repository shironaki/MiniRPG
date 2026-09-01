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
            this.camera
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


        this.player.draw(ctx);


        ctx.restore();


        this.updateHUD();

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