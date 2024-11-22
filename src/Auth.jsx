import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    // Intentar iniciar sesión
    const { error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      toast.error(error.error_description || error.message);
    } else {
      toast.success('¡Inicio de sesión exitoso!');
  
      // Obtener la sesión actual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Comprobar el perfil del usuario en la tabla user_profiles
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('isadmin')
        .eq('user_id', user.id)
        .single(); // Obtener solo un registro
  
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        toast.error("Error al verificar el perfil del usuario.");
      } else {
        // Verificar si el usuario es admin
        if (userProfile.isAdmin) {
          navigate('/admin'); // Redirigir a la página de administrador
        } else {
          navigate('/'); // Redirigir a la página principal
        }
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // const handleOAuthLogin = async (provider) => {
  //   setLoading(true);
  //   const { error } = await supabase.auth.signInWithOAuth({ provider });
  //   if (error) {
  //     toast.error(error.message);
  //   } else {
  //     toast.success(`Inicio de sesión con ${provider} exitoso`); // Notificación para inicio con OAuth
  //   }
  //   setLoading(false);
  // };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>
        <p className="auth-description">Accede con tu correo electrónico y contraseña</p>
        <form className="form-widget-1" onSubmit={handleLogin}>
          <input
            className="inputField"
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputField"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button-login" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* <div className="auth-oauth">
          <button
            className="google-button"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
          >
            <img
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="Google logo"
              className="google-logo"
            />
            <span>Iniciar sesión con Google</span>
          </button>
        </div> */}

        <div className="extra-options">
          <button className="link-button" onClick={handleForgotPassword}>
            ¿Olvidaste tu contraseña?
          </button>
          <button className="link-button" onClick={() => navigate('/user')}>
            Ingresar como invitado
          </button>
        </div>
      </div>
    </div>
  );
}