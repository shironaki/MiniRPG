class Effects {

    constructor() {

        this.particles = [];

    }


    spawnDust(
        x,
        y,
        amount = 5
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            this.particles.push({

                x,
                y,

                vx:
                    (Math.random() - 0.5) *
                    70,

                vy:
                    (Math.random() - 0.5) *
                    70,

                life:
                    0.4 +
                    Math.random() *
                    0.4,

                maxLife:
                    0.8,

                size:
                    2 +
                    Math.random() *
                    3

            });

        }

    }


    update(dt) {

        for (
            let i =
                this.particles.length - 1;
            i >= 0;
            i--
        ) {

            const particle =
                this.particles[i];


            particle.x +=
                particle.vx * dt;

            particle.y +=
                particle.vy * dt;


            particle.life -= dt;


            if (
                particle.life <= 0
            ) {

                this.particles.splice(
                    i,
                    1
                );

            }

        }

    }


    draw(ctx) {

        for (
            const particle
            of this.particles
        ) {

            const alpha =
                particle.life /
                particle.maxLife;


            ctx.globalAlpha =
                alpha;


            ctx.fillStyle =
                "#9a8bb8";


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        ctx.globalAlpha = 1;

    }

}