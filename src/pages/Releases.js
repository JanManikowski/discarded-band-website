import React, { useState, useEffect } from 'react';
import { commonTitleStyle } from '../styles/constants';

const Releases = () => {
    const albumId = '0acx688pBFccyiDVk4axg6'; // Replace with your album/track/playlist ID
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
            className="container-fluid text-white d-flex flex-column justify-content-center align-items-center "
            style={{
                backgroundColor: '#0A060D',
                backgroundImage: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(182, 28, 28, 0.2), transparent)`,
                minHeight: '100vh',
                paddingTop: '120px',
                paddingBottom: '50px',
                transition: 'background 0.1s',
            }}
        >
            <div
                className="container text-center"
                style={{
                    maxWidth: '900px',
                }}
            >
                <h1 style={commonTitleStyle}>LATEST RELEASES</h1>
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
        </div>
    );
};

export default Releases;
