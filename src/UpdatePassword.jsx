import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/UpdatePassword.css';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.warn('Las contraseñas no coinciden. Por favor, intenta nuevamente');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.error_description || error.message);
    } else {
      // Cerrar la sesión del usuario
      await supabase.auth.signOut();
      toast.success('¡Contraseña actualizada! Por favor, inicia sesión con tu nueva contraseña.');
      navigate('/login'); // Redirigir a la página de inicio de sesión
    }

    setLoading(false);
  };

  useEffect(() => {
    // Saltar la verificación de sesión en modo desarrollo
    console.log('Modo desarrollo: omitiendo verificación de sesión.');
  }, []);

  return (
    <>
      {/* Encabezado */}
      <header
        style={{
          width: '100%',
          background: 'linear-gradient(to top, #370061 0%, #7f00b2 100%)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo */}
        <img
          src="/images/logo1.png"
          alt="Logo Active Pulse"
          style={{
            height: '100px',
            marginRight: '1rem',
          }}
        />
      </header>

      {/* Contenido principal */}
      <div className="reset-password-container">
        <div className="reset-password-box">
          <h1 className="title">Establecer Nueva Contraseña</h1>
          <p className="description">
            Ingresa tu nueva contraseña para actualizar tu cuenta.
          </p>
          <form onSubmit={handleUpdatePassword}>
            <input
              className="inputField"
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="inputField"
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="button" disabled={loading}>
              {loading ? <span>Cargando...</span> : <span>Actualizar Contraseña</span>}
            </button>
          </form>
        </div>
      </div>

      <div className="background-images">
        <img src="/images/logo3.1.png" alt="Esquina izquierda" className="corner-image left" />
        <img src="/images/logo3.1.png" alt="Esquina derecha" className="corner-image right" />
      </div>
    </>
  );
}