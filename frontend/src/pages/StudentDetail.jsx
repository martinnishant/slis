import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getStudent, getRecommendation } from '../api/client'

function StudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [recommendations, setRecommendations] = useState('')

  useEffect(() => {
    getStudent(id).then(res => {
      setStudent(res.data)
      // Get AI recommendations
      if (!res.data.error) {
        getRecommendation({
          attendance_pct: res.data.attendance_pct,
          avg_exam: res.data.avg_exam,
          lms_logins: res.data.lms_logins,
          resources_accessed: res.data.resources_accessed,
          forum_posts: res.data.forum_posts,
          assignments_submitted: res.data.assignments_submitted,
          department: res.data.department,
          gender: res.data.gender,
          avg_quiz: res.data.avg_quiz,
          total_absences: res.data.total_absences
        }).then(rec => setRecommendations(rec.data.recommendations))
      }
    })
  }, [id])

  if (!student) return <div>Loading...</div>
  if (student.error) return <div>Student not found</div>

  const riskColor = { Low: '#2ecc71', Medium: '#f39c12', High: '#e74c3c' }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Student Profile: {student.student_id}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
        {/* Profile Card */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Profile</h3>
          <p><strong>Age:</strong> {student.age}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Year:</strong> {student.year}</p>
          <p><strong>Attendance:</strong> {student.attendance_pct?.toFixed(1)}%</p>
          <p><strong>Avg Exam:</strong> {student.avg_exam?.toFixed(1)}</p>
          <p><strong>Final Grade:</strong> {student.final_grade?.toFixed(1)}</p>
          <p>
            <strong>Risk Level:</strong>{' '}
            <span style={{ 
              background: riskColor[student.risk_level], 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '12px' 
            }}>
              {student.risk_level}
            </span>
          </p>
        </div>

        {/* AI Recommendations */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>🤖 AI Recommendations</h3>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {recommendations || 'Loading recommendations...'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetail