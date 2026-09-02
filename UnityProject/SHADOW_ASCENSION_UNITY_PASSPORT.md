# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine:** Unity 6
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** active rebuild / foundation + gameplay systems

## Direction
Standalone Unity 6 dark-fantasy 2D action RPG. Dungeon exploration, fast melee combat, dodge, shadow enemies, elite/boss encounters, portal progression, loot, quests, skills, inventory and layered RPG HUD. Visual direction: near-black dungeon, cold blue/violet lighting, purple shadow energy, readable hit feedback and dramatic boss presentation.

## Platforms
Primary: Android APK/AAB, Windows PC.
Secondary: Web build for testing/distribution when practical.

## Architecture
```text
UnityProject/Assets/Scripts/
├── Core/       GameManager, SaveSystem
├── Player/     Controller, Stats
├── Combat/     Damageable, PlayerCombat, SkillSystem
├── Enemies/    EnemyBase, ShadowEnemy, ShadowBrute, ShadowHunter, ShadowMage
├── Dungeon/    Portal, DungeonRoom, DungeonGenerator
├── Skills/     reserved for data/assets as combat skills expand
├── Inventory/  reserved for loot/equipment implementation
└── UI/         ShadowHUD
```

## Implemented
- Unity branch isolated under `UnityProject/`.
- Player stats and Rigidbody2D movement/dodge foundation.
- Damageable health/death messaging.
- Melee PlayerCombat with configurable enemy LayerMask.
- Base enemy chase/attack AI.
- Four enemy archetypes: ShadowEnemy, ShadowBrute, ShadowHunter, ShadowMage.
- Four-slot Q/E/R/F skill system with area damage and cooldowns.
- DungeonRoom clear detection and portal activation.
- Modular DungeonGenerator for room prefabs.
- Prototype HUD showing level, HP/MP and skill cooldowns.
- Existing Portal and SaveSystem foundation retained.

## Next implementation order
1. Fix/verify PlayerCombat direction + animation-ready attack state.
2. Player mobile input abstraction (virtual stick + attack/skill buttons).
3. Enemy death rewards: XP, gold, essence, loot.
4. Boss/Dark Knight controller + boss bar.
5. Chest, traps and room encounter data.
6. Inventory/equipment/loot tables.
7. Quest/journal system.
8. Camera, dungeon visuals, 2D lighting and VFX.
9. Touch-first HUD and Android safe areas.
10. Save/load integration and first playable build.

## Project rules
- Do NOT mix Unity code into the Phaser runtime.
- Do NOT delete the old MiniRPG `main` branch.
- All Unity work stays on `unity-shadow-ascension` under `UnityProject/`.
- Prefer data-driven configuration for balancing.
- Android touch controls and PC keyboard/mouse are required.
- No external network dependency for core gameplay.

## Recovery phrase
> Continue **Shadow Ascension** from the Unity 6 passport. Main Unity branch is `unity-shadow-ascension` in `shironaki/MiniRPG`. Unity is isolated under `UnityProject/`; Phaser is only the old browser prototype. Continue from the current Unity files toward a dark-fantasy 2D action RPG for Android + Windows, with Web secondary. Current systems include player movement/stats/dodge, combat damage, enemy AI/archetypes, Q/E/R/F skills, dungeon rooms/generator, portal flow and prototype HUD. Next: mobile controls, rewards, boss, chest/traps, inventory/loot, quests, camera/art/VFX, Android UI and save/build verification.

**Last passport update:** gameplay foundation expanded with enemies, skills, dungeon flow and HUD.
