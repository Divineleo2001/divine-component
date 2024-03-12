CREATE TABLE `comments` (
	`id` varchar(191) NOT NULL,
	`comment` text NOT NULL,
	`comment_id` int,
	`patient_id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`),
	CONSTRAINT `comment_comment_id_idx` UNIQUE(`comment_id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` varchar(191) NOT NULL,
	`name` text NOT NULL,
	`age` int NOT NULL,
	`gender` text NOT NULL,
	`patient_id` int NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `patient_patient_id_idx` UNIQUE(`patient_id`)
);
--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE cascade ON UPDATE no action;