import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import UpcomingShowsEditor from "../components/UpcomingShowsEditor";

const AdminShows = () => (
  <>
    <AdminNavbar />
    <div
      className="d-flex flex-column align-items-center"
      style={{
        backgroundColor: "#0A060D",
        color: "white",
        minHeight: "100vh",
        padding: "100px 20px 60px",
      }}
    >
      <UpcomingShowsEditor />
    </div>
  </>
);

export default AdminShows;