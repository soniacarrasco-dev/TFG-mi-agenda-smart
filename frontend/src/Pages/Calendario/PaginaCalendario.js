import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarioEventos from '../../Components/Calendario/CalendarioEventos'; // Ajusta la ruta según tu carpeta

const PaginaCalendario = ({ usuario }) => {
    const [eventos, setEventos] = useState([]);
    const navigate = useNavigate();

    const prepararEdicionDesdeCalendario = (ev) => {
        navigate('/gestionacademica', { state: { editarEventoId: ev.id } });
    };

    useEffect(() => {
        if (usuario?.id) {
            fetch(`http://localhost:3001/api/eventos/${usuario.id}`)
                .then(res => res.json())
                .then(data => setEventos(data))
                .catch(err => console.error("Error cargando eventos:", err));
        }
    }, [usuario]);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#194f58', marginBottom: '20px' }}>CALENDARIO</h2>

            <CalendarioEventos
                eventos={eventos}
                onEdit={prepararEdicionDesdeCalendario}
            />
        </div>
    );
};

export default PaginaCalendario;