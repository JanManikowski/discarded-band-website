import React from "react";
import "../styles/global.css";
import "../styles/responsive.css";
import { commonTitleStyle } from "../styles/constants";

const AboutUs = () => {
  return (
    <div
      className="about-us-page container-fluid text-white d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundColor: "#0A060D",
        minHeight: "100vh",
        padding: "120px 20px",
      }}
    >
      <div className="container text-center" style={{ maxWidth: "800px" }}>
      <h1 style={commonTitleStyle}>ABOUT US</h1>

        {/* Band Description */}
        <p
          className="mb-4"
          style={{
            fontSize: "1.3rem",
            lineHeight: "1.9",
            color: "#e0e0e0",
          }}
        >
          Discarded is a{" "}
          <span style={{ fontWeight: "bold", color: "#ff4d4d" }}>thall</span>,{" "}
          <span style={{ fontWeight: "bold", color: "#ff4d4d" }}>slam</span>, and{" "}
          <span style={{ fontWeight: "bold", color: "#ff4d4d" }}>
            technical death metal
          </span>{" "}
          band delivering relentless auditory assaults that reflect on the darkest
          corners of existence. Our music dives into themes of corruption,
          existential dread, and the inevitable reckoning.
        </p>

        {/* Music Themes */}
        <p
          className="mb-4"
          style={{
            fontSize: "1.3rem",
            lineHeight: "1.9",
            color: "#e0e0e0",
          }}
        >
          Our lyrics evoke vivid imagery of human decay and redemption. From the frothing
          black seas of despair to the call for humility and truth, we explore the chaos
          of humanity’s undoing and the courage needed to face it. Discarded creates an
          unrelenting journey through punishing riffs, guttural growls, and haunting
          atmospheres.
        </p>

        {/* Band Members */}
        <h2
          className="mt-5 mb-3 text-uppercase"
          style={{
            fontWeight: "bold",
            fontSize: "2.4rem",
            color: "#ff4d4d",
          }}
        >
          The Band
        </h2>
        <p
          className="mb-4"
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.9",
            color: "#e0e0e0",
          }}
        >
          We are a group of four musicians, each bringing unique energy to the stage:
        </p>
        <ul
          className="text-start"
          style={{
            listStyle: "none",
            paddingLeft: 0,
            fontSize: "1.2rem",
            lineHeight: "1.9",
            color: "#e0e0e0",
          }}
        >
          <li>
            <strong>Jan</strong>: Primal force on vocals, delivering guttural growls and
            anguished screams that tear through the void.
          </li>
          <li>
            <strong>Andy</strong>: The riff architect, crafting bone-crushing grooves and
            haunting melodies on guitar.
          </li>
          <li>
            <strong>Liam</strong>: The technical wizard on bass, bringing intricate lines
            and thunderous lows.
          </li>
          <li>
            <strong>Nikki</strong>: The rhythmic backbone, unleashing unrelenting brutality
            on drums, driving the chaos forward.
          </li>
        </ul>

        {/* Tagline */}
        <h3
          className="mt-5"
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: "1.8rem",
            color: "#ff4d4d",
          }}
        >
          "We are the sound of reckoning, the echoes of damnation, and the call for
          redemption."
        </h3>
      </div>
    </div>
  );
};

export default AboutUs;
