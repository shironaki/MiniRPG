using UnityEngine;

namespace ShadowAscension.Enemies
{
    public sealed class ShadowHunter : EnemyBase
    {
        protected override void Awake()
        {
            base.Awake();
            moveSpeed = 3.2f;
            chaseRange = 10f;
            attackRange = 1.0f;
            contactDamage = 24;
            attackCooldown = 0.8f;
        }
    }
}
