import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import VencimientosCard from './VencimientosCard';
import 'react-calendar/dist/Calendar.css';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import CalendarioEventos from '../../Components/Calendario/CalendarioEventos';

const Home = ({ usuario }) => {
    const [fecha, setFecha] = useState(new Date());
    const [proximos, setProximos] = useState([]);
    const navigate = useNavigate();

    /**
     * Redirige a la pantalla de gestión académica para editar el evento
     * seleccionado desde el calendario.
     * @param {{id: number|string}} ev - Evento seleccionado.
     */
    const prepararEdicionDesdeCalendario = (ev) => {
        navigate('/gestionacademica', { state: { editarEventoId: ev.id } });
    };

    useEffect(() => {
        // Carga eventos del usuario autenticado y actualiza el estado local
        if (usuario?.id) {
            fetch(`http://localhost:3001/api/eventos/${usuario.id}`).then(res => res.json())
                .then(data => setProximos(data))
                .catch(err => console.error(err));
        }
    }, [usuario]);

    /**
     * Marca en el calendario los días que contienen al menos una tarea pendiente.
     * La comparación usa solo la parte de fecha para evitar drift por zona horaria.
     */
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            const tieneTarea = proximos.find(p => p.fecha_vencimiento.split('T')[0] === dateStr);
            return tieneTarea ? <div className="dot-tarea"></div> : null;
        }
        return null;
    };

    return (
        <div className="home-container">
            <main className="dashboard-grid">

                <VencimientosCard proximos={proximos} />

                <div className="columna-derecha">
                    <section className="calendario-section">
                        <h3>CALENDARIO DE EVENTOS</h3>
                        <CalendarioEventos
                            eventos={proximos}
                            onEdit={prepararEdicionDesdeCalendario}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Home;