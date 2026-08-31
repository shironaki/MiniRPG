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
        this.hp = this.maxHp;

        this.attack = 20;

        this.direction = "down";

        this.isMoving = false;

        this.dodgeTimer = 0;
        this.attackTimer = 0;

        this.attackDuration = 0.18;

        this.dodgeDuration = 0.16;

        this.dodgeSpeed = 620;

        this.invulnerable = 0;

    }


    update(dt, input, world) {

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


        this.isMoving =
            Math.abs(movement.x) > 0.05 ||
            Math.abs(movement.y) > 0.05;


        if (movement.x !== 0) {

            this.direction =
                movement.x > 0
                    ? "right"
                    : "left";

        }
        else if (movement.y !== 0) {

            this.direction =
                movement.y > 0
                    ? "down"
                    : "up";

        }


        if (
            input.consumeDodge() &&
            this.dodgeTimer <= 0
        ) {

            this.dodge(
                movement
            );

        }


        let speed =
            this.speed;


        if (this.dodgeTimer > 0) {
            speed = this.dodgeSpeed;
        }


        const nextX =
            this.x +
            movement.x *
            speed *
            dt;


        const nextY =
            this.y +
            movement.y *
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


        if (
            input.consumeAttack()
        ) {

            this.attack();

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


    dodge(movement) {

        this.dodgeTimer =
            this.dodgeDuration;

        this.invulnerable =
            this.dodgeDuration;


        if (
            movement.x === 0 &&
            movement.y === 0
        ) {

            if (this.direction === "left") {
                this.x -= 80;
            }

            if (this.direction === "right") {
                this.x += 80;
            }

            if (this.direction === "up") {
                this.y -= 80;
            }

            if (this.direction === "down") {
                this.y += 80;
            }

        }

    }


    takeDamage(amount) {

        if (this.invulnerable > 0) {
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

        this.attack += 5;

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


        // shadow
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


        // body
        ctx.fillStyle =
            this.invulnerable > 0
                ? "#b8a2ff"
                : "#7257b8";


        ctx.fillRect(
            x - 13,
            y - 15,
            26,
            30
        );


        // cloak
        ctx.fillStyle =
            "#171426";

        ctx.fillRect(
            x - 14,
            y - 10,
            28,
            24
        );


        // head
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


        // eyes
        ctx.fillStyle =
            "#8d5cff";


        if (
            this.direction === "left"
        ) {

            ctx.fillRect(
                x - 8,
                y - 22,
                3,
                3
            );

        }
        else if (
            this.direction === "right"
        ) {

            ctx.fillRect(
                x + 5,
                y - 22,
                3,
                3
            );

        }
        else {

            ctx.fillRect(
                x - 6,
                y - 22,
                3,
                3
            );

            ctx.fillRect(
                x + 3,
                y - 22,
                3,
                3
            );

        }


        // attack effect
        if (
            this.attackTimer > 0
        ) {

            ctx.strokeStyle =
                "rgba(190,150,255,0.9)";

            ctx.lineWidth = 5;

            ctx.beginPath();

            if (
                this.direction === "left"
            ) {

                ctx.arc(
                    x - 8,
                    y,
                    28,
                    Math.PI * 0.6,
                    Math.PI * 1.4
                );

            }
            else if (
                this.direction === "right"
            ) {

                ctx.arc(
                    x + 8,
                    y,
                    28,
                    -Math.PI * 0.4,
                    Math.PI * 0.4
                );

            }
            else if (
                this.direction === "up"
            ) {

                ctx.arc(
                    x,
                    y - 8,
                    28,
                    Math.PI,
                    Math.PI * 2
                );

            }
            else {

                ctx.arc(
                    x,
                    y + 8,
                    28,
                    0,
                    Math.PI
                );

            }

            ctx.stroke();

        }

    }

}