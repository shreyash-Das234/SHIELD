from __future__ import annotations

import json
import pickle
import sys
from pathlib import Path

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

COMMON_DIR = Path(__file__).resolve().parents[1] / "common"
if str(COMMON_DIR) not in sys.path:
    sys.path.append(str(COMMON_DIR))

from preprocessing import TARGET_COLUMN, prepare_dataframe, select_feature_columns


MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
DATASET_FILE = Path(__file__).resolve().parent / "dataset" / "dataset_sdn.csv"


def load_dataset() -> pd.DataFrame:
    if not DATASET_FILE.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET_FILE}")

    frame = pd.read_csv(DATASET_FILE)
    frame = prepare_dataframe(frame)
    if TARGET_COLUMN not in frame.columns:
        raise ValueError(f"Expected target column '{TARGET_COLUMN}' in dataset.")
    return frame


def build_preprocessor(numeric_features: list[str], categorical_features: list[str]) -> ColumnTransformer:
    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    return ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, numeric_features),
            ("categorical", categorical_pipeline, categorical_features),
        ]
    )


def train_candidates(x_train, y_train, preprocessor):
    candidates = {
        "random_forest": RandomForestClassifier(
            n_estimators=250,
            max_depth=18,
            min_samples_leaf=2,
            class_weight="balanced_subsample",
            random_state=42,
            n_jobs=-1,
        ),
        "extra_trees": ExtraTreesClassifier(
            n_estimators=300,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        ),
        "logistic_regression": LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            solver="lbfgs",
        ),
    }

    trained = {}
    for name, estimator in candidates.items():
        pipeline = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("classifier", estimator),
            ]
        )
        pipeline.fit(x_train, y_train)
        trained[name] = pipeline

    return trained


def evaluate_model(model, x_test, y_test):
    predictions = model.predict(x_test)
    return {
        "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
        "precision": round(float(precision_score(y_test, predictions, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, predictions, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, predictions, zero_division=0)), 4),
        "classification_report": classification_report(y_test, predictions, output_dict=True),
    }


def main():
    frame = load_dataset()
    feature_columns, numeric_features, categorical_features = select_feature_columns(frame)

    x = frame[feature_columns]
    y = frame[TARGET_COLUMN].astype(int)

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    preprocessor = build_preprocessor(numeric_features, categorical_features)
    trained_models = train_candidates(x_train, y_train, preprocessor)

    results = {name: evaluate_model(model, x_test, y_test) for name, model in trained_models.items()}
    best_name = max(results, key=lambda name: (results[name]["f1"], results[name]["recall"]))
    best_model = trained_models[best_name]

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    bundle = {
        "model": best_model,
        "feature_columns": feature_columns,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "target_column": TARGET_COLUMN,
        "winner": best_name,
        "results": results,
        "dataset_file": str(DATASET_FILE),
    }

    with open(MODEL_DIR / "model_bundle.pkl", "wb") as bundle_file:
        pickle.dump(bundle, bundle_file)

    with open(MODEL_DIR / "metrics.json", "w", encoding="utf-8") as metrics_file:
        json.dump(
            {
                "winner": best_name,
                "results": results,
                "feature_columns": feature_columns,
                "train_rows": int(len(x_train)),
                "test_rows": int(len(x_test)),
            },
            metrics_file,
            indent=2,
        )

    print(f"Training complete. Best model: {best_name}")
    print(f"Metrics written to {MODEL_DIR / 'metrics.json'}")


if __name__ == "__main__":
    main()
