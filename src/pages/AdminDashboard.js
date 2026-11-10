import React from "react";
import { useNavigate } from "react-router-dom";
import { LuDisc3, LuUsers, LuImages, LuCalendarDays, LuLink, LuShirt, LuNewspaper } from "react-icons/lu";
import { useAuth } from "../contexts/AuthContext";
import useAdminOverview from "../hooks/useAdminOverview";

const CARDS = [
  {
    key: "releases",
    path: "/admin/release",
    label: "Releases",
    description: "The two Spotify players on Home and Releases.",
    Icon: LuDisc3,
  },
  {
    key: "about",
    path: "/admin/about",
    label: "About Us",
    description: "Headings, text, band members and photos.",
    Icon: LuUsers,
  },
  {
    key: "gallery",
    path: "/admin/gallery",
    label: "Gallery",
    description: "Show galleries, photos and their order.",
    Icon: LuImages,
  },
  {
    key: "shows",
    path: "/admin/shows",
    label: "Shows",
    description: "Dates, venues and ticket links. Past shows move to 'Past' by themselves.",
    Icon: LuCalendarDays,
  },
  {
    key: "socials",
    path: "/admin/socials",
    label: "Socials",
    description: "Links and card images for the Socials page and footer.",
    Icon: LuLink,
  },
  {
    key: "merch",
    path: "/admin/merch",
    label: "Merch",
    description: "Synced from Bandcamp daily. Choose which items show.",
    Icon: LuShirt,
  },
  {
    key: "press",
    path: "/admin/press",
    label: "Press Kit",
    description: "Genre line, manifesto, photo, quotes, video and tech rider.",
    Icon: LuNewspaper,
  },
];

/** Presentational part of the dashboard (kept separate so it can be tested). */
export const AdminDashboardView = ({ overview = {}, loading = false, email, onNavigate, onLogout }) => (
  <div className="admin-page">
    {/* Top bar */}
    <div className="admin-topbar">
      <div className="admin-topbar-brand">
        <span className="admin-topbar-name">Discarded</span>
        <span className="admin-topbar-divider" aria-hidden="true" />
        <span className="admin-topbar-section">Admin</span>
      </div>
      <div className="admin-topbar-actions">
        <button type="button" className="admin-btn" onClick={() => onNavigate("/")}>
          ← Website
        </button>
        <button type="button" className="admin-btn is-primary" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>

    {/* Main content */}
    <div className="admin-main">
      <h1 className="admin-heading">Dashboard</h1>
      <p className="admin-subheading">Changes go live on the website as soon as you save.</p>

      <div className="admin-grid">
        {CARDS.map(({ key, path, label, description, Icon }) => {
          const status = overview[key];
          return (
            <button key={path} type="button" className="admin-card" onClick={() => onNavigate(path)}>
              <Icon className="admin-card-icon" aria-hidden="true" />
              <span className="admin-card-title">{label}</span>
              <span className="admin-card-desc">{description}</span>
              {(status || loading) && (
                <span className={`admin-card-status${status ? ` is-${status.tone}` : ""}`}>
                  {status ? status.text : "…"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {email && <p className="admin-signed-in">Signed in as {email}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { overview, loading } = useAdminOverview();

  return (
    <AdminDashboardView
      overview={overview}
      loading={loading}
      email={currentUser?.email}
      onNavigate={navigate}
      onLogout={logout}
    />
  );
};

export default AdminDashboard;
