import React from "react";

// Shown when an editor can't load the current content. Saving is switched
// off in that case, so the defaults on screen can't overwrite real content.
export const LOAD_FAILED_MESSAGE =
  "Couldn't load what's saved right now, so saving is switched off to avoid overwriting it. Check your connection and reload the page.";

/** Green/red message box used by the admin editors after saving. */
const AdminStatus = ({ status }) => {
  if (!status) return null;
  const ok = status.type === "success";
  return (
    <div
      role="status"
      className="mb-3 p-2 text-center rounded-2"
      style={{
        backgroundColor: ok ? "rgba(40, 167, 69, 0.2)" : "rgba(182, 28, 28, 0.25)",
        border: `1px solid ${ok ? "#28a745" : "#b61c1c"}`,
        color: ok ? "#9be39b" : "#ff9b9b",
      }}
    >
      {status.message}
    </div>
  );
};

export default AdminStatus;
