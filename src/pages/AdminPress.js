import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import PressEditor from "../components/PressEditor";

const AdminPress = () => (
  <>
    <AdminNavbar />
    <div
      className="d-flex flex-column align-items-center"
      style={{
        backgroundColor: "#0A060D",
        color: "white",
        minHeight: "100vh",
        padding: "48px 20px 60px",
      }}
    >
      <PressEditor />
    </div>
  </>
);

export default AdminPress;
