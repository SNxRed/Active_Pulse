import "./styles/reviews.css";
import Review_Score from "./components/review_score";
export default function reviews() {
  return (
    <section id="reviews-container">
      {Array.from({ length: 10 }, (_, index) => (
        <div className="card">
          <div className="card-header">
            <span className="date-time">2 day ago</span>
            <Review_Score score={4} />
          </div>

          <p className="description">
            “Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae
            quas vel sint commodi repudiandae consequuntur.”
          </p>

          <div className="author">
            <span>~</span> <img src="/src/assets/user_icon_2.png" alt="user_icon" width={"21px"} />{" "}
            John Doe
          </div>
        </div>
      ))}
    </section>
  );
}
