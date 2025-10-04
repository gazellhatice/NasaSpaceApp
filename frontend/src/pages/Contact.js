import "./Contact.css";
import memberImage from "../images/member.png";

export default function Contact() {
  return (
    <div className="contact-pro">
      {/* HEADER */}
      <header className="contact-header-pro enhanced">
        <h1>
          🚀 Meet <span className="highlight">Team PulsarX</span>
        </h1>
        <div className="hero-line"></div>
        <p>
          We are a multidisciplinary team united under the{" "}
          <b>NASA Space Apps Challenge</b> — combining innovation, data science,
          and passion to build real-world solutions for <b>cleaner air</b> and a{" "}
          <b>healthier planet</b>. 🌍
        </p>
      </header>

      {/* TEAM SECTION */}
      <section className="team-pro">
        <h2>👩‍🚀 Our Crew</h2>
        <p className="team-sub">
          The minds behind <b>PulsarX</b> — blending AI, data, and environmental
          science to make air quality awareness accessible to all.
        </p>

        <div className="team-grid-pro">
          <div className="team-card-pro">
            <img src={memberImage} alt="Hatice Gazel" />
            <h3>Hatice Gazel</h3>
            <p>🧠 Software Engineer • Backend & AI</p>
          </div>
          <div className="team-card-pro">
            <img src={memberImage} alt="Teammate" />
            <h3>Teammate Name</h3>
            <p>🎨 Frontend Developer • UI/UX Design</p>
          </div>
          <div className="team-card-pro">
            <img src={memberImage} alt="Teammate" />
            <h3>Teammate Name</h3>
            <p>📊 Data Scientist • Machine Learning</p>
          </div>
          <div className="team-card-pro">
            <img src={memberImage} alt="Teammate" />
            <h3>Teammate Name</h3>
            <p>🚀 Project Manager • Outreach</p>
          </div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="contact-info-pro enhanced">
        <h2>📬 Contact & Collaboration</h2>
        <p>
          We’d love to connect! Whether you’re a researcher, developer, or
          curious explorer — join us on our mission.
        </p>

        <div className="contact-links">
          <a
            href="mailto:team.pulsarx@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            ✉️ team.pulsarx@gmail.com
          </a>
          <a href="https://github.com/pulsarx" target="_blank" rel="noreferrer">
            💻 github.com/pulsarx
          </a>
          <a
            href="https://www.spaceappschallenge.org/"
            target="_blank"
            rel="noreferrer"
          >
            🛰️ NASA Space Apps – PulsarX Team
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-pro">
        <p>🌎 Developed with 💙 by Team PulsarX | NASA Space Apps Challenge</p>
      </footer>
    </div>
  );
}
