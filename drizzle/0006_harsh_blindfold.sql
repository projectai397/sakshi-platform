CREATE TABLE `repair_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`event_date` datetime NOT NULL,
	`start_time` varchar(10) NOT NULL,
	`end_time` varchar(10) NOT NULL,
	`location` varchar(255) NOT NULL,
	`max_capacity` int NOT NULL DEFAULT 20,
	`current_registrations` int NOT NULL DEFAULT 0,
	`skills` json,
	`volunteers_needed` int NOT NULL DEFAULT 5,
	`volunteers_registered` int NOT NULL DEFAULT 0,
	`status` varchar(50) NOT NULL DEFAULT 'upcoming',
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `repair_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repair_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`item_name` varchar(255) NOT NULL,
	`item_category` varchar(100) NOT NULL,
	`item_description` text NOT NULL,
	`repair_needed` text NOT NULL,
	`image_urls` json,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`matched_volunteer_id` int,
	`event_id` int,
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `repair_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repair_volunteers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`event_id` int NOT NULL,
	`skills` json NOT NULL,
	`experience` text,
	`tools_bringing` text,
	`status` varchar(50) NOT NULL DEFAULT 'registered',
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `repair_volunteers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swap_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`event_date` datetime NOT NULL,
	`start_time` varchar(10) NOT NULL,
	`end_time` varchar(10) NOT NULL,
	`location` varchar(255) NOT NULL,
	`categories` json,
	`max_participants` int NOT NULL DEFAULT 50,
	`current_participants` int NOT NULL DEFAULT 0,
	`rules` text,
	`status` varchar(50) NOT NULL DEFAULT 'upcoming',
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `swap_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swap_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`condition` varchar(50) NOT NULL,
	`image_urls` json,
	`estimated_value` decimal(10,2),
	`looking_for` text,
	`status` varchar(50) NOT NULL DEFAULT 'available',
	`swapped_with_user_id` int,
	`swapped_item_id` int,
	`event_id` int,
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `swap_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swap_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`event_id` int NOT NULL,
	`items_count` int NOT NULL DEFAULT 0,
	`status` varchar(50) NOT NULL DEFAULT 'registered',
	`checked_in` boolean NOT NULL DEFAULT false,
	`swaps_completed` int NOT NULL DEFAULT 0,
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `swap_registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `upcycle_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`difficulty` varchar(50) NOT NULL,
	`time_required` varchar(100),
	`materials_needed` json NOT NULL,
	`tools_needed` json,
	`instructions` json NOT NULL,
	`before_image_url` varchar(500),
	`after_image_url` varchar(500),
	`category` varchar(100) NOT NULL,
	`tags` json,
	`is_approved` boolean NOT NULL DEFAULT false,
	`views` int NOT NULL DEFAULT 0,
	`likes` int NOT NULL DEFAULT 0,
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `upcycle_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `upcycle_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`project_id` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`before_image_url` varchar(500),
	`after_image_url` varchar(500),
	`materials_used` json,
	`time_taken` varchar(100),
	`tips` text,
	`is_public` boolean NOT NULL DEFAULT true,
	`likes` int NOT NULL DEFAULT 0,
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `upcycle_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `upcycle_workshops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`instructor_id` int NOT NULL,
	`project_id` int,
	`workshop_date` datetime NOT NULL,
	`duration` int NOT NULL,
	`location` varchar(255) NOT NULL,
	`is_virtual` boolean NOT NULL DEFAULT false,
	`meeting_link` varchar(500),
	`max_participants` int NOT NULL DEFAULT 15,
	`current_participants` int NOT NULL DEFAULT 0,
	`materials_provided` json,
	`materials_fee` decimal(10,2) DEFAULT '0.00',
	`pricing_tier` varchar(50) NOT NULL DEFAULT 'fair',
	`community_price` decimal(10,2) NOT NULL,
	`fair_price` decimal(10,2) NOT NULL,
	`supporter_price` decimal(10,2) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'upcoming',
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `upcycle_workshops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workshop_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`workshop_id` int NOT NULL,
	`price_tier` varchar(50) NOT NULL,
	`amount_paid` decimal(10,2) NOT NULL,
	`payment_status` varchar(50) NOT NULL DEFAULT 'pending',
	`payment_id` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'registered',
	`attended` boolean NOT NULL DEFAULT false,
	`seva_tokens_earned` int DEFAULT 0,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `workshop_registrations_id` PRIMARY KEY(`id`)
);
