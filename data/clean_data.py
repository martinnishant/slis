import pandas as pd

# Load all four CSVs
profiles = pd.read_csv('data/student_profiles.csv')
attendance = pd.read_csv('data/attendance.csv')
scores = pd.read_csv('data/scores.csv')
activity = pd.read_csv('data/activity.csv')

# Aggregate attendance to one row per student
att_agg = attendance.groupby('student_id').agg(
    attendance_pct=('attendance_pct', 'mean'),
    total_absences=('absences', 'sum')
).reset_index()

# Aggregate scores to one row per student
score_agg = scores.groupby('student_id').agg(
    avg_quiz=('quiz_avg', 'mean'),
    avg_exam=('exam_score', 'mean'),
    final_grade=('final_grade', 'mean')
).reset_index()

# Merge all into master dataset
df = profiles.merge(att_agg, on='student_id') \
             .merge(score_agg, on='student_id') \
             .merge(activity, on='student_id')

# Clean: fill missing, cap scores at 0-100, fix column names
df.fillna(df.median(numeric_only=True), inplace=True)

# Fix: Clip numeric columns individually (compatible with all pandas versions)
df['avg_exam'] = df['avg_exam'].clip(lower=0, upper=100)
df['final_grade'] = df['final_grade'].clip(lower=0, upper=100)

df.columns = df.columns.str.lower().str.replace(' ', '_')
df.drop_duplicates(subset='student_id', inplace=True)

# RISK LABEL CREATION
def assign_risk(row):
    score = 0
    if row['attendance_pct'] < 60: score += 2
    elif row['attendance_pct'] < 75: score += 1
    if row['avg_exam'] < 40: score += 2
    elif row['avg_exam'] < 60: score += 1
    if row['lms_logins'] < 5: score += 1
    return 'High' if score >= 3 else 'Medium' if score == 2 else 'Low'

df['risk_level'] = df.apply(assign_risk, axis=1)

df.to_csv('data/master_dataset.csv', index=False)
print(f'Master dataset saved: {len(df)} students, {df.shape[1]} features')
print(f'Risk distribution:\n{df["risk_level"].value_counts()}')