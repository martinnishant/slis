import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

FEATURE_COLS = [
    'attendance_pct', 'total_absences', 'avg_quiz', 'avg_exam',
    'lms_logins', 'resources_accessed', 'forum_posts',
    'assignments_submitted', 'engagement_score', 'attendance_risk', 'grade_trend'
]

def engineer_features(df):
    # Composite engagement score (0-10 scale)
    df['engagement_score'] = (
        df['lms_logins'] * 0.3 +
        df['resources_accessed'] * 0.3 +
        df['forum_posts'] * 0.2 +
        df['assignments_submitted'] * 0.2
    ) / 4
    
    # Binary attendance risk flag
    df['attendance_risk'] = (df['attendance_pct'] < 75).astype(int)
    
    # Grade trend: positive means improving
    df['grade_trend'] = df['avg_exam'] - df['avg_quiz']
    
    # Encode categorical columns
    df = pd.get_dummies(df, columns=['department', 'gender'], drop_first=True)
    
    return df