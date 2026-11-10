import {
  FaSpotify,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaBandcamp,
  FaFacebookF,
  FaSoundcloud,
  FaXTwitter,
  FaThreads,
  FaDeezer,
  FaLink,
} from "react-icons/fa6";
import { SiApplemusic, SiAmazonmusic } from "react-icons/si";

/**
 * Every platform the Socials page knows about: name, icon, brand colour
 * and the call to action on its card. `domains` is used to recognise the
 * platform from a pasted link, so the admin only has to paste the URL.
 * Anything not recognised falls back to "other" (a generic link card).
 */
export const PLATFORMS = {
  spotify: { name: "Spotify", icon: FaSpotify, color: "#1DB954", action: "Listen", domains: ["spotify.com", "spotify.link"] },
  bandcamp: { name: "Bandcamp", icon: FaBandcamp, color: "#629AA9", action: "Listen & buy", domains: ["bandcamp.com"] },
  applemusic: { name: "Apple Music", icon: SiApplemusic, color: "#FA243C", action: "Listen", domains: ["music.apple.com"] },
  youtube: { name: "YouTube", icon: FaYoutube, color: "#FF0033", action: "Watch", domains: ["youtube.com", "youtu.be"] },
  instagram: { name: "Instagram", icon: FaInstagram, color: "#E1306C", action: "Follow", domains: ["instagram.com"] },
  tiktok: { name: "TikTok", icon: FaTiktok, color: "#25F4EE", action: "Follow", domains: ["tiktok.com"] },
  facebook: { name: "Facebook", icon: FaFacebookF, color: "#1877F2", action: "Follow", domains: ["facebook.com", "fb.com", "fb.me"] },
  soundcloud: { name: "SoundCloud", icon: FaSoundcloud, color: "#FF5500", action: "Listen", domains: ["soundcloud.com"] },
  deezer: { name: "Deezer", icon: FaDeezer, color: "#A238FF", action: "Listen", domains: ["deezer.com", "deezer.page.link"] },
  amazonmusic: { name: "Amazon Music", icon: SiAmazonmusic, color: "#25D1DA", action: "Listen", domains: [], pattern: /(^|\.)music\.amazon\.[a-z.]+$/ },
  x: { name: "X", icon: FaXTwitter, color: "#FFFFFF", action: "Follow", domains: ["x.com", "twitter.com"] },
  threads: { name: "Threads", icon: FaThreads, color: "#FFFFFF", action: "Follow", domains: ["threads.net", "threads.com"] },
  other: { name: "Website", icon: FaLink, color: "#c4a96a", action: "Visit", domains: [] },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);

/** Adds https:// when someone pastes "instagram.com/..." without it. */
export const normalizeUrl = (input) => {
  const trimmed = (input || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
};

const hostOf = (url) => {
  try {
    return new URL(normalizeUrl(url)).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
};

/** Recognises the platform from a link, e.g. "https://www.tiktok.com/@x" → "tiktok". */
export const detectPlatform = (url) => {
  const host = hostOf(url);
  if (!host) return "other";
  const match = PLATFORM_KEYS.find((key) => {
    const p = PLATFORMS[key];
    if (p.pattern && p.pattern.test(host)) return true;
    return p.domains.some((d) => host === d || host.endsWith(`.${d}`));
  });
  return match || "other";
};

/**
 * A readable handle from the link when the admin didn't type one,
 * e.g. instagram.com/discarded_band → "@discarded_band",
 *      discarded.bandcamp.com      → "discarded.bandcamp.com".
 */
export const deriveHandle = (url, platformKey) => {
  let parsed;
  try {
    parsed = new URL(normalizeUrl(url));
  } catch {
    return "";
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const firstSegment = decodeURIComponent(parsed.pathname.split("/").filter(Boolean)[0] || "");

  if (platformKey === "bandcamp") return host;
  if (firstSegment.startsWith("@")) return firstSegment; // tiktok, youtube, threads
  if (["instagram", "x", "threads"].includes(platformKey) && /^[\w.]+$/.test(firstSegment)) {
    return `@${firstSegment}`;
  }
  if (platformKey === "other") return host;
  return "";
};

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** rgba() string from a hex colour, for glows and tints. */
export const withAlpha = (hex, alpha) => `rgba(${hexToRgb(hex).join(", ")}, ${alpha})`;

/**
 * Fills in everything a card needs from what was saved: the platform (saved
 * or detected), the title (saved or the platform name) and the handle.
 */
export const resolveSocialLink = (link) => {
  const url = normalizeUrl(link.url);
  const platformKey = PLATFORMS[link.platform] ? link.platform : detectPlatform(url);
  const platform = PLATFORMS[platformKey];
  return {
    ...link,
    url,
    platformKey,
    platform,
    title: (link.label || "").trim() || platform.name,
    handle: (link.handle || "").trim() || deriveHandle(url, platformKey),
    description: (link.description || "").trim(),
  };
};

// Shown until the band saves their own list in admin (or if Firestore is unreachable).
export const DEFAULT_SOCIALS = {
  heading: "Socials",
  intro: "Listen, watch and follow DISCARDED wherever you are.",
  links: [
    {
      id: "spotify",
      platform: "",
      url: "https://open.spotify.com/artist/2qkiNoOXU7MqFWGuXACSHK",
      label: "",
      handle: "DISCARDED",
      description: "Stream every release.",
      image: null,
    },
    {
      id: "instagram",
      platform: "",
      url: "https://www.instagram.com/discarded_band/",
      label: "",
      handle: "",
      description: "Show announcements, photos and clips.",
      image: null,
    },
  ],
};
