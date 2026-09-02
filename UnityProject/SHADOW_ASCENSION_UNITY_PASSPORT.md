# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine:** Unity 6
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** active rebuild / foundation + gameplay systems + static audit pass

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

## Static audit — completed before further expansion
The repository was re-read on `unity-shadow-ascension` and the Unity script tree was checked for obvious compile/integration hazards. The audit found real integration risks and they were corrected before continuing:
- `PlayerCombat` and `SkillSystem` no longer silently fail because an unassigned `LayerMask` is zero; they detect `EnemyBase` directly.
- Enemy attacks no longer depend on a `Damageable` component being present on the player; they safely target `PlayerStats`.
- Enemy AI now guards null health and clamps invalid serialized ranges/cooldowns.
- `SaveSystem` validates loaded/saved values and handles common filesystem failures instead of crashing gameplay.
- No remaining `override Update` mismatch was found after the earlier `ShadowEnemy` correction.

**Important verification limit:** this environment cannot launch the Unity 6 Editor, enter Play Mode, compile the project with the installed Unity package set, or build an APK. Therefore the audit is a source/tree integration audit, not a claim of a successful Unity runtime build. The first Unity Editor import/Play Mode run must be used as the definitive compile/runtime check.

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
1. Player mobile input abstraction (virtual stick + attack/skill buttons).
2. Player attack direction + animation-ready combat state.
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
- Never claim runtime/build verification unless it has actually been performed in Unity Editor/CI.

## Recovery phrase
> Continue **Shadow Ascension** from the Unity 6 passport. Main Unity branch is `unity-shadow-ascension` in `shironaki/MiniRPG`. Unity is isolated under `UnityProject/`; Phaser is only the old browser prototype. Continue from the current Unity files toward a dark-fantasy 2D action RPG for Android + Windows, with Web secondary. Current systems include player movement/stats/dodge, combat damage, enemy AI/archetypes, Q/E/R/F skills, dungeon rooms/generator, portal flow and prototype HUD. A source-level audit has already been performed; do not skip verification. Next: mobile controls, rewards, boss, chest/traps, inventory/loot, quests, camera/art/VFX, Android UI and actual Unity build verification.

**Last passport update:** static integration/security audit completed; combat, enemy targeting and save validation hardened.
