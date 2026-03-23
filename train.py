import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder

import joblib

# 1. Load Dataset
df = pd.read_csv("../data/dataset_sdn.csv")

print("Dataset Loaded ✅")

# 2. Drop unnecessary columns
df = df.drop(columns=["dt"])  # remove timestamp

# 3. Encode categorical columns
categorical_cols = ["switch", "src", "dst", "Protocol"]

le_dict = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    le_dict[col] = le  # save encoders

# 4. Features & Label
X = df.drop("label", axis=1)
y = df["label"]

# 5. Handle missing values
X = X.fillna(0)

# 6. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 7. Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print("Model Trained ✅")

# 8. Predictions
y_pred = model.predict(X_test)

# 9. Evaluation
print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# 10. Save Model + Encoders
joblib.dump(model, "model.pkl")
joblib.dump(le_dict, "encoders.pkl")

print("\nModel & Encoders Saved ✅")