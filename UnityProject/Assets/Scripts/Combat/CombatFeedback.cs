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
            Destroy(go);
        }

        private IEnumerator HitRoutine(Vector2 position, int damage, bool critical)
        {
            GameObject go = new GameObject("HitFeedback");
            ParticleSystem ps = go.AddComponent<ParticleSystem>();
            var main = ps.main;
            main.loop = false;
            main.duration = 0.16f;
            main.startLifetime = 0.16f;
            main.startSpeed = critical ? 4.5f : 3.2f;
            main.startSize = critical ? 0.13f : 0.09f;
            main.maxParticles = 20;
            var emission = ps.emission;
            emission.rateOverTime = 0f;
            emission.SetBursts(new[] { new ParticleSystem.Burst(0f, critical ? 14u : 8u) });
            var shape = ps.shape;
            shape.shapeType = ParticleSystemShapeType.Circle;
            shape.radius = 0.08f;
            go.transform.position = position;
            ps.Play();

            DamageNumber number = go.AddComponent<DamageNumber>();
            number.Initialize(damage, critical);
            yield return new WaitForSeconds(0.45f);
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
