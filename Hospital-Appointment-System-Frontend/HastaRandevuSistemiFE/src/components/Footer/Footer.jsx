import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Hızlı Erişim</h4>
          <Link to="/about-us">Hakkımızda</Link>
          <Link to="/communication">İletişim</Link>
          <Link to="/sss">SSS</Link>
        </div>

        <div className="footer-section">
          <h4>İletişim</h4>
          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>Adres: Örnek Mah. Hastane Cad. No:123</span>
          </div>
          <div className="contact-item">
            <FaPhone />
            <span>Telefon: 0 (212) 123 45 67</span>
          </div>
          <div className="contact-item">
            <FaEnvelope />
            <span>Email: info@hastane.com</span>
          </div>
        </div>

        <div className="footer-section">
          <h4>Sosyal Medya</h4>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2023 Tüm hakları saklıdır. | Designed by Your Hospital</p>
      </div>
    </footer>
  );
};

export default Footer;