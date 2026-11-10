import { prepareMerchItems, sanitizeMerchItem, splitMerchTitle, toDate, daysBetween } from "./merch";

const item = (id, extra = {}) => ({
  id,
  title: `Item ${id}`,
  type: "Shirt",
  url: `https://discardedband.bandcamp.com/merch/item-${id}`,
  priceText: "€20",
  soldOut: false,
  imageUrl: `https://f4.bcbits.com/img/00${id}_10.jpg`,
  thumbUrl: `https://f4.bcbits.com/img/00${id}_36.jpg`,
  ...extra,
});

describe("prepareMerchItems", () => {
  it("keeps Bandcamp's order but moves sold-out items to the end", () => {
    const result = prepareMerchItems([item("1"), item("2", { soldOut: true }), item("3")]);
    expect(result.map((i) => i.id)).toEqual(["1", "3", "2"]);
  });

  it("leaves out items hidden in admin", () => {
    expect(prepareMerchItems([item("1"), item("2")], ["2"]).map((i) => i.id)).toEqual(["1"]);
  });

  it("copes with missing data", () => {
    expect(prepareMerchItems(undefined)).toEqual([]);
    expect(prepareMerchItems(null, null)).toEqual([]);
  });
});

describe("sanitizeMerchItem", () => {
  it("drops items that don't link to Bandcamp", () => {
    expect(sanitizeMerchItem(item("1", { url: "https://evil.example.com/x" }))).toBeNull();
    // eslint-disable-next-line no-script-url -- checking that these are rejected
    expect(sanitizeMerchItem(item("1", { url: "javascript:alert(1)" }))).toBeNull();
    expect(sanitizeMerchItem(item("1", { url: "http://discardedband.bandcamp.com/merch/x" }))).toBeNull();
  });

  it("ignores images that aren't on Bandcamp's image server", () => {
    const clean = sanitizeMerchItem(item("1", { imageUrl: "https://evil.example.com/a.jpg", thumbUrl: "https://evil.example.com/b.jpg" }));
    expect(clean.imageUrl).toBeNull();
  });

  it("falls back to the thumbnail when the large image is missing", () => {
    expect(sanitizeMerchItem(item("1", { imageUrl: null })).imageUrl).toBe("https://f4.bcbits.com/img/001_36.jpg");
  });

  it("never shows a price for sold-out items", () => {
    expect(sanitizeMerchItem(item("1", { soldOut: true })).priceText).toBe("");
  });
});

describe("splitMerchTitle", () => {
  it("moves the bit in brackets to its own line", () => {
    expect(splitMerchTitle("Logo T-Shirt (includes digital album)")).toEqual({
      name: "Logo T-Shirt",
      note: "Includes digital album",
    });
  });

  it("leaves other titles alone", () => {
    expect(splitMerchTitle("Humility – CD Wallet")).toEqual({ name: "Humility – CD Wallet", note: "" });
    expect(splitMerchTitle("(Untitled)")).toEqual({ name: "(Untitled)", note: "" });
  });
});

describe("dates", () => {
  it("reads Firestore timestamps and plain dates", () => {
    const d = new Date("2026-11-10T05:23:00Z");
    expect(toDate({ toDate: () => d })).toBe(d);
    expect(toDate(d)).toBe(d);
    expect(toDate(null)).toBeNull();
    expect(toDate("not a date")).toBeNull();
  });

  it("counts whole days", () => {
    expect(daysBetween(new Date("2026-11-07T10:00:00Z"), new Date("2026-11-10T09:00:00Z"))).toBe(2);
  });
});
