using UnityEngine;
using ShadowAscension.Player;
using ShadowAscension.Combat;
using ShadowAscension.Enemies;

namespace ShadowAscension.UI
{
    public sealed class ShadowHUD : MonoBehaviour
    {
        [SerializeField] private PlayerStats player;
        [SerializeField] private SkillSystem skills;
        [SerializeField] private Damageable boss;
        [SerializeField] private GUIStyle labelStyle;

        private void OnGUI()
        {
            if (player == null) return;
            if (labelStyle == null)
                labelStyle = new GUIStyle(GUI.skin.label) { fontSize = 18 };

            GUI.Box(new Rect(18, 18, 300, 125), "");
            GUI.Label(new Rect(30, 25, 275, 24), $"SHADOW ASCENSION   LV {player.Level}", labelStyle);
            GUI.Label(new Rect(30, 53, 275, 22), $"HP  {player.Health} / {player.MaxHealth}", labelStyle);
            GUI.Label(new Rect(30, 78, 275, 22), $"MP  {player.Mana} / {player.MaxMana}", labelStyle);
            GUI.Label(new Rect(30, 103, 275, 22), $"XP  {player.Experience} / {player.ExperienceToNextLevel}   G {player.Gold}   E {player.Essence}", labelStyle);

            if (skills != null)
            {
                string[] ids = { "ShadowSlash", "ShadowBurst", "ShadowArrow", "Ascension" };
                string[] keys = { "Q", "E", "R", "F" };
                for (int i = 0; i < ids.Length; i++)
                {
                    float cd = skills.GetRemainingCooldown(ids[i]);
                    GUI.Box(new Rect(Screen.width - 290 + i * 65, Screen.height - 82, 58, 58), cd > 0f ? cd.ToString("0.0") : keys[i]);
                }
            }

            DrawBossBar();
        }

        private void DrawBossBar()
        {
            if (boss == null || boss.IsDead) return;

            float width = Mathf.Min(620f, Screen.width * 0.62f);
            float height = 26f;
            float x = (Screen.width - width) * 0.5f;
            float y = 22f;
            float ratio = boss.MaxHealth > 0 ? Mathf.Clamp01((float)boss.CurrentHealth / boss.MaxHealth) : 0f;

            GUI.Box(new Rect(x - 4f, y - 4f, width + 8f, height + 8f), "");
            GUI.HorizontalScrollbar(new Rect(x, y, width, height), 0f, ratio, 0f, 1f);
            GUI.Label(new Rect(x, y - 25f, width, 22f), "DARK KNIGHT", labelStyle);
            GUI.Label(new Rect(x, y + 3f, width, 20f), $"{boss.CurrentHealth} / {boss.MaxHealth}", labelStyle);

            BossController controller = boss.GetComponent<BossController>();
            if (controller != null && controller.PhaseTwo)
                GUI.Label(new Rect(x + width - 125f, y - 25f, 125f, 22f), "ENRAGED", labelStyle);
        }
    }
}
