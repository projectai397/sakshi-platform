import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName = 'light' | 'dark' | 'adiyogi' | 'nature' | 'spiritual';

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    displayName: 'Light',
    description: 'Clean and bright theme',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    description: 'Easy on the eyes',
    colors: {
      primary: '#A78BFA',
      secondary: '#F472B6',
      accent: '#FBBF24',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
      error: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
      info: '#60A5FA',
    },
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
    },
  },
  adiyogi: {
    name: 'adiyogi',
    displayName: 'Adiyogi',
    description: 'Spiritual purple and blue',
    colors: {
      primary: '#7C3AED',
      secondary: '#2563EB',
      accent: '#F59E0B',
      background: '#F8F7FF',
      surface: '#FFFFFF',
      text: '#1E1B4B',
      textSecondary: '#6366F1',
      border: '#DDD6FE',
      error: '#DC2626',
      success: '#059669',
      warning: '#D97706',
      info: '#2563EB',
    },
    fonts: {
      heading: "'Poppins', 'Inter', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1.25rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px 0 rgba(124, 58, 237, 0.1)',
      md: '0 4px 6px -1px rgba(124, 58, 237, 0.15)',
      lg: '0 10px 15px -3px rgba(124, 58, 237, 0.2)',
      xl: '0 20px 25px -5px rgba(124, 58, 237, 0.25)',
    },
  },
  nature: {
    name: 'nature',
    displayName: 'Nature',
    description: 'Earthy greens and browns',
    colors: {
      primary: '#059669',
      secondary: '#84CC16',
      accent: '#F59E0B',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#14532D',
      textSecondary: '#16A34A',
      border: '#BBF7D0',
      error: '#DC2626',
      success: '#059669',
      warning: '#D97706',
      info: '#0891B2',
    },
    fonts: {
      heading: "'Merriweather', 'Georgia', serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px 0 rgba(5, 150, 105, 0.1)',
      md: '0 4px 6px -1px rgba(5, 150, 105, 0.15)',
      lg: '0 10px 15px -3px rgba(5, 150, 105, 0.2)',
      xl: '0 20px 25px -5px rgba(5, 150, 105, 0.25)',
    },
  },
  spiritual: {
    name: 'spiritual',
    displayName: 'Spiritual',
    description: 'Calm and meditative',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      text: '#3730A3',
      textSecondary: '#7C3AED',
      border: '#E9D5FF',
      error: '#DC2626',
      success: '#059669',
      warning: '#D97706',
      info: '#6366F1',
    },
    fonts: {
      heading: "'Playfair Display', 'Georgia', serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px 0 rgba(99, 102, 241, 0.1)',
      md: '0 4px 6px -1px rgba(99, 102, 241, 0.15)',
      lg: '0 10px 15px -3px rgba(99, 102, 241, 0.2)',
      xl: '0 20px 25px -5px rgba(99, 102, 241, 0.25)',
    },
  },
};

// Apply theme to document
export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Apply fonts
  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });

  // Apply spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Apply border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
}

// Theme context
interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Get theme from localStorage or system preference
export function getInitialTheme(): ThemeName {
  // Check localStorage
  const stored = localStorage.getItem('sakshi-theme') as ThemeName;
  if (stored && themes[stored]) {
    return stored;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // Default to adiyogi theme
  return 'adiyogi';
}

// Save theme to localStorage
export function saveTheme(name: ThemeName) {
  localStorage.setItem('sakshi-theme', name);
}

// Listen for system theme changes
export function watchSystemTheme(callback: (isDark: boolean) => void) {
  if (!window.matchMedia) return;

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
