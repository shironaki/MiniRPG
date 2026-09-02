using UnityEngine;
using ShadowAscension.Combat;

namespace ShadowAscension.Enemies
{
    [RequireComponent(typeof(Rigidbody2D), typeof(Damageable))]
    public class EnemyBase : MonoBehaviour
    {
        [SerializeField] protected float moveSpeed = 2f;
        [SerializeField] protected float chaseRange = 7f;
        [SerializeField] protected float attackRange = 1.1f;
        [SerializeField] protected int contactDamage = 10;
        [SerializeField] protected float attackCooldown = 1.2f;

        protected Rigidbody2D Body;
        protected Damageable Health;
        protected Transform Target;
        private float nextAttackTime;

        protected virtual void Awake()
        {
            Body = GetComponent<Rigidbody2D>();
            Health = GetComponent<Damageable>();
            Body.gravityScale = 0f;
            Body.freezeRotation = true;
        }

        protected virtual void Start()
        {
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player != null) Target = player.transform;
        }

        protected virtual void FixedUpdate()
        {
            if (Target == null || Health.IsDead)
            {
                Body.linearVelocity = Vector2.zero;
                return;
            }

            Vector2 delta = (Vector2)Target.position - Body.position;
            float distance = delta.magnitude;

            if (distance > chaseRange)
            {
                Body.linearVelocity = Vector2.zero;
                return;
            }

            if (distance > attackRange)
            {
                Body.linearVelocity = delta.normalized * moveSpeed;
            }
            else
            {
                Body.linearVelocity = Vector2.zero;
                TryAttack();
            }
        }

        protected virtual void TryAttack()
        {
            if (Time.time < nextAttackTime) return;
            nextAttackTime = Time.time + attackCooldown;
            Damageable targetHealth = Target != null ? Target.GetComponentInParent<Damageable>() : null;
            if (targetHealth != null) targetHealth.TakeDamage(contactDamage);
        }

        protected virtual void OnDeath()
        {
            Body.linearVelocity = Vector2.zero;
            Destroy(gameObject, 0.05f);
        }
    }
}
