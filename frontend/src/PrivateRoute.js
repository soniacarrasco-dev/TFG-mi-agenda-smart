import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ usuario }) {
    const token = localStorage.getItem("token"); // Revisa si hay token

    return token && usuario ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;