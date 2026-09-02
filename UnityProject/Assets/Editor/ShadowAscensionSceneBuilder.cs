using System.IO;
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
        private const string VisualFolder = "Assets/GeneratedVisuals";
        private const string ScenePath = SceneFolder + "/ShadowAscension_Test.unity";

        [MenuItem("Shadow Ascension/Create Test Scene")]
        public static void CreateTestScene()
        {
            EnsureFolder(SceneFolder);
            EnsureFolder(VisualFolder);
            GenerateVisualAssets();

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "ShadowAscension_Test";

            CreateCamera();
            CreateWorld();
            CreatePlayer();
            CreateEnemy("Shadow", typeof(ShadowEnemy), new Vector2(3.5f, 1.5f), 180, "ShadowEnemy");
            CreateEnemy("Hunter", typeof(ShadowHunter), new Vector2(-3.2f, 1.8f), 140, "ShadowHunter");
            CreateEnemy("Mage", typeof(ShadowMage), new Vector2(3.4f, -2.0f), 160, "ShadowMage");
            CreateEnemy("Elite", typeof(ShadowBrute), new Vector2(-3.6f, -2.2f), 500, "ShadowBrute");
            CreatePortal(new Vector2(0f, 4.0f));
            CreateHUD();

            EditorSceneManager.SaveScene(scene, ScenePath);
            Selection.activeObject = GameObject.Find("Player");
            Debug.Log("Shadow Ascension test scene created with generated 2D visuals: " + ScenePath);
        }

        private static void CreateCamera()
        {
            GameObject cameraObject = new GameObject("Main Camera");
            Camera camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 6f;
            camera.transform.position = new Vector3(0f, 0f, -10f);
            camera.backgroundColor = new Color(0.008f, 0.006f, 0.018f);
            cameraObject.tag = "MainCamera";
        }

        private static void CreateWorld()
        {
            CreateSpriteObject("Dungeon Floor", new Vector2(0f, 0f), new Vector2(16f, 11f), "Floor", -10, false);

            CreateWall("Wall North", new Vector2(0f, 5.5f), new Vector2(16f, 0.45f));
            CreateWall("Wall South", new Vector2(0f, -5.5f), new Vector2(16f, 0.45f));
            CreateWall("Wall West", new Vector2(-8f, 0f), new Vector2(0.45f, 11f));
            CreateWall("Wall East", new Vector2(8f, 0f), new Vector2(0.45f, 11f));

            CreateWall("Inner Wall A", new Vector2(-1.5f, 2.2f), new Vector2(3.8f, 0.35f));
            CreateWall("Inner Wall B", new Vector2(2.8f, -0.7f), new Vector2(0.35f, 3.0f));
            CreateWall("Inner Wall C", new Vector2(-3.2f, -1.0f), new Vector2(2.2f, 0.35f));
            CreateSpriteObject("Arena Accent", new Vector2(0f, 0f), new Vector2(4.2f, 4.2f), "Arena", -5, false);
        }

        private static void CreatePlayer()
        {
            GameObject player = CreateSpriteObject("Player", new Vector2(0f, -3.2f), Vector2.one, "Player", 10, true);
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

        private static void CreateEnemy(string name, System.Type enemyType, Vector2 position, int health, string visualId)
        {
            GameObject enemy = CreateSpriteObject(name, position, Vector2.one, visualId, 9, true);

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
            GameObject portal = CreateSpriteObject("Portal (Locked)", position, new Vector2(1.35f, 1.35f), "Portal", 5, false);
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
            GameObject wall = CreateSpriteObject(name, position, size, "Wall", 0, true);
            BoxCollider2D collider = wall.AddComponent<BoxCollider2D>();
            collider.size = Vector2.one;
            return wall;
        }

        private static GameObject CreateSpriteObject(string name, Vector2 position, Vector2 size, string visualId, int sortingOrder, bool colliderVisual)
        {
            GameObject go = new GameObject(name);
            go.transform.position = new Vector3(position.x, position.y, 0f);
            go.transform.localScale = new Vector3(size.x, size.y, 1f);

            SpriteRenderer renderer = go.AddComponent<SpriteRenderer>();
            renderer.sprite = LoadSprite(visualId);
            renderer.sortingOrder = sortingOrder;
            renderer.drawMode = SpriteDrawMode.Simple;
            return go;
        }

        private static Sprite LoadSprite(string visualId)
        {
            string path = VisualFolder + "/" + visualId + ".png";
            Texture2D texture = AssetDatabase.LoadAssetAtPath<Texture2D>(path);
            if (texture == null) return null;
            return AssetDatabase.LoadAssetAtPath<Sprite>(VisualFolder + "/" + visualId + ".asset");
        }

        private static void GenerateVisualAssets()
        {
            CreateVisual("Floor", 128, 128, DrawFloor);
            CreateVisual("Arena", 128, 128, DrawArena);
            CreateVisual("Wall", 64, 64, DrawWall);
            CreateVisual("Player", 96, 112, DrawPlayer);
            CreateVisual("ShadowEnemy", 80, 80, DrawShadowEnemy);
            CreateVisual("ShadowHunter", 80, 80, DrawShadowHunter);
            CreateVisual("ShadowMage", 88, 88, DrawShadowMage);
            CreateVisual("ShadowBrute", 104, 104, DrawShadowBrute);
            CreateVisual("Portal", 128, 128, DrawPortal);
            AssetDatabase.Refresh();
        }

        private static void CreateVisual(string id, int width, int height, System.Action<Texture2D> draw)
        {
            string pngPath = VisualFolder + "/" + id + ".png";
            string spritePath = VisualFolder + "/" + id + ".asset";

            if (File.Exists(Application.dataPath + "/" + pngPath.Substring("Assets/".Length)))
                AssetDatabase.DeleteAsset(pngPath);
            if (AssetDatabase.LoadAssetAtPath<Object>(spritePath) != null)
                AssetDatabase.DeleteAsset(spritePath);

            Texture2D texture = new Texture2D(width, height, TextureFormat.RGBA32, false);
            texture.filterMode = FilterMode.Point;
            texture.wrapMode = TextureWrapMode.Clamp;
            Clear(texture);
            draw(texture);
            texture.Apply();

            File.WriteAllBytes(Application.dataPath + "/" + pngPath.Substring("Assets/".Length), texture.EncodeToPNG());
            Object.DestroyImmediate(texture);
            AssetDatabase.ImportAsset(pngPath, ImportAssetOptions.ForceUpdate);

            TextureImporter importer = AssetImporter.GetAtPath(pngPath) as TextureImporter;
            if (importer != null)
            {
                importer.textureType = TextureImporterType.Sprite;
                importer.spriteImportMode = SpriteImportMode.Single;
                importer.filterMode = FilterMode.Point;
                importer.textureCompression = TextureImporterCompression.Uncompressed;
                importer.alphaIsTransparency = true;
                importer.SaveAndReimport();
            }

            Texture2D importedTexture = AssetDatabase.LoadAssetAtPath<Texture2D>(pngPath);
            Sprite sprite = Sprite.Create(importedTexture, new Rect(0, 0, width, height), new Vector2(0.5f, 0.5f), 32f);
            sprite.name = id;
            AssetDatabase.CreateAsset(sprite, spritePath);
        }

        private static void Clear(Texture2D t)
        {
            Color32[] pixels = new Color32[t.width * t.height];
            for (int i = 0; i < pixels.Length; i++) pixels[i] = new Color32(0, 0, 0, 0);
            t.SetPixels32(pixels);
        }

        private static void Pixel(Texture2D t, int x, int y, Color32 c)
        {
            if (x >= 0 && y >= 0 && x < t.width && y < t.height) t.SetPixel(x, y, c);
        }

        private static void Rect(Texture2D t, int x0, int y0, int x1, int y1, Color32 c)
        {
            for (int y = y0; y <= y1; y++)
                for (int x = x0; x <= x1; x++) Pixel(t, x, y, c);
        }

        private static void Circle(Texture2D t, int cx, int cy, int radius, Color32 c)
        {
            int r2 = radius * radius;
            for (int y = cy - radius; y <= cy + radius; y++)
                for (int x = cx - radius; x <= cx + radius; x++)
                    if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r2) Pixel(t, x, y, c);
        }

        private static void Ring(Texture2D t, int cx, int cy, int outer, int inner, Color32 c)
        {
            int o2 = outer * outer;
            int i2 = inner * inner;
            for (int y = cy - outer; y <= cy + outer; y++)
                for (int x = cx - outer; x <= cx + outer; x++)
                {
                    int d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
                    if (d <= o2 && d >= i2) Pixel(t, x, y, c);
                }
        }

        private static void DrawFloor(Texture2D t)
        {
            Rect(t, 0, 0, 127, 127, new Color32(10, 8, 18, 255));
            for (int y = 0; y < 128; y += 32)
                for (int x = 0; x < 128; x += 32)
                {
                    Rect(t, x + 1, y + 1, x + 30, y + 30, new Color32(15, 12, 28, 255));
                    Rect(t, x + 2, y + 29, x + 29, y + 30, new Color32(6, 5, 12, 255));
                }
        }

        private static void DrawArena(Texture2D t)
        {
            Rect(t, 0, 0, 127, 127, new Color32(17, 10, 31, 255));
            Ring(t, 64, 64, 58, 55, new Color32(55, 25, 90, 180));
            Ring(t, 64, 64, 43, 41, new Color32(35, 20, 60, 220));
            Circle(t, 64, 64, 4, new Color32(90, 45, 150, 120));
        }

        private static void DrawWall(Texture2D t)
        {
            Rect(t, 0, 0, 63, 63, new Color32(20, 15, 29, 255));
            Rect(t, 2, 2, 61, 61, new Color32(30, 22, 43, 255));
            Rect(t, 3, 3, 60, 5, new Color32(54, 37, 70, 255));
            Rect(t, 3, 55, 60, 60, new Color32(9, 7, 15, 255));
            for (int x = 10; x < 60; x += 18) Rect(t, x, 18, x + 2, 45, new Color32(13, 10, 21, 255));
        }

        private static void DrawPlayer(Texture2D t)
        {
            Circle(t, 48, 75, 17, new Color32(8, 6, 15, 210));
            Rect(t, 29, 36, 67, 68, new Color32(27, 24, 38, 255));
            Rect(t, 34, 30, 62, 42, new Color32(47, 40, 62, 255));
            Rect(t, 38, 66, 58, 91, new Color32(16, 13, 25, 255));
            Circle(t, 48, 80, 12, new Color32(12, 10, 20, 255));
            Rect(t, 42, 78, 45, 80, new Color32(130, 76, 255, 255));
            Rect(t, 51, 78, 54, 80, new Color32(130, 76, 255, 255));
            Rect(t, 66, 37, 70, 93, new Color32(85, 65, 120, 255));
            Rect(t, 69, 30, 72, 94, new Color32(170, 125, 255, 255));
            Rect(t, 72, 26, 74, 31, new Color32(230, 215, 255, 255));
            Rect(t, 24, 89, 39, 94, new Color32(40, 28, 62, 255));
            Rect(t, 57, 89, 72, 94, new Color32(40, 28, 62, 255));
        }

        private static void DrawShadowEnemy(Texture2D t)
        {
            Circle(t, 40, 35, 25, new Color32(17, 7, 28, 255));
            Circle(t, 40, 42, 20, new Color32(31, 10, 50, 255));
            Circle(t, 31, 44, 4, new Color32(177, 92, 255, 255));
            Circle(t, 49, 44, 4, new Color32(177, 92, 255, 255));
            Rect(t, 17, 18, 25, 21, new Color32(65, 20, 90, 220));
            Rect(t, 55, 18, 63, 21, new Color32(65, 20, 90, 220));
        }

        private static void DrawShadowHunter(Texture2D t)
        {
            Circle(t, 40, 38, 22, new Color32(13, 7, 23, 255));
            Rect(t, 17, 20, 25, 51, new Color32(53, 17, 74, 255));
            Rect(t, 55, 20, 63, 51, new Color32(53, 17, 74, 255));
            Rect(t, 27, 48, 53, 67, new Color32(36, 12, 53, 255));
            Rect(t, 27, 35, 31, 39, new Color32(220, 90, 255, 255));
            Rect(t, 49, 35, 53, 39, new Color32(220, 90, 255, 255));
            Rect(t, 62, 43, 71, 46, new Color32(117, 72, 180, 255));
        }

        private static void DrawShadowMage(Texture2D t)
        {
            Circle(t, 44, 40, 19, new Color32(17, 7, 29, 255));
            Rect(t, 24, 37, 64, 73, new Color32(37, 12, 58, 255));
            Rect(t, 29, 67, 59, 76, new Color32(65, 20, 86, 255));
            Rect(t, 29, 35, 33, 39, new Color32(220, 110, 255, 255));
            Rect(t, 54, 35, 58, 39, new Color32(220, 110, 255, 255));
            Rect(t, 70, 18, 73, 75, new Color32(74, 42, 110, 255));
            Circle(t, 71, 16, 7, new Color32(155, 83, 255, 230));
        }

        private static void DrawShadowBrute(Texture2D t)
        {
            Circle(t, 52, 51, 31, new Color32(12, 5, 20, 255));
            Rect(t, 19, 34, 85, 77, new Color32(41, 10, 56, 255));
            Rect(t, 25, 22, 43, 35, new Color32(65, 17, 81, 255));
            Rect(t, 61, 22, 79, 35, new Color32(65, 17, 81, 255));
            Rect(t, 31, 46, 40, 53, new Color32(232, 96, 255, 255));
            Rect(t, 64, 46, 73, 53, new Color32(232, 96, 255, 255));
            Rect(t, 12, 55, 25, 65, new Color32(74, 24, 91, 255));
            Rect(t, 80, 55, 93, 65, new Color32(74, 24, 91, 255));
        }

        private static void DrawPortal(Texture2D t)
        {
            Circle(t, 64, 64, 51, new Color32(25, 10, 55, 120));
            Ring(t, 64, 64, 47, 40, new Color32(72, 120, 255, 230));
            Ring(t, 64, 64, 37, 33, new Color32(160, 92, 255, 230));
            Circle(t, 64, 64, 30, new Color32(17, 8, 38, 240));
            Ring(t, 64, 64, 27, 25, new Color32(105, 65, 210, 220));
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
