import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import RichTextEditor from "./RichTextEditor";
import AdminStatus, { LOAD_FAILED_MESSAGE } from "./AdminStatus";
import ListItemControls from "./ListItemControls";
import SingleImageUpload from "./SingleImageUpload";
import PdfUpload from "./PdfUpload";
import { DEFAULT_PRESS, hasText } from "../content/pressDefaults";
import { DEFAULT_ABOUT_US } from "../content/aboutUsDefaults";
import { parseYouTubeId, buildYouTubeEmbedUrl } from "../utils/youtube";
import { moveItem, makeId } from "../utils/list";
import { deleteStorageFiles } from "../utils/storageUpload";
import { normalizeUrl } from "../utils/socialPlatforms";
import {
  adminCardStyle,
  adminHintStyle,
  adminInputStyle,
  adminLabelStyle,
  adminPanelStyle,
  adminSaveButtonStyle,
  adminSmallButtonStyle,
} from "../styles/adminStyles";

const emptyQuote = (source = "") => ({ id: makeId(), text: "", source, url: "" });

// Before anything is saved, start with the two outlets the band mentioned,
// so they only have to paste the quotes in.
const STARTER_QUOTES = () => [emptyQuote("The Metalverse"), emptyQuote("Metal Noise")];

const sectionTitleStyle = { fontSize: "1rem", color: "white", margin: "0 0 10px" };

const PressEditor = () => {
  const [genreLine, setGenreLine] = useState(DEFAULT_PRESS.genreLine);
  const [useAboutIntro, setUseAboutIntro] = useState(true);
  const [manifestoHtml, setManifestoHtml] = useState("");
  const [aboutIntroHtml, setAboutIntroHtml] = useState(DEFAULT_ABOUT_US.introHtml);
  const [lineupPhoto, setLineupPhoto] = useState(null);
  const [quotes, setQuotes] = useState(STARTER_QUOTES);
  const [videoTitle, setVideoTitle] = useState(DEFAULT_PRESS.videoTitle);
  const [videoUrl, setVideoUrl] = useState("");
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [status, setStatus] = useState(null);

  // Replaced/removed files, deleted from Storage only after a successful save.
  const pendingDeletes = useRef([]);
  const lineupRef = useRef(null);
  const riderRef = useRef(null);
  lineupRef.current = lineupPhoto;
  riderRef.current = rider;

  useEffect(() => {
    const load = async () => {
      try {
        const [pressSnap, aboutSnap] = await Promise.all([
          getDoc(doc(db, "site_content", "press")),
          getDoc(doc(db, "site_content", "aboutUs")),
        ]);
        if (aboutSnap.exists() && aboutSnap.data().introHtml) {
          setAboutIntroHtml(aboutSnap.data().introHtml);
        }
        if (pressSnap.exists()) {
          const data = pressSnap.data();
          if (typeof data.genreLine === "string") setGenreLine(data.genreLine);
          if (hasText(data.manifestoHtml)) {
            setUseAboutIntro(false);
            setManifestoHtml(data.manifestoHtml);
          }
          setLineupPhoto(data.lineupPhoto || null);
          if (Array.isArray(data.quotes)) {
            setQuotes(
              data.quotes.map((q) => ({
                id: q.id || makeId(),
                text: q.text || "",
                source: q.source || "",
                url: q.url || "",
              }))
            );
          }
          if (typeof data.videoTitle === "string") setVideoTitle(data.videoTitle);
          if (typeof data.videoUrl === "string") setVideoUrl(data.videoUrl);
          setRider(data.rider || null);
        }
      } catch (err) {
        console.error("Failed to load press kit:", err);
        setLoadFailed(true);
        setStatus({ type: "error", message: LOAD_FAILED_MESSAGE });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Uploads finish asynchronously, so compare against the latest value via refs.
  const replaceFile = (ref, setter) => (next) => {
    const old = ref.current;
    if (old?.storagePath && old.storagePath !== next?.storagePath) {
      pendingDeletes.current.push(old.storagePath);
    }
    setter(next);
  };

  const toggleAboutIntro = (checked) => {
    setUseAboutIntro(checked);
    // Start the custom manifesto from the About Us text, so it's easy to tweak.
    if (!checked && !hasText(manifestoHtml)) setManifestoHtml(aboutIntroHtml);
  };

  const updateQuote = (index, field) => (e) => {
    const value = e.target.value;
    setQuotes((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  };

  const videoId = parseYouTubeId(videoUrl);

  const handleSave = async () => {
    if (loadFailed) return;
    setStatus(null);
    if (videoUrl.trim() && !videoId) {
      setStatus({ type: "error", message: "The video link doesn't look like a YouTube video. Paste the link from YouTube's Share button." });
      return;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, "site_content", "press"),
        {
          genreLine: genreLine.trim(),
          manifestoHtml: useAboutIntro ? "" : manifestoHtml,
          lineupPhoto: lineupPhoto || null,
          // Quotes without text are left out (e.g. the starter rows).
          quotes: quotes
            .filter((q) => q.text.trim())
            .map((q) => ({
              id: q.id,
              text: q.text.trim(),
              source: q.source.trim(),
              url: q.url.trim() ? normalizeUrl(q.url) : "",
            })),
          videoTitle: videoTitle.trim(),
          videoUrl: videoUrl.trim(),
          rider: rider || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      const toDelete = pendingDeletes.current;
      pendingDeletes.current = [];
      await deleteStorageFiles(toDelete);
      setStatus({ type: "success", message: "Saved! The press kit is updated." });
    } catch (err) {
      console.error("Failed to save press kit:", err);
      setStatus({ type: "error", message: "Save failed. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 rounded-3 shadow-lg w-100" style={{ ...adminPanelStyle, maxWidth: "760px" }}>
      <h2 className="mb-1" style={{ fontSize: "1.3rem", color: "#c4a96a" }}>
        Press Kit (EPK)
      </h2>
      <p style={{ color: "#999", fontSize: "0.9rem" }}>
        One page for bookers and press at <strong>discardedband.com/#/press</strong>. Empty sections
        are hidden on the site.
      </p>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading press kit...</p>
      ) : (
        <div className="d-flex flex-column gap-4">
          {/* Genre line */}
          <div>
            <label htmlFor="press-genre" style={adminLabelStyle}>Genre line</label>
            <input
              id="press-genre"
              type="text"
              value={genreLine}
              onChange={(e) => setGenreLine(e.target.value)}
              placeholder={DEFAULT_PRESS.genreLine}
              maxLength={120}
              style={adminInputStyle}
            />
            <small style={adminHintStyle}>
              One line under the logo that says what you sound like (and where you're from, if you like).
            </small>
          </div>

          {/* Manifesto */}
          <div>
            <h3 style={sectionTitleStyle}>Manifesto</h3>
            <label className="d-flex align-items-center gap-2" style={{ color: "#e0e0e0", fontSize: "0.9rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={useAboutIntro}
                onChange={(e) => toggleAboutIntro(e.target.checked)}
              />
              Use the About Us intro text (stays in sync when you edit About Us)
            </label>
            {!useAboutIntro && (
              <div className="mt-2">
                <RichTextEditor value={manifestoHtml} onChange={setManifestoHtml} />
              </div>
            )}
          </div>

          {/* Lineup photo */}
          <div>
            <h3 style={sectionTitleStyle}>Lineup photo</h3>
            <SingleImageUpload
              folder="press"
              label="Photo of the whole band"
              hint="Landscape works best. Saved at up to 2400 px wide so press can download and use it."
              value={lineupPhoto}
              onChange={replaceFile(lineupRef, setLineupPhoto)}
              maxWidth={2400}
              quality={0.85}
              previewAspect="3 / 2"
            />
          </div>

          {/* Quotes */}
          <div>
            <h3 style={sectionTitleStyle}>Press quotes</h3>
            <small style={{ ...adminHintStyle, marginTop: 0, marginBottom: "10px" }}>
              2–3 short quotes work best. Quotes without text aren't shown.
            </small>
            <div className="d-flex flex-column gap-2">
              {quotes.map((q, index) => (
                <div key={q.id} style={adminCardStyle}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: "#999", fontSize: "0.8rem" }}>Quote {index + 1}</span>
                    <ListItemControls
                      index={index}
                      count={quotes.length}
                      itemName="quote"
                      onMove={(from, to) => setQuotes((prev) => moveItem(prev, from, to))}
                      onRemove={(i) => setQuotes((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                  </div>
                  <textarea
                    value={q.text}
                    onChange={updateQuote(index, "text")}
                    placeholder="The quote, without quotation marks"
                    aria-label={`Quote ${index + 1} text`}
                    rows={3}
                    maxLength={400}
                    style={{ ...adminInputStyle, resize: "vertical" }}
                  />
                  <div className="row g-2 mt-1">
                    <div className="col-12 col-md-5">
                      <input
                        type="text"
                        value={q.source}
                        onChange={updateQuote(index, "source")}
                        placeholder="Source, e.g. Metal Noise"
                        aria-label={`Quote ${index + 1} source`}
                        style={adminInputStyle}
                      />
                    </div>
                    <div className="col-12 col-md-7">
                      <input
                        type="url"
                        value={q.url}
                        onChange={updateQuote(index, "url")}
                        placeholder="Link to the review (optional)"
                        aria-label={`Quote ${index + 1} link`}
                        style={adminInputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-2"
              onClick={() => setQuotes((prev) => [...prev, emptyQuote()])}
              style={adminSmallButtonStyle("gold")}
            >
              + Add quote
            </button>
          </div>

          {/* Video */}
          <div>
            <h3 style={sectionTitleStyle}>Video</h3>
            <div className="row g-2">
              <div className="col-12 col-md-4">
                <label htmlFor="press-video-title" style={adminLabelStyle}>Title</label>
                <input
                  id="press-video-title"
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Ashes"
                  style={adminInputStyle}
                />
              </div>
              <div className="col-12 col-md-8">
                <label htmlFor="press-video-url" style={adminLabelStyle}>YouTube link</label>
                <input
                  id="press-video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={adminInputStyle}
                />
              </div>
            </div>
            {videoUrl.trim() && !videoId && (
              <small style={{ color: "#ff9b9b" }}>This doesn't look like a YouTube video link yet.</small>
            )}
            {videoId && (
              <div className="mt-2" style={{ maxWidth: "360px", aspectRatio: "16 / 9" }}>
                <iframe
                  src={buildYouTubeEmbedUrl(videoId)}
                  title="Video preview"
                  style={{ width: "100%", height: "100%", border: 0, borderRadius: "6px" }}
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Tech rider */}
          <div>
            <h3 style={sectionTitleStyle}>Tech rider</h3>
            <PdfUpload
              folder="press"
              label="Tech rider (PDF)"
              hint="Stage plot, channel list and backline. Visitors can download it from the press kit."
              value={rider}
              onChange={replaceFile(riderRef, setRider)}
            />
          </div>

          <div>
            <AdminStatus status={status} />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loadFailed}
              className="w-100"
              style={adminSaveButtonStyle(saving || loadFailed)}
            >
              {saving ? "Saving..." : "Save Press Kit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PressEditor;
