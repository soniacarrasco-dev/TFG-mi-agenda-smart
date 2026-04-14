import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarioEventos.css';

/**
 * Renderiza el calendario de eventos y la lista de eventos del día seleccionado.
 * @param {Object[]} eventos - Eventos del usuario.
 * @param {function(Object): void} onEdit - Callback que abre el formulario de edición.
 */
const CalendarioEventos = ({ eventos = [], onEdit }) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

    /**
     * Determina el marcador de prioridad para cada día según el tipo de evento.
     * La jerarquía es: examen > videoconferencia > tarea.
     */
    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const fechaStr = date.toISOString().split('T')[0];

            // Filtra los eventos de este día específico
            const eventosDia = eventos.filter(ev => {
                const fEv = new Date(ev.fecha_vencimiento).toISOString().split('T')[0];
                return fEv === fechaStr && !ev.completado;
            });

            // Solo considera eventos pendientes para colorear el día.

            if (eventosDia.length > 0) {
                // Prioridad: Rojo si hay examen, azul si hay videoconferencia, verde si es tarea
                const tieneExamen = eventosDia.some(e => e.tipo.toLowerCase() === 'examen');
                const tieneVideo = eventosDia.some(e => e.tipo.toLowerCase() === 'videoconferencia');

                let claseDot = 'dot-tarea';
                if (tieneExamen) claseDot = 'dot-examen';
                else if (tieneVideo) claseDot = 'dot-video';

                return <div className={`dot-calendario ${claseDot}`}></div>;
            }
        }
        return null;
    };

    // 2. Filtra eventos para mostrar debajo del calendario al hacer click
    const eventosDelDiaSeleccionado = eventos.filter(ev => {
        const fEv = new Date(ev.fecha_vencimiento).toISOString().split('T')[0];
        const fSel = fechaSeleccionada.toISOString().split('T')[0];
        return fEv === fSel && !ev.completado;
    });

    return (
        <div className="calendario-container">
            <div className="card-calendario">
                <Calendar
                    onChange={setFechaSeleccionada}
                    value={fechaSeleccionada}
                    locale="es-ES"
                    tileContent={renderTileContent}
                />
            </div>

            <div className="eventos-dia-seleccionado">
                <h4>Eventos para el {fechaSeleccionada.toLocaleDateString()}</h4>
                {eventosDelDiaSeleccionado.length > 0 ? (
                    <div className="lista-mini-eventos">
                        {eventosDelDiaSeleccionado.map(ev => (
                            <div
                                key={ev.id}
                                className={`mini-item-evento ${ev.tipo.toLowerCase().replace(/\s+/g, '')}`} // Mejoramos el manejo de espacios
                                onClick={() => onEdit(ev)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="mini-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <span className="mini-tipo">{ev.tipo}:</span>
                                        <strong className="mini-titulo">{ev.titulo}</strong>
                                    </div>
                                    <span className="mini-asignatura" style={{ fontSize: '0.75rem', color: '#08998D', fontWeight: '600' }}>
                                        {ev.nombre_asignatura}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-eventos-text">No hay eventos para este día.</p>
                )}
            </div>
        </div>
    );
};

export default CalendarioEventos;