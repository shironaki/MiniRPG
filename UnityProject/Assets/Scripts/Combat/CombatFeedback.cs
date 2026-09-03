using System.Collections;
using UnityEngine;

namespace ShadowAscension.Combat
{
    public sealed class CombatFeedback : MonoBehaviour
    {
        private static CombatFeedback instance;

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                return;
            }
            instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public static void Slash(Vector2 origin, Vector2 direction, float radius, float arcDegrees)
        {
            EnsureInstance();
            if (instance == null) return;
            instance.StartCoroutine(instance.SlashRoutine(origin, direction, radius, arcDegrees));
        }

        public static void Hit(Vector2 position, int damage, bool critical = false)
        {
            EnsureInstance();
            if (instance == null) return;
            instance.StartCoroutine(instance.HitRoutine(position, damage, critical));
        }

        private IEnumerator SlashRoutine(Vector2 origin, Vector2 direction, float radius, float arcDegrees)
        {
            GameObject go = new GameObject("CombatSlashVFX");
            LineRenderer line = go.AddComponent<LineRenderer>();
            line.positionCount = 15;
            line.useWorldSpace = true;
            line.widthMultiplier = 0.075f;
            line.numCapVertices = 2;
            line.numCornerVertices = 2;

            Vector2 forward = direction.sqrMagnitude > 0.01f ? direction.normalized : Vector2.up;
            float start = -arcDegrees * 0.5f;
            for (int i = 0; i < line.positionCount; i++)
            {
                float angle = (start + arcDegrees * i / (line.positionCount - 1)) * Mathf.Deg2Rad;
                Vector2 dir = new Vector2(
                    forward.x * Mathf.Cos(angle) - forward.y * Mathf.Sin(angle),
                    forward.x * Mathf.Sin(angle) + forward.y * Mathf.Cos(angle));
                line.SetPosition(i, origin + dir * radius);
            }

            yield return new WaitForSeconds(0.09f);
            if (go != null) Destroy(go);
        }

        private IEnumerator HitRoutine(Vector2 position, int damage, bool critical)
        {
            // Deliberately avoid runtime ParticleSystem creation here. Unity 6 can
            // start a newly added particle system before its main module is configured,
            // which produces the duration-while-playing warning on some editor builds.
            GameObject go = new GameObject("HitFeedback");
            int rayCount = critical ? 10 : 7;
            float length = critical ? 0.62f : 0.42f;

            for (int i = 0; i < rayCount; i++)
            {
                LineRenderer ray = go.AddComponent<LineRenderer>();
                ray.positionCount = 2;
                ray.useWorldSpace = true;
                ray.widthMultiplier = critical ? 0.055f : 0.04f;
                ray.numCapVertices = 2;
                float angle = (360f * i / rayCount) * Mathf.Deg2Rad;
                Vector2 direction = new Vector2(Mathf.Cos(angle), Mathf.Sin(angle));
                ray.SetPosition(0, position);
                ray.SetPosition(1, position + direction * length);
            }

            DamageNumber number = go.AddComponent<DamageNumber>();
            number.Initialize(damage, critical);

            yield return new WaitForSeconds(0.16f);
            if (go != null) Destroy(go);
        }

        private static void EnsureInstance()
        {
            if (instance != null) return;
            GameObject go = new GameObject("CombatFeedback");
            instance = go.AddComponent<CombatFeedback>();
        }
    }
}
