import React from "react";
import "../styles/dashboard.css"; // reuse your dark theme styling

export default function TemplateExtraction() {
  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <h2>Template Extraction</h2>
      </nav>

      <main className="dashboard-content">
        <h1>Template Extraction Page</h1>
        <p>
          This section will handle the process of extracting beat or melody templates
          from uploaded audio files. You can add upload options, waveform visuals, or
          extracted data here.
        </p>
      </main>
    </div>
  );
}
