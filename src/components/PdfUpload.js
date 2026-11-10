import React, { useRef, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { uploadFile, formatFileSize, uploadErrorMessage } from "../utils/storageUpload";
import { adminHintStyle, adminLabelStyle, adminSmallButtonStyle } from "../styles/adminStyles";

const MAX_SIZE = 20 * 1024 * 1024;

/**
 * One PDF slot in an admin form (the tech rider). Uploads right away and
 * calls onChange({ url, storagePath, fileName, size }); "Remove" calls
 * onChange(null). The parent deletes old files after a successful save.
 */
const PdfUpload = ({ folder, value, onChange, label = "PDF", hint }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      setError("Please choose a PDF file.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("That PDF is over 20 MB. Please export a smaller one.");
      return;
    }

    // Some systems report an empty type for PDFs; Storage needs the real one.
    const pdf = file.type === "application/pdf" ? file : new File([file], file.name, { type: "application/pdf" });

    setUploading(true);
    setProgress(0);
    try {
      const { url, storagePath } = await uploadFile(pdf, folder, setProgress);
      onChange({ url, storagePath, fileName: file.name, size: file.size });
    } catch (err) {
      console.error("PDF upload failed:", err);
      setError(uploadErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span style={adminLabelStyle}>{label}</span>
      <div className="d-flex align-items-center flex-wrap gap-3">
        <div
          className="d-flex align-items-center gap-2"
          style={{
            border: "1px dashed #555",
            borderRadius: "6px",
            padding: "10px 14px",
            minWidth: "220px",
            color: value?.url ? "#e0e0e0" : "#666",
            fontSize: "0.9rem",
          }}
        >
          <FaFilePdf style={{ color: value?.url ? "#c4a96a" : "#666", fontSize: "1.3rem", flexShrink: 0 }} />
          {value?.url ? (
            <a href={value.url} target="_blank" rel="noopener noreferrer" style={{ color: "#e0e0e0", wordBreak: "break-all" }}>
              {value.fileName || "Current file"}
              {value.size ? ` (${formatFileSize(value.size)})` : ""}
            </a>
          ) : (
            <span>No file yet</span>
          )}
        </div>

        <div className="d-flex flex-column align-items-start gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={adminSmallButtonStyle("gold", uploading)}
          >
            {value?.url ? "Replace PDF" : "Upload PDF"}
          </button>
          {value?.url && (
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={uploading}
              style={adminSmallButtonStyle("danger", uploading)}
            >
              Remove PDF
            </button>
          )}
          {uploading && <small style={{ color: "#c4a96a" }}>Uploading… {progress}%</small>}
          {error && <small style={{ color: "#ff9b9b" }}>{error}</small>}
        </div>
      </div>
      {hint && <small style={adminHintStyle}>{hint}</small>}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default PdfUpload;
