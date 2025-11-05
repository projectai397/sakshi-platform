# Sakshi Platform - Design Enhancements

## Overview

This document details all design enhancements added to the Sakshi platform, including animations, dark mode, and advanced visual effects.

---

## Enhanced Features

### 1. Advanced Animations (`animations.css`)

A comprehensive animation library with 30+ effects and utilities.

#### Keyframe Animations

| Animation | Duration | Effect | Use Case |
|-----------|----------|--------|----------|
| `fadeIn` | 0.6s | Fade in with upward movement | Page load, content reveal |
| `fadeInUp` | 0.8s | Fade in from bottom | Section entrances |
| `slideInLeft` | 0.6s | Slide in from left | Side panels, cards |
| `slideInRight` | 0.6s | Slide in from right | Complementary content |
| `float` | 3s infinite | Gentle floating motion | Icons, decorative elements |
| `pulse` | 2s infinite | Opacity pulsing | Loading states, attention |
| `bounce` | 1s infinite | Bouncing motion | Call-to-action elements |
| `rotate` | 2s infinite | 360° rotation | Loading spinners |
| `scaleIn` | 0.4s | Scale up from center | Modals, popups |
| `glow` | 2s infinite | Glowing effect | Highlights, featured items |

#### Usage Examples

```tsx
// Fade in animation on page load
<div className="animate-fadeIn">
  <h1>Welcome to Sakshi</h1>
</div>

// Staggered animations
<div className="animate-fadeIn animate-delay-100">First item</div>
<div className="animate-fadeIn animate-delay-200">Second item</div>
<div className="animate-fadeIn animate-delay-300">Third item</div>

// Floating icon
<span className="animate-float text-6xl">🍃</span>

// Loading spinner
<div className="loading-spinner"></div>
```

#### Hover Effects

```tsx
// Lift on hover
<div className="hover-lift ghibli-card">
  Card content
</div>

// Scale on hover
<img className="hover-scale" src="..." />

// Glow on hover
<button className="hover-glow">Click me</button>

// Brightness on hover
<div className="hover-brightness">
  Image container
</div>
```

#### Scroll Animations

```tsx
// Reveal on scroll (requires JavaScript)
<div className="scroll-reveal">
  Content appears when scrolled into view
</div>

// Add 'revealed' class when in viewport
<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
});

document.querySelectorAll('.scroll-reveal').forEach(el => {
  observer.observe(el);
});
</script>
```

### 2. Dark Mode Support (`dark-mode.css`)

Complete dark mode implementation with automatic system preference detection.

#### Color Scheme

**Dark Mode Palette**:
- Background Primary: `#1a1a1a`
- Background Secondary: `#2d2d2d`
- Background Tertiary: `#3a3a3a`
- Text Primary: `#f5f5f5`
- Text Secondary: `#d1d1d1`
- Text Muted: `#a0a0a0`

#### Implementation

```tsx
// Toggle dark mode
function toggleDarkMode() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize theme on page load
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = savedTheme || (prefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);
```

#### Dark Mode Toggle Button

```tsx
<button className="theme-toggle" onClick={toggleDarkMode}>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>
```

#### Automatic System Preference

The platform respects user's system preference:
```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Dark mode colors applied automatically */
  }
}
```

### 3. Loading States

#### Skeleton Loaders

```tsx
<div className="skeleton" style={{ width: '100%', height: '200px' }}></div>
```

#### Spinner

```tsx
<div className="loading-spinner"></div>
```

### 4. Button Enhancements

#### Ripple Effect

```tsx
<button className="btn-ripple ghibli-button">
  Click for ripple effect
</button>
```

### 5. Card Effects

#### Flip Cards

```tsx
<div className="card-flip">
  <div className="card-flip-inner">
    <div className="card-flip-front">
      Front content
    </div>
    <div className="card-flip-back">
      Back content (revealed on hover)
    </div>
  </div>
</div>
```

### 6. Text Effects

#### Shimmer Text

```tsx
<h1 className="text-shimmer">
  Sakshi Platform
</h1>
```

#### Typing Animation

```tsx
<p className="text-typing">
  Witnessing every journey...
</p>
```

### 7. Gradient Animations

```tsx
<div className="gradient-animate p-8">
  Animated gradient background
</div>
```

### 8. Scroll Progress Bar

```tsx
// Add to layout
<div 
  className="scroll-progress" 
  style={{ width: `${scrollProgress}%` }}
></div>

// Calculate scroll progress
const [scrollProgress, setScrollProgress] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    setScrollProgress(progress);
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 9. Particle Effects

```tsx
<div className="relative">
  <div className="particle particle-1" style={{ top: '10%', left: '20%' }}></div>
  <div className="particle particle-2" style={{ top: '30%', left: '60%' }}></div>
  <div className="particle particle-3" style={{ top: '50%', left: '40%' }}></div>
</div>
```

---

## Responsive Design

### Mobile Optimizations

Heavy animations are disabled on mobile devices for better performance:

```css
@media (max-width: 768px) {
  .animate-float,
  .gradient-animate,
  .particle {
    animation: none;
  }
}
```

### Accessibility

Respects user's motion preferences:

```css
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

## Performance Considerations

### Animation Performance

1. **Use CSS animations** instead of JavaScript when possible
2. **Limit concurrent animations** to 3-5 on screen
3. **Use `transform` and `opacity`** for best performance
4. **Avoid animating** `width`, `height`, `top`, `left`

### Dark Mode Performance

1. **CSS variables** for instant theme switching
2. **Smooth transitions** (0.3s) for color changes
3. **localStorage** to persist user preference
4. **System preference** detection on first visit

### Loading Strategy

1. **Critical CSS** inlined in HTML
2. **Animation CSS** loaded after page load
3. **Lazy load** heavy animations below the fold
4. **Conditional loading** based on device capabilities

---

## Browser Compatibility

| Browser | Animations | Dark Mode | Scroll Effects |
|---------|-----------|-----------|----------------|
| Chrome 90+ | ✅ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ | ✅ |
| Opera 76+ | ✅ | ✅ | ✅ |

### Fallbacks

- Older browsers: Animations gracefully degrade
- No JavaScript: Dark mode uses system preference
- No CSS support: Content remains accessible

---

## Implementation Checklist

### Phase 1: Basic Animations ✅
- [x] Keyframe animations defined
- [x] Utility classes created
- [x] Hover effects implemented
- [x] Loading states added

### Phase 2: Dark Mode ✅
- [x] Color variables defined
- [x] Component styles updated
- [x] Toggle button created
- [x] System preference detection
- [x] localStorage persistence

### Phase 3: Advanced Effects ✅
- [x] Scroll animations
- [x] Particle effects
- [x] Gradient animations
- [x] Text effects
- [x] Card flips

### Phase 4: Optimization ✅
- [x] Mobile performance
- [x] Accessibility support
- [x] Browser compatibility
- [x] Loading strategy

---

## Usage Guidelines

### When to Use Animations

**✅ Good Use Cases**:
- Page transitions
- Content reveals
- Loading states
- Hover feedback
- Attention-grabbing CTAs

**❌ Avoid**:
- Excessive animations on one page
- Animations that distract from content
- Long animation durations (>1s)
- Animations on every element

### Dark Mode Best Practices

1. **Test both themes** during development
2. **Maintain contrast ratios** (WCAG AA minimum)
3. **Adjust images** if needed (brightness filter)
4. **Provide toggle** in accessible location
5. **Respect system preference** by default

### Performance Tips

1. **Use `will-change`** sparingly for critical animations
2. **Debounce scroll events** for scroll animations
3. **Use IntersectionObserver** for scroll reveals
4. **Limit particle count** to 5-10 maximum
5. **Test on low-end devices**

---

## Future Enhancements

### Planned Features

1. **Seasonal Themes**: Festival-specific color schemes
2. **Custom Animations**: User-configurable animation speeds
3. **Micro-interactions**: Button states, form feedback
4. **3D Effects**: CSS 3D transforms for cards
5. **SVG Animations**: Animated icons and illustrations

### Advanced Features

1. **Gesture Animations**: Swipe, pinch interactions
2. **Parallax Scrolling**: Multi-layer depth effects
3. **Lottie Animations**: Complex animated illustrations
4. **GSAP Integration**: Advanced timeline animations
5. **WebGL Effects**: GPU-accelerated visuals

---

## Troubleshooting

### Animations Not Working

**Issue**: Animations don't play

**Solutions**:
1. Check CSS is imported in `main.tsx`
2. Verify class names are correct
3. Check for conflicting styles
4. Test in different browser

### Dark Mode Not Switching

**Issue**: Theme doesn't change

**Solutions**:
1. Check `data-theme` attribute on `<html>`
2. Verify localStorage is enabled
3. Clear browser cache
4. Check CSS specificity

### Performance Issues

**Issue**: Page feels slow

**Solutions**:
1. Reduce number of concurrent animations
2. Disable heavy effects on mobile
3. Use `transform` instead of position changes
4. Lazy load below-the-fold animations

---

## Code Examples

### Complete Animation Example

```tsx
import { useEffect, useState } from 'react';

export default function AnimatedSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('animated-section');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <section 
      id="animated-section"
      className={`scroll-reveal ${isVisible ? 'revealed' : ''}`}
    >
      <h2 className="animate-fadeIn">Welcome to Sakshi</h2>
      <p className="animate-fadeIn animate-delay-200">
        Witnessing every journey, supporting every soul
      </p>
      <button className="btn-ripple hover-lift animate-fadeIn animate-delay-400">
        Get Started
      </button>
    </section>
  );
}
```

### Complete Dark Mode Example

```tsx
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
```

---

## Summary

The Sakshi platform now includes:

✅ **30+ animations** for rich interactions  
✅ **Complete dark mode** with system preference detection  
✅ **Advanced effects** (particles, gradients, text animations)  
✅ **Performance optimized** for mobile and accessibility  
✅ **Browser compatible** with graceful fallbacks  

All enhancements maintain the Adiyogi Ghibli aesthetic while improving user experience and engagement.

---

*For background information, see `BACKGROUND_MAPPING.md`*  
*For visual preview, see `VISUAL_PREVIEW.md`*  
*For build details, see `BUILD_NOTES.md`*
