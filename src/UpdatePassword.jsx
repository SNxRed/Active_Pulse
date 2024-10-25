import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

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
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Establecer Nueva Contraseña</h1>
        <form className="form-widget" onSubmit={handleUpdatePassword}>
          <div>
            <input
              className="inputField"
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className={'button block'} disabled={loading}>
              {loading ? <span>Cargando...</span> : <span>Actualizar Contraseña</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}