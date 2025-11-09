/**
 * Database Schema for Other Sakshi Centers
 * - Repair Cafe
 * - Swap Events
 * - Upcycle Studio
 */

import { mysqlTable, varchar, text, int, decimal, datetime, boolean, json } from 'drizzle-orm/mysql-core';

// ============================================
// REPAIR CAFE
// ============================================

// Repair requests submitted by users
export const repairRequests = mysqlTable('repair_requests', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  itemName: varchar('item_name', { length: 255 }).notNull(),
  itemCategory: varchar('item_category', { length: 100 }).notNull(), // electronics, clothing, furniture, etc.
  itemDescription: text('item_description').notNull(),
  repairNeeded: text('repair_needed').notNull(),
  imageUrls: json('image_urls').$type<string[]>(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, matched, in_progress, completed, cancelled
  matchedVolunteerId: int('matched_volunteer_id'),
  eventId: int('event_id'),
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Repair cafe events
export const repairEvents = mysqlTable('repair_events', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventDate: datetime('event_date').notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  maxCapacity: int('max_capacity').notNull().default(20),
  currentRegistrations: int('current_registrations').notNull().default(0),
  skills: json('skills').$type<string[]>(), // List of repair skills available
  volunteersNeeded: int('volunteers_needed').notNull().default(5),
  volunteersRegistered: int('volunteers_registered').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('upcoming'), // upcoming, ongoing, completed, cancelled
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Volunteer registrations for repair events
export const repairVolunteers = mysqlTable('repair_volunteers', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  eventId: int('event_id').notNull(),
  skills: json('skills').$type<string[]>().notNull(),
  experience: text('experience'),
  toolsBringing: text('tools_bringing'),
  status: varchar('status', { length: 50 }).notNull().default('registered'), // registered, checked_in, completed
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// ============================================
// SWAP EVENTS
// ============================================

// Items listed for swapping
export const swapItems = mysqlTable('swap_items', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(), // clothing, books, toys, electronics, etc.
  condition: varchar('condition', { length: 50 }).notNull(), // excellent, good, fair
  imageUrls: json('image_urls').$type<string[]>(),
  estimatedValue: decimal('estimated_value', { precision: 10, scale: 2 }),
  lookingFor: text('looking_for'), // What they want in exchange
  status: varchar('status', { length: 50 }).notNull().default('available'), // available, reserved, swapped, withdrawn
  swappedWithUserId: int('swapped_with_user_id'),
  swappedItemId: int('swapped_item_id'),
  eventId: int('event_id'),
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Swap events
export const swapEvents = mysqlTable('swap_events', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventDate: datetime('event_date').notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  categories: json('categories').$type<string[]>(), // Categories accepted
  maxParticipants: int('max_participants').notNull().default(50),
  currentParticipants: int('current_participants').notNull().default(0),
  rules: text('rules'),
  status: varchar('status', { length: 50 }).notNull().default('upcoming'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Swap event registrations
export const swapRegistrations = mysqlTable('swap_registrations', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  eventId: int('event_id').notNull(),
  itemsCount: int('items_count').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('registered'),
  checkedIn: boolean('checked_in').notNull().default(false),
  swapsCompleted: int('swaps_completed').notNull().default(0),
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// ============================================
// UPCYCLE STUDIO
// ============================================

// Upcycle projects/tutorials
export const upcycleProjects = mysqlTable('upcycle_projects', {
  id: int('id').primaryKey().autoincrement(),
  authorId: int('author_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(), // beginner, intermediate, advanced
  timeRequired: varchar('time_required', { length: 100 }), // e.g., "2-3 hours"
  materialsNeeded: json('materials_needed').$type<string[]>().notNull(),
  toolsNeeded: json('tools_needed').$type<string[]>(),
  instructions: json('instructions').$type<Array<{ step: number; text: string; imageUrl?: string }>>().notNull(),
  beforeImageUrl: varchar('before_image_url', { length: 500 }),
  afterImageUrl: varchar('after_image_url', { length: 500 }),
  category: varchar('category', { length: 100 }).notNull(), // furniture, clothing, decor, etc.
  tags: json('tags').$type<string[]>(),
  isApproved: boolean('is_approved').notNull().default(false),
  views: int('views').notNull().default(0),
  likes: int('likes').notNull().default(0),
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Upcycle workshops
export const upcycleWorkshops = mysqlTable('upcycle_workshops', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  instructorId: int('instructor_id').notNull(),
  projectId: int('project_id'), // Related project/tutorial
  workshopDate: datetime('workshop_date').notNull(),
  duration: int('duration').notNull(), // in minutes
  location: varchar('location', { length: 255 }).notNull(),
  isVirtual: boolean('is_virtual').notNull().default(false),
  meetingLink: varchar('meeting_link', { length: 500 }),
  maxParticipants: int('max_participants').notNull().default(15),
  currentParticipants: int('current_participants').notNull().default(0),
  materialsProvided: json('materials_provided').$type<string[]>(),
  materialsFee: decimal('materials_fee', { precision: 10, scale: 2 }).default('0.00'),
  pricingTier: varchar('pricing_tier', { length: 50 }).notNull().default('fair'), // community, fair, supporter
  communityPrice: decimal('community_price', { precision: 10, scale: 2 }).notNull(),
  fairPrice: decimal('fair_price', { precision: 10, scale: 2 }).notNull(),
  supporterPrice: decimal('supporter_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('upcoming'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Workshop registrations
export const workshopRegistrations = mysqlTable('workshop_registrations', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  workshopId: int('workshop_id').notNull(),
  priceTier: varchar('price_tier', { length: 50 }).notNull(),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('pending'),
  paymentId: varchar('payment_id', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('registered'),
  attended: boolean('attended').notNull().default(false),
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// User upcycle submissions (show off your creations!)
export const upcycleSubmissions = mysqlTable('upcycle_submissions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  projectId: int('project_id'), // If based on a tutorial
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  beforeImageUrl: varchar('before_image_url', { length: 500 }),
  afterImageUrl: varchar('after_image_url', { length: 500 }),
  materialsUsed: json('materials_used').$type<string[]>(),
  timeTaken: varchar('time_taken', { length: 100 }),
  tips: text('tips'),
  isPublic: boolean('is_public').notNull().default(true),
  likes: int('likes').notNull().default(0),
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});
