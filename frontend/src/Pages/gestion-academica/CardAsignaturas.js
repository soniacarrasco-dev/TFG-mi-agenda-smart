import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './CardAsignaturas.css';

const CardAsignaturas = ({ asig, isSelected, onSelect, onEdit, onDelete }) => {
    return (
        <div
            className={`asig-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(asig.id)}
        >
            <div className="asig-info">
                <strong className="asig-nombre">{asig.nombre_asignatura}</strong>
                <span className="asig-profesor">
                    {asig.nombre_profesor || 'Sin profesor'}
                </span>
            </div>
            <div className="asig-actions">
                <button
                    className="btn-edit-ghost"
                    onClick={(e) => { e.stopPropagation(); onEdit(asig); }}
                >
                    <FiEdit2 />
                </button>
                <button
                    className="btn-del-ghost"
                    onClick={(e) => { e.stopPropagation(); onDelete(asig.id, 'asignatura'); }}
                >
                    <FiTrash2 />
                </button>
            </div>
        </div>
    );
};

export default CardAsignaturas;