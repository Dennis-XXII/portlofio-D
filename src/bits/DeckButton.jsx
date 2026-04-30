import React from "react";
import "./DeckButton.css";

/**
 * DeckButton
 * A high-tactile, industrial-style button inspired by hardware interfaces.
 *
 * @param {string} label - The text displayed on the button
 * @param {string} iconPath - SVG path data for the icon
 * @param {string} variant - 'red' or 'gray' (defaults to 'gray')
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Disabled state
 * @param {string} ariaLabel - Accessibility label
 */
export default function DeckButton({
  label,
  iconPath,
  variant = "gray",
  onClick,
  disabled = false,
  ariaLabel,
  className = "",
  ...props
}) {
  return (
    <div className={`deck-button-outer ${className}`}>
      <button
        type='button'
        disabled={disabled}
        aria-label={ariaLabel || label}
        onClick={onClick}
        className={`deck-button deck-button--${variant}`}
        {...props}
      >
        <span className={`deck-button-label deck-button-label--${variant}`}>
          {label}
        </span>
      </button>
    </div>
  );
}
