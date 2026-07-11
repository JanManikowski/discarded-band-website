import React, { useCallback, useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";
import { compressImage, generateLQIP } from "../utils/compressImage";

/**
 * Drag-and-drop / multi-select image uploader. Compresses each image
 * client-side before upload, shows per-file progress, and calls
 * onUploaded({ url, storagePath }) once for each file as it finishes -
 * so the parent can append to its list incrementally rather than waiting
 * for the whole batch.
 *
 * @param {string} folder - Storage folder to upload into, e.g. "band-photos" or "shows/abc123"
 */
const ImageUploader = ({ folder, onUploaded, buttonLabel = "Add Photos" }) => {
  const [items, setItems] = useState([]); // [{ id, file, preview, status, progress, error }]
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadOne = useCallback(
    async (item) => {
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: "compressing" } : it))
      );

      // Run compression and LQIP generation in parallel — both use canvas
      // so they're CPU-bound but complete quickly on a modern device.
      const [compressed, lqip] = await Promise.all([
        compressImage(item.file),
        generateLQIP(item.file),
      ]);

      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: "uploading", progress: 0 } : it))
      );

      const safeName = compressed.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const storagePath = `${folder}/${Date.now()}-${item.id}-${safeName}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, compressed);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, progress } : it)));
        },
        (err) => {
          console.error("Upload failed:", err);
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, status: "error", error: "Upload failed" } : it
            )
          );
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            onUploaded({ url, storagePath, lqip: lqip || null });
            // Remove the completed item from the queue shortly after, so
            // the uploader stays tidy without the photo "disappearing"
            // instantly before the user registers it finished.
            setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "done" } : it)));
            setTimeout(() => {
              setItems((prev) => prev.filter((it) => it.id !== item.id));
            }, 1200);
          } catch (err) {
            console.error("Failed to get download URL:", err);
            setItems((prev) =>
              prev.map((it) =>
                it.id === item.id ? { ...it, status: "error", error: "Couldn't finish upload" } : it
              )
            );
          }
        }
      );
    },
    [folder, onUploaded]
  );

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      const oversized = files.filter((f) => f.size > 10 * 1024 * 1024);
      const valid = files.filter((f) => f.size <= 10 * 1024 * 1024);

      const newItems = valid.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: URL.createObjectURL(file),
        status: "queued",
        progress: 0,
        error: null,
      }));

      if (oversized.length > 0) {
        newItems.push({
          id: `${Date.now()}-error`,
          file: null,
          preview: null,
          status: "error",
          progress: 0,
          error: `${oversized.length} file(s) skipped (over 10MB)`,
        });
      }

      setItems((prev) => [...prev, ...newItems]);
      newItems.filter((it) => it.file).forEach((it) => uploadOne(it));
    },
    [uploadOne]
  );

  const handleInputChange = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragOver ? "#b61c1c" : "#555"}`,
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragOver ? "rgba(182, 28, 28, 0.08)" : "rgba(255,255,255,0.02)",
        transition: "border-color 0.2s, background-color 0.2s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        style={{ display: "none" }}
      />

      <p style={{ color: "#e0e0e0", margin: 0, fontSize: "0.9rem" }}>
        Drag photos here, or click to {buttonLabel.toLowerCase()}
      </p>
      <p style={{ color: "#777", margin: "4px 0 0", fontSize: "0.75rem" }}>
        Images are automatically resized and compressed before upload.
      </p>

      {items.length > 0 && (
        <div
          className="d-flex flex-wrap justify-content-center gap-2 mt-3"
          onClick={(e) => e.stopPropagation()}
          style={{ cursor: "default" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                width: "90px",
                position: "relative",
              }}
            >
              {item.preview ? (
                <img
                  src={item.preview}
                  alt="Uploading"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    opacity: item.status === "error" ? 0.4 : 1,
                    border: "1px solid #444",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "4px",
                    border: "1px solid #b61c1c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "#ff9b9b",
                    padding: "4px",
                  }}
                >
                  Skipped
                </div>
              )}

              {(item.status === "compressing" || item.status === "uploading") && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: "0 0 4px 4px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: item.status === "compressing" ? "30%" : `${item.progress}%`,
                      backgroundColor: "#b61c1c",
                      borderRadius: "0 0 4px 4px",
                      transition: "width 0.2s",
                    }}
                  />
                </div>
              )}

              {item.status === "done" && (
                <div
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    backgroundColor: "#28a745",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✓
                </div>
              )}

              {item.error && (
                <p style={{ color: "#ff9b9b", fontSize: "0.65rem", margin: "2px 0 0" }}>
                  {item.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;