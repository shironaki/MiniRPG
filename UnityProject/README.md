# Shadow Ascension — Unity 6.6

Primary game project for Android and PC. The existing browser/Phaser version remains a secondary prototype/test build.

## Engine baseline
- Unity **6000.6.0f1**
- Modern Unity Input System package **1.17.0**
- Unity 6 runtime/editor assembly separation
- Rigidbody2D `linearVelocity` API

## Targets
- Android: APK/AAB, touch-first controls
- Windows: keyboard + mouse, optional gamepad
- Web: secondary testing/distribution target

## Architecture
```text
Assets/
├── Art/Generated/       deterministic prototype textures
├── Editor/              scene + texture authoring tools
└── Scripts/
    ├── Core/            game state, save, camera
    ├── Input/           platform-independent input abstraction
    ├── Player/          motor, stats, presentation
    ├── Combat/          damage, melee, skills, feedback
    ├── Enemies/         AI, archetypes, rewards, bosses
    ├── Dungeon/         rooms, generation, portals
    ├── Skills/          future data-driven skill assets
    ├── Inventory/       future items/equipment/loot
    └── UI/              HUD, touch UI, menus
```

Runtime code is isolated in `ShadowAscension.Runtime.asmdef`; editor-only generation is isolated in `ShadowAscension.Editor.asmdef`.

## Current vertical-slice systems
- Responsive movement with acceleration/deceleration.
- Directional dodge.
- Mouse/keyboard input through the new Input System.
- Virtual move/aim/action API ready for touch controls.
- Directional melee arc and four Q/E/R/F abilities.
- Shadow enemy archetypes, elite and Dark Knight boss foundation.
- XP, level, gold and shadow essence rewards.
- Dungeon walls/floor/portal and bounded camera.
- Prototype HUD and combat feedback.
- Procedural dark-fantasy texture pipeline.

## Visual pipeline
Prototype IDs remain stable: `hero`, `shadow`, `hunter`, `mage`, `elite`, `portal`, `floor`, `wall`.

This lets us replace generated placeholder textures with authored sprite sheets later without rewriting gameplay code. The next art pass is animation-ready sprite sheets, layered character parts, weapon VFX, boss-specific textures and a consistent dungeon tileset.

## Verification policy
Every major change is source-audited before the next user test: namespaces, assembly references, Unity 6.6 APIs, package dependencies, null/default Inspector references, input paths, save bounds and generated-scene configuration.

Runtime and build verification can only be claimed after the project is actually imported/compiled and run in the user's Unity Editor or on a target device.
