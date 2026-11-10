import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import AdminStatus, { LOAD_FAILED_MESSAGE } from "./AdminStatus";
import { DEFAULT_MERCH_SETTINGS } from "../hooks/useMerch";
import { sanitizeMerchItem, toDate, daysBetween } from "../utils/merch";
import { BANDCAMP_MERCH_URL, MERCH_SYNC_WORKFLOW_URL } from "../config/site";
import {
  adminCardStyle,
  adminHintStyle,
  adminInputStyle,
  adminLabelStyle,
  adminPanelStyle,
  adminSaveButtonStyle,
} from "../styles/adminStyles";

// The daily sync should never be this far behind; if it is, something's off.
const STALE_AFTER_DAYS = 3;

const formatDate = (date) =>
  date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const noticeStyle = (color) => ({
  border: `1px solid ${color}`,
  backgroundColor: "rgba(255,255,255,0.03)",
  borderRadius: "6px",
  padding: "10px 12px",
  fontSize: "0.9rem",
  color: "#e0e0e0",
});

/**
 * Merch comes from Bandcamp (synced daily by GitHub Actions). Here the band
 * can see when it last synced, choose which items show on the website and
 * change the intro text. Products, prices and stock are edited on Bandcamp.
 */
const MerchEditor = () => {
  const [sync, setSync] = useState(null); // site_content/merch
  const [intro, setIntro] = useState(DEFAULT_MERCH_SETTINGS.intro);
  const [hidden, setHidden] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [merchSnap, settingsSnap] = await Promise.all([
          getDoc(doc(db, "site_content", "merch")),
          getDoc(doc(db, "site_content", "merchSettings")),
        ]);
        setSync(merchSnap.exists() ? merchSnap.data() : null);
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          if (typeof data.intro === "string") setIntro(data.intro);
          if (Array.isArray(data.hidden)) setHidden(data.hidden.map(String));
        }
      } catch (err) {
        console.error("Failed to load merch:", err);
        setLoadFailed(true);
        setStatus({ type: "error", message: LOAD_FAILED_MESSAGE });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleHidden = (id) => {
    setHidden((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    if (loadFailed) return;
    setStatus(null);
    setSaving(true);
    try {
      await setDoc(
        doc(db, "site_content", "merchSettings"),
        { intro: intro.trim(), hidden, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setStatus({ type: "success", message: "Saved! The Merch page is updated." });
    } catch (err) {
      console.error("Failed to save merch settings:", err);
      setStatus({ type: "error", message: "Save failed. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  };

  const items = (sync?.items || []).map(sanitizeMerchItem).filter(Boolean);
  const syncedAt = toDate(sync?.syncedAt);
  const lastCheckAt = toDate(sync?.lastCheckAt);
  const daysSinceSync = syncedAt ? daysBetween(syncedAt) : null;

  return (
    <div className="p-4 rounded-3 shadow-lg w-100" style={{ ...adminPanelStyle, maxWidth: "760px" }}>
      <h2 className="mb-1" style={{ fontSize: "1.3rem", color: "#c4a96a" }}>
        Merch (from Bandcamp)
      </h2>
      <p style={{ color: "#999", fontSize: "0.9rem" }}>
        Products, prices, sizes and stock come from your{" "}
        <a href={BANDCAMP_MERCH_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#c4a96a" }}>
          Bandcamp merch page
        </a>{" "}
        and are copied to the website once a day. Change them on Bandcamp; here you choose what shows on the site.
      </p>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading merch...</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {/* Sync status */}
          {!loadFailed && !sync && (
            <div style={noticeStyle("#c4a96a")}>
              Not synced yet. Once the <code>FIREBASE_SERVICE_ACCOUNT</code> secret is set on GitHub,{" "}
              <a href={MERCH_SYNC_WORKFLOW_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#c4a96a" }}>
                run the sync once
              </a>{" "}
              and the items appear here.
            </div>
          )}
          {sync && (
            <div style={noticeStyle(sync.lastError ? "#b61c1c" : daysSinceSync > STALE_AFTER_DAYS ? "#d9a33b" : "#28a745")}>
              {syncedAt ? (
                <>
                  Last synced <strong>{formatDate(syncedAt)}</strong>
                  {daysSinceSync > 0 ? ` (${daysSinceSync} day${daysSinceSync === 1 ? "" : "s"} ago)` : " (today)"}, {items.length}{" "}
                  item{items.length === 1 ? "" : "s"}.
                </>
              ) : (
                <>No successful sync yet.</>
              )}
              {sync.lastError && (
                <div style={{ color: "#ff9b9b", marginTop: "6px" }}>
                  Last check{lastCheckAt ? ` (${formatDate(lastCheckAt)})` : ""} failed: {sync.lastError} The website keeps
                  showing the list above.
                </div>
              )}
              {!sync.lastError && daysSinceSync > STALE_AFTER_DAYS && (
                <div style={{ color: "#f0c674", marginTop: "6px" }}>
                  The daily sync hasn't run for a while. GitHub pauses scheduled jobs after 60 days without changes
                  to the repository; you can switch it back on in the Actions tab.
                </div>
              )}
              <div style={{ marginTop: "6px" }}>
                <a href={MERCH_SYNC_WORKFLOW_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#c4a96a" }}>
                  Sync now on GitHub
                </a>{" "}
                <span style={{ color: "#999" }}>(Run workflow)</span>
              </div>
            </div>
          )}

          {/* Intro text */}
          <div>
            <label htmlFor="merch-intro" style={adminLabelStyle}>Text under the heading (optional)</label>
            <input
              id="merch-intro"
              type="text"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder={DEFAULT_MERCH_SETTINGS.intro}
              maxLength={200}
              style={adminInputStyle}
            />
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div>
              <span style={adminLabelStyle}>Show on the website</span>
              <small style={{ ...adminHintStyle, marginTop: 0, marginBottom: "8px" }}>
                Untick anything you don't want on the site. Sold-out items are shown last.
              </small>
              <div className="d-flex flex-column gap-2">
                {items.map((item) => {
                  const shown = !hidden.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className="d-flex align-items-center gap-3"
                      style={{ ...adminCardStyle, cursor: "pointer", opacity: shown ? 1 : 0.5 }}
                    >
                      <input type="checkbox" checked={shown} onChange={() => toggleHidden(item.id)} />
                      {item.thumbUrl ? (
                        <img
                          src={item.thumbUrl}
                          alt=""
                          style={{ width: "56px", height: "42px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                        />
                      ) : null}
                      <span style={{ color: "#e0e0e0", fontSize: "0.9rem", minWidth: 0 }}>
                        <strong style={{ color: "white" }}>{item.title}</strong>
                        <br />
                        <span style={{ color: item.soldOut ? "#999" : "#c4a96a" }}>
                          {item.soldOut ? "Sold out" : item.priceText}
                        </span>
                        {item.type && <span style={{ color: "#999" }}> · {item.type}</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <AdminStatus status={status} />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loadFailed}
              className="w-100"
              style={adminSaveButtonStyle(saving || loadFailed)}
            >
              {saving ? "Saving..." : "Save Merch Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchEditor;
