import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import RichTextEditor from "./RichTextEditor";
import AdminStatus, { LOAD_FAILED_MESSAGE } from "./AdminStatus";
import ListItemControls from "./ListItemControls";
import { DEFAULT_ABOUT_US } from "../content/aboutUsDefaults";
import { moveItem, makeId } from "../utils/list";
import {
  adminCardStyle,
  adminHintStyle,
  adminInputStyle,
  adminLabelStyle,
  adminPanelStyle,
  adminSaveButtonStyle,
  adminSmallButtonStyle,
} from "../styles/adminStyles";

const withIds = (members) => members.map((m) => ({ key: makeId(), role: m.role || "", name: m.name || "" }));

const AboutUsEditor = () => {
  const [title, setTitle] = useState(DEFAULT_ABOUT_US.title);
  const [introHtml, setIntroHtml] = useState(DEFAULT_ABOUT_US.introHtml);
  const [bandTitle, setBandTitle] = useState(DEFAULT_ABOUT_US.bandTitle);
  const [bandBioHtml, setBandBioHtml] = useState(DEFAULT_ABOUT_US.bandBioHtml);
  const [members, setMembers] = useState(withIds(DEFAULT_ABOUT_US.members));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadCurrent = async () => {
      try {
        const snap = await getDoc(doc(db, "site_content", "aboutUs"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.title) setTitle(data.title);
          if (data.introHtml) setIntroHtml(data.introHtml);
          if (data.bandTitle) setBandTitle(data.bandTitle);
          if (data.bandBioHtml) setBandBioHtml(data.bandBioHtml);
          if (Array.isArray(data.members)) setMembers(withIds(data.members));
        }
      } catch (err) {
        console.error("Failed to load About Us content:", err);
        setLoadFailed(true);
        setStatus({ type: "error", message: LOAD_FAILED_MESSAGE });
      } finally {
        setLoading(false);
      }
    };
    loadCurrent();
  }, []);

  const updateMember = (index, field) => (e) => {
    const value = e.target.value;
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const handleSave = async () => {
    if (loadFailed) return;
    setStatus(null);
    setSaving(true);
    try {
      await setDoc(
        doc(db, "site_content", "aboutUs"),
        {
          title: title.trim() || DEFAULT_ABOUT_US.title,
          introHtml,
          bandTitle: bandTitle.trim() || DEFAULT_ABOUT_US.bandTitle,
          bandBioHtml,
          // Rows without a name are dropped; the role is optional.
          members: members
            .filter((m) => m.name.trim())
            .map((m) => ({ role: m.role.trim(), name: m.name.trim() })),
          updatedAt: serverTimestamp(),
        },
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
    <div className="p-4 rounded-3 shadow-lg w-100" style={{ ...adminPanelStyle, maxWidth: "700px" }}>
      <h2 className="mb-3" style={{ fontSize: "1.3rem", color: "#c4a96a" }}>
        About Us Page
      </h2>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading current content...</p>
      ) : (
        <>
          {/* Section 1: heading + intro */}
          <div className="mb-4">
            <label htmlFor="about-title" style={adminLabelStyle}>
              First heading
            </label>
            <input
              id="about-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={DEFAULT_ABOUT_US.title}
              style={adminInputStyle}
            />
            <small style={adminHintStyle}>Shown in capitals on the site.</small>
          </div>

          <div className="mb-4">
            <span style={adminLabelStyle}>Text under "{title || DEFAULT_ABOUT_US.title}"</span>
            <RichTextEditor value={introHtml} onChange={setIntroHtml} />
          </div>

          {/* Section 2: heading + bio */}
          <div className="mb-4">
            <label htmlFor="about-band-title" style={adminLabelStyle}>
              Second heading
            </label>
            <input
              id="about-band-title"
              type="text"
              value={bandTitle}
              onChange={(e) => setBandTitle(e.target.value)}
              placeholder={DEFAULT_ABOUT_US.bandTitle}
              style={adminInputStyle}
            />
          </div>

          <div className="mb-4">
            <span style={adminLabelStyle}>Text under "{bandTitle || DEFAULT_ABOUT_US.bandTitle}"</span>
            <RichTextEditor value={bandBioHtml} onChange={setBandBioHtml} />
          </div>

          {/* Band members */}
          <div className="mb-4">
            <span style={adminLabelStyle}>Band members</span>
            <small style={{ ...adminHintStyle, marginTop: 0, marginBottom: "8px" }}>
              Shown as "Role: Name". Put several names in one row with "&amp;", e.g. "Liam &amp; Nikki".
            </small>

            <div className="d-flex flex-column gap-2">
              {members.map((member, index) => (
                <div key={member.key} className="d-flex flex-wrap align-items-center gap-2" style={adminCardStyle}>
                  <input
                    type="text"
                    value={member.role}
                    onChange={updateMember(index, "role")}
                    placeholder="Role (e.g. Vocals)"
                    aria-label="Role"
                    style={{ ...adminInputStyle, flex: "1 1 140px", width: "auto" }}
                  />
                  <input
                    type="text"
                    value={member.name}
                    onChange={updateMember(index, "name")}
                    placeholder="Name"
                    aria-label="Name"
                    style={{ ...adminInputStyle, flex: "2 1 200px", width: "auto" }}
                  />
                  <ListItemControls
                    index={index}
                    count={members.length}
                    itemName="member"
                    onMove={(from, to) => setMembers((prev) => moveItem(prev, from, to))}
                    onRemove={(i) => setMembers((prev) => prev.filter((_, idx) => idx !== i))}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-2"
              onClick={() => setMembers((prev) => [...prev, { key: makeId(), role: "", name: "" }])}
              style={adminSmallButtonStyle("gold")}
            >
              + Add member
            </button>
          </div>

          <AdminStatus status={status} />

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loadFailed}
            className="w-100"
            style={adminSaveButtonStyle(saving || loadFailed)}
          >
            {saving ? "Saving..." : "Save About Us Content"}
          </button>
        </>
      )}
    </div>
  );
};

export default AboutUsEditor;
