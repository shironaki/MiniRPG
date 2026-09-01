class Dungeon {

    constructor() {

        this.tileSize = 64;
        this.cols = 40;
        this.rows = 25;

        this.width = this.cols * this.tileSize;
        this.height = this.rows * this.tileSize;

        this.walls = [];

        this.portal = {
            x: 0,
            y: 0,
            radius: 34,
            active: true,
            pulse: 0
        };

        this.generate();
    }


    generate() {

        this.walls = [];

        for (let x = 0; x < this.cols; x++) {
            this.walls.push({ x: x * this.tileSize, y: 0, width: this.tileSize, height: this.tileSize });
            this.walls.push({ x: x * this.tileSize, y: (this.rows - 1) * this.tileSize, width: this.tileSize, height: this.tileSize });
        }

        for (let y = 1; y < this.rows - 1; y++) {
            this.walls.push({ x: 0, y: y * this.tileSize, width: this.tileSize, height: this.tileSize });
            this.walls.push({ x: (this.cols - 1) * this.tileSize, y: y * this.tileSize, width: this.tileSize, height: this.tileSize });
        }

        const obstacles = [
            [8, 5, 2, 1], [14, 5, 1, 3], [22, 4, 2, 1], [29, 7, 1, 3],
            [6, 12, 1, 3], [12, 14, 3, 1], [20, 12, 2, 1], [27, 15, 1, 3], [33, 11, 2, 1],
            [9, 19, 3, 1], [17, 20, 1, 2], [24, 18, 3, 1], [31, 20, 2, 1]
        ];

        for (const obstacle of obstacles) {
            const [x, y, width, height] = obstacle;
            this.walls.push({
                x: x * this.tileSize,
                y: y * this.tileSize,
                width: width * this.tileSize,
                height: height * this.tileSize
            });
        }

        // Portal is deliberately placed in open space near the lower-right area.
        this.portal.x = this.tileSize * 36;
        this.portal.y = this.tileSize * 21;
        this.portal.active = true;
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


    getSpawnPoint(width = 28, height = 36) {

        const centerX = this.width / 2;
        const centerY = this.height / 2;

        if (this.canMoveTo(centerX, centerY, width, height)) {
            return { x: centerX, y: centerY };
        }

        const margin = this.tileSize;
        const step = this.tileSize / 2;

        for (let radius = 1; radius < 20; radius++) {

            const distance = radius * step;

            const points = [
                [centerX + distance, centerY],
                [centerX - distance, centerY],
                [centerX, centerY + distance],
                [centerX, centerY - distance],
                [centerX + distance, centerY + distance],
                [centerX - distance, centerY - distance],
                [centerX + distance, centerY - distance],
                [centerX - distance, centerY + distance]
            ];

            for (const point of points) {
                const x = point[0];
                const y = point[1];

                if (x < margin || y < margin || x > this.width - margin || y > this.height - margin) {
                    continue;
                }

                if (this.canMoveTo(x, y, width, height)) {
                    return { x, y };
                }
            }
        }

        return {
            x: this.tileSize * 2,
            y: this.tileSize * 2
        };
    }


    isNearPortal(x, y) {
        if (!this.portal.active) {
            return false;
        }

        return Math.hypot(x - this.portal.x, y - this.portal.y) <= this.portal.radius;
    }


    update(dt) {
        this.portal.pulse += dt;
    }


    drawPortal(ctx) {

        if (!this.portal.active) {
            return;
        }

        const pulse = (Math.sin(this.portal.pulse * 3.2) + 1) * 0.5;
        const outer = this.portal.radius + pulse * 5;

        ctx.save();
        ctx.translate(this.portal.x, this.portal.y);

        ctx.shadowBlur = 28 + pulse * 14;
        ctx.shadowColor = "#8d5cff";

        ctx.strokeStyle = "rgba(150,100,255,0.45)";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(0, 0, outer, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowBlur = 18;
        ctx.strokeStyle = "rgba(210,185,255,0.95)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.portal.radius - 5, 0, Math.PI * 2);
        ctx.stroke();

        const gradient = ctx.createRadialGradient(0, 0, 4, 0, 0, this.portal.radius);
        gradient.addColorStop(0, "rgba(190,150,255,0.42)");
        gradient.addColorStop(0.55, "rgba(95,45,180,0.20)");
        gradient.addColorStop(1, "rgba(20,10,45,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.portal.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(235,225,255,0.9)";
        ctx.font = "700 10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PORTAL", 0, this.portal.radius + 17);

        ctx.restore();
    }


    draw(ctx, camera) {

        const startX = Math.floor(camera.x / this.tileSize) - 1;
        const endX = Math.ceil((camera.x + camera.width) / this.tileSize) + 1;
        const startY = Math.floor(camera.y / this.tileSize) - 1;
        const endY = Math.ceil((camera.y + camera.height) / this.tileSize) + 1;

        ctx.fillStyle = "#080b12";
        ctx.fillRect(0, 0, this.width, this.height);

        // Subtle floor grid / room structure.
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {

                if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) {
                    continue;
                }

                ctx.fillStyle = (x + y) % 2 === 0 ? "#0d121b" : "#0b1018";
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

                ctx.strokeStyle = "rgba(150,130,210,0.045)";
                ctx.lineWidth = 1;
                ctx.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }

        for (const wall of this.walls) {

            if (
                wall.x + wall.width < camera.x ||
                wall.x > camera.x + camera.width ||
                wall.y + wall.height < camera.y ||
                wall.y > camera.y + camera.height
            ) {
                continue;
            }

            const gradient = ctx.createLinearGradient(wall.x, wall.y, wall.x, wall.y + wall.height);
            gradient.addColorStop(0, "#303a4d");
            gradient.addColorStop(0.45, "#202938");
            gradient.addColorStop(1, "#151c29");

            ctx.fillStyle = gradient;
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

            ctx.strokeStyle = "#465673";
            ctx.lineWidth = 2;
            ctx.strokeRect(wall.x + 1, wall.y + 1, wall.width - 2, wall.height - 2);

            ctx.fillStyle = "rgba(255,255,255,0.055)";
            ctx.fillRect(wall.x + 5, wall.y + 5, Math.max(0, wall.width - 10), 4);
        }

        this.drawPortal(ctx);
    }

}
