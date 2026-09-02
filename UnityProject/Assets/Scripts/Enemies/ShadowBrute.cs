using UnityEngine;

namespace ShadowAscension.Enemies
{
    public sealed class ShadowBrute : EnemyBase
    {
        protected override void Awake()
        {
            base.Awake();
            moveSpeed = 1.35f;
            chaseRange = 6f;
            attackRange = 1.25f;
            contactDamage = 32;
            attackCooldown = 1.6f;
        }
    }
}
