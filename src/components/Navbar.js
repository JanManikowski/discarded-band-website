import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Discarded-Clean-Circle-Transparent.png';
import { BasketContext } from '../contexts/BasketContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavBar = () => {
    const { basketCount, calculateTotal } = useContext(BasketContext);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: isHomePage ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 1)',
    borderBottom: isHomePage ? '2px solid transparent' : '2px solid #ffffff',
    transition: 'background-color 0.5s ease, border-color 0.5s ease',
    });

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const updateNavbarStyle = () => {
            const isHomePage = location.pathname === '/';
            
            if (!isHomePage) {
                setNavbarStyle({
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    borderBottom: '2px solid #ffffff',
                    transition: 'background-color 0.5s ease, border-color 0.5s ease',
                });
            } else {
                const header = document.querySelector('.home-header');
                const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    
                setNavbarStyle({
                    backgroundColor: headerBottom <= 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0)',
                    borderBottom: headerBottom <= 0 ? '2px solid #ffffff' : '2px solid transparent',
                    transition: 'background-color 0.5s ease, border-color 0.5s ease',
                });
            }
        };
    
        // Update on scroll and location change
        updateNavbarStyle();
        window.addEventListener('scroll', updateNavbarStyle);
    
        return () => {
            window.removeEventListener('scroll', updateNavbarStyle);
        };
    }, [location.pathname]);
    

    useEffect(() => {
        // Close the menu on route changes
        setMenuOpen(false);
    }, [location.pathname]);

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = () => {
        setMenuOpen(false); // Close the menu explicitly
    };

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 998,
                    visibility: menuOpen ? 'visible' : 'hidden',
                    opacity: menuOpen ? 1 : 0,
                    backdropFilter: menuOpen ? 'blur(4px)' : 'none',
                    transition: 'opacity 0.3s ease, visibility 0.3s ease',
                }}
                onClick={handleLinkClick}
            ></div>

            <nav
                className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar"
                style={navbarStyle}
            >
                <div className="container-fluid d-flex align-items-center position-relative">
                    <Link className="navbar-brand custom-logo-container" to="/">
                        <img src={logo} alt="Logo" className="img-fluid custom-logo" />
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded={menuOpen}
                        aria-label="Toggle navigation"
                        onClick={handleMenuClick}
                        style={{ marginLeft: 'auto' }}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul
                            className="navbar-nav text-center custom-navbar-links"
                            style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                            >
                        <li className="nav-item">
                                <Link
                                    to="/releases"
                                    className="nav-link text-white custom-nav-link"
                                    onClick={handleLinkClick}
                                >
                                    Releases
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link
                                    to="/products"
                                    className="nav-link text-white custom-nav-link"
                                    onClick={handleLinkClick}
                                >
                                    Products
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link
                                    to="/about-us"
                                    className="nav-link text-white custom-nav-link"
                                    onClick={handleLinkClick}
                                >
                                    About Us
                                </Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link
                                    to="/contact"
                                    className="nav-link text-white custom-nav-link"
                                    onClick={handleLinkClick}
                                >
                                    Contact
                                </Link>
                            </li>
                            <li className="nav-item d-lg-none custom-cart-container">
                            <Link to="/basket" className="nav-link text-white d-flex align-items-center">
        <i className="bi bi-cart-fill" style={{ fontSize: '2rem', marginRight: '0.5rem' }}></i>
        <span className="cart-details">
            {basketCount} / €{calculateTotal().toFixed(2)}
        </span>
    </Link>
                            </li>
                        </ul>
                    </div>

                    {/* <div className="d-none d-lg-flex align-items-center custom-cart-container">
                        <Link to="/basket" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-cart-fill" style={{ fontSize: '2rem' }}></i>
                            <span className="mx-2">
                                {basketCount} / €{calculateTotal().toFixed(2)}
                            </span>
                        </Link>
                    </div> */}
                </div>
            </nav>
        </>
    );
};

export default NavBar;
