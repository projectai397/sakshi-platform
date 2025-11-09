/**
 * Marketplace Expansion Schema
 * Vendor Management, Reviews, Wishlists, Recommendations
 */

import { mysqlTable, int, varchar, decimal, datetime, boolean, text, timestamp } from 'drizzle-orm/mysql-core';

// ==================== VENDOR MANAGEMENT ====================

/**
 * Vendors - Third-party sellers on the platform
 */
export const vendors = mysqlTable('vendors', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id'), // Link to users table
  businessName: varchar('business_name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  logo: text('logo'),
  bannerImage: text('banner_image'),
  
  // Contact Information
  contactName: varchar('contact_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  
  // Business Details
  businessType: varchar('business_type', { length: 100 }), // 'individual', 'cooperative', 'social_enterprise'
  gstNumber: varchar('gst_number', { length: 50 }),
  panNumber: varchar('pan_number', { length: 20 }),
  
  // Address
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  country: varchar('country', { length: 100 }).default('India'),
  
  // Bank Details
  bankName: varchar('bank_name', { length: 255 }),
  accountNumber: varchar('account_number', { length: 50 }),
  ifscCode: varchar('ifsc_code', { length: 20 }),
  
  // Platform Settings
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).default('10.00'), // Percentage
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'approved', 'active', 'suspended'
  
  // Metrics
  totalSales: decimal('total_sales', { precision: 12, scale: 2 }).default('0'),
  totalOrders: int('total_orders').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: int('review_count').default(0),
  
  // Verification
  isVerified: boolean('is_verified').default(false),
  verifiedAt: datetime('verified_at'),
  verifiedBy: int('verified_by'),
  
  // Sustainability Badges
  isOrganic: boolean('is_organic').default(false),
  isLocal: boolean('is_local').default(false),
  isFairTrade: boolean('is_fair_trade').default(false),
  isWomenOwned: boolean('is_women_owned').default(false),
  
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Vendor Products - Products sold by vendors
 */
export const vendorProducts = mysqlTable('vendor_products', {
  id: int('id').primaryKey().autoincrement(),
  vendorId: int('vendor_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  
  // Category
  categoryId: int('category_id'),
  tags: text('tags'), // JSON array
  
  // Pricing
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }), // Original price for discounts
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }), // Vendor's cost
  
  // Inventory
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  barcode: varchar('barcode', { length: 100 }),
  stockQuantity: int('stock_quantity').default(0),
  lowStockThreshold: int('low_stock_threshold').default(5),
  
  // Product Details
  weight: decimal('weight', { precision: 10, scale: 2 }), // in kg
  dimensions: varchar('dimensions', { length: 100 }), // L x W x H in cm
  
  // Media
  images: text('images'), // JSON array of image URLs
  videoUrl: text('video_url'),
  
  // Attributes
  isOrganic: boolean('is_organic').default(false),
  isHandmade: boolean('is_handmade').default(false),
  isEcoFriendly: boolean('is_eco_friendly').default(false),
  
  // Status
  status: varchar('status', { length: 50 }).default('draft'), // 'draft', 'pending_review', 'active', 'out_of_stock', 'discontinued'
  isPublished: boolean('is_published').default(false),
  publishedAt: datetime('published_at'),
  
  // Metrics
  viewCount: int('view_count').default(0),
  salesCount: int('sales_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: int('review_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== REVIEWS & RATINGS ====================

/**
 * Product Reviews
 */
export const productReviews = mysqlTable('product_reviews', {
  id: int('id').primaryKey().autoincrement(),
  productId: int('product_id').notNull(),
  productType: varchar('product_type', { length: 50 }).notNull(), // 'thrift', 'vendor', 'menu_item'
  userId: int('user_id').notNull(),
  orderId: int('order_id'), // Link to purchase
  
  // Review Content
  rating: int('rating').notNull(), // 1-5 stars
  title: varchar('title', { length: 255 }),
  comment: text('comment'),
  
  // Media
  images: text('images'), // JSON array of review images
  
  // Helpful Votes
  helpfulCount: int('helpful_count').default(0),
  notHelpfulCount: int('not_helpful_count').default(0),
  
  // Moderation
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'approved', 'rejected', 'flagged'
  moderatedBy: int('moderated_by'),
  moderatedAt: datetime('moderated_at'),
  moderationNotes: text('moderation_notes'),
  
  // Vendor Response
  vendorResponse: text('vendor_response'),
  vendorRespondedAt: datetime('vendor_responded_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Review Helpfulness Votes
 */
export const reviewVotes = mysqlTable('review_votes', {
  id: int('id').primaryKey().autoincrement(),
  reviewId: int('review_id').notNull(),
  userId: int('user_id').notNull(),
  isHelpful: boolean('is_helpful').notNull(), // true = helpful, false = not helpful
  createdAt: timestamp('created_at').defaultNow(),
});

// ==================== WISHLISTS & FAVORITES ====================

/**
 * Wishlists
 */
export const wishlists = mysqlTable('wishlists', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  name: varchar('name', { length: 255 }).default('My Wishlist'),
  description: text('description'),
  isPublic: boolean('is_public').default(false),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Wishlist Items
 */
export const wishlistItems = mysqlTable('wishlist_items', {
  id: int('id').primaryKey().autoincrement(),
  wishlistId: int('wishlist_id').notNull(),
  productId: int('product_id').notNull(),
  productType: varchar('product_type', { length: 50 }).notNull(), // 'thrift', 'vendor', 'menu_item'
  notes: text('notes'),
  priority: int('priority').default(0), // 0 = low, 1 = medium, 2 = high
  addedAt: timestamp('added_at').defaultNow(),
});

// ==================== NOTIFICATIONS & ALERTS ====================

/**
 * Price Drop Alerts
 */
export const priceAlerts = mysqlTable('price_alerts', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  productId: int('product_id').notNull(),
  productType: varchar('product_type', { length: 50 }).notNull(),
  targetPrice: decimal('target_price', { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal('current_price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true),
  notifiedAt: datetime('notified_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Back in Stock Alerts
 */
export const stockAlerts = mysqlTable('stock_alerts', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  productId: int('product_id').notNull(),
  productType: varchar('product_type', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  notifiedAt: datetime('notified_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==================== RECOMMENDATIONS ====================

/**
 * User Preferences for Recommendations
 */
export const userPreferences = mysqlTable('user_preferences', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().unique(),
  
  // Shopping Preferences
  favoriteCategories: text('favorite_categories'), // JSON array
  priceRange: varchar('price_range', { length: 50 }), // 'budget', 'mid', 'premium'
  preferredBrands: text('preferred_brands'), // JSON array
  
  // Sustainability Preferences
  preferOrganic: boolean('prefer_organic').default(false),
  preferLocal: boolean('prefer_local').default(false),
  preferHandmade: boolean('prefer_handmade').default(false),
  preferEcoFriendly: boolean('prefer_eco_friendly').default(false),
  
  // Dietary Preferences (for cafe)
  dosha: varchar('dosha', { length: 50 }), // 'vata', 'pitta', 'kapha'
  dietaryRestrictions: text('dietary_restrictions'), // JSON array
  allergies: text('allergies'), // JSON array
  
  // Notification Preferences
  emailNotifications: boolean('email_notifications').default(true),
  smsNotifications: boolean('sms_notifications').default(false),
  pushNotifications: boolean('push_notifications').default(true),
  
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Product Views - Track for recommendations
 */
export const productViews = mysqlTable('product_views', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id'),
  sessionId: varchar('session_id', { length: 255 }),
  productId: int('product_id').notNull(),
  productType: varchar('product_type', { length: 50 }).notNull(),
  viewDuration: int('view_duration'), // seconds
  viewedAt: timestamp('viewed_at').defaultNow(),
});

// ==================== PROMOTIONS & DISCOUNTS ====================

/**
 * Discount Codes
 */
export const discountCodes = mysqlTable('discount_codes', {
  id: int('id').primaryKey().autoincrement(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  
  // Discount Details
  discountType: varchar('discount_type', { length: 50 }).notNull(), // 'percentage', 'fixed_amount', 'free_shipping'
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  
  // Conditions
  minPurchaseAmount: decimal('min_purchase_amount', { precision: 10, scale: 2 }),
  maxDiscountAmount: decimal('max_discount_amount', { precision: 10, scale: 2 }),
  applicableProducts: text('applicable_products'), // JSON array of product IDs
  applicableCategories: text('applicable_categories'), // JSON array of category IDs
  
  // Usage Limits
  usageLimit: int('usage_limit'), // Total times code can be used
  usageLimitPerUser: int('usage_limit_per_user').default(1),
  currentUsageCount: int('current_usage_count').default(0),
  
  // Validity
  startDate: datetime('start_date').notNull(),
  endDate: datetime('end_date').notNull(),
  isActive: boolean('is_active').default(true),
  
  // Tracking
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Discount Usage Tracking
 */
export const discountUsage = mysqlTable('discount_usage', {
  id: int('id').primaryKey().autoincrement(),
  discountCodeId: int('discount_code_id').notNull(),
  userId: int('user_id'),
  orderId: int('order_id').notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp('used_at').defaultNow(),
});

// ==================== CUSTOMER SUPPORT ====================

/**
 * Support Tickets
 */
export const supportTickets = mysqlTable('support_tickets', {
  id: int('id').primaryKey().autoincrement(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
  userId: int('user_id'),
  
  // Contact Info (for guest users)
  guestName: varchar('guest_name', { length: 255 }),
  guestEmail: varchar('guest_email', { length: 255 }),
  guestPhone: varchar('guest_phone', { length: 20 }),
  
  // Ticket Details
  category: varchar('category', { length: 100 }).notNull(), // 'order', 'product', 'payment', 'technical', 'other'
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  priority: varchar('priority', { length: 50 }).default('medium'), // 'low', 'medium', 'high', 'urgent'
  
  // Related Entities
  relatedOrderId: int('related_order_id'),
  relatedProductId: int('related_product_id'),
  
  // Status
  status: varchar('status', { length: 50 }).default('open'), // 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'
  assignedTo: int('assigned_to'), // Staff user ID
  
  // Resolution
  resolvedAt: datetime('resolved_at'),
  resolvedBy: int('resolved_by'),
  resolutionNotes: text('resolution_notes'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Support Ticket Messages
 */
export const ticketMessages = mysqlTable('ticket_messages', {
  id: int('id').primaryKey().autoincrement(),
  ticketId: int('ticket_id').notNull(),
  userId: int('user_id'),
  isStaff: boolean('is_staff').default(false),
  message: text('message').notNull(),
  attachments: text('attachments'), // JSON array of file URLs
  createdAt: timestamp('created_at').defaultNow(),
});

export type Vendor = typeof vendors.$inferSelect;
export type VendorProduct = typeof vendorProducts.$inferSelect;
export type ProductReview = typeof productReviews.$inferSelect;
export type Wishlist = typeof wishlists.$inferSelect;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
