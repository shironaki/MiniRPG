using UnityEngine;
using ShadowAscension.Combat;
using ShadowAscension.Player;

namespace ShadowAscension.Enemies
{
    public sealed class BossController : EnemyBase
    {
        [SerializeField] private int phaseTwoDamage = 60;
        [SerializeField] private float phaseTwoSpeed = 2.1f;
        [SerializeField] private float shockwaveCooldown = 5f;
        [SerializeField] private float shockwaveRadius = 2.8f;
        [SerializeField] private int shockwaveDamage = 45;

        private bool phaseTwo;
        private float nextShockwave;

        public bool PhaseTwo => phaseTwo;

        protected override void Awake()
        {
            base.Awake();
            moveSpeed = 1.15f;
            chaseRange = 10f;
            attackRange = 1.45f;
            contactDamage = 42;
            attackCooldown = 1.35f;
        }

        protected override void FixedUpdate()
        {
            if (Health != null && !phaseTwo && Health.CurrentHealth <= Health.MaxHealth / 2)
            {
                phaseTwo = true;
                moveSpeed = phaseTwoSpeed;
                contactDamage = phaseTwoDamage;
                CombatFeedback.Hit(transform.position, 0, true);
            }

            base.FixedUpdate();
        }

        protected override void TryAttack()
        {
            base.TryAttack();

            if (Target == null || Health == null || Health.IsDead) return;
            if (Time.time < nextShockwave) return;
            nextShockwave = Time.time + Mathf.Max(1f, phaseTwo ? shockwaveCooldown * 0.65f : shockwaveCooldown);

            float radius = phaseTwo ? shockwaveRadius * 1.2f : shockwaveRadius;
            Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, radius);
            foreach (Collider2D hit in hits)
            {
                PlayerStats player = hit.GetComponentInParent<PlayerStats>();
                if (player != null)
                    player.TakeDamage(phaseTwo ? shockwaveDamage + 20 : shockwaveDamage);
            }

            CombatFeedback.Hit(transform.position, phaseTwo ? shockwaveDamage + 20 : shockwaveDamage, phaseTwo);
        }
    }
}
