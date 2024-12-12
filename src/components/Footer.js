import React from 'react';
import { Link } from 'react-router-dom';
import { FaSpotify, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="text-center text-white py-4"
      style={{
        backgroundColor: '#0A060D',
        borderTop: '1px solid #ffffff',
      }}
    >
      <p>&copy; 2024 Discarded Band. All rights reserved.</p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '0 20px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="text-white">Home</Link>
          <span>|</span>
          <Link to="/about-us" className="text-white">About Us</Link>
          <span>|</span>
          <Link to="/contact" className="text-white">Contact</Link>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://open.spotify.com/artist/2qkiNoOXU7MqFWGuXACSHK?si=3xcv-PL3RHCXNySWUkIAnA&nd=1&dlsi=27601fa728f0405f"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <FaSpotify size={24} /> Spotify
          </a>
          <a
            href="https://www.instagram.com/discarded_band/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <FaInstagram size={24} /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
