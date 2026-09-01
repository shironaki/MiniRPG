class Input {

    constructor() {

        this.keys = {};

        this.mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            active: false
        };


        this.moveJoystick = {
            active: false,
            x: 0,
            y: 0
        };


        this.aimJoystick = {
            active: false,
            x: 0,
            y: 0
        };


        this.attackPressed = false;
        this.dodgePressed = false;


        this.moveJoystickElement =
            document.getElementById(
                "joystick"
            );

        this.moveJoystickKnob =
            document.getElementById(
                "joystickKnob"
            );


        this.aimJoystickElement =
            document.getElementById(
                "aimJoystick"
            );

        this.aimJoystickKnob =
            document.getElementById(
                "aimJoystickKnob"
            );


        this.setupKeyboard();
        this.setupMouse();
        this.setupJoystick(
            this.moveJoystick,
            this.moveJoystickElement,
            this.moveJoystickKnob
        );

        this.setupJoystick(
            this.aimJoystick,
            this.aimJoystickElement,
            this.aimJoystickKnob
        );

        this.setupButtons();
    }


    setupKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                this.keys[event.code] = true;


                if (
                    event.code === "Space" ||
                    event.code.startsWith("Arrow")
                ) {

                    event.preventDefault();

                }

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                this.keys[event.code] = false;

            }
        );

    }


    setupMouse() {

        window.addEventListener(
            "pointermove",
            event => {

                this.mouse.x =
                    event.clientX;

                this.mouse.y =
                    event.clientY;

                this.mouse.active = true;

            }
        );


        window.addEventListener(
            "pointerdown",
            event => {

                if (
                    event.pointerType === "mouse" &&
                    event.button === 0
                ) {

                    this.attackPressed = true;

                }

            }
        );

    }


    setupButtons() {

        const attack =
            document.getElementById(
                "attackButton"
            );

        const dodge =
            document.getElementById(
                "dodgeButton"
            );


        if (attack) {

            attack.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();

                    this.attackPressed = true;

                }
            );

        }


        if (dodge) {

            dodge.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();

                    this.dodgePressed = true;

                }
            );

        }

    }


    setupJoystick(
        joystick,
        element,
        knob
    ) {

        if (!element || !knob) {
            return;
        }


        element.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                joystick.active = true;

                element.setPointerCapture(
                    event.pointerId
                );

                this.updateJoystick(
                    joystick,
                    element,
                    knob,
                    event
                );

            }
        );


        element.addEventListener(
            "pointermove",
            event => {

                if (!joystick.active) {
                    return;
                }

                event.preventDefault();

                this.updateJoystick(
                    joystick,
                    element,
                    knob,
                    event
                );

            }
        );


        const release = () => {

            joystick.active = false;

            joystick.x = 0;
            joystick.y = 0;

            knob.style.transform =
                "translate(-50%, -50%)";

        };


        element.addEventListener(
            "pointerup",
            release
        );

        element.addEventListener(
            "pointercancel",
            release
        );

        element.addEventListener(
            "lostpointercapture",
            release
        );

    }


    updateJoystick(
        joystick,
        element,
        knob,
        event
    ) {

        const rect =
            element.getBoundingClientRect();


        const centerX =
            rect.left +
            rect.width / 2;

        const centerY =
            rect.top +
            rect.height / 2;


        let dx =
            event.clientX -
            centerX;

        let dy =
            event.clientY -
            centerY;


        const radius =
            rect.width / 2 - 29;


        const distance =
            Math.hypot(dx, dy);


        if (distance > radius) {

            dx =
                dx / distance *
                radius;

            dy =
                dy / distance *
                radius;

        }


        joystick.x =
            dx / radius;

        joystick.y =
            dy / radius;


        knob.style.transform =
            `translate(
                calc(-50% + ${dx}px),
                calc(-50% + ${dy}px)
            )`;

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

            x =
                this.moveJoystick.x;

            y =
                this.moveJoystick.y;

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


    getAim(player, camera) {

        // Мобильный aim joystick

        if (
            this.aimJoystick.active ||
            Math.abs(this.aimJoystick.x) > 0.05 ||
            Math.abs(this.aimJoystick.y) > 0.05
        ) {

            const x =
                this.aimJoystick.x;

            const y =
                this.aimJoystick.y;


            const length =
                Math.hypot(x, y);


            if (length > 0.05) {

                return {
                    x: x / length,
                    y: y / length
                };

            }

        }


        // ПК — мышь

        const playerScreenX =
            player.x - camera.x;

        const playerScreenY =
            player.y - camera.y;


        let x =
            this.mouse.x -
            playerScreenX;

        let y =
            this.mouse.y -
            playerScreenY;


        const length =
            Math.hypot(x, y);


        if (length > 8) {

            return {
                x: x / length,
                y: y / length
            };

        }


        // Если прицел не задан —
        // сохраняем старое направление.

        return {
            x: player.aimX,
            y: player.aimY
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