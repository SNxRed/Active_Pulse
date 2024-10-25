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
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Reset Password</h1>
        {message ? (
          <p className="description">{message}</p>
        ) : (
          <>
            <p className="description">
              Enter your email address below, and we will send you a link to reset your password.
            </p>
            <form className="form-widget" onSubmit={handlePasswordReset}>
              <div>
                <input
                  className="inputField"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <button className={'button block'} disabled={loading}>
                  {loading ? <span>Loading</span> : <span>Send Reset Email</span>}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}