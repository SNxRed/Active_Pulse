import "./styles/create_review.css";
import Review_Score from "./components/review_score";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Create_Review() {
    const [user, set_user] = useState(null);
    const [score, set_score] = useState(0);
    const [testimony, set_testimony] = useState("");

    function Handle_Testimony_Change(event) {
        set_testimony(event.target.value);
    }

    function Handle_Score_Change(new_score) {
        set_score(new_score);
        console.log("Nueva calificación:", new_score);
      };
    
  return (
    <section id="create-review-container">
      <div id="create-review-header">
        <img src="/src/assets/write_icon.png" alt="write_icon" width={"41px"} />
        <span>Dejar testimonio</span>
      </div>
      <div id="score-container">
          <div id="user-container"> <img src="/src/assets/user_icon_2.png" alt="user_icon" width={"25px"} />{" "}
          <span>John Doe</span></div>
      <Review_Score score={score} Handle_Score_Change={Handle_Score_Change} />
          </div>
      <textarea
        name="Testimonio"
        cols="30"
        rows="10"
        placeholder="Escribe tus comentarios aquí..."
        onChange={Handle_Testimony_Change}
      ></textarea>

      <button id="post-review-button">Publicar</button>
    </section>
  );
}
