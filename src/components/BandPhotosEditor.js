import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
import ImageUploader from "./ImageUploader";

const BandPhotosEditor = () => {
  const [photos, setPhotos] = useState([]); // [{ url, storagePath }]
  const [loading, setLoading] = useState(true);
  const [removingPath, setRemovingPath] = useState(null);
  const [status, setStatus] = useState(null);

  // Keep a ref mirroring the latest photos array so concurrent uploads
  // (multiple files finishing around the same time) each save against the
  // true latest list instead of a stale closure value.
  const photosRef = useRef([]);

  const docRef = doc(db, "site_content", "aboutUs");

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists() && Array.isArray(snap.data().bandPhotos)) {
          setPhotos(snap.data().bandPhotos);
          photosRef.current = snap.data().bandPhotos;
        }
      } catch (err) {
        console.error("Failed to load band photos:", err);
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    load();
  }, []);

  const handleUploaded = async ({ url, storagePath, lqip }) => {
    setStatus(null);
    const next = [...photosRef.current, { url, storagePath, lqip: lqip || null }];
    photosRef.current = next;
    setPhotos(next);
    try {
      await setDoc(docRef, { bandPhotos: next, updatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error("Failed to save new photo:", err);
      setStatus({ type: "error", message: "Photo uploaded but failed to save. Try refreshing." });
    }
  };

  const handleRemove = async (photo) => {
    setStatus(null);
    setRemovingPath(photo.storagePath);
    try {
      // Remove from Firestore first so the public site stops referencing it
      // immediately, then delete the underlying file from Storage.
      const next = photosRef.current.filter((p) => p.storagePath !== photo.storagePath);
      photosRef.current = next;
      setPhotos(next);
      await setDoc(docRef, { bandPhotos: next, updatedAt: serverTimestamp() }, { merge: true });
      await deleteObject(ref(storage, photo.storagePath));
    } catch (err) {
      console.error("Failed to remove photo:", err);
      setStatus({ type: "error", message: "Couldn't fully remove that photo. Try again." });
    } finally {
      setRemovingPath(null);
    }
  };

  return (
    <div
      className="p-4 rounded-3 shadow-lg w-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", maxWidth: "700px" }}
    >
      <h2 className="mb-3" style={{ fontSize: "1.3rem", color: "#c4a96a" }}>
        About Us — Band Photos
      </h2>

      {loading ? (
        <p style={{ color: "#e0e0e0" }}>Loading photos...</p>
      ) : (
        <>
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

          {photos.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              {photos.map((photo) => (
                <div
                  key={photo.storagePath}
                  style={{ position: "relative", aspectRatio: "1 / 1" }}
                >
                  <img
                    src={photo.url}
                    alt="Band"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #444",
                      display: "block",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(photo)}
                    disabled={removingPath === photo.storagePath}
                    title="Remove photo"
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#b61c1c",
                      color: "white",
                      border: "1px solid white",
                      cursor: removingPath === photo.storagePath ? "not-allowed" : "pointer",
                      lineHeight: "1",
                      fontSize: "0.8rem",
                      opacity: removingPath === photo.storagePath ? 0.6 : 1,
                    }}
                  >
                    {removingPath === photo.storagePath ? "…" : "✕"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <ImageUploader folder="band-photos" onUploaded={handleUploaded} buttonLabel="Add Photos" />
        </>
      )}
    </div>
  );
};

export default BandPhotosEditor;