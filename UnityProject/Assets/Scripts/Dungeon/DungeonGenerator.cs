using System.Collections.Generic;
using UnityEngine;

namespace ShadowAscension.Dungeon
{
    public sealed class DungeonGenerator : MonoBehaviour
    {
        [SerializeField] private Transform roomRoot;
        [SerializeField] private GameObject[] roomPrefabs;
        [SerializeField] private int roomCount = 5;
        [SerializeField] private float roomSpacing = 18f;
        [SerializeField] private bool generateOnStart = true;

        public readonly List<GameObject> GeneratedRooms = new();

        private void Start()
        {
            if (generateOnStart) Generate();
        }

        [ContextMenu("Generate Dungeon")]
        public void Generate()
        {
            Clear();
            if (roomPrefabs == null || roomPrefabs.Length == 0) return;

            for (int i = 0; i < Mathf.Max(1, roomCount); i++)
            {
                GameObject prefab = roomPrefabs[Random.Range(0, roomPrefabs.Length)];
                Vector3 position = new Vector3(i * roomSpacing, 0f, 0f);
                GameObject room = Instantiate(prefab, position, Quaternion.identity, roomRoot);
                room.name = $"Room_{i + 1:00}";
                GeneratedRooms.Add(room);
            }
        }

        public void Clear()
        {
            for (int i = GeneratedRooms.Count - 1; i >= 0; i--)
                if (GeneratedRooms[i] != null) Destroy(GeneratedRooms[i]);
            GeneratedRooms.Clear();
        }
    }
}
