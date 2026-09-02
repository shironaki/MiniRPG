using UnityEngine;
using ShadowAscension.Combat;
using ShadowAscension.Player;

namespace ShadowAscension.Enemies
{
    [RequireComponent(typeof(Damageable))]
    public sealed class EnemyRewards : MonoBehaviour
    {
        [SerializeField] private int experience = 25;
        [SerializeField] private int gold = 10;
        [SerializeField] private int essence = 2;

        private Damageable damageable;
        private bool claimed;

        private void Awake()
        {
            damageable = GetComponent<Damageable>();
        }

        private void OnEnable()
        {
            if (damageable != null) damageable.Died += GiveRewards;
        }

        private void OnDisable()
        {
            if (damageable != null) damageable.Died -= GiveRewards;
        }

        private void GiveRewards()
        {
            if (claimed) return;
            claimed = true;

            GameObject playerObject = GameObject.FindGameObjectWithTag("Player");
            if (playerObject == null) return;
            PlayerStats player = playerObject.GetComponentInParent<PlayerStats>();
            if (player == null) return;

            player.AddExperience(experience);
            player.AddRewards(gold, essence);
            CombatFeedback.Hit(transform.position, experience, true);
        }
    }
}
