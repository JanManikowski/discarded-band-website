import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { parseSpotifyLink, buildSpotifyEmbedUrl } from "../utils/spotify";

const ReleaseEditor = () => {
  const [linkInput, setLinkInput] = useState("");
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  useEffect(() => {
    const loadCurrent = async () => {
      try {
        const ref = doc(db, "site_content", "releases");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const { spotifyType, spotifyId } = snap.data();
          if (spotifyType && spotifyId) {
            setCurrentEmbedUrl(buildSpotifyEmbedUrl({ type: spotifyType, id: spotifyId }));
            setLinkInput(`https://open.spotify.com/${spotifyType}/${spotifyId}`);
          }
        }
      } catch (err) {
        console.error("Failed to load current release:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCurrent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus(null);

    const parsed = parseSpotifyLink(linkInput);
    if (!parsed) {
      setStatus({
        type: "error",
        message:
          "Couldn't read that link. Paste the full Spotify share link (e.g. https://open.spotify.com/album/...) or just the ID.",
      });
      return;
    }

    setSaving(true);
    try {
      const ref = doc(db, "site_content", "releases");
      await setDoc(
        ref,
        {
          spotifyType: parsed.type,
          spotifyId: parsed.id,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setCurrentEmbedUrl(buildSpotifyEmbedUrl(parsed));
      setStatus({ type: "success", message: "Saved! The site will show this on next page load." });
    } catch (err) {
      console.error("Failed to save release link:", err);
      setStatus({ type: "error", message: "Save failed. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="p-4 rounded-3 shadow-lg w-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", maxWidth: "500px" }}
    >
      <h2 className="mb-3" style={{ fontSize: "1.3rem", color: "#b61c1c" }}>
        Latest Release (Spotify)
      </h2>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading current release...</p>
      ) : (
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label htmlFor="spotifyLink" className="form-label">
              Spotify link (album, track, or playlist)
            </label>
            <input
              type="text"
              id="spotifyLink"
              className="form-control"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://open.spotify.com/album/..."
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid white",
                borderRadius: "0",
              }}
              required
            />
            <small style={{ color: "#999" }}>
              Open the release in Spotify, click Share → Copy link, and paste it here.
            </small>
          </div>

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

          <button
            type="submit"
            disabled={saving}
            className="w-100"
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              fontWeight: "bold",
              color: "#ff4d4d",
              padding: "12px 20px",
              textTransform: "uppercase",
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Release Link"}
          </button>

          {currentEmbedUrl && (
            <div className="mt-4">
              <p style={{ color: "#999", fontSize: "0.9rem" }}>Live preview:</p>
              <iframe
                src={currentEmbedUrl}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                title="Spotify Preview"
                style={{ borderRadius: "10px", width: "100%", height: "152px" }}
              ></iframe>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ReleaseEditor;