import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      // Cerrar la sesión del usuario
      await supabase.auth.signOut();
      alert('¡Contraseña actualizada! Por favor, inicia sesión con tu nueva contraseña.');
      navigate('/login'); // Redirigir a la página de inicio de sesión
    }

    setLoading(false);
  };



  /*useEffect(() => {
    // Saltar la verificación de sesión en modo desarrollo
    console.log("Modo desarrollo: omitiendo verificación de sesión.");
  }, []); */

 useEffect(() => {

    // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  
  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h1 className="header">Establecer Nueva Contraseña</h1>
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
          <button className="button" disabled={loading}>
            {loading ? <span>Cargando...</span> : <span>Actualizar Contraseña</span>}
          </button>
        </form>

        <img
  src="/public/images/logo3.1.png"
  alt="Descripción de la imagen"
  style={{
    width: '100px', 
    height: 'auto', 
    borderRadius: '8px', 
  }}
/>

      </div>
      
    </div>
  );
}
