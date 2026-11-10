import React from 'react';
import SpotifyReleases from './SpotifyReleases';
import { sectionTitleStyle } from '../styles/constants';

const ReleasesCard = ({ slots, title, style }) => {
    return (
        <div
            id="latest"
            className="release-card text-white d-flex flex-column justify-content-center align-items-center"
            style={{
                backgroundColor: '#0A060D',
                // A soft gold light from above (used to follow the mouse,
                // which re-drew the whole section on every movement).
                backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(196, 169, 106, 0.12), transparent 60%)',
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
            }}
        >
            <div
                className="release-card-content text-center"
                style={{
                    maxWidth: '1600px', // Limit the width to ensure responsiveness
                    width: '90vw', // Use 90% of the viewport width for flexibility
                }}
            >
                <h1 style={sectionTitleStyle}>{title || 'Latest Release'}</h1>
                <SpotifyReleases slots={slots} />
            </div>
        </div>
    );
};

export default ReleasesCard;
