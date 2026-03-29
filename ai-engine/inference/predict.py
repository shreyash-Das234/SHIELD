from __future__ import annotations

import pickle
import sys
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

COMMON_DIR = Path(__file__).resolve().parents[1] / "common"
if str(COMMON_DIR) not in sys.path:
    sys.path.append(str(COMMON_DIR))

from preprocessing import build_input_frame


MODEL_DIR = Path(__file__).resolve().parents[1] / "models"


class PredictionRequest(BaseModel):
    features: dict[str, Any] = Field(default_factory=dict)


def load_bundle():
    bundle_file = MODEL_DIR / "model_bundle.pkl"
    if not bundle_file.exists():
        return None

    with open(bundle_file, "rb") as handle:
        return pickle.load(handle)


bundle = load_bundle()
app = FastAPI(title="SHIELD AI Engine", version="2.0.0")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": bundle is not None,
        "winner": bundle.get("winner") if bundle else None,
    }


@app.get("/metadata")
def metadata():
    if bundle is None:
        raise HTTPException(status_code=404, detail="No trained model bundle found.")

    return {
        "winner": bundle["winner"],
        "feature_columns": bundle["feature_columns"],
        "results": bundle["results"],
        "dataset_file": bundle["dataset_file"],
    }


@app.post("/predict")
def predict(request: PredictionRequest):
    if bundle is None:
        raise HTTPException(status_code=503, detail="No trained model available. Run training first.")

    input_frame = build_input_frame([request.features], bundle["feature_columns"])
    model = bundle["model"]
    prediction = int(model.predict(input_frame)[0])

    if hasattr(model, "predict_proba"):
        probability = float(model.predict_proba(input_frame)[0][1])
    else:
        probability = float(prediction)

    if probability >= 0.85:
        threat_level = "critical"
    elif probability >= 0.65:
        threat_level = "high"
    elif probability >= 0.4:
        threat_level = "medium"
    else:
        threat_level = "low"

    return {
        "prediction": prediction,
        "probability": round(probability, 4),
        "threat_level": threat_level,
        "model": bundle["winner"],
    }
