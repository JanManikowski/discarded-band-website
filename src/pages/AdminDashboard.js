import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CARDS = [
  {
    path: "/admin/release",
    label: "Release",
    description: "Update the Spotify link shown on the home and releases page.",
    icon: "🎵",
  },
  {
    path: "/admin/about",
    label: "About Us",
    description: "Edit the band bio text and manage band photos.",
    icon: "📝",
  },
  {
    path: "/admin/gallery",
    label: "Gallery",
    description: "Create shows, upload photos and manage the order.",
    icon: "📸",
  },
  {
    path: "/admin/shows",
    label: "Upcoming Shows",
    description: "Add and remove show dates, venues and ticket links.",
    icon: "🎸",
  },
];

const ICON_MAP = {
  "Release":        { svg: "M9 18V5l12-2v13", paths: [] },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <div
      style={{
        backgroundColor: "#0A060D",
        minHeight: "100vh",
        padding: "0",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "0 40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          backgroundColor: "rgba(10,6,13,0.95)",
          backdropFilter: "blur(8px)",
          zIndex: 100,
        }}
      >
        <div>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#666", textTransform: "uppercase" }}>
            Discarded
          </span>
          <span style={{ color: "#444", margin: "0 10px" }}>|</span>
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#b61c1c", letterSpacing: "1px" }}>
            ADMIN
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "13px", color: "#555" }}>{currentUser?.email}</span>
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
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 40px" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "12px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", margin: "0 0 8px" }}>
            Dashboard
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "white", margin: "0 0 8px" }}>
            What do you want to manage?
          </h1>
          <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
            Changes go live on the website immediately after saving.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          {CARDS.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "28px",
                textAlign: "left",
                cursor: "pointer",
                color: "white",
                transition: "border-color 0.15s, background 0.15s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#b61c1c";
                e.currentTarget.style.background = "rgba(182,28,28,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(182,28,28,0.12)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {card.icon}
                </div>
                <span style={{ fontSize: "18px", color: "#444" }}>↗</span>
              </div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "8px" }}>
                {card.label}
              </div>
              <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.5" }}>
                {card.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;