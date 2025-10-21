import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Deriv Clone. Built with Deriv API.</p>
        <div className="footer-links">
          <a href="https://developers.deriv.com" target="_blank" rel="noopener noreferrer">
            API Docs
          </a>
          <span>•</span>
          <a href="https://deriv.com" target="_blank" rel="noopener noreferrer">
            Deriv.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;