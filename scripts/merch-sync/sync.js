"use strict";

/**
 * Copies the band's merch from Bandcamp into Firestore (site_content/merch),
 * where the website's Merch page reads it. Runs once a day from GitHub
 * Actions (.github/workflows/sync-merch.yml), or by hand:
 *
 *   node sync.js --dry-run     show what would be saved, write nothing
 *   node sync.js               needs FIREBASE_SERVICE_ACCOUNT (the key JSON)
 *
 * If Bandcamp can't be read or the page layout changed, nothing is
 * overwritten: the site keeps the last good list, the error is saved next to
 * it so the admin page can show it, and the run fails (GitHub emails you).
 */

const { parseMerchPage } = require("./parseMerch");

const DEFAULT_MERCH_URL = "https://discardedband.bandcamp.com/merch";
const USER_AGENT = "DiscardedWebsiteMerchSync/1.0 (+https://discardedband.com)";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPage(url, fetchImpl, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetchImpl(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`Bandcamp answered ${res.status} ${res.statusText || ""}`.trim());
      return await res.text();
    } catch (err) {
      lastError = err;
      if (attempt < attempts) await sleep(2000 * attempt);
    }
  }
  throw lastError;
}

// The large image size has worked for every merch photo so far; if one
// doesn't exist, use the grid thumbnail instead of showing a broken image.
async function checkImages(items, fetchImpl) {
  await Promise.all(
    items.map(async (item) => {
      if (!item.imageUrl || item.imageUrl === item.thumbUrl) return;
      try {
        const res = await fetchImpl(item.imageUrl, {
          method: "HEAD",
          headers: { "User-Agent": USER_AGENT },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) item.imageUrl = item.thumbUrl;
      } catch {
        item.imageUrl = item.thumbUrl;
      }
    })
  );
}

/**
 * One sync run. Everything it needs is passed in, so tests can use fakes.
 * Returns the items found; throws (after recording the error) on failure.
 */
async function runSync({
  merchUrl = DEFAULT_MERCH_URL,
  fetchImpl = fetch,
  docRef = null,
  serverTimestamp = () => new Date(),
  log = console.log,
  attempts = 3,
}) {
  try {
    const html = await fetchPage(merchUrl, fetchImpl, attempts);
    const items = parseMerchPage(html, merchUrl);
    if (items.length === 0) {
      throw new Error("Found no merch items on the Bandcamp page; Bandcamp may have changed its layout.");
    }
    await checkImages(items, fetchImpl);

    log(`Found ${items.length} merch items on ${merchUrl}:`);
    items.forEach((item) => log(`  - ${item.title} | ${item.soldOut ? "SOLD OUT" : item.priceText || "no price"}`));

    if (docRef) {
      await docRef.set(
        { items, sourceUrl: merchUrl, syncedAt: serverTimestamp(), lastCheckAt: serverTimestamp(), lastError: null },
        { merge: true }
      );
      log("Saved to Firestore: site_content/merch");
    } else {
      log("Dry run: nothing saved.");
    }
    return items;
  } catch (err) {
    if (docRef) {
      // Only the error and time are written; the saved items stay as they were.
      await docRef
        .set({ lastCheckAt: serverTimestamp(), lastError: err.message }, { merge: true })
        .catch((saveErr) => log(`Also couldn't save the error to Firestore: ${saveErr.message}`));
    }
    throw err;
  }
}

function connectFirestore() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not set. Add the Firebase key as a GitHub Actions secret with that name.");
  }
  let credentials;
  try {
    credentials = JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT isn't valid JSON. Paste the whole contents of the downloaded key file into the secret.");
  }
  const { initializeApp, cert } = require("firebase-admin/app");
  const { getFirestore, FieldValue } = require("firebase-admin/firestore");
  initializeApp({ credential: cert(credentials) });
  return {
    docRef: getFirestore().doc("site_content/merch"),
    serverTimestamp: () => FieldValue.serverTimestamp(),
  };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const merchUrl = process.env.MERCH_URL || DEFAULT_MERCH_URL;
  const firestore = dryRun ? {} : connectFirestore();
  await runSync({ merchUrl, ...firestore });
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`Merch sync failed: ${err.message}`);
    process.exitCode = 1;
  });
}

module.exports = { runSync, fetchPage, checkImages, DEFAULT_MERCH_URL };
