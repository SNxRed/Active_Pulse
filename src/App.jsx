import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';
import Register from './Register';
import Admin from './Admin';
import ForgotPassword from './ForgotPassword';
import UpdatePassword from './UpdatePassword';
import AdminUploadForm from './AdminUploadForm';
import MotivationalContent from './MotivationalContent';
import LogoLayout from './LogoLayout';
import './index.css';

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
          <Route path="/user"/> 
          <Route path="/upload"element={<AdminUploadForm />} />
          <Route path="/motivation"element={<MotivationalContent />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={session ? <LogoLayout><Account key={session.user.id} session={session} /></LogoLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={session ? <LogoLayout><Admin /></LogoLayout> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/upload"
            element={session ? <LogoLayout><AdminUploadForm /></LogoLayout> : <Navigate to="/login" replace />}
          />


          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;