import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import AirQuality from "./pages/AirQuality";
import Forecast from "./pages/Forecast";
import Contact from "./pages/Contact";
import Chatbot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/airquality" element={<AirQuality />} />{" "}
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
