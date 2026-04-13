import React, { useState, useEffect } from 'react';
import { FiMail, FiEdit2, FiTrash2, FiClock, FiPlus, FiX, FiUser } from 'react-icons/fi';
import './GestionProfesores.css';
import { ModalConfirmar } from '../gestion-academica/Modales/ModalesGestion';

// Constante para evitar duplicados y errores formato
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const GestionProfesores = ({ usuario }) => {
    const [profesores, setProfesores] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [idEnEdicion, setIdEnEdicion] = useState(null);
    const [errores, setErrores] = useState({});
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const [profesorAEliminar, setProfesorAEliminar] = useState(null);

    const [formProf, setFormProf] = useState({
        nombre_profesor: '',
        email_contacto: '',
        horario_tutorias: ''
    });

    useEffect(() => {
        if (usuario?.id) fetchProfesores();
    }, [usuario?.id]);

    const fetchProfesores = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/profesores/${usuario.id}`);
            const data = await res.json();
            setProfesores(data);
        } catch (error) { console.error(error); }
    };

    const abrirModal = (prof = null) => {
        setErrores({}); // Limpia errores previos al abrir
        if (prof) {
            setEditando(true);
            setIdEnEdicion(prof.id);
            setFormProf({
                nombre_profesor: prof.nombre_profesor,
                email_contacto: prof.email_contacto || '',
                horario_tutorias: prof.horario_tutorias || ''
            });
        } else {
            setEditando(false);
            setFormProf({ nombre_profesor: '', email_contacto: '', horario_tutorias: '' });
        }
        setMostrarModal(true);
    };

    // Manejador único para todos los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormProf(prev => ({ ...prev, [name]: value }));

        // Validación de email en tiempo real
        if (name === 'email_contacto') {
            if (value && !EMAIL_REGEX.test(value)) {
                setErrores(prev => ({ ...prev, email: "Formato de correo inválido (ejemplo@correo.com)" }));
            } else {
                setErrores(prev => ({ ...prev, email: null }));
            }
        }
    };

    const guardarProfesor = async (e) => {
        e.preventDefault();

        if (!EMAIL_REGEX.test(formProf.email_contacto)) {
            setErrores({ email: "El correo debe ser válido (ej: usuario@dominio.com)" });
            return;
        }

        const metodo = editando ? "PUT" : "POST";
        const url = editando
            ? `http://localhost:3001/api/profesores/${idEnEdicion}`
            : "http://localhost:3001/api/profesores";

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formProf, id_usuario: usuario.id })
            });
            if (res.ok) {
                fetchProfesores();
                setMostrarModal(false);
            }
        } catch (error) { console.error(error); }
    };

    // Abre el modal y guarda el ID del profesor
    const prepararEliminacion = (id) => {
        setProfesorAEliminar(id);
        setMostrarConfirmar(true);
    };

    // Se ejecuta solo cuando el usuario hace clic en "Eliminar" en el modal
    const confirmarEliminacion = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/profesores/${profesorAEliminar}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchProfesores();
                setMostrarConfirmar(false); // Cerramos el modal
                setProfesorAEliminar(null); // Limpiamos el ID
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="gestion-profes-container">
            <header className="profes-header">
                <div>
                    <h1>MIS PROFESORES</h1>
                    <p>Gestiona los contactos y horarios de tus docentes.</p>
                </div>
                <button className="btn-add-prof" onClick={() => abrirModal()}>
                    <FiPlus /> Nuevo Profesor
                </button>
            </header>

            <div className="profes-grid">
                {profesores.map(prof => (
                    <div key={prof.id} className="prof-card">
                        <div className="prof-card-top">
                            <div className="prof-avatar-circle"><FiUser /></div>
                            <div className="prof-card-actions">
                                <button onClick={() => abrirModal(prof)} className="btn-edit-ghost"><FiEdit2 /></button>
                                <button onClick={() => prepararEliminacion(prof.id)} className="btn-del-ghost"><FiTrash2 /></button>
                            </div>
                        </div>

                        <div className="prof-card-body">
                            <h3>{prof.nombre_profesor}</h3>
                            <div className="info-row">
                                <FiMail /> <span>{prof.email_contacto || 'Sin email'}</span>
                            </div>
                            <div className="info-row">
                                <FiClock /> <span>{prof.horario_tutorias || 'Sin horario de tutoría'}</span>
                            </div>
                        </div>

                        <a href={`mailto:${prof.email_contacto}`} className="btn-send-mail">
                            <FiMail /> Enviar correo
                        </a>
                    </div>
                ))}
            </div>

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-prof-content">
                        <div className="modal-prof-header">
                            <h3>{editando ? "Editar Profesor" : "Nuevo Profesor"}</h3>
                            <button className='btn-close' onClick={() => setMostrarModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={guardarProfesor}>
                            <div className="prof-form-group">
                                <label>Nombre Completo</label>
                                <input
                                    name="nombre_profesor"
                                    type="text"
                                    required
                                    value={formProf.nombre_profesor}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof-form-group">
                                <label>Email de Contacto</label>
                                <input
                                    name="email_contacto"
                                    type="email"
                                    className={errores.email ? 'input-error' : ''}
                                    value={formProf.email_contacto}
                                    onChange={handleInputChange}
                                />
                                {errores.email && <span className="error-text">{errores.email}</span>}
                            </div>
                            <div className="prof-form-group">
                                <label>Horario de Tutorías</label>
                                <input
                                    name="horario_tutorias"
                                    type="text"
                                    placeholder="Ej: Martes 10:00 - 12:00"
                                    value={formProf.horario_tutorias}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-save-prof"
                                disabled={!!errores.email || !formProf.nombre_profesor}
                            >
                                {editando ? "Actualizar Datos" : "Crear Profesor"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <ModalConfirmar
                abierto={mostrarConfirmar}
                item={{ tipo: 'profesor y sus datos asociados' }}
                onConfirm={confirmarEliminacion}
                onCancel={() => setMostrarConfirmar(false)}
            />
        </div>
    );
};

export default GestionProfesores;