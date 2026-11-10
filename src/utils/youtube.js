/**
 * Gets the 11-character video ID out of any common YouTube link:
 *   https://www.youtube.com/watch?v=ID&t=10s
 *   https://youtu.be/ID?si=...
 *   https://www.youtube.com/embed/ID, /shorts/ID, /live/ID
 *   https://music.youtube.com/watch?v=ID
 * Returns null if it isn't a YouTube video link.
 */
export const parseYouTubeId = (input) => {
  const trimmed = (input || "").trim();
  if (!trimmed) return null;

  let url;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  const isId = (s) => /^[A-Za-z0-9_-]{11}$/.test(s || "");
  const segments = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") {
    return isId(segments[0]) ? segments[0] : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (isId(v)) return v;
    if (["embed", "shorts", "live", "v"].includes(segments[0]) && isId(segments[1])) {
      return segments[1];
    }
  }
  return null;
};

/** Privacy-friendly embed (no tracking cookies until the visitor presses play). */
export const buildYouTubeEmbedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
