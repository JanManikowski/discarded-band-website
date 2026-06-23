import React from "react";

// Compact, reusable display for one upcoming show: date block on the left,
// venue/location in the middle, tickets link on the right.
const ShowCard = ({ show }) => {
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
          <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#b61c1c", lineHeight: 1 }}>
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
            {show.city}, {show.country}
          </div>
          <div style={{ fontSize: "0.95rem", color: "#999" }}>
            {show.venue}
          </div>
        </div>
      </div>

      {/* Tickets */}
      {show.ticketsUrl ? (
        <a
          href={show.ticketsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            color: "#ff4d4d",
            padding: "8px 18px",
            textTransform: "uppercase",
            fontSize: "0.85rem",
            fontWeight: "bold",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Tickets
        </a>
      ) : (
        <span style={{ color: "#666", fontSize: "0.85rem" }}>Tickets TBA</span>
      )}
    </div>
  );
};

export default ShowCard;