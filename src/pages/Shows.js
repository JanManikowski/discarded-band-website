import React, { useState } from "react";
import { commonTitleStyle } from "../styles/constants";
import useShows from "../hooks/useShows";
import ShowCard from "../components/ShowCard";
import { pickDefaultShowsTab } from "../utils/showDates";

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

/**
 * Presentational part of the Shows page, separate from the data loading so
 * it can be rendered with any list of shows.
 */
export const ShowsView = ({ upcoming, past, loading }) => {
  // null = let the page decide (upcoming if anything is planned, else past).
  const [chosenTab, setChosenTab] = useState(null);

  const tab = chosenTab ?? pickDefaultShowsTab(upcoming.length, past.length);
  const list = tab === "past" ? past : upcoming;
  const autoSwitchedToPast = chosenTab === null && tab === "past";

  return (
    <div
      className="container-fluid page-shell text-white"
      style={{
        backgroundColor: "#0A060D",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      <div className="container text-center" style={{ maxWidth: "800px" }}>
        <h1 style={commonTitleStyle}>SHOWS</h1>

        {loading ? (
          <p style={{ color: "#e0e0e0" }}>Loading...</p>
        ) : (
          <>
            <div className="shows-toggle" role="group" aria-label="Choose which shows to see">
              {TABS.map((t) => {
                const count = t.key === "past" ? past.length : upcoming.length;
                return (
                  <button
                    key={t.key}
                    type="button"
                    className={`shows-toggle-btn${tab === t.key ? " active" : ""}`}
                    aria-pressed={tab === t.key}
                    onClick={() => setChosenTab(t.key)}
                  >
                    {t.label}
                    <span className="shows-toggle-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {autoSwitchedToPast && (
              <p className="shows-note">No new shows announced yet. Here's where we've played.</p>
            )}

            {list.length === 0 ? (
              <p className="shows-empty">
                {tab === "past"
                  ? "No played shows to show yet."
                  : "No upcoming shows announced yet. Check back soon!"}
              </p>
            ) : (
              <div className="d-flex flex-column gap-3 text-start mt-4">
                {list.map((show) => (
                  <ShowCard key={show.id} show={show} past={tab === "past"} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Shows = () => {
  const upcoming = useShows({ when: "upcoming" });
  const past = useShows({ when: "past" });

  return (
    <ShowsView
      upcoming={upcoming.shows}
      past={past.shows}
      // Wait for both lists so the page doesn't flip tabs after loading.
      loading={upcoming.loading || past.loading}
    />
  );
};

export default Shows;
