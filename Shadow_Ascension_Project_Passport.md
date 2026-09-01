# SHADOW ASCENSION — ПАСПОРТ ПРОЕКТА
Версия документа: 1.7
Дата: 2026-09-02

## ГЛАВНАЯ ТОЧКА ВОЗВРАТА
Репозиторий: https://github.com/shironaki/MiniRPG
Рабочая ветка: `shadow-ascension`
`main` — старая MiniRPG, НЕ трогать.

## КОНЦЕПЦИЯ
Оригинальная браузерная top-down action-RPG в тёмном fantasy-направлении. Цель: ПК, Android, iPhone, планшет.

Цикл: HUB → PORTAL → ROOM 1 → ROOM 2 → ROOM 3 → ELITE → BOSS → REWARD → HUB / NEXT DUNGEON.

## ТЕКУЩАЯ СТРУКТУРА
Корень: `index.html`, `style.css`, `Shadow_Ascension_Project_Passport.md`
JS: `camera.js`, `dungeon.js`, `effects.js`, `enemy.js`, `game.js`, `gameLoop.js`, `input.js`, `main.js`, `player.js`
Assets: `assets/player/*` и `assets/enemies/shadow-beast.svg`

## РАБОТАЕТ
- Canvas/game loop/HUD/camera;
- WASD/стрелки;
- мобильные movement/aim joystick;
- collision и безопасный spawn;
- directional player assets с fallback;
- процедурная idle/walk анимация;
- attack/dodge visual states;
- dynamic attack sweep;
- dodge ring;
- hit particles;
- floating damage numbers;
- XP/level/HP;
- animated portal;
- этажи;
- 3 dungeon rooms;
- закрытые двери с collision;
- последовательное открытие дверей;
- переходы между комнатами;
- Room 3 → portal;
- отдельный Enemy class;
- Shadow Beast asset;
- melee enemy AI;
- fast enemy type;
- ranged enemy type;
- ranged projectiles с collision;
- knockback при ударе;
- enemy death particles;
- enemy hit flash и разные HP-bar accents.

## ЭТАП 1.7 — ENEMY COMBAT VARIETY
Сделано:
- Enemy поддерживает типы `melee`, `fast`, `ranged`;
- Room 1 использует базового melee Shadow Beast;
- Room 2 использует быстрого Shadow Stalker;
- Room 3 использует ranged Shadow Wraith;
- ranged враг держит дистанцию и выпускает projectiles;
- projectiles уничтожаются о стены/после жизни и наносят урон игроку;
- быстрый враг атакует чаще;
- обычный враг сохраняет базовую melee-механику;
- атаки игрока получили knockback;
- смерть врага создаёт отдельный burst эффект;
- Game остаётся владельцем комнаты, наград и projectile списка.

## АРХИТЕКТУРНОЕ ПРАВИЛО
`Player` отвечает за игрока. `Enemy` отвечает за собственное движение, атаку, HP и визуал. `Game` управляет сценой, комнатами, переходами, наградами и projectile lifecycle. `Dungeon` отвечает за геометрию, collision, двери и portal. `Effects` отвечает за particles и combat feedback.

## СЛЕДУЮЩИЙ ПЛАН
1. Улучшить spawn/позиционирование врагов и исключить застревание в стенах.
2. Elite-враг: усиленные параметры, aura, отдельный HP/UI.
3. Boss encounter в конце dungeon.
4. Boss phases и telegraphed attacks.
5. Loot/equipment.
6. Death/restart/run result.
7. Shadow Extraction.
8. ARISE / shadow army.

## ПРИНЦИП
Не останавливаться без весомой причины. Перед изменением структуры сверять фактические файлы. `main` не трогать. Ошибки исправлять до следующего слоя. После каждого существенного этапа обновлять паспорт.

## КОРОТКИЙ ПРОМПТ ДЛЯ НОВОЙ СЕССИИ
«Бро, продолжаем Shadow Ascension. Работай в `shadow-ascension` репозитория MiniRPG. Прочитай паспорт, НЕ трогай `main`, сверяй реальные файлы. Не останавливайся без весомой причины — я сам остановлю. Сейчас есть 3 комнаты/двери/portal, player assets + animation/combat feedback, Enemy class, Shadow Beast asset, melee/fast/ranged AI, ranged projectiles, knockback и death effects. Продолжай с spawn safety → elite → boss → loot → death → shadows/ARISE.»
