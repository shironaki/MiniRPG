# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine target:** Unity 6.6.0f1
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** architecture modernization / visual foundation / cross-platform input / mobile UI foundation / static audit pending runtime verification

## Direction
Standalone dark-fantasy 2D action RPG for Android and Windows, with Web secondary. Fast top-down dungeon action: responsive movement, directional melee, dodge, shadow abilities, enemy groups, elites, bosses, portals, loot, quests and layered RPG HUD. Visual language: near-black stone, cold blue/violet atmosphere, purple shadow energy, readable silhouettes and strong combat feedback.

## Release baseline
Unity **6000.6.0f1** is the current Unity 6.6 final release baseline used by this project. Unity's official release notes identify 6000.6.0f1 as released on August 31, 2026. urlUnity 6.6.0f1 release noteshttps://unity.com/releases/editor/whats-new/6000.6.0f1

## Packages
- `com.unity.inputsystem` **1.19.0** — modern keyboard/mouse/touch/gamepad input layer.
- `com.unity.ugui` **2.6.0** — runtime HUD and touch controls.

Unity 6 documentation recommends the Input System package over the legacy Input Manager for new projects. citeturn2search1turn2search5

## Platforms
Primary: Android APK/AAB, Windows PC.
Secondary: Web build for testing/distribution when practical.

## Modernized structure
```text
UnityProject/
├── Assets/
│   ├── Art/Generated/         dark-fantasy prototype texture set
│   ├── Editor/                scene + texture authoring tools
│   │   ├── ShadowAscension.Editor.asmdef
│   │   ├── ShadowAscensionSceneBuilder.cs
│   │   └── ShadowAscensionVisualAssets.cs
│   └── Scripts/
│       ├── ShadowAscension.Runtime.asmdef
│       ├── Core/              game state, save, camera
│       ├── Input/             Unity Input System abstraction
│       ├── Player/            movement, stats, visual presentation
│       ├── Combat/            damage, melee, skills, feedback
│       ├── Enemies/           AI, archetypes, rewards, boss
│       ├── Dungeon/           rooms, generation, portals
│       ├── Inventory/         reserved for equipment/loot
│       ├── Skills/            reserved for data-driven skills
│       └── UI/                HUD + touch controls
├── Packages/                  package baseline
└── ProjectSettings/           Unity 6.6 metadata
```

## Implemented foundation
- Player stats: HP/MP/XP/level/gold/essence.
- Responsive Rigidbody2D movement with acceleration/deceleration.
- Directional dodge with cooldown architecture.
- Mouse/keyboard input through the new Input System.
- Virtual move/aim/action API for Android controls.
- Runtime-generated mobile joystick, aim stick, attack, dodge and Q/E/R/F buttons.
- Directional melee arc and four abilities.
- Shadow enemy archetypes, elite and Dark Knight boss foundation.
- XP/reward flow.
- Dungeon walls/floor/portal and bounded camera.
- Responsive uGUI HUD with boss bar and skill cooldowns.
- Stable slash/hit feedback without runtime ParticleSystem creation.
- Generated dark-fantasy texture pipeline.
- Explicit runtime/editor assembly boundaries.
- Unity 6.6 project metadata and modern package baseline.

## Movement upgrade
The old direct `UnityEngine.Input` polling has been removed from player movement/combat/skills. `PlayerInputRouter` is now the single platform-facing input layer. It accepts:
- WASD / arrows;
- mouse aim + left click attack;
- Space dodge;
- Q/E/R/F skills;
- virtual joystick and virtual aim values;
- touch action buttons;
- future gamepad bindings without rewriting gameplay systems.

## Graphics / texture direction
Gameplay keeps stable visual IDs: `hero`, `shadow`, `hunter`, `mage`, `elite`, `portal`, `floor`, `wall`. The current generator provides deterministic dark-fantasy prototype textures and avoids runtime asset generation. The character presentation layer adds idle/movement bob and attack pulse without changing the physics object hierarchy.

Next visual pass: authored sprite sheets, attack/dodge frames, shadow-energy overlays, boss-specific art, animated portal and a consistent dungeon tileset. Gameplay code will continue consuming stable visual IDs.

## Static audit rules
Before every major expansion:
1. Re-read affected files.
2. Check namespaces, assembly references and package dependencies.
3. Check Unity 6.6 API compatibility.
4. Check null/default Inspector dependencies.
5. Check PC, gamepad and Android input paths.
6. Check save/load bounds and failure paths.
7. Check editor-generated scene configuration.
8. Only then commit the next feature block.
9. Runtime/build verification must be performed in the user's Unity Editor/device; never claim it was performed remotely.

## Current verification state
The user previously confirmed Unity 6.6.0f1 opens the project and an earlier baseline Play Mode test launched. Later screenshots exposed prototype errors; those source-level causes were corrected. The current **Unity 6.6 package/input/UI migration has not yet been runtime-verified after import**.

Android and Windows builds are not yet verified.

## Next development order
1. Fresh compile + Play Mode verification of this consolidated Unity 6.6 migration.
2. Production sprite-sheet animation and authored texture pass.
3. Combat 2.0: combo chain, hit-stop, knockback, state machine and attack telegraphs.
4. Dark Knight presentation and phase-specific attacks.
5. Chest/traps/room encounter data.
6. Inventory/equipment/loot tables.
7. Quest/journal system.
8. Lighting/VFX/camera polish.
9. Android safe-area polish and save/load integration.
10. Android APK/AAB + Windows build and actual device verification.

## Project rules
- Unity development stays on `unity-shadow-ascension` under `UnityProject/`.
- Do not mix Unity runtime code into the old Phaser prototype.
- Do not delete the old MiniRPG `main` branch.
- Prefer data-driven balancing and reusable components.
- Android touch and PC keyboard/mouse are first-class targets.
- No external network dependency for core gameplay.
- Never claim runtime/build verification without an actual Unity/device test.

## Recovery phrase
> Continue **Shadow Ascension** from the Unity 6.6 passport. Branch `unity-shadow-ascension`, project under `UnityProject/`. Baseline is Unity 6000.6.0f1 with Input System 1.19.0 and uGUI 2.6.0. Architecture has explicit runtime/editor assemblies, modern cross-platform input, responsive movement, directional combat, skills, enemy AI, rewards, dungeon/portal flow, responsive HUD, mobile virtual controls, generated dark-fantasy textures, bounded camera and Dark Knight foundation. The current migration is source-audited but still needs one fresh Unity compile + Play Mode verification. Continue with production animation/art, Combat 2.0, boss polish, loot/inventory, quests, lighting/VFX, Android UI and real builds.

**Last passport update:** Unity 6.6 package/input/UI baseline consolidated; movement, HUD and touch-control architecture modernized; source audit completed; runtime verification still required.
