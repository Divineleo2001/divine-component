import { sql } from "drizzle-orm";
import { text, varchar, timestamp, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getDisabilities } from "@/lib/api/disabilities/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const disabilities = mysqlTable('disabilities', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for disabilities - used to validate API requests
const baseSchema = createSelectSchema(disabilities).omit(timestamps)

export const insertDisabilitySchema = createInsertSchema(disabilities).omit(timestamps);
export const insertDisabilityParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateDisabilitySchema = baseSchema;
export const updateDisabilityParams = baseSchema.extend({}).omit({ 
  userId: true
});
export const disabilityIdSchema = baseSchema.pick({ id: true });

// Types for disabilities - used to type API request params and within Components
export type Disability = typeof disabilities.$inferSelect;
export type NewDisability = z.infer<typeof insertDisabilitySchema>;
export type NewDisabilityParams = z.infer<typeof insertDisabilityParams>;
export type UpdateDisabilityParams = z.infer<typeof updateDisabilityParams>;
export type DisabilityId = z.infer<typeof disabilityIdSchema>["id"];
    
// this type infers the return from getDisabilities() - meaning it will include any joins
export type CompleteDisability = Awaited<ReturnType<typeof getDisabilities>>["disabilities"][number];

