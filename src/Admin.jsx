import { useState } from "react";
import { supabase } from "./supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminInvite() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    setLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      toast.error("Error fetching user information.");
      setLoading(false);
      return;
    }

    if (!user) {
      console.error("User is not logged in.");
      toast.warn("You must be logged in to send an invitation.");
      setLoading(false);
      return;
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error fetching session:", sessionError.message);
      toast.error("Error fetching session information.");
      setLoading(false);
      return;
    }

    if (!sessionData.session) {
      console.error("No active session found.");
      toast.warn("You must be logged in to send an invitation.");
      setLoading(false);
      return;
    }

    const accessToken = sessionData.session.access_token;

    try {
      const response = await fetch(
        "https://ymjjininyltkzfajvwvd.supabase.co/functions/v1/create-invitation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            email,
            createdBy: user.id,
          }),
        }
      );

      const result = await response.json();

      console.log("Invitation sent", result);

      if (response.ok) {
        toast.success("Invitación enviada correctamente!");
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (fetchError) {
      console.error("Error sending invitation:", fetchError);
      toast.error("Ocurrió un error al enviar la invitación."); // Manejo de errores en fetch
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-container">
      <div className="invite-box">
        <h2>Invitar a un Nuevo Usuario</h2>
        <p className="invite-description">
          Ingresa el correo electrónico del usuario para enviar la invitación
        </p>
        <input
          className="inputField"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="button" onClick={handleInvite} disabled={loading}>
          {loading ? "Enviando..." : "Enviar Invitación"}
        </button>
      </div>
    </div>
  );
}