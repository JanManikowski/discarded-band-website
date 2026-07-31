import React from "react";
import "../styles/global.css";
import "../styles/responsive.css";
import { commonTitleStyle } from "../styles/constants";
import useSiteContent from "../hooks/useSiteContent";

const DEFAULT_INTRO = `
  <p>Within the short time our species has walked this planet, through cooperation, we have built civilizations with the power to shatter mountains and conquer the sky.</p>
  <p>Wise humans, we named ourselves. But our empire is crumbling, and wisdom seems scarcer every single day.</p>
  <p>Despair, disillusionment, and dystopian atmospheres abound. How to lend meaning to a single human life has become increasingly meaningless as the experience of overwhelm through ever-increasing complexity is commonplace. This is our backdrop, this is our stage.</p>
  <p>Humanity feels <span style="color: #c4a96a; font-weight: bold;">DISCARDED</span>.</p>
`;

const DEFAULT_BAND_BIO = `
  <p>Not intending to be constrained by any genre, our main inspiration comes from genres like thall and blackened deathcore. As our debut EP releases, we've learned much - now it's time to incorporate those lessons. The more time we spend together, the more we refine our sound and shape the direction we want this band to take.</p>
  <p>This project holds deep meaning for each of us, and we're determined to create something unforgettable.</p>
`;

const AboutUs = () => {
  // Falls back to the original copy if Firestore is unreachable or the
  // admin hasn't saved anything yet - the page never ends up blank.
  const { data } = useSiteContent("aboutUs", {
    introHtml: DEFAULT_INTRO,
    bandBioHtml: DEFAULT_BAND_BIO,
    bandPhotos: [],
  });

  return (
    <div
      className="about-us-page container-fluid text-white"
    >
      {/* ABOUT US Section */}
      <div className="text-section container text-center py-5">
        <h1 style={commonTitleStyle}>ABOUT US</h1>
        <div
          className="about-text mx-auto"
          style={{ maxWidth: "800px", fontSize: "1.2rem", lineHeight: "1.8", color: "#e0e0e0" }}
          dangerouslySetInnerHTML={{ __html: data.introHtml }}
        />
      </div>

      {/* THE BAND Section */}
      <div className="text-section container text-center">
        <h1
          style={{
            color: "#c4a96a",
            fontWeight: "bold",
            fontSize: "2.5rem",
          }}
        >
          THE BAND
        </h1>
        <div
          className="band-text mx-auto"
          style={{
            maxWidth: "800px",
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "#e0e0e0",
          }}
          dangerouslySetInnerHTML={{ __html: data.bandBioHtml }}
        />

        <div
          className="mx-auto"
          style={{
            maxWidth: "800px",
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "#e0e0e0",
            paddingBottom: "1rem"
          }}
        >
          <br></br>
          <p>Vocals: Andy Meijer</p>
          <p>Rhythm: Nei Nikki Šon & Liam Rolink</p>
          {/* <p>Lead: Jan Manikowski</p> */}
          <p>Drums: Bas Gijzen</p>
        </div>

        {data.bandPhotos && data.bandPhotos.length > 0 && (
          <div className="band-photos row justify-content-center mt-4">
            {data.bandPhotos.map((photo) => (
              <div key={photo.storagePath} className="col-12 col-md-5 mb-3">
                <img
                  src={photo.url}
                  alt="Band"
                  className="img-fluid rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;