/**
 * Parses a Spotify share link (album, track, or playlist) and returns the
 * type and ID needed to build an embed URL. Accepts links like:
 *   https://open.spotify.com/album/0ANUjzcDPHW7odAObHKKJy?si=abc123
 *   https://open.spotify.com/track/abcdef1234567890abcdef
 * Also accepts a bare ID (assumes "album") for backwards compatibility.
 *
 * Returns null if the input doesn't look like a valid Spotify link/ID.
 */
export const parseSpotifyLink = (input) => {
  if (!input) return null;
  const trimmed = input.trim();

  // Full URL: https://open.spotify.com/{type}/{id}?...
  const urlMatch = trimmed.match(
    /open\.spotify\.com\/(album|track|playlist)\/([a-zA-Z0-9]+)/
  );
  if (urlMatch) {
    return { type: urlMatch[1], id: urlMatch[2] };
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