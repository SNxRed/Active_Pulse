import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import Register from "./Register";
import Admin from "./Admin";
import ForgotPassword from "./ForgotPassword";
import UpdatePassword from "./UpdatePassword";
import AdminUploadForm from './AdminUploadForm';
import MotivationalContent from './MotivationalContent';
import LogoLayout from "./LogoLayout";
import Usuario from './UserHome';
import Perfil from './UserProfile';
import "./index.css";
import Reviews from "./reviews";
import Create_Review from "./create_review";
import Logout from "./Logout";

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para determinar si el usuario es admin

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          // Obtener el perfil del usuario para determinar si es admin
          const { data, error } = await supabase
            .from("profiles")
            .select("isadmin") // Seleccionar solo el campo isadmin
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else if (data) {
            setIsAdmin(data.isadmin); // Establecer isAdmin según el valor booleano
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSessionAndRole();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={session ? <Navigate to="/" replace /> : <Auth />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path='/user' element={<LogoLayout><Usuario /></LogoLayout>} />
          <Route path="/upload"element={<AdminUploadForm />} />
          <Route path="/motivation"element={<MotivationalContent />} />
          <Route path="/reviews" element={<LogoLayout><Reviews /></LogoLayout>} />
          <Route path="/create_review" element={<LogoLayout><Create_Review /></LogoLayout>} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              session /*&& isAdmin*/ ? (
                <LogoLayout>
                  <Account key={session.user.id} session={session} />
                </LogoLayout>
              ) : (
                <Navigate to="/user" replace />
              )
            }
          />
          <Route
            path="/admin"
            element={
              session /*&& isAdmin*/ ? (
                <LogoLayout>
                  <Admin />
                </LogoLayout>
              ) : (
                <Navigate to="/user" replace />
              )
            }
          />
          <Route
            path="/userprofile"
            element={
              session && !isAdmin ? (
                <LogoLayout>
                  <Perfil />
                </LogoLayout>
              ) : (
                <Navigate to="/user" replace />
              )
            } // Redirigir si no tiene sesión o es admin
          />
          <Route
            path="/admin/upload"
            element={
              session ? (
                <LogoLayout>
                  <AdminUploadForm />
                </LogoLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Ruta de Logout */}
          <Route path="/logout" element={<Logout />} />

          {/* Ruta por defecto */}
          <Route
            path="*"
            element={
              session ? (
                isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/user" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
