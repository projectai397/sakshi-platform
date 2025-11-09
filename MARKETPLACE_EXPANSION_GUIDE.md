# Sakshi Platform - Marketplace Expansion Guide

**Date**: November 9, 2025  
**Purpose**: Transform Sakshi into a comprehensive multi-vendor marketplace with advanced features

---

## Overview

The Marketplace Expansion adds powerful e-commerce capabilities:
- **Multi-Vendor System** - Third-party sellers can list products
- **Reviews & Ratings** - Build trust through customer feedback
- **Wishlists & Favorites** - Help customers save and organize
- **Smart Recommendations** - AI-powered personalization
- **Promotions & Discounts** - Marketing and sales tools
- **Customer Support** - Ticketing system for help requests

---

## Database Schema (13 Tables)

### Vendor Management (2 Tables)

**1. vendors** - Vendor profiles and business information
- Business details and contact info
- Bank details for payouts
- Commission rates
- Sustainability badges (organic, local, fair trade, women-owned)
- Performance metrics (sales, orders, rating)

**2. vendor_products** - Products sold by vendors
- Product details and pricing
- Inventory management
- Media (images, videos)
- Sustainability attributes
- Sales metrics

### Reviews & Ratings (2 Tables)

**3. product_reviews** - Customer reviews
- 1-5 star ratings
- Review text and images
- Helpful votes
- Moderation workflow
- Vendor responses

**4. review_votes** - Helpfulness voting
- Track which users found reviews helpful
- Prevent duplicate votes

### Wishlists (2 Tables)

**5. wishlists** - User wishlist collections
- Multiple wishlists per user
- Public/private sharing
- Default wishlist

**6. wishlist_items** - Items in wishlists
- Priority levels
- Personal notes

### Notifications (2 Tables)

**7. price_alerts** - Price drop notifications
- Set target price
- Auto-notify when reached

**8. stock_alerts** - Back-in-stock notifications
- Email when item available again

### Recommendations (2 Tables)

**9. user_preferences** - Personalization settings
- Shopping preferences
- Sustainability preferences
- Dietary preferences
- Notification settings

**10. product_views** - View tracking
- Track what users view
- Duration of views
- Powers recommendations

### Promotions (2 Tables)

**11. discount_codes** - Promo codes
- Percentage or fixed amount discounts
- Usage limits
- Date ranges
- Product/category restrictions

**12. discount_usage** - Track code usage
- Prevent over-use
- Analytics on promotions

### Customer Support (2 Tables)

**13. support_tickets** - Help requests
- Categorized tickets
- Priority levels
- Assignment to staff
- Status tracking

**14. ticket_messages** - Ticket conversations
- Customer and staff messages
- File attachments

---

## Key Features

### 1. Vendor Onboarding

**Application Process**:
1. Vendor submits application with business details
2. Admin reviews and verifies information
3. Vendor sets up bank details for payouts
4. Vendor can start listing products

**Vendor Dashboard**:
- Sales analytics
- Order management
- Product inventory
- Customer reviews
- Payout history

**Commission Structure**:
- Default: 10% commission on sales
- Adjustable per vendor
- Transparent fee structure

### 2. Product Listings

**Vendor Can**:
- Add unlimited products
- Upload multiple images and videos
- Set pricing and inventory
- Mark sustainability attributes
- Track sales and views

**Product Attributes**:
- Organic certification
- Handmade
- Eco-friendly
- Local sourcing
- Fair trade

### 3. Review System

**Features**:
- Verified purchase reviews only
- 1-5 star ratings
- Photo/video reviews
- Helpful voting
- Vendor can respond
- Moderation queue

**Trust Building**:
- Aggregate ratings displayed
- Recent reviews highlighted
- Verified badge for real purchases

### 4. Smart Recommendations

**Recommendation Engine**:
- Based on browsing history
- Purchase history
- Similar products
- Trending items
- Personalized to user preferences

**Algorithm Factors**:
- View duration
- Category preferences
- Price range
- Sustainability preferences
- Seasonal relevance

### 5. Wishlist & Favorites

**User Benefits**:
- Save items for later
- Organize into collections
- Share wishlists publicly
- Get price drop alerts
- Stock availability notifications

**Use Cases**:
- Gift registries
- Wedding wishlists
- Seasonal shopping lists
- Aspiration boards

### 6. Promotions & Marketing

**Discount Types**:
- Percentage off (e.g., 20% off)
- Fixed amount (e.g., ₹100 off)
- Free shipping
- Buy X Get Y

**Targeting**:
- Specific products
- Categories
- Minimum purchase amount
- First-time customers
- Loyal customers

**Usage Controls**:
- Total usage limit
- Per-user limit
- Date ranges
- One-time or recurring

### 7. Customer Support

**Ticket System**:
- Categorized requests
- Priority levels
- Assignment to staff
- Status tracking
- Response time SLAs

**Categories**:
- Order issues
- Product questions
- Payment problems
- Technical support
- General inquiries

---

## Workflows

### Vendor Onboarding Workflow

```
1. Vendor Registration
   ↓
2. Submit Application
   - Business details
   - Contact information
   - Bank details
   ↓
3. Admin Review
   - Verify information
   - Check credentials
   - Approve/Reject
   ↓
4. Vendor Activation
   - Account activated
   - Can list products
   ↓
5. First Product Listing
   - Add product details
   - Upload images
   - Set pricing
   ↓
6. Product Review
   - Admin reviews product
   - Approves for listing
   ↓
7. Product Goes Live
   - Visible to customers
   - Ready for sale
```

### Order Fulfillment Workflow

```
1. Customer Places Order
   ↓
2. Vendor Notified
   - Email notification
   - Dashboard alert
   ↓
3. Vendor Prepares Order
   - Update status: Processing
   - Pack items
   ↓
4. Vendor Ships Order
   - Update status: Shipped
   - Add tracking info
   ↓
5. Customer Receives Order
   - Update status: Delivered
   ↓
6. Customer Reviews Product
   - Leave rating and review
   ↓
7. Payout to Vendor
   - Commission deducted
   - Transfer to vendor account
```

### Review Moderation Workflow

```
1. Customer Submits Review
   ↓
2. Auto-Check for Spam
   - Profanity filter
   - Duplicate detection
   ↓
3. Moderation Queue
   - Staff reviews content
   - Checks authenticity
   ↓
4. Approve/Reject
   - Approved: Published
   - Rejected: Notify customer
   ↓
5. Vendor Notification
   - Alert about new review
   - Option to respond
   ↓
6. Vendor Response (Optional)
   - Address concerns
   - Thank customer
```

---

## API Endpoints

### Vendor Management

```typescript
// Register as vendor
POST /api/trpc/marketplace.vendors.register
{
  businessName: "Green Earth Crafts",
  contactName: "Priya Sharma",
  email: "priya@greenearth.com",
  phone: "+91-9876543210",
  businessType: "social_enterprise",
  description: "Handmade eco-friendly products..."
}

// List vendor products
GET /api/trpc/marketplace.vendors.products?vendorId=123

// Add product
POST /api/trpc/marketplace.vendors.addProduct
{
  name: "Bamboo Toothbrush Set",
  description: "Eco-friendly bamboo toothbrushes...",
  price: 299,
  stockQuantity: 100,
  isOrganic: true,
  isHandmade: true
}
```

### Reviews

```typescript
// Submit review
POST /api/trpc/marketplace.reviews.create
{
  productId: 456,
  productType: "vendor",
  rating: 5,
  title: "Excellent quality!",
  comment: "Love these toothbrushes...",
  images: ["url1.jpg", "url2.jpg"]
}

// Get product reviews
GET /api/trpc/marketplace.reviews.list?productId=456&productType=vendor

// Mark review helpful
POST /api/trpc/marketplace.reviews.vote
{
  reviewId: 789,
  isHelpful: true
}
```

### Wishlists

```typescript
// Create wishlist
POST /api/trpc/marketplace.wishlists.create
{
  name: "Wedding Registry",
  description: "Items for our new home",
  isPublic: true
}

// Add to wishlist
POST /api/trpc/marketplace.wishlists.addItem
{
  wishlistId: 10,
  productId: 456,
  productType: "vendor",
  priority: 2
}

// Get user wishlists
GET /api/trpc/marketplace.wishlists.list
```

### Promotions

```typescript
// Create discount code
POST /api/trpc/marketplace.discounts.create
{
  code: "WELCOME20",
  discountType: "percentage",
  discountValue: 20,
  minPurchaseAmount: 500,
  usageLimitPerUser: 1,
  startDate: "2025-11-01",
  endDate: "2025-12-31"
}

// Apply discount
POST /api/trpc/marketplace.discounts.apply
{
  code: "WELCOME20",
  cartTotal: 1000
}
// Returns: { valid: true, discountAmount: 200, finalTotal: 800 }
```

### Customer Support

```typescript
// Create support ticket
POST /api/trpc/marketplace.support.createTicket
{
  category: "order",
  subject: "Item not received",
  description: "I ordered 5 days ago but haven't received...",
  relatedOrderId: 12345
}

// Reply to ticket
POST /api/trpc/marketplace.support.replyToTicket
{
  ticketId: 100,
  message: "We're sorry to hear that. Let me check...",
  attachments: ["tracking.pdf"]
}

// Close ticket
POST /api/trpc/marketplace.support.closeTicket
{
  ticketId: 100,
  resolutionNotes: "Refund processed"
}
```

---

## Frontend Components

### Vendor Dashboard

```typescript
// components/marketplace/VendorDashboard.tsx
export function VendorDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <StatsCard title="Total Sales" value="₹45,230" />
      <StatsCard title="Orders" value="127" />
      <StatsCard title="Rating" value="4.8 ⭐" />
      
      {/* Recent Orders */}
      <RecentOrders />
      
      {/* Product Performance */}
      <ProductPerformance />
      
      {/* Reviews to Respond */}
      <PendingReviews />
    </div>
  );
}
```

### Product Reviews Component

```typescript
// components/marketplace/ProductReviews.tsx
export function ProductReviews({ productId, productType }) {
  const { data: reviews } = trpc.marketplace.reviews.list.useQuery({
    productId,
    productType
  });
  
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Customer Reviews</h3>
      
      {/* Rating Summary */}
      <RatingSummary reviews={reviews} />
      
      {/* Individual Reviews */}
      {reviews?.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
      
      {/* Write Review Button */}
      <WriteReviewButton productId={productId} />
    </div>
  );
}
```

### Wishlist Component

```typescript
// components/marketplace/Wishlist.tsx
export function Wishlist({ wishlistId }) {
  const { data: wishlist } = trpc.marketplace.wishlists.get.useQuery({
    id: wishlistId
  });
  
  return (
    <div>
      <h2>{wishlist.name}</h2>
      <p>{wishlist.description}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {wishlist.items.map(item => (
          <WishlistItemCard key={item.id} item={item} />
        ))}
      </div>
      
      <ShareWishlistButton wishlistId={wishlistId} />
    </div>
  );
}
```

---

## Business Model

### Revenue Streams

**1. Vendor Commissions**
- 10% commission on vendor sales
- Estimated: ₹50,000/month from 50 vendors

**2. Featured Listings**
- Vendors pay for prominent placement
- ₹500/product/month
- Estimated: ₹10,000/month

**3. Premium Vendor Accounts**
- Lower commission (8%)
- Priority support
- Advanced analytics
- ₹2,000/month per vendor

**4. Advertising**
- Sponsored products
- Banner ads
- Email promotions

### Vendor Benefits

**For Vendors**:
- Access to conscious consumers
- Low barrier to entry
- Marketing support
- Payment processing handled
- Analytics and insights

**For Platform**:
- Expanded product catalog
- More revenue streams
- Increased user engagement
- Community growth

---

## Sustainability Focus

### Vendor Badges

**Organic Certified**
- Products certified organic
- Verified documentation

**Locally Sourced**
- Within 100km radius
- Supports local economy

**Fair Trade**
- Fair wages to producers
- Ethical sourcing

**Women-Owned**
- Women entrepreneurs
- Economic empowerment

### Impact Tracking

**Metrics**:
- Number of sustainable products
- Percentage of organic sales
- Local vendor support
- Women-owned businesses supported

---

## Marketing Features

### Email Campaigns

**Automated Emails**:
- Welcome new vendors
- Order confirmations
- Shipping notifications
- Review requests
- Price drop alerts
- Back-in-stock notifications

### Social Sharing

**Wishlist Sharing**:
- Share on social media
- Generate shareable links
- Embed wishlists

**Product Sharing**:
- Share favorite products
- Referral tracking
- Social proof

---

## Analytics & Reporting

### Vendor Analytics

**Sales Dashboard**:
- Daily/weekly/monthly sales
- Best-selling products
- Revenue trends
- Customer demographics

**Product Performance**:
- Views vs purchases
- Conversion rate
- Average order value
- Return rate

### Platform Analytics

**Marketplace Metrics**:
- Total vendors
- Total products
- GMV (Gross Merchandise Value)
- Commission revenue
- Average order value

**Customer Insights**:
- Most viewed products
- Most wishlisted items
- Popular categories
- Search trends

---

## Security & Trust

### Vendor Verification

**Required Documents**:
- Business registration
- GST certificate
- PAN card
- Bank account proof

**Background Checks**:
- Business legitimacy
- Product authenticity
- Customer feedback history

### Fraud Prevention

**Measures**:
- Review authenticity checks
- Duplicate detection
- Suspicious activity monitoring
- Secure payment processing

---

## Future Enhancements

1. **Live Chat** - Real-time customer support
2. **Video Shopping** - Live product demos
3. **Subscription Boxes** - Curated monthly boxes
4. **Auction System** - Bidding on unique items
5. **Vendor Collaboration** - Joint product offerings
6. **Loyalty Program** - Points for purchases
7. **Influencer Marketplace** - Creator partnerships

---

**Building a conscious marketplace for sustainable commerce!** 🛍️🌿

*Last updated: November 9, 2025*
