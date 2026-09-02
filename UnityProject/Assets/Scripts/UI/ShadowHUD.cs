using UnityEngine;
using ShadowAscension.Player;
using ShadowAscension.Combat;

namespace ShadowAscension.UI
{
    public sealed class ShadowHUD : MonoBehaviour
    {
        [SerializeField] private PlayerStats player;
        [SerializeField] private SkillSystem skills;
        [SerializeField] private GUIStyle labelStyle;

        private void OnGUI()
        {
            if (player == null) return;
            if (labelStyle == null)
            {
                labelStyle = new GUIStyle(GUI.skin.label) { fontSize = 18 };
            }

            GUI.Box(new Rect(18, 18, 290, 105), "");
            GUI.Label(new Rect(30, 25, 260, 24), $"SHADOW ASCENSION   LV {player.Level}", labelStyle);
            GUI.Label(new Rect(30, 53, 260, 22), $"HP  {player.Health} / {player.MaxHealth}", labelStyle);
            GUI.Label(new Rect(30, 78, 260, 22), $"MP  {player.Mana} / {player.MaxMana}", labelStyle);

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
        }
    }
}
