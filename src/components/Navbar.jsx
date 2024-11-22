import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser ] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si el usuario es admin

  const handleSignOut = () => {
    navigate("/logout"); // Redirige a la ruta de logout para que el componente Logout maneje el cierre de sesión
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser (session?.user);

      if (session) {
        // Obtener información del perfil para verificar si es admin
        const { data, error } = await supabase
          .from("user_profiles")
          .select("isadmin")
          .eq("user_id", session.user.id)
          .single();

        if (error) {
          console.error("Error al obtener el perfil:", error);
        } else if (data) {
          setIsAdmin(data.isadmin); // Configurar el estado de administrador
        }
      }

      const { data: subscription } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUser (session?.user);
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
          isAdmin ? ( // Si es admin, mostrar botones de admin primero
            <>
              <button
                onClick={() => navigate("/admin/upload")} className="navbar-button">
                Subir Contenido
              </button>
              <button
                onClick={() => navigate("/admin-panel")} className="navbar-button">
                Gestión Reservas
              </button>
              <button
                onClick={() => navigate("/admin")} className="navbar-button">
                Invitar Usuario
              </button>
              <button onClick={handleSignOut} className="navbar-button">
                Cerrar sesión
              </button>
            </>
          ) : ( // Si no es admin, mostrar botones de usuario
            <>
              <button onClick={goToUserProfile} className="navbar-button">
                Mi perfil
              </button>
              <button
                onClick={() => navigate("/routines")} className="navbar-button">
                Ver rutina
              </button>
              <button
                onClick={() => navigate("/")} className="navbar-button">
                Inicio
              </button>
              <button
                onClick={() => navigate("/create_review")} className="navbar-button">
                Crear testimonio
              </button>
              <button
                onClick={() => navigate("/reviews")} className="navbar-button">
                Ver testimonios
              </button>
              <button
                onClick={() => navigate("/booking")} className="navbar-button">
                Reservar
              </button>
              <button
                onClick={() => navigate("/motivation")} className="navbar-button" >
                Ver contenido motivacional
              </button>
              <button onClick={handleSignOut} className="navbar-button">
                Cerrar sesión
              </button>
            </>
          )
        ) : (
          <>
            <button onClick={goToLogin} className="navbar-button">
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/")} className="navbar-button">
              Inicio
            </button>
            <button
              onClick={() => navigate("/reviews")} className="navbar-button">
              Ver testimonios
            </button>
            <button
                onClick={() => navigate("/motivation")} className="navbar-button">
                Ver contenido motivacional
              </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;