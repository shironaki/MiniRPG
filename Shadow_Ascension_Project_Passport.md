# SHADOW ASCENSION — ПАСПОРТ ПРОЕКТА
Версия документа: 1.8
Дата: 2026-09-30

## ГЛАВНАЯ ТОЧКА ВОЗВРАТА
Репозиторий: https://github.com/shironaki/MiniRPG
Рабочая ветка: `shadow-ascension`
`main` — старая MiniRPG, НЕ трогать.

## КОНЦЕПЦИЯ
Оригинальная браузерная top-down action-RPG в тёмном fantasy-направлении. Цель: ПК, Android, iPhone, планшет.

Цикл: HUB → PORTAL → ROOM 1 → ROOM 2 → ROOM 3 → ELITE → BOSS → REWARD → HUB / NEXT DUNGEON.

## ТЕКУЩАЯ СТРУКТУРА
Корень: `index.html`, `style.css`, `Shadow_Ascension_Project_Passport.md`
АКТИВНЫЙ RUNTIME: `index.html` → Phaser 3.90 CDN → `js/shadow-engine.js`.
LEGACY JS: `game.js`, `gameLoop.js`, `input.js`, `camera.js`, `dungeon.js`, `effects.js`, `enemy.js`, `player.js`, `main.js` сохранены для старой Canvas-ветки и сейчас НЕ подключаются `index.html`.
Assets: `assets/player/*` и `assets/enemies/shadow-beast.svg`.

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
- enemy hit flash и разные HP-bar accents;
- Phaser runtime с keyboard/mouse/touch controls;
- безопасный поиск spawn-позиции вокруг заданной точки;
- 4 последовательных combat-room вместо 3;
- отдельная Elite-комната перед Boss;
- Elite Hunter с отдельными HP/скоростью/уроном/визуалом;
- Boss вынесен в Room 4.

## ЭТАП 1.8 — ACTIVE PHASER RUNTIME + ELITE GATE
Сделано:
- подтверждён фактический активный runtime: `js/shadow-engine.js`;
- добавлена spawn safety-проверка для врагов и elite/boss;
- progression расширен до Room 1 → Room 2 → Room 3 (Elite) → Room 4 (Boss);
- Elite Hunter добавлен как отдельный тип encounter;
- Boss оставлен отдельным финальным encounter;
- `main` не изменён.

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
1. Проверить в браузере Room 1 → Room 2 → Elite Room → Boss Room и spawn safety.
2. Добавить отдельный Elite HP/UI и телеграф атак.
3. Boss phases и telegraphed attacks.
4. Loot/equipment.
5. Death/restart/run result.
6. Shadow Extraction.
7. ARISE / shadow army.
5. Loot/equipment.
6. Death/restart/run result.
7. Shadow Extraction.
8. ARISE / shadow army.

## ПРИНЦИП
Не останавливаться без весомой причины. Перед изменением структуры сверять фактические файлы. `main` не трогать. Ошибки исправлять до следующего слоя. После каждого существенного этапа обновлять паспорт.

## КОРОТКИЙ ПРОМПТ ДЛЯ НОВОЙ СЕССИИ
«Бро, продолжаем Shadow Ascension. Работай в `shadow-ascension` репозитория MiniRPG. Прочитай паспорт и сверяй реальные файлы. `main` НЕ трогать. Активный runtime — `index.html` + Phaser 3.90 + `js/shadow-engine.js`; старые Canvas JS не подключены. Сейчас progression: Room 1 → Room 2 → Room 3 Elite → Room 4 Boss; есть keyboard/mouse/touch, combat, projectiles, portal и spawn safety. Продолжай с проверки Elite → отдельный Elite UI/telegraphs → Boss phases → loot → death → shadows/ARISE. Не останавливайся без весомой причины.»
