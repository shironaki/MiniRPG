using UnityEngine;

namespace ShadowAscension.Dungeon
{
    public sealed class Portal : MonoBehaviour
    {
        [SerializeField] private string nextScene = "Dungeon";
        [SerializeField] private float activationRadius = 1.5f;
        private bool active;

        public void Activate() => active = true;

        private void Update()
        {
            if (!active) return;
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player == null) return;
            if (Vector2.Distance(transform.position, player.transform.position) <= activationRadius)
                UnityEngine.SceneManagement.SceneManager.LoadScene(nextScene);
        }
    }
}
