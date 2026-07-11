import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const PAGE_LABELS = {
  "/admin/release": "Release",
  "/admin/about": "About Us",
  "/admin/gallery": "Gallery",
  "/admin/shows": "Upcoming Shows",
};

const AdminNavbar = () => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pageLabel = PAGE_LABELS[location.pathname] ?? "Admin";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(10,6,13,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        height: "64px",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
        {/* Back to dashboard */}
        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "none",
            border: "none",
            color: "#555",
            fontSize: "20px",
            cursor: "pointer",
            padding: "0 4px",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          }}
          title="Back to dashboard"
        >
          ←
        </button>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>
          {pageLabel}
        </span>
      </div>

      {/* Desktop right side */}
      <div className="d-none d-lg-flex" style={{ alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#aaa",
            fontSize: "13px",
            padding: "6px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Website
        </button>
        <span style={{ fontSize: "13px", color: "#555" }}>{currentUser?.email}</span>
        <button
          onClick={logout}
          style={{
            background: "#b61c1c",
            border: "none",
            color: "white",
            fontSize: "13px",
            padding: "6px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Log out
        </button>
      </div>

      {/* Mobile toggle */}
      <button
        className="d-lg-none"
        onClick={() => setMenuOpen((p) => !p)}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="d-lg-none"
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            backgroundColor: "#0A060D",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <button
            onClick={() => { setMenuOpen(false); navigate("/"); }}
            style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px", textAlign: "left", cursor: "pointer", padding: 0 }}
          >
            ← Back to website
          </button>
          <button
            onClick={() => { setMenuOpen(false); navigate("/admin"); }}
            style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px", textAlign: "left", cursor: "pointer", padding: 0 }}
          >
            ← Back to dashboard
          </button>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 10px" }}>{currentUser?.email}</p>
            <button
              onClick={logout}
              style={{ background: "#b61c1c", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", width: "100%" }}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;