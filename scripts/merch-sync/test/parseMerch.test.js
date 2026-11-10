"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { parseMerchPage, parseAmount, imageWithFormat } = require("../parseMerch");

const PAGE_URL = "https://discardedband.bandcamp.com/merch";
const fixture = fs.readFileSync(path.join(__dirname, "..", "fixtures", "merch-page.html"), "utf8");

test("reads every item of the real merch grid, in Bandcamp's order", () => {
  const items = parseMerchPage(fixture, PAGE_URL);
  assert.deepEqual(
    items.map((i) => i.title),
    [
      "Humility – CD Wallet",
      "'Humility' T-Shirt (includes digital album)",
      "Premium Oversized T-Shirt (includes free CD copy)",
      "Logo Croptop (includes digital album)",
      "Offwhite Logo T-Shirt (includes digital album)",
      "Logo T-Shirt (includes digital album)",
    ]
  );
});

test("fills in links, prices, types and images", () => {
  const [cd, shirt] = parseMerchPage(fixture, PAGE_URL);
  assert.deepEqual(cd, {
    id: "3237060017",
    title: "Humility – CD Wallet",
    type: "Compact Disc",
    url: "https://discardedband.bandcamp.com/album/humility",
    priceText: "€5",
    currency: "EUR",
    amount: 5,
    soldOut: false,
    thumbUrl: "https://f4.bcbits.com/img/0040947285_36.jpg",
    imageUrl: "https://f4.bcbits.com/img/0040947285_10.jpg",
  });
  assert.equal(shirt.url, "https://discardedband.bandcamp.com/merch/humility-t-shirt-includes-digital-album");
  assert.equal(shirt.amount, 25);
});

test("marks sold-out items and leaves their price empty", () => {
  const soldOut = parseMerchPage(fixture, PAGE_URL).find((i) => i.id === "1240823959");
  assert.equal(soldOut.soldOut, true);
  assert.equal(soldOut.priceText, "");
  assert.equal(soldOut.amount, null);
});

test("ignores release links outside the merch grid", () => {
  const items = parseMerchPage(fixture, PAGE_URL);
  assert.equal(items.length, 6);
  assert.ok(items.every((i) => /^\d+$/.test(i.id)));
});

test("returns nothing for a page without a merch grid", () => {
  assert.deepEqual(parseMerchPage("<html><body><p>Not found</p></body></html>", PAGE_URL), []);
});

test("falls back to merch-grid-item rows if the grid's id changes", () => {
  const html = fixture.replace('id="merch-grid"', 'id="something-else"');
  assert.equal(parseMerchPage(html, PAGE_URL).length, 6);
});

test("only keeps Bandcamp links and Bandcamp images", () => {
  const html = `
    <ol id="merch-grid">
      <li data-item-id="1"><a href="https://evil.example.com/merch/x"><p class="title">Bad link</p></a></li>
      <li data-item-id="2"><a href="/merch/ok"><img src="https://evil.example.com/a_36.jpg"><p class="title">Bad image</p></a>
        <p class="price"><span class="price">€10</span></p></li>
      <li data-item-id="3"><a href="javascript:alert(1)"><p class="title">Script</p></a></li>
    </ol>`;
  const items = parseMerchPage(html, PAGE_URL);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, "Bad image");
  assert.equal(items[0].imageUrl, null);
  assert.equal(items[0].thumbUrl, null);
});

test("uses lazy-loaded image URLs and drops query strings", () => {
  const html = `
    <ol id="merch-grid">
      <li data-item-id="9"><a href="/merch/hoodie?from=grid"><img src="/img/0.gif" data-original="https://f4.bcbits.com/img/0011111111_36.jpg?x=1"><p class="title">Hoodie</p></a>
        <p class="price"><span class="price">€45</span><span class="currency">EUR</span></p></li>
    </ol>`;
  const [hoodie] = parseMerchPage(html, PAGE_URL);
  assert.equal(hoodie.url, "https://discardedband.bandcamp.com/merch/hoodie");
  assert.equal(hoodie.thumbUrl, "https://f4.bcbits.com/img/0011111111_36.jpg");
  assert.equal(hoodie.imageUrl, "https://f4.bcbits.com/img/0011111111_10.jpg");
});

test("parseAmount understands common price formats", () => {
  assert.equal(parseAmount("€20"), 20);
  assert.equal(parseAmount("€12.50"), 12.5);
  assert.equal(parseAmount("12,50 €"), 12.5);
  assert.equal(parseAmount("€1.234,50"), 1234.5);
  assert.equal(parseAmount("$1,234.00"), 1234);
  assert.equal(parseAmount("¥3000"), 3000);
  assert.equal(parseAmount("Sold Out"), null);
  assert.equal(parseAmount(""), null);
});

test("imageWithFormat swaps the Bandcamp size number", () => {
  assert.equal(imageWithFormat("https://f4.bcbits.com/img/0040947285_36.jpg", 10), "https://f4.bcbits.com/img/0040947285_10.jpg");
  assert.equal(imageWithFormat("https://f4.bcbits.com/img/0040947285_7.png", 10), "https://f4.bcbits.com/img/0040947285_10.jpg");
});
