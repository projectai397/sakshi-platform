CREATE TABLE `discount_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`discount_type` varchar(50) NOT NULL,
	`discount_value` decimal(10,2) NOT NULL,
	`min_purchase_amount` decimal(10,2),
	`max_discount_amount` decimal(10,2),
	`applicable_products` text,
	`applicable_categories` text,
	`usage_limit` int,
	`usage_limit_per_user` int DEFAULT 1,
	`current_usage_count` int DEFAULT 0,
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_by` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `discount_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `discount_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `discount_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`discount_code_id` int NOT NULL,
	`user_id` int,
	`order_id` int NOT NULL,
	`discount_amount` decimal(10,2) NOT NULL,
	`used_at` timestamp DEFAULT (now()),
	CONSTRAINT `discount_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `price_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`product_id` int NOT NULL,
	`product_type` varchar(50) NOT NULL,
	`target_price` decimal(10,2) NOT NULL,
	`current_price` decimal(10,2) NOT NULL,
	`is_active` boolean DEFAULT true,
	`notified_at` datetime,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `price_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`product_type` varchar(50) NOT NULL,
	`user_id` int NOT NULL,
	`order_id` int,
	`rating` int NOT NULL,
	`title` varchar(255),
	`comment` text,
	`images` text,
	`helpful_count` int DEFAULT 0,
	`not_helpful_count` int DEFAULT 0,
	`status` varchar(50) DEFAULT 'pending',
	`moderated_by` int,
	`moderated_at` datetime,
	`moderation_notes` text,
	`vendor_response` text,
	`vendor_responded_at` datetime,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `product_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`session_id` varchar(255),
	`product_id` int NOT NULL,
	`product_type` varchar(50) NOT NULL,
	`view_duration` int,
	`viewed_at` timestamp DEFAULT (now()),
	CONSTRAINT `product_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`review_id` int NOT NULL,
	`user_id` int NOT NULL,
	`is_helpful` boolean NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `review_votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stock_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`product_id` int NOT NULL,
	`product_type` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`is_active` boolean DEFAULT true,
	`notified_at` datetime,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `stock_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticket_number` varchar(50) NOT NULL,
	`user_id` int,
	`guest_name` varchar(255),
	`guest_email` varchar(255),
	`guest_phone` varchar(20),
	`category` varchar(100) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`priority` varchar(50) DEFAULT 'medium',
	`related_order_id` int,
	`related_product_id` int,
	`status` varchar(50) DEFAULT 'open',
	`assigned_to` int,
	`resolved_at` datetime,
	`resolved_by` int,
	`resolution_notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `support_tickets_ticket_number_unique` UNIQUE(`ticket_number`)
);
--> statement-breakpoint
CREATE TABLE `ticket_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticket_id` int NOT NULL,
	`user_id` int,
	`is_staff` boolean DEFAULT false,
	`message` text NOT NULL,
	`attachments` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ticket_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`favorite_categories` text,
	`price_range` varchar(50),
	`preferred_brands` text,
	`prefer_organic` boolean DEFAULT false,
	`prefer_local` boolean DEFAULT false,
	`prefer_handmade` boolean DEFAULT false,
	`prefer_eco_friendly` boolean DEFAULT false,
	`dosha` varchar(50),
	`dietary_restrictions` text,
	`allergies` text,
	`email_notifications` boolean DEFAULT true,
	`sms_notifications` boolean DEFAULT false,
	`push_notifications` boolean DEFAULT true,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_preferences_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendor_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`category_id` int,
	`tags` text,
	`price` decimal(10,2) NOT NULL,
	`compare_at_price` decimal(10,2),
	`cost_price` decimal(10,2),
	`sku` varchar(100) NOT NULL,
	`barcode` varchar(100),
	`stock_quantity` int DEFAULT 0,
	`low_stock_threshold` int DEFAULT 5,
	`weight` decimal(10,2),
	`dimensions` varchar(100),
	`images` text,
	`video_url` text,
	`is_organic` boolean DEFAULT false,
	`is_handmade` boolean DEFAULT false,
	`is_eco_friendly` boolean DEFAULT false,
	`status` varchar(50) DEFAULT 'draft',
	`is_published` boolean DEFAULT false,
	`published_at` datetime,
	`view_count` int DEFAULT 0,
	`sales_count` int DEFAULT 0,
	`rating` decimal(3,2) DEFAULT '0',
	`review_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `vendor_products_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendor_products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`business_name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`logo` text,
	`banner_image` text,
	`contact_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`business_type` varchar(100),
	`gst_number` varchar(50),
	`pan_number` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`pincode` varchar(10),
	`country` varchar(100) DEFAULT 'India',
	`bank_name` varchar(255),
	`account_number` varchar(50),
	`ifsc_code` varchar(20),
	`commission_rate` decimal(5,2) DEFAULT '10.00',
	`status` varchar(50) DEFAULT 'pending',
	`total_sales` decimal(12,2) DEFAULT '0',
	`total_orders` int DEFAULT 0,
	`rating` decimal(3,2) DEFAULT '0',
	`review_count` int DEFAULT 0,
	`is_verified` boolean DEFAULT false,
	`verified_at` datetime,
	`verified_by` int,
	`is_organic` boolean DEFAULT false,
	`is_local` boolean DEFAULT false,
	`is_fair_trade` boolean DEFAULT false,
	`is_women_owned` boolean DEFAULT false,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendors_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `wishlist_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wishlist_id` int NOT NULL,
	`product_id` int NOT NULL,
	`product_type` varchar(50) NOT NULL,
	`notes` text,
	`priority` int DEFAULT 0,
	`added_at` timestamp DEFAULT (now()),
	CONSTRAINT `wishlist_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(255) DEFAULT 'My Wishlist',
	`description` text,
	`is_public` boolean DEFAULT false,
	`is_default` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`)
);
