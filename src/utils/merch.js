// Helpers for the merch synced from Bandcamp (site_content/merch).

const hostIs = (value, domain) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
};

/**
 * Only links to Bandcamp and images from Bandcamp's image server are used,
 * whatever ends up in Firestore. Returns a cleaned copy, or null if the item
 * can't be shown.
 */
export const sanitizeMerchItem = (item) => {
  if (!item || !item.id || !(item.title || "").trim() || !hostIs(item.url, "bandcamp.com")) return null;
  const image = [item.imageUrl, item.thumbUrl].find((u) => hostIs(u, "bcbits.com")) || null;
  return {
    id: String(item.id),
    title: item.title.trim(),
    type: (item.type || "").trim(),
    url: item.url,
    priceText: item.soldOut ? "" : (item.priceText || "").trim(),
    soldOut: Boolean(item.soldOut),
    imageUrl: image,
    thumbUrl: hostIs(item.thumbUrl, "bcbits.com") ? item.thumbUrl : image,
  };
};

/**
 * What the Merch page shows: valid items, minus the ones hidden in admin,
 * in Bandcamp's order but with sold-out items moved to the end.
 */
export const prepareMerchItems = (items, hiddenIds = []) => {
  const hidden = new Set((hiddenIds || []).map(String));
  const visible = (Array.isArray(items) ? items : [])
    .map(sanitizeMerchItem)
    .filter((item) => item && !hidden.has(item.id));
  return [...visible.filter((i) => !i.soldOut), ...visible.filter((i) => i.soldOut)];
};

/**
 * "Logo T-Shirt (includes digital album)" → { name: "Logo T-Shirt", note: "Includes digital album" }
 * so the extra bit can be shown as a small line under the name.
 */
export const splitMerchTitle = (title) => {
  const match = (title || "").match(/^(.*\S)\s*\(([^()]+)\)\s*$/);
  if (!match) return { name: (title || "").trim(), note: "" };
  const note = match[2].trim();
  return { name: match[1].trim(), note: note.charAt(0).toUpperCase() + note.slice(1) };
};

/** Firestore Timestamp, Date or nothing → Date or null */
export const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Whole days between two dates (for "synced 3 days ago"). */
export const daysBetween = (from, to = new Date()) =>
  Math.floor((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
