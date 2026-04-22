import { useState, useEffect } from 'react'
import { getStats, getStudents } from '../api/client'
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])

  useEffect(() => {
    getStats().then(res => setStats(res.data))
    getStudents().then(res => setStudents(res.data))
  }, [])

  const riskCounts = students.reduce((acc, s) => {
    acc[s.risk_level] = (acc[s.risk_level] || 0) + 1
    return acc
  }, {})

  const pieData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [riskCounts.Low || 0, riskCounts.Medium || 0, riskCounts.High || 0],
      backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c']
    }]
  }

  const deptGrades = students.reduce((acc, s) => {
    if (!acc[s.department]) acc[s.department] = { sum: 0, count: 0 }
    // Note: We don't have final_grade in list, using mock for demo
    return acc
  }, {})

  if (!stats) return <div>Loading...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard Overview</h2>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#3498db', color: 'white', borderRadius: '8px' }}>
          <h3>Total Students</h3>
          <p style={{ fontSize: '2rem' }}>{stats.total_students}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#e74c3c', color: 'white', borderRadius: '8px' }}>
          <h3>At Risk</h3>
          <p style={{ fontSize: '2rem' }}>{stats.at_risk_count}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#2ecc71', color: 'white', borderRadius: '8px' }}>
          <h3>Avg Grade</h3>
          <p style={{ fontSize: '2rem' }}>{stats.avg_grade}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#9b59b6', color: 'white', borderRadius: '8px' }}>
          <h3>Avg Attendance</h3>
          <p style={{ fontSize: '2rem' }}>{stats.avg_attendance}%</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Risk Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard