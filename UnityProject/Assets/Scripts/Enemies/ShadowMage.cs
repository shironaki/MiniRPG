using UnityEngine;

namespace ShadowAscension.Enemies
{
    public sealed class ShadowMage : EnemyBase
    {
        [SerializeField] private float preferredRange = 4.5f;

        protected override void Awake()
        {
            base.Awake();
            moveSpeed = 1.7f;
            chaseRange = 11f;
            attackRange = preferredRange;
            contactDamage = 36;
            attackCooldown = 1.8f;
        }
    }
}
