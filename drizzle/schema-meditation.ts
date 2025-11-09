import { mysqlTable, varchar, int, decimal, text, timestamp, boolean, json, index } from 'drizzle-orm/mysql-core';

// ==========================================
// MEDITATION TECHNOLOGY SCHEMA
// ==========================================
// AI Camera, VR, Biometric, AR features for Sakshi Meditation Centers

// ------------------------------------------
// 1. MEDITATION SESSIONS
// ------------------------------------------

export const meditationSessions = mysqlTable('meditation_sessions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  locationId: int('location_id'),
  sessionType: varchar('session_type', { length: 50 }).notNull(), // 'ai_camera', 'vr', 'biometric', 'ar_mobile', 'hybrid'
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: int('duration'), // seconds
  
  // AI Camera Data
  postureType: varchar('posture_type', { length: 50 }), // 'padmasana', 'sukhasana', 'vajrasana', etc.
  postureQualityScore: decimal('posture_quality_score', { precision: 5, scale: 2 }), // 0-100
  stillnessPercentage: decimal('stillness_percentage', { precision: 5, scale: 2 }), // 0-100
  microMovementCount: int('micro_movement_count'),
  correctionCount: int('correction_count'),
  mudraDetected: varchar('mudra_detected', { length: 50 }), // 'gyan', 'dhyana', 'anjali', etc.
  eyesClosedPercentage: decimal('eyes_closed_percentage', { precision: 5, scale: 2 }),
  
  // VR Data
  vrEnvironment: varchar('vr_environment', { length: 100 }), // 'himalayan_peak', 'varanasi_ghat', etc.
  vrCustomizations: json('vr_customizations'), // {timeOfDay, weather, soundLevel, etc.}
  vrInteractions: int('vr_interactions'), // number of user interactions
  
  // Biometric Data
  avgHeartRate: int('avg_heart_rate'),
  avgHRV: decimal('avg_hrv', { precision: 6, scale: 2 }),
  hrvIncrease: decimal('hrv_increase', { precision: 5, scale: 2 }), // percentage
  avgBreathRate: decimal('avg_breath_rate', { precision: 4, scale: 2 }), // breaths per minute
  breathCoherence: decimal('breath_coherence', { precision: 5, scale: 2 }), // 0-100
  
  // EEG Brainwave Data
  betaPercentage: decimal('beta_percentage', { precision: 5, scale: 2 }),
  alphaPercentage: decimal('alpha_percentage', { precision: 5, scale: 2 }),
  thetaPercentage: decimal('theta_percentage', { precision: 5, scale: 2 }),
  deltaPercentage: decimal('delta_percentage', { precision: 5, scale: 2 }),
  gammaPercentage: decimal('gamma_percentage', { precision: 5, scale: 2 }),
  dominantState: varchar('dominant_state', { length: 20 }), // 'beta', 'alpha', 'theta', etc.
  
  // Composite Scores
  meditationDepthScore: decimal('meditation_depth_score', { precision: 5, scale: 2 }), // 0-100
  focusScore: decimal('focus_score', { precision: 5, scale: 2 }), // 0-100
  relaxationScore: decimal('relaxation_score', { precision: 5, scale: 2 }), // 0-100
  
  // Session Metadata
  guidedSession: boolean('guided_session').default(false),
  guideId: int('guide_id'), // instructor/guide user ID
  groupSession: boolean('group_session').default(false),
  groupId: int('group_id'),
  
  // User Feedback
  userRating: int('user_rating'), // 1-5
  userNotes: text('user_notes'),
  challengesEncountered: json('challenges_encountered'), // array of challenges
  
  // Seva Tokens
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  sessionTypeIdx: index('session_type_idx').on(table.sessionType),
  startTimeIdx: index('start_time_idx').on(table.startTime),
}));

// ------------------------------------------
// 2. BIOMETRIC READINGS (Time-series data)
// ------------------------------------------

export const biometricReadings = mysqlTable('biometric_readings', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: int('session_id').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  
  // Heart Data
  heartRate: int('heart_rate'),
  hrv: decimal('hrv', { precision: 6, scale: 2 }),
  
  // Breath Data
  breathRate: decimal('breath_rate', { precision: 4, scale: 2 }),
  breathDepth: decimal('breath_depth', { precision: 5, scale: 2 }), // 0-100
  
  // EEG Data
  beta: decimal('beta', { precision: 5, scale: 2 }),
  alpha: decimal('alpha', { precision: 5, scale: 2 }),
  theta: decimal('theta', { precision: 5, scale: 2 }),
  delta: decimal('delta', { precision: 5, scale: 2 }),
  gamma: decimal('gamma', { precision: 5, scale: 2 }),
  
  // Other Sensors
  gsr: decimal('gsr', { precision: 6, scale: 2 }), // Galvanic skin response
  temperature: decimal('temperature', { precision: 4, scale: 2 }),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  sessionIdIdx: index('session_id_idx').on(table.sessionId),
  timestampIdx: index('timestamp_idx').on(table.timestamp),
}));

// ------------------------------------------
// 3. POSTURE CORRECTIONS
// ------------------------------------------

export const postureCorrections = mysqlTable('posture_corrections', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: int('session_id').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  
  correctionType: varchar('correction_type', { length: 50 }).notNull(), // 'spine', 'shoulders', 'head', 'hips', 'hands'
  severity: varchar('severity', { length: 20 }), // 'minor', 'moderate', 'major'
  deviationDegrees: decimal('deviation_degrees', { precision: 5, scale: 2 }),
  correctionMessage: text('correction_message'),
  userResponded: boolean('user_responded').default(false),
  responseTime: int('response_time'), // seconds to correct
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  sessionIdIdx: index('session_id_idx').on(table.sessionId),
}));

// ------------------------------------------
// 4. VR ENVIRONMENTS
// ------------------------------------------

export const vrEnvironments = mysqlTable('vr_environments', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }), // 'sacred_indian', 'natural', 'abstract', 'cosmic'
  description: text('description'),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  
  // Environment Details
  location: varchar('location', { length: 200 }), // 'Himalayan Peak', 'Varanasi Ghat', etc.
  ambience: varchar('ambience', { length: 100 }), // 'peaceful', 'energizing', 'grounding'
  recommendedFor: json('recommended_for'), // ['beginners', 'advanced', 'sleep', 'focus']
  
  // Customization Options
  hasTimeOfDay: boolean('has_time_of_day').default(true),
  hasWeather: boolean('has_weather').default(false),
  hasSoundControl: boolean('has_sound_control').default(true),
  hasInteractiveElements: boolean('has_interactive_elements').default(false),
  
  // Content
  guidedMeditationCount: int('guided_meditation_count').default(0),
  soundscapeCount: int('soundscape_count').default(0),
  
  // Metadata
  difficulty: varchar('difficulty', { length: 20 }), // 'beginner', 'intermediate', 'advanced'
  duration: int('duration'), // recommended duration in seconds
  popularityScore: int('popularity_score').default(0),
  
  // Pricing
  tier: varchar('tier', { length: 20 }), // 'free', 'fair', 'supporter'
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ------------------------------------------
// 5. GUIDED MEDITATIONS
// ------------------------------------------

export const guidedMeditations = mysqlTable('guided_meditations', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  instructorName: varchar('instructor_name', { length: 100 }),
  
  // Content
  audioUrl: varchar('audio_url', { length: 500 }),
  scriptText: text('script_text'),
  language: varchar('language', { length: 20 }).default('en'), // 'en', 'hi', 'sa' (Sanskrit)
  
  // Classification
  category: varchar('category', { length: 50 }), // 'breath', 'body_scan', 'loving_kindness', 'vipassana'
  tradition: varchar('tradition', { length: 50 }), // 'buddhist', 'vedic', 'modern', 'secular'
  duration: int('duration').notNull(), // seconds
  difficulty: varchar('difficulty', { length: 20 }), // 'beginner', 'intermediate', 'advanced'
  
  // VR Integration
  vrEnvironmentId: int('vr_environment_id'),
  hasVisualCues: boolean('has_visual_cues').default(false),
  
  // Metadata
  tags: json('tags'), // ['stress', 'sleep', 'focus', 'anxiety']
  popularityScore: int('popularity_score').default(0),
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }),
  
  // Pricing
  tier: varchar('tier', { length: 20 }), // 'free', 'fair', 'supporter'
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ------------------------------------------
// 6. NEUROFEEDBACK PROTOCOLS
// ------------------------------------------

export const neurofeedbackProtocols = mysqlTable('neurofeedback_protocols', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  
  // Protocol Configuration
  targetState: varchar('target_state', { length: 50 }), // 'alpha_enhancement', 'theta_training', 'alpha_theta_crossover'
  rewardFrequency: varchar('reward_frequency', { length: 50 }), // 'alpha', 'theta', 'alpha-theta'
  inhibitFrequency: varchar('inhibit_frequency', { length: 50 }), // 'beta', 'high_beta'
  
  // Thresholds
  rewardThreshold: decimal('reward_threshold', { precision: 5, scale: 2 }),
  inhibitThreshold: decimal('inhibit_threshold', { precision: 5, scale: 2 }),
  
  // Feedback Configuration
  audioFeedbackType: varchar('audio_feedback_type', { length: 50 }), // 'pleasant_sounds', 'nature', 'silence'
  visualFeedbackType: varchar('visual_feedback_type', { length: 50 }), // 'colors', 'graphs', 'minimal'
  hapticFeedback: boolean('haptic_feedback').default(false),
  
  // Session Parameters
  recommendedDuration: int('recommended_duration'), // seconds
  minimumSessions: int('minimum_sessions'), // for effectiveness
  difficulty: varchar('difficulty', { length: 20 }),
  
  // Benefits
  benefits: json('benefits'), // array of expected benefits
  contraindications: json('contraindications'), // array of conditions to avoid
  
  // Metadata
  researchBacked: boolean('research_backed').default(false),
  researchLinks: json('research_links'),
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ------------------------------------------
// 7. USER MEDITATION PROGRESS
// ------------------------------------------

export const userMeditationProgress = mysqlTable('user_meditation_progress', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().unique(),
  
  // Overall Stats
  totalSessions: int('total_sessions').default(0),
  totalDuration: int('total_duration').default(0), // total seconds
  currentStreak: int('current_streak').default(0), // days
  longestStreak: int('longest_streak').default(0),
  lastSessionDate: timestamp('last_session_date'),
  
  // Skill Levels (0-100)
  postureSkill: decimal('posture_skill', { precision: 5, scale: 2 }).default('0'),
  stillnessSkill: decimal('stillness_skill', { precision: 5, scale: 2 }).default('0'),
  breathSkill: decimal('breath_skill', { precision: 5, scale: 2 }).default('0'),
  focusSkill: decimal('focus_skill', { precision: 5, scale: 2 }).default('0'),
  relaxationSkill: decimal('relaxation_skill', { precision: 5, scale: 2 }).default('0'),
  
  // Average Scores
  avgMeditationDepth: decimal('avg_meditation_depth', { precision: 5, scale: 2 }),
  avgStillness: decimal('avg_stillness', { precision: 5, scale: 2 }),
  avgHRVIncrease: decimal('avg_hrv_increase', { precision: 5, scale: 2 }),
  avgAlphaPercentage: decimal('avg_alpha_percentage', { precision: 5, scale: 2 }),
  avgThetaPercentage: decimal('avg_theta_percentage', { precision: 5, scale: 2 }),
  
  // Personal Bests
  bestDepthScore: decimal('best_depth_score', { precision: 5, scale: 2 }),
  bestStillness: decimal('best_stillness', { precision: 5, scale: 2 }),
  longestSession: int('longest_session'), // seconds
  
  // Preferences (learned by AI)
  preferredTime: varchar('preferred_time', { length: 20 }), // 'morning', 'afternoon', 'evening', 'night'
  optimalDuration: int('optimal_duration'), // seconds
  favoriteEnvironments: json('favorite_environments'), // array of VR environment IDs
  effectiveTechniques: json('effective_techniques'), // array of technique names
  
  // Goals
  currentGoals: json('current_goals'), // array of goal objects
  achievedGoals: json('achieved_goals'),
  
  // Achievements
  badges: json('badges'), // array of badge IDs
  milestones: json('milestones'),
  
  // Seva Tokens
  totalSevaTokens: int('total_seva_tokens').default(0),
  
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
}));

// ------------------------------------------
// 8. MEDITATION GROUPS
// ------------------------------------------

export const meditationGroups = mysqlTable('meditation_groups', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  
  // Group Details
  groupType: varchar('group_type', { length: 50 }), // 'circle', 'challenge', 'course'
  facilitatorId: int('facilitator_id'),
  maxMembers: int('max_members'),
  currentMembers: int('current_members').default(0),
  
  // Schedule
  schedule: json('schedule'), // {day, time, duration}
  timezone: varchar('timezone', { length: 50 }),
  
  // Session Details
  sessionType: varchar('session_type', { length: 50 }), // 'ai_camera', 'vr', 'hybrid'
  vrEnvironmentId: int('vr_environment_id'),
  protocolId: int('protocol_id'),
  
  // Progress
  totalSessions: int('total_sessions').default(0),
  nextSessionDate: timestamp('next_session_date'),
  
  // Pricing
  tier: varchar('tier', { length: 20 }), // 'community', 'fair', 'supporter'
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ------------------------------------------
// 9. GROUP MEMBERSHIPS
// ------------------------------------------

export const groupMemberships = mysqlTable('group_memberships', {
  id: int('id').primaryKey().autoincrement(),
  groupId: int('group_id').notNull(),
  userId: int('user_id').notNull(),
  
  role: varchar('role', { length: 20 }).default('member'), // 'member', 'facilitator'
  joinedAt: timestamp('joined_at').defaultNow(),
  
  // Participation
  sessionsAttended: int('sessions_attended').default(0),
  lastAttendance: timestamp('last_attendance'),
  
  // Status
  isActive: boolean('is_active').default(true),
}, (table) => ({
  groupIdIdx: index('group_id_idx').on(table.groupId),
  userIdIdx: index('user_id_idx').on(table.userId),
}));

// ------------------------------------------
// 10. MEDITATION BUDDIES
// ------------------------------------------

export const meditationBuddies = mysqlTable('meditation_buddies', {
  id: int('id').primaryKey().autoincrement(),
  user1Id: int('user1_id').notNull(),
  user2Id: int('user2_id').notNull(),
  
  status: varchar('status', { length: 20 }).default('active'), // 'active', 'paused', 'ended'
  
  // Matching
  matchedOn: json('matched_on'), // ['experience_level', 'goals', 'schedule']
  matchScore: decimal('match_score', { precision: 5, scale: 2 }),
  
  // Interaction
  lastInteraction: timestamp('last_interaction'),
  messageCount: int('message_count').default(0),
  sharedSessions: int('shared_sessions').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  user1IdIdx: index('user1_id_idx').on(table.user1Id),
  user2IdIdx: index('user2_id_idx').on(table.user2Id),
}));

// ------------------------------------------
// 11. MEDITATION CHALLENGES
// ------------------------------------------

export const meditationChallenges = mysqlTable('meditation_challenges', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  
  // Challenge Details
  challengeType: varchar('challenge_type', { length: 50 }), // 'consistency', 'depth', 'stillness', 'duration'
  goal: json('goal'), // {metric, target, timeframe}
  
  // Timing
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  duration: int('duration'), // days
  
  // Participation
  participantCount: int('participant_count').default(0),
  maxParticipants: int('max_participants'),
  
  // Rewards
  sevaTokenReward: int('seva_token_reward'),
  badgeId: int('badge_id'),
  otherRewards: json('other_rewards'),
  
  // Leaderboard
  hasLeaderboard: boolean('has_leaderboard').default(true),
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ------------------------------------------
// 12. CHALLENGE PARTICIPATIONS
// ------------------------------------------

export const challengeParticipations = mysqlTable('challenge_participations', {
  id: int('id').primaryKey().autoincrement(),
  challengeId: int('challenge_id').notNull(),
  userId: int('user_id').notNull(),
  
  // Progress
  currentProgress: decimal('current_progress', { precision: 5, scale: 2 }).default('0'), // percentage
  goalAchieved: boolean('goal_achieved').default(false),
  
  // Stats
  sessionsCompleted: int('sessions_completed').default(0),
  bestScore: decimal('best_score', { precision: 5, scale: 2 }),
  
  // Ranking
  rank: int('rank'),
  
  // Rewards
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  badgeEarned: boolean('badge_earned').default(false),
  
  joinedAt: timestamp('joined_at').defaultNow(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  challengeIdIdx: index('challenge_id_idx').on(table.challengeId),
  userIdIdx: index('user_id_idx').on(table.userId),
}));

// ------------------------------------------
// 13. AI INSIGHTS
// ------------------------------------------

export const aiInsights = mysqlTable('ai_insights', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  
  insightType: varchar('insight_type', { length: 50 }), // 'recommendation', 'pattern', 'achievement', 'alert'
  category: varchar('category', { length: 50 }), // 'posture', 'timing', 'technique', 'environment'
  
  // Content
  title: varchar('title', { length: 200 }),
  message: text('message'),
  actionable: boolean('actionable').default(false),
  actionText: varchar('action_text', { length: 200 }),
  
  // Data
  confidence: decimal('confidence', { precision: 5, scale: 2 }), // 0-100
  basedOnSessions: int('based_on_sessions'),
  dataPoints: json('data_points'),
  
  // User Interaction
  viewed: boolean('viewed').default(false),
  viewedAt: timestamp('viewed_at'),
  actionTaken: boolean('action_taken').default(false),
  
  // Metadata
  priority: varchar('priority', { length: 20 }).default('normal'), // 'low', 'normal', 'high'
  expiresAt: timestamp('expires_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  insightTypeIdx: index('insight_type_idx').on(table.insightType),
}));

// ------------------------------------------
// 14. EQUIPMENT INVENTORY
// ------------------------------------------

export const meditationEquipment = mysqlTable('meditation_equipment', {
  id: int('id').primaryKey().autoincrement(),
  locationId: int('location_id').notNull(),
  
  equipmentType: varchar('equipment_type', { length: 50 }).notNull(), // 'ai_camera', 'vr_headset', 'eeg_headband', 'heart_monitor'
  brand: varchar('brand', { length: 100 }),
  model: varchar('model', { length: 100 }),
  serialNumber: varchar('serial_number', { length: 100 }),
  
  // Status
  status: varchar('status', { length: 20 }).default('available'), // 'available', 'in_use', 'maintenance', 'retired'
  condition: varchar('condition', { length: 20 }), // 'excellent', 'good', 'fair', 'poor'
  
  // Maintenance
  lastMaintenance: timestamp('last_maintenance'),
  nextMaintenance: timestamp('next_maintenance'),
  maintenanceNotes: text('maintenance_notes'),
  
  // Usage
  totalUsageHours: int('total_usage_hours').default(0),
  currentUserId: int('current_user_id'),
  currentSessionId: int('current_session_id'),
  
  // Purchase
  purchaseDate: timestamp('purchase_date'),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }),
  warrantyExpiry: timestamp('warranty_expiry'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  locationIdIdx: index('location_id_idx').on(table.locationId),
  equipmentTypeIdx: index('equipment_type_idx').on(table.equipmentType),
  statusIdx: index('status_idx').on(table.status),
}));

// ------------------------------------------
// 15. AR MOBILE SESSIONS
// ------------------------------------------

export const arMobileSessions = mysqlTable('ar_mobile_sessions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  
  // Session Details
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: int('duration'), // seconds
  
  // AR Features Used
  timerUsed: boolean('timer_used').default(false),
  postureGuideUsed: boolean('posture_guide_used').default(false),
  environmentEnhancement: boolean('environment_enhancement').default(false),
  chakraVisualization: boolean('chakra_visualization').default(false),
  breathTraining: boolean('breath_training').default(false),
  
  // Environment
  arTheme: varchar('ar_theme', { length: 50 }),
  roomLighting: varchar('room_lighting', { length: 20 }), // 'bright', 'dim', 'dark'
  
  // Performance
  postureQuality: decimal('posture_quality', { precision: 5, scale: 2 }),
  stillness: decimal('stillness', { precision: 5, scale: 2 }),
  
  // Biometric (if phone supports)
  avgHeartRate: int('avg_heart_rate'),
  
  // User Feedback
  userRating: int('user_rating'), // 1-5
  
  // Seva Tokens
  sevaTokensEarned: int('seva_tokens_earned').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  startTimeIdx: index('start_time_idx').on(table.startTime),
}));
