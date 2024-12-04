import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/discarded_logo_yellow.png';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavBar = ({ basketCount }) => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
        height: '80px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            style={{
              height: '50px',
              marginRight: '10px',
            }}
          />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>Brand Name</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto"> {/* Align links to the right */}
            <Link to="/contact" className="nav-link text-light mx-2">Contact</Link>
            <Link to="/about-us" className="nav-link text-light mx-2">About Us</Link>
            <Link to="/faq" className="nav-link text-light mx-2">FAQ</Link>
            <Link to="/support-us" className="nav-link text-light mx-2">Support Us</Link>
            <Link to="/products" className="nav-link text-light mx-2">Products</Link>
            <Link to="/basket" className="nav-link text-light mx-2 position-relative">
              <i className="bi bi-cart-fill" style={{ fontSize: '1.5rem' }}></i>
              {basketCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.8rem' }}
                >
                  {basketCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
