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
import SortablePhoto from "./SortablePhoto";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── Sortable show row (for reordering shows) ─────────────────────────────────
const SortableShowRow = ({ show, onDelete, busyShowId, isCollapsed, onToggle, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: show.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? "1px solid #c4a96a" : "1px solid #2a2a2a",
    borderRadius: "6px",
    padding: "14px",
    backgroundColor: isDragging ? "rgba(196, 169, 106, 0.06)" : "rgba(255,255,255,0.02)",
  };

  const photoCount = (show.photos || []).length;

  return (
    <div ref={setNodeRef} style={style}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          {/* Show drag handle */}
          <div
            {...listeners}
            {...attributes}
            title="Drag to reorder shows"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              color: "#666",
              fontSize: "1rem",
              touchAction: "none",
              padding: "4px",
              userSelect: "none",
            }}
          >
            ⠿
          </div>

          <button
            type="button"
            onClick={onToggle}
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
        </div>

        <button
          type="button"
          onClick={() => onDelete(show)}
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

      {!isCollapsed && <div className="mt-3">{children}</div>}
    </div>
  );
};

// ── Main editor ───────────────────────────────────────────────────────────────
const ShowGalleryEditor = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newShowName, setNewShowName] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyShowId, setBusyShowId] = useState(null);
  const [status, setStatus] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [editingPhoto, setEditingPhoto] = useState(null); // { showId, storagePath, credit }

  const showsRef = useRef([]);
  const showsCollection = collection(db, "shows");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8px movement before drag starts so taps/clicks still work.
      activationConstraint: { distance: 8 },
    })
  );

  const loadShows = async () => {
    try {
      // Use a single orderBy to avoid needing a composite Firestore index.
      // Falls back gracefully: if no docs have "order" yet, Firestore returns
      // them in an arbitrary order and we assign order values immediately.
      const snap = await getDocs(query(showsCollection, orderBy("createdAt", "desc")));
      let loaded = snap.docs.map((d) => ({ id: d.id, photos: [], ...d.data() }));

      // If any show is missing an "order" field, write one now so future
      // drags have a stable base to work from.
      const needsOrder = loaded.filter((s) => s.order === undefined || s.order === null);
      if (needsOrder.length > 0) {
        // Sort by createdAt desc (already the query order), assign 0,1,2...
        await Promise.all(
          loaded.map((show, idx) =>
            show.order === undefined || show.order === null
              ? updateDoc(doc(db, "shows", show.id), { order: idx })
              : Promise.resolve()
          )
        );
        loaded = loaded.map((show, idx) => ({
          ...show,
          order: show.order !== undefined && show.order !== null ? show.order : idx,
        }));
      }

      // Sort by the order field so the UI reflects the saved order
      loaded.sort((a, b) => a.order - b.order);
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

  // ── Shows drag end (reorder shows) ─────────────────────────────────────────
  const handleShowsDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = showsRef.current.findIndex((s) => s.id === active.id);
    const newIndex = showsRef.current.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(showsRef.current, oldIndex, newIndex);
    showsRef.current = reordered;
    setShows(reordered);

    // Persist the new order to Firestore
    try {
      await Promise.all(
        reordered.map((show, idx) =>
          updateDoc(doc(db, "shows", show.id), { order: idx })
        )
      );
    } catch (err) {
      console.error("Failed to save show order:", err);
      setStatus({ type: "error", message: "Couldn't save show order. Try again." });
    }
  };

  // ── Photos drag end (reorder photos within a show) ─────────────────────────
  const handlePhotosDragEnd = async (showId, { active, over }) => {
    if (!over || active.id === over.id) return;

    const current = showsRef.current.find((s) => s.id === showId);
    if (!current) return;

    const oldIndex = current.photos.findIndex((p) => p.storagePath === active.id);
    const newIndex = current.photos.findIndex((p) => p.storagePath === over.id);
    const reordered = arrayMove(current.photos, oldIndex, newIndex);

    const next = showsRef.current.map((s) =>
      s.id === showId ? { ...s, photos: reordered } : s
    );
    showsRef.current = next;
    setShows(next);

    try {
      await updateDoc(doc(db, "shows", showId), { photos: reordered });
    } catch (err) {
      console.error("Failed to save photo order:", err);
      setStatus({ type: "error", message: "Couldn't save photo order. Try again." });
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    if (!newShowName.trim()) return;
    setCreating(true);
    setStatus(null);
    try {
      await addDoc(showsCollection, {
        name: newShowName.trim(),
        photos: [],
        order: showsRef.current.length,
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
    const confirmed = window.confirm(
      `Are you sure you want to delete "${show.name}" and all its photos? This cannot be undone.`
    );
    if (!confirmed) return;

    setBusyShowId(show.id);
    setStatus(null);
    try {
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

  const handlePhotoUploaded = async (showId, { url, storagePath, lqip }) => {
    setStatus(null);
    const current = showsRef.current.find((s) => s.id === showId);
    if (!current) return;
    const nextPhotos = [...(current.photos || []), { url, storagePath, lqip: lqip || null }];
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
      const nextPhotos = current.photos.filter((p) => p.storagePath !== photo.storagePath);
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

  const toggleCollapsed = (showId) =>
    setCollapsed((prev) => ({ ...prev, [showId]: !prev[showId] }));

  const handleCreditSave = async (showId, storagePath, credit) => {
    setStatus(null);
    const current = showsRef.current.find((s) => s.id === showId);
    if (!current) return;

    const nextPhotos = current.photos.map((p) =>
      p.storagePath === storagePath
        ? { ...p, credit: credit.trim() || null }
        : p
    );
    const next = showsRef.current.map((s) =>
      s.id === showId ? { ...s, photos: nextPhotos } : s
    );
    showsRef.current = next;
    setShows(next);
    setEditingPhoto(null);

    try {
      await updateDoc(doc(db, "shows", showId), { photos: nextPhotos });
    } catch (err) {
      console.error("Failed to save credit:", err);
      setStatus({ type: "error", message: "Couldn't save the credit. Try again." });
    }
  };

  return (
    <div
      className="p-4 rounded-3 shadow-lg w-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", maxWidth: "700px" }}
    >
      <h2 className="mb-1" style={{ fontSize: "1.3rem", color: "#c4a96a" }}>
        Show Galleries
      </h2>
      <p style={{ color: "#666", fontSize: "0.8rem", marginBottom: "16px" }}>
        Drag ⠿ to reorder shows or photos within a show.
      </p>

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
            color: "#c4a96a",
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
        // Outer DndContext for reordering shows
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleShowsDragEnd}
        >
          <SortableContext
            items={shows.map((s) => s.id)}
            strategy={rectSortingStrategy}
          >
            <div className="d-flex flex-column gap-3">
              {shows.map((show) => {
                const isCollapsed = !!collapsed[show.id];
                return (
                  <SortableShowRow
                    key={show.id}
                    show={show}
                    onDelete={handleDeleteShow}
                    busyShowId={busyShowId}
                    isCollapsed={isCollapsed}
                    onToggle={() => toggleCollapsed(show.id)}
                  >
                    {/* Inner DndContext for reordering photos within this show */}
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handlePhotosDragEnd(show.id, event)}
                    >
                      <SortableContext
                        items={(show.photos || []).map((p) => p.storagePath)}
                        strategy={rectSortingStrategy}
                      >
                        {(show.photos || []).length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                              marginBottom: "12px",
                            }}
                          >
                            {show.photos.map((photo) => (
                              <div key={photo.storagePath}>
                                <SortablePhoto
                                  photo={photo}
                                  onRemove={(p) => handlePhotoRemove(show.id, p)}
                                  onEdit={(p) =>
                                    setEditingPhoto({
                                      showId: show.id,
                                      storagePath: p.storagePath,
                                      credit: p.credit || "",
                                    })
                                  }
                                  disabled={busyShowId === show.id}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inline credit editor */}
                        {editingPhoto && editingPhoto.showId === show.id && (
                          <div
                            style={{
                              marginBottom: "12px",
                              padding: "12px",
                              backgroundColor: "rgba(255,255,255,0.04)",
                              border: "1px solid #333",
                              borderRadius: "6px",
                            }}
                          >
                            <p style={{ fontSize: "0.8rem", color: "#999", margin: "0 0 8px" }}>
                              Photographer credit (optional)
                            </p>
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                value={editingPhoto.credit}
                                onChange={(e) =>
                                  setEditingPhoto((prev) => ({ ...prev, credit: e.target.value }))
                                }
                                placeholder="e.g. Jan Manikowski"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleCreditSave(editingPhoto.showId, editingPhoto.storagePath, editingPhoto.credit);
                                  if (e.key === "Escape") setEditingPhoto(null);
                                }}
                                style={{
                                  flex: 1,
                                  backgroundColor: "transparent",
                                  color: "white",
                                  border: "1px solid #555",
                                  borderRadius: "4px",
                                  padding: "6px 10px",
                                  fontSize: "0.9rem",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleCreditSave(editingPhoto.showId, editingPhoto.storagePath, editingPhoto.credit)}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid white",
                                  color: "#c4a96a",
                                  padding: "6px 14px",
                                  fontSize: "0.8rem",
                                  textTransform: "uppercase",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPhoto(null)}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #555",
                                  color: "#999",
                                  padding: "6px 12px",
                                  fontSize: "0.8rem",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "#555", margin: "6px 0 0" }}>
                              Leave blank to remove the credit. Press Enter to save, Escape to cancel.
                            </p>
                          </div>
                        )}
                      </SortableContext>
                    </DndContext>

                    <ImageUploader
                      folder={`shows/${show.id}`}
                      onUploaded={(uploaded) => handlePhotoUploaded(show.id, uploaded)}
                      buttonLabel="Add Photos to This Show"
                    />
                  </SortableShowRow>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ShowGalleryEditor;