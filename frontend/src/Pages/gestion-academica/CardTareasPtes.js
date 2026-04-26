import React from 'react';
import { FiCalendar, FiCheckCircle, FiEdit2, FiTrash2, FiPaperclip } from 'react-icons/fi';
import './CardTareasPtes.css';

export const CardTareasPtes = ({ ev, onEntregar, onEdit, onDelete }) => {

    const urlArchivo = ev.ruta_archivo
        ? `http://localhost:3001/${ev.ruta_archivo.replace(/\\/g, '/')}`
        : null;

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

    return (
        <div className={`item-row-evento ${ev.completado ? 'done' : ''}`}>
            <div className="ev-content-wrapper">
                {/* Nivel 1: Título */}
                <div className="ev-level-1">
                    <div className="titulo-con-adjunto" style={{ display: 'flex', alignItems: 'center' }}>
                        <strong className="ev-titulo-principal">{ev.titulo}</strong>
                        {renderAdjuntos(ev.ruta_archivo)}
                    </div>
                </div>
                {/* Nivel 2: Asignatura */}
                <div className="ev-level-2">
                    <span className="asig-tag-evento">{ev.nombre_asignatura}</span>
                </div>
                {/* Nivel 3: Tipo */}
                <div className="ev-level-3">
                    <span className={`badge-tipo-color ${ev.tipo.toLowerCase().replace(/\s+/g, '')}`}>
                        {ev.tipo}
                    </span>
                </div>
            </div>

            <div className="ev-right-block">
                <div className="ev-fecha-badge">
                    <FiCalendar />
                    <span> {new Date(ev.completado ? ev.fecha_entrega : ev.fecha_vencimiento).toLocaleDateString()}</span>
                </div>

                <div className="actions-flex">
                    <button className="btn-check-action" onClick={() => onEntregar(ev)}>
                        <FiCheckCircle />
                    </button>
                    <button className="btn-edit-ghost" onClick={() => onEdit(ev)}>
                        <FiEdit2 />
                    </button>
                    <button className="btn-del-ghost" data-testid={`btn-delete-${ev.id}`} onClick={() => onDelete(ev.id, 'evento')}>
                        <FiTrash2 />
                    </button>
                </div>
            </div>
        </div>
    );
};