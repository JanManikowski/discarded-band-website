import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import ReleaseEditor from "../components/ReleaseEditor";

const AdminRelease = () => (
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
      <ReleaseEditor />
    </div>
  </>
);

export default AdminRelease;