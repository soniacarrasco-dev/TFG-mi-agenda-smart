import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiFilter, FiX, FiUserPlus, FiFile, FiPaperclip } from 'react-icons/fi';
import './GestionAcademica.css';
import CardAsignaturas from './CardAsignaturas';
import CardTareasHist from './CardTareasHist';
import { ModalConfirmar, ModalEntrega } from './Modales/ModalesGestion';
import { CardTareasPtes } from "./CardTareasPtes";
import { useLocation } from "react-router-dom";

const GestionAcademica = ({ usuario }) => {
    const location = useLocation();

    // --- ESTADOS ---
    const [asignaturas, setAsignaturas] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [filtroAsignatura, setFiltroAsignatura] = useState(null);
    const [verCompletados, setVerCompletados] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState('Todos');

    // Modales y Edición
    const [mostrarModalAsig, setMostrarModalAsig] = useState(false);
    const [mostrarModalEvento, setMostrarModalEvento] = useState(false);
    const [mostrarModalEntrega, setMostrarModalEntrega] = useState(false);
    const [mostrarModalConfirm, setMostrarModalConfirm] = useState(false);
    const [mostrarFormProfesor, setMostrarFormProfesor] = useState(false);

    const [itemAEliminar, setItemAEliminar] = useState(null);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [editando, setEditando] = useState(false);
    const [idEnEdicion, setIdEnEdicion] = useState(null);
    const [fechaEntrega, setFechaEntrega] = useState(new Date().toISOString().split('T')[0]);

    // Formularios
    const [nuevaAsig, setNuevaAsig] = useState({ nombre_asignatura: '', id_profesor: '' });
    const [nuevoProf, setNuevoProf] = useState({ nombre_profesor: '', email_contacto: '' });
    const [nuevoEvento, setNuevoEvento] = useState({ titulo: '', tipo: 'Tarea', fecha: '', id_asignatura: '' });

    const btnCancelarRef = useRef(null);
    const emailRef = useRef(null);

    // --- EFECTOS ---
    useEffect(() => {
        // Sincroniza la lista de asignaturas y eventos cuando cambia el usuario activo.
        if (usuario?.id) {
            fetchDatos();
            fetchProfesores();
        }
    }, [usuario?.id]);

    const [modalAbiertoDesdeNav, setModalAbiertoDesdeNav] = useState(false);

    useEffect(() => {
        const idSurgido = location.state?.editarEventoId;

        if (!idSurgido) return;

        if (eventos.length === 0) return;

        if (modalAbiertoDesdeNav) return;

        const eventoEncontrado = eventos.find(e => e.id === idSurgido);

        if (!eventoEncontrado) {
            console.warn("Evento no encontrado todavía");
            return;
        }

        console.log("Abriendo modal desde navegación...");

        prepararEdicionEvento(eventoEncontrado);

        setModalAbiertoDesdeNav(true);

        // Limpiamos el state de navegación
        window.history.replaceState({}, document.title);

    }, [eventos, location.state, modalAbiertoDesdeNav]);

    useEffect(() => {
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(data => setEventos(data));
    }, []);

    // --- FUNCIONES API ---
    /**
     * Recupera la lista de profesores asociados al usuario autenticado.
     */
    const fetchProfesores = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/profesores/${usuario.id}`);
            setProfesores(await res.json());
        } catch (error) { console.error(error); }
    };

    /**
     * Recupera asignaturas y eventos en paralelo para minimizar latencia.
     */
    const fetchDatos = async () => {
        try {
            const [resAsig, resEv] = await Promise.all([
                fetch(`http://localhost:3001/api/asignaturas/${usuario.id}`),
                fetch(`http://localhost:3001/api/eventos/${usuario.id}`)
            ]);
            setAsignaturas(await resAsig.json());
            setEventos(await resEv.json());
        } catch (err) { console.error(err); }
    };

    // FUNCIÓN PARA GUARDAR NUEVO PROFESOR
    /**
     * Crea un nuevo profesor y actualiza el selector de asignaturas.
     * Valida el correo solo si se ha proporcionado.
     */
    const guardarProfesor = async (e) => {
        e.preventDefault();

        if (nuevoProf.email_contacto && !emailRef.current.checkValidity()) {
            emailRef.current.reportValidity();
            return;
        }

        const datosParaEnviar = {
            nombre_profesor: nuevoProf.nombre_profesor,
            email_contacto: nuevoProf.email_contacto || '',
            horario_tutorias: nuevoProf.horario_tutorias || '',
            id_usuario: usuario.id
        };

        try {
            const res = await fetch("http://localhost:3001/api/profesores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosParaEnviar)
            });

            if (res.ok) {
                const data = await res.json();
                await fetchProfesores();
                setNuevaAsig({ ...nuevaAsig, id_profesor: data.id });
                setNuevoProf({ nombre_profesor: '', email_contacto: '', horario_tutorias: '' });
                setMostrarFormProfesor(false);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    /**
     * Elimina un evento o una asignatura y mantiene el estado local coherente.
     * Al borrar una asignatura también elimina sus eventos relacionados.
     */
    const ejecutarEliminacion = async () => {
        const { id, tipo } = itemAEliminar;
        const ruta = tipo === 'evento' ? `eventos/${id}` : `asignaturas/${id}`;
        try {
            const res = await fetch(`http://localhost:3001/api/${ruta}`, { method: 'DELETE' });
            if (res.ok) {
                if (tipo === 'evento') {
                    setEventos(eventos.filter(e => e.id !== id));
                } else {
                    setAsignaturas(asignaturas.filter(a => a.id !== id));
                    setEventos(eventos.filter(e => e.id_asignatura !== id));
                }
                setMostrarModalConfirm(false);
            }
        } catch (error) { console.error(error); }
    };

    /**
     * Crea o actualiza una asignatura según el modo de edición.
     * Mantiene la relación con el usuario actual.
     */
    const guardarAsignatura = async (e) => {
        e.preventDefault();
        const metodo = editando ? "PUT" : "POST";
        const url = editando ? `http://localhost:3001/api/asignaturas/${idEnEdicion}` : "http://localhost:3001/api/asignaturas";

        const datosFinales = {
            nombre_asignatura: nuevaAsig.nombre_asignatura,
            id_profesor: nuevaAsig.id_profesor,
            id_usuario: usuario.id
        }

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosFinales)
            });

            if (res.ok) {
                await fetchDatos();
                cerrarModales();
            } else {
                const errorData = await res.json();
                console.error("Error al guardar asginatura:", errorData.error);
            }
        } catch (error) { console.error("Error de conexión:", error); }
    };

    /**
     * Crea o actualiza un evento, gestionando adjuntos y campos de fecha.
     * En modo edición preserva estado de completado y rutas de archivo existentes.
     */
    const guardarEvento = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Campos obligatorios
        formData.append('titulo', nuevoEvento.titulo);
        formData.append('tipo', nuevoEvento.tipo);
        formData.append('id_asignatura', nuevoEvento.id_asignatura);
        formData.append('id_usuario', usuario.id);

        // Gestión de fechas y estados de edición
        const fechaConHora = `${nuevoEvento.fecha}T12:00:00`;
        if (editando) {
            formData.append('fecha_vencimiento', fechaConHora);
            formData.append('nota', nuevoEvento.nota || 0);
            formData.append('completado', nuevoEvento.completado || false);
            formData.append('ruta_archivo_existente', nuevoEvento.ruta_archivo || '');
        } else {
            formData.append('fecha', fechaConHora);
        }

        // ARCHIVOS
        if (nuevoEvento.archivos && nuevoEvento.archivos.length > 0) {
            nuevoEvento.archivos.forEach((archivo) => {
                formData.append('archivos', archivo);
            });
        }

        // ENVÍO
        try {
            const url = editando
                ? `http://localhost:3001/api/eventos/${idEnEdicion}`
                : `http://localhost:3001/api/eventos`;

            const res = await fetch(url, {
                method: editando ? "PUT" : "POST",
                body: formData
            });

            if (res.ok) {
                await fetchDatos();
                cerrarModales();
            } else {
                const errorData = await res.json();
                alert("Error al guardar: " + (errorData.error || "Revisa los campos obligatorios"));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error crítico de conexión con el servidor");
        }
    };

    /**
     * Resetea los estados de modal y los formularios al cerrar cualquier diálogo.
     */
    const cerrarModales = () => {
        setMostrarModalAsig(false);
        setMostrarModalEvento(false);
        setEditando(false);
        setIdEnEdicion(null);
        setMostrarFormProfesor(false);
        setNuevaAsig({ nombre_asignatura: '', id_profesor: '' });
        setNuevoEvento({ titulo: '', tipo: 'Tarea', fecha: '', id_asignatura: '' });
    };

    const prepararEdicionAsig = (asig) => {
        setEditando(true); setIdEnEdicion(asig.id);
        setNuevaAsig({ nombre_asignatura: asig.nombre_asignatura, id_profesor: asig.id_profesor || '' });
        setMostrarModalAsig(true);
    };

    /**
     * Prepara el formulario de edición de evento, normalizando la fecha para el input.
     * Ajusta la fecha recuperada del servidor para evitar cambios indeseados por zona horaria.
     */
    const prepararEdicionEvento = (ev) => {
        setEditando(true);
        setIdEnEdicion(ev.id);

        let fechaParaInput = "";

        if (ev.fecha_vencimiento) {
            const d = new Date(ev.fecha_vencimiento);
            d.setHours(d.getHours() + 12);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');

            fechaParaInput = `${year}-${month}-${day}`;
        }

        setNuevoEvento({
            ...ev,
            fecha: fechaParaInput,
            id_asignatura: ev.id_asignatura
        });

        setMostrarModalEvento(true);
    };

    // Filtra los eventos por asignatura, estado (Pendiente/Historial) y tipo de evento (Tarea/Examen/Videoconferencia) según los filtros activos.
    const eventosFiltrados = eventos.filter(ev => {
        const coincideAsig = filtroAsignatura ? Number(ev.id_asignatura) === Number(filtroAsignatura) : true;
        const coincideEstado = verCompletados ? ev.completado : !ev.completado;

        // Nuevo filtro por tipo (Tarea/Examen)
        const coincideTipo = filtroTipo === 'Todos' ? true : ev.tipo === filtroTipo;

        return coincideAsig && coincideEstado && coincideTipo;
    });


    /**
     * Calcula la nota media de los eventos completados para la asignatura y tipo de evento seleccionados en los filtros.
     * Excluye valores no numéricos y notas vacías para evitar distorsionar el promedio.
     */
    const calcularMediaPonderada = () => {
        if (!filtroAsignatura) return null;

        const eventosAsig = eventos.filter(ev =>
            Number(ev.id_asignatura) === Number(filtroAsignatura) && ev.completado
        );

        // Filtro de notas: elimina nulos/vacíos y valida rango 0-10
        const notasTareas = eventosAsig
            .filter(e => {
                const n = parseFloat(e.nota);
                return e.tipo === 'Tarea' && e.nota !== null && e.nota !== undefined && e.nota !== '' && !isNaN(n) && n >= 0 && n <= 10;
            })
            .map(e => Number(e.nota));

        const notasExamenes = eventosAsig
            .filter(e => {
                const n = parseFloat(e.nota);
                return e.tipo === 'Examen' && e.nota !== null && e.nota !== undefined && e.nota !== '' && !isNaN(n) && n >= 0 && n <= 10;
            })
            .map(e => Number(e.nota));

        const mediaT = notasTareas.length > 0 ? notasTareas.reduce((a, b) => a + b, 0) / notasTareas.length : null;
        const mediaE = notasExamenes.length > 0 ? notasExamenes.reduce((a, b) => a + b, 0) / notasExamenes.length : null;

        // Retorno según filtro seleccionado
        if (filtroTipo === 'Tarea') return mediaT !== null ? mediaT.toFixed(2) : null;
        if (filtroTipo === 'Examen') return mediaE !== null ? mediaE.toFixed(2) : null;

        // Retorno General (Ponderación 70/30)
        if (mediaT !== null && mediaE !== null) {
            return ((mediaT * 0.7) + (mediaE * 0.3)).toFixed(2);
        } else if (mediaT !== null) {
            return mediaT.toFixed(2); // Solo tareas disponibles
        } else if (mediaE !== null) {
            return mediaE.toFixed(2); // Solo exámenes disponibles
        }

        return null;
    };

    const nombresPlurales = {
        'Todos': 'Total',
        'Tarea': 'Tareas',
        'Examen': 'Exámenes'
    };

    const notaMedia = calcularMediaPonderada();

    // Función para eliminar un archivo de la lista de rutas existentes (solo en edición)
    /**
     * Elimina una ruta de archivo existente del evento en edición.
     * Mantiene las rutas restantes como una cadena separada por comas.
     */
    const eliminarRutaArchivo = (rutaAEliminar) => {
        const nuevasRutas = nuevoEvento.ruta_archivo
            .split(',')
            .filter(ruta => ruta !== rutaAEliminar)
            .join(',');

        setNuevoEvento({ ...nuevoEvento, ruta_archivo: nuevasRutas });
    };

    return (
        <div className="home-container">
            <main className="dashboard-grid">
                <section className="vencimientos-section">
                    <div className="section-header-flex">
                        <h3>MIS ASIGNATURAS</h3>
                        <button data-testid="btn-nueva-asignatura" className="btn-add-small" onClick={() => { setEditando(false); setMostrarModalAsig(true); }}><FiPlus /></button>
                    </div>
                    <div className="card-lista">
                        <p className="card-text">Filtra por asignatura y consulta su nota media en el historial.</p>
                        <button className={`btn-filter-all ${!filtroAsignatura ? 'active' : ''}`} onClick={() => setFiltroAsignatura(null)}>
                            <FiFilter /> Todas
                        </button>

                        <div className="lista-items">
                            {asignaturas.map(asig => (
                                <CardAsignaturas
                                    key={asig.id} asig={asig}
                                    isSelected={filtroAsignatura === asig.id}
                                    onSelect={setFiltroAsignatura}
                                    onEdit={prepararEdicionAsig}
                                    onDelete={(id, tipo) => { setItemAEliminar({ id, tipo }); setMostrarModalConfirm(true); }}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="calendario-section">
                    <div className="section-header-flex">
                        <h3>{verCompletados ? "HISTORIAL" : "PENDIENTES"}</h3>
                        <div className="header-actions">
                            <button onClick={() => setVerCompletados(!verCompletados)} className="btn-toggle-historial">
                                {verCompletados ? "Ver Pendientes" : "Ver Historial"}
                            </button>
                            <button data-testid="btn-nuevo-evento" className="btn-add-small" onClick={() => { setEditando(false); setMostrarModalEvento(true); }}><FiPlus /></button>
                        </div>
                    </div>
                    <div className="card-lista">
                        <p className="card-text">
                            {verCompletados
                                ? "Revisa tus calificaciones y el progreso de tus tareas entregadas."
                                : "Aquí puedes ver tus tareas, exámenes y videoconferencias pendientes."}
                        </p>
                        {/* Visualización de la Nota Media si hay una asignatura seleccionada */}
                        {filtroAsignatura && verCompletados && (
                            <div className="media-info-wrapper">
                                <div className="filtro-tipo-header">
                                    <label><FiFilter size={14} /> Filtrar vista:</label>
                                    <select
                                        value={filtroTipo}
                                        onChange={(e) => setFiltroTipo(e.target.value)}
                                        className="select-tipo-nota"
                                    >
                                        <option value="Todos">Resumen (70% Tarea / 30% Exam)</option>
                                        <option value="Tarea">Solo Tareas (Media 70%)</option>
                                        <option value="Examen">Solo Exámenes (Media 30%)</option>
                                    </select>
                                </div>

                                <div className="media-info-box">
                                    <span>
                                        {filtroTipo === 'Todos' ? 'Nota final estimada:' : `Media de ${nombresPlurales[filtroTipo]}:`}
                                    </span>
                                    {notaMedia !== null ? (
                                        <strong className={parseFloat(notaMedia) >= 5 ? 'nota-aprobada' : 'nota-suspensa'}>
                                            {notaMedia}
                                        </strong>
                                    ) : (
                                        <span className="sin-notas-txt">Pendiente de calificar</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {eventosFiltrados.map(ev => (
                            verCompletados ? (
                                <CardTareasHist
                                    key={ev.id}
                                    ev={ev}
                                    onEdit={prepararEdicionEvento}
                                    onDelete={(id, tipo) => { setItemAEliminar({ id, tipo }); setMostrarModalConfirm(true); }}
                                    onGuardarNota={async (id, nuevaNota) => {
                                        try {
                                            const evActual = eventos.find(e => e.id === id);
                                            const res = await fetch(`http://localhost:3001/api/eventos/${id}`, {
                                                method: "PUT",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    ...evActual,
                                                    // Forzamos el envío de null explícito si la nota está vacía
                                                    nota: (nuevaNota === "" || nuevaNota === null) ? null : nuevaNota,
                                                    completado: true
                                                })
                                            });
                                            if (res.ok) {
                                                setEventos(prev => prev.map(e => e.id === id ? { ...e, nota: nuevaNota } : e));
                                            }
                                        } catch (err) { console.error(err); }
                                    }}
                                />
                            ) : (
                                <CardTareasPtes
                                    key={ev.id}
                                    ev={ev}
                                    onEntregar={(e) => { setEventoSeleccionado(e); setMostrarModalEntrega(true); }}
                                    onEdit={prepararEdicionEvento}
                                    onDelete={(id, tipo) => { setItemAEliminar({ id, tipo }); setMostrarModalConfirm(true); }}
                                />
                            )
                        ))}
                    </div>
                </section>
            </main>

            <ModalConfirmar
                abierto={mostrarModalConfirm} item={itemAEliminar}
                onConfirm={ejecutarEliminacion} onCancel={() => setMostrarModalConfirm(false)} btnRef={btnCancelarRef}
            />

            <ModalEntrega
                abierto={mostrarModalEntrega}
                evento={eventoSeleccionado}
                fecha={fechaEntrega}
                setFecha={setFechaEntrega}
                onCancel={() => setMostrarModalEntrega(false)}
                onConfirm={async (e) => {
                    if (e) e.preventDefault();

                    try {
                        const url = `http://localhost:3001/api/eventos/${eventoSeleccionado.id}`;

                        const prepararFechaParaSQL = (fecha) => {
                            if (!fecha) return null;
                            return fecha.replaceAll('/', '-');
                        };

                        const cuerpoPeticion = {
                            titulo: eventoSeleccionado.titulo,
                            nota: /* (eventoSeleccionado.nota !== undefined && eventoSeleccionado.nota !== "")
                                ? eventoSeleccionado.nota
                                :  */null,
                            completado: true,
                            fecha_vencimiento: prepararFechaParaSQL(eventoSeleccionado.fecha_vencimiento),
                            fecha_entrega: prepararFechaParaSQL(fechaEntrega)
                        };

                        console.log("Datos que viajan al servidor:", cuerpoPeticion);
                        console.log("Fecha a enviar:", fechaEntrega);

                        const res = await fetch(url, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(cuerpoPeticion)
                        });

                        if (res.ok) {
                            fetchDatos();
                            setMostrarModalEntrega(false);
                        } else {
                            const errorServer = await res.json();
                            console.error("Error del servidor:", errorServer.error);
                        }
                    } catch (err) {
                        console.error("Error de conexión:", err);
                    }
                }}
            />
            {/* MODAL ASIGNATURA */}
            {mostrarModalAsig && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editando ? "Editar Asignatura" : "Nueva Asignatura"}</h3>
                            <button className="btn-close" onClick={cerrarModales}><FiX /></button>
                        </div>
                        <form onSubmit={guardarAsignatura} className="form-gestion">
                            <div className="form-group">
                                <label>Nombre de la Asignatura</label>
                                <input type="text" required value={nuevaAsig.nombre_asignatura} onChange={(e) => setNuevaAsig({ ...nuevaAsig, nombre_asignatura: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Seleccionar Profesor</label>
                                <div className="input-with-button">
                                    <select required value={nuevaAsig.id_profesor} onChange={(e) => setNuevaAsig({ ...nuevaAsig, id_profesor: e.target.value })}>
                                        <option value="">Selecciona un profesor...</option>
                                        {profesores.map(p => <option key={p.id} value={p.id}>{p.nombre_profesor}</option>)}
                                    </select>
                                    {!editando && (
                                        <button
                                            type="button"
                                            className={`btn-add-ghost ${mostrarFormProfesor ? 'active' : ''}`}
                                            title="Añadir nuevo profesor"
                                            onClick={() => setMostrarFormProfesor(!mostrarFormProfesor)}
                                        >
                                            <FiUserPlus size={20} strokeWidth={1.5} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* MINI FORMULARIO PROFESOR */}
                            {mostrarFormProfesor && (
                                <div className="mini-form-container">
                                    <h4 className="mini-form-title">Datos del Nuevo Profesor</h4>
                                    <input
                                        type="text" placeholder="Nombre completo *" className="input-modal-small" required
                                        value={nuevoProf.nombre_profesor} onChange={(e) => setNuevoProf({ ...nuevoProf, nombre_profesor: e.target.value })}
                                    />
                                    <input
                                        ref={emailRef}
                                        type="email"
                                        placeholder="Correo electrónico (opcional)"
                                        className="input-modal-small"
                                        value={nuevoProf.email_contacto}
                                        onChange={(e) => setNuevoProf({ ...nuevoProf, email_contacto: e.target.value })}
                                    />
                                    <div className="mini-form-actions">
                                        <button type="button" className="btn-save-mini" onClick={guardarProfesor}>
                                            Guardar Profesor
                                        </button>
                                        <button type="button" className="btn-cancel-mini" onClick={() => setMostrarFormProfesor(false)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn-save-full main-action">
                                {editando ? "Guardar cambios" : "Finalizar y crear asignatura"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EVENTO */}
            {mostrarModalEvento && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editando ? "Editar Evento" : "Nuevo Evento"}</h3>
                            <button className="btn-close" onClick={cerrarModales}><FiX /></button>
                        </div>
                        <form onSubmit={guardarEvento}>
                            <div className="form-group">
                                <label className="ev-titulo-principal">Título</label>
                                <input type="text" required value={nuevoEvento.titulo} onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Tipo</label>
                                <select value={nuevoEvento.tipo} onChange={(e) => setNuevoEvento({ ...nuevoEvento, tipo: e.target.value })}>
                                    <option value="Tarea">Tarea</option>
                                    <option value="Examen">Examen</option>
                                    <option value="Videoconferencia">Videoconferencia</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Asignatura</label>
                                <select required value={nuevoEvento.id_asignatura} onChange={(e) => setNuevoEvento({ ...nuevoEvento, id_asignatura: e.target.value })}>
                                    <option value="">Selecciona...</option>
                                    {asignaturas.map(asig => <option key={asig.id} value={asig.id}>{asig.nombre_asignatura}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Fecha vencimiento</label>
                                <input
                                    type="date"
                                    required
                                    value={nuevoEvento.fecha || ""}
                                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="add-file" className="input-file-custom">
                                    <FiFile />
                                    <span>
                                        {nuevoEvento.archivos?.length > 0
                                            ? `${nuevoEvento.archivos.length} archivos seleccionados`
                                            : "Adjuntar archivos (Máx. 5)"}
                                    </span>
                                </label>
                                {editando && nuevoEvento.ruta_archivo && (
                                    <div className="archivos-actuales-edit">
                                        <label>Archivos actuales:</label>
                                        <div className="lista-adjuntos-edit">
                                            {nuevoEvento.ruta_archivo.split(',').map((ruta, index) => (
                                                <div key={index} className="item-adjunto-edit">
                                                    <span><FiPaperclip /> {ruta.split('-').pop()}</span> {/* Muestra solo el nombre original */}
                                                    <button
                                                        type="button"
                                                        className="btn-remove-file"
                                                        onClick={() => eliminarRutaArchivo(ruta)}
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="add-file"
                                    multiple
                                    className="input-file-oculto"
                                    onChange={(e) => {
                                        const filesArray = Array.from(e.target.files);
                                        setNuevoEvento({ ...nuevoEvento, archivos: filesArray });
                                    }}
                                />
                            </div>
                            {nuevoEvento.archivos?.length > 0 && (
                                <ul className="file-list-preview">
                                    {nuevoEvento.archivos.map((f, i) => (
                                        <li key={i}><FiPaperclip /> {f.name}</li>
                                    ))}
                                </ul>
                            )}
                            <button data-testid="btn-guardar-evento" type="submit" className="btn-save-full">{editando ? "Guardar cambios" : "Crear Evento"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionAcademica;