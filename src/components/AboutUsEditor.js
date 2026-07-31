import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import RichTextEditor from "./RichTextEditor";

const DEFAULT_INTRO = `
  <p>Within the short time our species has walked this planet, through cooperation, we have built civilizations with the power to shatter mountains and conquer the sky.</p>
  <p>Wise humans, we named ourselves. But our empire is crumbling, and wisdom seems scarcer every single day.</p>
  <p>Despair, disillusionment, and dystopian atmospheres abound. How to lend meaning to a single human life has become increasingly meaningless as the experience of overwhelm through ever-increasing complexity is commonplace. This is our backdrop, this is our stage.</p>
  <p>Humanity feels <span style="color: #c4a96a; font-weight: bold;">DISCARDED</span>.</p>
`;

const DEFAULT_BAND_BIO = `
  <p>Not intending to be constrained by any genre, our main inspiration comes from genres like thall and blackened deathcore. As our debut EP releases, we've learned much - now it's time to incorporate those lessons. The more time we spend together, the more we refine our sound and shape the direction we want this band to take.</p>
  <p>This project holds deep meaning for each of us, and we're determined to create something unforgettable.</p>
`;

const AboutUsEditor = () => {
  const [introHtml, setIntroHtml] = useState(DEFAULT_INTRO);
  const [bandBioHtml, setBandBioHtml] = useState(DEFAULT_BAND_BIO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadCurrent = async () => {
      try {
        const ref = doc(db, "site_content", "aboutUs");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.introHtml) setIntroHtml(data.introHtml);
          if (data.bandBioHtml) setBandBioHtml(data.bandBioHtml);
        }
      } catch (err) {
        console.error("Failed to load About Us content:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCurrent();
  }, []);

  const handleSave = async () => {
    setStatus(null);
    setSaving(true);
    try {
      const ref = doc(db, "site_content", "aboutUs");
      await setDoc(
        ref,
        { introHtml, bandBioHtml, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setStatus({ type: "success", message: "Saved! Refresh the About Us page to see it live." });
    } catch (err) {
      console.error("Failed to save About Us content:", err);
      setStatus({ type: "error", message: "Save failed. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="p-4 rounded-3 shadow-lg w-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", maxWidth: "700px" }}
    >
      <h2 className="mb-3" style={{ fontSize: "1.3rem", color: "#c4a96a" }}>
        About Us Page
      </h2>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading current content...</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="form-label d-block mb-2">
              "ABOUT US" intro text
            </label>
            <RichTextEditor value={introHtml} onChange={setIntroHtml} />
          </div>

          <div className="mb-4">
            <label className="form-label d-block mb-2">
              "THE BAND" bio text
            </label>
            <RichTextEditor value={bandBioHtml} onChange={setBandBioHtml} />
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
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-100"
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              fontWeight: "bold",
              color: "#c4a96a",
              padding: "12px 20px",
              textTransform: "uppercase",
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save About Us Content"}
          </button>
        </>
      )}
    </div>
  );
};

export default AboutUsEditor;