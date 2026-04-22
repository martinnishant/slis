import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import StudentList from './pages/StudentList'
import StudentDetail from './pages/StudentDetail'
import PredictionTool from './pages/PredictionTool'

function App() {
  return (
    <div className="app">
      <nav style={{ padding: '1rem', background: '#1a1a2e', color: 'white' }}>
        <h1>SLIS - Student Risk Predictor</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Link to="/" style={{ color: 'white' }}>Dashboard</Link>
          <Link to="/students" style={{ color: 'white' }}>Students</Link>
          <Link to="/predict" style={{ color: 'white' }}>Predict</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/predict" element={<PredictionTool />} />
      </Routes>
    </div>
  )
}

export default App