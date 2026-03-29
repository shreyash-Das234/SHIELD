from pathlib import Path
import json
import pickle

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import numpy as np


MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
DATASET_DIR = Path(__file__).resolve().parent / "dataset"


def load_dataset():
    dataset_file = DATASET_DIR / "traffic_samples.json"
    if dataset_file.exists():
        return json.loads(dataset_file.read_text(encoding="utf-8"))

    return [
        {"request_count": 4, "user_agent_length": 120, "path_risk": 0, "label": 0},
        {"request_count": 12, "user_agent_length": 90, "path_risk": 0, "label": 0},
        {"request_count": 75, "user_agent_length": 9, "path_risk": 1, "label": 1},
        {"request_count": 120, "user_agent_length": 4, "path_risk": 1, "label": 1},
        {"request_count": 30, "user_agent_length": 40, "path_risk": 0, "label": 0},
        {"request_count": 95, "user_agent_length": 12, "path_risk": 1, "label": 1},
    ]


def main():
    records = load_dataset()
    x = np.array(
        [[item["request_count"], item["user_agent_length"], item["path_risk"]] for item in records]
    )
    y = np.array([item["label"] for item in records])

    scaler = StandardScaler()
    x_scaled = scaler.fit_transform(x)

    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(x_scaled, y)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    with open(MODEL_DIR / "scaler.pkl", "wb") as scaler_file:
        pickle.dump(scaler, scaler_file)
    with open(MODEL_DIR / "model.pkl", "wb") as model_file:
        pickle.dump(model, model_file)

    print("Training complete. Model artifacts written to ai-engine/models")


if __name__ == "__main__":
    main()
