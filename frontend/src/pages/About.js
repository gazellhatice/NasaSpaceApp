import "./About.css";

export default function About() {
  return (
    <div className="about-pro">
      {/* HERO SECTION */}
      <header className="about-hero-pro enhanced">
        <div className="hero-content">
          <h1>
            Behind <span className="highlight">TEMPO</span>: The Story of a
            Mission
          </h1>
          <div className="hero-line"></div>
          <p>
            TEMPO isn’t just a satellite — it’s a mission to understand the air
            we breathe and the planet we share. Learn how NASA’s technology,
            science, and teamwork come together to monitor Earth’s atmosphere in
            real time.
          </p>
        </div>
      </header>

      {/* MISSION OVERVIEW */}
      <section className="about-card">
        <h2>🌍 Mission Overview</h2>
        <p>
          The <b>TEMPO (Tropospheric Emissions: Monitoring of Pollution)</b>{" "}
          instrument, in geostationary orbit, observes key pollutants including
          ozone (O₃), nitrogen dioxide (NO₂), sulfur dioxide (SO₂), carbon
          monoxide (CO), and aerosols. Its hourly data supports improved air
          quality forecasting and public health awareness.
        </p>
      </section>

      {/* PURPOSE */}
      <section className="about-card glassy">
        <h2>💡 Why TEMPO Matters</h2>
        <p>
          Air pollution is one of the greatest global health threats. By
          providing high-resolution, hourly observations, <b>TEMPO</b> helps
          identify emission sources, forecast pollution events, and support{" "}
          <b>United Nations Sustainable Development Goals</b> — particularly{" "}
          <b>Goal 3: Good Health</b> and <b>Goal 13: Climate Action</b>.
        </p>
      </section>

      {/* HOW AQI WORKS */}
      <section className="aqi-parameters">
        <h2>📊 Understanding the Air Quality Index (AQI)</h2>
        <p>
          The Air Quality Index (0–500) translates pollutant levels into a
          single easy-to-read scale. Lower AQI means cleaner air. Each parameter
          represents a unique pollutant:
        </p>

        <div className="aqi-grid">
          <div className="param-card good">
            <h3>PM2.5</h3>
            <p>
              Fine particles &lt;2.5 µm. <b>High:</b> heart/lung risk.{" "}
              <b>Safe:</b> 0–12 µg/m³
            </p>
          </div>
          <div className="param-card moderate">
            <h3>PM10</h3>
            <p>
              Coarse dust up to 10 µm. <b>High:</b> irritation. <b>Safe:</b>{" "}
              0–54 µg/m³
            </p>
          </div>
          <div className="param-card unhealthy">
            <h3>NO₂</h3>
            <p>
              From traffic and combustion. <b>High:</b> worsens asthma.{" "}
              <b>Safe:</b> 0–53 ppb
            </p>
          </div>
          <div className="param-card ozone">
            <h3>O₃</h3>
            <p>
              Created by sunlight + emissions. <b>High:</b> breathing effects.{" "}
              <b>Safe:</b> 0–70 ppb
            </p>
          </div>
          <div className="param-card so2">
            <h3>SO₂</h3>
            <p>
              From burning fuels. <b>High:</b> eye/throat irritation.{" "}
              <b>Safe:</b> 0–75 ppb
            </p>
          </div>
          <div className="param-card co">
            <h3>CO</h3>
            <p>
              From incomplete combustion. <b>High:</b> oxygen reduction.{" "}
              <b>Safe:</b> 0–9 ppm
            </p>
          </div>
        </div>
      </section>

      {/* AQI COLOR SCALE */}
      <section className="aqi-scale-pro">
        <h2>🌈 AQI Color Scale</h2>
        <p>
          AQI colors indicate potential health impacts — an easy way to
          understand air quality at a glance.
        </p>
        <div className="aqi-scale-bar">
          <div className="scale-segment good">
            0–50
            <br />
            Good
          </div>
          <div className="scale-segment moderate">
            51–100
            <br />
            Moderate
          </div>
          <div className="scale-segment usg">
            101–150
            <br />
            Unhealthy for Sensitive Groups
          </div>
          <div className="scale-segment unhealthy">
            151–200
            <br />
            Unhealthy
          </div>
          <div className="scale-segment very-unhealthy">
            201–300
            <br />
            Very Unhealthy
          </div>
          <div className="scale-segment hazardous">
            301–500
            <br />
            Hazardous
          </div>
        </div>
      </section>

      {/* COLLABORATION */}
      <section className="about-card">
        <h2>🤝 Collaboration & Open Data</h2>
        <p>
          <b>TEMPO</b> is a partnership between <b>NASA</b>, <b>NOAA</b>, and
          the <b>U.S. Environmental Protection Agency (EPA)</b>. Data is freely
          available through <b>NASA Earthdata</b> and <b>AirNow</b>, empowering
          global research and environmental action.
        </p>
      </section>

      {/* TIMELINE */}
      <section className="timeline-pro">
        <h2>📅 Mission Timeline</h2>
        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>🚀 Launch — April 2023</h3>
              <p>
                TEMPO launched aboard SpaceX Falcon 9 into geostationary orbit.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>🔬 First Light — 2023</h3>
              <p>Initial calibration and data validation completed.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>📡 Data Release — 2024</h3>
              <p>Public access via NASA Earthdata and AirNow portals.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>🌐 Expansion — 2025+</h3>
              <p>
                Integration of TEMPO insights into global air and health
                policies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
