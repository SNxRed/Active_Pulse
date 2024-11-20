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
import AdminUploadForm from "./AdminUploadForm";
import MotivationalContent from "./MotivationalContent";
import LogoLayout from "./LogoLayout";
import Usuario from "./UserHome";
import Perfil from "./UserProfile";
import "./index.css";
import Reviews from "./reviews";
import Create_Review from "./create_review";
import Logout from "./Logout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookingCalendar from "./BookingCalendar";
import AdminPanel from "./AdminPanel";
import User_list from "./user_list";

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  
  useEffect(() => {
    document.body.classList.add("light-mode");
  }, []);

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      try {
        // Obtener la sesión del usuario actual
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          // Obtener información del perfil para verificar si es admin
          const { data, error } = await supabase
            .from("profiles")
            .select("isadmin")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error al obtener el perfil:", error);
          } else if (data) {
            setIsAdmin(data.isadmin); // Configurar el estado de administrador
          }
        }
      } catch (error) {
        console.error("Error al obtener la sesión:", error);
      } finally {
        setLoading(false); // Finalizar el estado de carga
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

  if (loading) {
    // Mostrar un indicador mientras se carga la sesión
    return <div className="loading">Cargando...</div>;
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} />
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
          <Route
            path="/user"
            element={
              <LogoLayout>
                <Usuario />
              </LogoLayout>
            }
          />
          <Route path="/upload" element={<AdminUploadForm />} />
          <Route path="/motivation" element={<MotivationalContent />} />
          <Route
            path="/reviews"
            element={
              <LogoLayout>
                <Reviews />
              </LogoLayout>
            }
          />
          <Route
            path="/create_review"
            element={
              <LogoLayout>
                <Create_Review />
              </LogoLayout>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              session ? (
                <LogoLayout>
                  <Account key={session.user.id} session={session} />
                </LogoLayout>
              ) : (
                <Navigate to="/login" replace />
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
            }
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
          <Route
            path="/booking"
            element={
              session ? (
                <LogoLayout>
                  <BookingCalendar userId={session?.user?.id} />
                </LogoLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin-panel"
            element={
              session /*&& isAdmin*/ ? (
                <LogoLayout>
                  <AdminPanel adminId={session?.user?.id} />
                </LogoLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/user_list"
            element={
              session /*&& isAdmin*/ ? (
                <LogoLayout>
                  <User_list adminId={session?.user?.id} />
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
