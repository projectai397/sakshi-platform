import { mysqlTable, varchar, int, decimal, text, timestamp, boolean, json, date } from 'drizzle-orm/mysql-core';

// ============================================
// COMMUNITY MEAL SPONSORSHIP SYSTEM
// ============================================

export const mealSponsorships = mysqlTable('meal_sponsorships', {
  id: int('id').primaryKey().autoincrement(),
  sponsorUserId: int('sponsor_user_id').notNull(),
  mealCount: int('meal_count').notNull(), // Number of meals sponsored
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull(),
  mealsRedeemed: int('meals_redeemed').default(0),
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, completed
  message: text('message'), // Optional message from sponsor
  isAnonymous: boolean('is_anonymous').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'), // Optional expiry date
});

export const sponsoredMealRedemptions = mysqlTable('sponsored_meal_redemptions', {
  id: int('id').primaryKey().autoincrement(),
  sponsorshipId: int('sponsorship_id').notNull(),
  recipientUserId: int('recipient_user_id'),
  orderId: int('order_id').notNull(),
  amountCovered: decimal('amount_covered', { precision: 10, scale: 2 }).notNull(),
  gratitudeNote: text('gratitude_note'), // Anonymous thank you from recipient
  redeemedAt: timestamp('redeemed_at').defaultNow(),
});

export const sponsorshipImpactBoard = mysqlTable('sponsorship_impact_board', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  date: date('date').notNull(),
  totalMealsSponsored: int('total_meals_sponsored').default(0),
  totalMealsRedeemed: int('total_meals_redeemed').default(0),
  totalAmountSponsored: decimal('total_amount_sponsored', { precision: 10, scale: 2 }).default(0),
  topSponsorMessage: text('top_sponsor_message'), // Featured message of the day
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// FARM-TO-TABLE TRANSPARENCY CHAIN
// ============================================

export const farmers = mysqlTable('farmers', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  farmName: varchar('farm_name', { length: 255 }),
  location: varchar('location', { length: 255 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  photo: varchar('photo', { length: 500 }),
  story: text('story'),
  certifications: json('certifications'), // organic, biodynamic, etc.
  contactPhone: varchar('contact_phone', { length: 20 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  farmSize: varchar('farm_size', { length: 100 }), // e.g., "5 acres"
  farmingMethod: varchar('farming_method', { length: 100 }), // organic, natural, conventional
  yearsOfExperience: int('years_of_experience'),
  specialties: json('specialties'), // ["tomatoes", "leafy greens"]
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ingredientSources = mysqlTable('ingredient_sources', {
  id: int('id').primaryKey().autoincrement(),
  ingredientName: varchar('ingredient_name', { length: 255 }).notNull(),
  farmerId: int('farmer_id').notNull(),
  harvestDate: date('harvest_date'),
  deliveryDate: date('delivery_date'),
  quantity: decimal('quantity', { precision: 10, scale: 2 }),
  unit: varchar('unit', { length: 50 }), // kg, liters, etc.
  pricePerUnit: decimal('price_per_unit', { precision: 10, scale: 2 }),
  marketPricePerUnit: decimal('market_price_per_unit', { precision: 10, scale: 2 }),
  fairPricePremium: decimal('fair_price_premium', { precision: 5, scale: 2 }), // percentage
  qualityGrade: varchar('quality_grade', { length: 50 }), // A, B, C or premium, standard
  isOrganic: boolean('is_organic').default(false),
  isSeasonal: boolean('is_seasonal').default(true),
  batchNumber: varchar('batch_number', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const menuItemIngredients = mysqlTable('menu_item_ingredients', {
  id: int('id').primaryKey().autoincrement(),
  menuItemId: int('menu_item_id').notNull(),
  ingredientSourceId: int('ingredient_source_id').notNull(),
  quantityUsed: decimal('quantity_used', { precision: 10, scale: 2 }),
  unit: varchar('unit', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const farmerTips = mysqlTable('farmer_tips', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull(),
  farmerId: int('farmer_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  message: text('message'),
  orderId: int('order_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// ZERO-WASTE KITCHEN DASHBOARD
// ============================================

export const wasteTracking = mysqlTable('waste_tracking', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  date: date('date').notNull(),
  wasteCategory: varchar('waste_category', { length: 100 }).notNull(), // spoilage, prep_waste, customer_leftover, expired
  itemName: varchar('item_name', { length: 255 }),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  reason: text('reason'),
  preventable: boolean('preventable').default(true),
  staffMemberId: int('staff_member_id'),
  photo: varchar('photo', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const compostTracking = mysqlTable('compost_tracking', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  date: date('date').notNull(),
  weightKg: decimal('weight_kg', { precision: 10, scale: 2 }).notNull(),
  compostMethod: varchar('compost_method', { length: 100 }), // aerobic, bokashi, vermicompost
  maturityDate: date('maturity_date'), // When compost will be ready
  usedFor: varchar('used_for', { length: 255 }), // garden, donated, sold
  createdAt: timestamp('created_at').defaultNow(),
});

export const foodDonations = mysqlTable('food_donations', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  date: date('date').notNull(),
  recipientOrganization: varchar('recipient_organization', { length: 255 }).notNull(),
  itemsDescription: text('items_description').notNull(),
  estimatedMeals: int('estimated_meals'),
  estimatedValue: decimal('estimated_value', { precision: 10, scale: 2 }),
  pickupTime: timestamp('pickup_time'),
  deliveredBy: varchar('delivered_by', { length: 255 }),
  recipientContact: varchar('recipient_contact', { length: 100 }),
  photo: varchar('photo', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const customerPortionFeedback = mysqlTable('customer_portion_feedback', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('order_id').notNull(),
  menuItemId: int('menu_item_id').notNull(),
  customerId: int('customer_id'),
  portionSize: varchar('portion_size', { length: 50 }).notNull(), // too_much, just_right, too_little
  wasteEstimate: varchar('waste_estimate', { length: 50 }), // none, quarter, half, most
  comments: text('comments'),
  photo: varchar('photo', { length: 500 }), // Photo of leftover food
  createdAt: timestamp('created_at').defaultNow(),
});

export const wasteReductionChallenges = mysqlTable('waste_reduction_challenges', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  challengeName: varchar('challenge_name', { length: 255 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  targetWastePercentage: decimal('target_waste_percentage', { precision: 5, scale: 2 }),
  actualWastePercentage: decimal('actual_waste_percentage', { precision: 5, scale: 2 }),
  teamLeader: int('team_leader_id'),
  participants: json('participants'), // Array of staff IDs
  reward: varchar('reward', { length: 255 }),
  status: varchar('status', { length: 50 }).default('active'), // active, completed, failed
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// AYURVEDIC MEAL CUSTOMIZATION ENGINE
// ============================================

export const customerDoshaProfiles = mysqlTable('customer_dosha_profiles', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull().unique(),
  primaryDosha: varchar('primary_dosha', { length: 50 }).notNull(), // vata, pitta, kapha
  secondaryDosha: varchar('secondary_dosha', { length: 50 }),
  constitution: varchar('constitution', { length: 100 }), // vata-pitta, pitta-kapha, etc.
  currentImbalances: json('current_imbalances'), // ["excess_pitta", "low_agni"]
  dietaryRestrictions: json('dietary_restrictions'),
  allergies: json('allergies'),
  healthGoals: json('health_goals'), // ["weight_loss", "better_digestion", "more_energy"]
  digestiveFire: varchar('digestive_fire', { length: 50 }), // strong, moderate, weak
  assessmentDate: date('assessment_date'),
  reassessmentDue: date('reassessment_due'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const doshaCheckIns = mysqlTable('dosha_check_ins', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull(),
  checkInDate: date('check_in_date').notNull(),
  currentFeeling: varchar('current_feeling', { length: 100 }), // stressed, tired, energetic, balanced
  sleepQuality: varchar('sleep_quality', { length: 50 }), // poor, fair, good, excellent
  digestionQuality: varchar('digestion_quality', { length: 50 }),
  energyLevel: int('energy_level'), // 1-10 scale
  stressLevel: int('stress_level'), // 1-10 scale
  weatherCondition: varchar('weather_condition', { length: 100 }),
  seasonalInfluence: varchar('seasonal_influence', { length: 100 }),
  recommendedDoshaFocus: varchar('recommended_dosha_focus', { length: 50 }), // pacify_vata, pacify_pitta, etc.
  createdAt: timestamp('created_at').defaultNow(),
});

export const mealDoshaRatings = mysqlTable('meal_dosha_ratings', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('order_id').notNull(),
  customerId: int('customer_id').notNull(),
  postMealFeeling: varchar('post_meal_feeling', { length: 100 }), // energized, heavy, balanced, uncomfortable
  digestionExperience: varchar('digestion_experience', { length: 100 }),
  satisfactionLevel: int('satisfaction_level'), // 1-10
  wouldOrderAgain: boolean('would_order_again'),
  doshaBalance: varchar('dosha_balance', { length: 100 }), // felt_balanced, felt_imbalanced
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// CONSCIOUS DINING EXPERIENCE TRACKER
// ============================================

export const mindfulEatingSessions = mysqlTable('mindful_eating_sessions', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull(),
  orderId: int('order_id'),
  sessionDate: timestamp('session_date').notNull(),
  mealDuration: int('meal_duration'), // minutes
  meditationCompleted: boolean('meditation_completed').default(false),
  meditationDuration: int('meditation_duration'), // minutes
  gratitudeJournalEntry: text('gratitude_journal_entry'),
  mindfulnessScore: int('mindfulness_score'), // 1-10 self-assessment
  distractionsCount: int('distractions_count'), // phone checks, conversations
  chewingPace: varchar('chewing_pace', { length: 50 }), // slow, moderate, fast
  plateCleanPhoto: varchar('plate_clean_photo', { length: 500 }),
  wasteAmount: varchar('waste_amount', { length: 50 }), // none, minimal, some, significant
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const gratitudeNotes = mysqlTable('gratitude_notes', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull(),
  noteText: text('note_text').notNull(),
  isPublic: boolean('is_public').default(false),
  category: varchar('category', { length: 100 }), // food, farmer, chef, community, health
  relatedOrderId: int('related_order_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// REGENERATIVE DINING CREDITS
// ============================================

export const regenerativeActions = mysqlTable('regenerative_actions', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull(),
  actionType: varchar('action_type', { length: 100 }).notNull(), // bring_container, bicycle_delivery, off_peak_dining, volunteer, referral, review, social_share, attendance_streak
  actionDate: timestamp('action_date').notNull(),
  sevaTokensEarned: int('seva_tokens_earned').notNull(),
  carbonSavedKg: decimal('carbon_saved_kg', { precision: 10, scale: 2 }),
  relatedOrderId: int('related_order_id'),
  relatedEventId: int('related_event_id'),
  verificationPhoto: varchar('verification_photo', { length: 500 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const attendanceStreaks = mysqlTable('attendance_streaks', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull(),
  currentStreak: int('current_streak').default(0),
  longestStreak: int('longest_streak').default(0),
  lastVisitDate: date('last_visit_date'),
  totalVisits: int('total_visits').default(0),
  streakBonusEarned: int('streak_bonus_earned').default(0),
  milestones: json('milestones'), // [{"visits": 10, "date": "2025-01-15", "reward": "100 tokens"}]
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// NUTRITION IMPACT PASSPORT
// ============================================

export const nutritionPassports = mysqlTable('nutrition_passports', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull().unique(),
  totalMealsEaten: int('total_meals_eaten').default(0),
  totalPlantBasedMeals: int('total_plant_based_meals').default(0),
  cumulativeCalories: decimal('cumulative_calories', { precision: 12, scale: 2 }).default(0),
  cumulativeProtein: decimal('cumulative_protein', { precision: 10, scale: 2 }).default(0),
  cumulativeFiber: decimal('cumulative_fiber', { precision: 10, scale: 2 }).default(0),
  cumulativeVitamins: json('cumulative_vitamins'), // {"vitamin_c": 5000, "vitamin_a": 3000}
  cumulativeMinerals: json('cumulative_minerals'),
  carbonFootprintSaved: decimal('carbon_footprint_saved', { precision: 10, scale: 2 }).default(0), // kg CO2
  waterSaved: decimal('water_saved', { precision: 12, scale: 2 }).default(0), // liters
  animalLivesSpared: decimal('animal_lives_spared', { precision: 10, scale: 2 }).default(0),
  milestones: json('milestones'),
  healthBiomarkers: json('health_biomarkers'), // optional integration with health apps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const impactMilestones = mysqlTable('impact_milestones', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull(),
  milestoneType: varchar('milestone_type', { length: 100 }).notNull(), // meals_eaten, carbon_saved, water_saved, animals_spared
  milestoneValue: int('milestone_value').notNull(), // 50 meals, 100kg CO2, etc.
  achievedDate: date('achieved_date').notNull(),
  reward: varchar('reward', { length: 255 }),
  shareableGraphic: varchar('shareable_graphic', { length: 500 }),
  isShared: boolean('is_shared').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// SOCIAL IMPACT DASHBOARD (Customer-Facing)
// ============================================

export const customerImpactScores = mysqlTable('customer_impact_scores', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull().unique(),
  overallImpactScore: int('overall_impact_score').default(0), // Composite score 0-1000
  environmentalScore: int('environmental_score').default(0),
  socialScore: int('social_score').default(0),
  healthScore: int('health_score').default(0),
  communityScore: int('community_score').default(0),
  mealsSponsoredCount: int('meals_sponsored_count').default(0),
  farmersSupportedCount: int('farmers_supported_count').default(0),
  volunteerHours: decimal('volunteer_hours', { precision: 10, scale: 2 }).default(0),
  skillsShared: int('skills_shared').default(0),
  itemsRepairedSwapped: int('items_repaired_swapped').default(0),
  treeEquivalent: int('tree_equivalent').default(0), // CO2 saved = X trees planted
  lastCalculated: timestamp('last_calculated').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const impactComparisons = mysqlTable('impact_comparisons', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull(),
  comparisonType: varchar('comparison_type', { length: 100 }).notNull(), // trees_planted, car_miles_saved, showers_saved
  comparisonValue: decimal('comparison_value', { precision: 10, scale: 2 }).notNull(),
  comparisonText: varchar('comparison_text', { length: 500 }).notNull(), // "Equal to planting 50 trees"
  calculationDate: date('calculation_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
