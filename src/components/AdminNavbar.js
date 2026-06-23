import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const SECTIONS = [
  { id: "release-section", label: "Release" },
  { id: "about-section", label: "About Us" },
  { id: "band-photos-section", label: "Band Photos" },
  { id: "show-galleries-section", label: "Show Galleries" },
  { id: "upcoming-shows-section", label: "Upcoming Shows" },
];

const AdminNavbar = () => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="fixed-top"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        borderBottom: "1px solid #333",
        zIndex: 1000,
      }}
    >
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ padding: "12px 20px", maxWidth: "1100px", margin: "0 auto" }}
      >
        <span style={{ color: "#b61c1c", fontWeight: "bold", letterSpacing: "1px" }}>
          ADMIN
        </span>

        {/* Desktop links */}
        <div className="d-none d-lg-flex align-items-center" style={{ gap: "18px" }}>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              style={{
                background: "none",
                border: "none",
                color: "#e0e0e0",
                fontSize: "0.9rem",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="d-none d-lg-flex align-items-center" style={{ gap: "14px" }}>
          <span style={{ color: "#999", fontSize: "0.85rem" }}>{currentUser?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              color: "#ff4d4d",
              padding: "6px 14px",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Log Out
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="d-lg-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle admin menu"
          style={{
            background: "none",
            border: "1px solid white",
            color: "white",
            padding: "6px 10px",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="d-lg-none d-flex flex-column"
          style={{ padding: "10px 20px 16px", borderTop: "1px solid #333", gap: "12px" }}
        >
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              style={{
                background: "none",
                border: "none",
                color: "#e0e0e0",
                fontSize: "0.95rem",
                textAlign: "left",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              {section.label}
            </button>
          ))}
          <div style={{ borderTop: "1px solid #333", paddingTop: "12px" }}>
            <span style={{ color: "#999", fontSize: "0.85rem", display: "block", marginBottom: "10px" }}>
              {currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="w-100"
              style={{
                backgroundColor: "transparent",
                border: "1px solid white",
                color: "#ff4d4d",
                padding: "10px",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;