import pandas as pd, numpy as np, random
np.random.seed(42)   # For reproducibility
N = 500

# Student profiles
profiles = pd.DataFrame({
    'student_id': [f'S{i:04d}' for i in range(1, N+1)],
    'age': np.random.randint(17, 25, N),
    'gender': np.random.choice(['M','F','Other'], N),
    'department': np.random.choice(['CS','EE','ME','CE','IT'], N),
    'year': np.random.randint(1, 5, N)
})
profiles.to_csv('data/student_profiles.csv', index=False)

# Attendance (6 months per student)
months = ['Jan','Feb','Mar','Apr','May','Jun']
att_rows = []
for sid in profiles['student_id']:
    for m in months:
        pct = np.clip(np.random.normal(75, 15), 40, 100)
        att_rows.append({'student_id': sid, 'month': m,
                         'attendance_pct': round(pct,1), 'absences': int((100-pct)/10)})
pd.DataFrame(att_rows).to_csv('data/attendance.csv', index=False)

# Scores (4 subjects per student)
subjects = ['Math','Science','English','CS']
score_rows = []
for sid in profiles['student_id']:
    for subj in subjects:
        exam = round(np.clip(np.random.normal(65, 15), 0, 100), 1)
        score_rows.append({'student_id': sid, 'subject': subj,
                           'quiz_avg': round(exam * 0.9, 1),
                           'assignment_avg': round(exam * 1.05, 1),
                           'exam_score': exam, 'final_grade': round(exam * 0.95, 1)})
pd.DataFrame(score_rows).to_csv('data/scores.csv', index=False)
# LMS Activity
activity = pd.DataFrame({
    'student_id': profiles['student_id'],
    'lms_logins': np.random.randint(2, 30, N),
    'resources_accessed': np.random.randint(5, 50, N),
    'forum_posts': np.random.randint(0, 20, N),
    'assignments_submitted': np.random.randint(5, 20, N)
})
activity.to_csv('data/activity.csv', index=False)

print('All 4 datasets generated successfully!')

