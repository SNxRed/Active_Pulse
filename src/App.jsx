import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';
import Register from './Register';
import Admin from './Admin';
import ForgotPassword from './ForgotPassword';
import UpdatePassword from './UpdatePassword';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={session ? <Navigate to="/" replace /> : <Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={session ? <Account key={session.user.id} session={session} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={session ? <Admin /> : <Navigate to="/login" replace />}
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;