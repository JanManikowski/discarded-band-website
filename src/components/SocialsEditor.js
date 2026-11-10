import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import AdminStatus, { LOAD_FAILED_MESSAGE } from "./AdminStatus";
import ListItemControls from "./ListItemControls";
import SingleImageUpload from "./SingleImageUpload";
import { SocialsGrid } from "../pages/Socials";
import {
  DEFAULT_SOCIALS,
  PLATFORMS,
  PLATFORM_KEYS,
  detectPlatform,
  normalizeUrl,
  resolveSocialLink,
} from "../utils/socialPlatforms";
import { moveItem, makeId } from "../utils/list";
import { deleteStorageFiles } from "../utils/storageUpload";
import {
  adminCardStyle,
  adminHintStyle,
  adminInputStyle,
  adminLabelStyle,
  adminPanelStyle,
  adminSaveButtonStyle,
  adminSmallButtonStyle,
} from "../styles/adminStyles";

const emptyLink = () => ({
  id: makeId(),
  platform: "", // "" = recognise it from the URL
  url: "",
  label: "",
  handle: "",
  description: "",
  image: null,
});

const SocialsEditor = () => {
  const [heading, setHeading] = useState(DEFAULT_SOCIALS.heading);
  const [intro, setIntro] = useState(DEFAULT_SOCIALS.intro);
  const [links, setLinks] = useState(DEFAULT_SOCIALS.links);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [status, setStatus] = useState(null);

  // Images that were replaced or removed. They're deleted from Storage only
  // after a successful save, so the live site never points at a missing file.
  const pendingDeletes = useRef([]);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "site_content", "socials"));
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.heading === "string") setHeading(data.heading);
          if (typeof data.intro === "string") setIntro(data.intro);
          if (Array.isArray(data.links)) {
            setLinks(
              data.links.map((l) => ({
                id: l.id || makeId(),
                platform: l.platform || "",
                url: l.url || "",
                label: l.label || "",
                handle: l.handle || "",
                description: l.description || "",
                image: l.image || null,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load socials:", err);
        setLoadFailed(true);
        setStatus({ type: "error", message: LOAD_FAILED_MESSAGE });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateLink = (index, field, value) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  // Uploads finish asynchronously, so image changes are matched by link id
  // (the list may have been reordered while the upload was running).
  const linksRef = useRef(links);
  linksRef.current = links;

  const handleImageChange = (id, newImage) => {
    const current = linksRef.current.find((l) => l.id === id);
    if (!current) {
      // The link was removed while its image was uploading.
      if (newImage?.storagePath) pendingDeletes.current.push(newImage.storagePath);
      return;
    }
    const old = current.image;
    if (old?.storagePath && old.storagePath !== newImage?.storagePath) {
      pendingDeletes.current.push(old.storagePath);
    }
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, image: newImage } : l)));
  };

  const handleRemove = (index) => {
    const removed = links[index];
    if (removed?.image?.storagePath) pendingDeletes.current.push(removed.image.storagePath);
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (loadFailed) return;
    setStatus(null);

    const missingUrl = links.findIndex((l) => !l.url.trim());
    if (missingUrl !== -1) {
      setStatus({
        type: "error",
        message: `Link ${missingUrl + 1} has no URL yet. Add one or remove that link.`,
      });
      return;
    }

    const cleaned = links.map((l) => ({
      id: l.id,
      platform: l.platform || "",
      url: normalizeUrl(l.url),
      label: l.label.trim(),
      handle: l.handle.trim(),
      description: l.description.trim(),
      image: l.image || null,
    }));

    setSaving(true);
    try {
      await setDoc(
        doc(db, "site_content", "socials"),
        { heading: heading.trim() || DEFAULT_SOCIALS.heading, intro: intro.trim(), links: cleaned, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setLinks(cleaned);
      const toDelete = pendingDeletes.current;
      pendingDeletes.current = [];
      await deleteStorageFiles(toDelete);
      setStatus({ type: "success", message: "Saved! The Socials page and footer are updated." });
    } catch (err) {
      console.error("Failed to save socials:", err);
      setStatus({ type: "error", message: "Save failed. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  };

  const previewLinks = links.filter((l) => l.url.trim()).map(resolveSocialLink);

  return (
    <div className="p-4 rounded-3 shadow-lg w-100" style={{ ...adminPanelStyle, maxWidth: "760px" }}>
      <h2 className="mb-1" style={{ fontSize: "1.3rem", color: "#c4a96a" }}>
        Socials Page
      </h2>
      <p style={{ color: "#999", fontSize: "0.9rem" }}>
        Paste a link and the platform, icon and colour are picked automatically. The same links show
        as icons in the footer.
      </p>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading links...</p>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label htmlFor="socials-heading" style={adminLabelStyle}>Page heading</label>
              <input
                id="socials-heading"
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder={DEFAULT_SOCIALS.heading}
                style={adminInputStyle}
              />
            </div>
            <div className="col-12 col-md-8">
              <label htmlFor="socials-intro" style={adminLabelStyle}>Text under the heading (optional)</label>
              <input
                id="socials-intro"
                type="text"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder={DEFAULT_SOCIALS.intro}
                style={adminInputStyle}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-3">
            {links.map((link, index) => {
              const detected = detectPlatform(link.url);
              const effectiveKey = link.platform || detected;
              const platform = PLATFORMS[effectiveKey];
              const Icon = platform.icon;
              const resolved = link.url.trim() ? resolveSocialLink(link) : null;

              return (
                <div key={link.id} style={adminCardStyle}>
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                    <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                      <span style={{ color: platform.color, fontSize: "1.4rem", display: "inline-flex" }}>
                        <Icon />
                      </span>
                      <strong style={{ color: "white" }}>
                        {link.label.trim() || platform.name}
                      </strong>
                    </div>
                    <ListItemControls
                      index={index}
                      count={links.length}
                      itemName="link"
                      onMove={(from, to) => setLinks((prev) => moveItem(prev, from, to))}
                      onRemove={handleRemove}
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-12 col-md-8">
                      <label htmlFor={`social-url-${link.id}`} style={adminLabelStyle}>Link</label>
                      <input
                        id={`social-url-${link.id}`}
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(index, "url", e.target.value)}
                        placeholder="https://www.instagram.com/discarded_band/"
                        style={adminInputStyle}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label htmlFor={`social-platform-${link.id}`} style={adminLabelStyle}>Platform</label>
                      <select
                        id={`social-platform-${link.id}`}
                        value={link.platform}
                        onChange={(e) => updateLink(index, "platform", e.target.value)}
                        style={{ ...adminInputStyle, backgroundColor: "black" }}
                      >
                        <option value="">Automatic ({PLATFORMS[detected].name})</option>
                        {PLATFORM_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {PLATFORMS[key].name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor={`social-label-${link.id}`} style={adminLabelStyle}>Title on the card</label>
                      <input
                        id={`social-label-${link.id}`}
                        type="text"
                        value={link.label}
                        onChange={(e) => updateLink(index, "label", e.target.value)}
                        placeholder={platform.name}
                        style={adminInputStyle}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label htmlFor={`social-handle-${link.id}`} style={adminLabelStyle}>Handle / account name</label>
                      <input
                        id={`social-handle-${link.id}`}
                        type="text"
                        value={link.handle}
                        onChange={(e) => updateLink(index, "handle", e.target.value)}
                        placeholder={resolved?.handle || "@discarded_band"}
                        style={adminInputStyle}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor={`social-desc-${link.id}`} style={adminLabelStyle}>Short description (optional)</label>
                      <input
                        id={`social-desc-${link.id}`}
                        type="text"
                        maxLength={140}
                        value={link.description}
                        onChange={(e) => updateLink(index, "description", e.target.value)}
                        placeholder="e.g. Live clips and behind the scenes"
                        style={adminInputStyle}
                      />
                    </div>

                    <div className="col-12 mt-3">
                      <SingleImageUpload
                        folder="socials"
                        label="Background image (optional)"
                        hint="A photo, cover or still. Without one the card uses the platform's colour."
                        value={link.image}
                        onChange={(img) => handleImageChange(link.id, img)}
                        maxWidth={1200}
                        quality={0.8}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-3"
            onClick={() => setLinks((prev) => [...prev, emptyLink()])}
            style={adminSmallButtonStyle("gold")}
          >
            + Add link
          </button>

          {previewLinks.length > 0 && (
            <div className="mt-4">
              <span style={adminLabelStyle}>Preview</span>
              <small style={{ ...adminHintStyle, marginTop: 0, marginBottom: "10px" }}>
                How the cards look on the site (not saved until you press Save).
              </small>
              <SocialsGrid links={previewLinks} />
            </div>
          )}

          <div className="mt-4">
            <AdminStatus status={status} />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loadFailed}
              className="w-100"
              style={adminSaveButtonStyle(saving || loadFailed)}
            >
              {saving ? "Saving..." : "Save Socials"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialsEditor;
