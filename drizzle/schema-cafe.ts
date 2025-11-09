import { pgTable, serial, varchar, text, integer, decimal, boolean, timestamp, jsonb, date, index } from 'drizzle-orm/pg-core';
import { users } from './schema';

// Cafe Locations
export const cafeLocations = pgTable('cafe_locations', {
  id: serial('id').primaryKey(),
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
  hoursOfOperation: jsonb('hours_of_operation'), // {monday: "9:00-21:00", ...}
  seatingCapacity: integer('seating_capacity'),
  isActive: boolean('is_active').default(true),
  franchiseId: integer('franchise_id').references(() => franchises.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Menu Items
export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }), // breakfast, lunch, dinner, snack, beverage, dessert
  imageUrl: varchar('image_url', { length: 500 }),
  preparationTime: integer('preparation_time'), // minutes
  servingSize: varchar('serving_size', { length: 50 }),
  calories: integer('calories'),
  proteinG: decimal('protein_g', { precision: 5, scale: 2 }),
  carbsG: decimal('carbs_g', { precision: 5, scale: 2 }),
  fatG: decimal('fat_g', { precision: 5, scale: 2 }),
  fiberG: decimal('fiber_g', { precision: 5, scale: 2 }),
  ayurvedicProperties: jsonb('ayurvedic_properties'), // {doshaBalance: "vata-pacifying", taste: ["sweet", "bitter"], ...}
  allergens: jsonb('allergens').$type<string[]>(),
  communityPrice: decimal('community_price', { precision: 10, scale: 2 }),
  fairPrice: decimal('fair_price', { precision: 10, scale: 2 }),
  supporterPrice: decimal('supporter_price', { precision: 10, scale: 2 }),
  isAvailable: boolean('is_available').default(true),
  recipeId: integer('recipe_id').references(() => recipes.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('menu_items_category_idx').on(table.category),
  availableIdx: index('menu_items_available_idx').on(table.isAvailable),
}));

// Recipes
export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  authorId: integer('author_id').references(() => users.id),
  category: varchar('category', { length: 50 }),
  cuisine: varchar('cuisine', { length: 50 }),
  difficulty: varchar('difficulty', { length: 20 }), // easy, medium, hard
  prepTime: integer('prep_time'), // minutes
  cookTime: integer('cook_time'),
  servings: integer('servings'),
  ingredients: jsonb('ingredients'), // [{name: "carrots", quantity: "2", unit: "cups"}, ...]
  instructions: jsonb('instructions'), // [{step: 1, text: "...", imageUrl: "..."}, ...]
  nutritionalInfo: jsonb('nutritional_info'),
  ayurvedicInfo: jsonb('ayurvedic_info'),
  tags: jsonb('tags').$type<string[]>(),
  imageUrl: varchar('image_url', { length: 500 }),
  videoUrl: varchar('video_url', { length: 500 }),
  isApproved: boolean('is_approved').default(false),
  ratingAvg: decimal('rating_avg', { precision: 3, scale: 2 }),
  ratingCount: integer('rating_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('recipes_category_idx').on(table.category),
  approvedIdx: index('recipes_approved_idx').on(table.isApproved),
  authorIdx: index('recipes_author_idx').on(table.authorId),
}));

// Cafe Orders
export const cafeOrders = pgTable('cafe_orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  orderType: varchar('order_type', { length: 20 }), // dine-in, delivery, pickup, catering
  cafeLocationId: integer('cafe_location_id').references(() => cafeLocations.id),
  deliveryAddress: text('delivery_address'),
  deliveryLatitude: decimal('delivery_latitude', { precision: 10, scale: 8 }),
  deliveryLongitude: decimal('delivery_longitude', { precision: 11, scale: 8 }),
  scheduledTime: timestamp('scheduled_time'),
  items: jsonb('items'), // [{menuItemId: 1, quantity: 2, priceTier: "fair", customizations: "no onions"}, ...]
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentStatus: varchar('payment_status', { length: 20 }),
  orderStatus: varchar('order_status', { length: 20 }), // pending, confirmed, preparing, ready, delivered, cancelled
  specialInstructions: text('special_instructions'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('cafe_orders_user_idx').on(table.userId),
  statusIdx: index('cafe_orders_status_idx').on(table.orderStatus),
  typeIdx: index('cafe_orders_type_idx').on(table.orderType),
}));

// Cooking Classes
export const cookingClasses = pgTable('cooking_classes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  instructorId: integer('instructor_id').references(() => users.id),
  classType: varchar('class_type', { length: 20 }), // in-person, virtual
  cafeLocationId: integer('cafe_location_id').references(() => cafeLocations.id),
  dateTime: timestamp('date_time'),
  duration: integer('duration'), // minutes
  maxParticipants: integer('max_participants'),
  currentParticipants: integer('current_participants').default(0),
  communityPrice: decimal('community_price', { precision: 10, scale: 2 }),
  fairPrice: decimal('fair_price', { precision: 10, scale: 2 }),
  supporterPrice: decimal('supporter_price', { precision: 10, scale: 2 }),
  ingredientsList: text('ingredients_list'),
  equipmentNeeded: text('equipment_needed'),
  skillLevel: varchar('skill_level', { length: 20 }),
  imageUrl: varchar('image_url', { length: 500 }),
  videoUrl: varchar('video_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  dateIdx: index('cooking_classes_date_idx').on(table.dateTime),
  activeIdx: index('cooking_classes_active_idx').on(table.isActive),
}));

// Class Registrations
export const classRegistrations = pgTable('class_registrations', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => cookingClasses.id),
  userId: integer('user_id').references(() => users.id),
  priceTier: varchar('price_tier', { length: 20 }),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }),
  paymentStatus: varchar('payment_status', { length: 20 }),
  attendanceStatus: varchar('attendance_status', { length: 20 }), // registered, attended, no-show
  certificateIssued: boolean('certificate_issued').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  classIdx: index('class_registrations_class_idx').on(table.classId),
  userIdx: index('class_registrations_user_idx').on(table.userId),
}));

// Meal Subscriptions
export const mealSubscriptions = pgTable('meal_subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  frequency: varchar('frequency', { length: 20 }), // daily, weekly, bi-weekly
  mealsPerDelivery: integer('meals_per_delivery'),
  deliveryAddress: text('delivery_address'),
  deliveryTimePreference: varchar('delivery_time_preference', { length: 50 }),
  priceTier: varchar('price_tier', { length: 20 }),
  mealPreferences: jsonb('meal_preferences'), // {categories: ["breakfast", "lunch"], excludeIngredients: ["mushrooms"], ...}
  status: varchar('status', { length: 20 }), // active, paused, cancelled
  nextDeliveryDate: date('next_delivery_date'),
  billingCycleStart: date('billing_cycle_start'),
  amountPerCycle: decimal('amount_per_cycle', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('meal_subscriptions_user_idx').on(table.userId),
  statusIdx: index('meal_subscriptions_status_idx').on(table.status),
}));

// Subscription Deliveries
export const subscriptionDeliveries = pgTable('subscription_deliveries', {
  id: serial('id').primaryKey(),
  subscriptionId: integer('subscription_id').references(() => mealSubscriptions.id),
  deliveryDate: date('delivery_date'),
  items: jsonb('items'), // [{menuItemId: 1, quantity: 1}, ...]
  status: varchar('status', { length: 20 }), // scheduled, delivered, skipped
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  subscriptionIdx: index('subscription_deliveries_subscription_idx').on(table.subscriptionId),
  dateIdx: index('subscription_deliveries_date_idx').on(table.deliveryDate),
}));

// Franchises
export const franchises = pgTable('franchises', {
  id: serial('id').primaryKey(),
  franchiseeName: varchar('franchisee_name', { length: 255 }),
  franchiseeEmail: varchar('franchisee_email', { length: 255 }),
  franchiseePhone: varchar('franchisee_phone', { length: 20 }),
  organizationName: varchar('organization_name', { length: 255 }),
  applicationStatus: varchar('application_status', { length: 20 }), // pending, approved, rejected
  agreementSigned: boolean('agreement_signed').default(false),
  agreementDate: date('agreement_date'),
  licenseFee: decimal('license_fee', { precision: 10, scale: 2 }),
  royaltyPercentage: decimal('royalty_percentage', { precision: 5, scale: 2 }),
  territory: varchar('territory', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Nutrition Logs
export const nutritionLogs = pgTable('nutrition_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  logDate: date('log_date'),
  mealType: varchar('meal_type', { length: 20 }), // breakfast, lunch, dinner, snack
  sourceType: varchar('source_type', { length: 20 }), // cafe_order, recipe, manual
  sourceId: integer('source_id'),
  foodName: varchar('food_name', { length: 255 }),
  portionSize: varchar('portion_size', { length: 50 }),
  calories: integer('calories'),
  proteinG: decimal('protein_g', { precision: 5, scale: 2 }),
  carbsG: decimal('carbs_g', { precision: 5, scale: 2 }),
  fatG: decimal('fat_g', { precision: 5, scale: 2 }),
  fiberG: decimal('fiber_g', { precision: 5, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userDateIdx: index('nutrition_logs_user_date_idx').on(table.userId, table.logDate),
}));

// Health Metrics
export const healthMetrics = pgTable('health_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  metricDate: date('metric_date'),
  weightKg: decimal('weight_kg', { precision: 5, scale: 2 }),
  bloodSugarMgDl: integer('blood_sugar_mg_dl'),
  bloodPressureSystolic: integer('blood_pressure_systolic'),
  bloodPressureDiastolic: integer('blood_pressure_diastolic'),
  energyLevel: integer('energy_level'), // 1-10 scale
  mood: integer('mood'), // 1-10 scale
  sleepHours: decimal('sleep_hours', { precision: 3, scale: 1 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userDateIdx: index('health_metrics_user_date_idx').on(table.userId, table.metricDate),
}));
