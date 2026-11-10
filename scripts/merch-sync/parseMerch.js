"use strict";

const cheerio = require("cheerio");

// Bandcamp serves every image in several sizes, chosen by the number before
// ".jpg" (from Bandcamp's own image_formats list):
//   36 = 400x300 crop  (what the merch grid shows)
//   10 = up to 1200px, not cropped  (used for the website cards)
const GRID_IMAGE_FORMAT = 36;
const LARGE_IMAGE_FORMAT = 10;

const norm = (s) => (s || "").replace(/\s+/g, " ").trim();

const isBandcampUrl = (url) =>
  url.protocol === "https:" &&
  (url.hostname === "bandcamp.com" || url.hostname.endsWith(".bandcamp.com"));

const isBandcampImage = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "bcbits.com" || url.hostname.endsWith(".bcbits.com"));
  } catch {
    return false;
  }
};

/** Swaps the size number at the end of a Bandcamp image URL: ..._36.jpg → ..._10.jpg */
const imageWithFormat = (url, formatId) =>
  url.replace(/_\d{1,3}\.(jpg|jpeg|png|gif)$/i, `_${formatId}.jpg`);

/**
 * The number in a displayed price: "€20" → 20, "€12.50" → 12.5,
 * "€1.234,50" → 1234.5, "$1,234" → 1234. Returns null when there's none.
 */
const parseAmount = (priceText) => {
  const match = (priceText || "").match(/\d[\d.,\s]*/);
  if (!match) return null;
  let s = match[0].replace(/\s/g, "").replace(/[.,]$/, "");
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");

  if (lastDot !== -1 && lastComma !== -1) {
    // Both used: the last one is the decimal separator.
    s = lastDot > lastComma ? s.replace(/,/g, "") : s.replace(/\./g, "").replace(",", ".");
  } else if (lastComma !== -1) {
    s = /,\d{1,2}$/.test(s) ? s.replace(",", ".") : s.replace(/,/g, "");
  } else if (/\.\d{3}$/.test(s)) {
    s = s.replace(/\./g, ""); // "1.234" = thousands
  }

  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

/**
 * Reads the merch grid of a Bandcamp merch page (e.g.
 * https://discardedband.bandcamp.com/merch) and returns one object per item,
 * in the order Bandcamp shows them:
 *
 *   { id, title, type, url, priceText, currency, amount, soldOut, thumbUrl, imageUrl }
 *
 * Only links to *.bandcamp.com and images from *.bcbits.com are kept, so the
 * website never ends up linking somewhere unexpected.
 */
const parseMerchPage = (html, pageUrl) => {
  const $ = cheerio.load(html);
  const base = new URL(pageUrl);

  let rows = $("#merch-grid > li");
  if (rows.length === 0) rows = $("li.merch-grid-item");

  const items = [];
  const seen = new Set();

  rows.each((_, el) => {
    const li = $(el);
    const link = li.find("a[href]").first();
    const href = link.attr("href");
    if (!href) return;

    let url;
    try {
      url = new URL(href, base);
    } catch {
      return;
    }
    if (!isBandcampUrl(url) || !/^\/(merch|album|track)\//.test(url.pathname)) return;
    url.search = "";
    url.hash = "";

    const title = norm(li.find(".title").first().text()) || norm(link.text());
    if (!title) return;

    const id = norm(li.attr("data-item-id")) || `${url.pathname}#${title}`;
    if (seen.has(id)) return;
    seen.add(id);

    const priceBlock = li.find("p.price").first();
    const soldOut = li.find(".sold-out").length > 0 || /\bsold out\b/i.test(norm(priceBlock.text()));
    const priceText = soldOut ? "" : norm(li.find("span.price").first().text());

    const img = li.find("img").first();
    const rawImage = (img.attr("data-original") || img.attr("src") || "").split("?")[0];
    const thumbUrl = isBandcampImage(rawImage) ? rawImage : null;

    items.push({
      id,
      title,
      type: norm(li.find(".merchtype").first().text()),
      url: url.toString(),
      priceText,
      currency: soldOut ? "" : norm(li.find("span.currency").first().text()),
      amount: soldOut ? null : parseAmount(priceText),
      soldOut,
      thumbUrl,
      imageUrl: thumbUrl ? imageWithFormat(thumbUrl, LARGE_IMAGE_FORMAT) : null,
    });
  });

  return items;
};

module.exports = { parseMerchPage, parseAmount, imageWithFormat, GRID_IMAGE_FORMAT, LARGE_IMAGE_FORMAT };
