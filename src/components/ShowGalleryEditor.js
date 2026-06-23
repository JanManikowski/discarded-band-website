import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
import ImageUploader from "./ImageUploader";

const ShowGalleryEditor = () => {
  const [shows, setShows] = useState([]); // [{ id, name, photos: [{url, storagePath}] }]
  const [loading, setLoading] = useState(true);
  const [newShowName, setNewShowName] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyShowId, setBusyShowId] = useState(null);
  const [status, setStatus] = useState(null);
  const [collapsed, setCollapsed] = useState({}); // { [showId]: bool }

  // Mirrors `shows` so concurrent photo uploads (multiple files landing
  // around the same time for the same show) always read the true latest
  // photos array instead of a stale value captured at render time.
  const showsRef = useRef([]);

  const showsCollection = collection(db, "shows");

  const loadShows = async () => {
    try {
      const snap = await getDocs(query(showsCollection, orderBy("createdAt", "desc")));
      const loaded = snap.docs.map((d) => ({ id: d.id, photos: [], ...d.data() }));
      setShows(loaded);
      showsRef.current = loaded;
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

  const handleCreateShow = async (e) => {
    e.preventDefault();
    if (!newShowName.trim()) return;
    setCreating(true);
    setStatus(null);
    try {
      await addDoc(showsCollection, {
        name: newShowName.trim(),
        photos: [],
        createdAt: serverTimestamp(),
      });
      setNewShowName("");
      await loadShows();
    } catch (err) {
      console.error("Failed to create show:", err);
      setStatus({ type: "error", message: "Couldn't create show. Try again." });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteShow = async (show) => {
    setBusyShowId(show.id);
    setStatus(null);
    try {
      // Delete all photos from Storage first, then the Firestore doc.
      await Promise.all(
        (show.photos || []).map((p) => deleteObject(ref(storage, p.storagePath)).catch(() => {}))
      );
      await deleteDoc(doc(db, "shows", show.id));
      const next = showsRef.current.filter((s) => s.id !== show.id);
      showsRef.current = next;
      setShows(next);
    } catch (err) {
      console.error("Failed to delete show:", err);
      setStatus({ type: "error", message: "Couldn't delete that show. Try again." });
    } finally {
      setBusyShowId(null);
    }
  };

  const handlePhotoUploaded = async (showId, { url, storagePath }) => {
    setStatus(null);
    const current = showsRef.current.find((s) => s.id === showId);
    if (!current) return;

    const nextPhotos = [...(current.photos || []), { url, storagePath }];
    const next = showsRef.current.map((s) => (s.id === showId ? { ...s, photos: nextPhotos } : s));
    showsRef.current = next;
    setShows(next);

    try {
      await updateDoc(doc(db, "shows", showId), { photos: nextPhotos });
    } catch (err) {
      console.error("Failed to save show photo:", err);
      setStatus({ type: "error", message: "Photo uploaded but failed to save. Try refreshing." });
    }
  };

  const handlePhotoRemove = async (showId, photo) => {
    setStatus(null);
    setBusyShowId(showId);
    try {
      const current = showsRef.current.find((s) => s.id === showId);
      if (!current) return;
      const nextPhotos = (current.photos || []).filter((p) => p.storagePath !== photo.storagePath);
      const next = showsRef.current.map((s) => (s.id === showId ? { ...s, photos: nextPhotos } : s));
      showsRef.current = next;
      setShows(next);

      await updateDoc(doc(db, "shows", showId), { photos: nextPhotos });
      await deleteObject(ref(storage, photo.storagePath));
    } catch (err) {
      console.error("Failed to remove show photo:", err);
      setStatus({ type: "error", message: "Couldn't fully remove that photo. Try again." });
    } finally {
      setBusyShowId(null);
    }
  };

  const toggleCollapsed = (showId) => {
    setCollapsed((prev) => ({ ...prev, [showId]: !prev[showId] }));
  };

  return (
    <div
      className="p-4 rounded-3 shadow-lg w-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", maxWidth: "700px" }}
    >
      <h2 className="mb-3" style={{ fontSize: "1.3rem", color: "#b61c1c" }}>
        Show Galleries
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

      {/* New show form */}
      <form onSubmit={handleCreateShow} className="d-flex mb-4 gap-2">
        <input
          type="text"
          value={newShowName}
          onChange={(e) => setNewShowName(e.target.value)}
          placeholder="New show name (e.g. 'Live at The Underground')"
          style={{
            backgroundColor: "transparent",
            color: "white",
            border: "1px solid white",
            borderRadius: "0",
            padding: "8px 10px",
            flex: 1,
          }}
        />
        <button
          type="submit"
          disabled={creating || !newShowName.trim()}
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            color: "#ff4d4d",
            padding: "8px 16px",
            textTransform: "uppercase",
            fontSize: "0.85rem",
            cursor: creating ? "not-allowed" : "pointer",
            opacity: creating ? 0.6 : 1,
          }}
        >
          {creating ? "Adding..." : "Add Show"}
        </button>
      </form>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading shows...</p>
      ) : shows.length === 0 ? (
        <p style={{ color: "#999" }}>No shows yet. Add one above.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {shows.map((show) => {
            const isCollapsed = !!collapsed[show.id];
            const photoCount = (show.photos || []).length;
            return (
              <div
                key={show.id}
                style={{
                  border: "1px solid #2a2a2a",
                  borderRadius: "6px",
                  padding: "14px",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    onClick={() => toggleCollapsed(show.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e0e0e0",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "1.05rem",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", color: "#999" }}>
                      {isCollapsed ? "▸" : "▾"}
                    </span>
                    {show.name}
                    <span style={{ fontSize: "0.8rem", color: "#999" }}>
                      ({photoCount} photo{photoCount === 1 ? "" : "s"})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteShow(show)}
                    disabled={busyShowId === show.id}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #b61c1c",
                      color: "#ff9b9b",
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      cursor: busyShowId === show.id ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Delete Show
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="mt-3">
                    {photoCount > 0 && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))",
                          gap: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        {show.photos.map((photo) => (
                          <div
                            key={photo.storagePath}
                            style={{ position: "relative", aspectRatio: "1 / 1" }}
                          >
                            <img
                              src={photo.url}
                              alt={show.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #444",
                                display: "block",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handlePhotoRemove(show.id, photo)}
                              disabled={busyShowId === show.id}
                              title="Remove photo"
                              style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: "#b61c1c",
                                color: "white",
                                border: "1px solid white",
                                cursor: busyShowId === show.id ? "not-allowed" : "pointer",
                                lineHeight: "1",
                                fontSize: "0.7rem",
                                opacity: busyShowId === show.id ? 0.6 : 1,
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <ImageUploader
                      folder={`shows/${show.id}`}
                      onUploaded={(uploaded) => handlePhotoUploaded(show.id, uploaded)}
                      buttonLabel="Add Photos to This Show"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowGalleryEditor;