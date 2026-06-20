import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import Login from './views/Login';
import RequestForm from './views/SolicitudForm.jsx';
import Dashboard from './views/Dashboard.jsx';

const DashboardSimulado = () => (
  <div style={{ padding: '20px' }}>
    <h2>¡Bienvenido al Dashboard!</h2>
    <p>Pronto programaremos aquí las vistas de Solicitante y Revisor.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nueva-solicitud" element={<RequestForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;