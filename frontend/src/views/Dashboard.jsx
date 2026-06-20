import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ApplicantView = ({ navigate }) => { //vista del solicitante
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Mis Solicitudes Ciudadanas</h3>
                <button 
                    onClick={() => navigate('/nueva-solicitud')}
                    style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Nueva Solicitud
                </button>
            </div>
            {/* Tabla provisional de solicitudes del usuario */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Folio</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Título</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>#001</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Bache en la avenida principal</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}><span style={{ color: 'orange' }}>Pendiente</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
//vista de revisor
const ReviewerView = () => {
    return (
        <div>
            <h3>Panel de Revisión Global</h3>
            <p>Lista de todas las solicitudes pendientes en el sistema:</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Usuario</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Solicitud</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Acciones</th></tr></thead>
                <tbody><tr>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>juan.perez@mail.com</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Falta de alumbrado público</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            <button style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', marginRight: '5px', cursor: 'pointer' }}>Aprobar</button>
                            <button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Rechazar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
// componente principal este controla el acceso 
const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // este es un rol por defecto en caso de que aun no se inicie sesión real
    const userRole = user?.role || 'solicitante'; 

    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            {/* barra de navegación del dashboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
                <h2>Dashboard ({userRole.toUpperCase()})</h2>
                <div>
                    <span style={{ marginRight: '15px', color: '#555' }}>Bienvenido, {user?.name || 'Usuario Prueba'}</span>
                    <button 
                        onClick={() => { logout(); navigate('/login'); }}
                        style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
            {userRole === 'revisor' ? (
                <ReviewerView />
            ) : (
                <ApplicantView navigate={navigate} />
            )}
        </div>
    );
};

export default Dashboard;