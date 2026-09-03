using System;
using System.IO;
using UnityEditor;
using UnityEngine;

namespace ShadowAscension.Editor
{
    public static class ShadowAscensionVisualAssets
    {
        private const string Folder = "Assets/Art/Generated";
        private const int Size = 96;

        [MenuItem("Shadow Ascension/Generate Dark Fantasy Art")]
        public static void GenerateAll()
        {
            EnsureFolder(Folder);
            Generate("hero", DrawHero, true);
            Generate("shadow", DrawShadow, true);
            Generate("hunter", DrawHunter, true);
            Generate("mage", DrawMage, true);
            Generate("elite", DrawElite, true);
            Generate("portal", DrawPortal, true);
            Generate("floor", DrawFloor, false);
            Generate("wall", DrawWall, false);
            AssetDatabase.Refresh();
            Debug.Log("Shadow Ascension visual prototype assets generated.");
        }

        public static Sprite Load(string id)
        {
            Sprite sprite = AssetDatabase.LoadAssetAtPath<Sprite>($"{Folder}/{id}.png");
            if (sprite != null) return sprite;
            GenerateAll();
            return AssetDatabase.LoadAssetAtPath<Sprite>($"{Folder}/{id}.png");
        }

        private static void Generate(string id, Action<Texture2D> draw, bool transparent)
        {
            Texture2D texture = new Texture2D(Size, Size, TextureFormat.RGBA32, false);
            texture.filterMode = FilterMode.Point;
            Color clear = transparent ? new Color(0f, 0f, 0f, 0f) : new Color(0.02f, 0.015f, 0.035f, 1f);
            Color[] pixels = new Color[Size * Size];
            for (int i = 0; i < pixels.Length; i++) pixels[i] = clear;
            texture.SetPixels(pixels);
            draw(texture);
            texture.Apply();

            string absolute = Path.Combine(Application.dataPath, "Art/Generated", id + ".png");
            File.WriteAllBytes(absolute, texture.EncodeToPNG());
            UnityEngine.Object.DestroyImmediate(texture);

            string assetPath = $"{Folder}/{id}.png";
            AssetDatabase.ImportAsset(assetPath, ImportAssetOptions.ForceUpdate);
            TextureImporter importer = AssetImporter.GetAtPath(assetPath) as TextureImporter;
            if (importer != null)
            {
                importer.textureType = TextureImporterType.Sprite;
                importer.spriteImportMode = SpriteImportMode.Single;
                TextureImporterSettings settings = new TextureImporterSettings();
                importer.ReadTextureSettings(settings);
                settings.spriteMeshType = SpriteMeshType.FullRect;
                importer.SetTextureSettings(settings);
                importer.spritePixelsPerUnit = Size;
                importer.filterMode = FilterMode.Point;
                importer.textureCompression = TextureImporterCompression.Uncompressed;
                importer.mipmapEnabled = false;
                importer.alphaIsTransparency = transparent;
                importer.wrapMode = TextureWrapMode.Clamp;
                importer.SaveAndReimport();
            }
        }

        private static void DrawHero(Texture2D t)
        {
            OutlineCircle(t, 48, 48, 34, new Color(0.18f, 0.04f, 0.28f, 0.35f));
            Circle(t, 48, 48, 28, new Color(0.06f, 0.04f, 0.10f, 0.85f));
            Rect(t, 31, 22, 65, 66, new Color(0.035f, 0.025f, 0.055f, 1f));
            Rect(t, 34, 26, 62, 60, new Color(0.11f, 0.075f, 0.16f, 1f));
            Rect(t, 38, 57, 58, 70, new Color(0.045f, 0.03f, 0.075f, 1f));
            Circle(t, 48, 70, 13, new Color(0.46f, 0.31f, 0.27f, 1f));
            Rect(t, 37, 76, 59, 86, new Color(0.01f, 0.008f, 0.018f, 1f));
            Rect(t, 39, 70, 57, 76, new Color(0.025f, 0.02f, 0.035f, 1f));
            Rect(t, 40, 71, 44, 73, new Color(0.75f, 0.55f, 0.95f, 1f));
            Rect(t, 52, 71, 56, 73, new Color(0.75f, 0.55f, 0.95f, 1f));
            Line(t, 58, 45, 82, 73, 3, new Color(0.52f, 0.22f, 0.95f, 1f));
            Line(t, 59, 45, 84, 70, 1, new Color(0.92f, 0.82f, 1f, 1f));
            Line(t, 32, 47, 64, 40, 2, new Color(0.38f, 0.12f, 0.75f, 0.8f));
        }

        private static void DrawShadow(Texture2D t)
        {
            OutlineCircle(t, 48, 46, 34, new Color(0.45f, 0.08f, 0.7f, 0.35f));
            Circle(t, 48, 48, 25, new Color(0.025f, 0.018f, 0.04f, 1f));
            Circle(t, 40, 61, 10, new Color(0.045f, 0.02f, 0.07f, 1f));
            Circle(t, 56, 61, 10, new Color(0.045f, 0.02f, 0.07f, 1f));
            Rect(t, 36, 48, 43, 51, new Color(0.55f, 0.16f, 0.9f, 1f));
            Rect(t, 53, 48, 60, 51, new Color(0.55f, 0.16f, 0.9f, 1f));
            Line(t, 29, 39, 18, 25, 2, new Color(0.22f, 0.05f, 0.34f, 0.9f));
            Line(t, 67, 39, 79, 25, 2, new Color(0.22f, 0.05f, 0.34f, 0.9f));
        }

        private static void DrawHunter(Texture2D t)
        {
            Circle(t, 48, 48, 32, new Color(0.15f, 0.03f, 0.23f, 0.35f));
            Rect(t, 30, 25, 66, 70, new Color(0.03f, 0.025f, 0.05f, 1f));
            Circle(t, 48, 69, 14, new Color(0.035f, 0.025f, 0.055f, 1f));
            Rect(t, 37, 68, 59, 74, new Color(0.55f, 0.16f, 0.82f, 1f));
            Line(t, 68, 25, 68, 78, 2, new Color(0.33f, 0.1f, 0.55f, 1f));
            Line(t, 68, 31, 80, 53, 2, new Color(0.62f, 0.35f, 0.9f, 1f));
            Line(t, 68, 31, 56, 53, 2, new Color(0.62f, 0.35f, 0.9f, 1f));
            Line(t, 36, 55, 18, 48, 1, new Color(0.78f, 0.55f, 1f, 0.9f));
        }

        private static void DrawMage(Texture2D t)
        {
            OutlineCircle(t, 48, 48, 35, new Color(0.25f, 0.08f, 0.42f, 0.3f));
            Circle(t, 48, 44, 24, new Color(0.07f, 0.03f, 0.11f, 1f));
            Rect(t, 29, 23, 67, 66, new Color(0.055f, 0.03f, 0.085f, 1f));
            Rect(t, 35, 61, 61, 79, new Color(0.15f, 0.05f, 0.23f, 1f));
            Circle(t, 48, 69, 8, new Color(0.54f, 0.23f, 0.9f, 1f));
            Circle(t, 48, 69, 4, new Color(0.92f, 0.82f, 1f, 1f));
            Line(t, 66, 27, 80, 75, 2, new Color(0.34f, 0.13f, 0.6f, 1f));
            Circle(t, 80, 75, 6, new Color(0.58f, 0.25f, 0.95f, 0.9f));
        }

        private static void DrawElite(Texture2D t)
        {
            OutlineCircle(t, 48, 48, 39, new Color(0.55f, 0.12f, 0.8f, 0.32f));
            Rect(t, 23, 19, 73, 76, new Color(0.025f, 0.02f, 0.035f, 1f));
            Rect(t, 28, 25, 68, 70, new Color(0.10f, 0.055f, 0.15f, 1f));
            Rect(t, 31, 70, 65, 80, new Color(0.05f, 0.025f, 0.08f, 1f));
            Rect(t, 32, 52, 40, 57, new Color(0.68f, 0.18f, 0.95f, 1f));
            Rect(t, 56, 52, 64, 57, new Color(0.68f, 0.18f, 0.95f, 1f));
            Line(t, 30, 35, 15, 22, 4, new Color(0.26f, 0.08f, 0.42f, 1f));
            Line(t, 66, 35, 81, 22, 4, new Color(0.26f, 0.08f, 0.42f, 1f));
            Line(t, 24, 72, 12, 84, 3, new Color(0.44f, 0.13f, 0.72f, 1f));
            Line(t, 72, 72, 84, 84, 3, new Color(0.44f, 0.13f, 0.72f, 1f));
        }

        private static void DrawPortal(Texture2D t)
        {
            OutlineCircle(t, 48, 48, 39, new Color(0.18f, 0.45f, 1f, 0.45f));
            OutlineCircle(t, 48, 48, 32, new Color(0.35f, 0.65f, 1f, 0.9f));
            Circle(t, 48, 48, 26, new Color(0.02f, 0.035f, 0.11f, 0.9f));
            OutlineCircle(t, 48, 48, 22, new Color(0.65f, 0.2f, 1f, 0.95f));
            Line(t, 30, 69, 66, 27, 2, new Color(0.7f, 0.85f, 1f, 0.75f));
        }

        private static void DrawFloor(Texture2D t)
        {
            Color baseColor = new Color(0.035f, 0.03f, 0.055f, 1f);
            Color seam = new Color(0.012f, 0.01f, 0.02f, 1f);
            for (int y = 0; y < Size; y++)
                for (int x = 0; x < Size; x++)
                    t.SetPixel(x, y, baseColor);
            for (int x = 0; x < Size; x += 32) Rect(t, x, 0, x + 2, Size, seam);
            for (int y = 0; y < Size; y += 24) Rect(t, 0, y, Size, y + 2, seam);
            for (int y = 3; y < Size; y += 24)
                for (int x = 5 + ((y / 24) % 2) * 16; x < Size; x += 32)
                    Rect(t, x, y, Mathf.Min(x + 12, Size), y + 1, new Color(0.075f, 0.055f, 0.10f, 1f));
        }

        private static void DrawWall(Texture2D t)
        {
            for (int y = 0; y < Size; y++)
                for (int x = 0; x < Size; x++)
                    t.SetPixel(x, y, new Color(0.07f, 0.05f, 0.085f, 1f));
            Color seam = new Color(0.025f, 0.018f, 0.032f, 1f);
            for (int y = 0; y < Size; y += 24) Rect(t, 0, y, Size, y + 3, seam);
            for (int y = 0; y < Size; y += 24)
                for (int x = (y / 24 % 2) * 20; x < Size; x += 40)
                    Rect(t, x, y, x + 3, Mathf.Min(y + 24, Size), seam);
        }

        private static void Rect(Texture2D t, int x0, int y0, int x1, int y1, Color c)
        {
            x0 = Mathf.Clamp(x0, 0, Size); x1 = Mathf.Clamp(x1, 0, Size);
            y0 = Mathf.Clamp(y0, 0, Size); y1 = Mathf.Clamp(y1, 0, Size);
            for (int y = y0; y < y1; y++) for (int x = x0; x < x1; x++) t.SetPixel(x, y, c);
        }

        private static void Circle(Texture2D t, int cx, int cy, int r, Color c)
        {
            int rr = r * r;
            for (int y = cy - r; y <= cy + r; y++)
                for (int x = cx - r; x <= cx + r; x++)
                    if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= rr && x >= 0 && x < Size && y >= 0 && y < Size)
                        t.SetPixel(x, y, c);
        }

        private static void OutlineCircle(Texture2D t, int cx, int cy, int r, Color c)
        {
            int outer = r * r;
            int inner = (r - 2) * (r - 2);
            for (int y = cy - r; y <= cy + r; y++)
                for (int x = cx - r; x <= cx + r; x++)
                {
                    int d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
                    if (d <= outer && d >= inner && x >= 0 && x < Size && y >= 0 && y < Size) t.SetPixel(x, y, c);
                }
        }

        private static void Line(Texture2D t, int x0, int y0, int x1, int y1, int width, Color c)
        {
            int dx = Mathf.Abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
            int dy = -Mathf.Abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
            int err = dx + dy;
            while (true)
            {
                Circle(t, x0, y0, width, c);
                if (x0 == x1 && y0 == y1) break;
                int e2 = 2 * err;
                if (e2 >= dy) { err += dy; x0 += sx; }
                if (e2 <= dx) { err += dx; y0 += sy; }
            }
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
