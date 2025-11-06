import React, { useState } from 'react';
import '../styles/HamburgerMenu.css';

function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hamburger-container">
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="menu">
            <a href="#hero">Home</a>

          <a href="#beat-generator">Live AI Beat Demo</a>
          <a href="#what-we-offer">What We Offer</a>
          <a href="#about-us">About Us</a>
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;
