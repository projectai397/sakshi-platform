CREATE TABLE `sakshi_cafe_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`order_type` enum('dine-in','delivery','pickup','catering'),
	`cafe_location_id` int,
	`delivery_address` text,
	`delivery_latitude` decimal(10,8),
	`delivery_longitude` decimal(11,8),
	`scheduled_time` timestamp,
	`items` json,
	`subtotal` decimal(10,2),
	`delivery_fee` decimal(10,2),
	`total` decimal(10,2),
	`payment_method` varchar(50),
	`payment_status` enum('pending','completed','failed','refunded'),
	`order_status` enum('pending','confirmed','preparing','ready','delivered','cancelled'),
	`special_instructions` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sakshi_cafe_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sakshi_menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(50),
	`image_url` varchar(500),
	`preparation_time` int,
	`serving_size` varchar(50),
	`calories` int,
	`protein_g` decimal(5,2),
	`carbs_g` decimal(5,2),
	`fat_g` decimal(5,2),
	`fiber_g` decimal(5,2),
	`ayurvedic_properties` json,
	`allergens` json,
	`community_price` decimal(10,2),
	`fair_price` decimal(10,2),
	`supporter_price` decimal(10,2),
	`is_available` boolean DEFAULT true,
	`recipe_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sakshi_menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `menu_items`;--> statement-breakpoint
CREATE INDEX `sakshi_cafe_orders_user_idx` ON `sakshi_cafe_orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `sakshi_cafe_orders_status_idx` ON `sakshi_cafe_orders` (`order_status`);--> statement-breakpoint
CREATE INDEX `sakshi_cafe_orders_type_idx` ON `sakshi_cafe_orders` (`order_type`);--> statement-breakpoint
CREATE INDEX `sakshi_menu_items_category_idx` ON `sakshi_menu_items` (`category`);--> statement-breakpoint
CREATE INDEX `sakshi_menu_items_available_idx` ON `sakshi_menu_items` (`is_available`);