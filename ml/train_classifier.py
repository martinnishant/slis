from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import joblib
import os
from features import engineer_features, FEATURE_COLS

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(BASE_DIR, 'data', 'master_dataset.csv')
model_dir = os.path.join(BASE_DIR, 'models')
docs_dir = os.path.join(BASE_DIR, 'docs')

os.makedirs(model_dir, exist_ok=True)
os.makedirs(docs_dir, exist_ok=True)

# Load data
df = pd.read_csv(data_path)
df = engineer_features(df)

# Remove leakage-prone columns
safe_features = [
    c for c in FEATURE_COLS
    if c in df.columns and c not in ['final_grade', 'risk_level']
]

X = df[safe_features]

# Encode target
le = LabelEncoder()
y = le.fit_transform(df['risk_level'])

# Stratified split (important for imbalance)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train model
clf = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight='balanced'   # helps with minority class (High risk)
)
clf.fit(X_train, y_train)

# Predict & evaluate
y_pred = clf.predict(X_test)

print("Classification Report:\n")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(8, 6))
sns.heatmap(
    cm,
    annot=True,
    fmt='d',
    xticklabels=le.classes_,
    yticklabels=le.classes_,
    cmap='Blues'
)
plt.title('Risk Classifier Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')

cm_path = os.path.join(docs_dir, 'confusion_matrix.png')
plt.savefig(cm_path, dpi=150)
plt.close()

# Save model and encoder
joblib.dump(clf, os.path.join(model_dir, 'risk_classifier.pkl'))
joblib.dump(le, os.path.join(model_dir, 'label_encoder.pkl'))

print('Risk classifier saved!')
print(f'Confusion matrix saved at: {cm_path}')