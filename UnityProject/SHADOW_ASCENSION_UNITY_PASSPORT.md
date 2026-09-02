# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine:** Unity 6
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** active rebuild / first playable prototype + visual foundation + static audit pass

## Direction
Standalone Unity 6 dark-fantasy 2D action RPG. Dungeon exploration, fast directional melee combat, dodge, shadow enemies, elite/boss encounters, portal progression, loot, quests, skills, inventory and layered RPG HUD. Visual direction: near-black dungeon, cold blue/violet lighting, purple shadow energy, readable hit feedback and dramatic boss presentation.

## Platforms
Primary: Android APK/AAB, Windows PC.
Secondary: Web build for testing/distribution when practical.

## Architecture
```text
UnityProject/Assets/Scripts/
├── Core/       GameManager, SaveSystem, CameraFollow2D
├── Player/     Controller, Stats
├── Combat/     Damageable, PlayerCombat, SkillSystem
├── Enemies/    EnemyBase, ShadowBrute, ShadowHunter, ShadowMage, ShadowEnemy
├── Dungeon/    Portal, DungeonRoom, DungeonGenerator
├── Skills/     reserved for data/assets as combat skills expand
├── Inventory/  reserved for loot/equipment implementation
└── UI/         ShadowHUD
```

## Implemented
- Unity branch isolated under `UnityProject/`.
- Player stats and Rigidbody2D movement/dodge foundation.
- Damageable health/death messaging.
- Directional melee combat with mouse/keyboard-facing arc.
- Base enemy chase/attack AI.
- Four enemy archetypes: ShadowEnemy, ShadowBrute, ShadowHunter, ShadowMage.
- Four-slot Q/E/R/F skill system with area damage and cooldowns.
- DungeonRoom clear detection and portal activation.
- Modular DungeonGenerator for room prefabs.
- Prototype HUD showing level, HP/MP and skill cooldowns.
- Existing Portal and SaveSystem foundation.
- Automated `Shadow Ascension/Create Test Scene` editor builder.
- Generated dark-fantasy 2D art pipeline for hero, shadow enemies, elite, portal, floor and walls.
- Tiled dungeon floor/walls and bounded smooth camera follow in the test scene.

## Verified in Unity Editor
The user opened the Unity 6.6.0f1 project, entered Play Mode, and confirmed **0 errors and 0 warnings** on the initial project smoke test. The generated test scene was created and Play Mode was confirmed to launch successfully.

This does **not** mean Android/Windows builds are verified yet. Those require an actual build on the user's machine.

## Static audit — completed before expansion
The repository was re-read on `unity-shadow-ascension` and the Unity script tree was checked for obvious compile/integration hazards. The audit found and corrected real integration risks:
- `PlayerCombat` and `SkillSystem` no longer silently fail because of an unassigned `LayerMask`; they detect `EnemyBase` directly.
- Enemy attacks target `PlayerStats` safely instead of requiring a player `Damageable`.
- Enemy AI guards null health and clamps invalid serialized ranges/cooldowns.
- `SaveSystem` validates loaded/saved values and handles common filesystem failures.
- Directional combat shares a facing direction with `PlayerController` and supports mouse aim when available.
- Camera follow is bounded to the test dungeon so it cannot drift indefinitely.

## Verification gate
Before every major gameplay expansion:
1. Re-read the affected files.
2. Check type/namespace references and inheritance.
3. Check null/default Inspector dependencies.
4. Check Android/PC input assumptions.
5. Check save/load bounds and failure paths.
6. Only then commit the next system.
7. After Unity import, run a clean compile and Play Mode smoke test before treating the milestone as verified.

## Next implementation order
1. Production 2D character/monster/portal art and animation pipeline.
2. Player mobile input abstraction (virtual stick + attack/skill buttons).
3. Attack VFX + hit-stop/damage feedback + animation-ready state.
4. Enemy death rewards: XP, gold, essence, loot.
5. Boss/Dark Knight controller + boss bar.
6. Chest, traps and room encounter data.
7. Inventory/equipment/loot tables.
8. Quest/journal system.
9. Camera polish, 2D lighting and VFX.
10. Touch-first HUD, Android safe areas, save/load integration and first Android/Windows playable build.

## Project rules
- Do NOT mix Unity code into the Phaser runtime.
- Do NOT delete the old MiniRPG `main` branch.
- All Unity work stays on `unity-shadow-ascension` under `UnityProject/`.
- Prefer data-driven configuration for balancing.
- Android touch controls and PC keyboard/mouse are required.
- No external network dependency for core gameplay.
- Never claim runtime/build verification unless it has actually been performed in Unity Editor/CI.

## Recovery phrase
> Continue **Shadow Ascension** from the Unity 6 passport. Main Unity branch is `unity-shadow-ascension` in `shironaki/MiniRPG`. Unity is isolated under `UnityProject/`; Phaser is only the old browser prototype. Continue from the current Unity files toward a dark-fantasy 2D action RPG for Android + Windows, with Web secondary. Current systems include player movement/stats/dodge, directional combat, enemy AI/archetypes, Q/E/R/F skills, dungeon rooms/generator, portal flow, prototype HUD, generated 2D visuals and bounded camera follow. A source-level audit has already been performed and the initial Unity 6.6 Play Mode smoke test was confirmed by the user. Do not skip verification. Next: production art/animation, mobile controls, attack VFX/feedback, rewards, boss, chest/traps, inventory/loot, quests, camera/art/VFX polish, Android UI and actual build verification.

**Last passport update:** generated visual pipeline, tiled dungeon, camera follow and directional melee added; Unity 6.6 test scene creation/Play Mode confirmed by user with 0 errors and 0 warnings.
