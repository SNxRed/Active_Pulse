import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleSignOut = () => {
    navigate("/logout"); // Redirige a la ruta de logout para que el componente Logout maneje el cierre de sesión
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);

      const { data: subscription } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUser(session?.user);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    fetchSession();
  }, []);

  const goToUserProfile = () => {
    if (user) {
      navigate("/userprofile"); // Navegar a la página de perfil de usuario
    } else {
      navigate("/user"); // Redirigir a '/user' si no hay sesión
    }
  };

  const goToLogin = () => {
    navigate("/login"); // Redirigir a la página de inicio de sesión
  };

  return (
    <nav className="navbar">
      <img
        src="https://ymjjininyltkzfajvwvd.supabase.co/storage/v1/object/public/uploads/public/Images/logo-main.png"
        alt="Active Pulse Logo"
        className="navbar-logo"
      />
      <div className="navbar-buttons">
        {user ? (
          <>
            <button onClick={goToUserProfile} className="navbar-button">
              Mi perfil
            </button>
            <button onClick={() => navigate("/user")} className="navbar-button">
              Inicio
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="navbar-button"
            >
              Admin
            </button>
            <button
              onClick={() => navigate("/admin-panel")}
              className="navbar-button"
            >
              Panel Admin
            </button>
            <button
              onClick={() => navigate("/booking")}
              className="navbar-button"
            >
              Reservar
            </button>
            <button
              onClick={() => navigate("/reviews")}
              className="navbar-button"
            >
              Ver testimonios
            </button>
            <button
              onClick={() => navigate("/create_review")}
              className="navbar-button"
            >
              Crear testimonio
            </button>
            <button onClick={handleSignOut} className="navbar-button">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button onClick={goToLogin} className="navbar-button">
              Iniciar sesión
            </button>
            <button onClick={() => navigate("/user")} className="navbar-button">
              Inicio
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="navbar-button"
            >
              Admin
            </button>
            <button
              onClick={() => navigate("/admin-panel")}
              className="navbar-button"
            >
              Panel Admin
            </button>
            <button
              onClick={() => navigate("/booking")}
              className="navbar-button"
            >
              Reservar
            </button>
            <button
              onClick={() => navigate("/reviews")}
              className="navbar-button"
            >
              Ver testimonios
            </button>
            <button
              onClick={() => navigate("/create_review")}
              className="navbar-button"
            >
              Crear testimonio
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;