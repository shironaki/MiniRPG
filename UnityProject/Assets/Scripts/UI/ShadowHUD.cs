using UnityEngine;
using UnityEngine.UI;
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

        private Text statsText;
        private Text bossText;
        private Text bossStateText;
        private Image bossFill;
        private readonly Text[] skillTexts = new Text[4];
        private readonly string[] skillIds = { "ShadowSlash", "ShadowBurst", "ShadowArrow", "Ascension" };
        private readonly string[] skillKeys = { "Q", "E", "R", "F" };

        private void Start()
        {
            if (player == null) player = FindFirstObjectByType<PlayerStats>();
            if (skills == null) skills = FindFirstObjectByType<SkillSystem>();
            Build();
        }

        private void Update()
        {
            if (statsText != null && player != null)
                statsText.text = $"SHADOW ASCENSION\nLV {player.Level}    HP {player.Health}/{player.MaxHealth}    MP {player.Mana}/{player.MaxMana}\nXP {player.Experience}/{player.ExperienceToNextLevel}    GOLD {player.Gold}    ESSENCE {player.Essence}";

            if (skills != null)
                for (int i = 0; i < skillTexts.Length; i++)
                {
                    if (skillTexts[i] == null) continue;
                    float cd = skills.GetRemainingCooldown(skillIds[i]);
                    skillTexts[i].text = cd > 0f ? $"{skillKeys[i]}\n{cd:0.0}" : skillKeys[i];
                }

            if (boss != null && bossFill != null)
            {
                float ratio = boss.MaxHealth > 0 ? Mathf.Clamp01((float)boss.CurrentHealth / boss.MaxHealth) : 0f;
                bossFill.fillAmount = ratio;
                bossText.text = $"DARK KNIGHT   {boss.CurrentHealth}/{boss.MaxHealth}";
                BossController controller = boss.GetComponent<BossController>();
                bossStateText.text = controller != null && controller.PhaseTwo ? "ENRAGED" : string.Empty;
                if (boss.IsDead) bossText.text = "DARK KNIGHT DEFEATED";
            }
        }

        private void Build()
        {
            Canvas canvas = GetComponentInChildren<Canvas>();
            if (canvas == null)
            {
                GameObject canvasObject = new GameObject("HUD Canvas");
                canvasObject.transform.SetParent(transform, false);
                canvas = canvasObject.AddComponent<Canvas>();
                canvas.renderMode = RenderMode.ScreenSpaceOverlay;
                CanvasScaler scaler = canvasObject.AddComponent<CanvasScaler>();
                scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
                scaler.referenceResolution = new Vector2(1920f, 1080f);
                scaler.matchWidthOrHeight = 0.5f;
                canvasObject.AddComponent<GraphicRaycaster>();
            }

            CreateStats(canvas.transform);
            CreateSkills(canvas.transform);
            CreateBoss(canvas.transform);
        }

        private void CreateStats(Transform parent)
        {
            statsText = CreateText(parent, "Stats", new Vector2(28f, -28f), new Vector2(620f, 95f), 24, TextAnchor.UpperLeft);
        }

        private void CreateSkills(Transform parent)
        {
            for (int i = 0; i < skillTexts.Length; i++)
            {
                GameObject box = new GameObject("Skill_" + skillKeys[i], typeof(RectTransform), typeof(Image));
                box.transform.SetParent(parent, false);
                RectTransform rect = box.GetComponent<RectTransform>();
                rect.anchorMin = rect.anchorMax = new Vector2(1f, 0f);
                rect.sizeDelta = new Vector2(78f, 78f);
                rect.anchoredPosition = new Vector2(-35f - i * 88f, 35f);
                box.GetComponent<Image>().color = new Color(0.18f, 0.06f, 0.3f, 0.85f);
                skillTexts[i] = CreateText(box.transform, "Label", Vector2.zero, Vector2.zero, 24, TextAnchor.MiddleCenter);
            }
        }

        private void CreateBoss(Transform parent)
        {
            if (boss == null) return;
            GameObject root = new GameObject("Boss Bar", typeof(RectTransform));
            root.transform.SetParent(parent, false);
            RectTransform rootRect = root.GetComponent<RectTransform>();
            rootRect.anchorMin = rootRect.anchorMax = new Vector2(0.5f, 1f);
            rootRect.anchoredPosition = new Vector2(0f, -78f);
            rootRect.sizeDelta = new Vector2(700f, 64f);

            GameObject back = new GameObject("Background", typeof(RectTransform), typeof(Image));
            back.transform.SetParent(root.transform, false);
            RectTransform backRect = back.GetComponent<RectTransform>();
            backRect.anchorMin = Vector2.zero; backRect.anchorMax = Vector2.one; backRect.offsetMin = Vector2.zero; backRect.offsetMax = Vector2.zero;
            back.GetComponent<Image>().color = new Color(0.02f, 0.01f, 0.04f, 0.92f);

            GameObject fill = new GameObject("Fill", typeof(RectTransform), typeof(Image));
            fill.transform.SetParent(back.transform, false);
            RectTransform fillRect = fill.GetComponent<RectTransform>();
            fillRect.anchorMin = Vector2.zero; fillRect.anchorMax = Vector2.one; fillRect.offsetMin = new Vector2(4f, 4f); fillRect.offsetMax = new Vector2(-4f, -4f);
            bossFill = fill.GetComponent<Image>();
            bossFill.color = new Color(0.48f, 0.08f, 0.68f, 1f);
            bossFill.type = Image.Type.Filled;
            bossFill.fillMethod = Image.FillMethod.Horizontal;
            bossFill.fillOrigin = 0;
            bossFill.fillAmount = 1f;

            bossText = CreateText(root.transform, "Boss Name", new Vector2(0f, 13f), new Vector2(680f, 28f), 20, TextAnchor.MiddleCenter);
            bossStateText = CreateText(root.transform, "Boss State", new Vector2(0f, -18f), new Vector2(680f, 22f), 16, TextAnchor.MiddleCenter);
        }

        private static Text CreateText(Transform parent, string name, Vector2 position, Vector2 size, int fontSize, TextAnchor alignment)
        {
            GameObject go = new GameObject(name, typeof(RectTransform), typeof(Text));
            go.transform.SetParent(parent, false);
            RectTransform rect = go.GetComponent<RectTransform>();
            rect.anchorMin = rect.anchorMax = new Vector2(0f, 1f);
            rect.anchoredPosition = position;
            rect.sizeDelta = size == Vector2.zero ? new Vector2(78f, 78f) : size;
            Text text = go.GetComponent<Text>();
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            text.fontSize = fontSize;
            text.alignment = alignment;
            text.color = Color.white;
            text.raycastTarget = false;
            return text;
        }
    }
}
