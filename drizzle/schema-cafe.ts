import { mysqlTable, int, varchar, text, decimal, boolean, timestamp, json, date, index, mysqlEnum } from 'drizzle-orm/mysql-core';
import { users } from './schema';

// Cafe Locations
export const cafeLocations = mysqlTable('cafe_locations', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('India'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  hoursOfOperation: json('hours_of_operation').$type<Record<string, string>>(), // {monday: "9:00-21:00", ...}
  seatingCapacity: int('seating_capacity'),
  isActive: boolean('is_active').default(true),
  franchiseId: int('franchise_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type CafeLocation = typeof cafeLocations.$inferSelect;
export type InsertCafeLocation = typeof cafeLocations.$inferInsert;

// Menu Items
export const sakshiMenuItems = mysqlTable('sakshi_menu_items', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }), // breakfast, lunch, dinner, snack, beverage, dessert
  imageUrl: varchar('image_url', { length: 500 }),
  preparationTime: int('preparation_time'), // minutes
  servingSize: varchar('serving_size', { length: 50 }),
  calories: int('calories'),
  proteinG: decimal('protein_g', { precision: 5, scale: 2 }),
  carbsG: decimal('carbs_g', { precision: 5, scale: 2 }),
  fatG: decimal('fat_g', { precision: 5, scale: 2 }),
  fiberG: decimal('fiber_g', { precision: 5, scale: 2 }),
  ayurvedicProperties: json('ayurvedic_properties').$type<{
    doshaBalance?: string;
    taste?: string[];
    energetics?: string;
  }>(),
  allergens: json('allergens').$type<string[]>(),
  communityPrice: decimal('community_price', { precision: 10, scale: 2 }),
  fairPrice: decimal('fair_price', { precision: 10, scale: 2 }),
  supporterPrice: decimal('supporter_price', { precision: 10, scale: 2 }),
  isAvailable: boolean('is_available').default(true),
  recipeId: int('recipe_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index('sakshi_menu_items_category_idx').on(table.category),
  availableIdx: index('sakshi_menu_items_available_idx').on(table.isAvailable),
}));

export type SakshiMenuItem = typeof sakshiMenuItems.$inferSelect;
export type InsertSakshiMenuItem = typeof sakshiMenuItems.$inferInsert;

// Recipes
export const recipes = mysqlTable('recipes', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  authorId: int('author_id'),
  category: varchar('category', { length: 50 }),
  cuisine: varchar('cuisine', { length: 50 }),
  difficulty: mysqlEnum('difficulty', ['easy', 'medium', 'hard']),
  prepTime: int('prep_time'), // minutes
  cookTime: int('cook_time'),
  servings: int('servings'),
  ingredients: json('ingredients').$type<Array<{
    name: string;
    quantity: string;
    unit: string;
  }>>(),
  instructions: json('instructions').$type<Array<{
    step: number;
    text: string;
    imageUrl?: string;
  }>>(),
  nutritionalInfo: json('nutritional_info').$type<{
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  }>(),
  ayurvedicInfo: json('ayurvedic_info').$type<{
    doshaBalance?: string;
    taste?: string[];
    season?: string;
  }>(),
  tags: json('tags').$type<string[]>(),
  imageUrl: varchar('image_url', { length: 500 }),
  videoUrl: varchar('video_url', { length: 500 }),
  isApproved: boolean('is_approved').default(false),
  ratingAvg: decimal('rating_avg', { precision: 3, scale: 2 }),
  ratingCount: int('rating_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index('recipes_category_idx').on(table.category),
  approvedIdx: index('recipes_approved_idx').on(table.isApproved),
  authorIdx: index('recipes_author_idx').on(table.authorId),
}));

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;

// Cafe Orders
export const sakshiCafeOrders = mysqlTable('sakshi_cafe_orders', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id'),
  orderType: mysqlEnum('order_type', ['dine-in', 'delivery', 'pickup', 'catering']),
  cafeLocationId: int('cafe_location_id'),
  deliveryAddress: text('delivery_address'),
  deliveryLatitude: decimal('delivery_latitude', { precision: 10, scale: 8 }),
  deliveryLongitude: decimal('delivery_longitude', { precision: 11, scale: 8 }),
  scheduledTime: timestamp('scheduled_time'),
  items: json('items').$type<Array<{
    menuItemId: number;
    name: string;
    quantity: number;
    priceTier: string;
    price: number;
    total: number;
    customizations?: string;
  }>>(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentStatus: mysqlEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']),
  orderStatus: mysqlEnum('order_status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
  specialInstructions: text('special_instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index('sakshi_cafe_orders_user_idx').on(table.userId),
  statusIdx: index('sakshi_cafe_orders_status_idx').on(table.orderStatus),
  typeIdx: index('sakshi_cafe_orders_type_idx').on(table.orderType),
}));

export type SakshiCafeOrder = typeof sakshiCafeOrders.$inferSelect;
export type InsertSakshiCafeOrder = typeof sakshiCafeOrders.$inferInsert;

// Cooking Classes
export const cookingClasses = mysqlTable('cooking_classes', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  instructorId: int('instructor_id'),
  classType: mysqlEnum('class_type', ['in-person', 'virtual']),
  cafeLocationId: int('cafe_location_id'),
  dateTime: timestamp('date_time'),
  duration: int('duration'), // minutes
  maxParticipants: int('max_participants'),
  currentParticipants: int('current_participants').default(0),
  communityPrice: decimal('community_price', { precision: 10, scale: 2 }),
  fairPrice: decimal('fair_price', { precision: 10, scale: 2 }),
  supporterPrice: decimal('supporter_price', { precision: 10, scale: 2 }),
  ingredientsList: text('ingredients_list'),
  equipmentNeeded: text('equipment_needed'),
  skillLevel: varchar('skill_level', { length: 20 }),
  imageUrl: varchar('image_url', { length: 500 }),
  videoUrl: varchar('video_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  dateIdx: index('cooking_classes_date_idx').on(table.dateTime),
  activeIdx: index('cooking_classes_active_idx').on(table.isActive),
}));

export type CookingClass = typeof cookingClasses.$inferSelect;
export type InsertCookingClass = typeof cookingClasses.$inferInsert;

// Class Registrations
export const classRegistrations = mysqlTable('class_registrations', {
  id: int('id').autoincrement().primaryKey(),
  classId: int('class_id'),
  userId: int('user_id'),
  priceTier: mysqlEnum('price_tier', ['community', 'fair', 'supporter']),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']),
  attendanceStatus: mysqlEnum('attendance_status', ['registered', 'attended', 'no-show']),
  certificateIssued: boolean('certificate_issued').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  classIdx: index('class_registrations_class_idx').on(table.classId),
  userIdx: index('class_registrations_user_idx').on(table.userId),
}));

export type ClassRegistration = typeof classRegistrations.$inferSelect;
export type InsertClassRegistration = typeof classRegistrations.$inferInsert;

// Meal Subscriptions
export const mealSubscriptions = mysqlTable('meal_subscriptions', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id'),
  frequency: mysqlEnum('frequency', ['daily', 'weekly', 'bi-weekly']),
  mealsPerDelivery: int('meals_per_delivery'),
  deliveryAddress: text('delivery_address'),
  deliveryTimePreference: varchar('delivery_time_preference', { length: 50 }),
  priceTier: mysqlEnum('price_tier', ['community', 'fair', 'supporter']),
  mealPreferences: json('meal_preferences').$type<{
    categories?: string[];
    excludeIngredients?: string[];
    dietaryRestrictions?: string[];
    spiceLevel?: string;
  }>(),
  status: mysqlEnum('status', ['active', 'paused', 'cancelled']),
  nextDeliveryDate: date('next_delivery_date'),
  billingCycleStart: date('billing_cycle_start'),
  amountPerCycle: decimal('amount_per_cycle', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index('meal_subscriptions_user_idx').on(table.userId),
  statusIdx: index('meal_subscriptions_status_idx').on(table.status),
}));

export type MealSubscription = typeof mealSubscriptions.$inferSelect;
export type InsertMealSubscription = typeof mealSubscriptions.$inferInsert;

// Subscription Deliveries
export const subscriptionDeliveries = mysqlTable('subscription_deliveries', {
  id: int('id').autoincrement().primaryKey(),
  subscriptionId: int('subscription_id'),
  deliveryDate: date('delivery_date'),
  items: json('items').$type<Array<{
    menuItemId: number;
    quantity: number;
  }>>(),
  status: mysqlEnum('status', ['scheduled', 'delivered', 'skipped']),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  subscriptionIdx: index('subscription_deliveries_subscription_idx').on(table.subscriptionId),
  dateIdx: index('subscription_deliveries_date_idx').on(table.deliveryDate),
}));

export type SubscriptionDelivery = typeof subscriptionDeliveries.$inferSelect;
export type InsertSubscriptionDelivery = typeof subscriptionDeliveries.$inferInsert;

// Franchises
export const franchises = mysqlTable('franchises', {
  id: int('id').autoincrement().primaryKey(),
  franchiseeName: varchar('franchisee_name', { length: 255 }),
  franchiseeEmail: varchar('franchisee_email', { length: 255 }),
  franchiseePhone: varchar('franchisee_phone', { length: 20 }),
  organizationName: varchar('organization_name', { length: 255 }),
  applicationStatus: mysqlEnum('application_status', ['pending', 'approved', 'rejected']),
  agreementSigned: boolean('agreement_signed').default(false),
  agreementDate: date('agreement_date'),
  licenseFee: decimal('license_fee', { precision: 10, scale: 2 }),
  royaltyPercentage: decimal('royalty_percentage', { precision: 5, scale: 2 }),
  territory: varchar('territory', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type Franchise = typeof franchises.$inferSelect;
export type InsertFranchise = typeof franchises.$inferInsert;

// Nutrition Logs
export const nutritionLogs = mysqlTable('nutrition_logs', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id'),
  logDate: date('log_date'),
  mealType: mysqlEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']),
  sourceType: mysqlEnum('source_type', ['cafe_order', 'recipe', 'manual']),
  sourceId: int('source_id'),
  foodName: varchar('food_name', { length: 255 }),
  portionSize: varchar('portion_size', { length: 50 }),
  calories: int('calories'),
  proteinG: decimal('protein_g', { precision: 5, scale: 2 }),
  carbsG: decimal('carbs_g', { precision: 5, scale: 2 }),
  fatG: decimal('fat_g', { precision: 5, scale: 2 }),
  fiberG: decimal('fiber_g', { precision: 5, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userDateIdx: index('nutrition_logs_user_date_idx').on(table.userId, table.logDate),
}));

export type NutritionLog = typeof nutritionLogs.$inferSelect;
export type InsertNutritionLog = typeof nutritionLogs.$inferInsert;

// Health Metrics
export const healthMetrics = mysqlTable('health_metrics', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id'),
  metricDate: date('metric_date'),
  weightKg: decimal('weight_kg', { precision: 5, scale: 2 }),
  bloodSugarMgDl: int('blood_sugar_mg_dl'),
  bloodPressureSystolic: int('blood_pressure_systolic'),
  bloodPressureDiastolic: int('blood_pressure_diastolic'),
  energyLevel: int('energy_level'), // 1-10 scale
  mood: int('mood'), // 1-10 scale
  sleepHours: decimal('sleep_hours', { precision: 3, scale: 1 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userDateIdx: index('health_metrics_user_date_idx').on(table.userId, table.metricDate),
}));

export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = typeof healthMetrics.$inferInsert;
