import "./styles/reviews.css";
import Review_Score from "./components/review_score";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function Reviews() {
  const [reviews, setReviews] = useState([]); // Estado para almacenar los testimonios

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("")
          .order("created_at", { ascending: false }); // Ordenar por fecha de creación, más recientes primero

        if (error) {
          console.error("Error al obtener testimonios:", error);
          return;
        }
        console.log(data)
        setReviews(data); // Guardar los testimonios en el estado
      } catch (error) {
        console.error("Error al conectarse a la base de datos:", error.message);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section id="reviews-container">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div className="card" key={index}>
            <div className="card-header">

              <span className="date-time">{new Date(review.created_at).toLocaleDateString()}</span>
              <Review_Score score={review.score} />
            </div>

            
            <p className="description">“{review.testimony}”</p>

            <div className="author">
              <span>~</span>
              <img src="/src/assets/user_icon_2.png" alt="user_icon" width={"21px"} />{" "}
              {review.user_email || "Usuario Anónimo"}
            </div>
          </div>
        ))
      ) : (
        <p className="no-reviews-message">No hay testimonios disponibles.</p>
      )}
    </section>
  );
}