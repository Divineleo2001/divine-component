CREATE TABLE `comments` (
	`id` varchar(191) NOT NULL,
	`comment` text NOT NULL,
	`patient_id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `histories` (
	`id` varchar(191) NOT NULL,
	`history` text NOT NULL,
	`patient_id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `histories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patient_comorbidities` (
	`id` varchar(191) NOT NULL,
	`comorbidity_name` text NOT NULL,
	`patient_id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `patient_comorbidities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patient_disabilities` (
	`id` varchar(191) NOT NULL,
	`disability_name` text NOT NULL,
	`patient_id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `patient_disabilities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` varchar(191) NOT NULL,
	`name` text,
	`gender` text,
	`age` int,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `patients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vitals` (
	`id` varchar(191) NOT NULL,
	`loc` text NOT NULL,
	`airway_status` text NOT NULL,
	`breathing_status` text NOT NULL,
	`pulse_rate_quality` text NOT NULL,
	`breathing_rate` int NOT NULL,
	`pulse_rate` int NOT NULL,
	`patient_id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `vitals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `histories` ADD CONSTRAINT `histories_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient_comorbidities` ADD CONSTRAINT `patient_comorbidities_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patient_disabilities` ADD CONSTRAINT `patient_disabilities_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vitals` ADD CONSTRAINT `vitals_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE cascade ON UPDATE no action;