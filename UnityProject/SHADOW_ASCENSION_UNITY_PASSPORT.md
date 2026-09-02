# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine:** Unity 6
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** active rebuild / foundation + gameplay systems + first visual prototype + static audit pass

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
- Melee PlayerCombat.
- Base enemy chase/attack AI.
- Four enemy archetypes: ShadowEnemy, ShadowBrute, ShadowHunter, ShadowMage.
- Four-slot Q/E/R/F skill system with area damage and cooldowns.
- DungeonRoom clear detection and portal activation.
- Modular DungeonGenerator for room prefabs.
- Prototype HUD showing level, HP/MP and skill cooldowns.
- Existing Portal and SaveSystem foundation.
- Automated `Shadow Ascension/Create Test Scene` editor builder.
- First generated 2D visual prototype: dungeon tile floor, arena accent, stone walls, stylized player, four shadow enemy silhouettes and portal. These are temporary prototype visuals and will later be replaced/expanded with proper production art, animation and VFX.

## Static audit — completed before further expansion
The repository was re-read on `unity-shadow-ascension` and the Unity script tree was checked for obvious compile/integration hazards. The audit found real integration risks and they were corrected before continuing:
- `PlayerCombat` and `SkillSystem` no longer silently fail because an unassigned `LayerMask` is zero; they detect `EnemyBase` directly.
- Enemy attacks no longer depend on a `Damageable` component being present on the player; they safely target `PlayerStats`.
- Enemy AI now guards null health and clamps invalid serialized ranges/cooldowns.
- `SaveSystem` validates loaded/saved values and handles common filesystem failures instead of crashing gameplay.
- No remaining `override Update` mismatch was found after the earlier `ShadowEnemy` correction.

**Important verification limit:** this environment cannot launch the Unity 6 Editor, enter Play Mode, compile the project with the installed Unity package set, or build an APK. Therefore the audit is a source/tree integration audit, not a claim of a successful Unity runtime build. The user's Unity Editor test has now confirmed that the generated test scene can be created and Play Mode starts with 0 errors and 0 warnings. This verifies the current imported scene at the user's local Unity 6.6 setup, but not an Android build yet.

## Verification gate
Before every major gameplay expansion:
1. Re-read the affected files.
2. Check type/namespace references and inheritance.
3. Check null/default Inspector dependencies.
4. Check Android/PC input assumptions.
5. Check save/load bounds and failure paths.
6. Only then commit the next system.
7. After Unity Hub import, run a clean compile and Play Mode smoke test before treating the milestone as verified.

## Next implementation order
1. Replace prototype visual placeholders with production-ready 2D character/monster/portal art pipeline.
2. Player mobile input abstraction (virtual stick + attack/skill buttons).
3. Player attack direction + animation-ready combat state.
4. Enemy death rewards: XP, gold, essence, loot.
5. Boss/Dark Knight controller + boss bar.
6. Chest, traps and room encounter data.
7. Inventory/equipment/loot tables.
8. Quest/journal system.
9. Camera, dungeon visuals, 2D lighting and VFX.
10. Touch-first HUD, Android safe areas, save/load integration and first playable build.

## Project rules
- Do NOT mix Unity code into the Phaser runtime.
- Do NOT delete the old MiniRPG `main` branch.
- All Unity work stays on `unity-shadow-ascension` under `UnityProject/`.
- Prefer data-driven configuration for balancing.
- Android touch controls and PC keyboard/mouse are required.
- No external network dependency for core gameplay.
- Never claim runtime/build verification unless it has actually been performed in Unity Editor/CI.

## Recovery phrase
> Continue **Shadow Ascension** from the Unity 6 passport. Main Unity branch is `unity-shadow-ascension` in `shironaki/MiniRPG`. Unity is isolated under `UnityProject/`; Phaser is only the old browser prototype. Continue from the current Unity files toward a dark-fantasy 2D action RPG for Android + Windows, with Web secondary. Current systems include player movement/stats/dodge, combat damage, enemy AI/archetypes, Q/E/R/F skills, dungeon rooms/generator, portal flow, prototype HUD and generated 2D placeholder visuals. A source-level audit has already been performed and the user's Unity 6.6 Play Mode test has confirmed the current test scene starts with 0 errors and 0 warnings. Do not skip verification. Next: production art pipeline, mobile controls, attack direction, rewards, boss, chest/traps, inventory/loot, quests, camera/art/VFX, Android UI and actual build verification.

**Last passport update:** generated 2D prototype visuals added; Unity 6.6 test scene Play Mode confirmed by user with 0 errors and 0 warnings.
