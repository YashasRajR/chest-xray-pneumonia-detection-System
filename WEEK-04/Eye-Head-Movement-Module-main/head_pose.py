import cv2
import mediapipe as mp
import numpy as np
import json
from datetime import datetime

# ==========================
# MEDIAPIPE FACE MESH
# ==========================

mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True
)

# ==========================
# WEBCAM
# ==========================

cap = cv2.VideoCapture(0)

# Head Pose Landmark IDs
landmark_ids = [1, 152, 33, 263, 61, 291]
frame_number = 0

while True:

    ret, frame = cap.read()

    if not ret:
        break

    frame_number += 1
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = face_mesh.process(rgb)

    if results.multi_face_landmarks:

        for face_landmarks in results.multi_face_landmarks:

            h, w, _ = frame.shape

            face_2d = []
            face_3d = []

            for idx in landmark_ids:

                landmark = face_landmarks.landmark[idx]

                x = int(landmark.x * w)
                y = int(landmark.y * h)

                # Store 2D coordinates
                face_2d.append([x, y])

                # Store 3D coordinates
                face_3d.append([
                    x,
                    y,
                    landmark.z
                ])

                # Draw landmark point
                cv2.circle(
                    frame,
                    (x, y),
                    5,
                    (0, 255, 0),
                    -1
                )

                # Draw landmark ID
                cv2.putText(
                    frame,
                    str(idx),
                    (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (255, 255, 255),
                    1
                )

            # ==========================
            # SOLVE PNP
            # ==========================

            face_2d = np.array(face_2d, dtype=np.float64)
            face_3d = np.array(face_3d, dtype=np.float64)

            focal_length = w

            cam_matrix = np.array([
                [focal_length, 0, w / 2],
                [0, focal_length, h / 2],
                [0, 0, 1]
            ])

            dist_matrix = np.zeros((4, 1), dtype=np.float64)

            success, rot_vec, trans_vec = cv2.solvePnP(
                face_3d,
                face_2d,
                cam_matrix,
                dist_matrix
            )

            if success:

                # Rotation Matrix
                rmat, jac = cv2.Rodrigues(rot_vec)

                # Extract Angles
                angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

                pitch = angles[0] * 360
                yaw = angles[1] * 360
                roll = angles[2] * 360

                # ==========================
                # HEAD DIRECTION
                # ==========================

                if yaw < -10:
                    head_direction = "LEFT"

                elif yaw > 10:
                    head_direction = "RIGHT"

                else:
                    head_direction = "CENTER"
                # ==========================
                # JSON OUTPUT
                # ==========================

                output_data = {
                    "session_id": "session_001",
                    "camera_id": "camera_001",
                    "person_id": None,
                    "timestamp": datetime.now().isoformat(),
                    "frame_number": frame_number,

                    "head_data": {
                        "head_pitch": round(pitch, 2),
                        "head_yaw": round(yaw, 2),
                        "head_roll": round(roll, 2),
                        "head_direction": head_direction
                    }
                }

                with open("head_output.json", "w") as file:
                    json.dump(output_data, file, indent=4)
                # ==========================
                # DISPLAY VALUES
                # ==========================

                cv2.putText(
                    frame,
                    f"Pitch: {pitch:.2f}",
                    (20, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 255, 0),
                    2
                )

                cv2.putText(
                    frame,
                    f"Yaw: {yaw:.2f}",
                    (20, 60),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 255, 0),
                    2
                )

                cv2.putText(
                    frame,
                    f"Roll: {roll:.2f}",
                    (20, 90),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 255, 0),
                    2
                )

                cv2.putText(
                    frame,
                    f"Direction: {head_direction}",
                    (20, 120),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 255, 255),
                    2
                )

    cv2.imshow("Head Pose Estimation", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()