Create a Unity movement script for VRPark Y1 Mobile VR Controller integration with the following specifications:

Input Configuration:

- Controller: VRPark Y1 with GCVR input mapping
- Primary analog stick axes: "Horizontal" and "Vertical"
- Interaction buttons: A (Pick), B (Use), C (Menu), D (Secondary)
- Haptic feedback intensity range: 0-255

Movement System Requirements:

- Physics-based locomotion using CharacterController
- World-space movement aligned with VR camera forward direction
- Movement speeds:
  - Walk: 5 units/second (analog < 0.8)
  - Run: 10 units/second (analog >= 0.8)
- Input processing:
  - Deadzone: 0.1 for analog stick
  - Input smoothing: 0.05 seconds
  - Turn smoothing: 0.1 seconds
  - Frame-rate independent movement calculations

Required Unity Components:

```csharp
[RequireComponent(typeof(CharacterController))]
public class VRParkMovement : MonoBehaviour
{
    [Header("Movement Settings")]
    [SerializeField] private float walkSpeed = 5f;
    [SerializeField] private float runSpeedMultiplier = 2f;
    [SerializeField] private float turnSmoothTime = 0.1f;
    [SerializeField] private float inputSmoothTime = 0.05f;
    [SerializeField] private float analogDeadzone = 0.1f;

    [Header("References")]
    [SerializeField] private Transform cameraTransform;
    [SerializeField] private GCVRInputManager inputManager;
}
```

Physics Layer Configuration:

- Layer 8: Player
- Layer 9: Interactable
- Layer 10: Environment
- Layer collision matrix: Player collides with Environment only

Animation States:

1. Idle (default)
2. Walk_Forward
3. Walk_Backward
4. Walk_Strafe
5. Run_Forward
6. Run_Backward
7. Run_Strafe

Performance Requirements:

- Maintain consistent 90 FPS
- Implement frame budgeting
- Handle controller disconnection gracefully
- Support VR comfort options (vignetting, snap turn)

Error Handling:

- Validate controller connection status
- Implement input fallback for disconnection
- Log movement state transitions
- Monitor frame timing

Documentation Reference:

- GCVR SDK Version: Latest stable
- Unity Input System package: 1.5 or higher
- Android/iOS minimum specifications
