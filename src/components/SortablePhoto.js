import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortablePhoto = ({ photo, onRemove, onEdit, disabled, size = 85 }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.storagePath });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    aspectRatio: "1 / 1",
    width: `${size}px`,
    flexShrink: 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <img
        src={photo.url}
        alt="Gallery"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "4px",
          border: isDragging ? "2px solid #c4a96a" : "1px solid #444",
          display: "block",
          userSelect: "none",
        }}
        draggable={false}
      />

      {/* Credit indicator — small dot if credit exists */}
      {photo.credit && (
        <div
          title={photo.credit}
          style={{
            position: "absolute",
            bottom: "4px",
            left: "4px",
            backgroundColor: "rgba(196, 169, 106, 0.85)",
            borderRadius: "3px",
            padding: "1px 4px",
            fontSize: "0.6rem",
            color: "#1a0a02",
            maxWidth: "calc(100% - 8px)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          © {photo.credit}
        </div>
      )}

      {/* Drag handle — top-left */}
      <div
        {...listeners}
        {...attributes}
        title="Drag to reorder"
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          width: "20px",
          height: "20px",
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: "3px",
          cursor: isDragging ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          color: "white",
          touchAction: "none",
        }}
      >
        ⠿
      </div>

      {/* Edit credit button — top-right, slightly inset to leave room for remove */}
      <button
        type="button"
        onClick={() => onEdit(photo)}
        disabled={disabled}
        title="Edit photographer credit"
        style={{
          position: "absolute",
          top: "-6px",
          right: "18px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#444",
          color: "white",
          border: "1px solid white",
          cursor: disabled ? "not-allowed" : "pointer",
          lineHeight: "1",
          fontSize: "0.65rem",
          opacity: disabled ? 0.6 : 1,
          zIndex: 2,
        }}
      >
        ✎
      </button>

      {/* Remove button — top-right */}
      <button
        type="button"
        onClick={() => onRemove(photo)}
        disabled={disabled}
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
          cursor: disabled ? "not-allowed" : "pointer",
          lineHeight: "1",
          fontSize: "0.7rem",
          opacity: disabled ? 0.6 : 1,
          zIndex: 2,
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default SortablePhoto;