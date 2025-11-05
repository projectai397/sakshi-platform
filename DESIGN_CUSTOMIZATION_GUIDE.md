# Sakshi Platform - Design Customization Guide

## Overview

This guide provides additional design customizations to enhance the Sakshi platform's visual appeal and user experience beyond the already-implemented Adiyogi backgrounds, animations, and dark mode.

**Customizations Covered:**
- 🎨 Advanced Theme Customization
- 🖼️ Additional Background Variants
- ✨ Micro-interactions
- 🎭 Loading States & Skeletons
- 🌈 Color Palette Variations
- 📱 Mobile-Specific Enhancements

**Estimated Time**: 1-2 hours

---

## Table of Contents

1. [Advanced Theme System](#advanced-theme-system)
2. [Additional Background Variants](#additional-background-variants)
3. [Micro-interactions](#micro-interactions)
4. [Loading States](#loading-states)
5. [Mobile Enhancements](#mobile-enhancements)

---

## Advanced Theme System

### Multiple Theme Options

Beyond light/dark, add themed variations:

```typescript
// client/src/lib/themes.ts
export const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#A78BFA',
      secondary: '#F472B6',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
    },
  },
  adiyogi: {
    name: 'Adiyogi',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#2C1810',
      surface: '#3D2817',
      text: '#FFF8DC',
      textSecondary: '#D4C5B9',
    },
  },
  nature: {
    name: 'Nature',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      background: '#F0FDF4',
      surface: '#DCFCE7',
      text: '#064E3B',
      textSecondary: '#047857',
    },
  },
  spiritual: {
    name: 'Spiritual',
    colors: {
      primary: '#7C3AED',
      secondary: '#A78BFA',
      background: '#FAF5FF',
      surface: '#F3E8FF',
      text: '#4C1D95',
      textSecondary: '#6D28D9',
    },
  },
};

export type ThemeName = keyof typeof themes;

// Theme context
import { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  colors: typeof themes.light.colors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('light');

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('sakshi-theme') as ThemeName;
    if (saved && themes[saved]) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('sakshi-theme', newTheme);
    
    // Apply CSS variables
    const colors = themes[newTheme].colors;
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme].colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

### Theme Selector Component

```typescript
// client/src/components/ThemeSelector.tsx
import { useTheme, themes, ThemeName } from '@/lib/themes';
import { Palette } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Change theme"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-2 z-50">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
            Choose Theme
          </p>
          {Object.entries(themes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                setTheme(key as ThemeName);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-between ${
                theme === key ? 'bg-purple-50 dark:bg-purple-900/20' : ''
              }`}
            >
              <span>{value.name}</span>
              <div className="flex space-x-1">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: value.colors.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: value.colors.secondary }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Additional Background Variants

### Seasonal Backgrounds

```typescript
// client/src/lib/seasonalBackgrounds.ts
export function getSeasonalBackground(): string {
  const month = new Date().getMonth();
  
  // Spring (March-May)
  if (month >= 2 && month <= 4) {
    return 'adiyogi-bg-spring';
  }
  // Summer (June-August)
  else if (month >= 5 && month <= 7) {
    return 'adiyogi-bg-summer';
  }
  // Autumn (September-November)
  else if (month >= 8 && month <= 10) {
    return 'adiyogi-bg-autumn';
  }
  // Winter (December-February)
  else {
    return 'adiyogi-bg-winter';
  }
}

// Festival backgrounds
export function getFestivalBackground(): string | null {
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();
  
  // Diwali (October/November - approximate)
  if (month === 9 || month === 10) {
    return 'adiyogi-bg-diwali';
  }
  // Holi (March - approximate)
  else if (month === 2) {
    return 'adiyogi-bg-holi';
  }
  // Mahashivratri (February/March - approximate)
  else if (month === 1 || month === 2) {
    return 'adiyogi-bg-mahashivratri';
  }
  
  return null;
}
```

### Time-Based Backgrounds

```typescript
// client/src/lib/timeBasedBackgrounds.ts
export function getTimeBasedBackground(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 8) {
    return 'adiyogi-bg-sunrise';
  } else if (hour >= 8 && hour < 12) {
    return 'adiyogi-bg-morning';
  } else if (hour >= 12 && hour < 17) {
    return 'adiyogi-bg-afternoon';
  } else if (hour >= 17 && hour < 20) {
    return 'adiyogi-bg-sunset';
  } else if (hour >= 20 && hour < 23) {
    return 'adiyogi-bg-evening';
  } else {
    return 'adiyogi-bg-night';
  }
}
```

---

## Micro-interactions

### Button Ripple Effect

```css
/* client/src/micro-interactions.css */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-ripple:active::after {
  width: 300px;
  height: 300px;
}

/* Magnetic button effect */
.btn-magnetic {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-magnetic:hover {
  transform: translateY(-2px) scale(1.02);
}

/* Glow on hover */
.btn-glow {
  position: relative;
  transition: all 0.3s ease;
}

.btn-glow::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, #8B5CF6, #EC4899);
  opacity: 0;
  filter: blur(10px);
  transition: opacity 0.3s;
  z-index: -1;
}

.btn-glow:hover::before {
  opacity: 0.7;
}
```

### Card Tilt Effect

```typescript
// client/src/components/TiltCard.tsx
import { useRef, useState } from 'react';

export function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.1s ease-out',
      }}
      className="tilt-card"
    >
      {children}
    </div>
  );
}
```

### Smooth Scroll Reveal

```typescript
// client/src/hooks/useScrollReveal.ts
import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

// Usage
function MyComponent() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
    >
      Content reveals on scroll
    </div>
  );
}
```

---

## Loading States

### Skeleton Loaders

```typescript
// client/src/components/Skeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4" />
        <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2" />
        <div className="flex justify-between items-center">
          <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-20" />
          <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        {/* Header */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Loading Spinner Variations

```css
/* client/src/loading-spinners.css */

/* Spiritual Om spinner */
.spinner-om {
  width: 50px;
  height: 50px;
  background-image: url('/images/om-symbol.svg');
  background-size: contain;
  animation: spin 2s linear infinite;
}

/* Lotus spinner */
.spinner-lotus {
  width: 50px;
  height: 50px;
  position: relative;
}

.spinner-lotus::before,
.spinner-lotus::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #8B5CF6;
  animation: spin 1s linear infinite;
}

.spinner-lotus::after {
  border-top-color: #EC4899;
  animation-duration: 1.5s;
  animation-direction: reverse;
}

/* Pulse loader */
.loader-pulse {
  display: flex;
  gap: 8px;
}

.loader-pulse span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #8B5CF6;
  animation: pulse 1.4s ease-in-out infinite;
}

.loader-pulse span:nth-child(2) {
  animation-delay: 0.2s;
}

.loader-pulse span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
```

---

## Mobile Enhancements

### Bottom Navigation

```typescript
// client/src/components/BottomNav.tsx
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBag, label: 'Shop', path: '/shop' },
    { icon: Heart, label: 'Seva', path: '/seva-wallet' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

### Pull to Refresh

```typescript
// client/src/hooks/usePullToRefresh.ts
import { useEffect, useRef, useState } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);

  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        startY.current = touchStartY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && touchStartY > 0) {
        const currentY = e.touches[0].clientY;
        const distance = currentY - touchStartY;

        if (distance > 0) {
          setIsPulling(true);
          setPullDistance(Math.min(distance, 100));
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 60) {
        await onRefresh();
      }
      setIsPulling(false);
      setPullDistance(0);
      startY.current = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, onRefresh]);

  return { isPulling, pullDistance };
}
```

### Swipe Gestures

```typescript
// client/src/hooks/useSwipe.ts
import { useEffect, useRef } from 'react';

export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
) {
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStart.current.x;
      const deltaY = touchEnd.y - touchStart.current.y;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
}
```

---

## Accessibility Enhancements

### Focus Indicators

```css
/* client/src/accessibility.css */

/* Custom focus styles */
*:focus-visible {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip to main content link */
.skip-to-main {
  position: absolute;
  top: -40px;
  left: 0;
  background: #8B5CF6;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
  transition: top 0.3s;
}

.skip-to-main:focus {
  top: 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Optimizations

### Image Lazy Loading

```typescript
// client/src/components/LazyImage.tsx
import { useState, useEffect, useRef } from 'react';

export function LazyImage({
  src,
  alt,
  placeholder = '/images/placeholder.jpg',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { placeholder?: string }) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && src) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
          };
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoading ? 'opacity-50' : 'opacity-100'
      }`}
      {...props}
    />
  );
}
```

---

## Checklist

- [ ] Multiple theme options implemented
- [ ] Theme selector component added
- [ ] Seasonal/time-based backgrounds configured
- [ ] Micro-interactions added to buttons and cards
- [ ] Skeleton loaders created
- [ ] Custom loading spinners designed
- [ ] Bottom navigation for mobile added
- [ ] Pull-to-refresh implemented
- [ ] Swipe gestures configured
- [ ] Accessibility enhancements added
- [ ] Image lazy loading implemented

---

## Next Steps

1. ✅ **Test all customizations** across devices
2. ✅ **Gather user feedback** on design changes
3. ✅ **A/B test** different themes
4. ✅ **Create comprehensive walkthroughs** (next phase)
5. ✅ **Document all customizations**

---

*For email and analytics, see `EMAIL_ANALYTICS_GUIDE.md`*  
*For AI features, see `AI_CHATBOT_GUIDE.md`*  
*For payment integration, see `PAYMENT_INTEGRATION_GUIDE.md`*
