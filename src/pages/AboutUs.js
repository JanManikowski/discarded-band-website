import React from "react";
import "../styles/global.css";
import "../styles/responsive.css";

const AboutUs = () => {
  return (
    <div
      className="about-us-page container-fluid"
      style={{
        backgroundColor: "#0A060D",
        color: "white",
        minHeight: "100vh",
        padding: "120px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "800px",
          textAlign: "center",
        }}
      >
        <h1
          className="mb-4"
          style={{
            fontWeight: "bold",
            fontSize: "2.5rem",
            color: "#ff4d4d",
            textTransform: "uppercase",
          }}
        >
          About Us
        </h1>

        {/* Band Description */}
        <p
          className="mb-3"
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "#e0e0e0",
          }}
        >
          Discarded is a <span style={{ fontWeight: "bold", color: "#ffdd00" }}>thall</span>,{" "}
          <span style={{ fontWeight: "bold", color: "#ffdd00" }}>slam</span>, and{" "}
          <span style={{ fontWeight: "bold", color: "#ffdd00" }}>technical death metal</span> band
          delivering relentless auditory assaults that reflect on the darkest corners of existence.
          Our music dives into themes of corruption, existential dread, and the inevitable reckoning.
        </p>

        {/* Music Themes */}
        <p
          className="mb-3"
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "#e0e0e0",
          }}
        >
          Our lyrics evoke vivid imagery of human decay and redemption. From the frothing black seas
          of despair to the call for humility and truth, we explore the chaos of humanity’s undoing
          and the courage needed to face it. Discarded creates an unrelenting journey through punishing
          riffs, guttural growls, and haunting atmospheres.
        </p>

        {/* Band Members */}
        <h2
          className="mt-4 mb-3"
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
            color: "#ff4d4d",
            textTransform: "uppercase",
          }}
        >
          The Band
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "#e0e0e0",
          }}
        >
          We are a group of four musicians, each bringing unique energy to the stage:
        </p>
        <ul
          style={{
            textAlign: "left",
            listStyle: "none",
            paddingLeft: 0,
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "#e0e0e0",
          }}
        >
          <li>
            <strong>Jan</strong>: Primal force on vocals, delivering guttural growls and anguished
            screams that tear through the void.
          </li>
          <li>
            <strong>Andy</strong>: The riff architect, crafting bone-crushing grooves and haunting
            melodies on guitar.
          </li>
          <li>
            <strong>Liam</strong>: The technical wizard on bass, bringing intricate lines and
            thunderous lows.
          </li>
          <li>
            <strong>Nikki</strong>: The rhythmic backbone, unleashing unrelenting brutality on drums,
            driving the chaos forward.
          </li>
        </ul>

        {/* Tagline */}
        <h3
          className="mt-4"
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#ffdd00",
          }}
        >
          "We are the sound of reckoning, the echoes of damnation, and the call for redemption."
        </h3>
      </div>
    </div>
  );
};

export default AboutUs;
