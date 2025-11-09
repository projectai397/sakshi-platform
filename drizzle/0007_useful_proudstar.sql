CREATE TABLE `inventory_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`current_stock` decimal(10,2) NOT NULL DEFAULT '0',
	`min_stock` decimal(10,2) NOT NULL,
	`max_stock` decimal(10,2) NOT NULL,
	`cost_per_unit` decimal(10,2) NOT NULL,
	`supplier_id` int,
	`location` varchar(100),
	`expiry_tracking` boolean DEFAULT false,
	`is_organic` boolean DEFAULT false,
	`is_local` boolean DEFAULT false,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `inventory_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`leave_type` varchar(50) NOT NULL,
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`total_days` decimal(5,2) NOT NULL,
	`reason` text,
	`status` varchar(50) DEFAULT 'pending',
	`reviewed_by` int,
	`reviewed_at` datetime,
	`review_notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `leave_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `production_batches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`menu_item_id` int NOT NULL,
	`location_id` int NOT NULL,
	`batch_number` varchar(50) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`production_date` datetime NOT NULL,
	`expiry_date` datetime,
	`prepared_by` int,
	`status` varchar(50) DEFAULT 'in_progress',
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `production_batches_id` PRIMARY KEY(`id`),
	CONSTRAINT `production_batches_batch_number_unique` UNIQUE(`batch_number`)
);
--> statement-breakpoint
CREATE TABLE `purchase_order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchase_order_id` int NOT NULL,
	`item_id` int NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`unit_price` decimal(10,2) NOT NULL,
	`total_price` decimal(10,2) NOT NULL,
	`received_quantity` decimal(10,2) DEFAULT '0',
	`notes` text,
	CONSTRAINT `purchase_order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_number` varchar(50) NOT NULL,
	`supplier_id` int NOT NULL,
	`location_id` int NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`order_date` datetime NOT NULL,
	`expected_delivery` datetime,
	`actual_delivery` datetime,
	`subtotal` decimal(10,2) NOT NULL,
	`tax` decimal(10,2) DEFAULT '0',
	`shipping_cost` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`payment_status` varchar(50) DEFAULT 'pending',
	`payment_method` varchar(50),
	`notes` text,
	`created_by` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `purchase_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchase_orders_order_number_unique` UNIQUE(`order_number`)
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`menu_item_id` int NOT NULL,
	`inventory_item_id` int NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`cost` decimal(10,2),
	`notes` text,
	CONSTRAINT `recipe_ingredients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`employee_id` varchar(50) NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`role` varchar(100) NOT NULL,
	`department` varchar(100),
	`location_id` int NOT NULL,
	`hire_date` datetime NOT NULL,
	`termination_date` datetime,
	`employment_type` varchar(50) NOT NULL,
	`hourly_rate` decimal(10,2),
	`monthly_salary` decimal(10,2),
	`status` varchar(50) DEFAULT 'active',
	`emergency_contact` varchar(255),
	`emergency_phone` varchar(20),
	`address` text,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `staff_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_members_employee_id_unique` UNIQUE(`employee_id`)
);
--> statement-breakpoint
CREATE TABLE `staff_performance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`review_period` varchar(50) NOT NULL,
	`review_date` datetime NOT NULL,
	`reviewed_by` int NOT NULL,
	`punctuality` int,
	`quality` int,
	`teamwork` int,
	`customer_service` int,
	`overall_rating` decimal(3,2),
	`strengths` text,
	`areas_for_improvement` text,
	`goals` text,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `staff_performance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`location_id` int NOT NULL,
	`shift_date` datetime NOT NULL,
	`start_time` varchar(10) NOT NULL,
	`end_time` varchar(10) NOT NULL,
	`shift_type` varchar(50) NOT NULL,
	`role` varchar(100),
	`status` varchar(50) DEFAULT 'scheduled',
	`notes` text,
	`created_by` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `staff_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`item_id` int NOT NULL,
	`movement_type` varchar(50) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`cost_per_unit` decimal(10,2),
	`total_cost` decimal(10,2),
	`reason` varchar(255),
	`reference_type` varchar(50),
	`reference_id` int,
	`performed_by` int,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `stock_movements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`contact_person` varchar(255),
	`email` varchar(255),
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`pincode` varchar(10),
	`gst_number` varchar(50),
	`payment_terms` varchar(100),
	`is_organic` boolean DEFAULT false,
	`is_local` boolean DEFAULT false,
	`rating` int DEFAULT 0,
	`status` varchar(50) DEFAULT 'active',
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `time_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`schedule_id` int,
	`location_id` int NOT NULL,
	`clock_in` datetime NOT NULL,
	`clock_out` datetime,
	`break_duration` int DEFAULT 0,
	`total_hours` decimal(5,2),
	`overtime_hours` decimal(5,2) DEFAULT '0',
	`notes` text,
	`approved_by` int,
	`approved_at` datetime,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `time_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waste_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location_id` int NOT NULL,
	`item_id` int,
	`item_name` varchar(255) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`waste_type` varchar(50) NOT NULL,
	`reason` text,
	`estimated_cost` decimal(10,2),
	`logged_by` int,
	`logged_at` timestamp DEFAULT (now()),
	CONSTRAINT `waste_logs_id` PRIMARY KEY(`id`)
);
