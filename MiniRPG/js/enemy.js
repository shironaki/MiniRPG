class Enemy {

    constructor(
        name,
        health,
        attack,
        defense,
        experience,
        gold
    ) {

        this.name = name;

        this.maxHealth = health;
        this.health = health;

        this.attack = attack;
        this.defense = defense;

        this.experience = experience;
        this.gold = gold;
    }


    takeDamage(damage) {

        const finalDamage =
            Math.max(
                damage - this.defense,
                1
            );


        this.health -=
            finalDamage;


        if (this.health < 0) {

            this.health = 0;
        }


        return finalDamage;
    }


    attackPlayer(player) {

        const damage =
            this.attack +
            Math.floor(Math.random() * 6);


        return player.takeDamage(
            damage
        );
    }


    isDead() {

        return this.health <= 0;
    }
}