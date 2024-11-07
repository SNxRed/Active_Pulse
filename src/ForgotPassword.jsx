import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/update-password',
    });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      setMessage('Password reset email has been sent.');
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <h1>Restablecer Contraseña</h1>
      {message ? (
        <p className="description">{message}</p>
      ) : (
        <>
          <p className="description">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <form onSubmit={handlePasswordReset}>
            <input
              className="inputField"
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="button" disabled={loading}>
              {loading ? <span>Cargando...</span> : <span>Enviar enlace de restablecimiento</span>}
            </button>
          </form>
        </>
      )}
    </div>
  );
  
}
