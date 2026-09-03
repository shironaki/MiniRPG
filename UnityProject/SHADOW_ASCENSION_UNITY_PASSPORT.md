# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine:** Unity 6
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** active rebuild / first playable prototype + visual foundation + combat feedback + progression + Dark Knight boss foundation + static audit pass

## Direction
Standalone Unity 6 dark-fantasy 2D action RPG. Dungeon exploration, fast directional melee combat, dodge, shadow enemies, elite/boss encounters, portal progression, loot, quests, skills, inventory and layered RPG HUD. Visual direction: near-black dungeon, cold blue/violet lighting, purple shadow energy, readable hit feedback and dramatic boss presentation.

## Platforms
Primary: Android APK/AAB, Windows PC.
Secondary: Web build for testing/distribution when practical.

## Implemented
- Unity branch isolated under `UnityProject/`.
- Player stats and Rigidbody2D movement/dodge foundation.
- Damageable health/death events and safe death messaging.
- Directional melee combat with mouse/keyboard-facing arc.
- Base enemy chase/attack AI.
- Four enemy archetypes: ShadowEnemy, ShadowBrute, ShadowHunter, ShadowMage.
- Four-slot Q/E/R/F skill system with area damage and cooldowns.
- DungeonRoom clear detection and portal activation.
- Modular DungeonGenerator for room prefabs.
- Prototype HUD showing level, HP/MP, XP, gold, essence and skill cooldowns.
- Existing Portal and SaveSystem foundation.
- Automated `Shadow Ascension/Create Test Scene` editor builder.
- Generated dark-fantasy 2D art pipeline for hero, shadow enemies, elite, portal, floor and walls.
- Tiled dungeon floor/walls and bounded smooth camera follow in the test scene.
- Combat slash VFX, hit burst particles and floating damage numbers.
- XP, level-up, gold and shadow essence progression foundation.
- Enemy death reward component wired into the test-scene builder.
- Tiled wall colliders match their visual dimensions.
- Dark Knight boss controller with health-based enraged phase and shockwave attack.
- Boss health bar with phase indicator in the HUD.
- Test-scene builder now creates and wires the Dark Knight boss automatically.

## Important fix from latest Unity test
The user supplied a Unity Editor screenshot showing repeated errors: `Setting the duration while the system is still playing is not supported` from `ParticleSystem`. The cause was identified in `CombatFeedback.HitRoutine`: the newly-created particle system was being configured after it had already started. The code was corrected to set `main.playOnAwake = false` before changing duration and then explicitly call `Play()` after configuration.

The separate `Account API did not become accessible within 30 seconds` message is an Unity Editor/Assistant services warning and is not the cause of the ParticleSystem errors.

## Verified in Unity Editor
The user previously opened Unity 6.6.0f1, created the generated test scene and confirmed Play Mode launch with **0 errors and 0 warnings** on the earlier baseline.

The latest screenshot demonstrates that the newly added combat-feedback milestone produced runtime ParticleSystem errors. The particle configuration fix is now committed, but **the fix itself still requires a fresh Unity Play Mode test**. The Dark Knight additions are source-audited but not runtime-verified.

This does **not** mean Android/Windows builds are verified yet. Those require an actual build on the user's machine.

## Static audit — completed before expansion
- `PlayerCombat` and `SkillSystem` detect `EnemyBase` directly rather than depending on an unassigned LayerMask.
- Enemy attacks target `PlayerStats` safely.
- Enemy AI guards null health and clamps invalid ranges/cooldowns.
- `SaveSystem` validates loaded/saved values and handles common filesystem failures.
- Directional combat shares facing direction with `PlayerController`.
- Camera follow is bounded to the test dungeon.
- Tiled wall colliders use the same dimensions as their SpriteRenderer.
- Damage/reward events are null-safe and reward claiming is protected against duplicate payout.
- ParticleSystem settings are now applied before explicit playback.
- Boss phase transitions are guarded so the enraged transition can happen only once.

## Verification gate
Before every major gameplay expansion:
1. Re-read affected files.
2. Check type/namespace references and inheritance.
3. Check null/default Inspector dependencies.
4. Check Android/PC input assumptions.
5. Check save/load bounds and failure paths.
6. Only then commit the next system.
7. After Unity import, run a clean compile and Play Mode smoke test before treating the milestone as verified.

## Next implementation order
1. Fresh Unity verification of the particle fix + boss scene.
2. Production 2D character/monster/portal animation pipeline.
3. Mobile input abstraction: virtual stick + attack/skill buttons.
4. Chest, traps and room encounter data.
5. Inventory/equipment/loot tables.
6. Quest/journal system.
7. Camera polish, 2D lighting and VFX.
8. Touch-first HUD, Android safe areas, save/load integration.
9. First Android/Windows playable build and actual build verification.

## Project rules
- Do NOT mix Unity code into the Phaser runtime.
- Do NOT delete the old MiniRPG `main` branch.
- All Unity work stays on `unity-shadow-ascension` under `UnityProject/`.
- Prefer data-driven configuration for balancing.
- Android touch controls and PC keyboard/mouse are required.
- No external network dependency for core gameplay.
- Never claim runtime/build verification unless it has actually been performed in Unity Editor/CI.

## Recovery phrase
> Continue **Shadow Ascension** from the Unity 6 passport. Main Unity branch is `unity-shadow-ascension` in `shironaki/MiniRPG`. Unity is isolated under `UnityProject/`; Phaser is only the old browser prototype. Continue from the current Unity files toward a dark-fantasy 2D action RPG for Android + Windows, with Web secondary. Current systems include player movement/stats/dodge, directional combat, enemy AI/archetypes, Q/E/R/F skills, dungeon rooms/generator, portal flow, HUD, generated 2D visuals, bounded camera follow, combat VFX/damage feedback, XP/gold/essence, and a Dark Knight boss foundation. A source-level audit has been performed. The earlier baseline Play Mode smoke test was confirmed by the user; the latest screenshot exposed a ParticleSystem configuration error, which has now been fixed in source. The fix and boss additions require fresh Unity runtime verification. Do not skip verification.

**Last passport update:** fixed ParticleSystem runtime configuration order; added Dark Knight boss controller, enraged phase, shockwave and boss HUD; corrected test-scene wiring and recorded required fresh verification.
