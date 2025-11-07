import React from 'react';

/**
 * Skip to Content Link - WCAG AA Requirement
 * Allows keyboard users to skip navigation and go directly to main content
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById('main-content');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      Skip to main content
    </a>
  );
}

// Add this CSS to your global styles
const styles = `
.skip-to-content {
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1rem 1.5rem;
  background-color: #2C5F2D;
  color: white;
  text-decoration: none;
  font-weight: bold;
  border-radius: 0 0 4px 4px;
}

.skip-to-content:focus {
  left: 50%;
  transform: translateX(-50%);
  top: 0;
}
`;
