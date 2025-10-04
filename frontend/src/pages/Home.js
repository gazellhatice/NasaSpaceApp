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
            Discover <span className="highlight">NASA TEMPO</span>
          </h1>
          <p className="fade-in-delay">
            Your personal space-powered air quality guide 🌍 Get real-time
            insights and daily forecasts for a healthier life.
          </p>

          {/* MINI LIVE AQI CARD */}
          <div className="aqi-card fade-in-delay2">
            <h4>
              Current AQI: <span className="aqi-value good">45 (Good)</span>
            </h4>
            <p>Air quality is healthy — enjoy outdoor activities!</p>
          </div>

          <div className="hero-buttons fade-in-delay2">
            <Link to="/airquality" className="btn primary glow">
              🌤 View Live Dashboard
            </Link>
            <Link to="/assistant" className="btn secondary">
              🎤 Ask TEMPO Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-pro">
        <h2>🌍 Why TEMPO Matters</h2>
        <p className="feature-intro">
          Every hour, NASA TEMPO observes our planet’s atmosphere — transforming
          data into action for a cleaner, safer future.
        </p>

        <div className="feature-grid-pro">
          {/* 1️⃣ Satellite Precision */}
          <div className="feature-card-pro">
            <div className="icon">🛰️</div>
            <h3>Satellite Precision</h3>
            <p>
              Measures NO₂, O₃, and aerosols every hour across North America
              with unmatched clarity.
            </p>
            <div className="mini-data">
              <span>📡 10 km spatial accuracy</span>
            </div>
          </div>

          {/* 2️⃣ Public Health */}
          <div className="feature-card-pro">
            <div className="icon">💚</div>
            <h3>Public Health Impact</h3>
            <p>
              Real-time alerts help citizens minimize exposure and plan safer
              outdoor activities.
            </p>
            <div className="mini-data">
              <span>🏙️ 85% less risk in alert zones</span>
            </div>
          </div>

          {/* 3️⃣ AI Forecasting */}
          <div className="feature-card-pro">
            <div className="icon">🤖</div>
            <h3>AI Forecasting</h3>
            <p>
              Machine learning models predict air quality 24 hours ahead to
              support proactive decisions.
            </p>
            <div className="mini-data">
              <span>📈 92% model accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGE SECTION */}
      <section className="challenge-pro">
        <div className="challenge-inner">
          {/* LEFT TEXT SIDE */}
          <div className="text">
            <h2>🧠 The Challenge</h2>
            <p>
              Air pollution affects over <b>90% of people worldwide</b>. Yet
              most of us never see the invisible threats around us.
              <br />
              <br />
              The <b>NASA TEMPO mission</b> changes that — by tracking
              pollutants hourly from space and delivering insights directly to
              you.
            </p>

            <div className="mission-box">
              <h4>Our Mission 🎯</h4>
              <p>
                Build a real-time air intelligence system combining satellite
                data, local sensors, and AI — empowering people to make
                healthier choices every day.
              </p>
            </div>

            <Link to="/about" className="btn secondary">
              Learn How It Works →
            </Link>
          </div>

          {/* RIGHT IMAGE SIDE */}
          <div className="image floating">
            <img src={tempoImage} alt="NASA TEMPO Satellite" />
            <div className="image-caption">
              TEMPO observes North America hourly from geostationary orbit.
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-pro">
        <h2>🌤 Breathe Smarter with NASA TEMPO</h2>
        <p className="cta-sub">
          Join thousands of citizens tracking their air quality in real time and
          making informed, healthier choices every day.
        </p>

        <div className="cta-buttons">
          <Link to="/airquality" className="btn primary glow">
            🚀 Open Live Dashboard
          </Link>
          <Link to="/assistant" className="btn secondary">
            🎤 Ask TEMPO Assistant
          </Link>
        </div>

        <div className="cta-footer">
          <p>
            Powered by <b>NASA TEMPO</b> • Data for a Healthier Planet 🌎
          </p>
        </div>
      </section>
    </div>
  );
}
