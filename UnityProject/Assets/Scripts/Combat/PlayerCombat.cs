using UnityEngine;
using ShadowAscension.Player;

namespace ShadowAscension.Combat
{
    [RequireComponent(typeof(PlayerStats))]
    public sealed class PlayerCombat : MonoBehaviour
    {
        [SerializeField] private int attackDamage = 25;
        [SerializeField] private float attackRange = 1.35f;
        [SerializeField] private float attackCooldown = 0.35f;
        [SerializeField] private LayerMask enemyMask;

        private float nextAttackTime;
        private PlayerStats stats;

        private void Awake() => stats = GetComponent<PlayerStats>();

        private void Update()
        {
            if (Input.GetMouseButtonDown(0) || Input.GetKeyDown(KeyCode.J)) Attack();
        }

        public void Attack()
        {
            if (Time.time < nextAttackTime) return;
            nextAttackTime = Time.time + attackCooldown;

            Vector2 center = transform.position;
            Collider2D[] hits = Physics2D.OverlapCircleAll(center, attackRange, enemyMask);
            int damage = Mathf.Max(1, attackDamage + stats.Attack);

            foreach (Collider2D hit in hits)
            {
                Damageable target = hit.GetComponentInParent<Damageable>();
                if (target != null && !target.IsDead) target.TakeDamage(damage);
            }
        }

        private void OnDrawGizmosSelected()
        {
            Gizmos.DrawWireSphere(transform.position, attackRange);
        }
    }
}
