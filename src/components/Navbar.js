import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import `useLocation` for detecting the current route
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
    const location = useLocation(); // Get the current route

    useEffect(() => {
        const isHomePage = location.pathname === '/'; // Check if the current page is the `Home` page

        const updateNavbarStyle = () => {
            const scrollTop = window.scrollY;
            if (isHomePage && scrollTop === 0) {
                // Transparent navbar for Home page when at the top
                setNavbarStyle({
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderBottom: '2px solid transparent',
                    transition: 'background-color 0.5s ease, border-color 0.5s ease',
                });
            } else {
                // Dark navbar for all other cases
                setNavbarStyle({
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    borderBottom: '2px solid white',
                    transition: 'background-color 0.5s ease, border-color 0.5s ease',
                });
            }
        };

        // Update navbar style immediately on render
        updateNavbarStyle();

        // Add event listener for scroll
        if (isHomePage) {
            window.addEventListener('scroll', updateNavbarStyle);
        }

        return () => {
            if (isHomePage) {
                window.removeEventListener('scroll', updateNavbarStyle);
            }
        };
    }, [location.pathname]); // Re-run effect when the route changes

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = () => {
        setMenuOpen(false); // Close the menu when a link is clicked
    };

    return (
        <>
            {/* Overlay for the background */}
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
                onClick={handleLinkClick} // Close the menu when overlay is clicked
            ></div>

            <nav
                className="navbar navbar-expand-lg navbar-dark fixed-top"
                style={{
                    ...navbarStyle,
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 999,
                }}
            >
                <div className="container-fluid">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <img
                            src={logo}
                            alt="Logo"
                            className="img-fluid"
                            style={{
                                height: 'auto',
                                maxHeight: '60px', // Ensures the logo doesn't grow too large
                                width: 'auto',
                                maxWidth: '100%',
                            }}
                        />
                    </Link>

                    {/* Toggler for mobile */}
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

                    {/* Links */}
                    <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav mx-auto text-center">
                            <li className="nav-item">
                                <Link to="/products" className="nav-link text-light mx-2" onClick={handleLinkClick}>
                                    Products
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/faq" className="nav-link text-light mx-2" onClick={handleLinkClick}>
                                    FAQ
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link to="/about-us" className="nav-link text-light mx-2" onClick={handleLinkClick}>
                                    About Us
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/subscribe" className="nav-link text-light mx-2" onClick={handleLinkClick}>
                                    Subscribe
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link text-light mx-2" onClick={handleLinkClick}>
                                    Contact
                                </Link>
                            </li>
                            {/* Shopping Cart in Mobile */}
                            <li className="nav-item d-lg-none"> {/* Hidden on large screens */}
                                <Link
                                    to="/basket"
                                    className="nav-link text-light d-flex align-items-center justify-content-center"
                                    onClick={handleLinkClick}
                                >
                                    <i className="bi bi-cart-fill" style={{ fontSize: '1.5rem' }}></i>
                                    <span className="mx-2">
                                        {basketCount} / ${calculateTotal().toFixed(2)}
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Shopping Cart on the Right (Visible on Larger Screens) */}
                    <div className="d-none d-lg-flex align-items-center"> {/* Hidden on small screens */}
                        <Link to="/basket" className="nav-link text-light d-flex align-items-center">
                            <i className="bi bi-cart-fill" style={{ fontSize: '1.5rem' }}></i>
                            <span className="mx-2">
                                {basketCount} / ${calculateTotal().toFixed(2)}
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavBar;
