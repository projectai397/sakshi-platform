# Sakshi Platform - Local Development Guide

## Overview

This guide walks you through running and testing the Sakshi platform on your local machine.

**What You'll Do:**
- ✅ Set up the development environment
- ✅ Run the development server
- ✅ Test all features and pages
- ✅ See Adiyogi backgrounds in action
- ✅ Try animations and dark mode
- ✅ Explore the seva token system

**Estimated Time**: 10-15 minutes

---

## Prerequisites

Ensure you have installed:
- [ ] Node.js 22+ ([nodejs.org](https://nodejs.org))
- [ ] pnpm (`npm install -g pnpm`)
- [ ] Git
- [ ] Code editor (VS Code recommended)

---

## Step 1: Navigate to Project

```bash
cd /home/ubuntu/sakshi
```

Or if you extracted the archive:

```bash
tar -xzf sakshi-complete.tar.gz
cd sakshi
```

---

## Step 2: Install Dependencies

```bash
# Install all dependencies
pnpm install

# This will install:
# - React, TypeScript, Vite
# - tRPC, Drizzle ORM
# - Tailwind CSS
# - And 200+ other packages
```

**Expected output:**
```
Packages: +XXX
Progress: resolved XXX, reused XXX, downloaded XX
Done in Xs
```

---

## Step 3: Set Up Database

The project is already configured with SQLite for development.

```bash
# Push schema to database (creates dev.db file)
pnpm db:push
```

**Expected output:**
```
✓ Database schema pushed successfully
```

---

## Step 4: Seed Database with Sample Data

```bash
# Run the seed script
pnpm tsx scripts/seed-database.ts
```

**Expected output:**
```
🌱 Seeding database...
Clearing existing data...
✓ Existing data cleared

Seeding categories...
✓ Seeded 6 categories

Seeding users...
✓ Seeded 5 users

Seeding seva wallets...
✓ Seeded 5 seva wallets

Seeding products...
✓ Seeded 12 products

Seeding cafes...
✓ Seeded 3 cafes

Seeding retreats...
✓ Seeded 3 retreats

Seeding orders...
✓ Seeded 3 orders

✅ Database seeding completed successfully!
```

---

## Step 5: Start Development Server

```bash
# Start the dev server
pnpm dev
```

**Expected output:**
```
> sakshi@1.0.0 dev
> NODE_ENV=development tsx watch server/_core/index.ts

Server running on http://localhost:3000
```

**The server will:**
- Start on port 3000
- Watch for file changes
- Auto-reload on changes
- Show compilation errors in terminal

---

## Step 6: Open in Browser

1. Open your browser
2. Navigate to: **http://localhost:3000**
3. You should see the Sakshi homepage with the beautiful Adiyogi background!

---

## Step 7: Test All Pages

### Homepage
- [ ] Adiyogi background loads (adiyogi-bg-1)
- [ ] Hero section displays
- [ ] Navigation menu works
- [ ] Animations play smoothly
- [ ] Footer displays

### Shop Page
- [ ] Navigate to `/shop`
- [ ] Products display in grid
- [ ] Filters work (category, price, condition)
- [ ] Search functionality works
- [ ] "Add to Cart" buttons work
- [ ] Background displays (adiyogi-bg-3)

### Product Detail
- [ ] Click on any product
- [ ] Product details display
- [ ] Images load
- [ ] Price shows (both money and seva tokens)
- [ ] "Add to Cart" works
- [ ] Background displays (adiyogi-bg-4)

### Shopping Cart
- [ ] Click cart icon in navigation
- [ ] Cart items display
- [ ] Quantity can be updated
- [ ] Items can be removed
- [ ] Total calculates correctly
- [ ] "Proceed to Checkout" works
- [ ] Background displays (adiyogi-bg-3)

### Checkout
- [ ] Fill in shipping address
- [ ] Select payment method (Money/Seva/Free)
- [ ] Order summary displays
- [ ] "Place Order" button works
- [ ] Background displays (adiyogi-bg-4)

### Seva Wallet
- [ ] Navigate to `/seva-wallet`
- [ ] Balance displays
- [ ] Transaction history shows
- [ ] Animations work
- [ ] Background displays (adiyogi-bg-nature)

### About Page
- [ ] Navigate to `/about`
- [ ] Content displays
- [ ] Background displays (adiyogi-bg-2)
- [ ] Animations work

### Cafes
- [ ] Navigate to `/cafes`
- [ ] Cafe cards display
- [ ] Map shows locations
- [ ] Background displays (adiyogi-bg-mountain)

### Retreats
- [ ] Navigate to `/retreats`
- [ ] Retreat cards display
- [ ] Booking buttons work
- [ ] Background displays (adiyogi-bg-forest)

### Meditation
- [ ] Navigate to `/meditate`
- [ ] Content displays
- [ ] Background displays (adiyogi-bg-nature)

### Circular Economy
- [ ] Navigate to `/circular-economy`
- [ ] Information displays
- [ ] Background displays (adiyogi-bg-1)

### Repair Café
- [ ] Navigate to `/repair-cafe`
- [ ] Information displays
- [ ] Background displays (adiyogi-bg-sunset)

### Volunteer
- [ ] Navigate to `/volunteer`
- [ ] Sign-up form displays
- [ ] Background displays (adiyogi-bg-2)

---

## Step 8: Test Animations

### Page Load Animations
- [ ] Elements fade in on page load
- [ ] Staggered animations work
- [ ] Smooth transitions

### Hover Effects
- [ ] Cards lift on hover
- [ ] Buttons change on hover
- [ ] Images scale on hover
- [ ] Smooth transitions

### Scroll Animations
- [ ] Elements reveal on scroll
- [ ] Parallax backgrounds (if enabled)
- [ ] Smooth scrolling

### Loading States
- [ ] Skeleton loaders display while loading
- [ ] Spinners show for async operations
- [ ] Smooth state transitions

---

## Step 9: Test Dark Mode

### Toggle Dark Mode
1. Look for the theme toggle button (bottom right)
2. Click to switch between light and dark mode
3. Verify smooth transition

### Dark Mode Checklist
- [ ] Background colors change
- [ ] Text remains readable
- [ ] Cards have proper contrast
- [ ] Buttons styled correctly
- [ ] Images adjust brightness
- [ ] Adiyogi backgrounds still visible
- [ ] Animations still work

### System Preference
- [ ] Change OS theme to dark
- [ ] Refresh page
- [ ] App should match OS theme

---

## Step 10: Test Responsive Design

### Desktop (1920px+)
- [ ] Full layout displays
- [ ] All columns visible
- [ ] Backgrounds cover fully
- [ ] Navigation horizontal

### Tablet (768px - 1919px)
- [ ] Layout adapts
- [ ] Content readable
- [ ] Touch-friendly buttons
- [ ] Navigation adapts

### Mobile (320px - 767px)
- [ ] Single column layout
- [ ] Hamburger menu
- [ ] Touch targets 44px+
- [ ] Text readable (16px min)
- [ ] No horizontal scroll
- [ ] Backgrounds optimized

**Test using browser DevTools:**
1. Press F12
2. Click device toolbar icon
3. Select different devices
4. Test all pages

---

## Step 11: Test Features

### Shopping Flow
1. [ ] Browse products
2. [ ] Add 3 items to cart
3. [ ] Update quantities
4. [ ] Remove one item
5. [ ] Proceed to checkout
6. [ ] Fill address
7. [ ] Select payment method
8. [ ] Place order
9. [ ] See confirmation

### Seva Token Flow
1. [ ] Check initial balance
2. [ ] View transaction history
3. [ ] Earn tokens (simulate donation)
4. [ ] Spend tokens on purchase
5. [ ] Check updated balance

### Search & Filter
1. [ ] Search for "yoga"
2. [ ] Filter by category "Books"
3. [ ] Filter by price range
4. [ ] Filter by condition "Excellent"
5. [ ] Clear filters

---

## Step 12: Check Console for Errors

### Open Browser Console
1. Press F12
2. Go to "Console" tab
3. Look for errors (red text)

### Expected Logs
- ✅ No errors
- ✅ Maybe some warnings (acceptable)
- ✅ tRPC queries logging (in development)

### Common Warnings (Safe to Ignore)
- React DevTools warnings
- Development-only warnings
- Third-party library warnings

---

## Development Workflow

### Making Changes

```bash
# 1. Make changes to code
# 2. Save file
# 3. Server auto-reloads
# 4. Browser auto-refreshes (with Vite HMR)
```

### Adding New Features

```bash
# 1. Create new component
touch client/src/components/MyComponent.tsx

# 2. Import and use
# 3. Test in browser
# 4. Commit changes
git add .
git commit -m "Add MyComponent"
```

### Database Changes

```bash
# 1. Modify schema in server/db/schema.ts
# 2. Push changes
pnpm db:push

# 3. Re-seed if needed
pnpm tsx scripts/seed-database.ts
```

---

## Useful Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server (after build)
pnpm start

# Type check
pnpm check

# Format code
pnpm format

# View database in GUI
pnpm db:studio

# Push database schema
pnpm db:push

# Seed database
pnpm tsx scripts/seed-database.ts

# Run tests (if configured)
pnpm test
```

---

## Debugging Tips

### Server Not Starting

**Error**: Port 3000 already in use

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Database Errors

**Error**: Table not found

**Solution**:
```bash
# Reset and recreate database
rm dev.db
pnpm db:push
pnpm tsx scripts/seed-database.ts
```

### Build Errors

**Error**: TypeScript errors

**Solution**:
```bash
# Check for type errors
pnpm check

# Fix errors in code
# Then rebuild
pnpm build
```

### Hot Reload Not Working

**Solution**:
```bash
# Restart dev server
# Ctrl+C to stop
pnpm dev
```

---

## Browser DevTools

### Inspect Elements
- Right-click → Inspect
- View HTML structure
- Check CSS styles
- Test responsive design

### Network Tab
- View API requests
- Check response times
- Debug failed requests
- Monitor file sizes

### Performance Tab
- Record page load
- Analyze bottlenecks
- Check FPS
- Measure metrics

### Application Tab
- View localStorage
- Check cookies
- Inspect IndexedDB
- Test service workers

---

## VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

---

## Testing Checklist

### Functionality
- [ ] All pages load
- [ ] Navigation works
- [ ] Forms submit
- [ ] Buttons clickable
- [ ] Links work
- [ ] Images load

### Design
- [ ] Backgrounds display
- [ ] Animations smooth
- [ ] Dark mode works
- [ ] Responsive layout
- [ ] Typography readable
- [ ] Colors consistent

### Performance
- [ ] Page loads < 3s
- [ ] No layout shifts
- [ ] Smooth scrolling
- [ ] Fast interactions
- [ ] No memory leaks

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader compatible
- [ ] Sufficient contrast
- [ ] Alt text on images
- [ ] ARIA labels

---

## Next Steps

After local testing:

1. ✅ **Fix any issues** found during testing
2. ✅ **Commit changes** to git
3. ✅ **Deploy to Railway** (or other platform)
4. ✅ **Configure external services** (OAuth, S3)
5. ✅ **Implement additional features** (payments, AI)
6. ✅ **Set up monitoring** (Sentry, analytics)

---

## Stopping the Server

```bash
# Press Ctrl+C in terminal
# Or close terminal window
```

---

## Troubleshooting

### Issue: White screen

**Cause**: JavaScript error

**Solution**:
1. Check browser console for errors
2. Fix the error in code
3. Refresh browser

### Issue: Styles not loading

**Cause**: CSS not compiled

**Solution**:
```bash
# Restart dev server
pnpm dev
```

### Issue: Database empty

**Cause**: Not seeded

**Solution**:
```bash
pnpm tsx scripts/seed-database.ts
```

---

## Performance Tips

### Optimize Images
- Use WebP format
- Compress images
- Lazy load below fold
- Use appropriate sizes

### Code Splitting
- Lazy load routes
- Dynamic imports
- Tree shaking

### Caching
- Browser cache
- Service workers
- CDN for assets

---

## Congratulations! 🎉

You've successfully run and tested the Sakshi platform locally!

**What You've Tested:**
- ✅ All 29+ pages
- ✅ Adiyogi Ghibli backgrounds
- ✅ Advanced animations
- ✅ Dark mode
- ✅ Responsive design
- ✅ Shopping flow
- ✅ Seva token system

**Next**: Configure external services (OAuth, S3, Email)

---

*For deployment, see `RAILWAY_DEPLOYMENT_GUIDE.md`*  
*For configuration, see `ENVIRONMENT_SETUP.md`*  
*For features, see `FEATURE_DEVELOPMENT_PLAN.md`*
