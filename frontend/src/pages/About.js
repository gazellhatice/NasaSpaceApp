import "./About.css";

export default function About() {
  return (
    <div className="about-pro">
      {/* HERO HEADER */}
      <header className="about-hero-pro enhanced">
        <div className="hero-content">
          <h1>
            NASA’s <span className="highlight">TEMPO</span> Mission
          </h1>
          <div className="hero-line"></div>
          <p>
            Monitoring Earth’s breath from space — <b>TEMPO</b> (Tropospheric
            Emissions: Monitoring of Pollution) measures air pollution hourly
            across North America, enabling cleaner skies, healthier lives, and a
            sustainable future.
          </p>
        </div>
      </header>

      {/* OVERVIEW */}
      <section className="about-card">
        <h2>🌍 Mission Overview</h2>
        <p>
          From its geostationary orbit, <b>TEMPO</b> continuously observes key
          air pollutants such as ozone (O₃), nitrogen dioxide (NO₂), sulfur
          dioxide (SO₂), and aerosols. The instrument’s data supports accurate
          air quality forecasts, climate studies, and health risk assessments
          for millions of people.
        </p>
      </section>

      {/* WHY IT MATTERS */}
      <section className="about-card glassy">
        <h2>💡 Why It Matters</h2>
        <p>
          Air pollution is one of the top environmental health threats
          worldwide. TEMPO’s hourly high-resolution data allows scientists and
          decision-makers to identify pollution sources, predict exposure risks,
          and take action toward the{" "}
          <b>United Nations Sustainable Development Goals (SDGs)</b> —
          especially <b>Goal 3: Good Health</b> and{" "}
          <b>Goal 13: Climate Action</b>.
        </p>
      </section>

      {/* AQI PARAMETERS EXPLAINED */}
      <section className="aqi-parameters">
        <h2>📈 Understanding AQI Parameters</h2>
        <p>
          The Air Quality Index (AQI) converts pollutant concentrations into a
          simple scale (0–500). Lower values mean cleaner air. Each parameter
          represents a different pollutant type:
        </p>

        <div className="aqi-grid">
          <div className="param-card good">
            <h3>PM2.5</h3>
            <p>
              Fine inhalable particles smaller than 2.5 µm.
              <b>High levels:</b> Lung & heart risk.
              <b>Safe range:</b> 0–12 µg/m³
            </p>
          </div>

          <div className="param-card moderate">
            <h3>PM10</h3>
            <p>
              Coarse dust particles up to 10 µm.
              <b>High levels:</b> Respiratory irritation.
              <b>Safe range:</b> 0–54 µg/m³
            </p>
          </div>

          <div className="param-card unhealthy">
            <h3>NO₂</h3>
            <p>
              Emitted by traffic and combustion.
              <b>High levels:</b> Worsens asthma, inflames lungs.
              <b>Safe range:</b> 0–53 ppb
            </p>
          </div>

          <div className="param-card ozone">
            <h3>O₃</h3>
            <p>
              Ground-level ozone from sunlight + emissions.
              <b>High levels:</b> Affects breathing & vegetation.
              <b>Safe range:</b> 0–70 ppb
            </p>
          </div>

          <div className="param-card so2">
            <h3>SO₂</h3>
            <p>
              Produced by burning fossil fuels.
              <b>High levels:</b> Eye & throat irritation.
              <b>Safe range:</b> 0–75 ppb
            </p>
          </div>

          <div className="param-card co">
            <h3>CO</h3>
            <p>
              Carbon monoxide from incomplete combustion.
              <b>High levels:</b> Reduces oxygen in the blood.
              <b>Safe range:</b> 0–9 ppm
            </p>
          </div>
        </div>
      </section>

      {/* COLLABORATION */}
      <section className="about-card">
        <h2>🤝 Collaboration</h2>
        <p>
          TEMPO is a collaboration between <b>NASA</b>, <b>NOAA</b>, and the{" "}
          <b>U.S. Environmental Protection Agency (EPA)</b>. Data is shared
          globally through <b>AirNow</b> and <b>NASA Earthdata</b>, enabling
          research, education, and smarter policy for sustainable air
          management.
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
                TEMPO launched aboard a SpaceX Falcon 9 into geostationary
                orbit.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>🔬 First Light — 2023</h3>
              <p>
                Initial calibration and “first light” observations confirmed
                instrument accuracy.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>📡 Data Release — 2024</h3>
              <p>
                TEMPO data became publicly available via NASA Earthdata and
                AirNow systems.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>🌐 Ongoing — 2025+</h3>
              <p>
                Continuous global collaboration to integrate TEMPO insights into
                air and health policies.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* AQI COLOR SCALE */}
      <section className="aqi-scale-pro">
        <h2>🌈 AQI Color Scale (0–500)</h2>
        <p>
          The Air Quality Index (AQI) uses colors to represent health concern
          levels. This helps you quickly understand the impact of air pollution
          on daily life.
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
            Unhealthy
            <br />
            for Sensitive Groups
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
    </div>
  );
}
