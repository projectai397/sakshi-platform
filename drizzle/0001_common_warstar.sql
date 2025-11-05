CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cartId` int NOT NULL,
	`productId` int NOT NULL,
	`selectedPaymentMethod` enum('money','seva_tokens','free'),
	`selectedPrice` int,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`imageUrl` text,
	`parentId` int,
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`receiptNumber` varchar(50) NOT NULL,
	`donorName` varchar(255) NOT NULL,
	`donorEmail` varchar(320),
	`donorPhone` varchar(20),
	`donorAddress` text,
	`itemsDescription` text NOT NULL,
	`estimatedValue` int,
	`numberOfItems` int DEFAULT 0,
	`status` enum('submitted','scheduled','received','processed') DEFAULT 'submitted',
	`pickupDate` timestamp,
	`receivedDate` timestamp,
	`notes` text,
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `donations_id` PRIMARY KEY(`id`),
	CONSTRAINT `donations_receiptNumber_unique` UNIQUE(`receiptNumber`)
);
--> statement-breakpoint
CREATE TABLE `event_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`userId` int,
	`guestName` varchar(255),
	`guestEmail` varchar(320),
	`guestPhone` varchar(20),
	`status` enum('registered','attended','cancelled','no_show') DEFAULT 'registered',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('repair_cafe','swap_event','upcycle_workshop','community') NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`eventDate` timestamp NOT NULL,
	`startTime` varchar(10) NOT NULL,
	`endTime` varchar(10) NOT NULL,
	`location` varchar(255),
	`address` text,
	`maxParticipants` int,
	`currentParticipants` int DEFAULT 0,
	`imageUrl` text,
	`isActive` boolean DEFAULT true,
	`requiresRegistration` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `impact_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricDate` timestamp NOT NULL,
	`itemsDiverted` int DEFAULT 0,
	`co2Prevented` int DEFAULT 0,
	`waterSaved` int DEFAULT 0,
	`familiesServed` int DEFAULT 0,
	`freeItemsGiven` int DEFAULT 0,
	`childrenItemsFree` int DEFAULT 0,
	`revenueGenerated` int DEFAULT 0,
	`tokensCirculated` int DEFAULT 0,
	`volunteerHours` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `impact_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`paymentMethod` enum('money','seva_tokens','free') NOT NULL,
	`pricePaid` int DEFAULT 0,
	`tokensPaid` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`userId` int,
	`customerName` varchar(255),
	`customerEmail` varchar(320),
	`customerPhone` varchar(20),
	`totalAmount` int DEFAULT 0,
	`tokensUsed` int DEFAULT 0,
	`paymentMethod` enum('money','seva_tokens','free','mixed') NOT NULL,
	`paymentStatus` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`fulfillmentStatus` enum('pending','processing','ready','completed','cancelled') DEFAULT 'pending',
	`fulfillmentType` enum('pickup','delivery') DEFAULT 'pickup',
	`deliveryAddress` text,
	`deliveryCity` varchar(100),
	`deliveryState` varchar(100),
	`deliveryPostalCode` varchar(20),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`story` text,
	`categoryId` int,
	`condition` enum('excellent','good','fair','worn') NOT NULL,
	`suggestedPrice` int NOT NULL,
	`minimumPrice` int NOT NULL,
	`maximumPrice` int NOT NULL,
	`sevaTokenPrice` int NOT NULL,
	`brand` varchar(100),
	`size` varchar(50),
	`color` varchar(50),
	`material` varchar(100),
	`sku` varchar(100) NOT NULL,
	`barcode` varchar(100),
	`quantity` int NOT NULL DEFAULT 1,
	`status` enum('available','sold','reserved','donated_out') NOT NULL DEFAULT 'available',
	`source` enum('donation','consignment','estate') NOT NULL,
	`donorName` varchar(255),
	`donationDate` timestamp,
	`imageUrls` text,
	`isChildrenFree` boolean DEFAULT false,
	`isFeatured` boolean DEFAULT false,
	`viewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `seva_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`walletId` int NOT NULL,
	`type` enum('earn','spend','expire','adjustment') NOT NULL,
	`amount` int NOT NULL,
	`description` text NOT NULL,
	`relatedEntityType` varchar(50),
	`relatedEntityId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seva_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seva_wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`lifetimeEarned` int NOT NULL DEFAULT 0,
	`lifetimeSpent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seva_wallets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `volunteer_shifts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`shiftType` varchar(100) NOT NULL,
	`shiftDate` timestamp NOT NULL,
	`startTime` varchar(10) NOT NULL,
	`endTime` varchar(10) NOT NULL,
	`hoursWorked` int NOT NULL,
	`tokensEarned` int NOT NULL,
	`status` enum('scheduled','completed','cancelled','no_show') DEFAULT 'scheduled',
	`notes` text,
	`verifiedBy` int,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `volunteer_shifts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','volunteer','staff','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `languagePreference` varchar(10) DEFAULT 'en';