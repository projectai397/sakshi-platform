# Sakshi Platform - Testing & Optimization Guide

## Overview

This document covers testing strategies, performance optimization, and quality assurance for the Sakshi platform.

---

## Testing Strategy

### 1. Manual Testing Checklist

#### Homepage Testing
- [ ] Hero section loads with Adiyogi background
- [ ] All navigation links work
- [ ] Animations play smoothly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Dark mode toggle works
- [ ] Footer links are functional

#### Shop Page Testing
- [ ] Products load correctly
- [ ] Filters work (category, price, condition)
- [ ] Search functionality works
- [ ] Product cards display properly
- [ ] Add to cart button works
- [ ] Pagination works
- [ ] Background image displays

#### Cart & Checkout Testing
- [ ] Items appear in cart
- [ ] Quantity can be updated
- [ ] Items can be removed
- [ ] Total calculates correctly
- [ ] Seva tokens option works
- [ ] Payment methods display
- [ ] Checkout flow completes
- [ ] Order confirmation shows

#### User Authentication
- [ ] Login works
- [ ] Logout works
- [ ] OAuth redirect works
- [ ] Session persists
- [ ] Protected routes redirect to login
- [ ] User profile loads

#### Seva Wallet Testing
- [ ] Balance displays correctly
- [ ] Transaction history shows
- [ ] Earning tokens works
- [ ] Spending tokens works
- [ ] Wallet animations work

#### Admin Dashboard Testing
- [ ] Admin can access dashboard
- [ ] Product management works
- [ ] Order management works
- [ ] User management works
- [ ] Analytics display correctly
- [ ] Bulk operations work

### 2. Automated Testing

#### Unit Tests

```typescript
// tests/unit/sevaWallet.test.ts
import { describe, it, expect } from 'vitest';
import { calculateSevaTokens } from '@/lib/sevaWallet';

describe('Seva Wallet', () => {
  it('should calculate tokens correctly', () => {
    const amount = 100;
    const tokens = calculateSevaTokens(amount);
    expect(tokens).toBe(10); // 10% conversion rate
  });
  
  it('should handle zero amount', () => {
    expect(calculateSevaTokens(0)).toBe(0);
  });
  
  it('should round down fractional tokens', () => {
    expect(calculateSevaTokens(95)).toBe(9);
  });
});
```

#### Integration Tests

```typescript
// tests/integration/checkout.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { createTestContext } from './helpers';

describe('Checkout Flow', () => {
  let ctx;
  
  beforeAll(async () => {
    ctx = await createTestContext();
  });
  
  it('should complete checkout with money payment', async () => {
    const cart = await ctx.addToCart(testProduct);
    const order = await ctx.checkout({ paymentMethod: 'money' });
    
    expect(order.status).toBe('pending');
    expect(order.total).toBe(testProduct.price);
  });
  
  it('should complete checkout with seva tokens', async () => {
    await ctx.addSevaTokens(100);
    const cart = await ctx.addToCart(testProduct);
    const order = await ctx.checkout({ paymentMethod: 'seva' });
    
    expect(order.status).toBe('pending');
    expect(ctx.user.sevaWallet.balance).toBe(100 - testProduct.sevaPrice);
  });
});
```

#### End-to-End Tests

```typescript
// tests/e2e/shopping.spec.ts
import { test, expect } from '@playwright/test';

test('complete shopping flow', async ({ page }) => {
  // Visit homepage
  await page.goto('http://localhost:3000');
  await expect(page.locator('h1')).toContainText('Sakshi');
  
  // Navigate to shop
  await page.click('text=Shop');
  await expect(page).toHaveURL(/.*shop/);
  
  // Add product to cart
  await page.click('.product-card:first-child button:has-text("Add to Cart")');
  await expect(page.locator('.cart-count')).toContainText('1');
  
  // Go to cart
  await page.click('[aria-label="Cart"]');
  await expect(page).toHaveURL(/.*cart/);
  
  // Proceed to checkout
  await page.click('text=Checkout');
  await expect(page).toHaveURL(/.*checkout/);
  
  // Complete checkout
  await page.fill('[name="address"]', '123 Test Street');
  await page.click('text=Place Order');
  
  // Verify order confirmation
  await expect(page).toHaveURL(/.*order-confirmation/);
  await expect(page.locator('h1')).toContainText('Thank You');
});
```

### 3. Performance Testing

#### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Target scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 90+
```

#### Load Testing

```bash
# Install k6
brew install k6  # macOS
# or
sudo apt install k6  # Linux

# Create load test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:3000');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
EOF

# Run load test
k6 run load-test.js
```

---

## Performance Optimization

### 1. Frontend Optimization

#### Image Optimization

```typescript
// Use next/image or similar for automatic optimization
<img 
  src="/images/backgrounds/adiyogi-bg-1.jpg"
  alt="Adiyogi background"
  loading="lazy"
  width={1920}
  height={1080}
/>

// Or use WebP format with fallback
<picture>
  <source srcset="/images/backgrounds/adiyogi-bg-1.webp" type="image/webp" />
  <img src="/images/backgrounds/adiyogi-bg-1.jpg" alt="Adiyogi background" />
</picture>
```

#### Code Splitting

```typescript
// Lazy load heavy components
const AdminDashboard = lazy(() => import('./pages/Admin'));
const RetreatBooking = lazy(() => import('./pages/RetreatBooking'));

// Use Suspense for loading states
<Suspense fallback={<div className="loading-spinner" />}>
  <AdminDashboard />
</Suspense>
```

#### Bundle Size Optimization

```bash
# Analyze bundle size
pnpm build
pnpm run analyze  # If analyzer is configured

# Optimize imports
# Bad:
import { Button, Card, Input } from 'antd';

# Good:
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Input from 'antd/es/input';
```

### 2. Backend Optimization

#### Database Query Optimization

```typescript
// Bad: N+1 query problem
const orders = await db.query.orders.findMany();
for (const order of orders) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, order.userId)
  });
}

// Good: Use joins
const orders = await db.query.orders.findMany({
  with: {
    user: true,
    items: {
      with: {
        product: true
      }
    }
  }
});
```

#### Caching Strategy

```typescript
// Install Redis
pnpm add ioredis

// Implement caching
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

export async function getProducts() {
  const cacheKey = 'products:all';
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const products = await db.query.products.findMany();
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(products));
  
  return products;
}
```

#### API Response Optimization

```typescript
// Pagination
export const productsRouter = router({
  list: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20)
    }))
    .query(async ({ input, ctx }) => {
      const offset = (input.page - 1) * input.limit;
      
      const [products, total] = await Promise.all([
        ctx.db.query.products.findMany({
          limit: input.limit,
          offset: offset
        }),
        ctx.db.select({ count: sql`count(*)` }).from(products)
      ]);
      
      return {
        products,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: total[0].count,
          pages: Math.ceil(total[0].count / input.limit)
        }
      };
    })
});
```

### 3. Asset Optimization

#### CSS Optimization

```bash
# Purge unused CSS with Tailwind
# tailwind.config.js
module.exports = {
  content: [
    './client/src/**/*.{js,jsx,ts,tsx}',
  ],
  // This automatically purges unused styles
}
```

#### JavaScript Minification

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          trpc: ['@trpc/client', '@trpc/server']
        }
      }
    }
  }
});
```

### 4. Network Optimization

#### Enable Compression

```typescript
// server/index.ts
import compression from 'compression';

app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

#### HTTP/2 Support

```bash
# Use HTTP/2 in production
# Most hosting platforms support this automatically
# For self-hosted, use Nginx with HTTP/2:

server {
    listen 443 ssl http2;
    server_name sakshi.org;
    # ... rest of config
}
```

#### CDN Integration

```typescript
// Use CDN for static assets
const CDN_URL = process.env.CDN_URL || '';

export function getAssetUrl(path: string) {
  return CDN_URL ? `${CDN_URL}${path}` : path;
}

// Usage
<img src={getAssetUrl('/images/backgrounds/adiyogi-bg-1.jpg')} />
```

---

## Accessibility Testing

### 1. Automated Accessibility Tests

```bash
# Install axe-core
pnpm add -D @axe-core/playwright

# Run accessibility tests
npx playwright test --grep accessibility
```

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage should be accessible', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await injectAxe(page);
  await checkA11y(page);
});
```

### 2. Manual Accessibility Checklist

- [ ] All images have alt text
- [ ] Buttons have aria-labels
- [ ] Form inputs have labels
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] No keyboard traps

### 3. Keyboard Navigation Test

```
Tab: Move forward through interactive elements
Shift+Tab: Move backward
Enter/Space: Activate buttons and links
Escape: Close modals and dropdowns
Arrow keys: Navigate within components
```

---

## Security Testing

### 1. Security Checklist

- [ ] HTTPS enabled
- [ ] CSRF protection enabled
- [ ] XSS protection enabled
- [ ] SQL injection prevention (parameterized queries)
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] Secure password hashing
- [ ] Environment variables secured
- [ ] Dependencies up to date
- [ ] Security headers configured

### 2. Security Headers

```typescript
// server/index.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 3. Dependency Scanning

```bash
# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit fix

# Use Snyk for continuous monitoring
npm install -g snyk
snyk test
snyk monitor
```

---

## Browser Compatibility Testing

### Test Matrix

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Tested |
| Firefox | 88+ | ✅ Tested |
| Safari | 14+ | ✅ Tested |
| Edge | 90+ | ✅ Tested |
| Opera | 76+ | ⏳ To test |
| Mobile Safari | iOS 14+ | ⏳ To test |
| Chrome Mobile | Android 10+ | ⏳ To test |

### Cross-Browser Testing Tools

```bash
# BrowserStack (commercial)
# LambdaTest (commercial)
# Sauce Labs (commercial)

# Or use Playwright for local testing
npx playwright test --browser=chromium
npx playwright test --browser=firefox
npx playwright test --browser=webkit
```

---

## Mobile Testing

### Responsive Design Checklist

- [ ] Mobile navigation works
- [ ] Touch targets are 44x44px minimum
- [ ] Text is readable (16px minimum)
- [ ] Images scale properly
- [ ] Forms are easy to fill
- [ ] No horizontal scrolling
- [ ] Performance is acceptable
- [ ] Gestures work (swipe, pinch)

### Mobile Performance

```bash
# Test mobile performance with Lighthouse
lighthouse http://localhost:3000 --preset=mobile --output html
```

---

## Monitoring & Logging

### 1. Error Tracking (Sentry)

```typescript
// Install Sentry
pnpm add @sentry/react @sentry/tracing

// Initialize Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

// Wrap app with ErrorBoundary
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

### 2. Performance Monitoring

```typescript
// Track custom metrics
export function trackPerformance(metric: string, value: number) {
  if (window.performance && window.performance.mark) {
    window.performance.mark(metric);
  }
  
  // Send to analytics
  trackEvent('performance', metric, undefined, value);
}

// Usage
trackPerformance('checkout_complete', Date.now() - checkoutStartTime);
```

### 3. Logging

```typescript
// server/lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ⏳ To measure |
| Largest Contentful Paint | < 2.5s | ⏳ To measure |
| Time to Interactive | < 3.5s | ⏳ To measure |
| Cumulative Layout Shift | < 0.1 | ⏳ To measure |
| First Input Delay | < 100ms | ⏳ To measure |

### Measurement

```bash
# Run Lighthouse
lighthouse http://localhost:3000 --output json --output-path ./metrics.json

# Or use WebPageTest
# https://www.webpagetest.org/
```

---

## Optimization Checklist

### Frontend ✅
- [ ] Images optimized and lazy loaded
- [ ] Code split by route
- [ ] Bundle size < 500KB
- [ ] CSS purged of unused styles
- [ ] Animations optimized
- [ ] Dark mode implemented
- [ ] Service worker for caching

### Backend ✅
- [ ] Database queries optimized
- [ ] Caching implemented
- [ ] API responses paginated
- [ ] Compression enabled
- [ ] Rate limiting configured
- [ ] Database indexes created

### Infrastructure ✅
- [ ] CDN configured
- [ ] HTTP/2 enabled
- [ ] Gzip/Brotli compression
- [ ] SSL certificate installed
- [ ] Monitoring set up
- [ ] Backups automated

---

## Testing Commands

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run e2e tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage

# Run accessibility tests
pnpm test:a11y

# Run performance tests
pnpm test:perf

# Lint code
pnpm lint

# Type check
pnpm check
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Run build
        run: pnpm build
      
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: http://localhost:3000
          uploadArtifacts: true
```

---

*For deployment, see `DEPLOYMENT_PLATFORMS.md`*  
*For features, see `FEATURE_DEVELOPMENT_PLAN.md`*  
*For database setup, see next phase documentation*
