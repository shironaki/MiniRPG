class Dungeon {
    constructor() {
        this.tileSize = 64;
        this.cols = 40;
        this.rows = 25;
        this.width = this.cols * this.tileSize;
        this.height = this.rows * this.tileSize;
        this.walls = [];
        this.rooms = [];
        this.doors = [];
        this.portal = { x: 0, y: 0, radius: 34, active: false, pulse: 0 };
        this.generate();
    }

    generate() {
        this.walls = [];
        this.rooms = [
            { index: 0, x: 1, width: 12, name: "ENTRANCE" },
            { index: 1, x: 13, width: 13, name: "DEPTHS" },
            { index: 2, x: 26, width: 13, name: "ABYSS" }
        ];

        for (let x = 0; x < this.cols; x++) {
            this.walls.push({ x: x * this.tileSize, y: 0, width: this.tileSize, height: this.tileSize });
            this.walls.push({ x: x * this.tileSize, y: (this.rows - 1) * this.tileSize, width: this.tileSize, height: this.tileSize });
        }
        for (let y = 1; y < this.rows - 1; y++) {
            this.walls.push({ x: 0, y: y * this.tileSize, width: this.tileSize, height: this.tileSize });
            this.walls.push({ x: (this.cols - 1) * this.tileSize, y: y * this.tileSize, width: this.tileSize, height: this.tileSize });
        }

        const doorRow = 12;
        for (const dividerX of [13, 26]) {
            for (let y = 1; y < this.rows - 1; y++) {
                if (y !== doorRow) {
                    this.walls.push({ x: dividerX * this.tileSize, y: y * this.tileSize, width: this.tileSize, height: this.tileSize });
                }
            }
        }

        const obstacles = [
            [4, 5, 2, 1], [8, 8, 1, 3], [4, 17, 2, 1],
            [17, 5, 2, 1], [21, 8, 1, 3], [17, 18, 3, 1],
            [29, 5, 2, 1], [34, 8, 1, 3], [29, 18, 3, 1], [35, 14, 1, 2]
        ];
        for (const [x, y, width, height] of obstacles) {
            this.walls.push({ x: x * this.tileSize, y: y * this.tileSize, width: width * this.tileSize, height: height * this.tileSize });
        }

        this.doors = [
            { room: 0, x: 13 * this.tileSize + 32, y: doorRow * this.tileSize + 32, width: 64, height: 64, open: false },
            { room: 1, x: 26 * this.tileSize + 32, y: doorRow * this.tileSize + 32, width: 64, height: 64, open: false }
        ];
        this.portal.x = this.tileSize * 36;
        this.portal.y = this.tileSize * 12.5;
        this.portal.active = false;
    }

    setRoomProgress(roomIndex, enemyDefeated) {
        if (roomIndex === 0) {
            this.doors[0].open = enemyDefeated;
            this.doors[1].open = false;
            this.portal.active = false;
        } else if (roomIndex === 1) {
            this.doors[0].open = true;
            this.doors[1].open = enemyDefeated;
            this.portal.active = false;
        } else if (roomIndex === 2) {
            this.doors[0].open = true;
            this.doors[1].open = true;
            this.portal.active = enemyDefeated;
        }
    }

    canMoveTo(x, y, width, height) {
        const box = { left: x - width / 2, right: x + width / 2, top: y - height / 2, bottom: y + height / 2 };
        for (const wall of this.walls) {
            if (box.right > wall.x && box.left < wall.x + wall.width && box.bottom > wall.y && box.top < wall.y + wall.height) return false;
        }
        for (const door of this.doors) {
            if (door.open) continue;
            if (box.right > door.x - 32 && box.left < door.x + 32 && box.bottom > door.y - 32 && box.top < door.y + 32) return false;
        }
        return true;
    }

    getSpawnPoint(width = 28, height = 36, roomIndex = 0) {
        const room = this.rooms[Math.max(0, Math.min(2, roomIndex))];
        const centerX = (room.x + room.width / 2) * this.tileSize;
        const centerY = 12.5 * this.tileSize;
        if (this.canMoveTo(centerX, centerY, width, height)) return { x: centerX, y: centerY };
        for (let radius = 1; radius < 18; radius++) {
            const distance = radius * 32;
            for (const [x, y] of [[centerX + distance, centerY], [centerX - distance, centerY], [centerX, centerY + distance], [centerX, centerY - distance]]) {
                if (x >= 64 && y >= 64 && x <= this.width - 64 && y <= this.height - 64 && this.canMoveTo(x, y, width, height)) return { x, y };
            }
        }
        return { x: centerX, y: centerY };
    }

    isNearPortal(x, y) {
        return this.portal.active && Math.hypot(x - this.portal.x, y - this.portal.y) <= this.portal.radius;
    }

    getDoorTransition(x, y, roomIndex) {
        if (roomIndex >= 2) return null;
        const door = this.doors[roomIndex];
        return door.open && Math.hypot(x - door.x, y - door.y) <= 42 ? roomIndex + 1 : null;
    }

    update(dt) { this.portal.pulse += dt; }

    drawPortal(ctx) {
        if (!this.portal.active) return;
        const pulse = (Math.sin(this.portal.pulse * 3.2) + 1) * 0.5;
        ctx.save();
        ctx.translate(this.portal.x, this.portal.y);
        ctx.shadowBlur = 28 + pulse * 14;
        ctx.shadowColor = "#8d5cff";
        ctx.strokeStyle = "rgba(150,100,255,0.5)";
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(0, 0, 34 + pulse * 5, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "rgba(210,185,255,0.95)";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 29, 0, Math.PI * 2); ctx.stroke();
        const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 34);
        g.addColorStop(0, "rgba(190,150,255,0.42)"); g.addColorStop(0.55, "rgba(95,45,180,0.2)"); g.addColorStop(1, "rgba(20,10,45,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = "rgba(235,225,255,0.9)"; ctx.font = "700 10px Arial"; ctx.textAlign = "center"; ctx.fillText("PORTAL", 0, 51);
        ctx.restore();
    }

    drawDoors(ctx) {
        for (const door of this.doors) {
            ctx.save(); ctx.translate(door.x, door.y);
            if (door.open) {
                ctx.fillStyle = "rgba(110,75,160,0.12)"; ctx.fillRect(-28, -30, 56, 60);
                ctx.strokeStyle = "rgba(170,130,255,0.45)"; ctx.lineWidth = 2; ctx.strokeRect(-28, -30, 56, 60);
            } else {
                ctx.fillStyle = "#171522"; ctx.fillRect(-28, -30, 56, 60);
                ctx.strokeStyle = "#75539d"; ctx.lineWidth = 3; ctx.strokeRect(-28, -30, 56, 60);
                ctx.fillStyle = "rgba(185,150,255,0.8)"; ctx.fillRect(-3, -9, 6, 18); ctx.fillRect(-9, -3, 18, 6);
            }
            ctx.restore();
        }
    }

    draw(ctx, camera) {
        const startX = Math.floor(camera.x / this.tileSize) - 1;
        const endX = Math.ceil((camera.x + camera.width) / this.tileSize) + 1;
        const startY = Math.floor(camera.y / this.tileSize) - 1;
        const endY = Math.ceil((camera.y + camera.height) / this.tileSize) + 1;
        ctx.fillStyle = "#080b12"; ctx.fillRect(0, 0, this.width, this.height);
        for (let y = startY; y <= endY; y++) for (let x = startX; x <= endX; x++) {
            if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) continue;
            ctx.fillStyle = (x + y) % 2 === 0 ? "#0d121b" : "#0b1018"; ctx.fillRect(x * 64, y * 64, 64, 64);
        }
        for (const wall of this.walls) {
            if (wall.x + wall.width < camera.x || wall.x > camera.x + camera.width || wall.y + wall.height < camera.y || wall.y > camera.y + camera.height) continue;
            const g = ctx.createLinearGradient(wall.x, wall.y, wall.x, wall.y + wall.height);
            g.addColorStop(0, "#303a4d"); g.addColorStop(0.45, "#202938"); g.addColorStop(1, "#151c29");
            ctx.fillStyle = g; ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            ctx.strokeStyle = "#465673"; ctx.lineWidth = 2; ctx.strokeRect(wall.x + 1, wall.y + 1, wall.width - 2, wall.height - 2);
        }
        this.drawDoors(ctx);
        this.drawPortal(ctx);
    }
}
