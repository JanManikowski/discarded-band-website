import React, { useState, useEffect } from 'react';

const Releases = () => {
    const albumId = '5lWIRgkSy5WWOMrZ7xxygH'; // Replace with your album/track/playlist ID
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
                <h1
                    className="mb-4"
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#b61c1c',
                    }}
                >
                    Latest Release
                </h1>
                <div
                    className="spotify-embed-wrapper"
                    style={{
                        backgroundColor: '#1e1e1e',
                        borderRadius: '10px',
                        padding: '10px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <iframe
                        src={`https://open.spotify.com/embed/album/${albumId}`}
                        width="100%"
                        height="380"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        title="Spotify Player"
                        style={{
                            borderRadius: '10px',
                        }}
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Releases;
