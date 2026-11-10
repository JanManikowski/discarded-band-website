import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  parseSpotifyLink,
  buildSpotifyEmbedUrl,
  buildSpotifyShareUrl,
  DEFAULT_RELEASES,
} from "../utils/spotify";
import AdminStatus, { LOAD_FAILED_MESSAGE } from "./AdminStatus";
import {
  adminInputStyle,
  adminLabelStyle,
  adminPanelStyle,
  adminSaveButtonStyle,
} from "../styles/adminStyles";

// The two players on the site. The latest release keeps the original
// field names so older saved data keeps working.
const SLOTS = [
  {
    key: "latest",
    title: "Latest release",
    hint: "The newest single, EP or album. Always shown.",
    typeField: "spotifyType",
    idField: "spotifyId",
    labelField: "latestLabel",
    defaultLabel: DEFAULT_RELEASES.latestLabel,
    required: true,
  },
  {
    key: "album",
    title: "Current album",
    hint: "Optional. Leave empty to show only the latest release.",
    typeField: "albumType",
    idField: "albumId",
    labelField: "albumLabel",
    defaultLabel: DEFAULT_RELEASES.albumLabel,
    required: false,
  },
];

const emptyForm = { latest: { link: "", label: "" }, album: { link: "", label: "" } };

const ReleaseEditor = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  useEffect(() => {
    const loadCurrent = async () => {
      try {
        const snap = await getDoc(doc(db, "site_content", "releases"));
        if (snap.exists()) {
          const data = snap.data();
          const next = { ...emptyForm };
          SLOTS.forEach((slot) => {
            const type = data[slot.typeField];
            const id = data[slot.idField];
            next[slot.key] = {
              link: type && id ? buildSpotifyShareUrl({ type, id }) : "",
              label: data[slot.labelField] || "",
            };
          });
          setForm(next);
        }
      } catch (err) {
        console.error("Failed to load current releases:", err);
        setLoadFailed(true);
        setStatus({ type: "error", message: LOAD_FAILED_MESSAGE });
      } finally {
        setLoading(false);
      }
    };
    loadCurrent();
  }, []);

  const updateSlot = (key, field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (loadFailed) return;
    setStatus(null);

    const payload = {};
    for (const slot of SLOTS) {
      const { link, label } = form[slot.key];

      if (!link.trim()) {
        if (slot.required) {
          setStatus({ type: "error", message: `Add a Spotify link for the ${slot.title.toLowerCase()}.` });
          return;
        }
        payload[slot.typeField] = null;
        payload[slot.idField] = null;
      } else {
        const parsed = parseSpotifyLink(link);
        if (!parsed) {
          setStatus({
            type: "error",
            message: `Couldn't read the ${slot.title.toLowerCase()} link. Paste the full Spotify share link (e.g. https://open.spotify.com/album/...).`,
          });
          return;
        }
        payload[slot.typeField] = parsed.type;
        payload[slot.idField] = parsed.id;
      }
      payload[slot.labelField] = label.trim() || null;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, "site_content", "releases"),
        { ...payload, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setStatus({ type: "success", message: "Saved! The site will show this on next page load." });
    } catch (err) {
      console.error("Failed to save releases:", err);
      setStatus({ type: "error", message: "Save failed. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 rounded-3 shadow-lg w-100" style={{ ...adminPanelStyle, maxWidth: "600px" }}>
      <h2 className="mb-1" style={{ fontSize: "1.3rem", color: "#c4a96a" }}>
        Spotify players
      </h2>
      <p style={{ color: "#999", fontSize: "0.9rem" }}>
        Shown on the Home and Releases pages. In Spotify, open the release, click Share → Copy link,
        and paste it here.
      </p>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading current releases...</p>
      ) : (
        <form onSubmit={handleSave}>
          {SLOTS.map((slot) => {
            const { link, label } = form[slot.key];
            const parsed = parseSpotifyLink(link);
            return (
              <fieldset
                key={slot.key}
                className="mb-4 p-3"
                style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px" }}
              >
                <legend
                  style={{ float: "none", width: "auto", padding: "0 6px", fontSize: "1rem", color: "white", margin: 0 }}
                >
                  {slot.title}
                </legend>
                <small style={{ color: "#999", display: "block", marginBottom: "10px" }}>{slot.hint}</small>

                <label htmlFor={`spotify-${slot.key}`} style={adminLabelStyle}>
                  Spotify link (album, track or playlist)
                </label>
                <input
                  id={`spotify-${slot.key}`}
                  type="text"
                  value={link}
                  onChange={updateSlot(slot.key, "link")}
                  placeholder="https://open.spotify.com/album/..."
                  style={adminInputStyle}
                />
                {link.trim() && !parsed && (
                  <small style={{ color: "#ff9b9b" }}>This doesn't look like a Spotify link yet.</small>
                )}

                <label htmlFor={`spotify-${slot.key}-label`} style={{ ...adminLabelStyle, marginTop: "12px" }}>
                  Title above the player (optional)
                </label>
                <input
                  id={`spotify-${slot.key}-label`}
                  type="text"
                  value={label}
                  onChange={updateSlot(slot.key, "label")}
                  placeholder={slot.defaultLabel}
                  style={adminInputStyle}
                />

                {parsed && (
                  <div className="mt-3">
                    <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: "6px" }}>Preview:</p>
                    <iframe
                      src={buildSpotifyEmbedUrl(parsed)}
                      title={`${slot.title} preview`}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      style={{ border: 0, borderRadius: "10px", width: "100%", height: "152px" }}
                    />
                  </div>
                )}
              </fieldset>
            );
          })}

          <AdminStatus status={status} />

          <button
            type="submit"
            disabled={saving || loadFailed}
            className="w-100"
            style={adminSaveButtonStyle(saving || loadFailed)}
          >
            {saving ? "Saving..." : "Save Spotify players"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReleaseEditor;
