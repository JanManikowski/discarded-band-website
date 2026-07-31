import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";

// Font sizes offered in the toolbar dropdown. Stored as inline styles
// (e.g. font-size: 1.2rem) directly in the saved HTML.
const FONT_SIZES = [
  { label: "Small", value: "0.9rem" },
  { label: "Normal", value: "1.2rem" },
  { label: "Large", value: "1.6rem" },
  { label: "Extra Large", value: "2rem" },
];

// Swatches matching the site's existing palette (red accent, white, grey)
// plus a few extras for flexibility.
const COLOR_SWATCHES = [
  { label: "Default", value: "#e0e0e0" },
  { label: "White", value: "#ffffff" },
  { label: "Discarded Gold", value: "#c4a96a" },
  { label: "Grey", value: "#999999" },
];

const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    style={{
      backgroundColor: active ? "#c4a96a" : "transparent",
      border: "1px solid white",
      color: active ? "#1a0a02" : "white",
      padding: "4px 10px",
      marginRight: "6px",
      marginBottom: "6px",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "0.85rem",
    }}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, minHeight = "150px" }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyleKit],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div className="d-flex flex-wrap align-items-center mb-2">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>

        {/* Font size dropdown */}
        <select
          title="Font size"
          onChange={(e) => {
            const size = e.target.value;
            if (size === "default") {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(size).run();
            }
          }}
          style={{
            backgroundColor: "black",
            color: "white",
            border: "1px solid white",
            borderRadius: "3px",
            padding: "4px 6px",
            marginRight: "6px",
            marginBottom: "6px",
            fontSize: "0.85rem",
          }}
          defaultValue="default"
        >
          <option value="default">Size: Default</option>
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Color swatches */}
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            onClick={() => editor.chain().focus().setColor(c.value).run()}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: c.value,
              border: "2px solid white",
              marginRight: "6px",
              marginBottom: "6px",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}

        <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear
        </ToolbarButton>
      </div>

      {/* Editable area */}
      <div
        style={{
          border: "1px solid white",
          borderRadius: "3px",
          padding: "10px",
          minHeight,
          backgroundColor: "rgba(255,255,255,0.03)",
          color: "#e0e0e0",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;