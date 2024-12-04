import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-center text-white py-4">
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
