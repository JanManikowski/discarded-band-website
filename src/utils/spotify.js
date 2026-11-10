const SPOTIFY_TYPES = "album|track|playlist";

/**
 * Parses a Spotify share link (album, track, or playlist) and returns the
 * type and ID needed to build an embed URL. Accepts links like:
 *   https://open.spotify.com/album/0ANUjzcDPHW7odAObHKKJy?si=abc123
 *   https://open.spotify.com/intl-nl/track/abcdef1234567890abcdef
 *   https://open.spotify.com/embed/album/0ANUjzcDPHW7odAObHKKJy
 *   spotify:album:0ANUjzcDPHW7odAObHKKJy
 * Also accepts a bare ID (assumes "album") for backwards compatibility.
 *
 * Returns null if the input doesn't look like a valid Spotify link/ID.
 */
export const parseSpotifyLink = (input) => {
  if (!input) return null;
  const trimmed = input.trim();

  // Full URL. The Spotify app often adds a language segment ("/intl-nl/"),
  // and embed links have "/embed/" in front of the type.
  const urlMatch = trimmed.match(
    new RegExp(
      `open\\.spotify\\.com\\/(?:intl-[a-zA-Z-]+\\/)?(?:embed\\/)?(${SPOTIFY_TYPES})\\/([a-zA-Z0-9]+)`
    )
  );
  if (urlMatch) {
    return { type: urlMatch[1], id: urlMatch[2] };
  }

  // Spotify URI: spotify:album:{id}
  const uriMatch = trimmed.match(new RegExp(`^spotify:(${SPOTIFY_TYPES}):([a-zA-Z0-9]+)$`));
  if (uriMatch) {
    return { type: uriMatch[1], id: uriMatch[2] };
  }

  // Bare ID (just the 22-char base62 string) - assume album.
  if (/^[a-zA-Z0-9]{15,25}$/.test(trimmed)) {
    return { type: "album", id: trimmed };
  }

  return null;
};

export const buildSpotifyEmbedUrl = ({ type, id }) => {
  // theme=0 forces Spotify's dark player. Without it, Spotify tints the
  // player background using colours sampled from the album artwork, which
  // clashes with the site whenever a release has a bright cover.
  return `https://open.spotify.com/embed/${type}/${id}?theme=0`;
};

export const buildSpotifyShareUrl = ({ type, id }) => `https://open.spotify.com/${type}/${id}`;

// Shown if Firestore is unreachable or the admin hasn't saved anything yet.
export const DEFAULT_RELEASES = {
  spotifyType: "album",
  spotifyId: "0ANUjzcDPHW7odAObHKKJy",
  latestLabel: "Latest Release",
  albumType: null,
  albumId: null,
  albumLabel: "Current Album",
};

/**
 * Turns the "site_content/releases" document into the list of Spotify
 * players to show, in order: [latest release, current album].
 *
 * The latest release keeps the original field names (spotifyType /
 * spotifyId) so documents saved before the second player existed still work.
 * An empty album slot - or an album that's the same as the latest release -
 * is skipped, so the page never shows the same player twice.
 */
export const getReleaseSlots = (data = {}) => {
  const slots = [];

  if (data.spotifyType && data.spotifyId) {
    slots.push({
      key: "latest",
      label: data.latestLabel || DEFAULT_RELEASES.latestLabel,
      type: data.spotifyType,
      id: data.spotifyId,
    });
  }

  if (data.albumType && data.albumId) {
    const isDuplicate = slots.some((s) => s.type === data.albumType && s.id === data.albumId);
    if (!isDuplicate) {
      slots.push({
        key: "album",
        label: data.albumLabel || DEFAULT_RELEASES.albumLabel,
        type: data.albumType,
        id: data.albumId,
      });
    }
  }

  return slots.map((slot) => ({ ...slot, embedUrl: buildSpotifyEmbedUrl(slot) }));
};
