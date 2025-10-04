🌍 NASA TEMPO – Air Quality Intelligence System
AI-powered satellite-driven air quality monitoring and forecasting platform
🚀 Overview

NASA TEMPO Air Quality Project is a real-time environmental intelligence platform that combines satellite data, ground-based observations, and artificial intelligence to monitor and forecast air pollution across North America.

The system leverages:

🛰 NASA TEMPO (Tropospheric Emissions: Monitoring of Pollution) satellite data for hourly atmospheric composition

🌡 AirNow and Open-Meteo APIs for local air and weather parameters

🤖 AI-based Ridge regression model for short-term air quality prediction (next 6 hours)

The goal: Make complex atmospheric science visible, interactive, and understandable — empowering people to make healthier decisions about the air they breathe.

🧩 Core Features
🛰 Real-Time Data Integration

Combines NASA TEMPO granules (NO₂, O₃, PM2.5) with AirNow and OpenAQ datasets through live API endpoints.

🔬 AI-Driven Forecasting

Implements a Ridge Regression model to predict Air Quality Index (AQI) for the next 6 hours based on:

Temporal patterns

Temperature & wind correlation

Recursive lag learning

🌤 Multi-Source Dashboard

Interactive React + Flask web interface built for clarity:

Home — project overview & mission

About — NASA TEMPO story & science behind it

AirQuality — live AQI map, AI insights, and voice assistant

Forecast — predictive analytics and AQI visualization

Contact — Team PulsarX profile and communication links

💬 Voice & AI Assistant

An integrated assistant that interprets AQI values, explains pollution types, and gives health-based suggestions interactively.

💚 Health & Safety Insights

For each AQI range, the platform provides real-time health recommendations:

0–50: Safe for all activities

51–100: Moderate caution for sensitive groups

101–150: Limit prolonged outdoor activity

150+: Stay indoors; mask recommended

🧠 Backend Intelligence

The backend (app.py) is built with Flask, handling both data aggregation and predictive modeling:

Endpoint	Description
/airnow	Fetches current pollutant concentrations from AirNow API
/tempo	Retrieves NASA TEMPO NO₂ granule metadata from NASA CMR API
/combined	Merges TEMPO + AirNow results for a unified atmospheric snapshot
/forecast	Performs AI-based AQI forecasting (using Ridge regression + weather inputs)
🧮 Model Workflow

Collects last 24h AirNow PM2.5 history

Retrieves past & next hours weather from Open-Meteo

Merges datasets into a time series DataFrame

Trains a Ridge regression with features (time, temperature, wind, lag1)

Produces next-6-hour AQI predictions and generates a natural-language advisory

🛰 NASA TEMPO Context

TEMPO (Tropospheric Emissions: Monitoring of Pollution) is a NASA mission observing atmospheric pollution from geostationary orbit (~35,000 km above Earth).
It measures trace gases such as NO₂, SO₂, and O₃ every hour, revolutionizing how we monitor air quality in North America.

Our system integrates this data to translate raw granules into actionable public insights.

🧑‍💻 Team PulsarX
Member	Role	Focus
Hatice Gazel	Software Engineer	AI Model & Backend (Flask + Ridge Regression)
Teammate Name	Frontend Developer	React UI/UX Design
Teammate Name	Data Scientist	Atmospheric Data Processing
Teammate Name	Project Manager	Communication & Outreach

“We don’t just visualize data — we give it meaning.”

💬 Key Technologies

Flask (Python) — backend APIs, ML model integration

React.js — dynamic frontend and real-time AQI dashboard

scikit-learn (Ridge Regression) — AI forecasting

pandas, NumPy — data cleaning and time-series operations

NASA CMR API, AirNow, Open-Meteo — live environmental data sources

Voice Assistant — custom dialogue engine for AQI advice

🌈 Environmental Impact

This project aligns with the United Nations Sustainable Development Goals (SDGs):

Goal 3: Good Health & Well-Being 🫁

Goal 13: Climate Action 🌍

Goal 11: Sustainable Cities & Communities 🌆

By transforming NASA’s atmospheric data into human-centered insights, we aim to increase awareness, promote data transparency, and empower people to act for cleaner air.

🧭 Vision

“From space to street level — making the invisible visible.”

Our vision is to continue expanding this system with global datasets, integrating predictive alerts, and connecting communities through open-source environmental technology.

🛰 Acknowledgments

NASA Earth Science Data Systems (ESDS) for open TEMPO data

AirNow API by US EPA

Open-Meteo for providing free weather forecasts

Space Apps Challenge for inspiring collaborative innovation

Team PulsarX — for combining science, design, and code into impact
