import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/discarded-yellow-low.png';
import { BasketContext } from '../contexts/BasketContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavBar = () => {
    const { basketCount, calculateTotal } = useContext(BasketContext);
    const [navbarStyle, setNavbarStyle] = useState({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderBottom: '2px solid transparent',
        transition: 'background-color 0.5s ease, border-color 0.5s ease',
    });

    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const isHomePage = location.pathname === '/';

        const updateNavbarStyle = () => {
            const featuredSection = document.getElementById('featured-section');
            if (featuredSection) {
                const sectionTop = featuredSection.getBoundingClientRect().top;
                const isSectionInView = sectionTop <= window.innerHeight * 0.1;

                setNavbarStyle({
                    backgroundColor: isSectionInView ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0)',
                    borderBottom: isSectionInView ? '2px solid #ffffff' : '2px solid transparent',
                    transition: 'background-color 0.5s ease, border-color 0.5s ease',
                });
            }
        };

        if (isHomePage) {
            updateNavbarStyle();
            window.addEventListener('scroll', updateNavbarStyle);
        }

        return () => {
            if (isHomePage) {
                window.removeEventListener('scroll', updateNavbarStyle);
            }
        };
    }, [location.pathname]);

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
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
                    transition: 'opacity 0.3s ease, visibility 0.3s ease',
                }}
                onClick={handleLinkClick}
            ></div>

            <nav
                className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar transparent"
                style={navbarStyle}
            >
                <div className="container-fluid d-flex justify-content-between align-items-center">
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
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav mx-auto text-center custom-navbar-links">
                            <li className="nav-item">
                                <Link
                                    to="/products"
                                    className="nav-link text-white custom-nav-link"
                                    onClick={handleLinkClick}
                                >
                                    Products
                                </Link>
                            </li>
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
        to="/releases"
        className="nav-link text-white custom-nav-link"
        onClick={handleLinkClick}
    >
        Releases
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
                            {/* Cart Item for Mobile */}
                            <li className="nav-item d-lg-none custom-cart-container">
                                <Link
                                    to="/basket"
                                    className="nav-link text-white d-flex flex-column align-items-center justify-content-center"
                                >
                                    <i className="bi bi-cart-fill" style={{ fontSize: '2rem' }}></i>
                                    <span className="mt-1">
                                        {basketCount} / €{calculateTotal().toFixed(2)}
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="d-none d-lg-flex align-items-center custom-cart-container">
                        <Link to="/basket" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-cart-fill" style={{ fontSize: '2rem' }}></i>
                            <span className="mx-2">
                                {basketCount} / €{calculateTotal().toFixed(2)}
                            </span>
                        </Link>
                    </div>
                    
                </div>
            </nav>
        </>
    );
};

export default NavBar;
