CREATE TABLE `ai_insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`insight_type` varchar(50),
	`category` varchar(50),
	`title` varchar(200),
	`message` text,
	`actionable` boolean DEFAULT false,
	`action_text` varchar(200),
	`confidence` decimal(5,2),
	`based_on_sessions` int,
	`data_points` json,
	`viewed` boolean DEFAULT false,
	`viewed_at` timestamp,
	`action_taken` boolean DEFAULT false,
	`priority` varchar(20) DEFAULT 'normal',
	`expires_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ai_insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ar_mobile_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`start_time` timestamp NOT NULL,
	`end_time` timestamp,
	`duration` int,
	`timer_used` boolean DEFAULT false,
	`posture_guide_used` boolean DEFAULT false,
	`environment_enhancement` boolean DEFAULT false,
	`chakra_visualization` boolean DEFAULT false,
	`breath_training` boolean DEFAULT false,
	`ar_theme` varchar(50),
	`room_lighting` varchar(20),
	`posture_quality` decimal(5,2),
	`stillness` decimal(5,2),
	`avg_heart_rate` int,
	`user_rating` int,
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ar_mobile_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `biometric_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`timestamp` timestamp NOT NULL,
	`heart_rate` int,
	`hrv` decimal(6,2),
	`breath_rate` decimal(4,2),
	`breath_depth` decimal(5,2),
	`beta` decimal(5,2),
	`alpha` decimal(5,2),
	`theta` decimal(5,2),
	`delta` decimal(5,2),
	`gamma` decimal(5,2),
	`gsr` decimal(6,2),
	`temperature` decimal(4,2),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `biometric_readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `challenge_participations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challenge_id` int NOT NULL,
	`user_id` int NOT NULL,
	`current_progress` decimal(5,2) DEFAULT '0',
	`goal_achieved` boolean DEFAULT false,
	`sessions_completed` int DEFAULT 0,
	`best_score` decimal(5,2),
	`rank` int,
	`seva_tokens_earned` int DEFAULT 0,
	`badge_earned` boolean DEFAULT false,
	`joined_at` timestamp DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `challenge_participations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group_memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`group_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` varchar(20) DEFAULT 'member',
	`joined_at` timestamp DEFAULT (now()),
	`sessions_attended` int DEFAULT 0,
	`last_attendance` timestamp,
	`is_active` boolean DEFAULT true,
	CONSTRAINT `group_memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guided_meditations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`instructor_name` varchar(100),
	`audio_url` varchar(500),
	`script_text` text,
	`language` varchar(20) DEFAULT 'en',
	`category` varchar(50),
	`tradition` varchar(50),
	`duration` int NOT NULL,
	`difficulty` varchar(20),
	`vr_environment_id` int,
	`has_visual_cues` boolean DEFAULT false,
	`tags` json,
	`popularity_score` int DEFAULT 0,
	`avg_rating` decimal(3,2),
	`tier` varchar(20),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guided_meditations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meditation_buddies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user1_id` int NOT NULL,
	`user2_id` int NOT NULL,
	`status` varchar(20) DEFAULT 'active',
	`matched_on` json,
	`match_score` decimal(5,2),
	`last_interaction` timestamp,
	`message_count` int DEFAULT 0,
	`shared_sessions` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meditation_buddies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meditation_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`challenge_type` varchar(50),
	`goal` json,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`duration` int,
	`participant_count` int DEFAULT 0,
	`max_participants` int,
	`seva_token_reward` int,
	`badge_id` int,
	`other_rewards` json,
	`has_leaderboard` boolean DEFAULT true,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meditation_challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meditation_equipment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location_id` int NOT NULL,
	`equipment_type` varchar(50) NOT NULL,
	`brand` varchar(100),
	`model` varchar(100),
	`serial_number` varchar(100),
	`status` varchar(20) DEFAULT 'available',
	`condition` varchar(20),
	`last_maintenance` timestamp,
	`next_maintenance` timestamp,
	`maintenance_notes` text,
	`total_usage_hours` int DEFAULT 0,
	`current_user_id` int,
	`current_session_id` int,
	`purchase_date` timestamp,
	`purchase_price` decimal(10,2),
	`warranty_expiry` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meditation_equipment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meditation_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`group_type` varchar(50),
	`facilitator_id` int,
	`max_members` int,
	`current_members` int DEFAULT 0,
	`schedule` json,
	`timezone` varchar(50),
	`session_type` varchar(50),
	`vr_environment_id` int,
	`protocol_id` int,
	`total_sessions` int DEFAULT 0,
	`next_session_date` timestamp,
	`tier` varchar(20),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meditation_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `neurofeedback_protocols` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`target_state` varchar(50),
	`reward_frequency` varchar(50),
	`inhibit_frequency` varchar(50),
	`reward_threshold` decimal(5,2),
	`inhibit_threshold` decimal(5,2),
	`audio_feedback_type` varchar(50),
	`visual_feedback_type` varchar(50),
	`haptic_feedback` boolean DEFAULT false,
	`recommended_duration` int,
	`minimum_sessions` int,
	`difficulty` varchar(20),
	`benefits` json,
	`contraindications` json,
	`research_backed` boolean DEFAULT false,
	`research_links` json,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `neurofeedback_protocols_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posture_corrections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`timestamp` timestamp NOT NULL,
	`correction_type` varchar(50) NOT NULL,
	`severity` varchar(20),
	`deviation_degrees` decimal(5,2),
	`correction_message` text,
	`user_responded` boolean DEFAULT false,
	`response_time` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `posture_corrections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_meditation_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total_sessions` int DEFAULT 0,
	`total_duration` int DEFAULT 0,
	`current_streak` int DEFAULT 0,
	`longest_streak` int DEFAULT 0,
	`last_session_date` timestamp,
	`posture_skill` decimal(5,2) DEFAULT '0',
	`stillness_skill` decimal(5,2) DEFAULT '0',
	`breath_skill` decimal(5,2) DEFAULT '0',
	`focus_skill` decimal(5,2) DEFAULT '0',
	`relaxation_skill` decimal(5,2) DEFAULT '0',
	`avg_meditation_depth` decimal(5,2),
	`avg_stillness` decimal(5,2),
	`avg_hrv_increase` decimal(5,2),
	`avg_alpha_percentage` decimal(5,2),
	`avg_theta_percentage` decimal(5,2),
	`best_depth_score` decimal(5,2),
	`best_stillness` decimal(5,2),
	`longest_session` int,
	`preferred_time` varchar(20),
	`optimal_duration` int,
	`favorite_environments` json,
	`effective_techniques` json,
	`current_goals` json,
	`achieved_goals` json,
	`badges` json,
	`milestones` json,
	`total_seva_tokens` int DEFAULT 0,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_meditation_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_meditation_progress_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `vr_environments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` varchar(50),
	`description` text,
	`thumbnail_url` varchar(500),
	`location` varchar(200),
	`ambience` varchar(100),
	`recommended_for` json,
	`has_time_of_day` boolean DEFAULT true,
	`has_weather` boolean DEFAULT false,
	`has_sound_control` boolean DEFAULT true,
	`has_interactive_elements` boolean DEFAULT false,
	`guided_meditation_count` int DEFAULT 0,
	`soundscape_count` int DEFAULT 0,
	`difficulty` varchar(20),
	`duration` int,
	`popularity_score` int DEFAULT 0,
	`tier` varchar(20),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vr_environments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `ai_insights` (`user_id`);--> statement-breakpoint
CREATE INDEX `insight_type_idx` ON `ai_insights` (`insight_type`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `ar_mobile_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `start_time_idx` ON `ar_mobile_sessions` (`start_time`);--> statement-breakpoint
CREATE INDEX `session_id_idx` ON `biometric_readings` (`session_id`);--> statement-breakpoint
CREATE INDEX `timestamp_idx` ON `biometric_readings` (`timestamp`);--> statement-breakpoint
CREATE INDEX `challenge_id_idx` ON `challenge_participations` (`challenge_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `challenge_participations` (`user_id`);--> statement-breakpoint
CREATE INDEX `group_id_idx` ON `group_memberships` (`group_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `group_memberships` (`user_id`);--> statement-breakpoint
CREATE INDEX `user1_id_idx` ON `meditation_buddies` (`user1_id`);--> statement-breakpoint
CREATE INDEX `user2_id_idx` ON `meditation_buddies` (`user2_id`);--> statement-breakpoint
CREATE INDEX `location_id_idx` ON `meditation_equipment` (`location_id`);--> statement-breakpoint
CREATE INDEX `equipment_type_idx` ON `meditation_equipment` (`equipment_type`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `meditation_equipment` (`status`);--> statement-breakpoint
CREATE INDEX `session_id_idx` ON `posture_corrections` (`session_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `user_meditation_progress` (`user_id`);