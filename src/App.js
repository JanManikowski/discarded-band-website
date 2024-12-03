import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImage from './assets/background_square.png';
import logo from './assets/discarded_logo_yellow.png';

const App = () => {
  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src={logo} // Update this if you have a logo
              alt="Logo"
              style={{ height: '40px' }}
            />
          </a>
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
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  href="#products"
                  style={{ fontWeight: '500' }}
                >
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  href="#faq"
                  style={{ fontWeight: '500' }}
                >
                  FAQ
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  href="#subscribe"
                  style={{ fontWeight: '500' }}
                >
                  Subscribe
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div>
        <p
          className="lead mb-1"
          style={{ fontSize: '1.5rem', letterSpacing: '2px' }}
        >
          OFFICIAL MERCHANDISE
        </p>
        <h1
          className="display-1 fw-bold"
          style={{ fontSize: '4rem', textTransform: 'uppercase' }}
        >
          DISCARDED
        </h1>
        <button
          className="btn btn-outline-light mt-3"
          style={{
            borderColor: '#fff',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            fontWeight: '600',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#fff';
            e.target.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#fff';
          }}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default App;
