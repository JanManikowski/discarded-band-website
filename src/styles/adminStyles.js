// Shared inline styles for the admin editors, matching the existing
// admin look (black panels, white outlines, gold accents).

export const adminPanelStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
};

export const adminInputStyle = {
  backgroundColor: "transparent",
  color: "white",
  border: "1px solid white",
  borderRadius: "0",
  padding: "8px 10px",
  width: "100%",
  fontSize: "0.95rem",
};

export const adminLabelStyle = {
  display: "block",
  fontSize: "0.85rem",
  marginBottom: "4px",
  color: "#e0e0e0",
};

export const adminHintStyle = {
  color: "#999",
  fontSize: "0.8rem",
  display: "block",
  marginTop: "4px",
};

export const adminCardStyle = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  padding: "14px",
  backgroundColor: "rgba(255,255,255,0.02)",
};

export const adminSaveButtonStyle = (saving) => ({
  backgroundColor: "transparent",
  border: "1px solid white",
  fontWeight: "bold",
  color: "#c4a96a",
  padding: "12px 20px",
  textTransform: "uppercase",
  opacity: saving ? 0.6 : 1,
  cursor: saving ? "not-allowed" : "pointer",
});

export const adminSmallButtonStyle = (variant = "default", disabled = false) => {
  const colors = {
    default: { border: "1px solid rgba(255,255,255,0.4)", color: "#e0e0e0" },
    gold: { border: "1px solid #c4a96a", color: "#c4a96a" },
    danger: { border: "1px solid #b61c1c", color: "#ff9b9b" },
  };
  return {
    backgroundColor: "transparent",
    padding: "4px 10px",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    ...colors[variant],
  };
};
