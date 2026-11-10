import React from "react";
import { adminSmallButtonStyle } from "../styles/adminStyles";

/**
 * Move up / move down / remove buttons for one row of an editable list
 * in the admin (band members, social links, press quotes...).
 */
const ListItemControls = ({ index, count, onMove, onRemove, itemName = "item", disabled = false }) => (
  <div className="d-flex gap-1" style={{ flexShrink: 0 }}>
    <button
      type="button"
      onClick={() => onMove(index, index - 1)}
      disabled={disabled || index === 0}
      title={`Move ${itemName} up`}
      aria-label={`Move ${itemName} up`}
      style={adminSmallButtonStyle("default", disabled || index === 0)}
    >
      ↑
    </button>
    <button
      type="button"
      onClick={() => onMove(index, index + 1)}
      disabled={disabled || index === count - 1}
      title={`Move ${itemName} down`}
      aria-label={`Move ${itemName} down`}
      style={adminSmallButtonStyle("default", disabled || index === count - 1)}
    >
      ↓
    </button>
    <button
      type="button"
      onClick={() => onRemove(index)}
      disabled={disabled}
      title={`Remove ${itemName}`}
      aria-label={`Remove ${itemName}`}
      style={adminSmallButtonStyle("danger", disabled)}
    >
      ✕
    </button>
  </div>
);

export default ListItemControls;
