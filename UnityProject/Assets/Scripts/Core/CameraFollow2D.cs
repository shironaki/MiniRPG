using UnityEngine;

namespace ShadowAscension.Core
{
    public sealed class CameraFollow2D : MonoBehaviour
    {
        [SerializeField] private Transform target;
        [SerializeField] private float smoothTime = 0.12f;
        [SerializeField] private Vector2 minBounds = new Vector2(0f, 0.5f);
        [SerializeField] private Vector2 maxBounds = new Vector2(0f, 0.5f);

        private Vector3 velocity;

        public void SetTarget(Transform newTarget) => target = newTarget;

        private void LateUpdate()
        {
            if (target == null) return;

            Vector3 desired = new Vector3(target.position.x, target.position.y, transform.position.z);
            Vector3 next = Vector3.SmoothDamp(transform.position, desired, ref velocity, Mathf.Max(0.01f, smoothTime));
            next.x = Mathf.Clamp(next.x, minBounds.x, maxBounds.x);
            next.y = Mathf.Clamp(next.y, minBounds.y, maxBounds.y);
            transform.position = next;
        }
    }
}
