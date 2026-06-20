import { useState, useEffect } from 'react';
import api from '../services/api';

const RequestForm = () => {
    // campos del formulario
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    
    const [message, setMessage] = useState('');

    // trae los países de soap al cargar la pantalla
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/catalogs/countries');
                setCountries(response.data);
            } catch (error) {
                console.error('Error al cargar países:', error);
            }
        };
        fetchCountries();
    }, []);

    // Escuchar cuando cambie el cp para traer las colonias 
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            // solo hace la peticion si ya se selecciono un pais y el cp es de 5 caracteres 
            if (selectedCountry && postalCode.length >= 5) {
                try {
                    const response = await api.get(`/catalogs/neighborhoods/${selectedCountry}/${postalCode}`);
                    setNeighborhoods(response.data);
                } catch (error) {
                    console.error('Error al cargar colonias:', error);
                    setNeighborhoods([]);
                }
            } else {
                setNeighborhoods([]);
            }
        };

        fetchNeighborhoods();
    }, [selectedCountry, postalCode]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // aqui se envia la solicitud completa al backend de Laravel
            const payload = {
                title,
                description,
                country: selectedCountry,
                postal_code: postalCode,
                neighborhood: selectedNeighborhood
            };

            await api.post('/requests', payload);
            setMessage('Solicitud ciudadana registrada con éxito.');
            
            //para limpiar el formulario
            setTitle('');
            setDescription('');
            setPostalCode('');
            setSelectedNeighborhood('');
        } catch (error) {
            setMessage('Error al guardar la solicitud.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', fontFamily: 'sans-serif' }}>
            <h2>Nueva Solicitud Ciudadana</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Título de la Solicitud:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Descripción detallada:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', height: '80px' }} />
                </div>
                {/* Países (SOAP) */}
                <div style={{ marginBottom: '15px' }}>
                    <label>País:</label>
                    <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="">-- Selecciona un País --</option>
                        {countries.map((country) => (
                            <option key={country.sISOCode} value={country.sISOCode}>
                                {country.sName}
                            </option>
                        ))}
                    </select>
                </div>
                {/* INPUT Cp */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Código Postal:</label>
                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Ej: 58000" required disabled={!selectedCountry} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                {/* Colonias Encadenadas (REST) */}
                <div style={{ marginBottom: '20px' }}>
                    <label>Colonia / Asentamiento:</label>
                    <select value={selectedNeighborhood} onChange={(e) => setSelectedNeighborhood(e.target.value)} required disabled={neighborhoods.length === 0} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="">-- Selecciona una Colonia --</option>
                        {neighborhoods.map((name, index) => (
                            <option key={index} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Enviar Solicitud
                </button>
            </form>
        </div>
    );
};

export default RequestForm;