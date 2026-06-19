import cv2
import mediapipe as mp
import math
import time
import json
from datetime import datetime

# ======================================
# HELPER FUNCTION
# ======================================

def euclidean_distance(p1, p2):
    return math.sqrt(
        (p1[0] - p2[0]) ** 2 +
        (p1[1] - p2[1]) ** 2
    )

# ======================================
# MEDIAPIPE FACE MESH
# ======================================

mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# ======================================
# BLINK VARIABLES
# ======================================

blink_count = 0
blink_detected = False
eye_closed = False

start_time = time.time()
blink_rate = 0
frame_number = 0

# ======================================
# WEBCAM
# ======================================

cap = cv2.VideoCapture(0)

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

            # ======================================
            # LEFT EYE
            # ======================================

            left_eye_ids = [33, 133, 159, 145]
            left_iris_ids = [468, 469, 470, 471, 472]
            left_eye_points = []

            for idx in left_eye_ids:

                landmark = face_landmarks.landmark[idx]

                x = int(landmark.x * w)
                y = int(landmark.y * h)

                left_eye_points.append((x, y))

                cv2.circle(frame, (x, y), 3, (0, 255, 0), -1)

            left_eye_x = sum(p[0] for p in left_eye_points) // len(left_eye_points)
            left_eye_y = sum(p[1] for p in left_eye_points) // len(left_eye_points)

            cv2.circle(frame, (left_eye_x, left_eye_y), 5, (255, 0, 0), -1)

            # ======================================
            # LEFT IRIS
            # ======================================

            left_iris_points = []

            for idx in left_iris_ids:

                landmark = face_landmarks.landmark[idx]

                x = int(landmark.x * w)
                y = int(landmark.y * h)

                left_iris_points.append((x, y))

                cv2.circle(
                    frame,
                    (x, y),
                    2,
                    (255, 0, 255),
                    -1
                )

            left_iris_x = sum(p[0] for p in left_iris_points) // len(left_iris_points)
            left_iris_y = sum(p[1] for p in left_iris_points) // len(left_iris_points)

            cv2.circle(
                frame,
                (left_iris_x, left_iris_y),
                4,
                (0, 255, 255),
                -1
            )

            # ======================================
            # RIGHT EYE
            # ======================================

            right_eye_ids = [362, 263, 386, 374]
            right_iris_ids = [473, 474, 475, 476, 477]
            right_eye_points = []

            for idx in right_eye_ids:

                landmark = face_landmarks.landmark[idx]

                x = int(landmark.x * w)
                y = int(landmark.y * h)

                right_eye_points.append((x, y))

                cv2.circle(frame, (x, y), 3, (0, 0, 255), -1)

            right_eye_x = sum(p[0] for p in right_eye_points) // len(right_eye_points)
            right_eye_y = sum(p[1] for p in right_eye_points) // len(right_eye_points)

            cv2.circle(frame, (right_eye_x, right_eye_y), 5, (255, 0, 0), -1)

            # ======================================
            # RIGHT IRIS
            # ======================================

            right_iris_points = []

            for idx in right_iris_ids:

                landmark = face_landmarks.landmark[idx]

                x = int(landmark.x * w)
                y = int(landmark.y * h)

                right_iris_points.append((x, y))

                cv2.circle(
                    frame,
                    (x, y),
                    2,
                    (255, 0, 255),
                    -1
                )

            right_iris_x = sum(p[0] for p in right_iris_points) // len(right_iris_points)
            right_iris_y = sum(p[1] for p in right_iris_points) // len(right_iris_points)

            cv2.circle(
                frame,
                (right_iris_x, right_iris_y),
                4,
                (0, 255, 255),
                -1
            )

            # ======================================
            # GAZE COORDINATES
            # ======================================

            gaze_x = (left_iris_x + right_iris_x) // 2
            gaze_y = (left_iris_y + right_iris_y) // 2

            # ======================================
            # GAZE DIRECTION
            # ======================================

            left_eye_left_corner = left_eye_points[0][0]
            left_eye_right_corner = left_eye_points[1][0]

            eye_width = left_eye_right_corner - left_eye_left_corner

            if eye_width != 0:
                iris_position = (
                left_iris_x - left_eye_left_corner
                ) / eye_width
            else:
                iris_position = 0.5

            if iris_position < 0.40:
                gaze_direction = "LEFT"

            elif iris_position > 0.60:
                gaze_direction = "RIGHT"

            else:
                gaze_direction = "CENTER"

            # ======================================
            # LEFT EYE EAR
            # ======================================

            left_horizontal = euclidean_distance(
                left_eye_points[0],
                left_eye_points[1]
            )

            left_vertical = euclidean_distance(
                left_eye_points[2],
                left_eye_points[3]
            )

            left_ear = left_vertical / left_horizontal

            # ======================================
            # RIGHT EYE EAR
            # ======================================

            right_horizontal = euclidean_distance(
                right_eye_points[0],
                right_eye_points[1]
            )

            right_vertical = euclidean_distance(
                right_eye_points[2],
                right_eye_points[3]
            )

            right_ear = right_vertical / right_horizontal

            eye_open_right = right_ear >= 0.15

            # ======================================
            # BLINK DETECTION
            # ======================================

            if left_ear < 0.15:

                blink_detected = True

                if not eye_closed:
                    blink_count += 1
                    eye_closed = True

            else:

                blink_detected = False
                eye_closed = False

            # ======================================
            # BLINK RATE
            # ======================================

            elapsed_time = time.time() - start_time

            if elapsed_time > 0:
                blink_rate = round(
                    blink_count / (elapsed_time / 60),
                    2
                )

            # ======================================
            # EYE OPEN STATUS
            # ======================================

            eye_open_left = left_ear >= 0.15

            # ======================================
            # JSON OUTPUT
            # ======================================

            eye_output = {
                "session_id": "session_001",
                "camera_id": "camera_001",
                "person_id": None,
                "timestamp": datetime.now().isoformat(),
                "frame_number": frame_number,

                "eye_data": {
                    "left_eye_x": left_eye_x,
                    "left_eye_y": left_eye_y,
                    "right_eye_x": right_eye_x,
                    "right_eye_y": right_eye_y,

                    "gaze_x": gaze_x,
                    "gaze_y": gaze_y,
                    "gaze_direction": gaze_direction,

                    "blink_detected": blink_detected,
                    "blink_count": blink_count,
                    "blink_rate": blink_rate,

                    "eye_open_left": eye_open_left,
                    "eye_open_right": eye_open_right
                }
            }

            with open("eye_output.json", "w") as file:
                json.dump(eye_output, file, indent=4)

            # ======================================
            # DISPLAY TEXT
            # ======================================

            cv2.putText(
                frame,
                f"L Eye: ({left_eye_x}, {left_eye_y})",
                (20, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                2
            )

            cv2.putText(
                frame,
                f"R Eye: ({right_eye_x}, {right_eye_y})",
                (20, 60),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                2
            )

            cv2.putText(
                frame,
                f"EAR: {left_ear:.2f}",
                (20, 90),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 255),
                2
            )

            cv2.putText(
                frame,
                f"Blinks: {blink_count}",
                (20, 120),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"Blink: {blink_detected}",
                (20, 150),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"Left Eye Open: {eye_open_left}",
                (20, 180),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"Right Eye Open: {eye_open_right}",
                (20, 210),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 0),
                2
            )

            cv2.putText(
                frame,
                f"Gaze: {gaze_direction}",
                (20, 270),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 0, 255),
                2
            )

            cv2.putText(
                frame,
                f"Gaze X: {gaze_x}",
                (20, 300),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 0, 255),
                2
            )

            cv2.putText(
                frame,
                f"Gaze Y: {gaze_y}",
                (20, 330),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 0, 255),
                2
            )

            cv2.putText(
                frame,
                f"Blink Rate: {blink_rate:.2f}/min",
                (20, 240),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 255),
                2
            )

    cv2.imshow("Eye Tracking Module", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()