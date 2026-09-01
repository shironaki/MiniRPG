# SHADOW ASCENSION — ПАСПОРТ ПРОЕКТА
Версия документа: 1.4
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
JS: `camera.js`, `dungeon.js`, `effects.js`, `game.js`, `gameLoop.js`, `input.js`, `main.js`, `player.js`
Assets: `assets/player/player-down.svg`, `player-up.svg`, `player-side.svg`, `player-side-left.svg`

## РАБОТАЕТ
- Canvas/game loop/HUD/camera;
- WASD/стрелки;
- мобильные movement/aim joystick;
- collision и безопасный spawn;
- image-based directional player render с fallback;
- aim и directional facing;
- attack, dodge, invulnerability;
- XP/level/HP;
- анимированный portal;
- этажи;
- room progression;
- три dungeon rooms;
- закрытые двери с collision;
- убийство врага открывает следующую дверь;
- в Room 3 убийство врага открывает портал;
- combat hit particles.

## ЭТАП 1.4 — ROOMS / DOORS / COMBAT FEEDBACK
Сделано:
- dungeon разделён на 3 последовательные комнаты;
- между комнатами физические двери;
- закрытая дверь блокирует движение;
- после убийства врага дверь соответствующей комнаты открывается;
- переход через дверь переносит игрока в следующую комнату;
- каждая комната получает нового тестового врага;
- Room 3 после победы открывает portal;
- HUD показывает `DUNGEON XX · ROOM X`;
- добавлены hit particles при успешной атаке;
- переход на новый этаж возвращает игрока в Room 1.

## ВАЖНО
Текущий враг всё ещё prototype object. Следующий архитектурный шаг — вынести его в `Enemy` class, чтобы затем без переделки Game добавить melee/ranged AI, разные типы, elite и boss.

## СЛЕДУЮЩИЙ ПЛАН
1. Player idle/walk animation frames.
2. Attack/dodge visual states.
3. Damage numbers и более сильный combat feedback.
4. `js/enemy.js` с полноценным Enemy class.
5. Enemy assets.
6. AI и преследование игрока.
7. Разные типы врагов.
8. Elite.
9. Boss.
10. Loot/equipment.
11. Death/restart/run result.
12. Shadow Extraction.
13. ARISE / shadow army.

## ПРИНЦИП
Не останавливаться без весомой причины. Перед изменением структуры сверять фактические файлы. `main` не трогать. Ошибки исправлять до следующего слоя. После каждого существенного этапа обновлять паспорт.

## КОРОТКИЙ ПРОМПТ ДЛЯ НОВОЙ СЕССИИ
«Бро, продолжаем Shadow Ascension. Работай в `shadow-ascension` репозитория MiniRPG. Прочитай паспорт, НЕ трогай `main`, сверяй реальные файлы. Не останавливайся без весомой причины — я сам остановлю. Продолжай с текущего состояния: player animation → combat feedback → Enemy class → enemy assets → AI → elite/boss → loot → shadows/ARISE.»
