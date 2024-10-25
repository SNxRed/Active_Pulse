import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function AdminInvite() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    setLoading(true);

    console.log("Sending invitation");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      alert("Error fetching user information.");
      setLoading(false);
      return;
    }

    if (!user) {
      console.error("User is not logged in.");
      alert("You must be logged in to send an invitation.");
      setLoading(false);
      return;
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error fetching session:", sessionError.message);
      alert("Error fetching session information.");
      setLoading(false);
      return;
    }

    if (!sessionData.session) {
      console.error("No active session found.");
      alert("You must be logged in to send an invitation.");
      setLoading(false);
      return;
    }

    const accessToken = sessionData.session.access_token;

    const response = await fetch("https://ymjjininyltkzfajvwvd.supabase.co/functions/v1/create-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email,
          createdBy: user.id,
        }),
      });
    const result = await response.json();

    console.log("Invitation sent", result);

    if (response.ok) {
      alert("Invitation sent successfully!");
    } else {
      alert(`Error: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Invite a New User</h2>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleInvite} disabled={loading}>
        {loading ? "Sending..." : "Send Invitation"}
      </button>
    </div>
  );
}
