import { sql } from "drizzle-orm";
import { text, int, varchar, timestamp, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { patients } from "./patients"
import { type getVitals } from "@/lib/api/vitals/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const vitals = mysqlTable('vitals', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  loc: text("loc").notNull(),
  airwayStatus: text("airway_status").notNull(),
  breathingStatus: text("breathing_status").notNull(),
  pulseRateQuality: text("pulse_rate_quality").notNull(),
  breathingRate: int("breathing_rate").notNull(),
  pulseRate: int("pulse_rate").notNull(),
  patientId: varchar("patient_id", { length: 256 }).references(() => patients.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for vitals - used to validate API requests
const baseSchema = createSelectSchema(vitals).omit(timestamps)

export const insertVitalSchema = createInsertSchema(vitals).omit(timestamps);
export const insertVitalParams = baseSchema.extend({
  breathingRate: z.coerce.number(),
  pulseRate: z.coerce.number(),
  patientId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updateVitalSchema = baseSchema;
export const updateVitalParams = baseSchema.extend({
  breathingRate: z.coerce.number(),
  pulseRate: z.coerce.number(),
  patientId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const vitalIdSchema = baseSchema.pick({ id: true });

// Types for vitals - used to type API request params and within Components
export type Vital = typeof vitals.$inferSelect;
export type NewVital = z.infer<typeof insertVitalSchema>;
export type NewVitalParams = z.infer<typeof insertVitalParams>;
export type UpdateVitalParams = z.infer<typeof updateVitalParams>;
export type VitalId = z.infer<typeof vitalIdSchema>["id"];
    
// this type infers the return from getVitals() - meaning it will include any joins
export type CompleteVital = Awaited<ReturnType<typeof getVitals>>["vitals"][number];

