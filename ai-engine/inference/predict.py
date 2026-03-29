from pathlib import Path
import pickle

from fastapi import FastAPI
from pydantic import BaseModel


MODEL_DIR = Path(__file__).resolve().parents[1] / "models"


class TrafficFeatures(BaseModel):
    request_count: int
    user_agent_length: int
    path_risk: int


def load_artifacts():
    if not (MODEL_DIR / "scaler.pkl").exists() or not (MODEL_DIR / "model.pkl").exists():
        return None, None

    with open(MODEL_DIR / "scaler.pkl", "rb") as scaler_file:
        scaler = pickle.load(scaler_file)
    with open(MODEL_DIR / "model.pkl", "rb") as model_file:
        model = pickle.load(model_file)
    return scaler, model


scaler, model = load_artifacts()
app = FastAPI(title="SHIELD AI Engine", version="1.0.0")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(features: TrafficFeatures):
    if scaler is None or model is None:
        score = min(
            1.0,
            (features.request_count / 120)
            + (0.25 if features.user_agent_length < 10 else 0.0)
            + (0.25 if features.path_risk else 0.0),
        )
        prediction = int(score >= 0.6)
        probability = score
    else:
        vector = [[features.request_count, features.user_agent_length, features.path_risk]]
        scaled = scaler.transform(vector)
        prediction = int(model.predict(scaled)[0])
        probability = float(model.predict_proba(scaled)[0][1])

    return {
        "prediction": prediction,
        "probability": round(probability, 4),
        "threat_level": "high" if probability >= 0.6 else "low",
    }
