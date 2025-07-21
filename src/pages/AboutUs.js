import React from "react";
import "../styles/global.css";
import "../styles/responsive.css";
import { commonTitleStyle } from "../styles/constants";
import BandPhoto1 from "../assets/band1.jpg";
import BandPhoto2 from "../assets/band2.jpg";


const AboutUs = () => {
  return (
    <div
      className="about-us-page container-fluid text-white"
      style={{ backgroundColor: "#0A060D" }}
    >
      {/* ABOUT US Section */}
      <div className="text-section container text-center py-5">
        <h1 style={commonTitleStyle}>ABOUT US</h1>
        <div
          className="about-text mx-auto"
          style={{ maxWidth: "800px", fontSize: "1.2rem", lineHeight: "1.8", color: "#e0e0e0" }}
        >
          <p>
            Within the short time our species has walked this planet, through cooperation, we have built civilizations with the power to shatter mountains and conquer the sky.
          </p>
          <p>
            Wise humans, we named ourselves. But our empire is crumbling, and wisdom seems scarcer every single day.
          </p>
          <p>
            Despair, disillusionment, and dystopian atmospheres abound. How to lend meaning to a single human life has become increasingly meaningless as the experience of overwhelm through ever-increasing complexity is commonplace. This is our backdrop, this is our stage.
          </p>
          <p className="font-weight-bold text-light">
            Humanity feels <span style={{ color: "#b61c1c", fontWeight: "bold" }}>DISCARDED</span>.
          </p>
        </div>
      </div>

      {/* THE BAND Section */}
      <div className="text-section container text-center">
        <h1
          style={{
            color: "#b61c1c",
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
        >
          <p>
            Not intending to be constrained by any genre, our main inspiration comes from genres like thall and blackened deathcore. As our debut EP releases, we've learned much - now it's time to incorporate those lessons. The more time we spend together, the more we refine our sound and shape the direction we want this band to take.
          </p>
          <p>This project holds deep meaning for each of us, and we’re determined to create something unforgettable.</p>
        </div>

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
          <p>Bass: Still looking, contact for audition.</p>
        </div>

        <div
          className="mx-auto"
          style={{
            maxWidth: "800px",
            fontSize: "0.6rem",
            lineHeight: "1.8",
            color: "#ffffffff",
            paddingBottom: "1rem"
          }}
        >
          <br></br>
          <p>Prayers to our beloved lead guitarist</p>
          <p style={{
            color: "#b61c1c",
          }}>Jan Manikowski</p>
        </div>



        <div className="band-photos row justify-content-center mt-4">
          <div className="col-12 col-md-5 mb-3">
            <img
              src={BandPhoto1}
              alt="Band photo 1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-md-5">
            <img
              src={BandPhoto2}
              alt="Band photo 2"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
