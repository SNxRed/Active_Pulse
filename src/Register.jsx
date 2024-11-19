import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Register.css";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [invitationValid, setInvitationValid] = useState(false);
  const [invitationError, setInvitationError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  // Nuevos campos para el perfil
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const invitationId = queryParams.get("invitationId");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const verifyInvitation = async () => {
      if (!invitationId) {
        setInvitationError("No se proporcionó un token de invitación.");
        return;
      }

      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", invitationId)
        .eq("is_used", false)
        .single();

      if (error || !data) {
        setInvitationError("Invitación inválida o expirada.");
      } else {
        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        if (expiresAt < now) {
          setInvitationError("La invitación ha expirado.");
        } else {
          setEmail(data.email);
          setInvitationValid(true);
        }
      }
    };

    verifyInvitation();
  }, [invitationId]);

  const validatePassword = (password) => {
    const lengthRequirement = password.length >= 8;
    const uppercaseRequirement = /[A-Z]/.test(password);
    const numberRequirement = /[0-9]/.test(password);
    const specialCharRequirement = /[!@#$%^&*]/.test(password);

    setPasswordValid(
      lengthRequirement &&
      uppercaseRequirement &&
      numberRequirement &&
      specialCharRequirement
    );
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      toast.warn("Las contraseñas no coinciden.");
      return;
    }

    setPasswordsMatch(true);
    setLoading(true);

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error durante el registro:", error);
      toast.error(error.message || "Error durante el registro.");
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;

    if (userId) {
      try {
        const { data: result, error: functionError } = await supabase.functions.invoke('validate-signup', {
          body: {
            userId,
            firstName,
            lastName,
            phoneNumber,
            address,
            dateOfBirth,
            gender,
            emergencyContactName,
            emergencyContactPhone,
            invitationId,
          },
        });

        if (functionError) {
          console.error("Error al invocar la edgefunction:", functionError);
          toast.error(functionError.message || "Error al crear el perfil de usuario.");
        } else {
          toast.success(result.message || "Perfil de usuario creado exitosamente.");
          navigate('/');
        }
      } catch (err) {
        console.error("Error al invocar la edgefunction:", err);
        toast.error("Error al comunicarse con el servidor.");
      }
    } else {
      toast.error("Error: No se pudo obtener el ID del usuario.");
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
    <div>
      <header
        style={{
          width: '100%',
          background: 'linear-gradient(to bottom, #7f00b2, #510085)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
       <img
          src="https://ymjjininyltkzfajvwvd.supabase.co/storage/v1/object/public/uploads/public/Images/logo-main.png"
          alt="Logo Active Pulse"
          style={{
            height: '50px',
            marginRight: '1rem',
          }}
        />
      </header>

      <div className="form-container">
        <h1 className="form-title">Regístrate en Active Pulse</h1>
        <form onSubmit={handleSignUp} className="form-grid">
          {/* Campos del formulario */}
          <input
            className="inputField"
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="inputField"
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            className="inputField"
            type="tel"
            placeholder="Teléfono"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            className="inputField"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onFocus={() => setShowPasswordPopup(true)}
            onBlur={() => setShowPasswordPopup(false)}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            required
          />
          {showPasswordPopup && (
            <div className="password-popup">
              <p className={password.length >= 8 ? "valid" : "invalid"}>
                Mínimo 8 caracteres
              </p>
              <p className={/[A-Z]/.test(password) ? "valid" : "invalid"}>
                Al menos una letra mayúscula
              </p>
              <p className={/[0-9]/.test(password) ? "valid" : "invalid"}>
                Al menos un número
              </p>
              <p className={/[!@#$%^&*]/.test(password) ? "valid" : "invalid"}>
                Al menos un carácter especial
              </p>
            </div>
          )}
          <input
            className="inputField"
            type="password"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {!passwordsMatch && (
            <p className="error">Las contraseñas no coinciden</p>
          )}
          <button className="button" disabled={loading || !passwordValid}>
            {loading ? <span>Cargando...</span> : <span>Registrarse</span>}
          </button>
        </form>
      </div>
    </div>
  );
}