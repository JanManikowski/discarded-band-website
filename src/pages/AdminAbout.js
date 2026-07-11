import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import AboutUsEditor from "../components/AboutUsEditor";
import BandPhotosEditor from "../components/BandPhotosEditor";

const AdminAbout = () => (
  <>
    <AdminNavbar />
    <div
      className="d-flex flex-column align-items-center"
      style={{
        backgroundColor: "#0A060D",
        color: "white",
        minHeight: "100vh",
        padding: "100px 20px 60px",
        gap: "24px",
      }}
    >
      <AboutUsEditor />
      <BandPhotosEditor />
    </div>
  </>
);

export default AdminAbout;