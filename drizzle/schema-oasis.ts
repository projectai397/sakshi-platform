import {
  mysqlTable,
  varchar,
  text,
  int,
  decimal,
  datetime,
  boolean,
  json,
  timestamp,
} from 'drizzle-orm/mysql-core';

// Oasis Therapy Rooms and Equipment
export const oasisRooms = mysqlTable('oasis_rooms', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(), // References cafe_locations
  roomName: varchar('room_name', { length: 100 }).notNull(),
  roomType: varchar('room_type', { length: 50 }).notNull(), // 'pranam', 'charan_sparsh', 'sparsh_chikitsa', etc.
  capacity: int('capacity').notNull(),
  isActive: boolean('is_active').default(true),
  equipment: json('equipment').$type<string[]>(), // List of equipment in room
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Oasis Sessions (user visits)
export const oasisSessions = mysqlTable('oasis_sessions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  locationId: int('location_id').notNull(),
  sessionType: varchar('session_type', { length: 50 }).notNull(), // 'first_visit', 'regular', 'private', 'group'
  startTime: datetime('start_time').notNull(),
  endTime: datetime('end_time'),
  duration: int('duration'), // minutes
  
  // Pre-session data
  doshaType: varchar('dosha_type', { length: 20 }), // 'vata', 'pitta', 'kapha', 'vata-pitta', etc.
  currentMood: varchar('current_mood', { length: 50 }), // 'stressed', 'anxious', 'tired', 'energetic', 'calm'
  stressLevel: int('stress_level'), // 1-10
  energyLevel: int('energy_level'), // 1-10
  healthGoals: json('health_goals').$type<string[]>(),
  
  // Session data
  therapiesCompleted: json('therapies_completed').$type<{
    therapyType: string;
    duration: number;
    roomId: number;
    startTime: string;
    endTime: string;
  }[]>(),
  
  // Post-session data
  postStressLevel: int('post_stress_level'), // 1-10
  postEnergyLevel: int('post_energy_level'), // 1-10
  relaxationScore: int('relaxation_score'), // 0-100 (AI calculated)
  meditationDepth: int('meditation_depth'), // 0-100 (AI calculated)
  
  // Biometric data summary
  avgHeartRate: int('avg_heart_rate'),
  avgBreathRate: int('avg_breath_rate'),
  hrvImprovement: decimal('hrv_improvement', { precision: 5, scale: 2 }), // percentage
  
  // Feedback
  userRating: int('user_rating'), // 1-5
  feedback: text('feedback'),
  
  // Payment
  pricingTier: varchar('pricing_tier', { length: 20 }), // 'community', 'fair', 'supporter'
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }),
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Individual Therapy Experiences
export const therapyExperiences = mysqlTable('therapy_experiences', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: int('session_id').notNull(),
  userId: int('user_id').notNull(),
  roomId: int('room_id').notNull(),
  therapyType: varchar('therapy_type', { length: 50 }).notNull(), // 'pranam', 'charan_sparsh', 'sparsh_chikitsa', etc.
  
  startTime: datetime('start_time').notNull(),
  endTime: datetime('end_time').notNull(),
  duration: int('duration').notNull(), // minutes
  
  // Therapy-specific data (JSON for flexibility)
  therapyData: json('therapy_data').$type<{
    // For Charan Sparsh
    steps?: number;
    avgStepDuration?: number;
    patternType?: string;
    
    // For Sparsh Chikitsa
    mudraType?: string;
    vibrationIntensity?: number;
    marmaPointsActivated?: string[];
    
    // For Prithvi Santulan
    frequencyUsed?: number;
    chakrasFocused?: string[];
    groundingScore?: number;
    
    // For Sangam
    participantCount?: number;
    harmonyScore?: number;
    omDuration?: number;
    
    // For Dhyana Kendra
    sceneSelected?: string;
    posture?: string;
    stillnessScore?: number;
    
    // For Jal Chikitsa
    waterTemp?: number;
    herbsUsed?: string[];
    soakDuration?: number;
    
    // For Pranayama
    breathTechnique?: string;
    breathsPerMinute?: number;
    hrvBefore?: number;
    hrvAfter?: number;
    
    // For Nada Yoga
    instrumentsUsed?: string[];
    chakraSequence?: string[];
    vibrationIntensity?: number;
    
    // For Drishti Dhyana
    gazeTarget?: string;
    blinkRate?: number;
    focusDuration?: number;
    
    // For Yoga Nidra
    brainwaveState?: string;
    deepestState?: string;
    awakeDuration?: number;
    
    // For Sankalp
    intentionText?: string;
    intentionCategory?: string;
  }>(),
  
  // Biometric readings during therapy
  biometricData: json('biometric_data').$type<{
    heartRateReadings?: number[];
    breathRateReadings?: number[];
    eegReadings?: { timestamp: string; alpha: number; theta: number; delta: number }[];
    temperatureReadings?: number[];
  }>(),
  
  // AI insights
  aiInsights: text('ai_insights'),
  improvementScore: int('improvement_score'), // 0-100
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Oasis Memberships
export const oasisMemberships = mysqlTable('oasis_memberships', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  membershipTier: varchar('membership_tier', { length: 20 }).notNull(), // 'community', 'fair', 'supporter'
  
  startDate: datetime('start_date').notNull(),
  endDate: datetime('end_date'),
  isActive: boolean('is_active').default(true),
  
  // Pricing
  monthlyFee: decimal('monthly_fee', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  
  // Usage limits
  visitsPerMonth: int('visits_per_month'), // null for unlimited
  visitsUsed: int('visits_used').default(0),
  
  // Benefits
  accessToTherapies: json('access_to_therapies').$type<string[]>(),
  canBookPrivate: boolean('can_book_private').default(false),
  guestPassesPerMonth: int('guest_passes_per_month').default(0),
  guestPassesUsed: int('guest_passes_used').default(0),
  
  // Auto-renewal
  autoRenew: boolean('auto_renew').default(true),
  nextBillingDate: datetime('next_billing_date'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Oasis Bookings
export const oasisBookings = mysqlTable('oasis_bookings', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  locationId: int('location_id').notNull(),
  roomId: int('room_id'),
  
  bookingType: varchar('booking_type', { length: 50 }).notNull(), // 'individual', 'group', 'private'
  therapyType: varchar('therapy_type', { length: 50 }), // Specific therapy or 'full_experience'
  
  scheduledDate: datetime('scheduled_date').notNull(),
  scheduledTime: varchar('scheduled_time', { length: 10 }).notNull(), // '10:00', '14:30'
  duration: int('duration').notNull(), // minutes
  
  status: varchar('status', { length: 20 }).default('confirmed'), // 'confirmed', 'completed', 'cancelled', 'no_show'
  
  // Group booking
  groupSize: int('group_size').default(1),
  groupMembers: json('group_members').$type<{ userId?: number; name: string; email?: string }[]>(),
  
  // Payment
  pricingTier: varchar('pricing_tier', { length: 20 }),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }),
  paymentStatus: varchar('payment_status', { length: 20 }).default('pending'),
  
  // Reminders
  reminderSent: boolean('reminder_sent').default(false),
  reminderSentAt: datetime('reminder_sent_at'),
  
  // Cancellation
  cancelledAt: datetime('cancelled_at'),
  cancellationReason: text('cancellation_reason'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// User Wellness Progress
export const wellnessProgress = mysqlTable('wellness_progress', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  
  // Dosha tracking
  primaryDosha: varchar('primary_dosha', { length: 20 }),
  secondaryDosha: varchar('secondary_dosha', { length: 20 }),
  doshaBalance: json('dosha_balance').$type<{ vata: number; pitta: number; kapha: number }>(),
  lastDoshaAssessment: datetime('last_dosha_assessment'),
  
  // Progress metrics
  totalSessions: int('total_sessions').default(0),
  totalMinutes: int('total_minutes').default(0),
  currentStreak: int('current_streak').default(0), // consecutive days
  longestStreak: int('longest_streak').default(0),
  
  // Health improvements
  avgStressReduction: decimal('avg_stress_reduction', { precision: 5, scale: 2 }), // percentage
  avgEnergyIncrease: decimal('avg_energy_increase', { precision: 5, scale: 2 }),
  avgRelaxationScore: decimal('avg_relaxation_score', { precision: 5, scale: 2 }),
  avgMeditationDepth: decimal('avg_meditation_depth', { precision: 5, scale: 2 }),
  
  // Biometric improvements
  hrvImprovement: decimal('hrv_improvement', { precision: 5, scale: 2 }), // percentage
  breathCoherence: decimal('breath_coherence', { precision: 5, scale: 2 }),
  sleepQualityScore: int('sleep_quality_score'), // 0-100
  
  // Favorite therapies
  favoriteTherapies: json('favorite_therapies').$type<{ therapy: string; count: number }[]>(),
  
  // Goals and achievements
  goalsSet: json('goals_set').$type<{ goal: string; targetDate: string; achieved: boolean }[]>(),
  achievementsUnlocked: json('achievements_unlocked').$type<string[]>(),
  
  // Seva tokens earned through wellness
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Oasis Staff
export const oasisStaff = mysqlTable('oasis_staff', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  locationId: int('location_id').notNull(),
  
  role: varchar('role', { length: 50 }).notNull(), // 'wellness_guide', 'therapy_specialist', 'manager', 'receptionist'
  specializations: json('specializations').$type<string[]>(), // Therapies they can guide
  
  certifications: json('certifications').$type<{
    name: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate?: string;
  }[]>(),
  
  bio: text('bio'),
  photoUrl: varchar('photo_url', { length: 500 }),
  
  // Availability
  workingDays: json('working_days').$type<string[]>(), // ['monday', 'tuesday', ...]
  workingHours: json('working_hours').$type<{ start: string; end: string }>(),
  
  isActive: boolean('is_active').default(true),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Oasis Content (guided meditations, audio, visuals)
export const oasisContent = mysqlTable('oasis_content', {
  id: int('id').primaryKey().autoincrement(),
  contentType: varchar('content_type', { length: 50 }).notNull(), // 'guided_meditation', 'visual_scene', 'audio_track', 'pranayama_guide'
  therapyType: varchar('therapy_type', { length: 50 }).notNull(),
  
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  
  // Content details
  duration: int('duration'), // seconds
  language: varchar('language', { length: 20 }).default('hindi'),
  narrator: varchar('narrator', { length: 100 }),
  
  // Dosha suitability
  suitableForVata: boolean('suitable_for_vata').default(true),
  suitableForPitta: boolean('suitable_for_pitta').default(true),
  suitableForKapha: boolean('suitable_for_kapha').default(true),
  
  // File URLs
  audioUrl: varchar('audio_url', { length: 500 }),
  videoUrl: varchar('video_url', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  
  // Metadata
  tags: json('tags').$type<string[]>(),
  difficulty: varchar('difficulty', { length: 20 }), // 'beginner', 'intermediate', 'advanced'
  
  // Usage stats
  timesUsed: int('times_used').default(0),
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }),
  
  isActive: boolean('is_active').default(true),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Oasis Equipment Inventory
export const oasisEquipment = mysqlTable('oasis_equipment', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  roomId: int('room_id'),
  
  equipmentName: varchar('equipment_name', { length: 200 }).notNull(),
  equipmentType: varchar('equipment_type', { length: 50 }).notNull(), // 'singing_bowl', 'projector', 'sensor', 'wearable', etc.
  
  brand: varchar('brand', { length: 100 }),
  model: varchar('model', { length: 100 }),
  serialNumber: varchar('serial_number', { length: 100 }),
  
  purchaseDate: datetime('purchase_date'),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }),
  warrantyExpiry: datetime('warranty_expiry'),
  
  status: varchar('status', { length: 20 }).default('active'), // 'active', 'maintenance', 'retired'
  
  // Maintenance
  lastMaintenanceDate: datetime('last_maintenance_date'),
  nextMaintenanceDate: datetime('next_maintenance_date'),
  maintenanceNotes: text('maintenance_notes'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Oasis Intentions (Sankalp)
export const oasisIntentions = mysqlTable('oasis_intentions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  sessionId: int('session_id'),
  
  intentionText: text('intention_text').notNull(),
  category: varchar('category', { length: 50 }), // 'health', 'relationships', 'career', 'spiritual', 'personal_growth'
  
  isPublic: boolean('is_public').default(false), // Show on community wall (anonymized)
  
  targetDate: datetime('target_date'),
  achieved: boolean('achieved').default(false),
  achievedDate: datetime('achieved_date'),
  
  // Tracking
  checkIns: json('check_ins').$type<{ date: string; progress: number; notes: string }[]>(),
  
  // AI support
  aiReminders: boolean('ai_reminders').default(true),
  lastReminderSent: datetime('last_reminder_sent'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Oasis Group Sessions
export const oasisGroupSessions = mysqlTable('oasis_group_sessions', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  roomId: int('room_id').notNull(),
  staffId: int('staff_id'), // Guide/facilitator
  
  sessionName: varchar('session_name', { length: 200 }).notNull(),
  sessionType: varchar('session_type', { length: 50 }).notNull(), // 'sangam', 'group_meditation', 'kirtan', 'yoga_nidra'
  
  scheduledDate: datetime('scheduled_date').notNull(),
  scheduledTime: varchar('scheduled_time', { length: 10 }).notNull(),
  duration: int('duration').notNull(), // minutes
  
  maxParticipants: int('max_participants').notNull(),
  currentParticipants: int('current_participants').default(0),
  
  description: text('description'),
  
  // Pricing
  communityPrice: decimal('community_price', { precision: 10, scale: 2 }).default(0),
  fairPrice: decimal('fair_price', { precision: 10, scale: 2 }),
  supporterPrice: decimal('supporter_price', { precision: 10, scale: 2 }),
  
  status: varchar('status', { length: 20 }).default('scheduled'), // 'scheduled', 'in_progress', 'completed', 'cancelled'
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Oasis Group Participants
export const oasisGroupParticipants = mysqlTable('oasis_group_participants', {
  id: int('id').primaryKey().autoincrement(),
  groupSessionId: int('group_session_id').notNull(),
  userId: int('user_id').notNull(),
  
  registeredAt: datetime('registered_at'),
  attended: boolean('attended').default(false),
  
  pricingTier: varchar('pricing_tier', { length: 20 }),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }),
  
  feedback: text('feedback'),
  rating: int('rating'), // 1-5
  
  sevaTokensEarned: int('seva_tokens_earned').default(0),
});
