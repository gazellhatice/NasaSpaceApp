import React, { useCallback, useEffect, useRef, useState } from "react";

export default function VoiceAssistant({ aqi, advisory, cityHint }) {
  const [active, setActive] = useState(false);
  const recRef = useRef(null);

  const speak = useCallback((msg) => {
    const u = new SpeechSynthesisUtterance(msg);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, []);

  const handleCommand = useCallback((txt) => {
    const t = txt.toLowerCase();
    if (t.includes("air quality") || t.includes("hava") || t.includes("aqi")) {
      speak(`Air quality in ${cityHint} is ${Math.round(aqi)}. ${advisory}`);
    } else if (t.includes("mask")) {
      speak(aqi > 100 ? "Yes, wearing a mask outdoors is recommended." : "Mask is not necessary today.");
    } else if (t.includes("hello") || t.includes("hey tempo")) {
      speak("Hello! Ask me about air quality, mask advice, or outdoor safety.");
    } else {
      speak("I can tell you air quality, mask advice, or outdoor safety.");
    }
  }, [aqi, advisory, cityHint, speak]);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;
    recRef.current = new SpeechRec();
    recRef.current.lang = "en-US";
    recRef.current.onresult = (e) => {
      const last = e.results[e.results.length - 1][0].transcript;
      handleCommand(last);
    };
    recRef.current.onend = () => { if (active) recRef.current.start(); };
  }, [active, handleCommand]);

  const toggle = () => {
    if (!recRef.current) return;
    if (!active) { recRef.current.start(); setActive(true); }
    else { recRef.current.stop(); setActive(false); }
  };

  return (
    <div className="voice">
      <button className={`btn-voice ${active ? "on" : ""}`} onClick={toggle}>
        🎧 {active ? "Listening…" : "Voice Assistant"}
      </button>
    </div>
  );
}
