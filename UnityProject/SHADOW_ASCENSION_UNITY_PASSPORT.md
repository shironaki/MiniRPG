# SHADOW ASCENSION — UNITY 6 PASSPORT

**Project:** Shadow Ascension
**Engine:** Unity 6
**Unity branch:** `unity-shadow-ascension`
**Repository:** `shironaki/MiniRPG`
**Status:** active rebuild / foundation phase

## 1. Direction

Shadow Ascension is being rebuilt as a standalone Unity 6 game rather than extending the Phaser prototype. The target is a dark-fantasy 2D action RPG with dungeon exploration, fast combat, shadow enemies, elite encounters, a boss, portal progression, loot, quests, skills, inventory and a polished HUD.

The visual target is based on the supplied reference: dark dungeon environment, blue/violet lighting, strong shadow/purple VFX, readable combat feedback, large boss presentation and a layered RPG interface.

## 2. Platforms

Primary:
- Android — APK/AAB
- PC — Windows first

Secondary:
- Web build for testing / additional distribution when practical

## 3. Architecture

```text
UnityProject/
└── Assets/Scripts/
    ├── Core/
    ├── Player/
    ├── Combat/
    ├── Enemies/
    ├── Dungeon/
    ├── Skills/
    ├── Inventory/
    └── UI/
```

## 4. Implemented foundation

- `Core/GameManager.cs`
- `Player/PlayerStats.cs`
- `Player/PlayerController.cs`
- `Combat/Damageable.cs`
- `Combat/PlayerCombat.cs`
- `Enemies/EnemyBase.cs`
- `Dungeon/Portal.cs`
- `Core/SaveSystem.cs`

## 5. First playable milestone

1. Boot scene
2. Controllable player
3. Dungeon room
4. Three shadow enemy archetypes
5. Elite / Dark Knight boss
6. Melee attack
7. Dodge / invulnerability window
8. Q/E/R/F skills
9. XP, level, HP, MP
10. Loot / gold / essence
11. Portal to next room/floor
12. HUD and boss bar
13. Save/load

## 6. Non-negotiable project rules

- Do NOT mix Unity code into the old Phaser runtime.
- Do NOT delete the old MiniRPG `main` branch.
- Do NOT treat `shadow-ascension` browser code as the Unity runtime.
- All Unity work goes into `unity-shadow-ascension` under `UnityProject/`.
- Build systems and gameplay should be data-driven where possible so balancing does not require rewriting systems.
- Android touch controls must be supported; keyboard/mouse remain available on PC.
- Keep the game playable without external network services.

## 7. Visual direction

Palette: near-black dungeon, cold blue shadows, violet/purple energy, restrained crimson for danger/bosses.

Presentation goals:
- layered dungeon tiles
- animated character sprites
- weapon trails
- shadow particles
- hit flashes
- floating damage numbers
- screen shake on strong hits
- portal VFX
- boss intro / defeat presentation
- responsive HUD

## 8. Current migration state

The browser prototype is kept separately as a reference/prototype. Unity is now the main development direction.

Next major systems: PlayerCombat -> Enemy AI -> Dungeon room flow -> Skills -> UI -> Inventory/Loot -> art/VFX integration -> Android controls -> save/load -> balancing.

## 9. Recovery phrase for a new chat

Paste this passport into a new chat and say:

> Continue **Shadow Ascension** from the Unity 6 passport. Main Unity branch is `unity-shadow-ascension` in `shironaki/MiniRPG`. Android + Windows are primary, Web is secondary. The Unity project is isolated under `UnityProject/`; the old browser/Phaser prototype must not be mixed into the Unity runtime. Continue the implementation from the current files and keep the dark-fantasy dungeon action-RPG direction with player combat, shadows, boss, skills, loot, portal progression, HUD and mobile controls.

**Last passport update:** Unity 6 foundation / standalone branch created.
