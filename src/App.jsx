// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import TemplateExtraction from "./pages/TemplateExtraction";
// import BeatDetection from "./pages/BeatDetection";
// import "./styles/global.css";
// import TestSpline from "./components/TestSpline";

// function App() {
//   return (
//     <Router>
//       <div>
//         {/* Keep Spline only if you want it visible globally */}
//         {/* <TestSpline /> */}

//         <Routes>
//           {/* Home Page */}
//           <Route path="/" element={<Home />} />

//           {/* Dashboard + its subpages */}
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/template-extraction" element={<TemplateExtraction />} />
//           <Route path="/beat-detection" element={<BeatDetection />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;









import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import all pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TemplateExtraction from "./pages/TemplateExtraction";
import BeatDetection from "./pages/BeatDetection";
import VideoEditor from "./pages/VideoEditor";


// Import global styles
import "./styles/global.css";

// Optional global component
// import TestSpline from "./components/TestSpline";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Uncomment this if you want Spline to render on every page */}
        {/* <TestSpline /> */}

        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Home />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Beat Detection Page */}
          <Route path="/beat-detection" element={<BeatDetection />} />

          {/* Template Extraction Page */}
          <Route path="/template-extraction" element={<TemplateExtraction />} />

          <Route path="/video-editor" element={<VideoEditor />} />


          {/* 404 Route */}
          <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
