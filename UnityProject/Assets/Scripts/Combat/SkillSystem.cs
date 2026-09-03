using System.Collections.Generic;
using UnityEngine;
using ShadowAscension.Input;
using ShadowAscension.Enemies;

namespace ShadowAscension.Combat
{
    public sealed class SkillSystem : MonoBehaviour
    {
        [System.Serializable]
        private struct SkillSlot
        {
            public string id;
            public int damage;
            public float radius;
            public float cooldown;
        }

        [SerializeField] private SkillSlot[] skills =
        {
            new SkillSlot { id = "ShadowSlash", damage = 80, radius = 1.8f, cooldown = 2f },
            new SkillSlot { id = "ShadowBurst", damage = 180, radius = 3.2f, cooldown = 8f },
            new SkillSlot { id = "ShadowArrow", damage = 120, radius = 1.4f, cooldown = 4f },
            new SkillSlot { id = "Ascension", damage = 350, radius = 4.0f, cooldown = 18f }
        };

        private readonly Dictionary<string, float> cooldowns = new();
        private PlayerInputRouter input;

        private void Awake()
        {
            input = GetComponent<PlayerInputRouter>();
            if (input == null) input = gameObject.AddComponent<PlayerInputRouter>();
        }

        private void Update()
        {
            if (skills == null || input == null) return;
            for (int i = 0; i < skills.Length && i < 4; i++)
                if (input.ConsumeSkill(i)) Cast(skills[i].id);
        }

        public bool Cast(string id)
        {
            if (string.IsNullOrWhiteSpace(id) || skills == null) return false;

            for (int i = 0; i < skills.Length; i++)
            {
                SkillSlot skill = skills[i];
                if (skill.id != id) continue;
                if (cooldowns.TryGetValue(id, out float readyAt) && Time.time < readyAt) return false;

                float radius = Mathf.Max(0.1f, skill.radius);
                Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, radius);
                foreach (Collider2D hit in hits)
                {
                    EnemyBase enemy = hit.GetComponentInParent<EnemyBase>();
                    if (enemy == null) continue;
                    Damageable target = enemy.GetComponent<Damageable>();
                    if (target != null && !target.IsDead && target.TakeDamage(Mathf.Max(0, skill.damage)))
                        CombatFeedback.Hit(enemy.transform.position, skill.damage);
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
