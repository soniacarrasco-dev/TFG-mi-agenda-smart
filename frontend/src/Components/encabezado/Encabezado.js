import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import MenuLateral from '../menu-lateral/MenuLateral';
import logo from '../../assets/logo.png';
import './Encabezado.css';

const Encabezado = ({ usuario, setUsuario }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const toggleMenu = () => setMenuAbierto(!menuAbierto);

    return (
        <div className="layout-container">
            <header className="main-header">
                <div className="header-left">
                    {/* Menú hamburguesa visible solo en móvil dentro del header */}
                    <button className="hamburger-btn" onClick={toggleMenu}>
                        {menuAbierto ? <FiX size={26} /> : <FiMenu size={26} />}
                    </button>
                    <div className="bienvenida">
                        <h1>¡Hola, {usuario?.nombre || 'Usuario'}!</h1>
                    </div>
                </div>

                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo-img" />
                </div>
            </header>

            <div className="app-body">
                <MenuLateral abierto={menuAbierto} setAbierto={setMenuAbierto} setUsuario={setUsuario} />

                {menuAbierto && <div className="overlay" onClick={toggleMenu}></div>}

                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Encabezado;