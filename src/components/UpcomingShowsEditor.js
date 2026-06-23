import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { buildShowDateFields, startOfToday } from "../utils/showDates";

const emptyForm = {
  date: "",
  city: "",
  country: "",
  venue: "",
  ticketsUrl: "",
};

const UpcomingShowsEditor = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [status, setStatus] = useState(null);

  const showsRef = collection(db, "upcomingShows");

  const loadShows = async () => {
    try {
      const snap = await getDocs(query(showsRef, orderBy("eventDate", "asc")));
      setShows(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            eventDate: data.eventDate?.toDate ? data.eventDate.toDate() : data.eventDate,
          };
        })
      );
    } catch (err) {
      console.error("Failed to load shows:", err);
      setStatus({ type: "error", message: "Couldn't load shows." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!form.date || !form.city || !form.country || !form.venue) {
      setStatus({ type: "error", message: "Date, city, country, and venue are required." });
      return;
    }

    setSaving(true);
    try {
      // Parse the YYYY-MM-DD input as a local date (not UTC) so the day
      // shown matches what was picked, regardless of timezone.
      const [year, month, day] = form.date.split("-").map(Number);
      const jsDate = new Date(year, month - 1, day);
      const { day: d, month: m, year: y } = buildShowDateFields(jsDate);

      await addDoc(showsRef, {
        day: d,
        month: m,
        year: y,
        eventDate: Timestamp.fromDate(jsDate),
        city: form.city.trim(),
        country: form.country.trim(),
        venue: form.venue.trim(),
        ticketsUrl: form.ticketsUrl.trim() || null,
        createdAt: serverTimestamp(),
      });

      setForm(emptyForm);
      setStatus({ type: "success", message: "Show added." });
      await loadShows();
    } catch (err) {
      console.error("Failed to add show:", err);
      setStatus({ type: "error", message: "Couldn't add show. Try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (showId) => {
    setDeletingId(showId);
    setStatus(null);
    try {
      await deleteDoc(doc(db, "upcomingShows", showId));
      setShows((prev) => prev.filter((s) => s.id !== showId));
    } catch (err) {
      console.error("Failed to delete show:", err);
      setStatus({ type: "error", message: "Couldn't delete that show. Try again." });
    } finally {
      setDeletingId(null);
    }
  };

  const today = startOfToday();

  return (
    <div
      className="p-4 rounded-3 shadow-lg w-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", maxWidth: "700px" }}
    >
      <h2 className="mb-3" style={{ fontSize: "1.3rem", color: "#b61c1c" }}>
        Upcoming Shows
      </h2>

      {status && (
        <div
          className="mb-3 p-2 text-center rounded-2"
          style={{
            backgroundColor:
              status.type === "success" ? "rgba(40, 167, 69, 0.2)" : "rgba(182, 28, 28, 0.25)",
            border: `1px solid ${status.type === "success" ? "#28a745" : "#b61c1c"}`,
            color: status.type === "success" ? "#9be39b" : "#ff9b9b",
          }}
        >
          {status.message}
        </div>
      )}

      {/* Add show form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2 mb-2">
          <div className="col-6 col-md-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={handleChange("date")}
              style={inputStyle}
              required
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>City</label>
            <input
              type="text"
              value={form.city}
              onChange={handleChange("city")}
              placeholder="Amsterdam"
              style={inputStyle}
              required
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Country</label>
            <input
              type="text"
              value={form.country}
              onChange={handleChange("country")}
              placeholder="Netherlands"
              style={inputStyle}
              required
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label" style={{ fontSize: "0.85rem" }}>Venue</label>
            <input
              type="text"
              value={form.venue}
              onChange={handleChange("venue")}
              placeholder="Melkweg"
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontSize: "0.85rem" }}>Tickets link (optional)</label>
          <input
            type="text"
            value={form.ticketsUrl}
            onChange={handleChange("ticketsUrl")}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            color: "#ff4d4d",
            padding: "8px 18px",
            textTransform: "uppercase",
            fontSize: "0.85rem",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Adding..." : "Add Show"}
        </button>
      </form>

      {/* Existing shows list */}
      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading shows...</p>
      ) : shows.length === 0 ? (
        <p style={{ color: "#999" }}>No shows added yet.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {shows.map((show) => {
            const isPast = show.eventDate < today;
            return (
              <div
                key={show.id}
                className="d-flex justify-content-between align-items-center p-2"
                style={{
                  border: "1px solid #333",
                  borderRadius: "4px",
                  opacity: isPast ? 0.5 : 1,
                }}
              >
                <div style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>
                  <strong>
                    {show.day} {show.month} {show.year}
                  </strong>{" "}
                  — {show.venue}, {show.city}, {show.country}
                  {isPast && <span style={{ color: "#999" }}> (past)</span>}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(show.id)}
                  disabled={deletingId === show.id}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #b61c1c",
                    color: "#ff9b9b",
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    cursor: deletingId === show.id ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                    marginLeft: "10px",
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  backgroundColor: "transparent",
  color: "white",
  border: "1px solid white",
  borderRadius: "0",
  padding: "6px 8px",
  width: "100%",
  fontSize: "0.9rem",
};

export default UpcomingShowsEditor;