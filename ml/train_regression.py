from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import numpy as np
import joblib
from features import engineer_features, FEATURE_COLS
import os

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(BASE_DIR, 'data', 'master_dataset.csv')
model_dir = os.path.join(BASE_DIR, 'models')

os.makedirs(model_dir, exist_ok=True)

# Load data
df = pd.read_csv(data_path)
df = engineer_features(df)

# Remove target leakage if present
safe_features = [c for c in FEATURE_COLS if c in df.columns and c != 'final_grade']

X = df[safe_features]
y = df['final_grade']

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train RandomForest (no scaling needed)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict & evaluate
y_pred = model.predict(X_test)

print('R2 Score:', round(r2_score(y_test, y_pred), 4))
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print('RMSE:', round(rmse, 4))

# Save model
joblib.dump(model, os.path.join(model_dir, 'grade_predictor.pkl'))

print('Grade predictor saved!')