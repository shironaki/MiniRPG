using System;
using UnityEngine;

namespace ShadowAscension.Combat
{
    public sealed class Damageable : MonoBehaviour
    {
        [SerializeField] private int maxHealth = 100;
        public int MaxHealth => maxHealth;
        public int CurrentHealth { get; private set; }
        public bool IsDead => CurrentHealth <= 0;

        public event Action<int> Damaged;
        public event Action Died;

        private void Awake() => CurrentHealth = maxHealth;

        public void SetMaxHealth(int value)
        {
            maxHealth = Mathf.Max(1, value);
            CurrentHealth = maxHealth;
        }

        public bool TakeDamage(int amount)
        {
            if (IsDead) return false;
            int safeAmount = Mathf.Max(0, amount);
            if (safeAmount == 0) return false;
            CurrentHealth = Mathf.Max(0, CurrentHealth - safeAmount);
            Damaged?.Invoke(safeAmount);
            if (CurrentHealth == 0)
            {
                Died?.Invoke();
                Die();
            }
            return true;
        }

        public void Heal(int amount)
        {
            if (IsDead) return;
            CurrentHealth = Mathf.Min(maxHealth, CurrentHealth + Mathf.Max(0, amount));
        }

        private void Die()
        {
            SendMessage("OnDeath", SendMessageOptions.DontRequireReceiver);
        }
    }
}
