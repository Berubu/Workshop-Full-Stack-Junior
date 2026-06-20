import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// vista del solicitante
const ApplicantView = ({ navigate, requests }) => {
    // formatear estilos para los 4 estatus
    const getStatusStyle = (status) => {
        switch (status) {
            case 'received': return { color: 'orange', fontWeight: 'bold' };
            case 'in_review': return { color: '#007bff', fontWeight: 'bold' };
            case 'resolved': return { color: 'green', fontWeight: 'bold' };
            case 'rejected': return { color: 'red', fontWeight: 'bold' };
            default: return { color: '#777', fontWeight: 'bold' };
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Mis Solicitudes Ciudadanas</h3>
                <button 
                    onClick={() => navigate('/nueva-solicitud')}
                    style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Nueva Solicitud
                </button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Folio</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Título</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Categoría</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>No has registrado ninguna solicitud aún.</td>
                        </tr>
                    ) : (
                        requests.map((req) => (
                            <tr key={req.id || req.folio} style={{ textAlign: 'left' }}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{req.folio}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{req.title}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{req.category}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    <span style={getStatusStyle(req.status)}>
                                        {req.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// vista del revisor conectado a la base de datos
const ReviewerView = ({ requests, onRefresh }) => { 
    const [selectedReq, setSelectedReq] = useState(null);

    // peticion put real para guardar el estatus
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            await api.put(`/requests/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`Base de datos actualizada: Solicitud cambiada a ${newStatus.toUpperCase()}`);
            setSelectedReq(null); 
            onRefresh(); 
        } catch (error) {
            console.error("Error al conectar con la API de actualización:", error);
            alert("Error en el servidor al intentar cambiar el estatus.");
        }
    };

    return (
        <div>
            <h3>Panel de Revisión Global</h3>
            <p>Lista de todas las solicitudes pendientes en el sistema:</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Usuario</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Folio</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Solicitud</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>No hay solicitudes en el sistema global.</td>
                        </tr>
                    ) : (
                        requests.map((x) => (
                            <tr key={x.id || x.folio} style={{ textAlign: 'left' }}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{x.user?.email || 'N/A'}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{x.folio}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{x.title}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    <button 
                                        onClick={() => setSelectedReq(x)}
                                        style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        Verificar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {selectedReq && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 99999 }}>
                    <div style={{ backgroundColor: '#fff', color: '#333', padding: '25px', borderRadius: '6px', width: '460px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'left' }}>
                        <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Dictamen de Solicitud: {selectedReq.folio}</h3>
                        
                        <div style={{ margin: '15px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <p><strong>Remitente:</strong> {selectedReq.user?.name || 'N/A'} ({selectedReq.user?.email || 'N/A'})</p>
                            <p><strong>Título:</strong> {selectedReq.title}</p>
                            <p><strong>Detalle Técnico:</strong> {selectedReq.description}</p>
                            <p><strong>Categoría:</strong> {selectedReq.category} | <strong>Prioridad:</strong> {selectedReq.priority}</p>
                            <p><strong>Zona:</strong> Col. {selectedReq.neighborhood}, C.P. {selectedReq.postal_code}</p>
                            <p><strong>Estado Actual:</strong> <span style={{ color: 'orange', fontWeight: 'bold' }}>{selectedReq.status?.toUpperCase()}</span></p>
                        </div>
                        
                        {/* botones con los estados oficiales del backend */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '25px' }}>
                            <button 
                                onClick={() => handleUpdateStatus(selectedReq.id, 'in_review')}
                                style={{ flex: 1, background: '#007bff', color: 'white', padding: '10px 5px', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                                En Revisión
                            </button>
                            <button 
                                onClick={() => handleUpdateStatus(selectedReq.id, 'resolved')}
                                style={{ flex: 1, background: 'green', color: 'white', padding: '10px 5px', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                                Resolver
                            </button>
                            <button 
                                onClick={() => handleUpdateStatus(selectedReq.id, 'rejected')}
                                style={{ flex: 1, background: 'red', color: 'white', padding: '10px 5px', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                                Rechazar
                            </button>
                        </div>

                        <button 
                            onClick={() => setSelectedReq(null)}
                            style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Volver al Panel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// componente dashboard principal
const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);

    const userRole = user?.role || 'solicitante'; 

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await api.get('/requests', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRequests(response.data);
        } catch (error) {
            console.error('Error al cargar la base de datos:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            {/* barra de navegacion del dashboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
                <h2>Panel ({userRole.toUpperCase()})</h2>
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
                <ReviewerView requests={requests} onRefresh={fetchRequests} />
            ) : (
                <ApplicantView navigate={navigate} requests={requests} />
            )}
        </div>
    );
};

export default Dashboard;