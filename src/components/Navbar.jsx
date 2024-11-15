import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/Captura de pantalla 2024-11-04 155855.png";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSignOut = () => {
    navigate("/logout"); // Redirige a la ruta de logout para que el componente Logout maneje el cierre de sesión
  };

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);

      if (session) {
        const { data, error } = await supabase
          .from("profiles")
          .select("isadmin")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setIsAdmin(data.isadmin);
        }
      }
    };

    fetchSessionAndRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user);
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("isadmin")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setIsAdmin(data.isadmin);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
      <img src={logo} alt="Active Pulse Logo" className="navbar-logo" />
      <div className="navbar-buttons">
        {user ? (
          <>
            <button onClick={goToUserProfile} className="navbar-button">
              Mi perfil
            </button>
            <button onClick={() => navigate("/user")} className="navbar-button">
              Inicio
            </button>
            {/* {isAdmin && ( */}
              <button onClick={() => navigate('/admin')} className="navbar-button">
                Invitar cliente
              </button>
              <button onClick={() => navigate('/')} className="navbar-button">
                Perfil Admin
              </button>
            {/* )} */}
            <button onClick={() => navigate('/reviews')} className="navbar-button">
              Ver testimonios
            </button>
            <button onClick={() => navigate('/create_review')} className="navbar-button">
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
              onClick={() => navigate("/reviews")}
              className="navbar-button"
            >
              Ver testimonios
            </button>
            <button onClick={() => navigate('/create_review')} className="navbar-button">
              Crear testimonio
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
