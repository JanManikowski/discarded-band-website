import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase/config";

export const safeFileName = (name) => (name || "file").replace(/[^a-zA-Z0-9.\-_]/g, "_");

/** 1536000 → "1.5 MB" */
export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Uploads one file to Firebase Storage under `folder` and resolves with
 * { url, storagePath }. `onProgress` gets 0-100 while it uploads.
 */
export const uploadFile = (file, folder, onProgress) =>
  new Promise((resolve, reject) => {
    const name = safeFileName(file.name);
    const storagePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${name}`;
    const task = uploadBytesResumable(ref(storage, storagePath), file, {
      contentType: file.type || undefined,
      // Keeps the original name when someone saves the file (e.g. the tech rider PDF).
      contentDisposition: `inline; filename="${name}"`,
    });

    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => {
        try {
          resolve({ url: await getDownloadURL(task.snapshot.ref), storagePath });
        } catch (err) {
          reject(err);
        }
      }
    );
  });

/** A readable message for a failed upload. */
export const uploadErrorMessage = (err) =>
  err?.code === "storage/unauthorized"
    ? "Firebase refused this upload. The Storage rules need updating: paste the project's storage.rules into the Firebase console."
    : "Upload failed. Check your connection and try again.";

/**
 * Deletes files that are no longer used (replaced or removed images/PDFs).
 * Failures are only logged: a leftover file costs nothing on the site.
 */
export const deleteStorageFiles = async (paths) => {
  await Promise.all(
    [...new Set(paths.filter(Boolean))].map(async (path) => {
      try {
        await deleteObject(ref(storage, path));
      } catch (err) {
        console.warn(`Couldn't delete old file ${path}:`, err);
      }
    })
  );
};
