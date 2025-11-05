import React, { useState } from 'react';
import { useTheme } from '../lib/theme';
import { themes, ThemeName } from '../lib/theme';

export function ThemeSelector() {
  const { themeName, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeList: ThemeName[] = ['light', 'dark', 'adiyogi', 'nature', 'spiritual'];

  const getThemeIcon = (name: ThemeName) => {
    switch (name) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'adiyogi':
        return '🕉️';
      case 'nature':
        return '🌿';
      case 'spiritual':
        return '🙏';
      default:
        return '🎨';
    }
  };

  return (
    <div className="theme-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-selector-button"
        aria-label="Select theme"
        title="Change theme"
      >
        <span className="theme-icon">{getThemeIcon(themeName)}</span>
        <span className="theme-name">{themes[themeName].displayName}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="theme-selector-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="theme-selector-dropdown">
            {themeList.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setTheme(name);
                  setIsOpen(false);
                }}
                className={`theme-option ${name === themeName ? 'active' : ''}`}
              >
                <span className="theme-icon">{getThemeIcon(name)}</span>
                <div className="theme-info">
                  <div className="theme-title">{themes[name].displayName}</div>
                  <div className="theme-description">{themes[name].description}</div>
                </div>
                {name === themeName && <span className="check-mark">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}

      <style>{`
        .theme-selector {
          position: relative;
        }

        .theme-selector-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 14px;
          color: var(--color-text);
          transition: all 0.2s;
        }

        .theme-selector-button:hover {
          background: var(--color-background);
          border-color: var(--color-primary);
        }

        .theme-icon {
          font-size: 18px;
        }

        .theme-name {
          font-weight: 500;
        }

        .dropdown-arrow {
          font-size: 10px;
          opacity: 0.6;
        }

        .theme-selector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
        }

        .theme-selector-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 280px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          z-index: 999;
          overflow: hidden;
        }

        .theme-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 1rem;
          background: none;
          border: none;
          border-bottom: 1px solid var(--color-border);
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .theme-option:last-child {
          border-bottom: none;
        }

        .theme-option:hover {
          background: var(--color-background);
        }

        .theme-option.active {
          background: var(--color-primary);
          color: white;
        }

        .theme-option.active .theme-description {
          color: rgba(255, 255, 255, 0.8);
        }

        .theme-info {
          flex: 1;
        }

        .theme-title {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 0.25rem;
        }

        .theme-description {
          font-size: 12px;
          color: var(--color-textSecondary);
        }

        .check-mark {
          font-size: 18px;
          font-weight: bold;
        }

        @media (max-width: 640px) {
          .theme-selector-dropdown {
            left: 0;
            right: 0;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

// Quick theme toggle button (for navbar)
export function QuickThemeToggle() {
  const { toggleTheme, themeName } = useTheme();

  const getIcon = () => {
    switch (themeName) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'adiyogi':
        return '🕉️';
      case 'nature':
        return '🌿';
      case 'spiritual':
        return '🙏';
      default:
        return '🎨';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="quick-theme-toggle"
      aria-label="Toggle theme"
      title={`Current: ${themes[themeName].displayName}`}
    >
      <span className="theme-icon">{getIcon()}</span>

      <style>{`
        .quick-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s;
        }

        .quick-theme-toggle:hover {
          background: var(--color-primary);
          border-color: var(--color-primary);
          transform: scale(1.1) rotate(15deg);
        }

        .quick-theme-toggle:active {
          transform: scale(0.95) rotate(0deg);
        }
      `}</style>
    </button>
  );
}
