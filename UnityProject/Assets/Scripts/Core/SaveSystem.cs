using System.IO;
using UnityEngine;

namespace ShadowAscension.Core
{
    public static class SaveSystem
    {
        [System.Serializable]
        public sealed class SaveData
        {
            public int level = 1;
            public int hp = 100;
            public int mp = 100;
            public int gold;
            public int floor = 1;
        }

        private static string Path => System.IO.Path.Combine(Application.persistentDataPath, "shadow_ascension_save.json");

        public static void Save(SaveData data)
        {
            if (data == null) return;
            Validate(data);
            try
            {
                File.WriteAllText(Path, JsonUtility.ToJson(data, true));
            }
            catch (IOException) { }
            catch (System.UnauthorizedAccessException) { }
        }

        public static SaveData Load()
        {
            if (!File.Exists(Path)) return new SaveData();
            try
            {
                SaveData data = JsonUtility.FromJson<SaveData>(File.ReadAllText(Path)) ?? new SaveData();
                Validate(data);
                return data;
            }
            catch
            {
                return new SaveData();
            }
        }

        public static bool Exists() => File.Exists(Path);

        private static void Validate(SaveData data)
        {
            data.level = Mathf.Clamp(data.level, 1, 9999);
            data.hp = Mathf.Clamp(data.hp, 0, 1000000);
            data.mp = Mathf.Clamp(data.mp, 0, 1000000);
            data.gold = Mathf.Clamp(data.gold, 0, 2000000000);
            data.floor = Mathf.Clamp(data.floor, 1, 9999);
        }
    }
}
