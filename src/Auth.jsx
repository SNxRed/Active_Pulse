import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('¡Inicio de sesión exitoso!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

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

        <div className="auth-oauth">
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
        </div>

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
