# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine target:** Unity 6.6.0f1
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** architecture modernization / visual foundation / cross-platform input migration / static audit pending runtime verification

## Direction
Standalone dark-fantasy 2D action RPG for Android and Windows, with Web secondary. The target experience is a fast top-down dungeon action game: responsive movement, directional melee, dodge, shadow abilities, enemy groups, elites, bosses, portals, loot, quests and a layered RPG HUD. Visual language: near-black stone, cold blue/violet atmosphere, purple shadow energy, readable silhouettes and strong combat feedback.

## Release baseline
Unity 6.6.0f1 is the target editor baseline. Unity 6.6 is the current supported Unity 6 update release at this milestone; Unity describes Update releases as production-ready and intended for new/mid-cycle productions. urlUnity 6.6 release noteshttps://unity.com/releases/editor/whats-new/6000.6.0f1

## Platforms
Primary: Android APK/AAB, Windows PC.
Secondary: Web build for testing/distribution when practical.

## Modernized structure
```text
UnityProject/
├── Assets/
│   ├── Art/
│   │   └── Generated/        editor-generated 2D texture set
│   ├── Editor/               scene + texture generation tools
│   │   ├── ShadowAscension.Editor.asmdef
│   │   ├── ShadowAscensionSceneBuilder.cs
│   │   └── ShadowAscensionVisualAssets.cs
│   └── Scripts/
│       ├── ShadowAscension.Runtime.asmdef
│       ├── Core/              game state, save, camera
│       ├── Input/             Unity Input System abstraction
│       ├── Player/            movement, stats, presentation
│       ├── Combat/            damage, melee, skills, feedback
│       ├── Enemies/           AI, archetypes, rewards, boss
│       ├── Dungeon/           rooms, generator, portal
│       ├── Inventory/         reserved for equipment/loot
│       ├── Skills/            reserved for data-driven skill assets
│       └── UI/                HUD and touch presentation
├── Packages/
│   └── manifest.json          Unity 6 package baseline
└── ProjectSettings/
    └── ProjectVersion.txt     Unity 6.6.0f1
```

## Implemented foundation
- Player stats, health, mana, XP, level, gold and shadow essence.
- Responsive Rigidbody2D movement with acceleration/deceleration.
- Directional dodge with cooldown and invulnerability-ready architecture.
- Directional melee arc with mouse/gamepad-ready aim abstraction.
- Four Q/E/R/F skills with cooldowns.
- Enemy chase/attack base and four enemy archetypes.
- Dark Knight boss foundation with enraged phase and shockwave.
- Enemy death rewards with duplicate-payout protection.
- Dungeon room/generator and guarded portal transition.
- Prototype HUD and boss health presentation.
- Stable slash/hit feedback without runtime ParticleSystem creation.
- Generated dark-fantasy texture pipeline for hero, enemies, elite, portal, floor and walls.
- Tiled dungeon geometry with colliders matching visual dimensions.
- Bounded smooth camera follow.
- Explicit runtime/editor assembly boundaries.

## Unity 6.6 migration
- Project metadata now targets `6000.6.0f1`.
- Runtime input is migrated from direct legacy `UnityEngine.Input` calls to `com.unity.inputsystem`.
- The input layer accepts keyboard/mouse and exposes virtual move/aim/action methods for Android touch controls.
- Static singleton state is reset with `SubsystemRegistration` so Unity 6.6 fast Enter Play Mode does not retain stale state between runs.
- Player movement uses Unity 6 `Rigidbody2D.linearVelocity`.
- Editor-only texture/scene generation is isolated from runtime code.
- Runtime assembly has no dependency on `UnityEditor`.

## Graphics / texture direction
The prototype texture generator remains intentionally dependency-light, but the asset set is being moved toward a production 2D pipeline: readable silhouettes, layered shadow glow, dungeon tile texture, boss-scale silhouette, portal energy and animation-ready character presentation. Generated assets are imported as Point-filtered sprites with mipmaps disabled for deterministic 2D rendering.

The next visual pass should replace the procedural prototype art with authored sprite sheets while keeping the same IDs (`hero`, `shadow`, `hunter`, `mage`, `elite`, `portal`, `floor`, `wall`) so gameplay code does not need to change.

## Static audit rules
Before every major expansion:
1. Re-read affected files.
2. Check namespaces, assembly references and Unity package dependencies.
3. Check Unity 6.6 API compatibility.
4. Check null/default Inspector dependencies.
5. Check PC, gamepad and Android input paths.
6. Check save/load bounds and failure paths.
7. Check editor-generated scene configuration.
8. Only then commit the next feature block.
9. Runtime/build verification must be performed in the user's Unity Editor/device; never claim it was performed remotely.

## Current verification state
The user previously confirmed Unity 6.6.0f1 opens the project and an earlier baseline Play Mode test launched. Later screenshots exposed compile/runtime problems in the prototype; those source-level causes were corrected. The current Unity 6.6 migration and new Input System layer have **not yet been runtime-verified by the user**.

Android and Windows builds are also **not yet verified**.

## Next development order
1. Fresh compile + Play Mode verification of this Unity 6.6 migration.
2. Production sprite-sheet animation pipeline and authored texture pass.
3. Mobile virtual joystick + right-side aim/attack + skill buttons.
4. Combat 2.0: combo chain, hit-stop, knockback, state machine, telegraphs.
5. Boss presentation and phase-specific attacks.
6. Chest/traps/room encounter data.
7. Inventory/equipment/loot tables.
8. Quest/journal system.
9. Lighting/VFX/camera polish.
10. Android safe-area HUD and save/load.
11. Android APK/AAB + Windows build and actual device verification.

## Project rules
- Unity development stays on `unity-shadow-ascension` under `UnityProject/`.
- Do not mix Unity runtime code into the old Phaser prototype.
- Do not delete the old MiniRPG `main` branch.
- Prefer data-driven balancing and reusable components.
- Android touch and PC keyboard/mouse are first-class targets.
- No external network dependency for core gameplay.
- Never claim runtime or build verification without an actual Unity/device test.

## Recovery phrase
> Continue **Shadow Ascension** from the Unity 6.6 passport. Branch `unity-shadow-ascension`, project under `UnityProject/`. The Unity baseline is 6000.6.0f1. The architecture has explicit runtime/editor assemblies, Unity Input System 1.17.0, modern cross-platform input abstraction, responsive Rigidbody2D movement, directional combat, skills, enemy AI, rewards, dungeon/portal flow, HUD, generated dark-fantasy textures, bounded camera and Dark Knight foundation. The current migration is source-audited but still needs one fresh Unity compile + Play Mode verification. Continue with production animation/art, mobile controls, Combat 2.0, boss polish, loot/inventory, quests, lighting/VFX, Android UI and real builds.

**Last passport update:** full Unity 6.6 architecture/input modernization baseline established; source audit performed; runtime verification still required.
