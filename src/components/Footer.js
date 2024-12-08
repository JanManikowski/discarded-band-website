import React from 'react';

const Footer = () => {
  return (
    <footer
      className="text-center text-white py-4"
      style={{
        backgroundColor: '#0A060D', // Set the background color
        borderTop: '1px solid #ffffff', // Add a 1px top border
      }}
    >
      <p>&copy; 2024 Discarded Band. All rights reserved.</p>
      <p>
        <a href="/contact" className="text-white mx-2">Contact</a>|
        <a href="/about-us" className="text-white mx-2">About Us</a>|
        <a href="/faq" className="text-white mx-2">FAQ</a>
      </p>
    </footer>
  );
};

export default Footer;
