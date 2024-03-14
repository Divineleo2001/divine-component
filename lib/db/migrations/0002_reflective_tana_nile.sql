CREATE TABLE `comorbidities` (
	`id` varchar(191) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `comorbidities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disabilities` (
	`id` varchar(191) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `disabilities_id` PRIMARY KEY(`id`)
);
