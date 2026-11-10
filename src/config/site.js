// Contact details used across the public site (footer, contact page, press kit).
// Change it here and it updates everywhere.
export const BOOKING_EMAIL = "discardedsoftrock@gmail.com";

// The band's Bandcamp merch page. The daily sync copies the items from here
// (see .github/workflows/sync-merch.yml); the Merch page links back to it.
export const BANDCAMP_MERCH_URL = "https://discardedband.bandcamp.com/merch";

// Where to start the merch sync by hand ("Run workflow").
export const MERCH_SYNC_WORKFLOW_URL =
  "https://github.com/JanManikowski/discarded-band-website/actions/workflows/sync-merch.yml";
