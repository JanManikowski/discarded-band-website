import { detectPlatform, deriveHandle, normalizeUrl, resolveSocialLink, withAlpha } from "./socialPlatforms";

describe("detectPlatform", () => {
  it.each([
    ["https://open.spotify.com/artist/2qkiNoOXU7MqFWGuXACSHK?si=x", "spotify"],
    ["https://discarded.bandcamp.com/album/ashes", "bandcamp"],
    ["https://music.apple.com/nl/artist/discarded/123", "applemusic"],
    ["https://www.youtube.com/@discarded", "youtube"],
    ["https://youtu.be/dQw4w9WgXcQ", "youtube"],
    ["https://music.youtube.com/channel/abc", "youtube"],
    ["instagram.com/discarded_band", "instagram"],
    ["https://www.tiktok.com/@discarded", "tiktok"],
    ["https://m.facebook.com/discardedband", "facebook"],
    ["https://soundcloud.com/discarded", "soundcloud"],
    ["https://www.deezer.com/artist/1", "deezer"],
    ["https://music.amazon.nl/artists/B0", "amazonmusic"],
    ["https://x.com/discarded", "x"],
    ["https://twitter.com/discarded", "x"],
    ["https://www.threads.net/@discarded", "threads"],
    ["https://linktr.ee/discarded", "other"],
    ["not a url at all", "other"],
  ])("%s → %s", (url, expected) => {
    expect(detectPlatform(url)).toBe(expected);
  });

  it("isn't fooled by look-alike domains", () => {
    expect(detectPlatform("https://notinstagram.com/x")).toBe("other");
  });
});

describe("deriveHandle", () => {
  it("builds handles from profile links", () => {
    expect(deriveHandle("https://www.instagram.com/discarded_band/", "instagram")).toBe("@discarded_band");
    expect(deriveHandle("https://www.tiktok.com/@discarded.band?lang=nl", "tiktok")).toBe("@discarded.band");
    expect(deriveHandle("https://www.youtube.com/@discarded", "youtube")).toBe("@discarded");
    expect(deriveHandle("https://discarded.bandcamp.com/", "bandcamp")).toBe("discarded.bandcamp.com");
  });

  it("leaves it empty when the link has no readable handle", () => {
    expect(deriveHandle("https://open.spotify.com/artist/2qkiNoOXU7MqFWGuXACSHK", "spotify")).toBe("");
    expect(deriveHandle("https://www.youtube.com/channel/UC123", "youtube")).toBe("");
  });
});

describe("normalizeUrl", () => {
  it("adds https:// when missing and keeps full links as they are", () => {
    expect(normalizeUrl(" instagram.com/discarded_band ")).toBe("https://instagram.com/discarded_band");
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
    expect(normalizeUrl("")).toBe("");
  });
});

describe("resolveSocialLink", () => {
  it("fills title, handle and platform from just a URL", () => {
    const link = resolveSocialLink({ url: "https://www.instagram.com/discarded_band/" });
    expect(link.platformKey).toBe("instagram");
    expect(link.title).toBe("Instagram");
    expect(link.handle).toBe("@discarded_band");
  });

  it("respects what the admin typed and a manually chosen platform", () => {
    const link = resolveSocialLink({
      url: "https://linktr.ee/discarded",
      platform: "bandcamp",
      label: "Merch",
      handle: "Shirts & vinyl",
    });
    expect(link.platformKey).toBe("bandcamp");
    expect(link.title).toBe("Merch");
    expect(link.handle).toBe("Shirts & vinyl");
  });
});

it("withAlpha turns brand colours into rgba", () => {
  expect(withAlpha("#1DB954", 0.2)).toBe("rgba(29, 185, 84, 0.2)");
  expect(withAlpha("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
});
