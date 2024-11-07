import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useLocation } from "react-router-dom";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [invitationValid, setInvitationValid] = useState(false);
  const [invitationError, setInvitationError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  // Obtener el `invitationId` de los parámetros de la URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invitationId = queryParams.get("invitationId");

  useEffect(() => {
    // Verificar el token de invitación cuando el componente se monta
    const verifyInvitation = async () => {
      if (!invitationId) {
        setInvitationError("No invitation token provided.");
        return;
      }

      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", invitationId)
        .eq("is_used", false)
        .single();

      console.log("data", data);
      if (error || !data) {
        setInvitationError("Invalid or expired invitation token.");
        console.error("Error verifying invitation:", error);
      } else {
        // Comprobar si la invitación ha expirado
        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        if (expiresAt < now) {
          setInvitationError("Invitation has expired.");
        } else {
          setEmail(data.email); // Prellenar el email de la invitación
          setInvitationValid(true);
        }
      }
    };

    verifyInvitation();
  }, [invitationId]);

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (!invitationValid) {
      alert("Invalid or expired invitation token.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error during sign up:", error);
      alert(error.error_description || error.message);
    } else {
      // Marcar la invitación como usada después del registro exitoso
      const { data: updateData, error: updateError } = await supabase
        .from("invitations")
        .update({ used: true })
        .eq("id", invitationId);

      if (updateError) {
        console.error("Error updating invitation:", updateError);
      }

      alert(
        "¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta."
      );
    }
    setLoading(false);
  };

  if (invitationError) {
    return (
      <div>
        <h1>Invitación inválida</h1>
        <p>{invitationError}</p>
      </div>
    );
  }

  if (!invitationValid) {
    return (
      <div>
        <h1>Verificando invitación...</h1>
      </div>
    );
  }

  return (
    <div className="form-container">
    <h1 className="header">Registrate en Active Pulse</h1>
    <p className="description">
      Crea una cuenta con tu correo electrónico y contraseña a continuación
    </p>
    <form onSubmit={handleSignUp}>
      <div>
        <input
          className="inputField"
          type="email"
          placeholder="Tu correo electrónico"
          value={email}
          required
          readOnly
        />
      </div>
      <div>
        <input
          className="inputField"
          type="password"
          placeholder="Tu contraseña"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button className="button" disabled={loading}>
          {loading ? <span>Cargando...</span> : <span>Registrarse</span>}
        </button>
      </div>
    </form>
  </div>
);
}
