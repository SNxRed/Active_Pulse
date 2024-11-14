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
    <div
      style={{
        backgroundColor: '#7f00b2', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#FFFFFF', 
        fontFamily: 'Montserrat, Arial, sans-serif',
      }}
    >
      {/* Encabezado */}
      <header
          style={{
            width: '100%',
            background: 'linear-gradient(to bottom, #7f00b2, #510085, #310066)', 
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            margin: 0, 
            boxSizing: 'border-box',
            position: 'relative', 
          }}
      >
        
        
  {/* Logo */}
  <img
    src="/images/logo2.png" // Ruta del logo en la carpeta public
    alt="Active Pulse Logo"
    style={{
      height: '50px', // Ajusta el tamaño del logo según sea necesario
      objectFit: 'contain', // Asegura que la imagen no se deforme
    }}
  />
       
       
      </header>

      {/* Contenido central */}
      <div
        style={{
          backgroundColor: '#ffffff', 
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          marginTop: '2rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2
          style={{
            fontFamily: 'Big Shoulder Display, Arial, sans-serif',
            fontSize: '1.8rem',
            marginBottom: '1rem',
            color: '#370061',
            
          }}
        >
          Establecer Nueva Contraseña
        </h2>
        
        <form onSubmit={handleUpdatePassword}>
          <div>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '10px',
                border: 'none',
                fontSize: '1rem',
                marginBottom: '1rem',
                border: '1px solid #370061'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: '#ffffff',
              color: '#370061',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              border: '1px solid #370061'
            }}
          >
            {loading ? 'Cargando...' : 'Actualizar Contraseña'}
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