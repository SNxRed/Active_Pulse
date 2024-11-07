import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/Captura de pantalla 2024-11-04 155855.png';

function Navbar() {
  const navigate = useNavigate();

  const goToHome = () => navigate('/');
  const goToAdmin = () => navigate('/admin');
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <img
        src={logo}
        alt="Active Pulse Logo"
        className="navbar-logo"
      />
      <div className="navbar-buttons">
        <button onClick={goToHome} className="navbar-button">
          Inicio
        </button>
        <button onClick={goToAdmin} className="navbar-button">
          Invitar cliente
        </button>
        <button onClick={handleSignOut} className="navbar-button">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
