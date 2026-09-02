using UnityEngine;

namespace ShadowAscension.Enemies
{
    public sealed class ShadowEnemy : EnemyBase
    {
        protected override void Awake()
        {
            base.Awake();
            moveSpeed = 2.2f;
            chaseRange = 8f;
            attackRange = 1.1f;
            contactDamage = 18;
            attackCooldown = 1.1f;
        }
    }
}
