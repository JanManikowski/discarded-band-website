import React from "react";

// Compact, reusable display for one show: date block on the left,
// venue/location in the middle, tickets link (or "Played") on the right.
const ShowCard = ({ show, past = false }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-between flex-wrap"
      style={{
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "16px 20px",
        backgroundColor: "rgba(255,255,255,0.03)",
        gap: "16px",
      }}
    >
      <div className="d-flex align-items-center" style={{ gap: "20px" }}>
        {/* Date block */}
        <div
          className="text-center"
          style={{
            minWidth: "70px",
            borderRight: "1px solid #444",
            paddingRight: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#c4a96a",
              lineHeight: 1,
            }}
          >
            {show.day}
          </div>
          <div style={{ fontSize: "0.95rem", color: "#e0e0e0", letterSpacing: "1px" }}>
            {show.month}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#999" }}>{show.year}</div>
        </div>

        {/* Location / venue */}
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "white" }}>
            {show.venue}
          </div>
          <div style={{ fontSize: "0.95rem", color: "#999" }}>
            {show.city}, {show.country}
          </div>
        </div>
      </div>

      {/* Tickets (or a "Played" tag once the date has passed) */}
      {past ? (
        <span className="show-card-played">Played</span>
      ) : show.ticketsUrl ? (
        <a
          href={show.ticketsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="site-btn site-btn-sm"
        >
          Tickets
        </a>
      ) : (
        <span className="show-card-played">Tickets TBA</span>
      )}
    </div>
  );
};

export default ShowCard;