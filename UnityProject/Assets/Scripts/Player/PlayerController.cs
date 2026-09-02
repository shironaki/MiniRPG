using UnityEngine;

namespace ShadowAscension.Player
{
    [RequireComponent(typeof(Rigidbody2D))]
    public sealed class PlayerController : MonoBehaviour
    {
        [SerializeField] private float moveSpeed = 5f;
        [SerializeField] private float dodgeSpeed = 12f;
        [SerializeField] private float dodgeDuration = 0.18f;

        private Rigidbody2D body;
        private Vector2 moveInput;
        private float dodgeTimer;
        private Vector2 dodgeDirection;

        private void Awake()
        {
            body = GetComponent<Rigidbody2D>();
            body.gravityScale = 0f;
            body.freezeRotation = true;
        }

        private void Update()
        {
            moveInput = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical")).normalized;

            if (Input.GetKeyDown(KeyCode.Space) && dodgeTimer <= 0f && moveInput.sqrMagnitude > 0.01f)
            {
                dodgeDirection = moveInput;
                dodgeTimer = dodgeDuration;
            }
        }

        private void FixedUpdate()
        {
            if (dodgeTimer > 0f)
            {
                body.linearVelocity = dodgeDirection * dodgeSpeed;
                dodgeTimer -= Time.fixedDeltaTime;
            }
            else
            {
                body.linearVelocity = moveInput * moveSpeed;
            }
        }
    }
}
