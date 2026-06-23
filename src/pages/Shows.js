import React from "react";
import { commonTitleStyle } from "../styles/constants";
import useUpcomingShows from "../hooks/useUpcomingShows";
import ShowCard from "../components/ShowCard";

const Shows = () => {
  const { shows, loading } = useUpcomingShows();

  return (
    <div
      className="container-fluid text-white"
      style={{
        backgroundColor: "#0A060D",
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "60px",
      }}
    >
      <div className="container text-center" style={{ maxWidth: "800px" }}>
        <h1 style={commonTitleStyle}>UPCOMING SHOWS</h1>

        {loading ? (
          <p style={{ color: "#e0e0e0" }}>Loading...</p>
        ) : shows.length === 0 ? (
          <p style={{ color: "#999" }}>No upcoming shows announced yet. Check back soon!</p>
        ) : (
          <div className="d-flex flex-column gap-3 text-start mt-4">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shows;