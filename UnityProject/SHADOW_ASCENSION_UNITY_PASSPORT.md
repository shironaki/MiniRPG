# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine:** Unity 6
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** active rebuild / first playable prototype + visual foundation + combat feedback + progression + Dark Knight boss foundation + stabilization audit

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
- Prototype HUD showing level, HP/MP, XP, gold, essence, skill cooldowns and boss HP.
- Existing SaveSystem foundation with bounded/corruption-safe local data.
- Automated `Shadow Ascension/Create Test Scene` editor builder.
- Generated dark-fantasy 2D prototype art for hero, shadow enemies, elite, portal, floor and walls.
- Tiled dungeon floor/walls with correctly sized wall colliders.
- Centered, bounded smooth camera follow in the test scene.
- Stable slash and hit-burst VFX using short-lived LineRenderers; no runtime ParticleSystem creation.
- XP, level-up, gold and shadow essence progression foundation.
- Enemy death reward component with duplicate-payout protection.
- Dark Knight boss controller with health-based enraged phase and shockwave attack.
- Boss health bar with enraged indicator.
- Test-scene builder creates and wires the Dark Knight automatically.
- Portal transition now checks Build Settings before attempting a scene load, preventing missing-scene exceptions.
- Removed obsolete `DamageNumber.cs` after the runtime feedback system was simplified for stability.

## Latest stabilization audit
A fresh review was performed against the current `unity-shadow-ascension` branch after the user's Console screenshot exposed runtime failures.

Corrected before the next user test:
- Removed the observed ParticleSystem duration-order failure source from combat feedback.
- Removed the obsolete DamageNumber component that was present in the stack trace.
- Set generated tiled sprites to `SpriteMeshType.FullRect`, addressing Unity's tiled-sprite import warning.
- Stopped `VisualAssets.Load()` from regenerating/importing all PNG assets on every sprite lookup; it now loads existing assets and generates only when an asset is missing.
- Added explicit camera bounds and corrected the test-scene camera framing.
- Kept combat VFX above gameplay sprites with explicit sorting order.
- Hardened portal scene loading against a destination scene that is not yet in Build Settings.
- Re-checked Damageable → EnemyRewards → EnemyBase death/reward order and null guards.

## Verified in Unity Editor
The user previously opened Unity 6.6.0f1, created the generated test scene and confirmed Play Mode launch with **0 errors and 0 warnings** on the earlier baseline.

The later screenshot exposed real runtime ParticleSystem errors and poor camera framing. The source-level causes have now been corrected and the obsolete damage-number component removed. **This consolidated fix set still requires one fresh Unity import + Play Mode verification by the user.**

No claim is made that Android/Windows builds are verified; those require an actual build on the user's machine.

## Verification gate
Before every major gameplay expansion:
1. Re-read affected files.
2. Check type/namespace references and inheritance.
3. Check null/default Inspector dependencies.
4. Check Android/PC input assumptions.
5. Check save/load bounds and failure paths.
6. Check editor-generated scene configuration.
7. Only then commit the next system.
8. After Unity import, run a clean compile and Play Mode smoke test before treating the milestone as verified.

## Next implementation order
1. One fresh Unity verification pass of the consolidated fixes.
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
> Continue **Shadow Ascension** from the Unity 6 passport. Main Unity branch is `unity-shadow-ascension` in `shironaki/MiniRPG`. Unity is isolated under `UnityProject/`; Phaser is only the old browser prototype. Current systems include player movement/stats/dodge, directional combat, enemy AI/archetypes, Q/E/R/F skills, dungeon rooms/generator, portal flow, HUD, generated 2D visuals, centered/bounded camera, stable slash/hit feedback, XP/gold/essence, and a Dark Knight boss foundation. A consolidated source audit has been performed after the user's runtime screenshot: ParticleSystem failure source removed, obsolete DamageNumber removed, tiled sprite import corrected, asset generation de-duplicated, camera bounds corrected, VFX sorting hardened, and portal scene loading guarded. The consolidated fixes still require one fresh Unity Play Mode verification. Do not skip verification.

**Last passport update:** consolidated runtime-stability audit completed; ready for one verification run before the next gameplay expansion.
