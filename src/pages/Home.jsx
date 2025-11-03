import React from 'react';
import '../styles/Home.css';
import SplineScene from '../components/SplineScene';
import HamburgerMenu from '../components/HamburgerMenu';
import music1 from '../assets/music1.jpg';
import music2 from '../assets/music2.jpg';

function Home() {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Beat Canvas</div>

        <div className="nav-right">
          <div className="nav-links">
            <a href="#" className="btn login-btn">Login</a>
            <a href="#" className="btn signup-btn">Create Free Account</a>
          </div>

          {/* Add the Hamburger Menu */}
          <HamburgerMenu />
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-left">
          <SplineScene />
        </div>
        <div className="hero-right">
          <h1>Welcome to Beat Canvas</h1>
          <p>Where rhythm meets creativity 🎶</p>
        </div>
      </section>

      {/* Beat Generator Section */}
      <section id="beat-generator" className="beat-generator">
        <h2>🎵 Live AI Beat Demo</h2>
        <p>Select your vibe and instantly play a unique beat.</p>

        <div className="beat-controls">
          <div className="control-group">
            <label>Mood:</label>
            <button>Dark</button>
            <button>Chill</button>
            <button>Upbeat</button>
          </div>

          <div className="control-group">
            <label>Genre:</label>
            <button>Lo-Fi</button>
            <button>Trap</button>
            <button>Cinematic</button>
          </div>

          <div className="control-group">
            <label>Duration:</label>
            <button>30s</button>
            <button>60s</button>
          </div>
        </div>

        <button className="generate-btn">Generate & Play 🎶</button>
      </section>

      {/* Scroll Sections */}
      <section className="faq-section">
        <h2>What We Offer</h2>

        <div className="faq-item">
          <div className="faq-text">
            <h3>🎧 What makes Beat Canvas unique?</h3>
            <p>
              Beat Canvas offers immersive 3D experiences and personalized playlists that adapt
              to your mood and vibe in real time.
            </p>
          </div>
          <div className="faq-image">
            {/* 🔲 Image placeholder */}
            <img src={music1} alt="Beat Canvas showcase" className="faq-image-img" />
          </div>
        </div>

        <div className="faq-item reverse">
          <div className="faq-text">
            <h3>🚀 How do I start using it?</h3>
            <p>
              Simply create a free account, explore your dashboard, and start designing your audio
              journey with one click.
            </p>
          </div>
          <div className="faq-image">
            <img src={music2} alt="Beat Canvas showcase" className="faq-image-img" />
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-text">
            <h3>💡 Is Beat Canvas free to use?</h3>
            <p>
              Yes! You can access the basic features completely free. Premium options will unlock
              advanced controls and visuals.
            </p>
          </div>
          <div className="faq-image">
            <img src={music1} alt="Beat Canvas showcase" className="faq-image-img" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 Beat Canvas. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
