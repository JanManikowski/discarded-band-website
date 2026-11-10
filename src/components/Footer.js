import React from 'react';
import { Link } from 'react-router-dom';
import { BOOKING_EMAIL } from '../config/site';
import useSocials from '../hooks/useSocials';

const FOOTER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about-us', label: 'About Us' },
  { to: '/socials', label: 'Socials' },
  { to: '/contact', label: 'Contact' },
  { to: '/press', label: 'Press' },
];

const Footer = () => {
  // Always the current year, so the footer never goes out of date.
  const year = new Date().getFullYear();
  // Same links as the Socials page, managed in admin.
  const { links } = useSocials();

  return (
    <footer
      className="text-center text-white py-4"
      style={{
        backgroundColor: '#0A060D',
        borderTop: '1px solid #ffffff',
      }}
    >
      <p className="footer-booking">
        For booking you can contact us at{' '}
        <a href={`mailto:${BOOKING_EMAIL}`}>{BOOKING_EMAIL}</a>
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '0 20px',
        textAlign: 'center',
      }}>
        <nav className="footer-links" aria-label="Footer">
          {FOOTER_LINKS.map((link, i) => (
            <React.Fragment key={link.to}>
              {i > 0 && <span className="footer-sep" aria-hidden="true">|</span>}
              <Link to={link.to} className="text-white">{link.label}</Link>
            </React.Fragment>
          ))}
        </nav>
        {links.length > 0 && (
          <div className="footer-socials">
            {links.map((link) => {
              const Icon = link.platform.icon;
              return (
                <a
                  key={link.id || link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.title}
                  title={link.title}
                >
                  <Icon size={22} />
                </a>
              );
            })}
          </div>
        )}
      </div>
      <p className="footer-copyright">&copy; {year} Discarded Band. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
