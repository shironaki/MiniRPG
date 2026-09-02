using UnityEngine;

namespace ShadowAscension.Dungeon
{
    public sealed class DungeonRoom : MonoBehaviour
    {
        [SerializeField] private Transform enemyRoot;
        [SerializeField] private GameObject portal;
        [SerializeField] private int roomNumber = 1;

        public int RoomNumber => roomNumber;
        public bool Cleared { get; private set; }

        private void Update()
        {
            if (Cleared || enemyRoot == null) return;
            bool enemiesRemain = false;
            for (int i = 0; i < enemyRoot.childCount; i++)
            {
                var d = enemyRoot.GetChild(i).GetComponentInChildren<ShadowAscension.Combat.Damageable>();
                if (d != null && !d.IsDead) { enemiesRemain = true; break; }
            }
            if (!enemiesRemain) ClearRoom();
        }

        private void ClearRoom()
        {
            Cleared = true;
            if (portal != null) portal.SetActive(true);
        }
    }
}
