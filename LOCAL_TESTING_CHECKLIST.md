# Sakshi Platform - Local Testing Checklist

## 🧪 Comprehensive Testing Guide

This checklist ensures all features of the Sakshi platform are working correctly in your local environment.

---

## 🚀 Quick Start

### Automated Setup

```bash
cd /path/to/sakshi
./scripts/test-local.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Set up environment
- ✅ Create database
- ✅ Seed sample data
- ✅ Build project
- ✅ Start dev server

### Manual Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
pnpm db:push
pnpm db:seed  # Optional

# Start development server
pnpm dev
```

---

## ✅ Testing Checklist

### 1. Basic Functionality

#### Homepage (/)
- [ ] Page loads without errors
- [ ] Adiyogi Ghibli background displays
- [ ] Hero section visible
- [ ] Navigation menu works
- [ ] All links functional
- [ ] Animations play smoothly
- [ ] Responsive on mobile/tablet/desktop

#### Navigation
- [ ] All menu items clickable
- [ ] Links navigate correctly
- [ ] Active page highlighted
- [ ] Mobile menu works
- [ ] Logo links to homepage

---

### 2. Design & Aesthetics

#### Adiyogi Backgrounds
- [ ] Homepage: Devotional scene
- [ ] Shop: Spiritual seeker
- [ ] Cafes: Mountain landscape
- [ ] Retreats: Forest meditation
- [ ] Meditate: Tranquil nature
- [ ] All other pages have appropriate backgrounds

#### Animations
- [ ] Fade-in animations work
- [ ] Slide-in animations smooth
- [ ] Hover effects on buttons
- [ ] Hover effects on cards
- [ ] Scroll reveal animations
- [ ] Loading animations display

#### Dark Mode
- [ ] Dark mode toggle works
- [ ] All pages support dark mode
- [ ] Text readable in dark mode
- [ ] Images visible in dark mode
- [ ] Smooth transition between modes
- [ ] Preference persists on reload

#### Themes
- [ ] Light theme works
- [ ] Dark theme works
- [ ] Theme selector accessible
- [ ] Theme changes apply immediately
- [ ] Theme preference saved

---

### 3. E-commerce Features

#### Product Catalog (/shop)
- [ ] Products load correctly
- [ ] Product images display
- [ ] Product details visible
- [ ] Prices shown correctly
- [ ] Categories filter works
- [ ] Search functionality works
- [ ] Pagination works (if applicable)

#### Product Details (/product/:id)
- [ ] Product page loads
- [ ] All product information visible
- [ ] Images display properly
- [ ] Add to cart button works
- [ ] Quantity selector works
- [ ] Related products show

#### Shopping Cart (/cart)
- [ ] Cart page accessible
- [ ] Cart items display
- [ ] Quantity can be changed
- [ ] Items can be removed
- [ ] Subtotal calculates correctly
- [ ] Proceed to checkout works

#### Checkout (/checkout)
- [ ] Checkout page loads
- [ ] Shipping form works
- [ ] Payment method selection
- [ ] Triple pricing options visible:
  - [ ] Pay with money
  - [ ] Pay with seva tokens
  - [ ] Request as donation (free)
- [ ] Order summary correct
- [ ] Place order button works

---

### 4. Seva Token System

#### Seva Wallet (/seva-wallet)
- [ ] Wallet page loads
- [ ] Current balance displays
- [ ] Transaction history shows
- [ ] Earn tokens section visible
- [ ] Spend tokens section visible

#### Earning Tokens
- [ ] Donation option works
- [ ] Volunteering registration works
- [ ] Referral link generation works
- [ ] Tokens credited correctly

#### Spending Tokens
- [ ] Can pay with tokens at checkout
- [ ] Token balance updates
- [ ] Transaction recorded

---

### 5. Spiritual Features

#### Retreats (/retreats)
- [ ] Retreats page loads
- [ ] Retreat listings display
- [ ] Retreat details accessible
- [ ] Booking form works
- [ ] Images and descriptions visible

#### Cafés (/cafes)
- [ ] Cafés page loads
- [ ] Café listings display
- [ ] Location information visible
- [ ] Map displays (if implemented)
- [ ] Contact information shown

#### Meditation (/meditate)
- [ ] Meditation page loads
- [ ] Meditation guides available
- [ ] Audio/video players work (if applicable)
- [ ] Timer functionality works (if applicable)

---

### 6. User Account

#### Registration (/register)
- [ ] Registration form displays
- [ ] Form validation works
- [ ] Email validation works
- [ ] Password requirements shown
- [ ] Registration successful
- [ ] Confirmation message displays

#### Login (/login)
- [ ] Login form displays
- [ ] Email/password login works
- [ ] OAuth login works (if configured)
- [ ] Remember me option works
- [ ] Forgot password link works
- [ ] Redirect after login works

#### Profile (/profile)
- [ ] Profile page loads
- [ ] User information displays
- [ ] Edit profile works
- [ ] Avatar upload works (if implemented)
- [ ] Password change works
- [ ] Preferences can be updated

#### Orders (/orders)
- [ ] Orders page loads
- [ ] Order history displays
- [ ] Order details accessible
- [ ] Order status visible
- [ ] Tracking information shown (if applicable)

---

### 7. Admin Features

#### Admin Dashboard (/admin)
- [ ] Dashboard accessible (admin only)
- [ ] Statistics display
- [ ] Recent orders shown
- [ ] User count visible
- [ ] Revenue metrics shown

#### Product Management
- [ ] Product list loads
- [ ] Add new product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Image upload works
- [ ] Category assignment works

#### Order Management
- [ ] Order list loads
- [ ] Order details accessible
- [ ] Order status can be updated
- [ ] Order fulfillment works

#### User Management
- [ ] User list loads
- [ ] User details accessible
- [ ] User roles can be changed
- [ ] User can be deactivated

---

### 8. Search & Filters

#### Search
- [ ] Search bar visible
- [ ] Search results display
- [ ] Search by product name works
- [ ] Search by category works
- [ ] Search by keywords works
- [ ] No results message shows

#### Filters
- [ ] Category filter works
- [ ] Price range filter works
- [ ] Condition filter works
- [ ] Sort by price works
- [ ] Sort by date works
- [ ] Clear filters works

---

### 9. Responsive Design

#### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All elements visible
- [ ] No horizontal scroll
- [ ] Images properly sized
- [ ] Text readable

#### Laptop (1366x768)
- [ ] Layout adapts correctly
- [ ] Navigation works
- [ ] Images scale properly
- [ ] No overflow issues

#### Tablet (768x1024)
- [ ] Mobile menu appears
- [ ] Touch targets adequate
- [ ] Images responsive
- [ ] Text readable
- [ ] Forms usable

#### Mobile (375x667)
- [ ] Mobile layout active
- [ ] Bottom navigation works (if implemented)
- [ ] Touch gestures work
- [ ] Images optimized
- [ ] Text readable
- [ ] Forms easy to fill

---

### 10. Performance

#### Load Times
- [ ] Homepage loads < 3 seconds
- [ ] Product pages load < 2 seconds
- [ ] Images load progressively
- [ ] No layout shift
- [ ] Smooth scrolling

#### Animations
- [ ] Animations smooth (60fps)
- [ ] No janky animations
- [ ] Hover effects instant
- [ ] Transitions smooth

#### Memory
- [ ] No memory leaks
- [ ] Browser doesn't slow down
- [ ] Can navigate for extended periods

---

### 11. Accessibility

#### Keyboard Navigation
- [ ] Can tab through all elements
- [ ] Focus indicators visible
- [ ] Enter key activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys work in menus

#### Screen Reader
- [ ] Alt text on images
- [ ] ARIA labels present
- [ ] Semantic HTML used
- [ ] Form labels associated
- [ ] Error messages announced

#### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Links distinguishable
- [ ] Buttons have sufficient contrast
- [ ] Dark mode has good contrast

---

### 12. Browser Compatibility

#### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Animations smooth
- [ ] Layout correct

#### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Animations smooth
- [ ] Layout correct

#### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Animations smooth
- [ ] Layout correct

#### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Animations smooth
- [ ] Layout correct

---

### 13. Error Handling

#### Network Errors
- [ ] Offline message displays
- [ ] Retry mechanism works
- [ ] Graceful degradation

#### Form Errors
- [ ] Validation errors show
- [ ] Error messages clear
- [ ] Fields highlighted
- [ ] Can correct and resubmit

#### 404 Pages
- [ ] 404 page displays
- [ ] Navigation still works
- [ ] Link back to home

#### Server Errors
- [ ] Error message displays
- [ ] User not stuck
- [ ] Can recover gracefully

---

### 14. Security

#### Authentication
- [ ] Protected routes redirect to login
- [ ] Session persists correctly
- [ ] Logout clears session
- [ ] CSRF protection works

#### Authorization
- [ ] Admin routes protected
- [ ] Users can't access others' data
- [ ] API endpoints secured

#### Input Validation
- [ ] XSS prevention works
- [ ] SQL injection prevented
- [ ] File upload restrictions work

---

### 15. Console & Network

#### Console
- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] No 404s for assets
- [ ] No CORS errors

#### Network
- [ ] API calls successful
- [ ] Reasonable payload sizes
- [ ] Proper HTTP status codes
- [ ] Headers correct

---

## 📊 Testing Report Template

After testing, fill out this report:

```markdown
# Sakshi Platform - Testing Report

**Date:** [Date]
**Tester:** [Your Name]
**Environment:** Local Development
**Browser:** [Browser Name & Version]
**OS:** [Operating System]

## Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Skipped: [Number]

## Critical Issues
1. [Issue description]
2. [Issue description]

## Minor Issues
1. [Issue description]
2. [Issue description]

## Observations
- [General observations]

## Recommendations
- [Recommendations for improvement]

## Screenshots
[Attach screenshots of issues]

## Next Steps
- [ ] Fix critical issues
- [ ] Address minor issues
- [ ] Retest failed items
```

---

## 🔧 Common Issues & Solutions

### Issue: Dependencies won't install
**Solution:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Database connection fails
**Solution:**
- Check DATABASE_URL in .env
- Ensure database file has write permissions
- Try: `pnpm db:push --force`

### Issue: Port 3000 already in use
**Solution:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Issue: Build fails
**Solution:**
```bash
# Clear build cache
rm -rf dist .vite

# Rebuild
pnpm build
```

### Issue: Hot reload not working
**Solution:**
- Check file watcher limits (Linux)
- Restart dev server
- Clear browser cache

---

## 📈 Performance Testing

### Lighthouse Audit
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### Bundle Analysis
```bash
# Analyze bundle size
pnpm build
pnpm analyze  # If configured
```

---

## ✅ Sign-Off

Once all tests pass:

- [ ] All critical features working
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Responsive on all devices
- [ ] Accessible
- [ ] Ready for deployment

**Tested By:** _______________  
**Date:** _______________  
**Signature:** _______________

---

*For deployment, see DEPLOYMENT_CHECKLIST.md*  
*For guides, see COMPLETE_GUIDE_INDEX.md*
