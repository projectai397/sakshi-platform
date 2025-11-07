# Sakshi Platform Demo Guide

This guide provides a complete walkthrough of all features available in the Sakshi platform demo.

## Quick Start

1. **Access the Demo:** Visit `/demo` to see the feature showcase
2. **Seed the Database:** Run `npm run seed` to populate with sample data
3. **Explore Features:** Follow the guided tour below

## Demo Credentials

### Admin Account
- **Email:** admin@sakshi.org
- **Password:** (Set during first login)
- **Access:** Full platform administration

### Sample Users
- **Priya Sharma** (priya@example.com) - Active seller
- **Raj Kumar** (raj@example.com) - Active buyer
- **Anita Patel** (anita@example.com) - Volunteer

## Feature Walkthrough

### 1. Triple Pricing System

**Location:** Any product page

**What to Demo:**
- View a product and see three pricing options:
  - **Money:** Standard price (₹500-₹3000)
  - **Seva Tokens:** Discounted price (50-300 tokens)
  - **Request Free:** Dignity-centered free option

**Try It:**
1. Go to `/shop`
2. Click on "Vintage Denim Jacket"
3. See all three pricing options displayed
4. Add to cart using different payment methods

### 2. AI Visual Search

**Location:** `/shop` (search bar with camera icon)

**What to Demo:**
- Upload a photo of clothing/item
- AI finds visually similar products
- Results ranked by similarity

**Try It:**
1. Click the camera icon in search
2. Upload an image (or use webcam)
3. View AI-powered similar product recommendations

### 3. Digital Product Passports (DPP)

**Location:** Any product detail page

**What to Demo:**
- Complete product lifecycle history
- Environmental impact metrics
- Blockchain verification
- Ownership timeline

**Try It:**
1. View any product
2. Scroll to "Digital Product Passport" section
3. See CO₂ saved, water saved, impact score
4. View ownership history and repairs

### 4. Personalized Recommendations

**Location:** Homepage (when logged in)

**What to Demo:**
- AI learns from browsing history
- Personalized product suggestions
- "You may also like" sections

**Try It:**
1. Log in as a user
2. Browse several products
3. Return to homepage
4. See personalized recommendations

### 5. Seva Token Economy

**Location:** `/seva-wallet`

**What to Demo:**
- Earn tokens through volunteering
- Spend tokens on products
- Transaction history
- Balance tracking

**Try It:**
1. Go to seva wallet
2. View current balance (50-100 tokens)
3. See transaction history
4. Volunteer to earn more tokens

### 6. SakshiCoin (SAK) Rewards

**Location:** `/sak-wallet`

**What to Demo:**
- Earn SAK for quality listings
- Stake SAK for governance
- Transfer SAK to other users
- Reward multipliers

**Try It:**
1. Go to SAK wallet
2. View balance and earning history
3. Try staking tokens
4. See reward rates for different actions

### 7. AI Dynamic Pricing

**Location:** Admin dashboard → Pricing Analytics

**What to Demo:**
- ML-powered price optimization
- Demand-based pricing
- Automatic price adjustments
- Revenue impact tracking

**Try It:**
1. Log in as admin
2. Go to pricing dashboard
3. View AI price recommendations
4. Apply recommended prices

### 8. Fraud Detection

**Location:** Admin dashboard → Security

**What to Demo:**
- Real-time fraud monitoring
- Suspicious activity alerts
- User risk scores
- Automated blocking

**Try It:**
1. Admin dashboard → Security
2. View fraud detection logs
3. See risk scores for transactions
4. Review flagged activities

### 9. Repair Café

**Location:** `/repair-cafe`

**What to Demo:**
- Submit repair requests
- Find upcoming events
- Earn tokens for repairs
- Track environmental impact

**Try It:**
1. Go to repair café page
2. View upcoming events
3. Submit a repair request
4. See tokens earned for repairs

### 10. Sakshi Cafés

**Location:** `/cafes` and `/cafe-locations`

**What to Demo:**
- Women's cooperative model
- Café locations map
- Organic food offerings
- Community impact

**Try It:**
1. Browse café locations
2. View cooperative structure
3. See menu and offerings
4. Learn about social impact

## Sample Data Overview

The seeded database includes:

- **5 Categories:** Clothing, Electronics, Books, Furniture, Toys
- **12 Products:** Various items across categories
- **5 Users:** Admin + 4 sample users
- **Seva Wallets:** All users have tokens
- **SAK Wallets:** All users have SAK balance
- **3 Cafés:** Coimbatore, Bengaluru, Delhi
- **3 Retreats:** Various programs
- **Sample Orders:** Completed and pending
- **Transactions:** Seva and SAK transaction history

## Demo Script (5-Minute Pitch)

### Minute 1: Introduction
"Sakshi is an AI-powered circular economy platform that makes sustainable shopping accessible to everyone through our unique triple pricing system."

### Minute 2: Core Innovation
"Every product has three prices: pay what you can afford, use seva tokens earned through volunteering, or request it for free. No questions asked."

### Minute 3: AI Features
"15 AI features power the platform: visual search lets you upload photos to find items, dynamic pricing optimizes revenue, and fraud detection keeps everyone safe."

### Minute 4: Blockchain Trust
"Every product gets a Digital Product Passport - an NFT that tracks its complete lifecycle. You can see exactly how much CO₂ and water you're saving."

### Minute 5: Social Impact
"Users earn SakshiCoin tokens for quality listings and community engagement. It's not just a marketplace - it's a movement toward conscious consumption."

## Testing Checklist

- [ ] Browse products with all three pricing options
- [ ] Upload image for visual search
- [ ] View Digital Product Passport
- [ ] Check personalized recommendations
- [ ] Use seva tokens for purchase
- [ ] View SAK wallet and rewards
- [ ] Submit repair request
- [ ] Browse café locations
- [ ] Admin: View pricing analytics
- [ ] Admin: Check fraud detection
- [ ] Complete a full purchase flow
- [ ] Test mobile responsiveness

## Common Demo Questions

**Q: How do you prevent abuse of the free option?**
A: We use AI fraud detection and community trust scores. Plus, our philosophy is dignity over suspicion.

**Q: How does the blockchain integration work?**
A: Each product gets an ERC721 NFT on Polygon. It's eco-friendly and low-cost.

**Q: What's the business model?**
A: Small commission on sales, premium features for sellers, and corporate partnerships for impact measurement.

**Q: How accurate is the AI visual search?**
A: We use OpenAI's CLIP model with 90%+ accuracy on similar items.

**Q: Can this scale globally?**
A: Absolutely. The platform is built on modern, scalable infrastructure and supports multiple languages and currencies.

## Next Steps After Demo

1. **Deploy to Production:** Use Railway deployment guide
2. **Train AI Models:** Run with real user data
3. **Deploy Smart Contracts:** Launch on Polygon mainnet
4. **Marketing Launch:** Use provided marketing materials
5. **Monitor & Iterate:** Track metrics and improve

---

**Demo URL:** `/demo`  
**Admin Dashboard:** `/admin`  
**API Docs:** `/api/docs`

Ready to showcase the future of conscious commerce! 🌱✨
