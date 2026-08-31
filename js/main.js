const game =
    new Game();


// =============================================
// ОБЩИЕ ФУНКЦИИ
// =============================================

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.add(
                "hidden"
            );
        });


    document
        .getElementById(id)
        .classList.remove(
            "hidden"
        );
}


function addLog(message) {

    const log =
        document.getElementById(
            "log"
        );


    const line =
        document.createElement(
            "div"
        );


    line.innerHTML =
        message;


    log.prepend(line);
}


// =============================================
// НОВАЯ ИГРА
// =============================================

document
    .getElementById("newGameButton")
    .addEventListener(
        "click",
        () => {

            game.start();

        }
    );


// =============================================
// КАК ИГРАТЬ
// =============================================

document
    .getElementById("helpButton")
    .addEventListener(
        "click",
        () => {

            alert(`

MINI RPG 7.0

🎮 Создай героя.

🏘️ В городе:
- разговаривай с NPC
- бери квесты
- покупай предметы
- управляй инвентарём

🗺️ В мире:
- перемещайся по направлениям
- исследуй комнаты
- встречай врагов

⚔️ В бою:
- атакуй
- лечись
- защищайся

💥 Критический удар:
10%

💀 Если HP станет 0 —
игра закончится.

🏆 Найди сокровище
и заверши приключение!

            `);

        }
    );


// =============================================
// NPC
// =============================================

document
    .getElementById("npcButton")
    .addEventListener(
        "click",
        () => {

            showScreen(
                "npcScreen"
            );


            document
                .getElementById(
                    "npcDialogue"
                )
                .innerHTML =
                    game.npc.talk(
                        game.player,
                        game.quest
                    );
        }
    );


// =============================================
// ПОЛУЧИТЬ КВЕСТ
// =============================================

document
    .getElementById("npcQuestButton")
    .addEventListener(
        "click",
        () => {

            if (
                !game.quest.active
            ) {

                addLog(
                    game.quest.start()
                );
            }


            document
                .getElementById(
                    "npcDialogue"
                )
                .innerHTML =
                    game.npc.talk(
                        game.player,
                        game.quest
                    );


            renderQuest();
        }
    );


// =============================================
// КВЕСТЫ
// =============================================

document
    .getElementById("questButton")
    .addEventListener(
        "click",
        () => {

            showScreen(
                "questScreen"
            );

            renderQuest();
        }
    );


function renderQuest() {

    document
        .getElementById(
            "questList"
        )
        .innerHTML =
            game.quest.render();
}


// =============================================
// МАГАЗИН
// =============================================

document
    .getElementById("shopButton")
    .addEventListener(
        "click",
        () => {

            showShop();

        }
    );


function showShop() {

    showScreen(
        "shopScreen"
    );


    document
        .getElementById(
            "shopGold"
        )
        .innerHTML =
            `💰 Золото: ${game.player.gold}`;


    document
        .getElementById(
            "shopItems"
        )
        .innerHTML = `

            ${game.shop.renderShop()}

            <button
                onclick="showSellItems()"
            >
                💰 Продать предметы
            </button>

        `;
}


function buyItem(index) {

    const item =
        game.shop.items[index];


    const result =
        game.shop.buy(item);


    addLog(
        result.message
    );


    showShop();

    game.updateUI();
}


function showSellItems() {

    showScreen(
        "shopScreen"
    );


    document
        .getElementById(
            "shopGold"
        )
        .innerHTML =
            `💰 Золото: ${game.player.gold}`;


    document
        .getElementById(
            "shopItems"
        )
        .innerHTML = `

            <h3>
                💰 Продажа
            </h3>

            ${game.shop.renderPlayerItems()}

            <button
                onclick="showShop()"
            >
                🛒 Покупки
            </button>

        `;
}


function sellItem(index) {

    const item =
        game.player.inventory[index];


    const result =
        game.shop.sell(item);


    addLog(
        result.message
    );


    showSellItems();

    game.updateUI();
}


// =============================================
// ИНВЕНТАРЬ
// =============================================

document
    .getElementById("inventoryButton")
    .addEventListener(
        "click",
        showInventory
    );


function showInventory() {

    showScreen(
        "inventoryScreen"
    );


    document
        .getElementById(
            "inventoryList"
        )
        .innerHTML =
            game.inventory.render();
}


function inventoryUse(index) {

    const item =
        game.inventory.getItems()[index];


    const result =
        game.inventory.use(item);


    addLog(
        result.message
    );


    showInventory();

    game.updateUI();
}


function inventoryRemove(index) {

    const item =
        game.inventory.getItems()[index];


    if (
        game.inventory.remove(item)
    ) {

        addLog(
            `🗑️ ${item.name} удалён.`
        );
    }


    showInventory();
}


// =============================================
// МИР
// =============================================

document
    .getElementById("worldButton")
    .addEventListener(
        "click",
        showWorld
    );


function showWorld() {

    showScreen(
        "worldScreen"
    );


    renderWorld();
}


function renderWorld() {

    const location =
        game.world.getCurrentLocation();


    document
        .getElementById(
            "worldDescription"
        )
        .innerHTML = `

            <h3>
                ${location.name}
            </h3>

            <p>
                ${location.description}
            </p>

        `;
}


// =============================================
// ПЕРЕМЕЩЕНИЕ
// =============================================

document
    .querySelectorAll(
        "[data-direction]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                movePlayer(
                    button.dataset.direction
                );

            }
        );

    });


function movePlayer(direction) {

    const result =
        game.world.move(
            direction
        );


    if (!result.success) {

        addLog(
            result.message
        );

        return;
    }


    addLog(
        `🗺️ Ты переместился: ${result.location.name}`
    );


    renderLocation();


    showScreen(
        "locationScreen"
    );
}


// =============================================
// ЛОКАЦИЯ
// =============================================

function renderLocation() {

    const location =
        game.world.getCurrentLocation();


    document
        .getElementById(
            "locationName"
        )
        .textContent =
            location.name;


    document
        .getElementById(
            "locationDescription"
        )
        .textContent =
            location.description;


    const actions =
        document.getElementById(
            "locationActions"
        );


    actions.innerHTML = "";


    // Лес → гоблин

    if (
        game.world.currentLocation ===
        "room3"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            "👹 Исследовать лес";


        button.onclick =
            () => {

                const enemy =
                    new Enemy(
                        "Гоблин",
                        50,
                        10,
                        3,
                        30,
                        25
                    );


                game.startBattle(
                    enemy
                );
            };


        actions.appendChild(
            button
        );
    }


    // Комната 4 → сокровище

    if (
        game.world.currentLocation ===
        "room4"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            "💎 Забрать сокровище";


        button.onclick =
            () => {

                game.victory();

            };


        actions.appendChild(
            button
        );
    }


    if (
        actions.innerHTML === ""
    ) {

        actions.innerHTML = `

            <div class="locationEmpty">
                🌙 Здесь пока ничего интересного.
            </div>

        `;
    }
}


// =============================================
// НАЗАД К КАРТЕ
// =============================================

document
    .getElementById(
        "locationBackButton"
    )
    .addEventListener(
        "click",
        () => {

            showWorld();

        }
    );


// =============================================
// БОЙ
// =============================================

document
    .getElementById(
        "attackButton"
    )
    .addEventListener(
        "click",
        () => {

            if (!game.battle) {
                return;
            }


            game.battle.playerAttack();

            game.showEnemy();

            game.updateUI();
        }
    );


document
    .getElementById(
        "healButton"
    )
    .addEventListener(
        "click",
        () => {

            if (!game.battle) {
                return;
            }


            game.battle.playerHeal();

            game.showEnemy();
        }
    );


document
    .getElementById(
        "defendButton"
    )
    .addEventListener(
        "click",
        () => {

            if (!game.battle) {
                return;
            }


            game.battle.playerDefend();

            game.showEnemy();
        }
    );


// =============================================
// КНОПКИ НАЗАД
// =============================================

document
    .getElementById(
        "inventoryBackButton"
    )
    .addEventListener(
        "click",
        () => {

            showScreen(
                "villageScreen"
            );
        }
    );


document
    .getElementById(
        "shopBackButton"
    )
    .addEventListener(
        "click",
        () => {

            showScreen(
                "villageScreen"
            );
        }
    );


document
    .getElementById(
        "npcBackButton"
    )
    .addEventListener(
        "click",
        () => {

            showScreen(
                "villageScreen"
            );
        }
    );


document
    .getElementById(
        "questBackButton"
    )
    .addEventListener(
        "click",
        () => {

            showScreen(
                "villageScreen"
            );
        }
    );


document
    .getElementById(
        "returnVillageButton"
    )
    .addEventListener(
        "click",
        () => {

            showScreen(
                "villageScreen"
            );
        }
    );


// =============================================
// RESTART
// =============================================

document
    .getElementById(
        "restartButton"
    )
    .addEventListener(
        "click",
        () => {

            location.reload();

        }
    );