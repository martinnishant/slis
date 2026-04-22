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
df = (
    profiles
    .merge(att_agg, on='student_id', how='left')
    .merge(score_agg, on='student_id', how='left')
    .merge(activity, on='student_id', how='left')
)

# Clean: fill missing values (numeric only)
df.fillna(df.median(numeric_only=True), inplace=True)

# Clip only specific columns safely
cols_to_clip = ['avg_exam', 'final_grade']
df[cols_to_clip] = df[cols_to_clip].clip(lower=0, upper=100)

# Standardize column names
df.columns = df.columns.str.lower().str.replace(' ', '_')

# Remove duplicates
df.drop_duplicates(subset='student_id', inplace=True)

# Save dataset
df.to_csv('data/master_dataset.csv', index=False)

print(f"Master dataset saved: {len(df)} students, {df.shape[1]} features")