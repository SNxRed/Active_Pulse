import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import "./styles/create_review.css";
import Review_Score from "./components/review_score";

export default function Create_Review() {
    const [user, set_user] = useState(null);
    const [score, set_score] = useState(0);
    const [testimony, set_testimony] = useState("");

    // Verificar si el usuario está autenticado al cargar la página
    useEffect(() => {
      const fetchUser = async () => {
          console.log("Ejecutando fetchUser...");
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
              console.error("Error al obtener la sesión:", error);
              alert("Error al verificar la autenticación del usuario.");
              return;
          }
          if (session && session.user) {
              console.log("Usuario autenticado encontrado:", session.user);
              set_user(session.user);
          } else {
              console.log("No se encontró ningún usuario autenticado.");
              alert("Debes estar autenticado para publicar un testimonio.");
          }
      };

      fetchUser();
  }, []);

    const handleTestimonyChange = (event) => {
        set_testimony(event.target.value);
    };

    const handleScoreChange = (new_score) => {
        set_score(new_score);
        console.log("Nueva calificación:", new_score);
    };

    const handlePostReview = async () => {
        if (!user) {
            alert("Debes estar autenticado para publicar un testimonio.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from("testimonials")
                .insert([{ 
                    user_id: user.id, 
                    testimony, 
                    score 
                }]);

            if (error) {
                console.error("Error al publicar el testimonio:", error.message);
                throw error;
            }
            
            alert("¡Testimonio publicado con éxito!");
            set_testimony("");
            set_score(0);
        } catch (error) {
            console.error("Error al publicar el testimonio:", error.message);
            alert("Hubo un error al publicar el testimonio.");
        }
    };

    return (
        <section id="create-review-container">
            <div id="create-review-header">
                <img src="/src/assets/write_icon.png" alt="write_icon" width={"41px"} />
                <span>Dejar testimonio</span>
            </div>
            <div id="score-container">
                <div id="user-container">
                    <img src="/src/assets/user_icon_2.png" alt="user_icon" width={"25px"} />
                    <span>{user ? user.email : "Invitado"}</span>
                </div>
                <Review_Score score={score} Handle_Score_Change={handleScoreChange} />
            </div>
            <textarea
                name="Testimonio"
                cols="30"
                rows="10"
                placeholder="Escribe tus comentarios aquí..."
                onChange={handleTestimonyChange}
                value={testimony}
            ></textarea>
            <button id="post-review-button" onClick={handlePostReview}>Publicar</button>
        </section>
    );
}
