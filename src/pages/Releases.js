import React, { useState, useEffect } from 'react';
import { commonTitleStyle } from '../styles/constants';
import useSiteContent from '../hooks/useSiteContent';
import { DEFAULT_RELEASES, getReleaseSlots } from '../utils/spotify';
import SpotifyReleases from '../components/SpotifyReleases';

const Releases = () => {
    // Fallback keeps the current release showing if Firestore is unreachable
    // or the admin hasn't saved anything yet.
    const { data } = useSiteContent('releases', DEFAULT_RELEASES);
    const slots = getReleaseSlots(data);

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
                backgroundImage: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(196, 169, 106, 0.2), transparent)`,
                minHeight: '100vh',
                paddingTop: '120px',
                paddingBottom: '50px',
                transition: 'background 0.1s',
            }}
        >
            <div
                className="container text-center"
                style={{
                    maxWidth: '1300px',
                }}
            >
                <h1 style={commonTitleStyle}>LATEST RELEASES</h1>
                <SpotifyReleases slots={slots} />
            </div>
        </div>
    );
};

export default Releases;
