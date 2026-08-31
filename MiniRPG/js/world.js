class World {

    constructor() {

        this.currentLocation =
            "start";


        this.locations = {

            start: {

                name: "🏕️ Старт",

                description:
                    "Ты стоишь на развилке.",

                north: "room2",
                east: "room3",

                south: null,
                west: "room1"
            },


            room1: {

                name: "🏚️ Комната 1",

                description:
                    "Старая заброшенная комната.",

                north: null,
                south: null,
                east: "start",
                west: null
            },


            room2: {

                name: "🏰 Комната 2",

                description:
                    "Здесь очень тихо.",

                north: null,
                south: "start",
                east: null,
                west: null
            },


            room3: {

                name: "🌲 Лес",

                description:
                    "Опасный лес, где живут гоблины.",

                north: null,
                south: "room4",
                east: null,
                west: "start"
            },


            room4: {

                name: "💎 Комната 4",

                description:
                    "Здесь находится древнее сокровище!",

                north: "room3",
                south: null,
                east: null,
                west: null
            }
        };
    }


    move(direction) {

        const location =
            this.locations[
                this.currentLocation
            ];


        const next =
            location[direction];


        if (!next) {

            return {
                success: false,
                message:
                    "🧱 В этом направлении пути нет."
            };
        }


        this.currentLocation =
            next;


        return {
            success: true,
            location:
                this.locations[next]
        };
    }


    getCurrentLocation() {

        return this.locations[
            this.currentLocation
        ];
    }
}