import { buildOverview } from "./useAdminOverview";

// Only the pure overview builder is tested; keep Firebase out of the run.
jest.mock("../firebase/config", () => ({ db: {}, auth: {}, storage: {} }));

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

describe("buildOverview", () => {
  it("leaves out sections whose data couldn't be loaded", () => {
    expect(buildOverview({})).toEqual({});
  });

  it("names the next show, or warns when nothing is planned", () => {
    const next = buildOverview({ nextShow: { date: new Date(2026, 11, 5), venue: "Het Paard" } });
    expect(next.shows).toEqual({ text: "Next: 5 Dec · Het Paard", tone: "normal" });

    expect(buildOverview({ nextShow: null }).shows).toEqual({ text: "No upcoming shows", tone: "warn" });
  });

  it("counts Spotify players the same way the public pages do", () => {
    // Nothing saved yet: the site falls back to the default release
    expect(buildOverview({ releases: null }).releases.text).toBe("1 Spotify player on the site");

    const two = buildOverview({
      releases: { spotifyType: "album", spotifyId: "a1", albumType: "album", albumId: "a2" },
    });
    expect(two.releases.text).toBe("2 Spotify players on the site");

    const cleared = buildOverview({ releases: { spotifyType: "album", spotifyId: "" } });
    expect(cleared.releases).toEqual({ text: "No Spotify link set", tone: "warn" });
  });

  it("summarises About Us, the gallery and socials", () => {
    const overview = buildOverview({
      about: { members: [{ name: "Andy" }, { name: " " }], bandPhotos: [{}, {}, {}] },
      gallery: [{ photos: [{}, {}] }, { photos: [] }, { photos: [{}] }],
      socials: { links: [{ url: "https://instagram.com/x" }, { url: "" }] },
    });
    expect(overview.about.text).toBe("1 band member · 3 photos");
    expect(overview.gallery.text).toBe("2 shows · 3 photos");
    expect(overview.socials.text).toBe("1 link on the site");

    expect(buildOverview({ gallery: [] }).gallery).toEqual({ text: "No photos yet", tone: "warn" });
  });

  it("reports the merch sync: failed, never run, recent and stale", () => {
    expect(buildOverview({ merch: { lastError: "boom" } }).merch.tone).toBe("error");
    expect(buildOverview({ merch: null }).merch).toEqual({ text: "Not synced yet", tone: "warn" });

    const fresh = buildOverview({ merch: { syncedAt: new Date(), items: [{}, {}] } });
    expect(fresh.merch).toEqual({ text: "Synced today · 2 items", tone: "normal" });

    const stale = buildOverview({ merch: { syncedAt: daysAgo(5), items: [] } });
    expect(stale.merch).toEqual({ text: "Synced 5 days ago · 0 items", tone: "warn" });
  });

  it("lists what the press kit is still missing", () => {
    expect(buildOverview({ press: null }).press.text).toBe(
      "Missing: lineup photo, press quotes, video, tech rider"
    );

    const complete = buildOverview({
      press: {
        lineupPhoto: { url: "https://x/photo.jpg" },
        quotes: [{ text: "Crushing." }],
        videoUrl: "https://youtu.be/abc",
        rider: { url: "https://x/rider.pdf" },
      },
    });
    expect(complete.press).toEqual({ text: "Everything filled in", tone: "normal" });
  });
});
