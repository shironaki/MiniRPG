using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using ShadowAscension.Combat;
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

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "ShadowAscension_Test";

            CreateCamera();
            CreateWorld();
            CreatePlayer();
            CreateEnemy("Shadow", typeof(ShadowEnemy), new Vector2(3.5f, 1.5f), 180);
            CreateEnemy("Hunter", typeof(ShadowHunter), new Vector2(-3.2f, 1.8f), 140);
            CreateEnemy("Mage", typeof(ShadowMage), new Vector2(3.4f, -2.0f), 160);
            CreateEnemy("Elite", typeof(ShadowBrute), new Vector2(-3.6f, -2.2f), 500);
            CreatePortal(new Vector2(0f, 4.0f));
            CreateHUD();

            EditorSceneManager.SaveScene(scene, ScenePath);
            Selection.activeObject = GameObject.Find("Player");
            Debug.Log("Shadow Ascension test scene created: " + ScenePath);
        }

        private static void CreateCamera()
        {
            GameObject cameraObject = new GameObject("Main Camera");
            Camera camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 6f;
            camera.transform.position = new Vector3(0f, 0f, -10f);
            camera.backgroundColor = new Color(0.015f, 0.01f, 0.03f);
            cameraObject.tag = "MainCamera";
        }

        private static void CreateWorld()
        {
            GameObject floor = CreateQuad("Dungeon Floor", new Vector2(0f, 0f), new Vector2(16f, 11f), new Color(0.035f, 0.025f, 0.065f), 2f);

            CreateWall("Wall North", new Vector2(0f, 5.5f), new Vector2(16f, 0.35f));
            CreateWall("Wall South", new Vector2(0f, -5.5f), new Vector2(16f, 0.35f));
            CreateWall("Wall West", new Vector2(-8f, 0f), new Vector2(0.35f, 11f));
            CreateWall("Wall East", new Vector2(8f, 0f), new Vector2(0.35f, 11f));

            CreateWall("Inner Wall A", new Vector2(-1.5f, 2.2f), new Vector2(3.8f, 0.28f));
            CreateWall("Inner Wall B", new Vector2(2.8f, -0.7f), new Vector2(0.28f, 3.0f));
            CreateWall("Inner Wall C", new Vector2(-3.2f, -1.0f), new Vector2(2.2f, 0.28f));

            CreateQuad("Arena Accent", new Vector2(0f, 0f), new Vector2(4.2f, 4.2f), new Color(0.06f, 0.03f, 0.11f), 1.8f);
        }

        private static void CreatePlayer()
        {
            GameObject player = CreateQuad("Player", new Vector2(0f, -3.2f), new Vector2(0.75f, 0.95f), new Color(0.35f, 0.15f, 0.9f), 0f);
            player.tag = "Player";

            Rigidbody2D body = player.AddComponent<Rigidbody2D>();
            body.gravityScale = 0f;
            body.freezeRotation = true;
            body.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
            body.interpolation = RigidbodyInterpolation2D.Interpolate;

            CircleCollider2D collider = player.AddComponent<CircleCollider2D>();
            collider.radius = 0.42f;

            player.AddComponent<PlayerStats>();
            player.AddComponent<PlayerController>();
            player.AddComponent<PlayerCombat>();
            player.AddComponent<SkillSystem>();
        }

        private static void CreateEnemy(string name, System.Type enemyType, Vector2 position, int health)
        {
            GameObject enemy = CreateQuad(name, position, new Vector2(0.8f, 0.8f), new Color(0.18f, 0.03f, 0.28f), 0f);

            Rigidbody2D body = enemy.AddComponent<Rigidbody2D>();
            body.gravityScale = 0f;
            body.freezeRotation = true;
            body.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
            body.interpolation = RigidbodyInterpolation2D.Interpolate;

            CircleCollider2D collider = enemy.AddComponent<CircleCollider2D>();
            collider.radius = 0.42f;

            Damageable damageable = enemy.AddComponent<Damageable>();
            SetSerializedInt(damageable, "maxHealth", health);
            enemy.AddComponent(enemyType);
        }

        private static void CreatePortal(Vector2 position)
        {
            GameObject portal = CreateQuad("Portal (Locked)", position, new Vector2(1.35f, 1.35f), new Color(0.2f, 0.55f, 1f), 0.2f);
            portal.AddComponent<Portal>();
        }

        private static void CreateHUD()
        {
            GameObject hud = new GameObject("Shadow HUD");
            ShadowHUD shadowHud = hud.AddComponent<ShadowHUD>();

            PlayerStats player = GameObject.Find("Player").GetComponent<PlayerStats>();
            SkillSystem skills = GameObject.Find("Player").GetComponent<SkillSystem>();

            SetObjectReference(shadowHud, "player", player);
            SetObjectReference(shadowHud, "skills", skills);
        }

        private static GameObject CreateWall(string name, Vector2 position, Vector2 size)
        {
            GameObject wall = CreateQuad(name, position, size, new Color(0.07f, 0.045f, 0.10f), 0.5f);
            BoxCollider2D collider = wall.AddComponent<BoxCollider2D>();
            collider.size = Vector2.one;
            return wall;
        }

        private static GameObject CreateQuad(string name, Vector2 position, Vector2 size, Color color, float z)
        {
            GameObject go = GameObject.CreatePrimitive(PrimitiveType.Quad);
            go.name = name;
            go.transform.position = new Vector3(position.x, position.y, z);
            go.transform.localScale = new Vector3(size.x, size.y, 1f);

            Collider collider3D = go.GetComponent<Collider>();
            if (collider3D != null) Object.DestroyImmediate(collider3D);

            MeshRenderer renderer = go.GetComponent<MeshRenderer>();
            renderer.sharedMaterial = CreateMaterial(name + " Material", color);
            return go;
        }

        private static Material CreateMaterial(string name, Color color)
        {
            Shader shader = Shader.Find("Universal Render Pipeline/Unlit");
            if (shader == null) shader = Shader.Find("Unlit/Color");
            Material material = new Material(shader) { name = name, color = color };
            return material;
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
