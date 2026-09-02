# Shadow Ascension — Unity 6

Primary game project for Android and PC. The existing browser/Phaser version is a secondary prototype/test build.

## Target
- Android (APK/AAB)
- PC (Windows first)
- Browser build later as an additional platform

## Architecture
- Core: GameManager, SaveSystem, SceneFlow, Audio
- Player: movement, combat, stats, animation, dodge
- Combat: damage, hitboxes, criticals, status effects
- Enemies: shadows, elites, bosses, AI
- Dungeon: rooms, doors, traps, chests, portals
- Skills: Q/E/R/F-style abilities and cooldowns
- Inventory: items, equipment, loot
- UI: HUD, quests, journal, minimap, inventory, boss bar, skill bar

## First milestone
Create a playable vertical slice: one dungeon floor, one player, three shadow enemy types, one elite/boss, melee attack, dodge, four skills, loot, portal, HUD and save/load.

## Unity setup
Open this folder as a Unity 6 project after the Unity Hub/Editor and required platform modules are installed. Scripts are intentionally organized for expansion rather than a single monolithic game script.
