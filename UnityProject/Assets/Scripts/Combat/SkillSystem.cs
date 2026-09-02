using System.Collections.Generic;
using UnityEngine;

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

        [SerializeField] private LayerMask enemyMask;
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
            foreach (var skill in skills)
                if (Input.GetKeyDown(skill.key)) Cast(skill.id);
        }

        public bool Cast(string id)
        {
            for (int i = 0; i < skills.Length; i++)
            {
                if (skills[i].id != id) continue;
                if (cooldowns.TryGetValue(id, out float readyAt) && Time.time < readyAt) return false;

                Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, skills[i].radius, enemyMask);
                foreach (Collider2D hit in hits)
                {
                    Damageable target = hit.GetComponentInParent<Damageable>();
                    if (target != null && !target.IsDead) target.TakeDamage(skills[i].damage);
                }

                cooldowns[id] = Time.time + skills[i].cooldown;
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
