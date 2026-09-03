using UnityEngine;
using UnityEngine.InputSystem;

namespace ShadowAscension.Input
{
    public sealed class PlayerInputRouter : MonoBehaviour
    {
        public static PlayerInputRouter Instance { get; private set; }

        [SerializeField] private float virtualDeadZone = 0.12f;
        [SerializeField] private float touchAimRadius = 1.5f;

        private Vector2 virtualMove;
        private Vector2 virtualAim;
        private bool virtualAttack;
        private bool virtualDodge;
        private readonly bool[] virtualSkills = new bool[4];

        public Vector2 Move => ReadMove();
        public Vector2 Aim => ReadAim();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
        }

        public bool ConsumeAttack()
        {
            bool pressed = virtualAttack;
            virtualAttack = false;

            Keyboard keyboard = Keyboard.current;
            Mouse mouse = Mouse.current;
            if ((keyboard != null && keyboard.jKey.wasPressedThisFrame) || (mouse != null && mouse.leftButton.wasPressedThisFrame))
                pressed = true;

            return pressed;
        }

        public bool ConsumeDodge()
        {
            bool pressed = virtualDodge;
            virtualDodge = false;

            Keyboard keyboard = Keyboard.current;
            if (keyboard != null && keyboard.spaceKey.wasPressedThisFrame)
                pressed = true;

            return pressed;
        }

        public bool ConsumeSkill(int index)
        {
            if (index < 0 || index >= virtualSkills.Length) return false;

            bool pressed = virtualSkills[index];
            virtualSkills[index] = false;

            Keyboard keyboard = Keyboard.current;
            if (keyboard == null) return pressed;

            Key key = index switch
            {
                0 => Key.Q,
                1 => Key.E,
                2 => Key.R,
                _ => Key.F
            };

            pressed |= keyboard[key].wasPressedThisFrame;
            return pressed;
        }

        public void SetVirtualMove(Vector2 value)
        {
            virtualMove = ApplyDeadZone(value);
        }

        public void SetVirtualAim(Vector2 value)
        {
            virtualAim = ApplyDeadZone(value);
        }

        public void PressAttack() => virtualAttack = true;
        public void PressDodge() => virtualDodge = true;

        public void PressSkill(int index)
        {
            if (index >= 0 && index < virtualSkills.Length)
                virtualSkills[index] = true;
        }

        private Vector2 ReadMove()
        {
            Vector2 value = virtualMove;
            Keyboard keyboard = Keyboard.current;
            if (keyboard != null)
            {
                value += Vector2.right * (keyboard.dKey.isPressed ? 1f : 0f);
                value += Vector2.left * (keyboard.aKey.isPressed ? 1f : 0f);
                value += Vector2.up * (keyboard.wKey.isPressed ? 1f : 0f);
                value += Vector2.down * (keyboard.sKey.isPressed ? 1f : 0f);
                value += Vector2.right * (keyboard.rightArrowKey.isPressed ? 1f : 0f);
                value += Vector2.left * (keyboard.leftArrowKey.isPressed ? 1f : 0f);
                value += Vector2.up * (keyboard.upArrowKey.isPressed ? 1f : 0f);
                value += Vector2.down * (keyboard.downArrowKey.isPressed ? 1f : 0f);
            }

            return value.sqrMagnitude > 1f ? value.normalized : value;
        }

        private Vector2 ReadAim()
        {
            Vector2 value = virtualAim;
            Mouse mouse = Mouse.current;
            Camera camera = Camera.main;

            if (mouse != null && camera != null)
            {
                Vector3 screen = mouse.position.ReadValue();
                screen.z = Mathf.Abs(camera.transform.position.z);
                Vector3 world = camera.ScreenToWorldPoint(screen);
                Vector2 mouseWorld = new Vector2(world.x, world.y);
                Vector2 playerPosition = transform.position;
                Vector2 mouseDirection = mouseWorld - playerPosition;
                if (mouseDirection.sqrMagnitude > touchAimRadius * touchAimRadius)
                    value = mouseDirection.normalized;
            }

            return ApplyDeadZone(value);
        }

        private Vector2 ApplyDeadZone(Vector2 value)
        {
            if (value.sqrMagnitude < virtualDeadZone * virtualDeadZone) return Vector2.zero;
            return value.sqrMagnitude > 1f ? value.normalized : value;
        }
    }
}
