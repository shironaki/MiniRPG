using UnityEngine;

namespace ShadowAscension.Player
{
    [RequireComponent(typeof(SpriteRenderer))]
    public sealed class CharacterVisualController : MonoBehaviour
    {
        [SerializeField] private float idleBobAmplitude = 0.035f;
        [SerializeField] private float idleBobSpeed = 2.2f;
        [SerializeField] private float moveBobAmplitude = 0.055f;
        [SerializeField] private float moveBobSpeed = 10f;
        [SerializeField] private float attackScale = 1.08f;

        private SpriteRenderer spriteRenderer;
        private PlayerController controller;
        private Combat.PlayerCombat combat;
        private Vector3 baseScale;
        private Vector3 baseLocalPosition;

        private void Awake()
        {
            spriteRenderer = GetComponent<SpriteRenderer>();
            controller = GetComponent<PlayerController>();
            combat = GetComponent<Combat.PlayerCombat>();
            baseScale = transform.localScale;
            baseLocalPosition = transform.localPosition;
        }

        private void LateUpdate()
        {
            Vector2 movement = controller != null ? controller.MoveInput : Vector2.zero;
            bool moving = movement.sqrMagnitude > 0.01f;
            float speed = moving ? moveBobSpeed : idleBobSpeed;
            float amplitude = moving ? moveBobAmplitude : idleBobAmplitude;
            float bob = Mathf.Sin(Time.time * speed) * amplitude;

            transform.localPosition = baseLocalPosition + Vector3.up * bob;
            float attackPulse = combat != null && combat.IsAttacking ? attackScale : 1f;
            transform.localScale = Vector3.Lerp(transform.localScale, baseScale * attackPulse, Time.deltaTime * 20f);

            if (controller != null && controller.FacingDirection.x != 0f)
                spriteRenderer.flipX = controller.FacingDirection.x < 0f;
        }
    }
}
