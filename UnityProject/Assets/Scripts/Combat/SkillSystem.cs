using System.Collections.Generic;
using UnityEngine;
using ShadowAscension.Enemies;

namespace ShadowAscension.Combat
{
    public sealed class SkillSystem : MonoBehaviour
    {
        [System.Serializable]
        private struct SkillSlot
        {
            public string id;
            public KeyCode key;
            public int damage;
            public float radius;
            public float cooldown;
        }

        [SerializeField] private SkillSlot[] skills =
        {
            new SkillSlot { id = "ShadowSlash", key = KeyCode.Q, damage = 80, radius = 1.8f, cooldown = 2f },
            new SkillSlot { id = "ShadowBurst", key = KeyCode.E, damage = 180, radius = 3.2f, cooldown = 8f },
            new SkillSlot { id = "ShadowArrow", key = KeyCode.R, damage = 120, radius = 1.4f, cooldown = 4f },
            new SkillSlot { id = "Ascension", key = KeyCode.F, damage = 350, radius = 4.0f, cooldown = 18f }
        };

        private readonly Dictionary<string, float> cooldowns = new();

        private void Update()
        {
            if (skills == null) return;
            foreach (SkillSlot skill in skills)
                if (Input.GetKeyDown(skill.key)) Cast(skill.id);
        }

        public bool Cast(string id)
        {
            if (string.IsNullOrWhiteSpace(id) || skills == null) return false;

            for (int i = 0; i < skills.Length; i++)
            {
                SkillSlot skill = skills[i];
                if (skill.id != id) continue;
                if (cooldowns.TryGetValue(id, out float readyAt) && Time.time < readyAt) return false;

                Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, Mathf.Max(0.1f, skill.radius));
                foreach (Collider2D hit in hits)
                {
                    EnemyBase enemy = hit.GetComponentInParent<EnemyBase>();
                    if (enemy == null) continue;
                    Damageable target = enemy.GetComponent<Damageable>();
                    if (target != null && !target.IsDead) target.TakeDamage(Mathf.Max(0, skill.damage));
                }

                cooldowns[id] = Time.time + Mathf.Max(0f, skill.cooldown);
                return true;
            }
            return false;
        }

        public float GetRemainingCooldown(string id)
        {
            if (!cooldowns.TryGetValue(id, out float readyAt)) return 0f;
            return Mathf.Max(0f, readyAt - Time.time);
        }
    }
}
