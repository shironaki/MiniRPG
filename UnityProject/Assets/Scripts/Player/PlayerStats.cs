using System;
using UnityEngine;

namespace ShadowAscension.Player
{
    public sealed class PlayerStats : MonoBehaviour
    {
        [field: SerializeField] public int Level { get; private set; } = 1;
        [field: SerializeField] public int MaxHealth { get; private set; } = 100;
        [field: SerializeField] public int MaxMana { get; private set; } = 100;
        [field: SerializeField] public int Attack { get; private set; } = 25;
        [field: SerializeField] public int Experience { get; private set; }
        [field: SerializeField] public int Gold { get; private set; }
        [field: SerializeField] public int Essence { get; private set; }

        public int Health { get; private set; }
        public int Mana { get; private set; }
        public int ExperienceToNextLevel => 100 + (Level - 1) * 75;

        public event Action<int> ExperienceChanged;
        public event Action<int> LevelChanged;
        public event Action<int, int, int> CurrencyChanged;

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

        public void AddExperience(int amount)
        {
            int safeAmount = Mathf.Max(0, amount);
            if (safeAmount == 0) return;
            Experience += safeAmount;
            ExperienceChanged?.Invoke(Experience);

            while (Experience >= ExperienceToNextLevel)
            {
                Experience -= ExperienceToNextLevel;
                LevelUp();
            }
        }

        public void AddRewards(int gold, int essence)
        {
            Gold = Mathf.Max(0, Gold + Mathf.Max(0, gold));
            Essence = Mathf.Max(0, Essence + Mathf.Max(0, essence));
            CurrencyChanged?.Invoke(Gold, Essence, Level);
        }

        private void LevelUp()
        {
            Level = Mathf.Min(9999, Level + 1);
            MaxHealth = Mathf.Min(1000000, MaxHealth + 18);
            MaxMana = Mathf.Min(1000000, MaxMana + 10);
            Health = MaxHealth;
            Mana = MaxMana;
            LevelChanged?.Invoke(Level);
        }
    }
}
