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


        // Направление взгляда

        this.aimX = 0;
        this.aimY = 1;


        this.direction = "down";

        this.isMoving = false;


        // Атака

        this.attackTimer = 0;

        this.attackDuration = 0.18;


        // Dodge

        this.dodgeTimer = 0;

        this.dodgeDuration = 0.16;

        this.dodgeSpeed = 620;

        this.invulnerable = 0;

    }


    update(dt, input, world, camera) {

        this.attackTimer =
            Math.max(
                0,
                this.attackTimer - dt
            );


        this.dodgeTimer =
            Math.max(
                0,
                this.dodgeTimer - dt
            );


        this.invulnerable =
            Math.max(
                0,
                this.invulnerable - dt
            );


        const movement =
            input.getMovement();


        const aim =
            input.getAim(
                this,
                camera
            );


        this.aimX = aim.x;
        this.aimY = aim.y;


        this.isMoving =
            Math.abs(movement.x) > 0.05 ||
            Math.abs(movement.y) > 0.05;


        this.updateDirection();


        /*
         * Dodge
         */

        if (
            input.consumeDodge() &&
            this.dodgeTimer <= 0
        ) {

            this.dodge(
                movement,
                world
            );

        }


        let speed =
            this.speed;


        if (
            this.dodgeTimer > 0
        ) {

            speed =
                this.dodgeSpeed;

        }


        /*
         * Движение по X
         */

        const nextX =
            this.x +
            movement.x *
            speed *
            dt;


        if (
            world.canMoveTo(
                nextX,
                this.y,
                this.width,
                this.height
            )
        ) {

            this.x = nextX;

        }


        /*
         * Движение по Y
         */

        const nextY =
            this.y +
            movement.y *
            speed *
            dt;


        if (
            world.canMoveTo(
                this.x,
                nextY,
                this.width,
                this.height
            )
        ) {

            this.y = nextY;

        }


        /*
         * Атака
         */

        if (
            input.consumeAttack()
        ) {

            this.attack();

        }

    }


    updateDirection() {

        const angle =
            Math.atan2(
                this.aimY,
                this.aimX
            );


        if (
            angle > -Math.PI / 4 &&
            angle <= Math.PI / 4
        ) {

            this.direction =
                "right";

        }
        else if (
            angle > Math.PI / 4 &&
            angle <= Math.PI * 0.75
        ) {

            this.direction =
                "down";

        }
        else if (
            angle > Math.PI * 0.75 ||
            angle <= -Math.PI * 0.75
        ) {

            this.direction =
                "left";

        }
        else {

            this.direction =
                "up";

        }

    }


    attack() {

        if (
            this.attackTimer > 0
        ) {

            return;

        }


        this.attackTimer =
            this.attackDuration;

    }


    dodge(movement, world) {

        this.dodgeTimer =
            this.dodgeDuration;


        this.invulnerable =
            this.dodgeDuration;


        let dx =
            movement.x;

        let dy =
            movement.y;


        /*
         * Если игрок стоит,
         * dodge идёт по направлению взгляда.
         */

        if (
            Math.abs(dx) < 0.05 &&
            Math.abs(dy) < 0.05
        ) {

            dx =
                this.aimX;

            dy =
                this.aimY;

        }


        const length =
            Math.hypot(dx, dy);


        if (length === 0) {
            return;
        }


        dx /= length;
        dy /= length;


        const distance = 90;


        const nextX =
            this.x +
            dx * distance;


        const nextY =
            this.y +
            dy * distance;


        /*
         * Не позволяем dodge
         * телепортировать игрока
         * внутрь стены.
         */

        if (
            world.canMoveTo(
                nextX,
                this.y,
                this.width,
                this.height
            )
        ) {

            this.x =
                nextX;

        }


        if (
            world.canMoveTo(
                this.x,
                nextY,
                this.width,
                this.height
            )
        ) {

            this.y =
                nextY;

        }

    }


    takeDamage(amount) {

        if (
            this.invulnerable > 0
        ) {

            return;

        }


        this.hp =
            Math.max(
                0,
                this.hp - amount
            );

    }


    gainXP(amount) {

        this.xp += amount;


        while (
            this.xp >= this.xpToNext
        ) {

            this.xp -=
                this.xpToNext;

            this.levelUp();

        }

    }


    levelUp() {

        this.level++;

        this.xpToNext =
            Math.floor(
                this.xpToNext * 1.25
            );

        this.maxHp += 20;

        this.hp =
            this.maxHp;

        this.attackPower += 5;


        if (
            window.game
        ) {

            window.game.showMessage(
                `LEVEL UP — ${this.level}`
            );

        }

    }


    draw(ctx) {

        const x =
            this.x;

        const y =
            this.y;


        /*
         * Тень
         */

        ctx.fillStyle =
            "rgba(0,0,0,0.45)";


        ctx.beginPath();

        ctx.ellipse(
            x,
            y + 17,
            18,
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
            this.invulnerable > 0
                ? "#b9a5ff"
                : "#7358b8";


        ctx.fillRect(
            x - 13,
            y - 15,
            26,
            30
        );


        /*
         * Плащ
         */

        ctx.fillStyle =
            "#15121f";


        ctx.fillRect(
            x - 14,
            y - 10,
            28,
            24
        );


        /*
         * Голова
         */

        ctx.fillStyle =
            "#d7b39a";


        ctx.beginPath();

        ctx.arc(
            x,
            y - 20,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Глаза смотрят туда,
         * куда направлен aim.
         */

        const eyeForward = 7;

        const eyeSide = 4;


        const px =
            -this.aimY;

        const py =
            this.aimX;


        ctx.fillStyle =
            "#9a63ff";


        ctx.fillRect(

            x +
            this.aimX * eyeForward +
            px * eyeSide - 2,

            y - 20 +
            this.aimY * eyeForward +
            py * eyeSide - 2,

            4,
            4

        );


        ctx.fillRect(

            x +
            this.aimX * eyeForward -
            px * eyeSide - 2,

            y - 20 +
            this.aimY * eyeForward -
            py * eyeSide - 2,

            4,
            4

        );


        /*
         * Визуальный aim.
         * Пока очень тонкий,
         * позже заменим оружием.
         */

        if (
            this.attackTimer > 0
        ) {

            const angle =
                Math.atan2(
                    this.aimY,
                    this.aimX
                );


            ctx.save();

            ctx.translate(
                x,
                y
            );

            ctx.rotate(angle);


            ctx.strokeStyle =
                "rgba(190,150,255,0.95)";

            ctx.lineWidth = 5;


            ctx.beginPath();

            ctx.arc(
                9,
                0,
                28,
                -0.65,
                0.65
            );

            ctx.stroke();


            ctx.restore();

        }

    }

}
