using UnityEngine;
using ShadowAscension.Input;
using ShadowAscension.Player;
using ShadowAscension.Enemies;

namespace ShadowAscension.Combat
{
    [RequireComponent(typeof(PlayerStats), typeof(PlayerInputRouter))]
    public sealed class PlayerCombat : MonoBehaviour
    {
        [Header("Basic Attack")]
        [SerializeField] private int attackDamage = 25;
        [SerializeField] private float attackRange = 1.55f;
        [SerializeField, Range(30f, 180f)] private float attackArc = 115f;
        [SerializeField] private float attackCooldown = 0.28f;

        private float nextAttackTime;
        private PlayerStats stats;
        private PlayerInputRouter input;
        private PlayerController controller;
        private Vector2 facingDirection = Vector2.down;

        public Vector2 FacingDirection => facingDirection;
        public bool IsAttacking { get; private set; }

        private void Awake()
        {
            stats = GetComponent<PlayerStats>();
            input = GetComponent<PlayerInputRouter>();
            controller = GetComponent<PlayerController>();
        }

        private void Update()
        {
            UpdateAim();
            if (input.ConsumeAttack()) Attack();
        }

        private void UpdateAim()
        {
            Vector2 aim = input.Aim;
            if (aim.sqrMagnitude > 0.04f)
                facingDirection = aim.normalized;
            else if (controller != null && controller.FacingDirection.sqrMagnitude > 0.04f)
                facingDirection = controller.FacingDirection.normalized;

            transform.up = facingDirection;
        }

        public void Attack()
        {
            if (Time.time < nextAttackTime || stats == null) return;

            nextAttackTime = Time.time + Mathf.Max(0.05f, attackCooldown);
            IsAttacking = true;
            Invoke(nameof(ClearAttackState), 0.12f);

            CombatFeedback.Slash(transform.position, facingDirection, attackRange, attackArc);

            float minDot = Mathf.Cos(attackArc * 0.5f * Mathf.Deg2Rad);
            Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, Mathf.Max(0.1f, attackRange));
            int damage = Mathf.Max(1, attackDamage + stats.Attack);

            foreach (Collider2D hit in hits)
            {
                EnemyBase enemy = hit.GetComponentInParent<EnemyBase>();
                if (enemy == null) continue;

                Vector2 toEnemy = (Vector2)enemy.transform.position - (Vector2)transform.position;
                if (toEnemy.sqrMagnitude < 0.001f || Vector2.Dot(facingDirection, toEnemy.normalized) < minDot) continue;

                Damageable target = enemy.GetComponent<Damageable>();
                if (target != null && !target.IsDead && target.TakeDamage(damage))
                    CombatFeedback.Hit(enemy.transform.position, damage);
            }
        }

        public void SetFacing(Vector2 direction)
        {
            if (direction.sqrMagnitude < 0.01f) return;
            facingDirection = direction.normalized;
        }

        private void ClearAttackState() => IsAttacking = false;

        private void OnDisable()
        {
            CancelInvoke(nameof(ClearAttackState));
            IsAttacking = false;
        }

        private void OnDrawGizmosSelected()
        {
            Gizmos.DrawWireSphere(transform.position, attackRange);
            Vector3 forward = facingDirection;
            Vector3 left = Quaternion.Euler(0f, 0f, attackArc * 0.5f) * forward;
            Vector3 right = Quaternion.Euler(0f, 0f, -attackArc * 0.5f) * forward;
            Gizmos.DrawLine(transform.position, transform.position + left * attackRange);
            Gizmos.DrawLine(transform.position, transform.position + right * attackRange);
        }
    }
}
