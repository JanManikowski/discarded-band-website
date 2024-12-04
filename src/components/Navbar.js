import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/discarded_logo_yellow.png';
import { BasketContext } from '../contexts/BasketContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavBar = () => {
  const { basketCount, calculateTotal } = useContext(BasketContext);

  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transition: 'background-color 0.5s ease',
    borderBottom: '2px solid transparent',
  });

  useEffect(() => {
    const handleScroll = () => {
      const featuredSection = document.getElementById('featured-section');
      if (featuredSection) {
        const rect = featuredSection.getBoundingClientRect();
        if (rect.top <= 80) {
          setNavbarStyle({
            backgroundColor: 'rgba(0, 0, 0, 1)',
            transition: 'background-color 0.5s ease, border-color 0.5s ease',
            borderBottom: '2px solid white',
          });
        } else {
          setNavbarStyle({
            backgroundColor: 'rgba(0, 0, 0, 0)',
            transition: 'background-color 0.5s ease, border-color 0.5s ease',
            borderBottom: '2px solid transparent',
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{
        ...navbarStyle,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ paddingTop: '10px' }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: '100px',
              marginRight: '10px',
            }}
          />
        </Link>

        {/* Navigation Links */}
        <div className="d-flex justify-content-center flex-grow-1">
          <div className="navbar-nav">
            <Link to="/products" className="nav-link text-light mx-3">Products</Link>
            <Link to="/faq" className="nav-link text-light mx-3">FAQ</Link>
            <Link to="/about-us" className="nav-link text-light mx-3">About Us</Link>
            <Link to="/subscribe" className="nav-link text-light mx-3">Subscribe</Link>
            <Link to="/contact" className="nav-link text-light mx-3">Contact</Link>
          </div>
        </div>

        {/* Cart and Total */}
        <div className="d-flex align-items-center" style={{ marginRight: '10px' }}>
          <Link to="/basket" className="nav-link text-light d-flex align-items-center">
            <i className="bi bi-cart-fill" style={{ fontSize: '1.5rem' }}></i>
            <span className="mx-2">
              {basketCount} / ${calculateTotal().toFixed(2)}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
