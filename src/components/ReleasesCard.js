import React, { useState, useEffect } from 'react';

const ReleasesCard = ({ albumId, title, style }) => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    // Update cursor position
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
                backgroundImage: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(182, 28, 28, 0.2), transparent)`,
                width: '100%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
                ...style, // Allow overriding styles via props
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px', // Add padding for spacing
                boxSizing: 'border-box', // Prevent padding overflow
                borderBottom: '1px solid white', // Added 1px white border bottom
                borderTop: '1px solid white', // Added 1px white border bottom
            
            }}
        >
            <div
                className="release-card-content text-center"
                style={{
                    maxWidth: '1200px', // Limit the width to ensure responsiveness
                    width: '90vw', // Use 90% of the viewport width for flexibility
                }}
            >
                <h1
                    className="mb-3"
                    style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#b61c1c',
                    }}
                >
                    {title || 'Latest Release'}
                </h1>
                <div
                    className="spotify-embed-wrapper"
                    style={{
                        backgroundColor: '#1e1e1e',
                        borderRadius: '10px',
                        padding: '10px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <iframe
                        src={`https://open.spotify.com/embed/album/${albumId}`}
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        title="Spotify Player"
                        style={{
                            borderRadius: '10px',
                            maxWidth: '100%', // Ensure full responsiveness
                            width: '100%', // Match container width
                            height: '400px', // Set height for a horizontal view
                            margin: '0 auto', // Center the iframe
                        }}
                    ></iframe>
                </div>
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
