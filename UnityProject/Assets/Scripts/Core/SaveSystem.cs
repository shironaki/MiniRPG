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
            File.WriteAllText(Path, JsonUtility.ToJson(data, true));
        }

        public static SaveData Load()
        {
            if (!File.Exists(Path)) return new SaveData();
            try { return JsonUtility.FromJson<SaveData>(File.ReadAllText(Path)) ?? new SaveData(); }
            catch { return new SaveData(); }
        }

        public static bool Exists() => File.Exists(Path);
    }
}
