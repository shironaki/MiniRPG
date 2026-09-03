using UnityEngine;
using UnityEngine.SceneManagement;

namespace ShadowAscension.Dungeon
{
    public sealed class Portal : MonoBehaviour
    {
        [SerializeField] private string nextScene = "Dungeon";
        [SerializeField] private float activationRadius = 1.5f;
        private bool active;
        private bool missingSceneReported;

        public void Activate() => active = true;

        private void Update()
        {
            if (!active) return;
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player == null) return;
            if (Vector2.Distance(transform.position, player.transform.position) > Mathf.Max(0.1f, activationRadius)) return;

            if (!TryLoadNextScene())
            {
                if (!missingSceneReported)
                {
                    missingSceneReported = true;
                    Debug.Log("Portal is ready, but the destination scene is not in Build Settings yet: " + nextScene);
                }
            }
        }

        private bool TryLoadNextScene()
        {
            string wanted = (nextScene ?? string.Empty).Trim();
            if (wanted.Length == 0) return false;

            for (int i = 0; i < SceneManager.sceneCountInBuildSettings; i++)
            {
                string path = SceneUtility.GetScenePathByBuildIndex(i);
                if (string.Equals(System.IO.Path.GetFileNameWithoutExtension(path), wanted, System.StringComparison.OrdinalIgnoreCase))
                {
                    SceneManager.LoadScene(i);
                    return true;
                }
            }

            return false;
        }
    }
}
