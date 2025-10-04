import "./Contact.css";
import memberImage from "../images/member.png";


export default function Contact() {
  return (
    <div className="contact-pro">
      {/* HEADER */}
      <header className="contact-header-pro">
        <h1>🚀 Meet Team <span className="highlight">PulsarX</span></h1>
        <p>
          A team of passionate innovators participating in NASA’s{" "}
          <b>Space Apps Challenge</b>.  
          We build solutions for <b>cleaner air</b>, <b>healthier lives</b>, and a <b>smarter planet</b>.
        </p>
      </header>

      {/* TEAM SECTION */}
      <section className="team-pro">
        <h2>👩‍💻 Our Team</h2>
        <div className="team-grid-pro">
          <div className="team-card-pro">
            <img src={memberImage} alt="Teammate" />
            <h3>Hatice Gazel</h3>
            <p>Software Engineer • Backend & AI</p>
          </div>
          <div className="team-card-pro">
            <img src={memberImage} alt="Teammate" />
            <h3>Teammate Name</h3>
            <p>Frontend Developer • UI/UX</p>
          </div>
          <div className="team-card-pro">
            <img src={memberImage} alt="Teammate" />
            <h3>Teammate Name</h3>
            <p>Data Scientist • Machine Learning</p>
          </div>
          <div className="team-card-pro">
            <img src={memberImage} alt="Teammate" />
            <h3>Teammate Name</h3>
            <p>Project Manager • Outreach</p>
          </div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="contact-info-pro">
        <h2>📬 Get in Touch</h2>
        <p>Want to collaborate or learn more about our project? Reach out to us!</p>
        <div className="contact-links">
          <a href="mailto:team.pulsarx@gmail.com" target="_blank" rel="noreferrer">
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
