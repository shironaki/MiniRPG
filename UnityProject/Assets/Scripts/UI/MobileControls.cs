using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem.UI;
using UnityEngine.UI;
using ShadowAscension.Input;

namespace ShadowAscension.UI
{
    public sealed class MobileControls : MonoBehaviour
    {
        [SerializeField] private bool showInEditor = true;
        [SerializeField] private float joystickRadius = 90f;

        private PlayerInputRouter input;

        private void Start()
        {
            input = FindFirstObjectByType<PlayerInputRouter>();
            if (input == null || (!Application.isMobilePlatform && !showInEditor)) return;
            Build();
        }

        private void Build()
        {
            Canvas canvas = GetComponentInChildren<Canvas>();
            if (canvas == null)
            {
                GameObject canvasObject = new GameObject("Touch Canvas");
                canvasObject.transform.SetParent(transform, false);
                canvas = canvasObject.AddComponent<Canvas>();
                canvas.renderMode = RenderMode.ScreenSpaceOverlay;
                CanvasScaler scaler = canvasObject.AddComponent<CanvasScaler>();
                scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
                scaler.referenceResolution = new Vector2(1920f, 1080f);
                scaler.matchWidthOrHeight = 0.5f;
                canvasObject.AddComponent<GraphicRaycaster>();
            }

            if (FindFirstObjectByType<EventSystem>() == null)
            {
                GameObject events = new GameObject("EventSystem");
                events.AddComponent<EventSystem>();
                events.AddComponent<InputSystemUIInputModule>();
            }

            CreateStick(canvas.transform, "Move Stick", new Vector2(150f, 145f));
            CreateStick(canvas.transform, "Aim Stick", new Vector2(-150f, 145f), true);
            CreateButton(canvas.transform, "ATTACK", new Vector2(-155f, 80f), new Vector2(120f, 120f), input.PressAttack);
            CreateButton(canvas.transform, "DODGE", new Vector2(-310f, 155f), new Vector2(86f, 86f), input.PressDodge);

            string[] skillNames = { "Q", "E", "R", "F" };
            for (int i = 0; i < skillNames.Length; i++)
            {
                int index = i;
                CreateButton(canvas.transform, skillNames[i], new Vector2(-80f - i * 95f, -80f), new Vector2(72f, 72f), () => input.PressSkill(index));
            }
        }

        private void CreateStick(Transform parent, string name, Vector2 anchoredPosition, bool right = false)
        {
            GameObject root = new GameObject(name, typeof(RectTransform), typeof(Image));
            root.transform.SetParent(parent, false);
            RectTransform rect = root.GetComponent<RectTransform>();
            rect.sizeDelta = new Vector2(180f, 180f);
            rect.anchorMin = rect.anchorMax = right ? new Vector2(1f, 0f) : Vector2.zero;
            rect.anchoredPosition = anchoredPosition;
            root.GetComponent<Image>().color = new Color(0.2f, 0.08f, 0.35f, 0.28f);
            StickHandler handler = root.AddComponent<StickHandler>();
            handler.Configure(input, right, joystickRadius);
        }

        private void CreateButton(Transform parent, string label, Vector2 position, Vector2 size, UnityEngine.Events.UnityAction action)
        {
            GameObject root = new GameObject(label, typeof(RectTransform), typeof(Image), typeof(Button));
            root.transform.SetParent(parent, false);
            RectTransform rect = root.GetComponent<RectTransform>();
            rect.sizeDelta = size;
            rect.anchorMin = rect.anchorMax = new Vector2(1f, 0f);
            rect.anchoredPosition = position;
            root.GetComponent<Image>().color = new Color(0.22f, 0.08f, 0.38f, 0.55f);
            root.GetComponent<Button>().onClick.AddListener(action);

            GameObject textObject = new GameObject("Label", typeof(RectTransform), typeof(Text));
            textObject.transform.SetParent(root.transform, false);
            RectTransform textRect = textObject.GetComponent<RectTransform>();
            textRect.anchorMin = Vector2.zero;
            textRect.anchorMax = Vector2.one;
            textRect.offsetMin = Vector2.zero;
            textRect.offsetMax = Vector2.zero;
            Text text = textObject.GetComponent<Text>();
            text.text = label;
            text.alignment = TextAnchor.MiddleCenter;
            text.fontSize = Mathf.RoundToInt(size.x * 0.22f);
            text.color = Color.white;
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        }

        private sealed class StickHandler : MonoBehaviour, IPointerDownHandler, IDragHandler, IPointerUpHandler
        {
            private PlayerInputRouter input;
            private bool aim;
            private float radius;
            private RectTransform rect;

            public void Configure(PlayerInputRouter router, bool aimStick, float stickRadius)
            {
                input = router;
                aim = aimStick;
                radius = stickRadius;
                rect = transform as RectTransform;
            }

            public void OnPointerDown(PointerEventData eventData) => UpdateValue(eventData);
            public void OnDrag(PointerEventData eventData) => UpdateValue(eventData);

            public void OnPointerUp(PointerEventData eventData)
            {
                if (input == null) return;
                if (aim) input.SetVirtualAim(Vector2.zero); else input.SetVirtualMove(Vector2.zero);
            }

            private void UpdateValue(PointerEventData eventData)
            {
                if (input == null || rect == null) return;
                RectTransformUtility.ScreenPointToLocalPointInRectangle(rect, eventData.position, eventData.pressEventCamera, out Vector2 local);
                Vector2 value = Vector2.ClampMagnitude(local / Mathf.Max(1f, radius), 1f);
                if (aim) input.SetVirtualAim(value); else input.SetVirtualMove(value);
            }
        }
    }
}
