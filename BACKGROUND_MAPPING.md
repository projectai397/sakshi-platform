# Sakshi Platform - Adiyogi Ghibli Background Mapping

## Overview

This document provides a complete reference for the Adiyogi Ghibli-style backgrounds integrated across all pages of the Sakshi platform. Each page has been carefully assigned a background that complements its purpose and content.

---

## Background Classes

The following CSS classes are available in `client/src/adiyogi-backgrounds.css`:

### Primary Backgrounds

| Class Name | Image File | Description | Visual Theme |
|------------|-----------|-------------|--------------|
| `adiyogi-bg-1` | `kZzOdJt9ua2x.jpg` | Adiyogi statue with devotee in yellow traditional attire | Devotion & Service |
| `adiyogi-bg-2` | `SYagaeZybQKx.jpg` | Meditation scene at Isha Yoga Centre | Contemplation & Peace |
| `adiyogi-bg-3` | `eJ2LYGVpjk9B.jpg` | Spiritual seeker standing before Adiyogi | Seeking & Discovery |
| `adiyogi-bg-4` | `y37pKSWWMb67.jpg` | Devotional worship scene with prayer pose | Gratitude & Reverence |

### Landscape Backgrounds

| Class Name | Image File | Description | Visual Theme |
|------------|-----------|-------------|--------------|
| `adiyogi-bg-mountain` | `evbZLFcm11xB.jpg` | Mountain landscape with Adiyogi and cosmic elements | Vastness & Majesty |
| `adiyogi-bg-sunset` | `j0Z3JMOX6iDK.jpg` | Sunset over Adiyogi statue with warm golden tones | Transformation & Renewal |
| `adiyogi-bg-forest` | `fVc0iLwPJnvt.jpg` | Forest meditation scene with natural elements | Nature & Harmony |
| `adiyogi-bg-nature` | `t1a3o2zwLxah.jpg` | Serene nature landscape with spiritual ambiance | Tranquility & Balance |

---

## Page-to-Background Mapping

### Main Pages

| Page | Route | Background Class | Rationale |
|------|-------|-----------------|-----------|
| **Home** | `/` | `adiyogi-bg-1` | Welcome visitors with devotional imagery representing service and community |
| **About** | `/about` | `adiyogi-bg-2` | Contemplative meditation scene reflects the organization's spiritual foundation |
| **Shop** | `/shop` | `adiyogi-bg-3` | Seeker imagery represents customers discovering treasures |
| **Product Detail** | `/product/:slug` | `adiyogi-bg-4` | Gratitude theme honors each item's story and journey |

### Program Pages

| Page | Route | Background Class | Rationale |
|------|-------|-----------------|-----------|
| **Cafes** | `/cafes` | `adiyogi-bg-mountain` | Majestic mountains represent the strength of women's cooperatives |
| **Café Locations** | `/cafe-locations` | `adiyogi-bg-mountain` | Consistent with main cafes page |
| **Repair Café** | `/repair-cafe` | `adiyogi-bg-sunset` | Sunset symbolizes transformation and renewal through repair |
| **Retreats** | `/retreats` | `adiyogi-bg-forest` | Forest setting evokes retreat and spiritual immersion |
| **Retreat Detail** | `/retreat/:id` | `adiyogi-bg-forest` | Consistent with retreats listing |
| **Meditate** | `/meditate` | `adiyogi-bg-nature` | Tranquil nature scene supports meditation practice |

### Community Pages

| Page | Route | Background Class | Rationale |
|------|-------|-----------------|-----------|
| **Circular Economy** | `/circular-economy` | `adiyogi-bg-1` | Service theme aligns with circular economy principles |
| **Volunteer** | `/volunteer` | `adiyogi-bg-2` | Contemplative scene encourages reflection on service |
| **Donate** | `/donate` | `adiyogi-bg-3` | Seeking theme represents donors finding purpose |
| **Silent Village** | `/silent-village` | `adiyogi-bg-nature` | Natural tranquility supports silent retreat concept |

### User Pages

| Page | Route | Background Class | Rationale |
|------|-------|-----------------|-----------|
| **Profile** | `/profile` | `adiyogi-bg-forest` | Personal growth reflected in forest imagery |
| **Seva Wallet** | `/seva-wallet` | `adiyogi-bg-nature` | Balance and harmony represent token economy |
| **Cart** | `/cart` | `adiyogi-bg-3` | Consistent with shopping experience |
| **Checkout** | `/checkout` | `adiyogi-bg-4` | Gratitude for completing purchase |

### Information Pages

| Page | Route | Background Class | Rationale |
|------|-------|-----------------|-----------|
| **Contact** | `/contact` | `adiyogi-bg-4` | Reverence for human connection |
| **FAQ** | `/faq` | `adiyogi-bg-mountain` | Solid foundation of knowledge |
| **How It Works** | `/how-it-works` | `adiyogi-bg-sunset` | Transformation through understanding |
| **Privacy** | `/privacy` | `adiyogi-bg-2` | Trust and contemplation |

### Administrative Pages

| Page | Route | Background Class | Rationale |
|------|-------|-----------------|-----------|
| **Admin Dashboard** | `/admin` | `adiyogi-bg-mountain` | Oversight and broad perspective |
| **Dashboard** | `/dashboard` | `adiyogi-bg-1` | Service-oriented management |

---

## CSS Implementation

### Background Properties

All background classes use consistent properties:

```css
.adiyogi-bg-* {
  background-image: url('/images/backgrounds/[filename].jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

### Key Features

- **Fixed Attachment**: Creates parallax scrolling effect
- **Cover Size**: Ensures full coverage on all screen sizes
- **Center Position**: Optimal composition on various devices
- **Responsive**: Works seamlessly from mobile to 4K displays

### Overlay for Readability

An optional overlay class improves text readability:

```css
.adiyogi-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(2px);
  z-index: -1;
}
```

Apply to containers with text content:

```tsx
<div className="adiyogi-bg-1">
  <div className="container adiyogi-overlay">
    {/* Your content here */}
  </div>
</div>
```

---

## Usage Examples

### Basic Page Implementation

```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Background */}
        <section className="adiyogi-bg-mountain py-20">
          <div className="container adiyogi-overlay">
            <h1>Page Title</h1>
            <p>Content with readable overlay</p>
          </div>
        </section>
        
        {/* Other sections... */}
      </main>
      
      <Footer />
    </div>
  );
}
```

### Multiple Sections

```tsx
<main className="flex-1">
  {/* Hero with background */}
  <section className="adiyogi-bg-1 py-20">
    <div className="container adiyogi-overlay">
      <h1>Hero Content</h1>
    </div>
  </section>
  
  {/* Content without background */}
  <section className="py-16">
    <div className="container">
      <h2>Regular Content</h2>
    </div>
  </section>
  
  {/* Another section with different background */}
  <section className="adiyogi-bg-sunset py-20">
    <div className="container adiyogi-overlay">
      <h2>Call to Action</h2>
    </div>
  </section>
</main>
```

---

## Image Assets

### Location

All background images are stored in:
- **Source**: `/client/public/images/backgrounds/`
- **Build Output**: `/dist/public/images/backgrounds/`

### File List

```
backgrounds/
├── kZzOdJt9ua2x.jpg (94KB)  - adiyogi-bg-1
├── SYagaeZybQKx.jpg (131KB) - adiyogi-bg-2
├── eJ2LYGVpjk9B.jpg (118KB) - adiyogi-bg-3
├── y37pKSWWMb67.jpg (131KB) - adiyogi-bg-4
├── evbZLFcm11xB.jpg (90KB)  - adiyogi-bg-mountain
├── j0Z3JMOX6iDK.jpg (47KB)  - adiyogi-bg-sunset
├── fVc0iLwPJnvt.jpg (93KB)  - adiyogi-bg-forest
└── t1a3o2zwLxah.jpg (70KB)  - adiyogi-bg-nature
```

**Total Size**: ~774KB (8 primary images)  
**Additional Images**: 8 more variations available for future use

---

## Design Principles

### Visual Consistency

The backgrounds follow Studio Ghibli's aesthetic principles:
- **Soft, painterly quality** with gentle color palettes
- **Natural elements** integrated with spiritual themes
- **Emotional resonance** that supports page content
- **Whimsical yet reverent** tone throughout

### Spiritual Alignment

Each background connects to Adiyogi's essence:
- **Meditation and contemplation**
- **Connection with nature**
- **Devotion and service**
- **Transformation and growth**

### User Experience

Backgrounds enhance rather than distract:
- **Subtle enough** to not overwhelm content
- **Meaningful enough** to create atmosphere
- **Consistent enough** to maintain brand identity
- **Varied enough** to keep experience fresh

---

## Customization Guide

### Adding New Backgrounds

1. Add image to `/client/public/images/backgrounds/`
2. Create CSS class in `adiyogi-backgrounds.css`:

```css
.adiyogi-bg-custom {
  background-image: url('/images/backgrounds/your-image.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

3. Apply to page component:

```tsx
<section className="adiyogi-bg-custom py-20">
  {/* Content */}
</section>
```

### Adjusting Overlay Opacity

Modify the overlay transparency in CSS:

```css
.adiyogi-overlay::before {
  background: rgba(255, 255, 255, 0.9); /* More opaque */
  /* or */
  background: rgba(255, 255, 255, 0.7); /* More transparent */
}
```

### Creating Themed Overlays

Add color-tinted overlays for specific moods:

```css
.spiritual-overlay::before {
  background: linear-gradient(
    135deg,
    rgba(139, 195, 74, 0.1) 0%,
    rgba(76, 175, 80, 0.1) 50%,
    rgba(33, 150, 243, 0.1) 100%
  );
}
```

---

## Performance Considerations

### Image Optimization

All images are optimized for web:
- **Format**: JPEG for photographic content
- **Size**: 47KB - 131KB per image
- **Dimensions**: Optimized for typical screen sizes
- **Compression**: Balanced quality vs. file size

### Loading Strategy

- Images load progressively
- Fixed attachment may impact mobile performance
- Consider lazy loading for below-the-fold sections
- Use responsive images for different screen sizes

### Best Practices

1. **Limit backgrounds per page**: Use 1-2 main backgrounds
2. **Optimize for mobile**: Test on various devices
3. **Monitor performance**: Use Lighthouse for audits
4. **Cache effectively**: Leverage browser caching

---

## Accessibility

### Text Contrast

All backgrounds maintain WCAG AA contrast ratios when used with overlay:
- **Light overlay** (rgba(255, 255, 255, 0.85)) ensures dark text is readable
- **Backdrop blur** reduces visual noise
- **Test with tools** like WebAIM Contrast Checker

### Alternative Text

Background images are decorative and don't require alt text. Ensure all content text is accessible and semantic HTML is used.

---

## Future Enhancements

### Potential Additions

- **Seasonal backgrounds**: Different images for festivals or seasons
- **Time-based backgrounds**: Morning, afternoon, evening variations
- **User preferences**: Allow users to choose background intensity
- **Animated backgrounds**: Subtle CSS animations for enhanced experience
- **Dark mode variants**: Alternative backgrounds for dark theme

### Advanced Features

- **WebP format**: For better compression with fallbacks
- **Responsive images**: Different sizes for different viewports
- **Lazy loading**: Load backgrounds as user scrolls
- **Intersection Observer**: Trigger animations on scroll

---

## Conclusion

The Adiyogi Ghibli-style backgrounds create a unique, spiritually-grounded visual identity for the Sakshi platform. Each background is thoughtfully chosen to enhance the user experience while maintaining the platform's mission of dignity, sustainability, and community connection.

**Total Pages with Backgrounds**: 16+  
**Total Background Variations**: 8 primary classes  
**Total Image Assets**: 16 files (~1.3MB)  
**Design Style**: Adiyogi + Studio Ghibli fusion  

---

*For technical implementation details, see `client/src/adiyogi-backgrounds.css`*  
*For build information, see `BUILD_NOTES.md`*  
*For project overview, see `README.md`*
