CREATE TABLE `attendance_streaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`current_streak` int DEFAULT 0,
	`longest_streak` int DEFAULT 0,
	`last_visit_date` date,
	`total_visits` int DEFAULT 0,
	`streak_bonus_earned` int DEFAULT 0,
	`milestones` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `attendance_streaks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `compost_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location_id` int NOT NULL,
	`date` date NOT NULL,
	`weight_kg` decimal(10,2) NOT NULL,
	`compost_method` varchar(100),
	`maturity_date` date,
	`used_for` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `compost_tracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customer_dosha_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`primary_dosha` varchar(50) NOT NULL,
	`secondary_dosha` varchar(50),
	`constitution` varchar(100),
	`current_imbalances` json,
	`dietary_restrictions` json,
	`allergies` json,
	`health_goals` json,
	`digestive_fire` varchar(50),
	`assessment_date` date,
	`reassessment_due` date,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `customer_dosha_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `customer_dosha_profiles_customer_id_unique` UNIQUE(`customer_id`)
);
--> statement-breakpoint
CREATE TABLE `customer_impact_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`overall_impact_score` int DEFAULT 0,
	`environmental_score` int DEFAULT 0,
	`social_score` int DEFAULT 0,
	`health_score` int DEFAULT 0,
	`community_score` int DEFAULT 0,
	`meals_sponsored_count` int DEFAULT 0,
	`farmers_supported_count` int DEFAULT 0,
	`volunteer_hours` decimal(10,2) DEFAULT 0,
	`skills_shared` int DEFAULT 0,
	`items_repaired_swapped` int DEFAULT 0,
	`tree_equivalent` int DEFAULT 0,
	`last_calculated` timestamp DEFAULT (now()),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `customer_impact_scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `customer_impact_scores_customer_id_unique` UNIQUE(`customer_id`)
);
--> statement-breakpoint
CREATE TABLE `customer_portion_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`menu_item_id` int NOT NULL,
	`customer_id` int,
	`portion_size` varchar(50) NOT NULL,
	`waste_estimate` varchar(50),
	`comments` text,
	`photo` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `customer_portion_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dosha_check_ins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`check_in_date` date NOT NULL,
	`current_feeling` varchar(100),
	`sleep_quality` varchar(50),
	`digestion_quality` varchar(50),
	`energy_level` int,
	`stress_level` int,
	`weather_condition` varchar(100),
	`seasonal_influence` varchar(100),
	`recommended_dosha_focus` varchar(50),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `dosha_check_ins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `farmer_tips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`farmer_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`message` text,
	`order_id` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `farmer_tips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `farmers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`farm_name` varchar(255),
	`location` varchar(255) NOT NULL,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`photo` varchar(500),
	`story` text,
	`certifications` json,
	`contact_phone` varchar(20),
	`contact_email` varchar(255),
	`farm_size` varchar(100),
	`farming_method` varchar(100),
	`years_of_experience` int,
	`specialties` json,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `farmers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `food_donations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location_id` int NOT NULL,
	`date` date NOT NULL,
	`recipient_organization` varchar(255) NOT NULL,
	`items_description` text NOT NULL,
	`estimated_meals` int,
	`estimated_value` decimal(10,2),
	`pickup_time` timestamp,
	`delivered_by` varchar(255),
	`recipient_contact` varchar(100),
	`photo` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `food_donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gratitude_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`note_text` text NOT NULL,
	`is_public` boolean DEFAULT false,
	`category` varchar(100),
	`related_order_id` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `gratitude_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `impact_comparisons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`comparison_type` varchar(100) NOT NULL,
	`comparison_value` decimal(10,2) NOT NULL,
	`comparison_text` varchar(500) NOT NULL,
	`calculation_date` date NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `impact_comparisons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `impact_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`milestone_type` varchar(100) NOT NULL,
	`milestone_value` int NOT NULL,
	`achieved_date` date NOT NULL,
	`reward` varchar(255),
	`shareable_graphic` varchar(500),
	`is_shared` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `impact_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ingredient_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ingredient_name` varchar(255) NOT NULL,
	`farmer_id` int NOT NULL,
	`harvest_date` date,
	`delivery_date` date,
	`quantity` decimal(10,2),
	`unit` varchar(50),
	`price_per_unit` decimal(10,2),
	`market_price_per_unit` decimal(10,2),
	`fair_price_premium` decimal(5,2),
	`quality_grade` varchar(50),
	`is_organic` boolean DEFAULT false,
	`is_seasonal` boolean DEFAULT true,
	`batch_number` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ingredient_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meal_dosha_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`post_meal_feeling` varchar(100),
	`digestion_experience` varchar(100),
	`satisfaction_level` int,
	`would_order_again` boolean,
	`dosha_balance` varchar(100),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `meal_dosha_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meal_sponsorships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sponsor_user_id` int NOT NULL,
	`meal_count` int NOT NULL,
	`amount_paid` decimal(10,2) NOT NULL,
	`meals_redeemed` int DEFAULT 0,
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`message` text,
	`is_anonymous` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`expires_at` timestamp,
	CONSTRAINT `meal_sponsorships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_item_ingredients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`menu_item_id` int NOT NULL,
	`ingredient_source_id` int NOT NULL,
	`quantity_used` decimal(10,2),
	`unit` varchar(50),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `menu_item_ingredients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mindful_eating_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`order_id` int,
	`session_date` timestamp NOT NULL,
	`meal_duration` int,
	`meditation_completed` boolean DEFAULT false,
	`meditation_duration` int,
	`gratitude_journal_entry` text,
	`mindfulness_score` int,
	`distractions_count` int,
	`chewing_pace` varchar(50),
	`plate_clean_photo` varchar(500),
	`waste_amount` varchar(50),
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `mindful_eating_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nutrition_passports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`total_meals_eaten` int DEFAULT 0,
	`total_plant_based_meals` int DEFAULT 0,
	`cumulative_calories` decimal(12,2) DEFAULT 0,
	`cumulative_protein` decimal(10,2) DEFAULT 0,
	`cumulative_fiber` decimal(10,2) DEFAULT 0,
	`cumulative_vitamins` json,
	`cumulative_minerals` json,
	`carbon_footprint_saved` decimal(10,2) DEFAULT 0,
	`water_saved` decimal(12,2) DEFAULT 0,
	`animal_lives_spared` decimal(10,2) DEFAULT 0,
	`milestones` json,
	`health_biomarkers` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `nutrition_passports_id` PRIMARY KEY(`id`),
	CONSTRAINT `nutrition_passports_customer_id_unique` UNIQUE(`customer_id`)
);
--> statement-breakpoint
CREATE TABLE `regenerative_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`action_type` varchar(100) NOT NULL,
	`action_date` timestamp NOT NULL,
	`seva_tokens_earned` int NOT NULL,
	`carbon_saved_kg` decimal(10,2),
	`related_order_id` int,
	`related_event_id` int,
	`verification_photo` varchar(500),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `regenerative_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsored_meal_redemptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sponsorship_id` int NOT NULL,
	`recipient_user_id` int,
	`order_id` int NOT NULL,
	`amount_covered` decimal(10,2) NOT NULL,
	`gratitude_note` text,
	`redeemed_at` timestamp DEFAULT (now()),
	CONSTRAINT `sponsored_meal_redemptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsorship_impact_board` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location_id` int NOT NULL,
	`date` date NOT NULL,
	`total_meals_sponsored` int DEFAULT 0,
	`total_meals_redeemed` int DEFAULT 0,
	`total_amount_sponsored` decimal(10,2) DEFAULT 0,
	`top_sponsor_message` text,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `sponsorship_impact_board_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waste_reduction_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location_id` int NOT NULL,
	`challenge_name` varchar(255) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`target_waste_percentage` decimal(5,2),
	`actual_waste_percentage` decimal(5,2),
	`team_leader_id` int,
	`participants` json,
	`reward` varchar(255),
	`status` varchar(50) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `waste_reduction_challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waste_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location_id` int NOT NULL,
	`date` date NOT NULL,
	`waste_category` varchar(100) NOT NULL,
	`item_name` varchar(255),
	`quantity` decimal(10,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`estimated_cost` decimal(10,2),
	`reason` text,
	`preventable` boolean DEFAULT true,
	`staff_member_id` int,
	`photo` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `waste_tracking_id` PRIMARY KEY(`id`)
);
