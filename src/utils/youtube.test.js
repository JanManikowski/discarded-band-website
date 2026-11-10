import { parseYouTubeId, buildYouTubeEmbedUrl } from "./youtube";

describe("parseYouTubeId", () => {
  it.each([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s",
    "https://youtu.be/dQw4w9WgXcQ?si=abcdef",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://music.youtube.com/watch?v=dQw4w9WgXcQ&list=x",
    "youtube.com/watch?v=dQw4w9WgXcQ",
  ])("reads %s", (url) => {
    expect(parseYouTubeId(url)).toBe("dQw4w9WgXcQ");
  });

  it.each(["", "https://www.youtube.com/@discarded", "https://vimeo.com/123456", "not a link"])(
    "rejects %s",
    (url) => {
      expect(parseYouTubeId(url)).toBeNull();
    }
  );
});

it("builds a privacy-friendly embed link", () => {
  expect(buildYouTubeEmbedUrl("dQw4w9WgXcQ")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0");
});
