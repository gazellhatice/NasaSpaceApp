import "./About.css";

export default function About() {
  return (
    <div className="about-pro">
      {/* HERO SECTION */}
      <header className="about-hero-pro enhanced">
        <div className="hero-content">
          <h1>
            Journey Through the Sky —{" "}
            <span className="highlight">NASA TEMPO</span>
          </h1>
          <div className="hero-line"></div>
          <p>
            From geostationary orbit, TEMPO watches over North America every
            hour, transforming invisible pollution into visible insight — to
            protect the air we all share.
          </p>

          <div className="mission-facts">
            <span>🚀 Launched 2023</span>
            <span>🛰️ 22,000 miles above Earth</span>
            <span>📡 Hourly measurements</span>
          </div>

          <div className="scroll-hint">↓ Scroll to Explore the Mission</div>
        </div>
      </header>

      {/* MISSION OVERVIEW */}
      {/* MISSION & PURPOSE COMBINED SECTION */}
      <section className="mission-story">
        <div className="mission-grid">
          {/* LEFT TEXT CONTENT */}
          <div className="mission-text">
            <h2>🌍 The TEMPO Mission</h2>
            <p>
              <b>TEMPO (Tropospheric Emissions: Monitoring of Pollution)</b> is
              a groundbreaking NASA mission observing the atmosphere from
              geostationary orbit. Every hour, it measures pollutants like ozone
              (O₃), nitrogen dioxide (NO₂), and aerosols across North America.
            </p>

            <p>
              By turning invisible gases into visible data, TEMPO helps
              scientists, governments, and everyday citizens understand how the
              air we breathe changes — block by block, hour by hour.
            </p>

            <div className="mission-highlights">
              <div className="highlight-card">
                <h4>🎯 Purpose</h4>
                <p>
                  Empower healthier communities through transparent, hourly
                  air-quality insights.
                </p>
              </div>
              <div className="highlight-card">
                <h4>🌱 SDG Impact</h4>
                <p>
                  Supporting the <b>UN Sustainable Development Goals</b> —
                  <b>Goal 3: Good Health</b> and <b>Goal 13: Climate Action</b>.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL SIDE */}
          <div className="mission-visual">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
              alt="Earth from Space"
              className="earth-img"
            />
            <div className="orbit-ring"></div>
          </div>
        </div>
      </section>

      {/* HOW AQI WORKS */}
      {/* ===== AQI EXPLAINER SECTION ===== */}
      <section className="aqi-explainer">
        <h2>📊 What Is AQI?</h2>
        <p className="aqi-intro">
          The <b>Air Quality Index (AQI)</b> turns complex pollution data into a
          simple color-coded scale — helping you instantly understand if the air
          is safe to breathe.
        </p>

        <div className="aqi-grid">
          <div className="param-card good">
            <h3>🌿 PM2.5</h3>
            <p>
              Fine particles that reach deep into your lungs.
              <b>Safe:</b> 0–12 µg/m³
            </p>
          </div>

          <div className="param-card moderate">
            <h3>🌾 PM10</h3>
            <p>
              Coarse dust that can irritate eyes and throat.
              <b>Safe:</b> 0–54 µg/m³
            </p>
          </div>

          <div className="param-card unhealthy">
            <h3>🚗 NO₂</h3>
            <p>
              Traffic-related gas affecting asthma patients.
              <b>Safe:</b> 0–53 ppb
            </p>
          </div>

          <div className="param-card ozone">
            <h3>☀️ O₃</h3>
            <p>
              Formed by sunlight and emissions; can reduce lung function.
              <b>Safe:</b> 0–70 ppb
            </p>
          </div>

          <div className="param-card so2">
            <h3>🔥 SO₂</h3>
            <p>
              From fuel burning; causes throat and eye irritation.
              <b>Safe:</b> 0–75 ppb
            </p>
          </div>

          <div className="param-card co">
            <h3>💨 CO</h3>
            <p>
              Produced by incomplete combustion; reduces oxygen in blood.
              <b>Safe:</b> 0–9 ppm
            </p>
          </div>
        </div>

        {/* COLOR SCALE */}
        <div className="aqi-scale-visual">
          <h2>🌈 AQI Health Scale</h2>
          <div className="scale-bar">
            <div className="segment good">
              0–50
              <br />
              😊 Good
            </div>
            <div className="segment moderate">
              51–100
              <br />
              🙂 Moderate
            </div>
            <div className="segment usg">
              101–150
              <br />
              😷 Sensitive
            </div>
            <div className="segment unhealthy">
              151–200
              <br />
              🤒 Unhealthy
            </div>
            <div className="segment very-unhealthy">
              201–300
              <br />
              😫 Very Unhealthy
            </div>
            <div className="segment hazardous">
              301–500
              <br />
              ☠️ Hazardous
            </div>
          </div>

          <div className="aqi-tip">
            💡 Tip: If AQI is above <b>150</b>, avoid outdoor activity and wear
            a mask when necessary.
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
      {/* ===== MISSION TIMELINE ===== */}
      <section className="timeline-modern">
        <h2>📅 Mission Timeline</h2>
        <p className="timeline-intro">
          From launch to lasting impact — explore how NASA’s TEMPO mission
          evolved to transform our understanding of Earth’s atmosphere.
        </p>

        <div className="timeline-container-pro">
          <div className="timeline-item left">
            <div className="timeline-content-pro">
              <h3>🚀 Launch — April 2023</h3>
              <p>
                TEMPO launched aboard SpaceX Falcon 9, entering geostationary
                orbit to observe North America every hour.
              </p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content-pro">
              <h3>🔬 First Light — 2023</h3>
              <p>
                The instrument captured its first atmospheric data, calibrating
                sensors for accuracy.
              </p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-content-pro">
              <h3>📡 Public Data Release — 2024</h3>
              <p>
                TEMPO data became accessible via NASA Earthdata and AirNow —
                enabling researchers worldwide to track pollution.
              </p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content-pro">
              <h3>🌐 Expansion — 2025+</h3>
              <p>
                TEMPO’s insights are being integrated into global air-quality
                and public health policies, driving climate awareness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
