import { sql } from "drizzle-orm";
import { text, varchar, timestamp, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getComorbidities } from "@/lib/api/comorbidities/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const comorbidities = mysqlTable('comorbidities', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for comorbidities - used to validate API requests
const baseSchema = createSelectSchema(comorbidities).omit(timestamps)

export const insertComorbiditySchema = createInsertSchema(comorbidities).omit(timestamps);
export const insertComorbidityParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateComorbiditySchema = baseSchema;
export const updateComorbidityParams = baseSchema.extend({}).omit({ 
  userId: true
});
export const comorbidityIdSchema = baseSchema.pick({ id: true });

// Types for comorbidities - used to type API request params and within Components
export type Comorbidity = typeof comorbidities.$inferSelect;
export type NewComorbidity = z.infer<typeof insertComorbiditySchema>;
export type NewComorbidityParams = z.infer<typeof insertComorbidityParams>;
export type UpdateComorbidityParams = z.infer<typeof updateComorbidityParams>;
export type ComorbidityId = z.infer<typeof comorbidityIdSchema>["id"];
    
// this type infers the return from getComorbidities() - meaning it will include any joins
export type CompleteComorbidity = Awaited<ReturnType<typeof getComorbidities>>["comorbidities"][number];

