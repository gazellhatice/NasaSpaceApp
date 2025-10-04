import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! 👋 I'm your Air Quality Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  // 🔹 Scroll to bottom smoothly but allow user to scroll up manually
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      if (isAtBottom) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    let reply = "I'm not sure, but I can help analyze AQI data.";
    const lower = input.toLowerCase();

    if (lower.includes("aqi")) {
      reply =
        "AQI (Air Quality Index) measures how clean or polluted the air is. Below 50 = good 💚, 51–100 = moderate 💛, 101–150 = unhealthy for sensitive groups 🧑‍🦰, and above 200 = hazardous ☠️.";
    } else if (lower.includes("mask")) {
      reply =
        "If AQI is over 100, wearing a mask outdoors 😷 is a smart choice — especially if you have asthma or allergies.";
    } else if (lower.includes("today")) {
      reply =
        "Today's air quality looks moderate 🌤️. You can safely go outside, but avoid heavy exercise if you’re in a high-traffic area.";
    } else if (lower.includes("weather")) {
      reply =
        "Weather conditions like wind 🌬️ and temperature 🌡️ affect air quality. You can check the Forecast tab for detailed insights.";
    } else if (lower.includes("clothes") || lower.includes("wear")) {
      reply =
        "If air quality is good, light clothes 👕 and outdoor walks are fine. If it’s bad, better stay indoors with filtered air 💨.";
    } else if (lower.includes("thanks") || lower.includes("thank you")) {
      reply = "You're welcome! 😊 I'm here to help you breathe easier 💙.";
    } else if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey")
    ) {
      reply =
        "Hello there! 👋 I’m your TEMPO Assistant. Ask me about AQI, masks, weather, or what to wear today!";
    } else if (lower.includes("who are you")) {
      reply =
        "I’m TEMPO Assistant, powered by NASA’s TEMPO mission 🚀. I help you understand air quality data and stay healthy.";
    } else if (lower.includes("pollution")) {
      reply =
        "Air pollution comes from traffic 🚗, factories 🏭, and wildfires 🔥. TEMPO monitors these pollutants in real time from space 🛰️.";
    } else if (lower.includes("health")) {
      reply =
        "Poor air quality can affect your lungs 🫁 and heart ❤️. Try to stay indoors when AQI > 150, and drink lots of water 💧.";
    } else if (lower.includes("recommend")) {
      reply =
        "If AQI is below 50: Go jogging 🏃‍♀️! If between 100–150: Maybe indoor exercise 🧘‍♀️. Above 200: Stay inside and keep windows closed.";
    } else if (lower.includes("tempo")) {
      reply =
        "TEMPO (Tropospheric Emissions: Monitoring of Pollution) is a NASA mission tracking air pollutants hourly across North America 🛰️.";
    } else if (lower.includes("app") || lower.includes("project")) {
      reply =
        "This web app uses real TEMPO data + ground AQI + weather APIs to predict air quality and offer advice 🌍💡.";
    } else if (lower.includes("goodbye") || lower.includes("bye")) {
      reply = "Goodbye 👋 Stay safe and breathe clean air!";
    } else if (lower.includes("joke")) {
      reply =
        "Why did the cloud stay home? ☁️ Because the air outside was too particulate! 😄";
    } else if (lower.includes("fun fact") || lower.includes("fact")) {
      reply =
        "Fun fact! 🌎 One large tree can absorb up to 48 pounds of carbon dioxide every year. Nature’s own air filter! 🌳";
    } else if (lower.includes("help")) {
      reply =
        "You can ask me about AQI, pollution, weather, what to wear, or health tips. Try typing ‘mask’ or ‘forecast’!";
    } else {
      reply =
        "Hmm 🤔 I didn’t quite catch that. Try asking about AQI, masks, weather, or air quality forecast.";
    }

    const botMsg = { from: "bot", text: reply };
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 500);
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={toggleChat}>
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <span>💬 TEMPO Assistant</span>
            <button className="close-btn" onClick={toggleChat}>
              ✖
            </button>
          </div>

          <div className="chat-body" ref={chatContainerRef}>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
