import React from 'react';
import { FiX } from 'react-icons/fi';
import './ModalesGestion.css';

// MODAL CONFIRMAR ELIMINACIÓN
export const ModalConfirmar = ({ abierto, item, onConfirm, onCancel, btnRef }) => {
    if (!abierto) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ textAlign: 'center', padding: '30px' }}>
                <h3 style={{ color: '#194f58' }}>¿Estás seguro?</h3>
                <p>Esta acción eliminará el/la <strong>{item?.tipo}</strong>.</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
                    <button ref={btnRef} type="button" className="btn-toggle-historial" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="button" className="btn-save-mini" onClick={onConfirm} style={{ background: '#F36766', color: 'white' }}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// MODAL ENTREGA DE TAREA/EXAMEN
export const ModalEntrega = ({ abierto, evento, fecha, setFecha, onConfirm, onCancel }) => {
    if (!abierto) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(e);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Marcar como ENTREGADO</h3>
                    <button type="button" className="btn-close" onClick={onCancel}>
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Fecha de entrega para: <strong>{evento?.titulo}</strong></label>
                        <input
                            type="date"
                            required
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button type="button" className="btn-toggle-historial" onClick={onCancel} style={{ flex: 1 }}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save-full" style={{ flex: 2, margin: 0 }}>
                            Confirmar Entrega
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};