import React from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <h2>Dashboard</h2>
        <div className="dashboard-links">
          <Link to="/template-extraction">Template Extraction</Link>
          <Link to="/beat-detection">Beat Detection</Link>
        </div>
      </nav>

      {/* Featured Playlist & Themes */}
      <section className="featured">
        <h3>Featured Playlist & Themes</h3>
        <div className="playlist-grid">
          <div className="playlist-item">Add Image 1</div>
          <div className="playlist-item">Add Image 2</div>
          <div className="playlist-item">Add Image 3</div>
          <div className="playlist-item">Add Image 4</div>
          <div className="playlist-item">Add Image 5</div>
          <div className="playlist-item">Add Image 6</div>
        </div>
      </section>

      {/* Beat History Section */}
      <section className="beat-history">
        <h3>Beat History Timeline</h3>
        <div className="waveform-container">
          <div className="waveform-placeholder">[Interactive Waveform]</div>
        </div>
        <div className="heatmap-container">
          <div className="heatmap-placeholder">[Beat Density Heatmap]</div>
        </div>
      </section>

      {/* Template Library Section */}
      <section className="template-library">
        <h3>Template Library</h3>
        <div className="template-grid">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="template-card">
              <div className="rhythm-block">[Rhythmic Blocks #{num}]</div>
              <p>Template {num}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
