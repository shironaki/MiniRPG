using UnityEngine;
using ShadowAscension.Input;

namespace ShadowAscension.Player
{
    [RequireComponent(typeof(Rigidbody2D), typeof(PlayerInputRouter))]
    public sealed class PlayerController : MonoBehaviour
    {
        [Header("Movement")]
        [SerializeField] private float moveSpeed = 5.8f;
        [SerializeField] private float acceleration = 38f;
        [SerializeField] private float deceleration = 48f;

        [Header("Dodge")]
        [SerializeField] private float dodgeSpeed = 14f;
        [SerializeField] private float dodgeDuration = 0.16f;
        [SerializeField] private float dodgeCooldown = 0.55f;

        private Rigidbody2D body;
        private PlayerInputRouter input;
        private Vector2 moveInput;
        private Vector2 facingDirection = Vector2.down;
        private Vector2 dodgeDirection;
        private float dodgeTimer;
        private float nextDodgeTime;

        public Vector2 MoveInput => moveInput;
        public Vector2 FacingDirection => facingDirection;
        public bool IsDodging => dodgeTimer > 0f;

        private void Awake()
        {
            body = GetComponent<Rigidbody2D>();
            input = GetComponent<PlayerInputRouter>();

            body.gravityScale = 0f;
            body.freezeRotation = true;
            body.interpolation = RigidbodyInterpolation2D.Interpolate;
            body.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
        }

        private void Update()
        {
            moveInput = input.Move;
            if (moveInput.sqrMagnitude > 0.01f)
                facingDirection = moveInput.normalized;

            if (!IsDodging && Time.time >= nextDodgeTime && input.ConsumeDodge())
            {
                Vector2 direction = moveInput.sqrMagnitude > 0.01f ? moveInput.normalized : facingDirection;
                BeginDodge(direction);
            }
        }

        private void FixedUpdate()
        {
            if (dodgeTimer > 0f)
            {
                body.linearVelocity = dodgeDirection * dodgeSpeed;
                dodgeTimer -= Time.fixedDeltaTime;
                if (dodgeTimer <= 0f)
                {
                    dodgeTimer = 0f;
                    body.linearVelocity = Vector2.zero;
                }
                return;
            }

            Vector2 targetVelocity = moveInput * moveSpeed;
            float rate = targetVelocity.sqrMagnitude > body.linearVelocity.sqrMagnitude ? acceleration : deceleration;
            body.linearVelocity = Vector2.MoveTowards(body.linearVelocity, targetVelocity, rate * Time.fixedDeltaTime);
        }

        private void BeginDodge(Vector2 direction)
        {
            dodgeDirection = direction.sqrMagnitude > 0.001f ? direction.normalized : Vector2.down;
            facingDirection = dodgeDirection;
            dodgeTimer = dodgeDuration;
            nextDodgeTime = Time.time + dodgeCooldown;
        }
    }
}
