import React, { useRef, useState } from "react";
import { compressImage, generateLQIP } from "../utils/compressImage";
import { uploadFile, uploadErrorMessage } from "../utils/storageUpload";
import { adminHintStyle, adminLabelStyle, adminSmallButtonStyle } from "../styles/adminStyles";

const MAX_ORIGINAL_SIZE = 25 * 1024 * 1024; // before compression

/**
 * One image slot in an admin form (a social card image, the press lineup
 * photo...). Compresses and uploads right away, then calls
 * onChange({ url, storagePath, lqip }). "Remove" calls onChange(null).
 * The parent decides when old files get deleted (normally after Save).
 */
const SingleImageUpload = ({
  folder,
  value,
  onChange,
  label = "Image",
  hint,
  maxWidth = 1280,
  quality = 0.8,
  previewAspect = "16 / 9",
  inputId,
}) => {
  const inputRef = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle | compressing | uploading
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const busy = phase !== "idle";

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > MAX_ORIGINAL_SIZE) {
      setError("That image is over 25 MB. Please pick a smaller one.");
      return;
    }

    try {
      setPhase("compressing");
      const [compressed, lqip] = await Promise.all([
        compressImage(file, { maxWidth, quality }),
        generateLQIP(file),
      ]);
      setPhase("uploading");
      setProgress(0);
      const { url, storagePath } = await uploadFile(compressed, folder, setProgress);
      onChange({ url, storagePath, lqip: lqip || null });
    } catch (err) {
      console.error("Image upload failed:", err);
      setError(uploadErrorMessage(err));
    } finally {
      setPhase("idle");
    }
  };

  return (
    <div>
      <span style={adminLabelStyle}>{label}</span>
      <div className="d-flex align-items-center flex-wrap gap-3">
        <div
          style={{
            width: "160px",
            aspectRatio: previewAspect,
            border: "1px dashed #555",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value?.url ? (
            <img src={value.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: "#666", fontSize: "0.75rem" }}>No image</span>
          )}
        </div>

        <div className="d-flex flex-column align-items-start gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            style={adminSmallButtonStyle("gold", busy)}
          >
            {value?.url ? "Replace image" : "Upload image"}
          </button>
          {value?.url && (
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={busy}
              style={adminSmallButtonStyle("danger", busy)}
            >
              Remove image
            </button>
          )}
          {busy && (
            <small style={{ color: "#c4a96a" }}>
              {phase === "compressing" ? "Preparing image…" : `Uploading… ${progress}%`}
            </small>
          )}
          {error && <small style={{ color: "#ff9b9b" }}>{error}</small>}
        </div>
      </div>
      {hint && <small style={adminHintStyle}>{hint}</small>}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default SingleImageUpload;
