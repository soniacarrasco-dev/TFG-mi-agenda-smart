import { FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RowEvento = ({ ev }) => {
    const navigate = useNavigate();

    const hoy = new Date();
    const fechaVenc = new Date(ev.fecha_vencimiento);

    // Calcula la diferencia en días
    const diffTime = fechaVenc - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Define si es "urgente" (próximos 7 días)
    const esUrgente = diffDays <= 7 && diffDays >= 0;

    const manejarClick = () => {
        // Redirige a la página de gestión pasando el ID del evento en el "state"
        navigate('/gestionacademica', { state: { editarEventoId: ev.id } });
    };

    return (
        <div className={`dash-row-evento ${esUrgente ? 'urgente' : 'futuro'}`}
            onClick={manejarClick}
            style={{ cursor: 'pointer' }}>
            <div className="dash-info">
                <strong>{ev.titulo}</strong>
                <span>{ev.nombre_asignatura}</span>
            </div>
            <div className="dash-fecha">
                <FiCalendar />
                {esUrgente
                    ? (diffDays === 0 ? 'Hoy' : `En ${diffDays} días`)
                    : fechaVenc.toLocaleDateString()
                }
            </div>
        </div>
    );
};

export default RowEvento;