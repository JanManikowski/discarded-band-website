import React from "react";
import "../styles/global.css";
import "../styles/responsive.css";
import background from "../assets/background-low.png"; // Add your background image

const AboutUs = () => {
  return (
    <div
      className="about-us-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "50px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 className="title" style={{ color: "#ffdd00" }}>About Us</h1>
      <p className="text">
        Welcome to <span className="highlight">Discarded</span>, where music meets passion. Our journey is driven by a deep love for creativity, collaboration, and a desire to connect with people through our sound.
      </p>
      <p className="text">
        We believe in crafting music that not only entertains but also inspires. Our band thrives on the energy of live performances and the bond we share with our fans.
      </p>
    </div>
  );
};

export default AboutUs;
