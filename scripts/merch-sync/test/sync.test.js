"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { runSync } = require("../sync");

const MERCH_URL = "https://discardedband.bandcamp.com/merch";
const fixture = fs.readFileSync(path.join(__dirname, "..", "fixtures", "merch-page.html"), "utf8");

// A fake fetch: the merch page returns `pageHtml`, images return `imageStatus`.
const fakeFetch = ({ pageHtml = fixture, pageStatus = 200, imageStatus = 200, failImages = [] } = {}) =>
  async (url, options = {}) => {
    if (url === MERCH_URL) {
      return { ok: pageStatus === 200, status: pageStatus, statusText: "", text: async () => pageHtml };
    }
    if (options.method === "HEAD") {
      const status = failImages.some((part) => url.includes(part)) ? 404 : imageStatus;
      return { ok: status === 200, status };
    }
    throw new Error(`Unexpected request to ${url}`);
  };

// A fake Firestore document that records what was written.
const fakeDoc = () => {
  const writes = [];
  return { writes, set: async (data, options) => writes.push({ data, options }) };
};

const quiet = () => {};

test("saves the items with the time and clears any old error", async () => {
  const docRef = fakeDoc();
  const items = await runSync({ merchUrl: MERCH_URL, fetchImpl: fakeFetch(), docRef, log: quiet, serverTimestamp: () => "NOW" });

  assert.equal(items.length, 6);
  assert.equal(docRef.writes.length, 1);
  const { data, options } = docRef.writes[0];
  assert.deepEqual(options, { merge: true });
  assert.equal(data.items.length, 6);
  assert.equal(data.syncedAt, "NOW");
  assert.equal(data.lastError, null);
  assert.equal(data.sourceUrl, MERCH_URL);
});

test("falls back to the thumbnail when the large image doesn't exist", async () => {
  const items = await runSync({
    merchUrl: MERCH_URL,
    fetchImpl: fakeFetch({ failImages: ["0040947371_10"] }),
    log: quiet,
  });
  const shirt = items.find((i) => i.id === "2232621981");
  assert.equal(shirt.imageUrl, shirt.thumbUrl);
  const cd = items.find((i) => i.id === "3237060017");
  assert.equal(cd.imageUrl, "https://f4.bcbits.com/img/0040947285_10.jpg");
});

test("keeps the saved list when the page layout changed, and records the error", async () => {
  const docRef = fakeDoc();
  await assert.rejects(
    runSync({
      merchUrl: MERCH_URL,
      fetchImpl: fakeFetch({ pageHtml: "<html><body>New layout</body></html>" }),
      docRef,
      log: quiet,
      attempts: 1,
    }),
    /no merch items/i
  );
  assert.equal(docRef.writes.length, 1);
  const { data } = docRef.writes[0];
  assert.equal("items" in data, false, "items must not be overwritten");
  assert.match(data.lastError, /no merch items/i);
});

test("keeps the saved list when Bandcamp is down", async () => {
  const docRef = fakeDoc();
  await assert.rejects(
    runSync({ merchUrl: MERCH_URL, fetchImpl: fakeFetch({ pageStatus: 503 }), docRef, log: quiet, attempts: 1 }),
    /503/
  );
  assert.equal("items" in docRef.writes[0].data, false);
});

test("a dry run writes nothing", async () => {
  const items = await runSync({ merchUrl: MERCH_URL, fetchImpl: fakeFetch(), log: quiet });
  assert.equal(items.length, 6);
});
