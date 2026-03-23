import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder, StandardScaler

import joblib

# -------------------------------
# 1. Load Dataset
# -------------------------------
print("Loading dataset...")
df = pd.read_csv("../data/dataset_sdn.csv")

print("Dataset loaded successfully")
print("Shape:", df.shape)

# -------------------------------
# 2. Drop Unnecessary & Leakage Columns
# -------------------------------
drop_cols = [
    "dt",
    "tx_kbps",
    "rx_kbps",
    "tot_kbps"
]

df = df.drop(columns=[col for col in drop_cols if col in df.columns])

print("Dropped unnecessary columns")

# -------------------------------
# 3. Encode Categorical Columns
# -------------------------------
categorical_cols = ["switch", "src", "dst", "Protocol"]

le_dict = {}

for col in categorical_cols:
    if col in df.columns:
        print(f"Encoding column: {col}")
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        le_dict[col] = le

# -------------------------------
# 4. Features & Label
# -------------------------------
if "label" not in df.columns:
    raise Exception("'label' column not found")

X = df.drop("label", axis=1)
y = df["label"]

# -------------------------------
# 5. Handle Missing Values
# -------------------------------
X = X.fillna(0)

# -------------------------------
# 6. Train-Test Split
# -------------------------------
print("Splitting dataset...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -------------------------------
# 7. Feature Scaling (IMPORTANT)
# -------------------------------
scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# -------------------------------
# 8. Train Logistic Regression Model
# -------------------------------
print("Training Logistic Regression model...")

model = LogisticRegression(max_iter=1000)

model.fit(X_train, y_train)

print("Model trained successfully")

# -------------------------------
# 9. Predictions
# -------------------------------
print("Making predictions...")
y_pred = model.predict(X_test)

# -------------------------------
# 10. Evaluation
# -------------------------------
print("\nMODEL PERFORMANCE")
print("Accuracy:", accuracy_score(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# -------------------------------
# 11. Save Model & Tools
# -------------------------------
print("Saving model...")

joblib.dump(model, "model_logistic.pkl")
joblib.dump(le_dict, "encoders.pkl")
joblib.dump(list(X.columns), "features.pkl")
joblib.dump(scaler, "scaler.pkl")

print("Model saved as model_logistic.pkl")
print("Encoders saved as encoders.pkl")
print("Feature list saved as features.pkl")
print("Scaler saved as scaler.pkl")

# -------------------------------
# DONE
# -------------------------------
print("Training complete")