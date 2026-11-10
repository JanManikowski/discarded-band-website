import { parseSpotifyLink, getReleaseSlots, DEFAULT_RELEASES } from "./spotify";

describe("parseSpotifyLink", () => {
  it("reads normal share links", () => {
    expect(parseSpotifyLink("https://open.spotify.com/album/0ANUjzcDPHW7odAObHKKJy?si=abc123")).toEqual({
      type: "album",
      id: "0ANUjzcDPHW7odAObHKKJy",
    });
  });

  it("reads links with a language segment from the Spotify app", () => {
    expect(parseSpotifyLink("https://open.spotify.com/intl-nl/track/4uLU6hMCjMI75M1A2tKUQC?si=x")).toEqual({
      type: "track",
      id: "4uLU6hMCjMI75M1A2tKUQC",
    });
    expect(parseSpotifyLink("https://open.spotify.com/intl-pt-BR/album/0ANUjzcDPHW7odAObHKKJy")).toEqual({
      type: "album",
      id: "0ANUjzcDPHW7odAObHKKJy",
    });
  });

  it("reads embed links and Spotify URIs", () => {
    expect(parseSpotifyLink("https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M")).toEqual({
      type: "playlist",
      id: "37i9dQZF1DXcBWIGoYBM5M",
    });
    expect(parseSpotifyLink("spotify:album:0ANUjzcDPHW7odAObHKKJy")).toEqual({
      type: "album",
      id: "0ANUjzcDPHW7odAObHKKJy",
    });
  });

  it("treats a bare ID as an album", () => {
    expect(parseSpotifyLink(" 0ANUjzcDPHW7odAObHKKJy ")).toEqual({ type: "album", id: "0ANUjzcDPHW7odAObHKKJy" });
  });

  it("rejects things that aren't Spotify releases", () => {
    expect(parseSpotifyLink("")).toBeNull();
    expect(parseSpotifyLink("https://www.youtube.com/watch?v=abc")).toBeNull();
    expect(parseSpotifyLink("https://open.spotify.com/artist/2qkiNoOXU7MqFWGuXACSHK")).toBeNull();
  });
});

describe("getReleaseSlots", () => {
  it("shows only the latest release for documents saved before the album slot existed", () => {
    const slots = getReleaseSlots({ spotifyType: "album", spotifyId: "AAA" });
    expect(slots).toHaveLength(1);
    expect(slots[0]).toMatchObject({ key: "latest", label: "Latest Release", type: "album", id: "AAA" });
    expect(slots[0].embedUrl).toBe("https://open.spotify.com/embed/album/AAA?theme=0");
  });

  it("shows latest release and current album, with custom titles", () => {
    const slots = getReleaseSlots({
      spotifyType: "track",
      spotifyId: "TTT",
      latestLabel: "New single",
      albumType: "album",
      albumId: "AAA",
      albumLabel: "Debut EP",
    });
    expect(slots.map((s) => [s.key, s.label])).toEqual([
      ["latest", "New single"],
      ["album", "Debut EP"],
    ]);
  });

  it("never shows the same release twice", () => {
    const slots = getReleaseSlots({ spotifyType: "album", spotifyId: "AAA", albumType: "album", albumId: "AAA" });
    expect(slots).toHaveLength(1);
  });

  it("has a working fallback", () => {
    expect(getReleaseSlots(DEFAULT_RELEASES)).toHaveLength(1);
  });
});
