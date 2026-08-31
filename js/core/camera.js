class Camera {

    constructor(width, height) {

        this.x = 0;
        this.y = 0;

        this.width = width;
        this.height = height;

        this.shake = 0;

    }


    resize(width, height) {

        this.width = width;
        this.height = height;

    }


    follow(target, worldWidth, worldHeight) {

        this.x =
            target.x -
            this.width / 2;


        this.y =
            target.y -
            this.height / 2;


        this.x =
            Math.max(
                0,
                Math.min(
                    this.x,
                    worldWidth - this.width
                )
            );


        this.y =
            Math.max(
                0,
                Math.min(
                    this.y,
                    worldHeight - this.height
                )
            );

    }


    updateShake(dt) {

        if (this.shake > 0) {

            this.shake -= dt;

            if (this.shake < 0) {
                this.shake = 0;
            }

        }

    }


    addShake(amount) {

        this.shake =
            Math.max(
                this.shake,
                amount
            );

    }


    apply(ctx) {

        if (this.shake <= 0) {
            return;
        }


        const power =
            this.shake * 0.5;


        const offsetX =
            (Math.random() - 0.5) * power;

        const offsetY =
            (Math.random() - 0.5) * power;


        ctx.translate(
            offsetX,
            offsetY
        );

    }

}