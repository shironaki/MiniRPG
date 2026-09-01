# SHADOW ASCENSION — ПАСПОРТ ПРОЕКТА
Версия документа: 1.6
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
- процедурная idle/walk анимация: bob, lean, step scale;
- attack/dodge visual states;
- динамический attack sweep;
- dodge ring;
- hit particles;
- floating damage numbers;
- XP/level/HP;
- анимированный portal;
- этажи;
- 3 dungeon rooms;
- закрытые двери с collision;
- последовательное открытие дверей;
- переходы между комнатами;
- Room 3 → portal;
- отдельный Enemy class;
- Shadow Beast SVG asset;
- enemy chase AI с collision;
- enemy melee attack;
- enemy HP bar, hit flash и damage feedback.

## ЭТАП 1.6 — ENEMY ASSET PIPELINE
Сделано:
- добавлен отдельный `assets/enemies/shadow-beast.svg`;
- Enemy теперь загружает собственный visual asset;
- сохранён procedural fallback на случай задержки загрузки;
- physics body Enemy остаётся независимым от размера картинки;
- существующий combat/AI не сломан переходом на asset render.

## АРХИТЕКТУРНОЕ ПРАВИЛО
`Player` отвечает за игрока. `Enemy` отвечает за собственное движение, атаку, HP и визуал. `Game` управляет сценой, комнатами, переходами и наградами. `Dungeon` отвечает за геометрию, collision, двери и portal. `Effects` отвечает за particles и combat feedback.

## СЛЕДУЮЩИЙ ПЛАН
1. Enemy types: melee / fast / ranged.
2. Knockback, hit reaction и death effects.
3. Улучшить spawn/позиционирование врагов и исключить застревание в стенах.
4. Elite-враг с усиленными параметрами и отдельным UI.
5. Boss encounter в конце dungeon.
6. Loot/equipment.
7. Death/restart/run result.
8. Shadow Extraction.
9. ARISE / shadow army.

## ПРИНЦИП
Не останавливаться без весомой причины. Перед изменением структуры сверять фактические файлы. `main` не трогать. Ошибки исправлять до следующего слоя. После каждого существенного этапа обновлять паспорт.

## КОРОТКИЙ ПРОМПТ ДЛЯ НОВОЙ СЕССИИ
«Бро, продолжаем Shadow Ascension. Работай в `shadow-ascension` репозитория MiniRPG. Прочитай паспорт, НЕ трогай `main`, сверяй реальные файлы. Не останавливайся без весомой причины — я сам остановлю. Сейчас уже есть 3 комнаты/двери/portal, player assets + animation/combat feedback, Enemy class + Shadow Beast asset + chase/melee AI. Продолжай с enemy types → hit/death → elite → boss → loot → shadows/ARISE.»
