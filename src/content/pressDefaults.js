// What the press kit shows before anything has been saved in admin.
// Sections without content (quotes, video, rider, photo) stay hidden.
export const DEFAULT_PRESS = {
  genreLine: "Thall and blackened deathcore",
  manifestoHtml: "", // empty = use the About Us intro
  lineupPhoto: null,
  quotes: [],
  videoTitle: "Ashes",
  videoUrl: "",
  rider: null,
};

/** True when rich-text HTML contains any visible text. */
export const hasText = (html) =>
  !!(html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
