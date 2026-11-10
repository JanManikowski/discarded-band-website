import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";

const PAGE_LABELS = {
  "/admin/release": "Releases",
  "/admin/about": "About Us",
  "/admin/gallery": "Gallery",
  "/admin/shows": "Shows",
  "/admin/socials": "Socials",
  "/admin/press": "Press Kit",
  "/admin/merch": "Merch",
};

// Top bar on every admin editor. Styles live in features.css (.admin-topbar…)
// and are shared with the dashboard.
const AdminNavbar = () => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pageLabel = PAGE_LABELS[location.pathname] ?? "Admin";

  return (
    <nav className="admin-topbar">
      <div className="admin-topbar-brand" style={{ flex: 1 }}>
        {/* Back to dashboard */}
        <button
          type="button"
          className="admin-topbar-back"
          onClick={() => navigate("/admin")}
          title="Back to dashboard"
          aria-label="Back to dashboard"
        >
          ←
        </button>
        <span className="admin-topbar-divider" aria-hidden="true" />
        <span className="admin-topbar-section">{pageLabel}</span>
      </div>

      {/* Desktop right side */}
      <div className="d-none d-lg-flex admin-topbar-actions">
        <button type="button" className="admin-btn" onClick={() => navigate("/")}>
          ← Website
        </button>
        <span className="admin-topbar-email">{currentUser?.email}</span>
        <button type="button" className="admin-btn is-primary" onClick={logout}>
          Log out
        </button>
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        className="d-lg-none admin-btn is-icon"
        onClick={() => setMenuOpen((p) => !p)}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="d-lg-none admin-topbar-menu">
          <button
            type="button"
            className="admin-topbar-menu-link"
            onClick={() => { setMenuOpen(false); navigate("/"); }}
          >
            ← Back to website
          </button>
          <button
            type="button"
            className="admin-topbar-menu-link"
            onClick={() => { setMenuOpen(false); navigate("/admin"); }}
          >
            ← Back to dashboard
          </button>
          <div className="admin-topbar-menu-footer">
            <span className="admin-topbar-email">{currentUser?.email}</span>
            <button type="button" className="admin-btn is-primary" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
