import React, { useState, useEffect } from 'react';
import SpotifyReleases from './SpotifyReleases';

const ReleasesCard = ({ slots, title, style }) => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    // Track the cursor so the glow follows it across the card
    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            id="latest"
            className="release-card text-white d-flex flex-column justify-content-center align-items-center"
            style={{
                backgroundColor: '#0A060D',
                backgroundImage: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(196, 169, 106, 0.16), transparent)`,
                width: '100%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
                ...style, // Allow overriding styles via props
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px', // Add padding for spacing
                boxSizing: 'border-box', // Prevent padding overflow
                borderTop: '1px solid rgba(255, 255, 255, 0.85)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.85)',
                transition: 'background 0.1s',
            }}
        >
            <div
                className="release-card-content text-center"
                style={{
                    maxWidth: '1600px', // Limit the width to ensure responsiveness
                    width: '90vw', // Use 90% of the viewport width for flexibility
                }}
            >
                <h1
                    className="mb-4"
                    style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#c4a96a',
                    }}
                >
                    {title || 'Latest Release'}
                </h1>
                <SpotifyReleases slots={slots} />
            </div>
            {/* <button
          className="btn btn-outline-light mt-5"
          onClick={() => {
            const featuredSection = document.getElementById("featured-section");
            if (featuredSection) {
              featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          See Merch
        </button> */}
        </div>
    );
};

export default ReleasesCard;