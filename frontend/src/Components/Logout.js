const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    sessionStorage.removeItem("user");

    if (setUsuario) {
        setUsuario(null);
    }

    navigate("/");
    window.location.reload();
};