using UnityEngine;

namespace ShadowAscension.Combat
{
    public sealed class DamageNumber : MonoBehaviour
    {
        private TextMesh textMesh;
        private float life = 0.42f;
        private Vector3 velocity;

        public void Initialize(int damage, bool critical)
        {
            textMesh = gameObject.AddComponent<TextMesh>();
            textMesh.text = critical ? damage + "!" : damage.ToString();
            textMesh.fontSize = critical ? 52 : 42;
            textMesh.characterSize = 0.055f;
            textMesh.anchor = TextAnchor.MiddleCenter;
            textMesh.alignment = TextAlignment.Center;
            textMesh.fontStyle = critical ? FontStyle.Bold : FontStyle.Normal;
            textMesh.color = Color.white;
            velocity = new Vector3(0f, critical ? 1.6f : 1.25f, 0f);
            transform.position += Vector3.up * 0.15f;
        }

        private void Update()
        {
            if (textMesh == null) return;
            transform.position += velocity * Time.deltaTime;
            velocity += Vector3.down * 3.2f * Time.deltaTime;
            life -= Time.deltaTime;
            Color c = textMesh.color;
            c.a = Mathf.Clamp01(life / 0.42f);
            textMesh.color = c;
            if (life <= 0f) Destroy(this);
        }
    }
}
