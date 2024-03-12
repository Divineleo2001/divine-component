import { z } from "zod";
import { mysqlTable, varchar, datetime } from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	email: varchar("email", {
		length: 255
	}).notNull(),
	hashedPassword: varchar("hashed_password", {
		length: 255
	}).notNull(),
	name: varchar("name", {
		length: 255
	})
});

export const sessions = mysqlTable("session", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 255
	})
		.notNull()
		.references(() => users.id),
	expiresAt: datetime("expires_at").notNull()
});

export const authenticationSchema = z.object({
  email: z.string().email().min(5).max(31),
  password: z
    .string()
    .min(4, { message: "must be at least 4 characters long" })
    .max(15, { message: "cannot be more than 15 characters long" }),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().min(4).optional(),
});

export type UsernameAndPassword = z.infer<typeof authenticationSchema>;
