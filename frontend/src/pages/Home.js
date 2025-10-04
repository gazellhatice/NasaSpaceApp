import { Link } from "react-router-dom";
import "./Home.css";
import tempoImage from "../images/nasa-tempo.png";

export default function Home() {
  return (
    <div className="home-pro">
      {/* BACKGROUND EFFECTS */}
      <div className="stars"></div>
      <div className="twinkling"></div>

      {/* HERO SECTION */}
      <section className="hero-pro">
        <div className="hero-content">
          <h1 className="fade-in">
            <span className="highlight">NASA TEMPO</span> Mission
          </h1>
          <p className="fade-in-delay">
            Monitoring air pollution from space — delivering hourly air quality
            data and forecasts to help protect our planet and people.
          </p>
          <div className="hero-buttons fade-in-delay2">
            <Link to="/airquality" className="btn primary">
              🚀 Explore Dashboard
            </Link>
            <Link to="/about" className="btn secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-pro">
        <h2>🌍 Why TEMPO Matters</h2>
        <div className="feature-grid-pro">
          <div className="feature-card-pro">
            <div className="icon">🛰️</div>
            <h3>Satellite Precision</h3>
            <p>
              Hourly measurements of pollutants like NO₂, O₃, and aerosols from
              geostationary orbit.
            </p>
          </div>
          <div className="feature-card-pro">
            <div className="icon">💚</div>
            <h3>Public Health</h3>
            <p>
              Real-time data empowers communities to reduce exposure and make
              informed decisions.
            </p>
          </div>
          <div className="feature-card-pro">
            <div className="icon">🤖</div>
            <h3>AI Forecasting</h3>
            <p>
              Machine learning predicts pollution trends to help build cleaner,
              smarter cities.
            </p>
          </div>
        </div>
      </section>

      {/* CHALLENGE SECTION */}
      <section className="challenge-pro">
        <div className="challenge-inner">
          <div className="text">
            <h2>🧠 The Challenge</h2>
            <p>
              Create a <b>real-time air quality intelligence system</b> using{" "}
              <b>TEMPO satellite data</b>, weather insights, and local sensors —
              empowering healthier choices for all.
            </p>
          </div>
          <div className="image floating">
            <img src={tempoImage} alt="NASA TEMPO Satellite" />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-pro">
        <h2>Ready to Explore the Air You Breathe?</h2>
        <p>Access live air quality data and forecasts powered by NASA TEMPO.</p>
        <Link to="/airquality" className="btn primary glow">
          View Dashboard
        </Link>
      </section>
    </div>
  );
}
