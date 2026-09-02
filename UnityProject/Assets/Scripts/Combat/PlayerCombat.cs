using UnityEngine;
using ShadowAscension.Player;
using ShadowAscension.Enemies;

namespace ShadowAscension.Combat
{
    [RequireComponent(typeof(PlayerStats))]
    public sealed class PlayerCombat : MonoBehaviour
    {
        [SerializeField] private int attackDamage = 25;
        [SerializeField] private float attackRange = 1.45f;
        [SerializeField, Range(30f, 180f)] private float attackArc = 110f;
        [SerializeField] private float attackCooldown = 0.35f;

        private float nextAttackTime;
        private PlayerStats stats;
        private PlayerController controller;
        private Vector2 facingDirection = Vector2.up;
        private Vector3 lastMousePosition;

        public Vector2 FacingDirection => facingDirection;

        private void Awake()
        {
            stats = GetComponent<PlayerStats>();
            controller = GetComponent<PlayerController>();
        }

        private void Update()
        {
            UpdateAim();
            if (Input.GetMouseButtonDown(0) || Input.GetKeyDown(KeyCode.J)) Attack();
        }

        private void UpdateAim()
        {
            bool mouseMoved = Input.mousePresent && (Input.mousePosition - lastMousePosition).sqrMagnitude > 1f;
            if (mouseMoved && Camera.main != null)
            {
                Vector3 screen = Input.mousePosition;
                screen.z = Mathf.Abs(Camera.main.transform.position.z - transform.position.z);
                Vector3 world = Camera.main.ScreenToWorldPoint(screen);
                Vector2 direction = (Vector2)(world - transform.position);
                if (direction.sqrMagnitude > 0.04f) facingDirection = direction.normalized;
                lastMousePosition = Input.mousePosition;
            }
            else if (controller != null && controller.FacingDirection.sqrMagnitude > 0.04f)
            {
                facingDirection = controller.FacingDirection;
            }

            transform.up = facingDirection;
        }

        public void Attack()
        {
            if (Time.time < nextAttackTime) return;
            nextAttackTime = Time.time + Mathf.Max(0.05f, attackCooldown);

            float halfArc = attackArc * 0.5f;
            float minDot = Mathf.Cos(halfArc * Mathf.Deg2Rad);
            Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, Mathf.Max(0.1f, attackRange));
            int damage = Mathf.Max(1, attackDamage + stats.Attack);

            foreach (Collider2D hit in hits)
            {
                EnemyBase enemy = hit.GetComponentInParent<EnemyBase>();
                if (enemy == null) continue;

                Vector2 toEnemy = (Vector2)enemy.transform.position - (Vector2)transform.position;
                if (toEnemy.sqrMagnitude < 0.001f) continue;
                if (Vector2.Dot(facingDirection, toEnemy.normalized) < minDot) continue;

                Damageable target = enemy.GetComponent<Damageable>();
                if (target != null && !target.IsDead) target.TakeDamage(damage);
            }
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
