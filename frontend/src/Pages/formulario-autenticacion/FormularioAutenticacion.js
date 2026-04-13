import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./FormularioAutenticacion.css";


const FormularioAutenticacion = ({ tipo, setUsuario }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    // Estados comunes
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [mensaje, setMensaje] = useState({ texto: "", esError: false });
    const [loading, setLoading] = useState(false);
    const [recordar, setRecordar] = useState(false);

    useEffect(() => {
        if (tipo === "login") {
            const emailGuardado = localStorage.getItem("emailRecordado");
            if (emailGuardado) {
                setEmail(emailGuardado);
                setRecordar(true);
            }
        }
    }, [tipo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: "", esError: false });
        setLoading(true);

        // Validación de registro/restablecer contraseña
        if ((tipo === "registro" || tipo === "restablecer") && password !== confirmarPassword) {
            setMensaje({ texto: "Las contraseñas no coinciden", esError: true });
            setLoading(false);
            return;
        }

        try {
            let url = "";
            let body = {};

            if (tipo === "login") {
                url = "http://localhost:3001/api/login";
                body = { email, password };
            } else if (tipo === "registro") {
                url = "http://localhost:3001/api/registro";
                body = { nombre, apellidos, email, password };
            } else if (tipo === "recuperar") {
                url = "http://localhost:3001/api/forgot-password";
                body = { email };
            } else if (tipo === "restablecer") {
                url = "http://localhost:3001/api/reset-password";
                body = { token, password };
            }

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                if (tipo === "login") {

                    const usuarioParaGuardar = data.user;
                    if (setUsuario) setUsuario(usuarioParaGuardar);

                    localStorage.setItem("usuario", JSON.stringify(usuarioParaGuardar));

                    // Login exitoso
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }

                    // Lógica de recordar email
                    if (recordar) {
                        localStorage.setItem("emailRecordado", email);
                    } else {
                        localStorage.removeItem("emailRecordado");
                    }

                    navigate("/home");
                } else if (tipo === "registro") {
                    navigate("/", { state: { tipo: "login" } });
                } else if (tipo === "recuperar" || tipo === "restablecer") {
                    setMensaje({
                        texto: tipo === "recuperar" ? "Enlace enviado" : "Contraseña actualizada",
                        esError: false
                    });
                    if (tipo === "restablecer") setTimeout(() => navigate("/"), 2000);
                }
            } else {
                setMensaje({ texto: data.mensaje || "Error en la operación", esError: true });
            }
        } catch (error) {
            setMensaje({ texto: "Error de conexión con el servidor", esError: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {tipo === "login" && <h2>INICIAR SESIÓN</h2>}
                {tipo === "registro" && <h2>REGISTRO</h2>}
                {tipo === "recuperar" && <h2>RECUPERAR CONTRASEÑA</h2>}
                {tipo === "restablecer" && <h2>REESTABLECER CONTRASEÑA</h2>}

                <form onSubmit={handleSubmit}>
                    {tipo === "registro" && (
                        <>
                            <div className="input-group">
                                <label>Nombre *</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            </div>

                            <div className="input-group">
                                <label>Apellidos *</label>
                                <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
                            </div>
                        </>
                    )}

                    {(tipo === "login" || tipo === "registro" || tipo === "recuperar") && (
                        <div className="input-group">
                            <label>Email *</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    )}

                    {(tipo === "login" || tipo === "registro" || tipo === "restablecer") && (
                        <div className="input-group">
                            <label>Contraseña *</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    )}

                    {(tipo === "registro" || tipo === "restablecer") && (
                        <div className="input-group">
                            <label>Confirmar Contraseña *</label>
                            <input
                                type="password"
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {mensaje.texto && (
                        <p className={mensaje.esError ? "error-msg" : "success-msg"}>{mensaje.texto}</p>
                    )}

                    {tipo === "login" && (
                        <div className="input-group">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={recordar}
                                    onChange={(e) => setRecordar(e.target.checked)}
                                />
                                Recordar credenciales
                            </label>
                        </div>
                    )}

                    {tipo === "login" && (
                        <>
                            <div className="btn-group">
                                <button type="submit" className="btn-access">
                                    {loading ? "Accediendo..." : "Acceder"}
                                </button>
                                <button type="button" className="btn-register" onClick={() => navigate("/registro")}>
                                    Registrarse
                                </button>
                            </div>
                            <p className="forgot-password">
                                ¿Olvidaste la contraseña? <Link to="/recuperarpassword">Pincha aquí</Link>
                            </p>
                        </>
                    )}

                    {tipo === "registro" && (
                        <div className="btn-group">
                            <button type="submit" className="btn-access">
                                {loading ? "Registrando..." : "Enviar datos"}
                            </button>
                            <button type="button" className="btn-register" onClick={() => navigate("/")}>
                                Volver
                            </button>
                        </div>
                    )}

                    {tipo === "recuperar" && (
                        <div>
                            <button type="submit" className="btn-access">
                                {loading ? "Enviando..." : "Enviar enlace"}
                            </button>

                            <button type="button" className="btn-register" onClick={() => navigate("/")}>
                                Volver
                            </button>
                        </div>
                    )}

                    {tipo === "restablecer" && (
                        <button type="submit" className="btn-access">
                            {loading ? "Actualizando..." : "Actualizar contraseña"}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default FormularioAutenticacion;