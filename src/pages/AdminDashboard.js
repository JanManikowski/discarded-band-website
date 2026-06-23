import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import ReleaseEditor from "../components/ReleaseEditor";
import AboutUsEditor from "../components/AboutUsEditor";
import BandPhotosEditor from "../components/BandPhotosEditor";
import ShowGalleryEditor from "../components/ShowGalleryEditor";
import UpcomingShowsEditor from "../components/UpcomingShowsEditor";

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <div
        className="d-flex flex-column align-items-center"
        style={{
          backgroundColor: "#0A060D",
          color: "white",
          minHeight: "100vh",
          padding: "90px 20px 60px",
        }}
      >
        <div className="d-flex flex-column align-items-center gap-4 w-100" style={{ maxWidth: "700px" }}>
          <div id="release-section" style={{ width: "100%", scrollMarginTop: "80px" }}>
            <ReleaseEditor />
          </div>
          <div id="about-section" style={{ width: "100%", scrollMarginTop: "80px" }}>
            <AboutUsEditor />
          </div>
          <div id="band-photos-section" style={{ width: "100%", scrollMarginTop: "80px" }}>
            <BandPhotosEditor />
          </div>
          <div id="show-galleries-section" style={{ width: "100%", scrollMarginTop: "80px" }}>
            <ShowGalleryEditor />
          </div>
          <div id="upcoming-shows-section" style={{ width: "100%", scrollMarginTop: "80px" }}>
            <UpcomingShowsEditor />
          </div>

          <div
            className="p-4 rounded-3 shadow-lg w-100 text-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
          >
            <p style={{ color: "#e0e0e0", margin: 0 }}>
              That's everything on the list for now!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;