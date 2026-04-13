import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Encabezado from "./Components/encabezado/Encabezado";
import Home from "./Pages/home/Home";
import GestionAcademica from "./Pages/gestion-academica/GestionAcademica";
import GestionProfesores from "./Pages/gestion-profesores/GestionProfesores";
import Ajustes from "./Pages/ajustes/Ajustes";
import FormularioAutenticacion from "./Pages/formulario-autenticacion/FormularioAutenticacion";
import CalendarioEventos from "./Components/Calendario/CalendarioEventos";
import PaginaCalendario from "./Pages/Calendario/PaginaCalendario";

function App() {
  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem('usuario');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const userLogueado = localStorage.getItem("usuario");
    if (userLogueado && !usuario) {
      setUsuario(JSON.parse(userLogueado));
    }
  }, [usuario]);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<FormularioAutenticacion tipo="login" setUsuario={setUsuario} />} />
        <Route path="/registro" element={<FormularioAutenticacion tipo="registro" />} />
        <Route path="/recuperarpassword" element={<FormularioAutenticacion tipo="recuperar" />} />
        <Route path="/reset-password" element={<FormularioAutenticacion tipo="restablecer" />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute usuario={usuario} />}>
          {/* Encabezado envuelve las rutas hijas */}
          <Route element={<Encabezado usuario={usuario} setUsuario={setUsuario} />}>
            <Route path="/home" element={<Home usuario={usuario} setUsuario={setUsuario} />} />
            <Route path="/gestionacademica" element={<GestionAcademica usuario={usuario} />} />
            <Route path="/gestionprofesores" element={<GestionProfesores usuario={usuario} />} />
            <Route path="/calendario" element={<PaginaCalendario usuario={usuario} />} />
            <Route path="/ajustes" element={<Ajustes />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;