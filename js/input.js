class Input {

    constructor() {

        this.keys = {};

        this.joystick = {
            active: false,
            x: 0,
            y: 0
        };

        this.attackPressed = false;
        this.dodgePressed = false;

        this.joystickElement =
            document.getElementById("joystick");

        this.joystickKnob =
            document.getElementById("joystickKnob");

        this.setupKeyboard();
        this.setupTouch();
        this.setupButtons();
    }


    setupKeyboard() {

        window.addEventListener("keydown", event => {

            this.keys[event.code] = true;

            if (
                event.code === "Space" ||
                event.code.startsWith("Arrow")
            ) {
                event.preventDefault();
            }

        });


        window.addEventListener("keyup", event => {

            this.keys[event.code] = false;

        });

    }


    setupButtons() {

        const attack =
            document.getElementById("attackButton");

        const dodge =
            document.getElementById("dodgeButton");


        attack.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                this.attackPressed = true;

            }
        );


        dodge.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                this.dodgePressed = true;

            }
        );

    }


    setupTouch() {

        if (!this.joystickElement) {
            return;
        }


        this.joystickElement.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                this.joystick.active = true;

                this.joystickElement.setPointerCapture(
                    event.pointerId
                );

                this.updateJoystick(event);

            }
        );


        this.joystickElement.addEventListener(
            "pointermove",
            event => {

                if (!this.joystick.active) {
                    return;
                }

                event.preventDefault();

                this.updateJoystick(event);

            }
        );


        const release = event => {

            if (!this.joystick.active) {
                return;
            }

            this.joystick.active = false;

            this.joystick.x = 0;
            this.joystick.y = 0;

            this.joystickKnob.style.transform =
                "translate(-50%, -50%)";

        };


        this.joystickElement.addEventListener(
            "pointerup",
            release
        );

        this.joystickElement.addEventListener(
            "pointercancel",
            release
        );

        this.joystickElement.addEventListener(
            "lostpointercapture",
            release
        );

    }


    updateJoystick(event) {

        const rect =
            this.joystickElement.getBoundingClientRect();


        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;


        let dx =
            event.clientX - centerX;

        let dy =
            event.clientY - centerY;


        const radius =
            rect.width / 2 - 29;


        const distance =
            Math.hypot(dx, dy);


        if (distance > radius) {

            dx =
                dx / distance * radius;

            dy =
                dy / distance * radius;

        }


        this.joystick.x =
            dx / radius;

        this.joystick.y =
            dy / radius;


        this.joystickKnob.style.transform =
            `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    }


    getMovement() {

        let x = 0;
        let y = 0;


        if (
            this.keys["KeyA"] ||
            this.keys["ArrowLeft"]
        ) {
            x -= 1;
        }

        if (
            this.keys["KeyD"] ||
            this.keys["ArrowRight"]
        ) {
            x += 1;
        }

        if (
            this.keys["KeyW"] ||
            this.keys["ArrowUp"]
        ) {
            y -= 1;
        }

        if (
            this.keys["KeyS"] ||
            this.keys["ArrowDown"]
        ) {
            y += 1;
        }


        if (
            x === 0 &&
            y === 0
        ) {

            x = this.joystick.x;
            y = this.joystick.y;

        }


        const length =
            Math.hypot(x, y);


        if (length > 1) {

            x /= length;
            y /= length;

        }


        return {
            x,
            y
        };

    }


    consumeAttack() {

        if (!this.attackPressed) {
            return false;
        }

        this.attackPressed = false;

        return true;

    }


    consumeDodge() {

        if (
            this.dodgePressed ||
            this.keys["Space"]
        ) {

            this.dodgePressed = false;
            this.keys["Space"] = false;

            return true;

        }

        return false;

    }

}