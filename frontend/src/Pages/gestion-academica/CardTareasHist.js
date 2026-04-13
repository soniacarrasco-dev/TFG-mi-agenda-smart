
import { useState } from 'react';
import { FiCalendar, FiEdit2, FiTrash2, FiPaperclip, FiAlertCircle } from 'react-icons/fi';
import './CardTareasHist.css';

const CardTareasHist = ({ ev, onEdit, onDelete, onGuardarNota }) => {
    const [error, setError] = useState(false);
    const esAprobado = ev.nota >= 5;
    const estadoClase = esAprobado ? 'aprobado' : 'suspenso';
    const colorNota = error ? '#e74c3c' : (esAprobado ? '#27ae60' : '#e74c3c');
    const handleChange = (e) => {
        let valor = e.target.value.replace('.', ',');

        // Impide que escriban letras (solo números y una coma)
        valor = valor.replace(/[^0-9,]/g, '');

        e.target.value = valor;
    };

    // Función para renderizar múltiples archivos adjuntos
    const renderAdjuntos = (ruta_archivo) => {
        if (!ruta_archivo) return null;

        const listaRutas = ruta_archivo.split(',');

        return (
            <div className="adjuntos-container" style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
                {listaRutas.map((ruta, index) => {
                    const rutaLimpia = ruta.trim().replace(/\\/g, '/');
                    const urlCompleta = `http://localhost:3001/${rutaLimpia}`;

                    return (
                        <a
                            key={index}
                            href={urlCompleta}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-download-file"
                            title={`Ver adjunto ${index + 1}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FiPaperclip />
                            {listaRutas.length > 1 && (
                                <span style={{ fontSize: '10px', marginLeft: '2px' }}>{index + 1}</span>
                            )}
                        </a>
                    );
                })}
            </div>
        );
    };

    const handleNotaChange = (idEvento, valorInput) => {
        let valorParaEstado;

        // Si el input está vacío, el valor debe ser null
        if (valorInput === "") {
            valorParaEstado = null;
        } else {
            // Convertimos a número para validar el rango
            const num = parseFloat(valorInput);

            // Aplicamos la regla: solo aceptamos si está entre 0 y 10
            if (!isNaN(num) && num >= 0 && num <= 10) {
                valorParaEstado = num;
            } else {
                return;
            }
        }

        onGuardarNota(idEvento, valorParaEstado);
    };

    return (
        <div className={`item-row-evento-historial ${estadoClase}`}>
            <div className="ev-info-principal">
                <h4 title={ev.titulo}>{ev.titulo}</h4>
                <div className="tags-container">
                    <span className="tag-asignatura">{ev.nombre_asignatura}</span>
                    <span className="tag-tipo">{ev.tipo}</span>
                </div>
            </div>

            <div className="nota-seccion" style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <span className="nota-label">Calificación</span>
                <input
                    type="text"
                    inputMode='decimal'
                    step="0.1"
                    defaultValue={
                        ev.nota !== null && ev.nota !== undefined
                            ? ev.nota.toString().replace('.', ',')
                            : ''
                    }
                    className={`input-nota-historial ${error ? 'input-error-visual' : ''}`}
                    style={{
                        color: colorNota,
                        borderBottom: error ? '2px solid #e74c3c' : 'none'
                    }}
                    onFocus={(e) => {
                        e.target.select();
                        setError(false);
                    }}
                    onBlur={(e) => {
                        const valorRaw = e.target.value.trim();

                        if (valorRaw === '') {
                            setError(false);
                            onGuardarNota(ev.id, null);
                        } else {
                            const valorParaGuardar = valorRaw.replace(',', '.');
                            const num = parseFloat(valorParaGuardar);

                            // Validar que sea un número entre 0 y 10
                            if (!isNaN(num) && num >= 0 && num <= 10) {
                                setError(false);
                                onGuardarNota(ev.id, num);
                            } else {
                                // NO GUARDAMOS y avisamos visualmente
                                setError(true);
                            }
                        }
                    }}
                />

                {/* Mensaje de error discreto debajo del input */}
                {error && (
                    <span style={{
                        position: 'absolute',
                        bottom: '-16px',
                        left: '0',
                        fontSize: '10px',
                        color: '#e74c3c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        width: '100%',
                        fontWeight: 'bold'
                    }}>
                        <FiAlertCircle size={10} /> 0 a 10
                    </span>
                )}

                <span className="fecha-entrega-txt">
                    <FiCalendar size={10} style={{ marginRight: '4px' }} />
                    {new Date(ev.fecha_entrega || ev.fecha_vencimiento).toLocaleDateString()}
                </span>
            </div>

            <div className="acciones-historial">
                <button className="btn-icon-historial" onClick={() => onEdit(ev)}>
                    <FiEdit2 size={18} />
                </button>
                <button className="btn-icon-historial" onClick={() => onDelete(ev.id, 'evento')}>
                    <FiTrash2 size={18} />
                </button>
            </div>
        </div >
    );
};

export default CardTareasHist;