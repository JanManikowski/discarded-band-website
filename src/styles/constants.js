// Page titles ("SHOWS", "MERCH", ...): same font, size and distance from
// the menu on every page.
export const commonTitleStyle = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "clamp(1.9rem, 5vw, 2.6rem)",
    letterSpacing: "0.08em",
    color: "#c4a96a",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: "40px",
    paddingTop: "clamp(130px, 10vw, 150px)", // clears the fixed menu
};

// Section titles inside a page (e.g. "THE BAND", "UPCOMING SHOWS" on Home):
// same look, without the space reserved for the menu.
export const sectionTitleStyle = {
    ...commonTitleStyle,
    paddingTop: 0,
    marginBottom: "32px",
};
