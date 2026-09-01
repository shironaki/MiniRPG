class Dungeon {

    constructor() {

        this.tileSize = 64;

        this.cols = 40;
        this.rows = 25;

        this.width =
            this.cols * this.tileSize;

        this.height =
            this.rows * this.tileSize;

        this.walls = [];

        this.generate();
    }


    generate() {

        this.walls = [];

        // Внешняя граница

        for (let x = 0; x < this.cols; x++) {

            this.walls.push({
                x: x * this.tileSize,
                y: 0,
                width: this.tileSize,
                height: this.tileSize
            });

            this.walls.push({
                x: x * this.tileSize,
                y: (this.rows - 1) * this.tileSize,
                width: this.tileSize,
                height: this.tileSize
            });

        }


        for (let y = 1; y < this.rows - 1; y++) {

            this.walls.push({
                x: 0,
                y: y * this.tileSize,
                width: this.tileSize,
                height: this.tileSize
            });

            this.walls.push({
                x: (this.cols - 1) * this.tileSize,
                y: y * this.tileSize,
                width: this.tileSize,
                height: this.tileSize
            });

        }


        // Внутренние препятствия

        const obstacles = [

            [8, 5, 2, 1],
            [14, 5, 1, 3],
            [22, 4, 2, 1],
            [29, 7, 1, 3],

            [6, 12, 1, 3],
            [12, 14, 3, 1],
            [20, 12, 2, 1],
            [27, 15, 1, 3],
            [33, 11, 2, 1],

            [9, 19, 3, 1],
            [17, 20, 1, 2],
            [24, 18, 3, 1],
            [31, 20, 2, 1]

        ];


        for (const obstacle of obstacles) {

            const [x, y, width, height] =
                obstacle;

            this.walls.push({

                x: x * this.tileSize,
                y: y * this.tileSize,

                width:
                    width * this.tileSize,

                height:
                    height * this.tileSize

            });

        }

    }


    canMoveTo(x, y, width, height) {

        const box = {

            left: x - width / 2,
            right: x + width / 2,

            top: y - height / 2,
            bottom: y + height / 2

        };


        for (const wall of this.walls) {

            if (

                box.right > wall.x &&
                box.left < wall.x + wall.width &&
                box.bottom > wall.y &&
                box.top < wall.y + wall.height

            ) {

                return false;

            }

        }


        return true;
    }


    /*
     * Ищем безопасную точку появления.
     */

    getSpawnPoint(width = 28, height = 36) {

        const centerX =
            this.width / 2;

        const centerY =
            this.height / 2;


        // Сначала пытаемся центр.

        if (
            this.canMoveTo(
                centerX,
                centerY,
                width,
                height
            )
        ) {

            return {
                x: centerX,
                y: centerY
            };

        }


        // Затем ищем ближайшую свободную клетку.

        const margin = this.tileSize;

        const step = this.tileSize / 2;


        for (
            let radius = 1;
            radius < 20;
            radius++
        ) {

            const distance =
                radius * step;


            const points = [

                [centerX + distance, centerY],
                [centerX - distance, centerY],
                [centerX, centerY + distance],
                [centerX, centerY - distance],

                [
                    centerX + distance,
                    centerY + distance
                ],

                [
                    centerX - distance,
                    centerY - distance
                ],

                [
                    centerX + distance,
                    centerY - distance
                ],

                [
                    centerX - distance,
                    centerY + distance
                ]

            ];


            for (const point of points) {

                const x = point[0];
                const y = point[1];


                if (
                    x < margin ||
                    y < margin ||
                    x > this.width - margin ||
                    y > this.height - margin
                ) {
                    continue;
                }


                if (
                    this.canMoveTo(
                        x,
                        y,
                        width,
                        height
                    )
                ) {

                    return {
                        x,
                        y
                    };

                }

            }

        }


        // Резервная точка.

        return {

            x: this.tileSize * 2,
            y: this.tileSize * 2

        };

    }


    draw(ctx, camera) {

        const startX =
            Math.floor(
                camera.x / this.tileSize
            ) - 1;

        const endX =
            Math.ceil(
                (
                    camera.x +
                    camera.width
                ) / this.tileSize
            ) + 1;


        const startY =
            Math.floor(
                camera.y / this.tileSize
            ) - 1;

        const endY =
            Math.ceil(
                (
                    camera.y +
                    camera.height
                ) / this.tileSize
            ) + 1;


        // Пол

        ctx.fillStyle =
            "#0c1018";

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );


        // Сетка пола

        for (
            let y = startY;
            y <= endY;
            y++
        ) {

            for (
                let x = startX;
                x <= endX;
                x++
            ) {

                if (
                    x < 0 ||
                    y < 0 ||
                    x >= this.cols ||
                    y >= this.rows
                ) {
                    continue;
                }


                ctx.strokeStyle =
                    "rgba(120,130,160,0.045)";

                ctx.strokeRect(

                    x * this.tileSize,
                    y * this.tileSize,

                    this.tileSize,
                    this.tileSize

                );

            }

        }


        // Стены

        for (const wall of this.walls) {

            if (

                wall.x + wall.width < camera.x ||
                wall.x > camera.x + camera.width ||
                wall.y + wall.height < camera.y ||
                wall.y > camera.y + camera.height

            ) {

                continue;

            }


            ctx.fillStyle =
                "#202938";

            ctx.fillRect(

                wall.x,
                wall.y,
                wall.width,
                wall.height

            );


            ctx.strokeStyle =
                "#35445b";

            ctx.lineWidth = 2;

            ctx.strokeRect(

                wall.x,
                wall.y,
                wall.width,
                wall.height

            );


            ctx.fillStyle =
                "rgba(255,255,255,0.025)";

            ctx.fillRect(

                wall.x + 5,
                wall.y + 5,

                wall.width - 10,
                5

            );

        }

    }

}