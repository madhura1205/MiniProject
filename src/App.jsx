import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TemplateExtraction from "./pages/TemplateExtraction";
import BeatDetection from "./pages/BeatDetection";
import "./styles/global.css";
import TestSpline from "./components/TestSpline";

function App() {
  return (
    <Router>
      <div>
        {/* Keep Spline only if you want it visible globally */}
        {/* <TestSpline /> */}

        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Dashboard + its subpages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/template-extraction" element={<TemplateExtraction />} />
          <Route path="/beat-detection" element={<BeatDetection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
