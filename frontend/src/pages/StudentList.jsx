import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStudents } from '../api/client'

function StudentList() {
  const [students, setStudents] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getStudents().then(res => setStudents(res.data))
  }, [])

  const filtered = students.filter(s => 
    s.student_id.toLowerCase().includes(filter.toLowerCase()) ||
    s.department.toLowerCase().includes(filter.toLowerCase()) ||
    s.risk_level.toLowerCase().includes(filter.toLowerCase())
  )

  const riskColor = { Low: '#2ecc71', Medium: '#f39c12', High: '#e74c3c' }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Student List</h2>
      <input 
        type="text" 
        placeholder="Search by ID, department, or risk level..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ padding: '0.5rem', width: '300px', marginBottom: '1rem' }}
      />
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: 'white' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Age</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Gender</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Department</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Year</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Risk</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.student_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.75rem' }}>
                <Link to={`/students/${s.student_id}`}>{s.student_id}</Link>
              </td>
              <td style={{ padding: '0.75rem' }}>{s.age}</td>
              <td style={{ padding: '0.75rem' }}>{s.gender}</td>
              <td style={{ padding: '0.75rem' }}>{s.department}</td>
              <td style={{ padding: '0.75rem' }}>{s.year}</td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{ 
                  background: riskColor[s.risk_level], 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px',
                  fontSize: '0.85rem'
                }}>
                  {s.risk_level}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentList