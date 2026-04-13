import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiBookOpen, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import './MenuLateral.css';

const MenuLateral = ({ abierto, setAbierto, setUsuario }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const cerrarSesion = () => {
        setUsuario(null);
        localStorage.removeItem("user");
        navigate("/login");
    };

    const menuItems = [
        { name: 'Home', path: '/home', icon: <FiHome /> },
        { name: 'Calendario', path: '/calendario', icon: <FiCalendar /> },
        { name: 'Gestión Académica', path: '/gestionacademica', icon: <FiBookOpen /> },
        { name: 'Profesores', path: '/gestionprofesores', icon: <FiUser /> },
        { name: 'Editar Perfil', path: '/ajustes', icon: <FiSettings /> },
    ];

    return (
        <aside className={`menu-lateral ${abierto ? 'abierto' : ''}`}>
            <nav className="menu-nav">
                <ul className="menu-list">
                    {menuItems.map((item) => (
                        <li key={item.name} className="menu-item">
                            <Link
                                to={item.path}
                                className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={() => setAbierto(false)}
                            >
                                <span className="menu-icon">{item.icon}</span>
                                <span className="menu-text">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Botón de Logout */}
                <div className="menu-footer">
                    <button className="menu-link logout-item" onClick={cerrarSesion}>
                        <span className="menu-icon"><FiLogOut /></span>
                        <span className="menu-text">Cerrar Sesión</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default MenuLateral;