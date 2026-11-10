// What the About Us page shows before anything has been saved in admin
// (or if Firestore can't be reached), so the page is never blank.
// Shared by the public page, the admin editor and the press kit.

export const DEFAULT_INTRO = `
  <p>Within the short time our species has walked this planet, through cooperation, we have built civilizations with the power to shatter mountains and conquer the sky.</p>
  <p>Wise humans, we named ourselves. But our empire is crumbling, and wisdom seems scarcer every single day.</p>
  <p>Despair, disillusionment, and dystopian atmospheres abound. How to lend meaning to a single human life has become increasingly meaningless as the experience of overwhelm through ever-increasing complexity is commonplace. This is our backdrop, this is our stage.</p>
  <p>Humanity feels <span style="color: #c4a96a; font-weight: bold;">DISCARDED</span>.</p>
`;

export const DEFAULT_BAND_BIO = `
  <p>Not intending to be constrained by any genre, our main inspiration comes from genres like thall and blackened deathcore. As our debut EP releases, we've learned much - now it's time to incorporate those lessons. The more time we spend together, the more we refine our sound and shape the direction we want this band to take.</p>
  <p>This project holds deep meaning for each of us, and we're determined to create something unforgettable.</p>
`;

export const DEFAULT_MEMBERS = [
  { role: "Vocals", name: "Andy Meijer" },
  { role: "Rhythm", name: "Nei Nikki Šon & Liam Rolink" },
  { role: "Drums", name: "Bas Gijzen" },
];

export const DEFAULT_ABOUT_US = {
  title: "About Us",
  introHtml: DEFAULT_INTRO,
  bandTitle: "The Band",
  bandBioHtml: DEFAULT_BAND_BIO,
  members: DEFAULT_MEMBERS,
  bandPhotos: [],
};
