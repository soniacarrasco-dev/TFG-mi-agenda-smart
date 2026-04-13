import React, { useState, useEffect } from 'react';
import './Ajustes.css';

const Ajustes = ({ token: tokenProp }) => {
    const token = tokenProp || localStorage.getItem('token');

    const [perfil, setPerfil] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        contraseñaActual: '',
        nuevaContraseña: '',
        repetirContraseña: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    // Cargar datos actuales
    useEffect(() => {

        async function fetchPerfil() {
            if (!token) {
                return;
            }

            try {
                const res = await fetch('http://localhost:3001/api/perfil', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Error cargando perfil');
                const data = await res.json();
                setPerfil(p => ({
                    ...p,
                    nombre: data.nombre || '',
                    apellidos: data.apellidos || '',
                    email: data.email || ''
                }));
            } catch (err) {
                setError('No se pudieron cargar los datos');
                console.error(err);
            }
        }
        fetchPerfil();
    }, [token]);

    const handleChange = e => {
        setPerfil({ ...perfil, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMensaje('');
        setError('');

        if (perfil.nuevaContraseña !== perfil.repetirContraseña) {
            setError('Las nuevas contraseñas no coinciden');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: perfil.nombre || '',
                    apellidos: perfil.apellidos || '',
                    email: perfil.email || '',
                    contraseñaActual: perfil.contraseñaActual,
                    nuevaContraseña: perfil.nuevaContraseña
                })
            });

            const resultado = await res.json();

            if (!res.ok) {
                throw new Error(resultado.mensaje || 'Error al actualizar');
            }

            setMensaje(resultado.mensaje);

            setPerfil(prev => ({
                ...prev,
                contraseñaActual: '',
                nuevaContraseña: '',
                repetirContraseña: ''
            }));
        } catch (err) {
            setError(err.message || 'Error al actualizar perfil');
        }
    };

    return (
        <div className="ajustes-container">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="form-ajustes">
                <div className="form-group">
                    <label>Nombre de usuario:</label>
                    <input type="text" name="nombre" value={perfil.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Apellidos:</label>
                    <input type="text" name="apellidos" value={perfil.apellidos} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={perfil.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Contraseña actual:</label>
                    <input type="password" name="contraseñaActual" value={perfil.contraseñaActual} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Nueva contraseña:</label>
                    <input type="password" name="nuevaContraseña" value={perfil.nuevaContraseña} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Repetir nueva contraseña:</label>
                    <input type="password" name="repetirContraseña" value={perfil.repetirContraseña} onChange={handleChange} />
                </div>

                <button type="submit" className="btn-ajustes-save">Aplicar cambios</button>

                {mensaje && <p className="mensaje-exito">{mensaje}</p>}
                {error && <p className="mensaje-error">{error}</p>}
            </form>
        </div>
    );
};

export default Ajustes;