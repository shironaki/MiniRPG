using UnityEngine;

namespace ShadowAscension.Player
{
    public sealed class PlayerStats : MonoBehaviour
    {
        [field: SerializeField] public int Level { get; private set; } = 1;
        [field: SerializeField] public int MaxHealth { get; private set; } = 100;
        [field: SerializeField] public int MaxMana { get; private set; } = 100;
        [field: SerializeField] public int Attack { get; private set; } = 25;

        public int Health { get; private set; }
        public int Mana { get; private set; }

        private void Awake()
        {
            Health = MaxHealth;
            Mana = MaxMana;
        }

        public void TakeDamage(int amount)
        {
            Health = Mathf.Max(0, Health - Mathf.Max(0, amount));
        }

        public void RestoreHealth(int amount)
        {
            Health = Mathf.Min(MaxHealth, Health + Mathf.Max(0, amount));
        }
    }
}
