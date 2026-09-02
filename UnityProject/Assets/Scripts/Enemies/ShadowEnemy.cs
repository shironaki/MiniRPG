using UnityEngine;

namespace ShadowAscension.Enemies
{
    public sealed class ShadowEnemy : EnemyBase
    {
        [SerializeField] private int contactDamage = 18;
        [SerializeField] private float attackInterval = 1.1f;
        private float attackTimer;

        protected override void Update()
        {
            base.Update();
            if (Target == null) return;
            attackTimer -= Time.deltaTime;
            if (Vector2.Distance(transform.position, Target.position) <= 0.9f && attackTimer <= 0f)
            {
                var stats = Target.GetComponent<ShadowAscension.Player.PlayerStats>();
                if (stats != null) stats.TakeDamage(contactDamage);
                attackTimer = attackInterval;
            }
        }
    }
}