import React, { useState, useEffect, ReactNode } from 'react';
import {
  ThemeContext,
  ThemeName,
  themes,
  applyTheme,
  getInitialTheme,
  saveTheme,
  watchSystemTheme,
} from '../lib/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(getInitialTheme);
  const theme = themes[themeName];

  useEffect(() => {
    // Apply theme on mount and when it changes
    applyTheme(theme);
    saveTheme(themeName);
  }, [theme, themeName]);

  useEffect(() => {
    // Watch for system theme changes
    const cleanup = watchSystemTheme((isDark) => {
      // Only auto-switch if user hasn't manually selected a theme
      const stored = localStorage.getItem('sakshi-theme-manual');
      if (!stored) {
        setThemeName(isDark ? 'dark' : 'light');
      }
    });

    return cleanup;
  }, []);

  const handleSetTheme = (name: ThemeName) => {
    setThemeName(name);
    // Mark as manually selected
    localStorage.setItem('sakshi-theme-manual', 'true');
  };

  const toggleTheme = () => {
    const themeOrder: ThemeName[] = ['light', 'dark', 'adiyogi', 'nature', 'spiritual'];
    const currentIndex = themeOrder.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    handleSetTheme(themeOrder[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
