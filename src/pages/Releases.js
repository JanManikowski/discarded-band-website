import React from 'react';
import { commonTitleStyle } from '../styles/constants';
import useSiteContent from '../hooks/useSiteContent';
import { DEFAULT_RELEASES, getReleaseSlots } from '../utils/spotify';
import SpotifyReleases from '../components/SpotifyReleases';

const Releases = () => {
    // Fallback keeps the current release showing if Firestore is unreachable
    // or the admin hasn't saved anything yet.
    const { data } = useSiteContent('releases', DEFAULT_RELEASES);
    const slots = getReleaseSlots(data);

    return (
        <div
            className="container-fluid text-white d-flex flex-column justify-content-start align-items-center"
            style={{
                backgroundColor: '#0A060D',
                // A soft gold light from above (used to follow the mouse,
                // which re-drew the whole page on every movement).
                backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(196, 169, 106, 0.14), transparent 60%)',
                minHeight: '100vh',
                paddingBottom: '50px',
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
