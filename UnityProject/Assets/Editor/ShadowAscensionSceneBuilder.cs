using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using ShadowAscension.Combat;
using ShadowAscension.Core;
using ShadowAscension.Dungeon;
using ShadowAscension.Enemies;
using ShadowAscension.Player;
using ShadowAscension.UI;

namespace ShadowAscension.Editor
{
    public static class ShadowAscensionSceneBuilder
    {
        private const string SceneFolder = "Assets/Scenes";
        private const string ScenePath = SceneFolder + "/ShadowAscension_Test.unity";

        [MenuItem("Shadow Ascension/Create Test Scene")]
        public static void CreateTestScene()
        {
            EnsureFolder(SceneFolder);
            ShadowAscensionVisualAssets.GenerateAll();

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "ShadowAscension_Test";

            GameObject player = CreatePlayer();
            CreateCamera(player.transform);
            CreateWorld();
            CreateEnemy("Shadow", typeof(ShadowEnemy), new Vector2(3.5f, 1.5f), 180, "shadow");
            CreateEnemy("Hunter", typeof(ShadowHunter), new Vector2(-3.2f, 1.8f), 140, "hunter");
            CreateEnemy("Mage", typeof(ShadowMage), new Vector2(3.4f, -2.0f), 160, "mage");
            CreateEnemy("Elite", typeof(ShadowBrute), new Vector2(-3.6f, -2.2f), 500, "elite");
            GameObject boss = CreateEnemy("Dark Knight", typeof(BossController), new Vector2(0f, 2.8f), 2200, "elite");
            CreatePortal(new Vector2(0f, 4.6f));
            CreateHUD(player, boss.GetComponent<Damageable>());

            EditorSceneManager.SaveScene(scene, ScenePath);
            Selection.activeGameObject = player;
            Debug.Log("Shadow Ascension test scene created: " + ScenePath);
        }

        private static void CreateCamera(Transform target)
        {
            GameObject cameraObject = new GameObject("Main Camera");
            Camera camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 4.3f;
            camera.transform.position = new Vector3(0f, 0.5f, -10f);
            camera.backgroundColor = new Color(0.006f, 0.004f, 0.014f);
            cameraObject.tag = "MainCamera";

            CameraFollow2D follow = cameraObject.AddComponent<CameraFollow2D>();
            follow.SetTarget(target);
        }

        private static void CreateWorld()
        {
            CreateTiledSprite("Dungeon Floor", Vector2.zero, new Vector2(16f, 11f), "floor", -20);
            CreateTiledWall("Wall North", new Vector2(0f, 5.5f), new Vector2(16f, 0.45f));
            CreateTiledWall("Wall South", new Vector2(0f, -5.5f), new Vector2(16f, 0.45f));
            CreateTiledWall("Wall West", new Vector2(-8f, 0f), new Vector2(0.45f, 11f));
            CreateTiledWall("Wall East", new Vector2(8f, 0f), new Vector2(0.45f, 11f));
            CreateTiledWall("Inner Wall A", new Vector2(-1.5f, 2.2f), new Vector2(3.8f, 0.35f));
            CreateTiledWall("Inner Wall B", new Vector2(2.8f, -0.7f), new Vector2(0.35f, 3.0f));
            CreateTiledWall("Inner Wall C", new Vector2(-3.2f, -1.0f), new Vector2(2.2f, 0.35f));
            SpriteRenderer arena = CreateTiledSprite("Arena Sigil", Vector2.zero, new Vector2(4.4f, 4.4f), "floor", -10);
            arena.color = new Color(0.65f, 0.35f, 0.9f, 0.32f);
        }

        private static GameObject CreatePlayer()
        {
            GameObject player = CreateSprite("Player", new Vector2(0f, -3.2f), 1.15f, "hero", 20);
            player.tag = "Player";
            Rigidbody2D body = player.AddComponent<Rigidbody2D>();
            body.gravityScale = 0f;
            body.freezeRotation = true;
            body.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
            body.interpolation = RigidbodyInterpolation2D.Interpolate;
            CircleCollider2D collider = player.AddComponent<CircleCollider2D>();
            collider.radius = 0.35f;
            player.AddComponent<PlayerStats>();
            player.AddComponent<PlayerController>();
            player.AddComponent<PlayerCombat>();
            player.AddComponent<SkillSystem>();
            return player;
        }

        private static GameObject CreateEnemy(string name, System.Type enemyType, Vector2 position, int health, string visualId)
        {
            bool boss = enemyType == typeof(BossController);
            GameObject enemy = CreateSprite(name, position, boss ? 1.65f : name == "Elite" ? 1.35f : 0.95f, visualId, 15);
            Rigidbody2D body = enemy.AddComponent<Rigidbody2D>();
            body.gravityScale = 0f;
            body.freezeRotation = true;
            body.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
            body.interpolation = RigidbodyInterpolation2D.Interpolate;
            CircleCollider2D collider = enemy.AddComponent<CircleCollider2D>();
            collider.radius = boss ? 0.65f : name == "Elite" ? 0.52f : 0.34f;
            Damageable damageable = enemy.AddComponent<Damageable>();
            SetSerializedInt(damageable, "maxHealth", health);
            enemy.AddComponent<EnemyRewards>();
            enemy.AddComponent(enemyType);
            return enemy;
        }

        private static void CreatePortal(Vector2 position)
        {
            GameObject portal = CreateSprite("Portal (Locked)", position, 1.5f, "portal", 12);
            portal.AddComponent<Portal>();
        }

        private static void CreateHUD(GameObject playerObject, Damageable boss)
        {
            GameObject hud = new GameObject("Shadow HUD");
            ShadowHUD shadowHud = hud.AddComponent<ShadowHUD>();
            SetObjectReference(shadowHud, "player", playerObject.GetComponent<PlayerStats>());
            SetObjectReference(shadowHud, "skills", playerObject.GetComponent<SkillSystem>());
            SetObjectReference(shadowHud, "boss", boss);
        }

        private static GameObject CreateSprite(string name, Vector2 position, float scale, string visualId, int sortingOrder)
        {
            GameObject go = new GameObject(name);
            go.transform.position = new Vector3(position.x, position.y, 0f);
            go.transform.localScale = Vector3.one * scale;
            SpriteRenderer renderer = go.AddComponent<SpriteRenderer>();
            renderer.sprite = ShadowAscensionVisualAssets.Load(visualId);
            renderer.sortingOrder = sortingOrder;
            return go;
        }

        private static SpriteRenderer CreateTiledSprite(string name, Vector2 position, Vector2 size, string visualId, int sortingOrder)
        {
            GameObject go = new GameObject(name);
            go.transform.position = new Vector3(position.x, position.y, 0f);
            SpriteRenderer renderer = go.AddComponent<SpriteRenderer>();
            renderer.sprite = ShadowAscensionVisualAssets.Load(visualId);
            renderer.drawMode = SpriteDrawMode.Tiled;
            renderer.size = size;
            renderer.tileMode = SpriteTileMode.Continuous;
            renderer.sortingOrder = sortingOrder;
            return renderer;
        }

        private static void CreateTiledWall(string name, Vector2 position, Vector2 size)
        {
            SpriteRenderer renderer = CreateTiledSprite(name, position, size, "wall", 5);
            BoxCollider2D collider = renderer.gameObject.AddComponent<BoxCollider2D>();
            collider.size = size;
        }

        private static void SetSerializedInt(Object target, string propertyName, int value)
        {
            SerializedObject serialized = new SerializedObject(target);
            SerializedProperty property = serialized.FindProperty(propertyName);
            if (property != null) property.intValue = value;
            serialized.ApplyModifiedPropertiesWithoutUndo();
        }

        private static void SetObjectReference(Object target, string propertyName, Object value)
        {
            SerializedObject serialized = new SerializedObject(target);
            SerializedProperty property = serialized.FindProperty(propertyName);
            if (property != null) property.objectReferenceValue = value;
            serialized.ApplyModifiedPropertiesWithoutUndo();
        }

        private static void EnsureFolder(string folder)
        {
            if (AssetDatabase.IsValidFolder(folder)) return;
            string[] parts = folder.Split('/');
            string current = parts[0];
            for (int i = 1; i < parts.Length; i++)
            {
                string next = current + "/" + parts[i];
                if (!AssetDatabase.IsValidFolder(next)) AssetDatabase.CreateFolder(current, parts[i]);
                current = next;
            }
        }
    }
}
