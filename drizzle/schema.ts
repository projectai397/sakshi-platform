import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "volunteer", "staff", "admin"]).default("user").notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarUrl: text("avatarUrl"),
  languagePreference: varchar("languagePreference", { length: 10 }).default("en"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Seva Token Wallets - Each user has a wallet for seva tokens
 */
export const sevaWallets = mysqlTable("seva_wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  balance: int("balance").default(0).notNull(),
  lifetimeEarned: int("lifetimeEarned").default(0).notNull(),
  lifetimeSpent: int("lifetimeSpent").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SevaWallet = typeof sevaWallets.$inferSelect;
export type InsertSevaWallet = typeof sevaWallets.$inferInsert;

/**
 * Seva Token Transactions - Track all token movements
 */
export const sevaTransactions = mysqlTable("seva_transactions", {
  id: int("id").autoincrement().primaryKey(),
  walletId: int("walletId").notNull(),
  type: mysqlEnum("type", ["earn", "spend", "expire", "adjustment"]).notNull(),
  amount: int("amount").notNull(),
  description: text("description").notNull(),
  relatedEntityType: varchar("relatedEntityType", { length: 50 }), // 'order', 'volunteer_shift', etc.
  relatedEntityId: int("relatedEntityId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SevaTransaction = typeof sevaTransactions.$inferSelect;
export type InsertSevaTransaction = typeof sevaTransactions.$inferInsert;

/**
 * Product Categories
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  parentId: int("parentId"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products - Every item is unique (quantity always = 1)
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  story: text("story"), // Unique story of this item
  categoryId: int("categoryId"),
  condition: mysqlEnum("condition", ["excellent", "good", "fair", "worn"]).notNull(),
  
  // Triple Pricing System
  suggestedPrice: int("suggestedPrice").notNull(), // in paise (₹1 = 100 paise)
  minimumPrice: int("minimumPrice").notNull(),
  maximumPrice: int("maximumPrice").notNull(),
  sevaTokenPrice: int("sevaTokenPrice").notNull(), // Number of tokens
  
  // Item Details
  brand: varchar("brand", { length: 100 }),
  size: varchar("size", { length: 50 }),
  color: varchar("color", { length: 50 }),
  material: varchar("material", { length: 100 }),
  
  // Inventory
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  barcode: varchar("barcode", { length: 100 }),
  quantity: int("quantity").default(1).notNull(), // Always 1 for unique items
  status: mysqlEnum("status", ["available", "sold", "reserved", "donated_out"]).default("available").notNull(),
  
  // Source Tracking
  source: mysqlEnum("source", ["donation", "consignment", "estate"]).notNull(),
  donorName: varchar("donorName", { length: 255 }),
  donationDate: timestamp("donationDate"),
  
  // Media
  imageUrls: text("imageUrls"), // JSON array of image URLs
  
  // Metadata
  isChildrenFree: boolean("isChildrenFree").default(false), // Children's free zone items
  isFeatured: boolean("isFeatured").default(false),
  viewCount: int("viewCount").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Shopping Carts
 */
export const carts = mysqlTable("carts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 255 }), // For guest users
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cart = typeof carts.$inferSelect;
export type InsertCart = typeof carts.$inferInsert;

/**
 * Cart Items
 */
export const cartItems = mysqlTable("cart_items", {
  id: int("id").autoincrement().primaryKey(),
  cartId: int("cartId").notNull(),
  productId: int("productId").notNull(),
  selectedPaymentMethod: mysqlEnum("selectedPaymentMethod", ["money", "seva_tokens", "free"]),
  selectedPrice: int("selectedPrice"), // If money, the amount they chose
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  userId: int("userId"),
  
  // Contact Info (for guest orders or free requests)
  customerName: varchar("customerName", { length: 255 }),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }),
  
  // Payment
  totalAmount: int("totalAmount").default(0), // in paise
  tokensUsed: int("tokensUsed").default(0),
  paymentMethod: mysqlEnum("paymentMethod", ["money", "seva_tokens", "free", "mixed"]).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending"),
  
  // Fulfillment
  fulfillmentStatus: mysqlEnum("fulfillmentStatus", ["pending", "processing", "ready", "completed", "cancelled"]).default("pending"),
  fulfillmentType: mysqlEnum("fulfillmentType", ["pickup", "delivery"]).default("pickup"),
  
  // Delivery Address
  deliveryAddress: text("deliveryAddress"),
  deliveryCity: varchar("deliveryCity", { length: 100 }),
  deliveryState: varchar("deliveryState", { length: 100 }),
  deliveryPostalCode: varchar("deliveryPostalCode", { length: 20 }),
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order Items
 */
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(), // Snapshot
  paymentMethod: mysqlEnum("paymentMethod", ["money", "seva_tokens", "free"]).notNull(),
  pricePaid: int("pricePaid").default(0), // in paise
  tokensPaid: int("tokensPaid").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Donations
 */
export const donations = mysqlTable("donations", {
  id: int("id").autoincrement().primaryKey(),
  receiptNumber: varchar("receiptNumber", { length: 50 }).notNull().unique(),
  donorName: varchar("donorName", { length: 255 }).notNull(),
  donorEmail: varchar("donorEmail", { length: 320 }),
  donorPhone: varchar("donorPhone", { length: 20 }),
  donorAddress: text("donorAddress"),
  
  itemsDescription: text("itemsDescription").notNull(),
  estimatedValue: int("estimatedValue"), // in paise
  numberOfItems: int("numberOfItems").default(0),
  
  status: mysqlEnum("status", ["submitted", "scheduled", "received", "processed"]).default("submitted"),
  pickupDate: timestamp("pickupDate"),
  receivedDate: timestamp("receivedDate"),
  
  notes: text("notes"),
  internalNotes: text("internalNotes"), // Staff only
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;

/**
 * Volunteer Shifts
 */
export const volunteerShifts = mysqlTable("volunteer_shifts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  shiftType: varchar("shiftType", { length: 100 }).notNull(), // 'store', 'repair_cafe', 'sorting', etc.
  shiftDate: timestamp("shiftDate").notNull(),
  startTime: varchar("startTime", { length: 10 }).notNull(), // HH:MM format
  endTime: varchar("endTime", { length: 10 }).notNull(),
  hoursWorked: int("hoursWorked").notNull(), // in minutes
  tokensEarned: int("tokensEarned").notNull(),
  
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"]).default("scheduled"),
  notes: text("notes"),
  verifiedBy: int("verifiedBy"), // Staff user ID
  verifiedAt: timestamp("verifiedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VolunteerShift = typeof volunteerShifts.$inferSelect;
export type InsertVolunteerShift = typeof volunteerShifts.$inferInsert;

/**
 * Events (Repair Café, Swap Events, Upcycle Workshops)
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["repair_cafe", "swap_event", "upcycle_workshop", "community"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  
  eventDate: timestamp("eventDate").notNull(),
  startTime: varchar("startTime", { length: 10 }).notNull(),
  endTime: varchar("endTime", { length: 10 }).notNull(),
  
  location: varchar("location", { length: 255 }),
  address: text("address"),
  
  maxParticipants: int("maxParticipants"),
  currentParticipants: int("currentParticipants").default(0),
  
  imageUrl: text("imageUrl"),
  isActive: boolean("isActive").default(true),
  requiresRegistration: boolean("requiresRegistration").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Event Registrations
 */
export const eventRegistrations = mysqlTable("event_registrations", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  userId: int("userId"),
  
  // For non-registered users
  guestName: varchar("guestName", { length: 255 }),
  guestEmail: varchar("guestEmail", { length: 320 }),
  guestPhone: varchar("guestPhone", { length: 20 }),
  
  status: mysqlEnum("status", ["registered", "attended", "cancelled", "no_show"]).default("registered"),
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;

/**
 * Impact Metrics - Track environmental and social impact
 */
export const impactMetrics = mysqlTable("impact_metrics", {
  id: int("id").autoincrement().primaryKey(),
  metricDate: timestamp("metricDate").notNull(),
  
  // Environmental Impact
  itemsDiverted: int("itemsDiverted").default(0), // Items saved from landfill
  co2Prevented: int("co2Prevented").default(0), // in grams
  waterSaved: int("waterSaved").default(0), // in liters
  
  // Social Impact
  familiesServed: int("familiesServed").default(0),
  freeItemsGiven: int("freeItemsGiven").default(0),
  childrenItemsFree: int("childrenItemsFree").default(0),
  
  // Economic Impact
  revenueGenerated: int("revenueGenerated").default(0), // in paise
  tokensCirculated: int("tokensCirculated").default(0),
  volunteerHours: int("volunteerHours").default(0), // in minutes
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ImpactMetric = typeof impactMetrics.$inferSelect;
export type InsertImpactMetric = typeof impactMetrics.$inferInsert;

/**
 * Silent Village - Residents and Applications
 */
export const villageResidents = mysqlTable("village_residents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Application Info
  applicationDate: timestamp("applicationDate").notNull(),
  residencyType: mysqlEnum("residencyType", ["long_term", "short_term", "researcher", "family", "work_study"]).notNull(),
  
  // Residency Period
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  
  // Financial
  contributionAmount: int("contributionAmount").default(0), // Monthly in paise
  sevaTokensEarned: int("sevaTokensEarned").default(0),
  
  // Assignment
  housingAssignment: varchar("housingAssignment", { length: 100 }),
  workTeam: varchar("workTeam", { length: 100 }), // 'farm', 'kitchen', 'maintenance', 'research', etc.
  
  // Application Details
  meditationExperience: text("meditationExperience"),
  skills: text("skills"),
  motivation: text("motivation"),
  emergencyContact: text("emergencyContact"), // JSON
  
  // Status
  status: mysqlEnum("status", ["applied", "interview", "trial", "accepted", "active", "alumni", "rejected"]).default("applied"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VillageResident = typeof villageResidents.$inferSelect;
export type InsertVillageResident = typeof villageResidents.$inferInsert;

/**
 * Village Research Projects
 */
export const villageResearchProjects = mysqlTable("village_research_projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  category: mysqlEnum("category", ["neuroscience", "sustainability", "contemplative_pedagogy", "circular_economy"]).notNull(),
  
  leadResearcherId: int("leadResearcherId").notNull(),
  collaborators: text("collaborators"), // JSON array of user IDs
  
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  
  description: text("description").notNull(),
  methodology: text("methodology"),
  
  status: mysqlEnum("status", ["proposed", "approved", "in_progress", "completed", "published"]).default("proposed"),
  
  publications: text("publications"), // JSON array
  fundingAmount: int("fundingAmount").default(0), // in paise
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VillageResearchProject = typeof villageResearchProjects.$inferSelect;
export type InsertVillageResearchProject = typeof villageResearchProjects.$inferInsert;

/**
 * Meditation Teachers
 */
export const teachers = mysqlTable("teachers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photoUrl"),
  
  tradition: varchar("tradition", { length: 100 }), // 'Vipassana', 'Zen', 'Tibetan', etc.
  yearsExperience: int("yearsExperience").notNull(),
  certifications: text("certifications"), // JSON array
  languages: text("languages"), // JSON array
  
  contactEmail: varchar("contactEmail", { length: 320 }),
  danaPreference: text("danaPreference"),
  availability: text("availability"), // JSON
  
  status: mysqlEnum("status", ["active", "inactive", "guest"]).default("active"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = typeof teachers.$inferInsert;

/**
 * Retreats Schedule
 */
export const retreats = mysqlTable("retreats", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  
  retreatType: mysqlEnum("retreatType", ["3_day", "7_day", "10_day_vipassana", "14_day", "21_day", "30_day_teacher", "corporate_custom"]).notNull(),
  
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  
  capacity: int("capacity").notNull(),
  currentBookings: int("currentBookings").default(0),
  
  teacherId: int("teacherId").notNull(),
  assistantTeachers: text("assistantTeachers"), // JSON array of teacher IDs
  
  // Pricing (in paise)
  priceStandard: int("priceStandard").notNull(),
  priceSupporter: int("priceSupporter").notNull(),
  priceScholarship: int("priceScholarship").notNull(),
  sevaTokenDiscount: int("sevaTokenDiscount").default(0), // Tokens can reduce price
  
  description: text("description").notNull(),
  schedule: text("schedule"), // JSON daily schedule
  prerequisites: text("prerequisites"),
  
  status: mysqlEnum("status", ["announced", "open_registration", "full", "in_progress", "completed", "cancelled"]).default("announced"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Retreat = typeof retreats.$inferSelect;
export type InsertRetreat = typeof retreats.$inferInsert;

/**
 * Retreat Bookings
 */
export const retreatBookings = mysqlTable("retreat_bookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingNumber: varchar("bookingNumber", { length: 50 }).notNull().unique(),
  
  userId: int("userId"),
  retreatId: int("retreatId").notNull(),
  
  // Guest info (if not registered user)
  guestName: varchar("guestName", { length: 255 }),
  guestEmail: varchar("guestEmail", { length: 320 }),
  guestPhone: varchar("guestPhone", { length: 20 }),
  
  accommodationType: mysqlEnum("accommodationType", ["private_kuti", "shared_room", "family"]).notNull(),
  priceTier: mysqlEnum("priceTier", ["standard", "supporter", "scholarship"]).notNull(),
  
  amountPaid: int("amountPaid").notNull(), // in paise
  sevaTokensUsed: int("sevaTokensUsed").default(0),
  
  // Participant Info
  dietaryRequirements: text("dietaryRequirements"),
  medicalNotes: text("medicalNotes"),
  emergencyContact: text("emergencyContact"), // JSON
  meditationExperience: text("meditationExperience"),
  
  status: mysqlEnum("status", ["pending", "confirmed", "waitlist", "cancelled", "completed"]).default("pending"),
  
  arrivalDate: timestamp("arrivalDate"),
  departureDate: timestamp("departureDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RetreatBooking = typeof retreatBookings.$inferSelect;
export type InsertRetreatBooking = typeof retreatBookings.$inferInsert;

/**
 * AI Meditation Sessions
 */
export const meditationSessions = mysqlTable("meditation_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  sessionType: varchar("sessionType", { length: 100 }).notNull(), // 'vipassana', 'metta', 'body_scan', etc.
  duration: int("duration").notNull(), // in minutes
  
  // AI Interaction
  emotionalState: varchar("emotionalState", { length: 50 }), // Detected state: 'anxious', 'calm', 'stressed', etc.
  aiGuidanceUsed: boolean("aiGuidanceUsed").default(true),
  voiceGuidance: boolean("voiceGuidance").default(false),
  soundscape: varchar("soundscape", { length: 50 }), // 'forest', 'ocean', 'mountain', etc.
  
  // Progress Tracking
  completionPercentage: int("completionPercentage").default(0),
  qualityRating: int("qualityRating"), // 1-5 stars, user-rated
  notes: text("notes"),
  
  // Seva Tokens
  tokensEarned: int("tokensEarned").default(0),
  
  startedAt: timestamp("startedAt").notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MeditationSession = typeof meditationSessions.$inferSelect;
export type InsertMeditationSession = typeof meditationSessions.$inferInsert;

/**
 * Meditation Progress Tracking
 */
export const meditationProgress = mysqlTable("meditation_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  totalSessions: int("totalSessions").default(0),
  totalMinutes: int("totalMinutes").default(0),
  currentStreak: int("currentStreak").default(0), // Days
  longestStreak: int("longestStreak").default(0),
  
  // Milestones
  firstSessionDate: timestamp("firstSessionDate"),
  last7DaysSessions: int("last7DaysSessions").default(0),
  last30DaysSessions: int("last30DaysSessions").default(0),
  
  // Preferences
  preferredSessionType: varchar("preferredSessionType", { length: 100 }),
  preferredDuration: int("preferredDuration").default(20),
  preferredSoundscape: varchar("preferredSoundscape", { length: 50 }),
  
  // Achievements
  achievements: text("achievements"), // JSON array of achievement IDs
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MeditationProgress = typeof meditationProgress.$inferSelect;
export type InsertMeditationProgress = typeof meditationProgress.$inferInsert;

/**
 * Sakshi Cafés - Women's Cooperative Locations
 */
export const cafes = mysqlTable("cafes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  
  // Location
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  country: varchar("country", { length: 100 }).default("India"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  mapLink: text("mapLink"),
  
  // Contact
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  
  // Operations
  hoursOfOperation: text("hoursOfOperation"), // JSON: {monday: "7:00 AM - 9:00 PM", ...}
  daysOpen: varchar("daysOpen", { length: 255 }).default("Monday - Saturday"),
  
  // Details
  description: text("description"),
  specialties: text("specialties"), // JSON array
  imageUrl: text("imageUrl"),
  
  // Cooperative Info
  cooperativeMemberCount: int("cooperativeMemberCount").default(0),
  establishedDate: timestamp("establishedDate"),
  
  // Status
  status: mysqlEnum("status", ["planning", "opening_soon", "open", "temporarily_closed", "closed"]).default("planning"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cafe = typeof cafes.$inferSelect;
export type InsertCafe = typeof cafes.$inferInsert;

/**
 * Café Cooperative Members
 */
export const cafeMembers = mysqlTable("cafe_members", {
  id: int("id").autoincrement().primaryKey(),
  cafeId: int("cafeId").notNull(),
  userId: int("userId"), // Link to user account if they have one
  
  // Personal Info
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  
  // Role in Cooperative
  role: mysqlEnum("role", ["manager", "cook", "service", "utility", "member"]).default("member"),
  title: varchar("title", { length: 100 }), // e.g., "Head Cook", "Café Manager"
  
  // Employment Details
  joinDate: timestamp("joinDate"),
  monthlyWage: int("monthlyWage"), // in paise
  hoursPerWeek: int("hoursPerWeek").default(45),
  
  // Bio & Photo
  bio: text("bio"),
  photoUrl: text("photoUrl"),
  
  // Status
  status: mysqlEnum("status", ["active", "on_leave", "inactive"]).default("active"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CafeMember = typeof cafeMembers.$inferSelect;
export type InsertCafeMember = typeof cafeMembers.$inferInsert;

/**
 * Café Menu Items
 */
export const cafeMenuItems = mysqlTable("cafe_menu_items", {
  id: int("id").autoincrement().primaryKey(),
  cafeId: int("cafeId"), // NULL = available at all cafés
  
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  
  // Category
  category: mysqlEnum("category", ["beverage", "meal", "snack", "dessert", "special"]).notNull(),
  
  // Triple Pricing (in paise)
  communityPrice: int("communityPrice").notNull(),
  fairPrice: int("fairPrice").notNull(),
  supporterPrice: int("supporterPrice").notNull(),
  sevaTokenPrice: int("sevaTokenPrice").notNull(),
  
  // Details
  isVegan: boolean("isVegan").default(false),
  isGlutenFree: boolean("isGlutenFree").default(false),
  isOrganic: boolean("isOrganic").default(true),
  isSeasonal: boolean("isSeasonal").default(false),
  
  // Availability
  availableDays: varchar("availableDays", { length: 255 }), // JSON array: ["monday", "tuesday", ...]
  availableTimeStart: varchar("availableTimeStart", { length: 10 }), // HH:MM
  availableTimeEnd: varchar("availableTimeEnd", { length: 10 }), // HH:MM
  
  imageUrl: text("imageUrl"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CafeMenuItem = typeof cafeMenuItems.$inferSelect;
export type InsertCafeMenuItem = typeof cafeMenuItems.$inferInsert;

/**
 * Café Orders (for tracking café purchases with seva tokens)
 */
export const cafeOrders = mysqlTable("cafe_orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  cafeId: int("cafeId").notNull(),
  userId: int("userId"), // NULL for walk-in customers
  
  // Customer Info (for walk-ins)
  customerName: varchar("customerName", { length: 255 }),
  
  // Payment
  totalAmount: int("totalAmount").default(0), // in paise
  tokensUsed: int("tokensUsed").default(0),
  paymentMethod: mysqlEnum("paymentMethod", ["money", "seva_tokens", "free", "mixed"]).notNull(),
  
  // Order Details
  items: text("items"), // JSON array of {menuItemId, name, quantity, pricePaid, tokensPaid}
  notes: text("notes"),
  
  // Status
  status: mysqlEnum("status", ["pending", "preparing", "ready", "completed", "cancelled"]).default("pending"),
  
  orderDate: timestamp("orderDate").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CafeOrder = typeof cafeOrders.$inferSelect;
export type InsertCafeOrder = typeof cafeOrders.$inferInsert;

/**
 * Café Cooperative Applications
 */
export const cafeApplications = mysqlTable("cafe_applications", {
  id: int("id").autoincrement().primaryKey(),
  
  // Personal Information
  fullName: varchar("fullName", { length: 255 }).notNull(),
  age: int("age").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  city: varchar("city", { length: 100 }).notNull(),
  
  // Application Details
  experience: text("experience"),
  motivation: text("motivation").notNull(),
  availability: varchar("availability", { length: 50 }).notNull(), // 'immediately', '1month', etc.
  
  // Status
  status: mysqlEnum("status", ["pending", "under_review", "interview_scheduled", "accepted", "rejected", "withdrawn"]).default("pending"),
  
  // Internal Notes
  reviewNotes: text("reviewNotes"),
  reviewedBy: int("reviewedBy"), // Staff user ID
  reviewedAt: timestamp("reviewedAt"),
  
  // Assignment
  assignedCafeId: int("assignedCafeId"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CafeApplication = typeof cafeApplications.$inferSelect;
export type InsertCafeApplication = typeof cafeApplications.$inferInsert;

// Export cafe-related tables
export * from './schema-cafe';
