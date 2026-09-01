# SHADOW ASCENSION — ПАСПОРТ ПРОЕКТА
Версия документа: 1.5
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
Assets: `assets/player/player-down.svg`, `player-up.svg`, `player-side.svg`, `player-side-left.svg`

## РАБОТАЕТ
- Canvas/game loop/HUD/camera;
- WASD/стрелки;
- мобильные movement/aim joystick;
- collision и безопасный spawn;
- image-based directional player render с fallback;
- aim и directional facing;
- процедурная idle/walk анимация поверх directional assets;
- attack/dodge visual states;
- attack arc с динамическим sweep;
- dodge ring с расширением;
- attack hit particles;
- floating damage numbers;
- XP/level/HP;
- анимированный portal;
- этажи;
- room progression;
- три dungeon rooms;
- закрытые двери с collision;
- убийство врага открывает следующую дверь;
- в Room 3 убийство врага открывает портал;
- отдельный `Enemy` class;
- enemy chase AI с collision;
- enemy melee attack;
- enemy HP bar и hit flash;
- enemy damage numbers;
- player damage numbers.

## ЭТАП 1.5 — PLAYER / ENEMY FOUNDATION
Сделано:
- улучшена процедурная анимация движения игрока: bob, lean, step scale;
- усилены состояния атаки и dodge;
- добавлен динамический визуальный sweep атаки;
- добавлены floating damage numbers;
- создан `js/enemy.js`;
- тестовый враг переведён из объекта внутри Game в отдельный `Enemy` class;
- Enemy получил собственные HP, damage, speed, XP reward, cooldown и состояние жизни;
- Enemy самостоятельно преследует игрока с проверкой dungeon collision;
- Enemy атакует игрока в ближнем бою;
- Enemy получил процедурный dark-fantasy визуал, hit flash и HP bar;
- `index.html` подключает `enemy.js` до `game.js`;
- `game.js` использует Enemy API и больше не содержит старый `drawEnemy()` prototype;
- основной room/door/portal flow сохранён.

## АРХИТЕКТУРНОЕ ПРАВИЛО
`Player` отвечает за игрока и его состояние. `Enemy` отвечает за собственное движение, атаку и получение урона. `Game` управляет сценой, комнатами, переходами и наградами. `Dungeon` отвечает за геометрию, collision, двери и portal. `Effects` отвечает за particles.

Это позволяет дальше добавлять типы врагов, elite и boss без переписывания базового Game loop.

## СЛЕДУЮЩИЙ ПЛАН
1. Добавить отдельные enemy SVG assets и перейти от procedural enemy render к asset pipeline.
2. Сделать базовые enemy types: melee, fast, ranged.
3. Добавить knockback / hit reaction и более выразительные death effects.
4. Добавить Elite-врага с усиленными параметрами и отдельной полосой HP.
5. Добавить Boss encounter в конце dungeon.
6. После стабильного combat — loot/equipment.
7. Death/restart/run result.
8. Shadow Extraction.
9. ARISE / shadow army.

## ПРИНЦИП
Не останавливаться без весомой причины. Перед изменением структуры сверять фактические файлы. `main` не трогать. Ошибки исправлять до следующего слоя. После каждого существенного этапа обновлять паспорт.

## КОРОТКИЙ ПРОМПТ ДЛЯ НОВОЙ СЕССИИ
«Бро, продолжаем Shadow Ascension. Работай в `shadow-ascension` репозитория MiniRPG. Прочитай паспорт, НЕ трогай `main`, сверяй реальные файлы. Не останавливайся без весомой причины — я сам остановлю. Текущее состояние: 3 комнаты/двери/portal, player asset pipeline + procedural animation, combat feedback, Enemy class + chase/melee AI. Следующий шаг — enemy assets → enemy types → hit/death feedback → elite → boss → loot → shadows/ARISE.»
