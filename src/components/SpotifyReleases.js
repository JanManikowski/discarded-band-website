import React from "react";

/**
 * The Spotify players for the band's releases (latest release + current
 * album). Two players sit side by side on desktop and stack on phones; a
 * single player keeps the original large size. Used on Home and Releases.
 *
 * @param {Array} slots - from getReleaseSlots(): [{ key, label, embedUrl }]
 */
const SpotifyReleases = ({ slots }) => {
  if (!slots || slots.length === 0) return null;

  const isPair = slots.length > 1;

  return (
    <div className={`spotify-releases ${isPair ? "is-pair" : "is-single"}`}>
      {slots.map((slot) => (
        <div className="spotify-release" key={slot.key}>
          {isPair && <h2 className="spotify-release-label">{slot.label}</h2>}
          <div className="spotify-release-frame">
            <iframe
              src={slot.embedUrl}
              title={`${slot.label} on Spotify`}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpotifyReleases;
