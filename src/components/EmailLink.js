import React, { useEffect, useRef, useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa6";

/**
 * A plain, visible email address (mailto link) with an optional copy button.
 * Bookers and press often copy the address into their own mail client
 * instead of clicking, so the address is always shown as text.
 */
const EmailLink = ({ email, className = "", showCopy = true }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the address is still selectable text.
    }
  };

  return (
    <span className={`email-link ${className}`}>
      <a href={`mailto:${email}`}>{email}</a>
      {showCopy && (
        <button
          type="button"
          className="email-link-copy"
          onClick={handleCopy}
          aria-label={copied ? "Email address copied" : "Copy email address"}
          title={copied ? "Copied!" : "Copy"}
        >
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      )}
    </span>
  );
};

export default EmailLink;
