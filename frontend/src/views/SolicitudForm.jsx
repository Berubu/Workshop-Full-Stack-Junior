import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const RequestForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // Ajustado al string exacto que espera tu base de datos por defecto
    const [category, setCategory] = useState('Atención ciudadana'); 
    const [priority, setPriority] = useState('medium'); 
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // trae los países de soap al cargar la pantalla
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/catalogs/countries');
                setCountries(response.data);
            } catch (error) {
                console.error('error al cargar países:', error);
            }
        };
        fetchCountries();
    }, []);

    // escuchar cuando cambie el cp o país para traer las colonias
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            if (selectedCountry && postalCode.length >= 5) {
                try {
                    const response = await api.get(`/catalogs/location/${selectedCountry}/${postalCode}`);
                    setNeighborhoods(response.data);
                    
                    if (response.data && response.data.length > 0) {
                        setSelectedNeighborhood(response.data[0]);
                    } else {
                        setSelectedNeighborhood('');
                    }
                } catch (error) {
                    console.error('error al cargar colonias:', error);
                    setNeighborhoods([]); 
                    setSelectedNeighborhood('');
                }
            } else {
                setNeighborhoods([]);
                setSelectedNeighborhood('');
            }
        };

        fetchNeighborhoods();
    }, [selectedCountry, postalCode]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!selectedNeighborhood) {
            setMessage('Por favor, selecciona una colonia o asentamiento válido.');
            return;
        }

        try {
            const payload = {
                title,
                description,
                category, // enviarA el string formateado como le gusta a Postgres
                priority,
                country_code: selectedCountry, 
                postal_code: postalCode,
                neighborhood: selectedNeighborhood
            };
            
            await api.post('/requests', payload);
            setMessage('Solicitud ciudadana registrada con éxito.');
            
            // limpia el formulario
            setTitle('');
            setDescription('');
            setPostalCode('');
            setSelectedNeighborhood('');   
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('errores detallados del backend:', error.response.data);
                setMessage(`error de validacion: ${JSON.stringify(error.response.data.errors || error.response.data.message)}`);
            } else {
                setMessage('Error al guardar la solicitud.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', fontFamily: 'sans-serif' }}>
            <h2>Nueva Solicitud Ciudadana</h2>
            {message && <p style={{ color: message.includes('éxito') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Título de la Solicitud:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Descripción detallada:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', height: '80px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Categoría:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="Trámite">Trámite</option>
                        <option value="Servicio público">Servicio público</option>
                        <option value="Soporte técnico">Soporte técnico</option>
                        <option value="Atención ciudadana">Atención ciudadana</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Prioridad:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                    </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>País:</label>
                    <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="">-- Selecciona un País --</option>
                        {countries.map((country, index) => (
                            <option key={country.code || index} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Código Postal:</label>
                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Ej: 58000" required disabled={!selectedCountry} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Colonia / Asentamiento:</label>
                    <select 
                        value={selectedNeighborhood} 
                        onChange={(e) => setSelectedNeighborhood(e.target.value)} 
                        required 
                        disabled={neighborhoods.length === 0} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="">-- Selecciona una Colonia --</option>
                        {neighborhoods.map((colonia, index) => (
                            <option key={index} value={colonia}>
                                {colonia}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Enviar Solicitud
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Regresar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RequestForm;