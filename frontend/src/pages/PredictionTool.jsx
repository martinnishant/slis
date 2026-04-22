import { useState } from 'react'
import { predictGrade, predictRisk, getRecommendation } from '../api/client'

function PredictionTool() {
  const [form, setForm] = useState({
    attendance_pct: 80,
    avg_exam: 65,
    lms_logins: 10,
    resources_accessed: 20,
    forum_posts: 5,
    assignments_submitted: 15,
    department: 'CS',
    gender: 'M',
    avg_quiz: 60,
    total_absences: 5
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const [grade, risk, rec] = await Promise.all([
        predictGrade(form),
        predictRisk(form),
        getRecommendation(form)
      ])
      setResult({
        grade: grade.data,
        risk: risk.data,
        rec: rec.data
      })
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const riskColor = { Low: 'green', Medium: 'orange', High: 'red' }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Prediction Tool</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '600px' }}>
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
              {key.replace(/_/g, ' ').toUpperCase()}
            </label>
            <input
              type={typeof value === 'number' ? 'number' : 'text'}
              name={key}
              value={value}
              onChange={handleChange}
              style={{ padding: '0.5rem', width: '100%' }}
            />
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmit}
        disabled={loading}
        style={{ 
          marginTop: '1rem', 
          padding: '0.75rem 2rem', 
          background: '#3498db', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Predicting...' : 'Predict Risk'}
      </button>

      {result && (
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Predicted Grade</h3>
            <p style={{ fontSize: '2rem', color: '#3498db' }}>{result.grade.predicted_grade}</p>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Risk Level</h3>
            <p style={{ 
              fontSize: '2rem', 
              color: riskColor[result.risk.risk],
              fontWeight: 'bold'
            }}>
              {result.risk.risk}
            </p>
            <p>Confidence: {(result.risk.confidence * 100).toFixed(1)}%</p>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>AI Recommendations</h3>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
              {result.rec.recommendations}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictionTool