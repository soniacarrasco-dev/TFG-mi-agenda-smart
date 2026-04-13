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

    const prepararEdicionDesdeCalendario = (ev) => {
        navigate('/gestionacademica', { state: { editarEventoId: ev.id } });
    };

    useEffect(() => {
        if (usuario?.id) {
            fetch(`http://localhost:3001/api/eventos/${usuario.id}`).then(res => res.json())
                .then(data => setProximos(data))
                .catch(err => console.error(err));
        }
    }, [usuario]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            const tieneTarea = proximos.find(p => p.fecha_vencimiento.split('T')[0] === dateStr);
            return tieneTarea ? <div className="dot-tarea"></div> : null;
        }
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