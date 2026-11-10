import React from "react";
import "../styles/global.css";
import "../styles/responsive.css";
import { commonTitleStyle } from "../styles/constants";
import useSiteContent from "../hooks/useSiteContent";
import { DEFAULT_ABOUT_US } from "../content/aboutUsDefaults";

/** Presentational part of the About Us page; everything comes from `data`. */
export const AboutUsView = ({ data }) => {
  const members = (data.members || []).filter((m) => m && (m.name || "").trim());
  const photos = data.bandPhotos || [];

  return (
    <div className="about-us-page container-fluid text-white">
      {/* ABOUT US Section */}
      <div className="text-section container text-center py-5">
        <h1 style={commonTitleStyle}>{data.title || DEFAULT_ABOUT_US.title}</h1>
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
            textTransform: "uppercase",
          }}
        >
          {data.bandTitle || DEFAULT_ABOUT_US.bandTitle}
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

        {members.length > 0 && (
          <div
            className="mx-auto"
            style={{
              maxWidth: "800px",
              fontSize: "1.2rem",
              lineHeight: "1.8",
              color: "#e0e0e0",
              paddingBottom: "1rem",
            }}
          >
            <br></br>
            {members.map((member, i) => (
              <p key={`${member.role}-${member.name}-${i}`}>
                {member.role ? `${member.role}: ${member.name}` : member.name}
              </p>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <div className="band-photos row justify-content-center mt-4">
            {photos.map((photo) => (
              <div key={photo.storagePath} className="col-12 col-md-5 mb-3">
                <img
                  src={photo.url}
                  alt={photo.alt || "The band"}
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

const AboutUs = () => {
  // Falls back to the original copy if Firestore is unreachable or the
  // admin hasn't saved anything yet - the page never ends up blank.
  const { data } = useSiteContent("aboutUs", DEFAULT_ABOUT_US);
  return <AboutUsView data={data} />;
};

export default AboutUs;
