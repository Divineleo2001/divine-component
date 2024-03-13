CREATE TABLE `comorbidities` (
	`id` varchar(191) NOT NULL,
	`name` text NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `comorbidities_id` PRIMARY KEY(`id`)
);
