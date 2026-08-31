class GameLoop {

    constructor(game) {

        this.game = game;

        this.lastTime = 0;

        this.running = false;

        this.frame =
            this.frame.bind(this);

    }


    start() {

        if (this.running) {
            return;
        }

        this.running = true;

        this.lastTime =
            performance.now();

        requestAnimationFrame(
            this.frame
        );

    }


    frame(timestamp) {

        if (!this.running) {
            return;
        }


        let dt =
            (timestamp - this.lastTime) / 1000;


        this.lastTime =
            timestamp;


        // защита от огромного скачка
        dt =
            Math.min(
                dt,
                0.05
            );


        this.game.update(dt);

        this.game.render();


        requestAnimationFrame(
            this.frame
        );

    }


    stop() {

        this.running = false;

    }

}